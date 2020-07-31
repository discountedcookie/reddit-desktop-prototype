import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router';

import Subreddit from '@/views/Subreddit.vue';

const routes = [
  {
    path: '/',
    name: 'main',
    redirect: {
      name: 'subreddit',
      params: {
        name: 'tifu',
      },
    },
  },
  {
    path: '/r/:name',
    name: 'subreddit',
    component: Subreddit,
  },
];

const router = createRouter({
  base: process.env.BASE_URL,
  history: process.env.IS_ELECTRON ? createMemoryHistory() : createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      selector: '#subreddit-list',
      offset: {
        x: 0,
        y: 0,
      },
    };
  },
});

export default router;
