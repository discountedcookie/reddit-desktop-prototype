<template>
  <div
    class="py-2 text-xs"
    :class="{ 'bg-silver-100 dark:bg-silver-900': replies.length && !isExpanded }"
  >
    <div @click="isExpanded = !isExpanded">
      <p class="text-black dark:text-white">
        <span class="font-semibold">
          {{ comment.author }}
        </span>
        <span class="ml-2 text-xxs opacity-50">
          {{ score }}
        </span>
      </p>

      <Markdown
        class="mt-1 text-silver-600 dark:text-silver-400"
        :text="comment.body"
        v-if="comment.body"
      />
    </div>

    <div class="mt-2 -mb-2" v-if="replies.length && isExpanded">
      <Comment
        :comment="reply"
        v-for="reply in replies"
        :key="reply.id"
        class="pl-4 border-l border-silver-100 dark:border-gray-900"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

import { compactNumber } from '@/plugins/utils';

import Markdown from './Markdown.vue';

export default {
  name: 'Comment',
  components: {
    Markdown,
  },
  props: {
    comment: Object,
  },
  setup(props) {
    const isExpanded = ref(true);

    return {
      isExpanded,
      replies: props.comment.replies,
      score: computed(() => compactNumber(props.comment.ups)),
    };
  },
};
</script>
