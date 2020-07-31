<template>
  <div class="flex h-screen overflow-hidden">
    <div
      class="relative w-full md:w-96
             border-r border-silver-100 dark:border-silver-900"
    >
        <SubredditHeader
          :subreddit="subreddit"
          @click-info="onSubredditInfoClick"
          v-model:show-info="showSubredditInfo"
        />

      <div
        class="h-screen pb-toolbar overflow-auto transform duration-500"
        :class="{ 'scale-95': hiddenPaneVisible }"
        ref="listRef"
      >
        <PostList
          :posts="posts"
          sort="hot"
          @click-post="onPostClick"
          :selected-id="(selectedPost || {}).id"
        />
      </div>
    </div>

    <PostDetail
      :post="selectedPost"
      v-if="selectedPost"
    />
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useOnScroll } from 'vue-composable';

import useSubreddit from '@/composables/useSubreddit';

import SubredditHeader from '@/components/SubredditHeader.vue';
import PostDetail from '@/components/PostDetail.vue';
import PostList from '@/components/PostList.vue';

export default {
  components: {
    SubredditHeader,
    PostDetail,
    PostList,
  },
  setup(props, context) {
    //
    const route = useRoute();
    const subredditName = computed(() => route.params.name);
    const {
      fetchMore,
      getHot,
      submissions,
      subreddit,
    } = useSubreddit(subredditName);

    onMounted(getHot);
    watch(() => route.params.name, getHot);

    const listRef = ref(null);
    const { scrollTop } = useOnScroll(listRef);

    const fetchMoreIfReachingBottom = (fromTop) => {
      const scrollBottom = listRef.value.scrollHeight - listRef.value.offsetHeight - fromTop;
      if (scrollBottom < listRef.value.offsetHeight * 2) fetchMore();
    };

    watch(() => scrollTop.value, fetchMoreIfReachingBottom);

    //
    // const { getItem } = useStorage();
    const selectedPost = ref(null);

    const onPostClick = (post) => {
      selectedPost.value = post;
      console.log(context);
    };

    //
    const hiddenPaneVisible = ref(false);
    const showSubredditInfo = ref(false);
    const onSubredditInfoClick = () => {
      showSubredditInfo.value = !showSubredditInfo.value;
      hiddenPaneVisible.value = showSubredditInfo.value;
    };

    // const selectPostOnScroll = async () => {
    //   const postItem = document
    //     .elementsFromPoint(
    //       listRef.value.offsetLeft + (listRef.value.clientWidth / 2),
    //       (listRef.value.clientHeight / 2),
    //     )
    //     .find((element) => element.dataset.id);
    //   const postId = postItem.dataset.id;

    //   if (selectedPost.value && selectedPost.value.id === postId) return;
    //   selectedPost.value = await getItem(`submission_${postId}`);
    // };

    // watch(() => scrollTop.value, selectPostOnScroll);

    return {
      hiddenPaneVisible,
      listRef,
      onPostClick,
      onSubredditInfoClick,
      posts: submissions,
      route,
      selectedPost,
      showSubredditInfo,
      subreddit,
    };
  },
};
</script>
