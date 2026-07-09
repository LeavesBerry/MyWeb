<template>
	<!--受到transform影响,不要把fixed,拖拽,需获取坐标的点击等放入-->
    <div class="slide-page">
		<div class="item-box">
			<p class="no-item-tip" v-if="currentContent.length == 0">暂无收藏awa</p>
			<router-link class="items" 
			v-for="item in currentContent" :to="item.url" :key="item.title">
				<p id="coll-title">{{ item.title }}</p>
				<div id="colls-function-box">
					<button @click.stop.prevent="cancelColl(item.title)" 
					style="color: #73B436; 
					font-size: calc(6 * var(--design-vh));
					padding-bottom: 2%;
					border-left: 1px solid #3A251A;">✦</button>
					<button @click.stop.prevent="createQRCode(ROOT + item.url)"
					style="background-image: url('http://localhost:5000/static/resource/images/QR.png');
					background-size: calc(4 * var(--design-vh));
					background-position: calc(1.3 * var(--design-vh)) center;
					"></button>
					<button @click.stop.prevent="copyText(item.url)"
					style="background-image: url('http://localhost:5000/static/resource/images/Link.png');
					background-size: calc(6 * var(--design-vh));
					background-position: calc(0.3 * var(--design-vh)) center;
					"></button>
				</div>
			</router-link>
			<p class="refresh-tip" 
			v-if="currentContent.length !== 0">若缺少收藏,可尝试刷新界面( •̀ ω •́ )</p>
		</div>
	</div>	
	<teleport class="fixed-page" to="#app #app">
		<div class="sidebar">
			<span class="dir-active-arrow" :style="arrowStyle.transform"><<<</span>
			<div class="type" id="all"
			@click="switchDirContent(0, 'all')">❖所有❖</div>
			<div class="type" id="good" 
			@click="switchDirContent(1, 'good')">❖商品❖</div>
			<div class="type" id="essay" 
			@click="switchDirContent(2, 'essay')">❖文章❖</div>
			<div class="type" id="resource" 
			@click="switchDirContent(3, 'resourse')">❖资源❖</div>
			<div class="type" id="other"
			@click="switchDirContent(4, 'other')">❖其他❖</div>
		</div>
	</teleport>
	
</template>	
<script setup>
	import api from "../utils/api"
	import { userState, navbarModule, 
		copyText, createQRCode, classifyGroup, 
		switchArrow, arrowStyle } from "../utils/index";
	import { ref, Teleport } from "vue"


	let navList = ref([]);
	let currentContent = ref([])
	let groupMap = new Map()
	const ROOT = "http://localhost:5173";
	
	async function getAllColl() {
		if (!userState.isLogined || userState.userAccessToken == "visitor") 
		{ return null }
		const allColls = JSON.parse(localStorage.getItem('all_colls'))
		if (userState.isChangedColl == "false" && allColls){
			navList.value = allColls;
		}
		else{
			const res = await api.post('/api/getAllColl');
			navList.value = res.data;
			localStorage.setItem('all_colls', JSON.stringify(res.data));
		}
		currentContent.value = navList.value;
		groupMap = classifyGroup(navList.value, 'type')
	}

	async function cancelColl(url, title) {
		await navbarModule.toggleColl(url, title)
	}

	function switchDirContent(sn, type) {
		switchArrow(sn);
		if (type === "all") {
			currentContent.value = navList.value
			return
		}
		if (groupMap.get(type)) {
			currentContent.value = groupMap.get(type)
		}
		else {
			currentContent.value = []
		}
	}

	arrowStyle.transform = {};
	getAllColl();
</script>

<style>
	:root {
		/* 设计参考视高：457px；原 1vh = 4.57px */
		--design-vh: 4.57px;
		--design-width: 1096.8px;
		/* 457px * 2.4 */
	}
	
	#colls-function-box {
		position: absolute;
		right: 10%;
		top: 15%;
		height: 10%;
		width: auto;
		display: flex;
		z-index: 3;
	}
	.items button{
		width: calc(8 * var(--design-vh));
		height: calc(6 * var(--design-vh));
		background-color: rgba(0,0,0,0);
		background-repeat: no-repeat;
		color: #3A251A;
		margin-left: calc(1 * var(--design-vh));
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		border-right:1px solid #3A251A;
		border-top:none;
		border-bottom:none;
		border-left:none;
		z-index: 4;
	}
	.items p{
		width:auto;
		height: 40%;
		color:#3A251A;
		font-weight: 800;
		position: relative;
		top: 15%;
		left: 10%;
	}
</style>