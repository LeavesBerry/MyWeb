<template>
    <div class="slide-page">
        <div class="item-box none-select" v-bind="!isAnnoExpanded">
			<p class="no-item-tip" v-if="currentContent.length == 0">暂无公告awa</p>
			<div class="items" 
			v-for="item in currentContent" :key="item.title"
			@click="expandAnno(item.id, item.title)">
				<p class="item-title">{{ item.title }}</p>	
			</div>
			<p class="refresh-tip none-select" 
			v-if="currentContent.length !== 0">若缺少公告,可尝试刷新界面( •̀ ω •́ )</p>
		</div>
    </div>
	<teleport class="fixed-page" to="#app #app">
		<div class="sidebar">
            <span class="dir-active-arrow" :style="arrowStyle.transform"><<<</span>
            <div class="type" id="all" 
            @click="switchDirContent(0, 'all')">❖所有❖</div>
            <div class="type" id="convention"
            @click="switchDirContent(1, 'convention')">❖公约❖</div>
            <div class="type" id="newer"
            @click="switchDirContent(2, 'update')">❖更新❖</div>
            <div class="type" id="older"
            @click="switchDirContent(3, 'trailer')">❖预告❖</div>
			<div class="type" id="older"
            @click="switchDirContent(4, 'other')">❖其他❖</div>
        </div>
		<div class="hidden-container">
			<div class="content-container">
				<p class="content-title">{{ annoTitle }}</p>
				<p class="content-text">{{ annoText }}</p>
			</div>
		</div>
	</teleport>
</template>

<script setup>
    import api from "../utils/api"
	import { userState, navbarModule, 
		copyText, createQRCode, classifyGroup, 
		switchArrow, arrowStyle, axiosRequest } from "../utils/index";
	import { ref } from "vue"

	let navList = ref([]);
	let currentContent = ref([])
	let isAnnoExpanded = ref(false)
	let annoTitle = ref("")
	let annoText = ref("")
	let groupMap = new Map()
	
	
	async function getAllAnnoInfo() {
		const res = await api.post('/api/getAllAnnoInfo');
		navList.value = res.data;
		currentContent.value = navList.value;
		groupMap = classifyGroup(navList.value, 'type')
	}

	async function expandAnno(anno_id, anno_title) {
		const res = await axiosRequest.getAnnoText(anno_id);
		isAnnoExpanded = true;
		annoText = res.main_text;
		annoTitle = anno_title;
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
	getAllAnnoInfo()
</script>