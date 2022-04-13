<template>
  <div class="not-access-view">
    <div class="bullshit-headline">
      提示
    </div>
    <div class="bullshit-message">
      {{ message }}
    </div>
    <div class="bullshit-info">
      你可以点击 返回首页 或 重新登录 切换账号！
    </div>
    <div class="back-button">
      <van-button type="primary" @click="goToPageHome">
        返回首页
      </van-button>
      <van-button type="primary" @click="loginOut">
        重新登录
      </van-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
const message = '抱歉，你没有该页面权限，无法访问!';
const goToPageHome = () => {
  const location = window.location;
  window.location.href = `${location.origin}${location.pathname}`;
}
const loginOut = () => {
  // 执行退出登录并返回登录页面
}
</script>
<style scoped lang="less">
.not-access-view{
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
    display: flex;
    margin-top: 20px;
    :deep(.van-button){
      flex: 50;
      margin: 0 10px;
    }
  }
}
</style>

