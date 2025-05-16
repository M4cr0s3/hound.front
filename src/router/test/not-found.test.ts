import NotFound from '@/pages/NotFound.vue';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { expect, test } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import TestComponent from './TestComponent.vue';

const routes = [
  { path: '/test', component: TestComponent },
  { path: '/:pathMatch(.*)*', component: NotFound }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
});

test('Проверка работы not-found', async () => {
  router.push('/test')
  const wrapper = mount(TestComponent, {
    global: {
       plugins: [
        router,
        createTestingPinia()
      ]
    }
  })

  await router.isReady();
  await flushPromises();
  
  expect(wrapper.html()).toContain('start road to not-found');

  wrapper.find('a').trigger('click'); 
  await router.isReady(); 
  await flushPromises();

  expect(wrapper.html()).toContain('Извините, страница не найдена');
})