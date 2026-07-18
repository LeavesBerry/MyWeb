<template>
    <div class="slide-page"></div>
    <teleport class="fixed-page" to="#app #app">
        <Sidebar :type-list="cmdTypeList" @change-dir="switchDirContent"></Sidebar>
    </teleport>
</template>

<script setup>
    import Sidebar from '../components/Sidebar.vue';
    import { ref } from 'vue';
    import { switchArrow } from '../utils/index';

    let navList = [{cmd: "",des: "",type: ""},{cmd: "",des: "",type: ""},
        {cmd: "",des: "",type: ""},{cmd: "",des: "",type: ""},
        {cmd: "",des: "",type: ""},{cmd: "",des: "",type: ""},
        {cmd: "",des: "",type: ""},{cmd: "",des: "",type: ""},
        {cmd: "",des: "",type: ""},{cmd: "",des: "",type: ""},
        {cmd: "",des: "",type: ""},{cmd: "",des: "",type: ""}
    ]
    let currentConfig = ref([])
    let groupMap = new Map()

    const cmdTypeList = [
		{ index:0,typeKey:"all",label:"所有",id:"all"},
		{ index:1,typeKey:"route",label:"路由",id:"route"},
		{ index:2,typeKey:"print",label:"打印",id:"print"},
		{ index:3,typeKey:"test",label:"调试",id:"test"},
		{ index:4,typeKey:"cache",label:"缓存",id:"cache"},
        { index:5,typeKey:"other",label:"其他",id:"other"}
	]

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

</script>
