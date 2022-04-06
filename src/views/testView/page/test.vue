<template>
  <div style="padding: 60px">
    JSX
    <component1 :canshu="data.canshu" />
    <component2 :canshu="data.canshu1" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import {component1, component2} from './test';
const data = reactive({
  canshu: '1233',
  canshu1: 'sdregyte'
})
</script>
