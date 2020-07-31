<template>
  <div class="main-grid">
    <Sidebar />

    <main class="overflow-hidden bg-white dark:bg-black">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
};
</script>

<style lang="postcss">
.main-grid {
  display: grid;
  grid-template-columns: 1fr;
}

@screen lg {
  .main-grid {
    grid-template-columns: theme('spacing.52') 1fr;
  }
}
</style>
