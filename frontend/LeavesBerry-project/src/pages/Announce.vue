<template>
    <div class="slide-page">
        <div class="item-box">
			<p class="no-item-tip" v-if="currentContent.length == 0">暂无公告awa</p>
			<div class="items" 
			v-for="item in currentContent" :to="item.url" :key="item.title">
				<p id="annu-title">{{ item.title }}</p>	
			</div>
			<p class="refresh-tip" 
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
            @click="switchDirContent(2, 'decent')">❖近期❖</div>
            <div class="type" id="older"
            @click="switchDirContent(3, 'past')">❖过去❖</div>
        </div>
	</teleport>
</template>

<script setup>
    import api from "../utils/api"
	import { userState, userModule, navbarModule, 
		copyText, createQRCode, classifyGroup, 
		switchArrow, arrowStyle } from "../utils/index";
	import { ref } from "vue"


	const navList = ref([]);
	const currentContent = ref([])
	const groupMap = new Map()
	
	async function getAllColl() {
		if (!userState.isLogined || userModule.userAccessToken == "visitor") 
		{ return null }
		const res = await api.post('/api/getAllAnnoce');
		navList.value = res.data;
		groupMap = classifyGroup(navList, 'type')
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
</script>