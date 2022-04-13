<template>
  <div class="app-container">
    <noAccessView v-if="noAccess" />
    <nonExistView v-else-if="nonExist" />
    <slot v-else />
  </div>
</template>
<script lang="ts" setup>
import store from '@/store';
import { computed } from 'vue';
import nonExistView from './404.vue';
import noAccessView from './401.vue';

const nonExist = computed(() => store.getters['layout/nonExist']);
const noAccess = computed(() => store.getters['layout/noAccess']);
</script>
