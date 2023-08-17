<template>
  <view class="mall-cate-page do-page stretch">
    <view class="mall-cate-wrapper do-wrapper">
      <mall-head></mall-head>

      <view class="mall-cate-body">
        <view class="mall-cate-info">
          <view class="mall-cate-left-tips"><text>免费配送</text></view>
          <view class="mall-cate-right-tips">
            <u-icon name="order" color="#576b95" size="24"></u-icon>
            <text>我的订单</text>
          </view>
        </view>

        <view class="mall-cate-section">
          <view class="mall-cate-nav">
            <scroll-view class="cate-nav-scroll mall-cate-scroll" scroll-y>
              <template v-for="eachSpu in spuList">
                <view
                  class="each-nav-line"
                  :class="{ active: eachSpu.id === currentSpuId }"
                  @click="currentSpuId = eachSpu.id"
                  :key="eachSpu.id"
                >
                  <text>{{ eachSpu.name }}</text>
                </view>
              </template>
            </scroll-view>
          </view>

          <view class="mall-cate-spu">
            <view class="mall-product-search">
              <u-icon name="search" size="22" color="#576b95"></u-icon>
              <text>搜索</text>
            </view>

            <scroll-view class="cate-spu-scroll mall-cate-scroll" scroll-y>
              <template v-for="eachSpu in spuList">
                <view class="each-spu-line" :key="eachSpu.id">
                  <product-list :spu-info="eachSpu"></product-list>
                </view>
              </template>
            </scroll-view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentSpuId: 1,
      spuList: [
        {
          id: 1,
          name: '西游记',
          productList: [
            { id: 11, name: '金箍棒' },
            { id: 12, name: '九齿钉耙' },
            { id: 13, name: '风火轮' },
            { id: 14, name: '混天绫' },
            { id: 15, name: '捆仙绳' },
          ],
        },
        {
          id: 2,
          name: '复仇者联盟',
          productList: [
            { id: 21, name: '雷神之锤' },
            { id: 22, name: '风暴战斧' },
            { id: 23, name: '空间宝石' },
            { id: 24, name: '灵魂宝石' },
            { id: 25, name: '生命宝石' },
            { id: 26, name: '时间宝石' },
          ],
        },
        {
          id: 3,
          name: '斗破苍穹',
          productList: [
            { id: 31, name: '玄重尺' },
            { id: 32, name: '黑龙鼎' },
            { id: 33, name: '净莲妖火' },
            { id: 34, name: '青莲地心火' },
            { id: 35, name: '虚无吞炎' },
          ],
        },
        {
          id: 4,
          name: '斗罗大陆',
          productList: [
            { id: 41, name: '蓝银草' },
            { id: 42, name: '曼陀罗' },
            { id: 43, name: '暴雨梨花针' }
          ],
        },
        {
          id: 5,
          name: '武动乾坤',
          productList: [
            { id: 51, name: '吞噬祖符' },
            { id: 52, name: '雷霆祖父' },
            { id: 53, name: '冰之祖符' },
            { id: 54, name: '火之祖符' },
            { id: 55, name: '水之祖符' },
          ],
        }
      ]
    }
  },
  onLoad() {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.mall-cate-page {
  .mall-cate-wrapper {
    font-size: 0;
    .mall-cate-body {
      box-sizing: border-box;
      width: 100%;
      border-radius: 20rpx 20rpx 0 0;
      margin-top: -20rpx;
      flex: 1;
      overflow: hidden;
      @include flex-y();
      position: relative;
      z-index: 1;
      .mall-cate-info {
        box-sizing: border-box;
        padding: 0 30rpx;
        width: 100%;
        height: 100rpx;
        border-bottom: 1rpx solid $light-border-color;
        border-radius: 20rpx 20rpx 0 0;
        background-color: $white;
        font-family: $font-family-regular;
        font-size: $medium-font-size;
        color: $base-txt-color;
        @include flex-box(space-between, center);
        .mall-cate-right-tips {
          color: $brand-aux-color;
          @include flex-box(space-between, center);
        }
      }
      .mall-cate-section {
        box-sizing: border-box;
        width: 100%;
        background-color: $white;
        overflow: hidden;
        flex: 1;
        @include flex-box(space-between, stretch);
        font-size: $small-font-size;
        .mall-cate-nav {
          box-sizing: border-box;
          width: 190rpx;
          height: 100%;
          background-color: #f3f3f3;
          border-right: 1rpx solid $light-border-color;
          .each-nav-line {
            box-sizing: border-box;
            padding-left: 25rpx;
            height: 100rpx;
            font-size: $base-font-size;
            color: $sec-title-color;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            &.active {
              color: $base-txt-color;
              background-color: $white;
              &::before {
                content: "";
                width: 6rpx;
                height: 30rpx;
                background-color: $brand-theme-color;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }
        }
        .mall-cate-spu {
          box-sizing: border-box;
          padding-left: 12rpx;
          height: 100%;
          flex: 1;
          position: relative;
          .mall-product-search {
            box-sizing: border-box;
            height: $spu-title-height;
            color: $brand-aux-color;
            @include flex-box();
            position: absolute;
            top: 0;
            right: 30rpx;
            z-index: 3;
          }
          .each-spu-line {
            box-sizing: border-box;
          }
        }
        .mall-cate-scroll {
          box-sizing: border-box;
          height: 100%;
        }
      }
    }
  }
}
</style>
