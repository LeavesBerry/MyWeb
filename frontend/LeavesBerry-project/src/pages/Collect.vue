<template>
	<!--受到transform影响,不要把fixed,拖拽,需获取坐标的点击等放入-->
	<div class="slide-page">
		<div class="item-box">
			<p class="no-item-tip none-select" v-if="currentConfig.length == 0" @click="getAllColl">暂无收藏( •̀ ω •́
				)✧<br>点击此处刷新</p>
			<div class="items" v-for="item in currentConfig" :key="item.title">
				<p class="item-title" @click="goPage(item.url)">{{ item.title }}</p>
				<div id="colls-function-box">
					<button @click.stop.prevent="cancelColl(`${item.url}`)" style="color: #73B436; 
					font-size: calc(6 * var(--design-vh));
					padding-bottom: 2%;
					border-left: 1px solid #3A251A;">✦</button>
					<button @click.stop.prevent="createQRCode(`${ROOTPATH}${item.url}`)" style="background-image: url('http://localhost:5000/static/resource/images/QR.png');
					background-size: calc(4 * var(--design-vh));
					background-position: calc(1.3 * var(--design-vh)) center;
					"></button>
					<button @click.stop.prevent="copyText(item.url)" style="background-image: url('http://localhost:5000/static/resource/images/Link.png');
					background-size: calc(6 * var(--design-vh));
					background-position: calc(0.3 * var(--design-vh)) center;
					"></button>
				</div>
			</div>
			<p class="refresh-tip none-select" v-if="currentConfig.length !== 0" @click="getAllColl">
				若缺少收藏<br>可尝试点击此处刷新界面( •̀ ω •́ )</p>
		</div>
	</div>
	<teleport class="fixed-page" to="#app #app">
		<sidebar :type-list="collTypeList" @change-dir="switchDirConfig"></sidebar>
	</teleport>

</template>
<script setup>
import Sidebar from "../components/Sidebar.vue";
import api from "../utils/api"
import {
	userState, copyText, createQRCode, classifyGroup,
	switchArrow, arrowStyle, showTips, useGoPage, axiosRequest,
	disposeReturn
} from "../utils/index";
import { ROOTPATH } from "../router/index.js";
import { ref, Teleport, watch, onMounted } from "vue"

let navList = ref([]);
let currentConfig = ref([])
let groupMap = null
const { goPage, backPage, goPageByName } = useGoPage()

const collTypeList = [
	{ index: 0, typeKey: "all", label: "所有", id: "all" },
	{ index: 1, typeKey: "essay", label: "文章", id: "essay" },
	{ index: 2, typeKey: "good", label: "商品", id: "good" },
	{ index: 3, typeKey: "resourse", label: "资源", id: "resourse" },
	{ index: 4, typeKey: "other", label: "其他", id: "other" }
]

async function getAllColl() {
	if (!userState.isLogined || userState.userAccessToken == "visitor") { return null }
	const allColls = JSON.parse(localStorage.getItem('all_colls'))
	if (userState.isChangedColl == "false" && allColls) {
		navList.value = allColls;
	}
	else {
		const res = await api.post('/api/getAllColl');
		navList.value = res.data;
		localStorage.setItem('all_colls', JSON.stringify(res.data));
		userState.isChangedColl = "false"
	}
	currentConfig.value = navList.value;
	groupMap = classifyGroup(navList.value, 'type')
}

async function cancelColl(url) {
	if (!userState.isLogined || userState.userAccessToken == 'visitor') return
	try {
		navList.value = navList.value.filter((item) => {
			return item.url !== url
		})
		currentConfig.value = currentConfig.value.filter((item) => {
			return item.url !== url
		})
		localStorage.setItem('all_colls', JSON.stringify(navList.value))
		groupMap = classifyGroup(navList.value, 'type')
		url = `${ROOTPATH}${url}`
		const res = await axiosRequest.toggleColl(url);
		if (!disposeReturn(res)) {
			localStorage.setItem(`coll_${url}`, res.is_collected)
		}
	} catch (e) {
		showTips(e)
	}
}

function switchDirConfig(sn, type) {
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

onMounted(() => {
	arrowStyle.transform = "";
	getAllColl();
})

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

.items button {
	width: calc(8 * var(--design-vh));
	height: calc(6 * var(--design-vh));
	background-color: rgba(0, 0, 0, 0);
	background-repeat: no-repeat;
	color: #3A251A;
	margin-left: calc(1 * var(--design-vh));
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	border-right: 1px solid #3A251A;
	border-top: none;
	border-bottom: none;
	border-left: none;
	z-index: 4;
}
</style>