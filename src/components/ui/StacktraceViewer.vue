<template>
  <div class="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
    <div class="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200">
      <span class="text-xs font-medium text-gray-700">Стектрейс</span>
      <button
          v-if="canCollapse"
          @click="isCollapsed = !isCollapsed"
          class="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        {{ isCollapsed ? 'Открыть' : 'Скрыть' }}
      </button>
    </div>

    <div v-if="!isCollapsed" class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
      <div
          v-for="(frame, index) in stacktrace"
          :key="index"
          class="hover:bg-gray-50 transition-colors duration-100"
      >
        <div
            class="px-4 py-3 cursor-pointer flex items-start"
            @click="toggleExpandFrame(index)"
        >
          <span class="text-xs font-mono text-gray-500 w-8 flex-shrink-0">#{{ index }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 mb-1">
              <span v-if="frame.class">{{ frame.class }}{{ frame.type }}</span>
              {{ frame.function || '(anonymous function)' }}
            </div>
            <div class="text-xs text-gray-500 font-mono truncate">
              {{ frame.file }}:{{ frame.line }}
            </div>
          </div>
          <Icon
              :icon="expandedFrames.includes(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="h-4 w-4 text-gray-400 ml-2 flex-shrink-0"
          />
        </div>

        <div
            v-if="expandedFrames.includes(index)"
            class="px-4 pb-3 ml-8"
        >
          <div
              v-for="(line, i) in getCodeLines(frame)"
              :key="i"
              class="px-3 py-1 text-sm font-mono flex hover:bg-gray-50"
              :class="{
                'bg-blue-50': line.lineNumber === frame.line,
                'text-gray-500': line.lineNumber !== frame.line
              }"
          >
            <span class="text-gray-400 w-10 flex-shrink-0 text-right pr-2">{{ line.lineNumber }}</span>
            <span
                class="flex-1 whitespace-pre"
                :class="{
                  'text-blue-600 font-medium': line.lineNumber === frame.line
                }"
                :style="{ 'padding-left': `${line.indentLevel * 1.5}rem` }"
            >{{ line.code || '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Icon} from '@iconify/vue';

interface CodeSnippet {
  preContext?: string[];
  contextLine?: string;
  postContext?: string[];
}

interface StackFrame {
  file: string;
  line: number;
  function: string;
  class?: string | null;
  type?: string | null;
  codeSnippet?: CodeSnippet | null;
}

const props = defineProps<{
  stacktrace: StackFrame[];
  canCollapse?: boolean;
}>();

const isCollapsed = ref(false);
const expandedFrames = ref<number[]>([]);

function shouldIndentLine(code: string | null | undefined): boolean {
  if (!code) return false;

  const trimmed = code.trim();
  if (!trimmed) return false;

  return trimmed.endsWith('{') ||
      trimmed.startsWith('}') ||
      trimmed.startsWith('try') ||
      trimmed.startsWith('catch') ||
      trimmed.startsWith('finally');
}

function getCodeLines(frame: StackFrame) {
  if (!frame?.codeSnippet) return [];

  const lines: { lineNumber: number; code: string; indentLevel: number }[] = [];
  let current = frame.line - (frame.codeSnippet.preContext?.length ?? 0);
  let indentStack: number[] = [];
  let currentIndent = 0;

  const processLine = (line: string | null) => {
    let safeLine = line || '';

    safeLine = safeLine.replace(/: :/g, '::');

    const trimmed = safeLine.trim();

    if (trimmed.startsWith('}') && indentStack.length > 0) {
      currentIndent = indentStack.pop() || 0;
    }

    lines.push({
      lineNumber: current++,
      code: safeLine,
      indentLevel: currentIndent
    });

    if (trimmed.endsWith('{')) {
      indentStack.push(currentIndent);
      currentIndent++;
    }
  };

  frame.codeSnippet.preContext?.forEach(processLine);

  if (frame.codeSnippet.contextLine) {
    processLine(frame.codeSnippet.contextLine);
  }

  frame.codeSnippet.postContext?.forEach(processLine);

  return lines;
}

const toggleExpandFrame = (index: number) => {
  const idx = expandedFrames.value.indexOf(index);
  if (idx > -1) {
    expandedFrames.value.splice(idx, 1);
  } else {
    expandedFrames.value.push(index);
  }
};

if (props.stacktrace.length > 0) {
  expandedFrames.value.push(0);
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>