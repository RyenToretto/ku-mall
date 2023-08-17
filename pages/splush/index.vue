<template>
  <view class="splush-index-page">
    <view class="splush-line">
      <view class="splush-app-logo">
        <image class="logo-radius" src="@/static/logo.png" mode="aspectFit"></image>
      </view>
      <text class="splush-app-name">{{ pageTitle }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: ''
    }
  },
  created() {
    this.pageTitle = getApp().globalData.appName
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/mall/city'
      })
    }, 1500);
  }
}
</script>

<style lang="scss">
.splush-index-page {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  flex-direction: column;
  @include flex-box();
  .splush-line {
    box-sizing: border-box;
    @include flex-box();
    .splush-app-logo {
      box-sizing: border-box;
      padding: $base-gap;
      width: 194rpx;
      height: 194rpx;
      .logo-radius {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
      }
    }
    .splush-app-name {
      font-family: $font-family-medium;
      font-size: $big-font-size;
    }
  }
}
</style>
