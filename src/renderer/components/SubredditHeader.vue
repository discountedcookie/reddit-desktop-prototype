<template>
  <div class="sticky top-0 bg-white dark:bg-black z-20" style="-webkit-app-region: drag">
    <div class="flex items-center justify-between h-toolbar px-4">
      <div>
        <p class="ml-14 lg:ml-0 font-semibold leading-none text-black dark:text-white">
          <span class="opacity-25">r/</span>
          <span>{{ subreddit.display_name }}</span>
        </p>

        <p class="text-xxs leading-snug text-silver-500" v-if="!subreddit.special">
          {{ compactNumber(subreddit.subscribers) }} subscribers,
          {{ compactNumber(subreddit.active_user_count) }} online
        </p>
      </div>

      <div>
        <div
          class="flex items-center justify-center"
          v-html="icons.info"
          @click="$emit('click-info')"
        />
      </div>
    </div>
  </div>

  <transition name="fade">
    <div
      class="absolute inset-0 bg-black bg-opacity-50 z-10"
      v-if="showInfo"
    />
  </transition>

  <transition name="slide-up">
    <div
      class="absolute inset-0 pt-toolbar overflow-auto text-xs
             bg-white dark:bg-black text-silver-600 z-10"
      @wheel="onWheel"
      v-if="showInfo"
      ref="hiddenPane"
    >
      <img
        class="h-32 w-full object-cover"
        :src="subreddit.banner_background_image"
        v-if="subreddit.banner_background_image"
      >

      <div class="p-4">
        <Markdown :text="subreddit.description" />
      </div>
    </div>
  </transition>
</template>

<script>
import { icons } from 'feather-icons';

import { ref } from 'vue';
import Markdown from './Markdown.vue';

function debounce(func, wait, immediate) {
  let timeout;
  return function fn(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, ...args);
    }, wait);
    if (immediate && !timeout) func.apply(context, ...args);
  };
}

export default {
  components: {
    Markdown,
  },
  props: {
    showInfo: Boolean,
    subreddit: Object,
  },
  emits: ['click-info'],
  setup(props, context) {
    const compactNumber = (number) => Intl.NumberFormat(navigator.language, { notation: 'compact' })
      .format(number);

    const hiddenPane = ref(null);
    const hiddenPaneReachedBottom = ref(false);

    const saveReachingBottom = debounce(() => {
      hiddenPaneReachedBottom.value = true;
    }, 50);

    const onWheel = (event) => {
      if (!hiddenPane.value) return;
      if (event.deltaY > 0 && hiddenPaneReachedBottom.value) {
        hiddenPaneReachedBottom.value = false;
        context.emit('click-info');
        return;
      }

      const reachedBottom = hiddenPane.value.scrollTop + hiddenPane.value.clientHeight
        === hiddenPane.value.scrollHeight;

      if (!reachedBottom) hiddenPaneReachedBottom.value = false;
      else saveReachingBottom();
    };

    return {
      compactNumber,
      hiddenPane,
      icons: {
        info: icons.info.toSvg({
          class: 'text-silver-600 dark:text-silver-400 max-w-full max-h-full',
        }),
      },
      onWheel,
    };
  },
};
</script>
