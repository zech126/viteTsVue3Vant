<template>
  <div style="padding: 10px;">
    <div style="margin-top: 10px;">
      JSX 组件：
      <component1 :canshu="data.canshu" />
      <component2 :canshu="data.canshu1" />
    </div>
    <div style="margin-top: 10px;">
      <van-button type="primary" size="small" round>我是按钮</van-button>
    </div>
    <div style="margin-top: 10px;">
      <van-field v-model="data.userName" label="用户名" placeholder="请输入用户名" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
// import getProxy from "@/utils/proxy";
import {component1, component2} from './test';

// const proxy:any = getProxy();
const data = reactive({
  canshu: 'component1',
  canshu1: 'component2',
  userName: ''
})


onMounted(() => {});
</script>
