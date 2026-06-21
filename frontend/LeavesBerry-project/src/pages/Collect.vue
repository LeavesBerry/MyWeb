<template>
    <div id="page">
		<div class="sidebar">
			<div class="coll-type" id="all">❖所有❖</div>
			<div class="coll-type" id="good">❖商品❖</div>
			<div class="coll-type" id="essay">❖文章❖</div>
			<div class="coll-type" id="resource">❖资源❖</div>
			<div class="coll-type" id="other">❖其他❖</div>
		</div>
		<div id="coll-box">
			<router-link class="colls" v-for="item in navList" :to="item.path" :key="item.name">
				<p id="coll-title">{{ item.name }}</p>
				<div id="colls-function-box">
					<button @click.stop="cancelColl(item.path)" 
					style="color: #73B436; 
					font-size: calc(6 * var(--design-vh));
					padding-bottom: 2%;
					border-left: 1px solid #3A251A;">✦</button>
					<button @click.stop="createQRCode(ROOT + item.path)"
					style="background-image: url('http://localhost:5000/static/resource/images/QR.png');
					background-size: calc(4 * var(--design-vh));
					background-position: calc(1.3 * var(--design-vh)) center;
					"></button>
					<button @click.stop="copyText(item.path)"
					style="background-image: url('http://localhost:5000/static/resource/images/Link.png');
					background-size: calc(6 * var(--design-vh));
					background-position: calc(0.3 * var(--design-vh)) center;
					"></button>
				</div>
			</router-link>
		</div>
	</div>	
	
</template>	
<script setup>
	import api from "../utils/api"
	import { userState, userModule, navbarModule } from "../utils/index";
	import { ref } from "vue"
	import { createHead, useHead } from "@vueuse/head";
	import { copyText, createQRCode } from "../utils/index";

	useHead({
		title:"收藏界面",
		meta:[{name:"description",content:"我的收藏"}]
	});

	const navList = ref([]);
	const ROOT = "http://localhost:5173";
	function createLink(url,title) {
		const navItem = { path: url, name: title }
		navList.value.push(navItem);
	}

	async function getAllColl() {
		if (!userState.isLogined || userModule.userAccessToken == "visitor") 
		{ return null }
		const data = await api.post('/api/getAllColl');
		Object.entries(data.data).forEach(([url,title]) => {
			createLink(url.startsWith(ROOT)?url.slice(ROOT.length) : url,title);
		});
	}

	async function cancelColl(url, title) {
		await navbarModule.toggleColl(url, title)
	}
	
	getAllColl();
</script>

<style>
	:root {
		/* 设计参考视高：457px；原 1vh = 4.57px */
		--design-vh: 4.57px;
		--design-width: 1096.8px;
		/* 457px * 2.4 */
	}
	#coll-box {
		position: absolute;
		top: calc(8 * var(--design-vh));
		right: 30px;
		width: 70vw;
		height: auto;
	}
	.colls {
		width: 70vw;
		height: calc(20 * var(--design-vh));
		box-shadow: 8px 10px 25px rgb(180,145,80,1);
		margin-top: calc(6 * var(--design-vh));
		display: flex;
		border-radius: calc(6 * var(--design-vh));
		text-decoration: none;
		z-index: 2;
		user-select: none;
	}
	#colls-function-box {
		position: relative;
		right: -50%;
		top: 10%;
		height: 10%;
		width: auto;
		display: flex;
		z-index: 3;
	}
	.colls button{
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
	.colls p{
		width:auto;
		height: 40%;
		color:#3A251A;
		font-weight: 800;
		position: relative;
		top: 15%;
		left: 10%;
	}
</style>