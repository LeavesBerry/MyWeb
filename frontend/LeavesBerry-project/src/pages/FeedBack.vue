<template>
    <div class="slide-page">
        <div class="item-box">
            <div id="send" v-show="currentContent == 'send'">
                <p id="tip">•将根据你的账号邮箱自动匹配服务商网站</p>
                <p id="tip">•暂时仅支持中国主流邮箱,海外邮箱不支持</p>
                <input id="link-input" v-model="linkValue" :placeholder="linkContent">
                <button @click="isSearchDone ? jump(linkValue) : identifyUserEmail()">
                    {{ isSearchDone ? "跳转" : "匹配" }}</button>
            </div>
        </div>
    </div>
    <Teleport class="fixed-page" to="#app #app">
        <Sidebar :type-list="moduleTypeList" @change-dir="switchDirContent"></Sidebar>
    </Teleport>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import { showTips, userState, arrowStyle, switchArrow } from '../utils/index';
import { ref, onMounted } from 'vue';

let currentContent = ref("send")
let isSearchDone = ref(false)
let linkValue = ref(null)
let linkContent = ref(`你的邮箱为:${userState.userEmail},点击右侧按钮匹配`)

const moduleTypeList = [
    { index: 0, typeKey: "send", label: "发送", id: "send" },
    { index: 1, typeKey: "model", label: "模板", id: "model" }
]

const emailProvider = {
    // 中国大陆主流邮箱
    "qq.com": "https://mail.qq.com",
    "vip.qq.com": "https://mail.qq.com",
    "foxmail.com": "https://mail.qq.com",
    "163.com": "https://mail.163.com",
    "126.com": "https://mail.126.com",
    "yeah.net": "https://mail.yeah.net",
    "vip.163.com": "https://vip.163.com",
    "vip.126.com": "https://vip.126.com",
    "188.com": "https://mail.188.com",
    "sina.com": "https://mail.sina.com.cn",
    "sina.cn": "https://mail.sina.com.cn",
    "vip.sina.com": "https://vip.sina.com.cn",
    "sohu.com": "https://mail.sohu.com",
    "chinaren.com": "https://mail.sohu.com",
    "aliyun.com": "https://mail.aliyun.com",
    "tom.com": "https://mail.tom.com",
    "vip.tom.com": "https://vip.tom.com",
    "21cn.com": "https://mail.21cn.com",

    // 中国电信运营商邮箱
    "139.com": "https://mail.10086.cn",
    "189.cn": "https://webmail30.189.cn",
    "wo.cn": "https://mail.wo.cn",

    // 中国台湾地区
    "pchome.com.tw": "https://mail.pchome.com.tw",
    "yahoo.com.tw": "https://mail.yahoo.com",
    "seed.net.tw": "https://webmail.seed.net.tw",
}

function identifyUserEmail() {
    const email = userState.userEmail;
    const provider = email.split('@')[1];
    const link = emailProvider[provider];
    if (link) {
        linkValue.value = link;
        isSearchDone.value = true
    }
    else {
        linkValue.value = ""
        linkContent = "未找到匹配邮箱,请手动输入地址跳转"
        isSearchDone.value = true
    }
}

function switchDirContent(sn, type) {
    currentContent.value = type;
}

function jump(link) {
    location.href = link
}

onMounted(() => {
    arrowStyle.transform = "";
})
</script>

<style>
#send #link-input {
    width: 50vw;
}
</style>