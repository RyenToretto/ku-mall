<template>
  <view class="personal-center-page do-page with-title">
    <view class="personal-center-wrapper do-wrapper">
      <do-header :show-back="false">
        <text>我的</text>
      </do-header>

      {{ resInfo }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      resInfo: {}
    }
  },
  onLoad() {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.personal-center-page {
  .personal-center-wrapper {
    font-size: 0;
  }
}
</style>
