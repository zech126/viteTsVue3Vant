<template>
  <div class="nonExist-container">
    <div class="bullshit-headline">
      提示
    </div>
    <div class="bullshit-message">
      {{ message }}
    </div>
    <div class="bullshit-info">
      请检查您输入的网址是否正确，请点击以下按钮返回主页或者向管理员反馈
    </div>
    <div class="back-button">
      <van-button type="primary" @click="goToPageHome">
        返回首页
      </van-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
const message = '这个页面走丢了......';
const goToPageHome = () => {
  const location = window.location;
  window.location.href = `${location.origin}${location.pathname}`;
}
</script>
<style scoped lang="less">
.nonExist-container{
  padding: 20px;
  .bullshit-headline{
    font-size: 20px;
    color: #1482f0;
    font-weight: bold;
  }
  .bullshit-message{
    padding: 10px 0;
    font-size: 16px;
    font-weight: bold;
  }
  .bullshit-info{
    color: grey;
    line-height: 1.6em;
  }
  .back-button{
    margin-top: 20px;
    :deep(.van-button){
      width: 100%;
    }
  }
}
</style>
