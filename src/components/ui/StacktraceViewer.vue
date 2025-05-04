<template>
  <div class="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
    <div class="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200">
      <span class="text-xs font-medium text-gray-700">Stack Trace</span>
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
          v-for="(frame, index) in parsedFrames"
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
          <div v-if="frame.code_snippet" class="bg-white rounded-md border border-gray-200 overflow-hidden">
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
              >{{ line.code }}</span>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400 italic">
            No source code available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {Icon} from '@iconify/vue';

const props = defineProps({
  stacktrace: {
    type: [String, Object],
    required: true
  },
  canCollapse: {
    type: Boolean,
    default: true
  }
});

const isCollapsed = ref(false);
const expandedFrames = ref<number[]>([]);

const parsedFrames = computed(() => {
  if (typeof props.stacktrace === 'object') {
    return props.stacktrace.frames || [];
  }

  const frames = [];
  const lines = props.stacktrace.split('\n').filter(line => line.trim()).map(line => line.trim());

  const frameRegex = /^(#\d+\s+)?(.*?)\((\d+)\):\s+(.*?)(->|::)(.*)$/;

  lines.forEach(line => {
    const match = line.match(frameRegex);
    if (match) {
      frames.push({
        file: match[2].trim(),
        line: parseInt(match[3]),
        function: match[4].trim(),
      });
    }
  });

  return frames;
});

const toggleExpandFrame = (index: number) => {
  const idx = expandedFrames.value.indexOf(index);
  if (idx > -1) {
    expandedFrames.value.splice(idx, 1);
  } else {
    expandedFrames.value.push(index);
  }
};

function getCodeLines(frame: any) {
  if (!frame.code_snippet) return [];

  const lines: { lineNumber: number; code: string }[] = [];
  let current = frame.line -
      (frame.code_snippet.pre_context?.length ?? 0);

  frame.code_snippet.pre_context?.forEach((line: string) => {
    lines.push({ lineNumber: current++, code: line });
  });

  if (frame.code_snippet.context_line) {
    lines.push({ lineNumber: current++, code: frame.code_snippet.context_line });
  }

  frame.code_snippet.post_context?.forEach((line: string) => {
    lines.push({ lineNumber: current++, code: line });
  });

  return lines;
}

if (parsedFrames.value.length > 0) {
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