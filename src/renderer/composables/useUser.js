import {
  computed,
  inject,
  onMounted,
  ref,
  watch,
} from 'vue';

import useStorage from './useStorage';

export default function useUser() {
  const reddit = inject('reddit');
  const { getItem, setItem } = useStorage();

  const subscriptions = ref([]);
  const user = ref({});
  const isAnonymous = computed(() => !user.value.id);

  const loadUserFromStorage = async () => {
    user.value = await getItem('user', {});
  };

  const loadSubscriptionsFromStorage = async () => {
    const key = isAnonymous.value
      ? 'subscriptions_anonymous'
      : 'subscriptions_user';
    subscriptions.value = await getItem(key, []);
  };

  onMounted(async () => {
    await loadUserFromStorage();
    loadSubscriptionsFromStorage();

    user.value = await reddit.getMe();
    setItem('user', user.value.toJSON());
  });

  watch(() => user.value, async () => {
    loadSubscriptionsFromStorage();

    let subreddits;
    if (isAnonymous.value) {
      subreddits = (await reddit.getDefaultSubreddits()).toJSON();
      setItem('subscriptions_anonymous', subreddits);
    } else {
      subreddits = (await reddit.getSubscriptions({ limit: 1000 })).toJSON();
      setItem('subscriptions_user', subreddits);
    }
    subscriptions.value = subreddits;
  });

  watch(() => subscriptions.value, (value) => {
    value.forEach((subreddit) => {
      setItem(`subreddit_${subreddit.display_name}`, subreddit);
    });
  });

  return {
    isAnonymous,
    subscriptions,
    user,
  };
}
