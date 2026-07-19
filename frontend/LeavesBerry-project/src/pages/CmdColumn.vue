<template>
    <div class="slide-page">
		<div class="item-box">
			<ExTextarea v-for="item in currentConfig"
			:title="item.cmd" :text="item.des" custom-class="textarea"
			title-class="textarea-title" button-class="textarea-button"
			content-class="textarea-content"></ExTextarea>
			<p class="no-item-tip none-select" 
			v-if="currentConfig.length == 0">暂无该类指令( •̀ ω •́ )✧</p>
			<!--直接用refresh-tip更方便-->
			<p class="refresh-tip none-select"
			v-if="currentConfig.length !== 0">更多指令,敬请期待( •̀ ω •́ )✧</p>
		</div>
    </div>
    <teleport class="fixed-page" to="#app #app">
        <Sidebar :type-list="cmdTypeList" @change-dir="switchDirConfig"></Sidebar>
    </teleport>
</template>

<script setup>
    import Sidebar from '../components/Sidebar.vue';
	import ExTextarea from '../components/ExTextarea.vue';
    import { ref, onMounted } from 'vue';
    import { switchArrow, classifyGroup, cmdInfoList, arrowStyle } from '../utils/index';

    let navList = cmdInfoList
    let currentConfig = ref([])
    let groupMap = classifyGroup(cmdInfoList, "type")

    const cmdTypeList = [
		{ index:0,typeKey:"all",label:"所有",id:"all"},
		{ index:1,typeKey:"route",label:"路由",id:"route"},
		{ index:2,typeKey:"print",label:"打印",id:"print"},
		{ index:3,typeKey:"test",label:"调试",id:"test"},
		{ index:4,typeKey:"cache",label:"缓存",id:"cache"},
        { index:5,typeKey:"other",label:"其他",id:"other"}
	]

    function switchDirConfig(sn, type) {
		switchArrow(sn);
		if (type === "all") {
			currentConfig.value = navList
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
		currentConfig.value = navList;
	})
</script>

<style>
	.textarea {
		width: 70vw;
		height: auto;
		flex-direction: column;
		padding-top: calc(1 * var(--design-vh));
		padding-bottom: calc(2 * var(--design-vh));
		box-shadow: 8px 10px 25px rgb(180, 145, 80, 1);
		position: relative;
		margin-top: calc(3 * var(--design-vh));
		display: flex;
		border-radius: calc(6 * var(--design-vh));
		text-decoration: none;
		z-index: 2;
		-webkit-user-select: none;
		user-select: none;
	}

	.textarea-title {
		width: fit-content;
		height: auto;
		font-size: calc(6 * var(--design-vh));
		color: #3A251A;
		font-weight: 800;
		position: relative;
		top: 0;
		left: 7%;
	}

	.textarea-button {
		position:absolute;
		right:5%;
		top: calc(-2 * var(--design-vh));
		height: calc(10 * var(--design-vh));
		width: auto;
		background: none;
		border: none;
		font-size: calc(10 * var(--design-vh));
		font-weight: 500;
		color:#3A251A;
	}

	.textarea-content {
		position: relative;
		left: 7%;
		top: 8px;
		width: 86%;
		height:fit-content;
		padding-top: 1.5px;
		border-top: 1px solid #3A251A;
		color: #3A251A;
		text-align: left;
	}
</style>
