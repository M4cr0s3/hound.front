<template>
  <div class="stacktrace-container">
    <div v-for="(frame, index) in frames" :key="index" class="stack-frame"
         :class="{ 'active': isApplicationFile(frame.file) }">
      <div class="frame-header" @click="toggleFrame(index)">
        <span class="frame-number">#{{ index }}</span>
        <span class="frame-file">{{ formatFilePath(frame.file) }}</span>
        <span class="frame-line">:{{ frame.line }}</span>
        <span v-if="frame.class" class="frame-context">
          {{ frame.class }}{{ frame.type }}{{ frame.function }}
        </span>
        <span class="toggle-icon">
          {{ expandedFrames.includes(index) ? '−' : '+' }}
        </span>
      </div>

      <div v-if="expandedFrames.includes(index)" class="frame-details">
        <div class="code-preview" v-if="frame.file && frame.line">
          <pre v-if="frame.loading">Loading code...</pre>
          <pre v-else-if="frame.error" class="error">{{ frame.error }}</pre>
          <pre v-else-if="frame.code" v-highlightjs><code class="php">{{ frame.code }}</code></pre>
          <pre v-else>No code available</pre>
        </div>
        <div class="frame-actions">
          <button @click="copyPath(frame)">Copy path</button>
          <button v-if="frame.file" @click="openInIde(frame)">Open in IDE</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

export default {
  props: {
    stacktrace: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isApplicationFile = (path) => {
      return path && !path.includes('vendor') && !path.includes('node_modules');
    };

    const formatFilePath = (path) => {
      if (!path) return '';
      return path.replace(/^.*?[\\/](app|resources|config|routes)/, '$1');
    };

    const getRelativePath = (fullPath) => {
      const projectRoot = window.location.origin.includes('localhost')
          ? 'C:\\Users\\koker\\projects\\hound\\'
          : '/var/www/html/';
      return fullPath.replace(projectRoot, '').replace(/\\/g, '/');
    };

    const formatCode = (content, highlightLine) => {
      const lines = content.split('\n');
      const startLine = Math.max(0, highlightLine - 5);
      const endLine = Math.min(lines.length, highlightLine + 5);
      return lines.slice(startLine, endLine)
          .map((line, idx) => {
            const currentLine = startLine + idx + 1;
            const prefix = currentLine === highlightLine ? '> ' : '  ';
            return `${prefix}${currentLine}: ${line}`;
          })
          .join('\n');
    };

    const expandedFrames = ref([]);
    const frames = reactive([]);

    const loadCodeForFrame = async (frame) => {
      if (!frame.file || !frame.line || frame.code || frame.loading) return;

      frame.loading = true;
      frame.error = null;

      try {
        const relPath = getRelativePath(frame.file);
        const { data } = await axios.get('/api/source-code', {
          params: { path: relPath },
        });
        frame.code = formatCode(data.content, frame.line);
      } catch (error) {
        frame.error = `Error loading source: ${error.message}`;
        console.error('Failed to load source code:', error);
      } finally {
        frame.loading = false;
      }
    };

    const toggleFrame = (index) => {
      const idx = expandedFrames.value.indexOf(index);
      if (idx >= 0) {
        expandedFrames.value.splice(idx, 1);
      } else {
        expandedFrames.value.push(index);
        loadCodeForFrame(frames[index]);
      }
    };

    const copyPath = (frame) => {
      if (frame.file && frame.line) {
        const text = `${frame.file}:${frame.line}`;
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
      }
    };

    const openInIde = (frame) => {
      if (frame.file && frame.line) {
        const url = `phpstorm://open?file=${encodeURIComponent(frame.file)}&line=${frame.line}`;
        window.open(url, '_blank');
      }
    };

    const parseFrames = () => {
      if (!props.stacktrace) return [];

      const frameRegex = /^(#\d+\s+)?(.*?)\((\d+)\):\s+(.*?)(->|::)(.*)$/;
      return props.stacktrace.split('\\n').map(line => {
        const match = line.match(frameRegex);
        if (match) {
          return reactive({
            file: match[2],
            line: parseInt(match[3]),
            class: match[4],
            type: match[5],
            function: match[6],
            loading: false,
            error: null,
            code: null
          });
        }

        if (line.trim() === '{main}') {
          return reactive({
            file: 'Internal',
            line: 0,
            class: '',
            type: '',
            function: 'main',
            loading: false,
            error: null,
            code: null
          });
        }

        return reactive({
          raw: line,
          loading: false,
          error: null,
          code: null
        });
      }).filter(Boolean).slice(0, props.stacktrace.split('\\n').length - 1);
    };

    onMounted(() => {
      frames.push(...parseFrames());
      frames.forEach((frame, index) => {
        if (isApplicationFile(frame.file)) {
          expandedFrames.value.push(index);
          loadCodeForFrame(frame);
        }
      });
    });

    return {
      expandedFrames,
      frames,
      isApplicationFile,
      formatFilePath,
      toggleFrame,
      copyPath,
      openInIde,
    };
  }
};
</script>

<style scoped>
.stacktrace-container {
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
}

.stack-frame {
  border-bottom: 1px solid #e1e4e8;
}

.stack-frame:last-child {
  border-bottom: none;
}

.stack-frame.active {
  background-color: #f6f8fa;
}

.frame-header {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.frame-header:hover {
  background-color: #f0f3f6;
}

.frame-number {
  color: #6a737d;
  margin-right: 8px;
  font-weight: bold;
}

.frame-file {
  color: #24292e;
  font-weight: 500;
}

.frame-line {
  color: #6a737d;
}

.frame-context {
  color: #6f42c1;
  margin-left: 8px;
}

.toggle-icon {
  margin-left: auto;
  font-weight: bold;
  color: #6a737d;
}

.frame-details {
  padding: 8px 12px;
  background-color: #fafbfc;
  border-top: 1px solid #e1e4e8;
}

.code-preview {
  margin: 8px 0;
  background-color: #f6f8fa;
  border-radius: 3px;
  overflow: auto;
}

pre {
  margin: 0;
  padding: 8px 12px;
}

.frame-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

button {
  background: #e1e4e8;
  border: none;
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

button:hover {
  background: #d1d5da;
}
</style>