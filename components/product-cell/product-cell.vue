<template>
  <view class="product-cell">
    <view class="product-photo">
      <image class="product-img" src="@/static/common/ico_vip.png" mode="aspectFill"></image>
    </view>

    <view class="product-info">
      <view class="product-name"><text>金箍棒了个棒了个棒了个棒了个棒了个棒了个棒了个棒了个棒</text></view>

      <view class="product-price">
        <text class="product-real-price">￥18.8</text>
        <text class="product-origin-price">￥32.3</text>
      </view>
      
      <text class="product-discount">5.5折</text>
      <view class="product-sku-box">
        <view class="product-sku-tips"><text>选规格</text></view>
        <view class="product-sku-select"><text>{{ productInfo.name }}</text></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "product-cell",
  props: {
    productInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss">
.product-cell {
  box-sizing: border-box;
  @include flex-box(flex-start, flex-start);
  .product-photo {
    box-sizing: border-box;
    width: 180rpx;
    height: 180rpx;
    border-radius: 20rpx;
    overflow: hidden;
    .product-img {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }
  }
  .product-info {
    padding-left: 20rpx;
    .product-name {
      @include ellipsis(2);
      font-family: $font-family-medium;
      font-size: $medium-font-size;
      font-weight: 600;
    }
    .product-price {
      display: flex;
      .product-real-price {
        box-sizing: border-box;
        font-size: $base-font-size;
      }
      .product-origin-price {
        box-sizing: border-box;
        font-size: $base-font-size;
      }
    }
    .product-discount {
      box-sizing: border-box;
      font-size: $base-font-size;
    }
    .product-sku-box {
      box-sizing: border-box;
      .product-sku-tips {
        box-sizing: border-box;
        font-size: $base-font-size;
      }
      .product-sku-select {
        box-sizing: border-box;
        font-size: $base-font-size;
      }
    }
  }
}
</style>