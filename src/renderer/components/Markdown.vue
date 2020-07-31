<template>
  <div v-html="markdown" />
</template>

<script>
import { markdown } from 'snudown-js';
import { computed } from 'vue';

export default {
  props: {
    text: String,
  },
  setup(props) {
    return {
      markdown: computed(() => markdown(props.text)),
    };
  },
};
</script>

<style lang="postcss" scoped>
::v-deep a {
  @apply border-b text-silver-700 border-silver-600;
}

::v-deep hr {
  @apply my-2;
}

::v-deep p + p {
  margin-top: 10px;
}

@screen dark {
  ::v-deep a {
    @apply text-silver-300 border-silver-400;
  }
}
</style>
