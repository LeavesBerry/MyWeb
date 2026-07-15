<template>
    <div class="slide-page">
        <div class="item-box none-select" v-show="!configModule.isContentExpanded">
			<p class="no-item-tip" v-if="currentConfig.length == 0"
			@click="getAllAnnoInfo">暂无公告( •̀ ω •́ )✧<br>点击此处刷新</p>
			<div class="items" 
			v-for="item in currentConfig" :key="item.title"
			@click="configModule.expandContent(item.id, 'Announce')">
				<p class="item-title">{{ item.title }}</p>	
				<p id="anno-date">————{{ Math.floor(item.anno_date / 10000) }}年{{ Math.floor((item.anno_date % 10000) / 100) }}月{{ (item.anno_date % 10000) % 100 }}日
				</p>
			</div>
			<p class="refresh-tip none-select" 
			v-if="currentConfig.length !== 0"
			@click="getAllAnnoInfo">若缺少公告<br>可尝试点击此处刷新界面( •̀ ω •́ )</p>
		</div>
    </div>
	<teleport class="fixed-page" to="#app #app">
		<div class="sidebar">
            <span class="dir-active-arrow" :style="arrowStyle"><<<</span>
            <div class="type" id="all" 
            @click="switchDirContent(0, 'all')">❖所有❖</div>
            <div class="type" id="convention"
            @click="switchDirContent(1, 'convention')">❖公约❖</div>
            <div class="type" id="newer"
            @click="switchDirContent(2, 'update')">❖更新❖</div>
            <div class="type" id="older"
            @click="switchDirContent(3, 'trailer')">❖预告❖</div>
			<div class="type" id="other"
            @click="switchDirContent(4, 'other')">❖其他❖</div>
        </div>
		<div class="hidden-container" :style="configModule.hiddenContentStyle">
			<div class="content-container" :style="configModule.containerStyle">
				<button class="hide-content-button none-select" 
				@click="configModule.hideContent()">×</button>
				<p class="content-title">{{ configModule.contentTitle }}</p>
				<div class="title-content-divider"></div>
				<p class="content-text">{{ configModule.contentText }}</p>
			</div>
		</div>
	</teleport>
</template>

<script setup>
    import api from "../utils/api"
	import { userState, navbarModule, 
		copyText, createQRCode, classifyGroup, 
		switchArrow, arrowStyle, axiosRequest, configModule } from "../utils/index";
	import { reactive, ref } from "vue"


	let navList = ref([]);
	let currentConfig = ref([])
	let groupMap = new Map()
	
	
	async function getAllAnnoInfo() {
		const res = await api.post('/api/getAllAnnoInfo');
		navList.value = res.data;
		currentConfig.value = navList.value;
		groupMap = classifyGroup(navList.value, 'type')
	}


    function switchDirContent(sn, type) {
		switchArrow(sn);
		if (type === "all") {
			currentConfig.value = navList.value
			return
		}
		if (groupMap.get(type)) {
			currentConfig.value = groupMap.get(type)
		}
		else {
			currentConfig.value = []
		}
	}

	arrowStyle.transform = {};
	getAllAnnoInfo()
</script>

<style>
	:root {
		/* 设计参考视高：457px；原 1vh = 4.57px */
		--design-vh: 4.57px;
		--design-width: 1096.8px;
		/* 457px * 2.4 */
	}

	#anno-date {
		width: 250px;
		text-align: left;
		position: absolute;
		right: 10%;
		top: 50%;
		font-size: calc(4 * var(--design-vh));
		color:#706048;
	}
</style>