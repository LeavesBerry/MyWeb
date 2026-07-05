<template>
    <div id="page">
        <div class="sidebar">
            <span class="dir-active-arrow"><<<</span>
            <div class="type" id="all" 
            @click="switchDirContent(1, 'all')">❖所有❖</div>
            <div class="type" id="convention"
            @click="switchDirContent(1, 'convention')">❖公约❖</div>
            <div class="type" id="newer"
            @click="switchDirContent(1, 'decent')">❖近期❖</div>
            <div class="type" id="older"
            @click="switchDirContent(1, 'past')">❖过去❖</div>
        </div>
    </div>
</template>

<script setup>
    import api from "../utils/api"
	import { userState, userModule, navbarModule, 
		copyText, classifyGroup, switchArrow } from "../utils/index";
	import { ref } from "vue"


	const navList = ref([]);
	const currentContent = ref([])
	const groupMap = ref(new Map())
	
	async function getAllColl() {
		if (!userState.isLogined || userModule.userAccessToken == "visitor") 
		{ return null }
		const data = await api.post('/api/getAllAnnoce');
		navList = data;
		groupMap = classifyGroup(navList, 'type')
	}
</script>