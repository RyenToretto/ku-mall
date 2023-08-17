<template>
  <view class="do-header">
    <view class="do-header-wrapper">
      <view class="do-header-fix"></view>

      <view class="do-header-core">
        <view v-if="showDefault || showBack" class="do-header-left">
          <view v-if="showBack" class="do-header-back" @click="$emit('back')">
            <image class="arrow-back" src="@/static/common/arrow_back.png" mode="aspectFit"></image>
          </view>

          <view class="do-header-title" :style="{ marginLeft: showBack ? 0 : '24rpx' }">
            <slot></slot>
          </view>
        </view>

        <view v-if="showCenter" class="do-header-center">
          <view class="do-header-title">
            <slot name="center"></slot>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "do-header",
  props: {
    showBack: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
    };
  },
  computed: {
    showDefault() {
      return Object.keys(this.$slots).includes('default')
    },
    showCenter() {
      return Object.keys(this.$slots).includes('center')
    }
  }
}
</script>

<style lang="scss">
.do-header {
  box-sizing: border-box;
  width: 100%;
  height: $do-header-height;
  min-height: $do-header-height;
  background-color: $base-bg-color;
  font-size: 0;
  @include flex-box(stretch, flex-start);
  .do-header-title {
    font-family: $font-family-medium;
    font-size: $big-font-size;
    font-weight: 600;
    color: #000000;
  }
  .do-header-wrapper {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    background-color: $base-bg-color;
    @include flex-y();
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    .do-header-fix {
      box-sizing: border-box;
      width: 100%;
      height: $bar-height;
    }
    .do-header-core {
      box-sizing: border-box;
      width: 100%;
      height: $do-header-height;
      @include flex-box(stretch, flex-start);
      position: relative;
      .do-header-left {
        box-sizing: border-box;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        @include flex-box(flex-start, center);
        .do-header-back {
          box-sizing: border-box;
          padding: 0 0 0 30rpx;
          @include flex-box();
          cursor: pointer;
          > .arrow-back {
            box-sizing: border-box;
            width: 36rpx;
            height: 36rpx;
          }
        }
        .do-header-title {
          padding-left: 15rpx;
        }
      }
      .do-header-center {
        flex: 1;
        box-sizing: border-box;
        height: 100%;
        @include flex-box();
      }
    }
  }

  /*  #ifdef  H5  */
  .do-header-wrapper {
    max-width: 750px;
    left: 50%;
    transform: translateX(-50%);
  }
  /*  #endif  */
}
</style>
