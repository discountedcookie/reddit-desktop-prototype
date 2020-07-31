<template>
  <div class="px-2">
    <PostListItem
      :post="post"
      v-for="post in posts"
      :key="post.id"
      @click="$emit('click-post', post)"
      class="cursor-default"
      :class="{ 'bg-silver-100 dark:bg-silver-900': selectedId === post.id }"
    />
  </div>
</template>

<script>
import PostListItem from './PostListItem.vue';

export default {
  components: {
    PostListItem,
  },
  props: {
    posts: Array,
    selectedId: String,
  },
};
</script>
