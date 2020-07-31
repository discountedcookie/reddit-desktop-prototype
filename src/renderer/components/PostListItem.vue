<template>
  <div
    class="p-2 rounded-lg text-xs"
    :data-id="post.id"
  >
    <img
      :src="imageUrl"
      v-if="imageUrl"
      class="w-full mb-1 rounded-lg"
    />

    <p class="text-sm font-semibold text-black dark:text-white">
      {{ post.title }}
    </p>

    <p class="flex justify-between">
      <span class="text-black dark:text-white">{{ post.subreddit_name_prefixed }}</span>
      <span class="text-silver-400">
        {{ post.author }} - {{ timeAgo }}
      </span>
    </p>

    <p class="mt-2 text-silver-600 break-words max-lines-10" v-if="post.selftext">
      {{ post.selftext.split('\n')[0] }}
    </p>
  </div>
</template>

<script>
import { computed, toRef } from 'vue';

import useSubmission from '@/composables/useSubmission';

import { timeFrom } from '@/plugins/utils';

export default {
  props: {
    post: Object,
  },
  setup(props) {
    const { getImage } = useSubmission(toRef(props, 'post'));

    const imageUrl = computed(() => getImage(200));
    const timeAgo = computed(() => timeFrom(props.post.created_utc, true));

    return {
      imageUrl,
      timeAgo,
    };
  },
};
</script>
