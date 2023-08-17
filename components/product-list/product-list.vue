<template>
  <view class="spu-box">
    <u-sticky :custom-nav-height="0" z-index="2">
      <view class="spu-title"><text>{{ spuInfo.name }}</text></view>
    </u-sticky>

    <view class="spu-content">
      <view class="product-list">
        <template v-for="(eachProduct, indexProduct) in spuInfo.productList">
          <view class="each-product" :key="indexProduct">
            <product-cell :product-info="eachProduct"></product-cell>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "product-list",
  props: {
    spuInfo: {
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
.spu-box {
  box-sizing: border-box;
  @include flex-y();
  .spu-title {
    box-sizing: border-box;
    height: $spu-title-height;
    background-color: #ffffff;
    font-size: $base-font-size;
    @include flex-box(flex-start, center);
  }
  .spu-content {
    box-sizing: border-box;
    @include flex-y();
    font-size: 0;
    .product-list {
      box-sizing: border-box;
      @include flex-y();
      .each-product {
        box-sizing: border-box;
      }
    }
  }
}
</style>