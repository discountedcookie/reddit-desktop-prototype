import {
  inject, onMounted, ref, watch,
} from 'vue';

import useStorage from './useStorage';

export default function useSubreddit(nameRef) {
  const reddit = inject('reddit');
  const { getItem, setItem } = useStorage();

  // subreddit
  const subreddit = ref({});

  const loadSubredditFromStorage = async () => {
    subreddit.value = await getItem(`subreddit_${nameRef.value}`, {});
  };

  const fetch = async () => {
    if (['all', 'popular'].includes(nameRef.value)) {
      setItem(`subreddit_${nameRef.value}`, {
        display_name: nameRef.value,
        special: true,
      });
    } else {
      const subredditResource = await reddit.getSubreddit(nameRef.value).fetch();
      setItem(`subreddit_${nameRef.value}`, subredditResource.toJSON());
    }

    loadSubredditFromStorage();
  };

  const loadSubreddit = () => {
    loadSubredditFromStorage();
    fetch();
  };

  onMounted(loadSubreddit);
  watch(() => nameRef.value, loadSubreddit);

  // submissions
  const fetchedListing = ref(null);
  const submissions = ref([]);
  const submissionsLoading = ref(false);

  const fetchMore = async (options = { amount: 30 }) => {
    if (submissionsLoading.value) return;
    submissionsLoading.value = true;
    fetchedListing.value = await fetchedListing.value.fetchMore(options);
    submissionsLoading.value = false;
  };

  const getHot = async () => {
    submissionsLoading.value = true;
    fetchedListing.value = await reddit.getSubreddit(nameRef.value).getHot();
    submissionsLoading.value = false;
  };

  watch(fetchedListing, (value) => {
    submissions.value = value.toJSON();
    submissions.value.forEach((submission) => {
      setItem(`submission_${submission.id}`, submission);
    });
  });
  watch(() => nameRef.value, () => {
    submissions.value = [];
  });

  return {
    fetchMore,
    getHot,
    submissions,
    subreddit,
  };
}
