<template>
  <div class="hidden md:block relative flex-1">
    <div class="h-full overflow-auto" ref="container">
      <div
        class="absolute top-0 inset-x-0 z-10 backdrop-blur
              bg-white dark:bg-black bg-opacity-75 dark:bg-opacity-75"
      >
        <div class="flex items-center justify-between h-toolbar px-4">
          <div class="flex">
            <div
              class="flex items-center justify-center"
              v-html="icons.back"
            />
            <div
              class="flex items-center justify-center ml-5"
              v-html="icons.forward"
            />
          </div>

          <div class="flex">
            <div
              class="flex items-center justify-center mr-5"
              v-html="icons.bookmark"
            />
            <div
              class="flex items-center justify-center mr-5"
              v-html="icons.share"
            />
            <div
              class="flex items-center justify-center"
              v-html="icons.more"
            />
          </div>
        </div>
      </div>

      <div v-if="imageUrl">
        <div class="relative h-post-image overflow-hidden">
          <div class="absolute inset-0 -m-5">
            <img
              :key="smallImageUrl"
              :src="smallImageUrl"
              class="h-full w-full object-cover filter-blur opacity-75"
            />
          </div>

          <img
            :key="imageUrl"
            :src="imageUrl"
            class="relative object-contain h-full w-full pt-toolbar"
          />
        </div>
      </div>

      <div
        class="p-4 mx-auto max-w-2xl text-black dark:text-white"
        :class="{ 'mt-toolbar': !imageUrl }"
      >
        <p class="text-xs opacity-50">
          Posted by {{ post.author }}, {{ timeAgo }}
        </p>
        <p class="text-xl font-semibold">
          {{ post.title }}
        </p>

        <div class="mt-8">
          <Markdown
            class="text-sm text-silver-600"
            :text="selftext"
            v-if="selftext"
          />
        </div>

        <div class="mt-8">
          <Comment :comment="comment" v-for="comment in comments" :key="comment.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed, toRef, watch, ref,
} from 'vue';
import { icons } from 'feather-icons';

import useSubmission from '@/composables/useSubmission';

import { timeFrom } from '@/plugins/utils';

import Comment from './Comment.vue';
import Markdown from './Markdown.vue';

export default {
  components: {
    Comment,
    Markdown,
  },
  props: {
    post: Object,
  },
  setup(props) {
    const { comments, getImage } = useSubmission(toRef(props, 'post'));

    const imageUrl = computed(() => getImage());
    const smallImageUrl = computed(() => getImage(200));
    const selftext = computed(() => {
      if (!props.post.selftext) return null;
      return props.post.selftext;
    });
    const timeAgo = computed(() => timeFrom(props.post.created_utc));

    const container = ref(null);
    const scrollTop = () => {
      container.value.scrollTo(0, 0);
    };

    watch(() => props.post, scrollTop);

    return {
      comments,
      container,
      imageUrl,
      selftext,
      smallImageUrl,
      timeAgo,
      icons: {
        back: icons['chevron-left'].toSvg({
          class: 'text-silver-600 dark:text-silver-400 max-w-full max-h-full',
        }),
        bookmark: icons.bookmark.toSvg({
          class: 'text-silver-600 dark:text-silver-400 max-w-full max-h-full',
        }),
        forward: icons['chevron-right'].toSvg({
          class: 'text-silver-600 dark:text-silver-400 max-w-full max-h-full',
        }),
        more: icons['more-horizontal'].toSvg({
          class: 'text-silver-600 dark:text-silver-400 max-w-full max-h-full',
        }),
        share: icons.share.toSvg({
          class: 'text-silver-600 dark:text-silver-400 max-w-full max-h-full',
        }),
      },
    };
  },
};
</script>
