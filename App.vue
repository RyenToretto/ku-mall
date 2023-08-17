<script>
export default {
  globalData: {
  },
  onLaunch: function(starterParams) {
    uni.$on('app-ready', (payload) => {
      if (payload) {
        this.globalData.appName = payload.appName;
        this.globalData.sysInfo = payload
        this.globalData.appInited = true;
      }
    })
    uni.$utils.doRequest.setGlbParams(starterParams)
      .then(sysInfo => {
        this.globalData.sysInfo = sysInfo
      })
  },
  onShow: function() {
  },
  onHide: function() {
  }
}
</script>

<style lang="scss">
/* 每个页面公共css */
@import "@/uni_modules/uview-ui/index.scss";
@import "@/uni_modules/kjf-mall/css/common/index.scss";
</style>
