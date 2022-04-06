<template>
  <div>{{data.msg}}</div>
</template>
<script lang="ts" setup>
import {reactive} from 'vue';

const data = reactive({
  msg: '22'
});
</script>
