import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { router } from './router';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.directive('highlightjs', {
	mounted(el) {
		const blocks = el.querySelectorAll('pre code');
		blocks.forEach((block: HTMLElement) => {
			hljs.highlightElement(block);
		});
	},
});

app.use(pinia);
app.use(router);

app.mount('#app');
