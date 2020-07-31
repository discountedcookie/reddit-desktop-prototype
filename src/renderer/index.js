import { createApp } from 'vue';

import redditPlugin from '@/plugins/reddit';
import router from '@/router';

import App from './App.vue';

import './assets/css/index.css';

const app = createApp(App);

app.use(redditPlugin);
app.use(router);

const run = async (container) => {
  await router.isReady();
  await redditPlugin.isReady();

  app.mount(container);
};

run('#app');
