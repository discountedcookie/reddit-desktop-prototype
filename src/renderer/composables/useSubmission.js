import {
  computed, inject, ref, onMounted, watch,
} from 'vue';

export default function useSubmission(submission) {
  const reddit = inject('reddit');
  const submissionRef = ref(null);

  const loadSubmissionRef = async () => {
    submissionRef.value = reddit.getSubmission(submission.value.id);
  };

  onMounted(loadSubmissionRef);
  watch(() => submission.value, loadSubmissionRef);

  const commentsLoading = ref(false);
  const commentsRef = ref(null);

  const getComments = async () => {
    if (commentsLoading.value || !submissionRef.value) return;

    commentsLoading.value = true;
    const { comments: replies } = await submissionRef.value.expandReplies({ depth: 1, limit: 30 });
    commentsRef.value = replies;
    commentsLoading.value = false;
  };

  watch(() => submission.value, () => {
    commentsRef.value = null;
  });

  const comments = computed({
    get: () => {
      if (!commentsRef.value) getComments();
      return commentsRef.value
        ? commentsRef.value.toJSON()
        : null;
    },
  });

  const getImage = (minWidth) => {
    if (!submission.value.preview) return null;
    if (!minWidth) return submission.value.preview.images[0].source.url;

    const image = submission.value.preview.images[0].resolutions
      .find(({ width }) => width > minWidth);
    return image ? image.url : null;
  };

  return {
    comments,
    getImage,
  };
}
