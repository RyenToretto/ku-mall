<template>
  <view class="mall-city-page do-page stretch">
    <view class="mall-city-wrapper do-wrapper">
      <mall-head></mall-head>

      <view class="mall-city-body">
        <view class="mall-city-info">
          <view class="mall-city-left-tips"><text>免费配送</text></view>
          <view class="mall-city-right-tips">
            <u-icon name="order" color="#576b95" size="24"></u-icon>
            <text>我的订单</text>
          </view>
        </view>

        <view class="mall-city-section">
          <u-button type="primary" :plain="true" text="镂空"></u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  onLoad() {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.mall-city-page {
  .mall-city-wrapper {
    font-size: 0;
    .mall-city-body {
      box-sizing: border-box;
      width: 100%;
      border-radius: 20rpx 20rpx 0 0;
      margin-top: -20rpx;
      flex: 1;
      @include flex-y();
      position: relative;
      z-index: 1;
      .mall-city-info {
        box-sizing: border-box;
        padding: 0 30rpx;
        width: 100%;
        border-radius: 20rpx 20rpx 0 0;
        background-color: $white;
        font-family: $font-family-regular;
        font-size: $medium-font-size;
        color: $base-txt-color;
        @include flex-box(space-between, center);
        .mall-city-right-tips {
          color: $brand-aux-color;
          @include flex-box(space-between, center);
        }
      }
      .mall-city-section {
        box-sizing: border-box;
        width: 100%;
      }
    }
  }
}
</style>
