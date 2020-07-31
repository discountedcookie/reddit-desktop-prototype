<template>
  <div class="hidden lg:flex flex-col h-screen">
    <div class="h-toolbar w-full" style="-webkit-app-region: drag" />

    <div class="flex-1 px-3 overflow-auto">
      <div class="relative -mx-1 h-7 mb-3">
        <input
          type="search"
          class="h-7 w-full py-px pl-7 pr-1 rounded text-xs focus:outline-none
                 placeholder-silver-600 dark:placeholder-silver-400
                 bg-silver-500 bg-opacity-20 text-black dark:text-silver-300
                 border border-silver-400 border-opacity-25
                 focus:border-silver-600 focus:border-opacity-25
                 dark:border-silver-600 dark:border-opacity-25
                 dark:focus:border-silver-400 dark:focus:border-opacity-25"
          placeholder="Search"
        >
        <div
          class="absolute inset-y-0 left-0 ml-px pl-px py-1 flex items-center justify-center
                 opacity-90"
          v-html="icons.search"
        />
      </div>

      <div v-for="(section, index) in sections" :key="index" class="mb-3">
        <p
          class="text-xxs font-semibold leading-relaxed opacity-50
                 text-silver-800 dark:text-silver-300"
        >
          {{ section.label }}
        </p>

        <ul class="mt-px">
          <router-link
            v-for="item in section.items"
            :to="item.to || '/'"
            :key="item.label"
            v-slot="{ isExactActive, navigate }"
            custom
          >
            <li
              class="-mx-1 py-px rounded"
              :class="{
                'bg-silver-500 bg-opacity-25': isExactActive,
              }"
            >
              <a
                class="flex px-1 py-1 items-center cursor-default"
                @click="(item.onClick || navigate)()"
              >
                <div class="h-4 w-4 overflow-hidden rounded-full">
                  <img :src="item.icon" class="h-full w-full" v-if="item.icon">
                </div>
                <p
                  class="flex-1 ml-2 text-xs text-silver-800 dark:text-silver-300"
                  :class="isExactActive
                    ? 'text-black dark:text-white'
                    : 'text-silver-800 dark:text-silver-300'
                  "
                >
                  {{ item.label }}
                </p>
              </a>
            </li>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  onMounted, ref, inject, computed,
} from 'vue';
import { useRoute } from 'vue-router';

import { icons } from 'feather-icons';

import useUser from '@/composables/useUser';

export default {
  setup() {
    const {
      isAnonymous, subscriptions, user,
    } = useUser();

    const anonymousSections = [
      {
        label: 'Login',
        onClick: async () => {
          const { accessToken, refreshToken } = await window.ipcRenderer.invoke('login');
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          window.location.reload();
        },
      },
    ];

    const userSections = computed(() => [
      {
        label: 'Logout',
        onClick: () => {
          alert('logout!');
        },
      },
    ]);

    const sections = computed(() => [
      {
        label: 'Favourites',
        items: [
          {
            label: 'Home',
            to: '/',
          },
          {
            label: 'Popular',
            to: '/r/popular',
          },
          {
            label: 'All',
            to: '/r/all',
          },
          ...isAnonymous.value ? anonymousSections : userSections.value,
        ],
      },
      {
        label: 'My communities',
        items: [...subscriptions.value]
          .sort((a, b) => a.display_name.localeCompare(b.display_name))
          .map((sub) => ({
            label: sub.display_name,
            icon: sub.icon_img,
            to: {
              name: 'subreddit',
              params: {
                name: sub.display_name,
              },
            },
          })),
      },
    ]);

    return {
      icons: {
        search: icons.search.toSvg({
          class: 'text-silver-600 dark:text-silver-400 max-w-full max-h-full',
        }),
      },
      sections,
      user,
    };
  },
};
</script>
