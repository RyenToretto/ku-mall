<template>
  <view class="mall-head">
    <view class="mall-header-wrapper">
      <view class="mall-header-fix"></view>
      <view class="mall-header-core">
        <view class="mall-header-bg">
          <image class="mall-header-img" src="@/static/common/ico_vip.png" mode="aspectFill"></image>
        </view>

        <view class="mall-header-content">
          <text>Mall Head</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mall-head"
}
</script>

<style lang="scss">
$mall-header-height: 200rpx;

.mall-head {
  box-sizing: border-box;
  width: 100%;
  font-size: 0;
  @include flex-y();
  .mall-header-wrapper {
    box-sizing: border-box;
    width: 100%;
    height: $mall-header-height;
    background-color: $base-bg-color;
    @include flex-y();
    .mall-header-fix {
      box-sizing: border-box;
      width: 100%;
      height: $bar-height;
    }
    .mall-header-core {
      box-sizing: border-box;
      width: 100%;
      flex: 1;
      @include flex-box(stretch, flex-start);
      position: relative;
      .mall-header-bg {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #000;
        position: absolute;
        top: 0;
        left: 0;
        .mall-header-img {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          filter: blur(30rpx);
          transform: scale(2);
        }
      }
      .mall-header-content {
        font-size: $medium-font-size;
        font-family: $font-family-regular;
        position: relative;
        z-index: 1;
      }
    }
  }
}
</style>