<template>
  <div class="conent">
    <div class="conent-row">
      JSX 组件：
      <component1 :canshu="data.canshu" />
      <component2 :canshu="data.canshu1" />
    </div>
    <div class="conent-row">
      <van-button type="primary" size="small" round>我是按钮</van-button>
    </div>
    <div class="conent-row">
      <van-field v-model="data.userName" label="用户名" placeholder="请输入用户名" />
    </div>
    <div class="ceshi">测试</div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import getGlobal from "@/utils/global";
import {component1, component2} from './test';

const global = getGlobal();
const data = reactive({
  canshu: 'component1',
  canshu1: 'component2',
  userName: ''
})

global.$common.copy(data);

onMounted(() => {});
</script>
<style lang="less" scoped>
.conent{
  padding: 10px;
  height: 1000px;
  .conent-row{
    margin-top: 10px;
  }
  .ceshi{
    &:before{
      content: '123';
    }
  }
}
</style>
