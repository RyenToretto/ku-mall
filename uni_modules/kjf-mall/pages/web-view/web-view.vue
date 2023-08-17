<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src : ""
			}
		},
		onLoad({src}) {
			this.src = decodeURIComponent(src) ;
		}
	}
</script>