<template>
    <div class="test-page">
		<div id="coll-box">
			<router-link to="/">T1</router-link>
			<!--home page-->
			<router-link to="/Test2">T2</router-link>
			<router-link v-for="item in navList" :to="item.path" :key="item.name"></router-link>
		</div>
		<button style="width: 30px;height: 40px;" @click="getAllColl()"></button>
	</div>
</template>	
<script setup>
	import api from "../utils/api"
	import { userState, userModule } from "../utils/index";
	const navList = [];
	function createLink(url,title) {
		const navItem = { path: 'url', name: 'title'}
		navList.push(navItem);
	}
	async function getAllColl() {
		if (!userState.isLogined || userModule.userAccessToken == "visitor") 
		{ return null }
		const data = await api.post('/api/getAllColl');
		Object.entries(data).forEach(([url,title]) => {
			createLink(url,title);
		});
	}
	
</script>
