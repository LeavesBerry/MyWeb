<template></template>

<script setup>
    import { showTips, userState } from '../utils/index';

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
        const provider = email.split('@')[1]
        const link = emailProvider[provider]
        if (link) {
            location.href = link;
        }
        else {
            showTips("未找到匹配邮箱,请手动访问服务商官网")
        }
    }
</script>