<template>
  <div id="navbar">
    <div id="menu-button-box" @click="menuFunction.toggleMenu">
      <span class="star s1">✦</span>
      <span class="star s2">✦</span>
      <span class="star s3">✦</span>
      <span class="star s4">✦</span>
      <span class="star s5">✦</span>
      <span class="star s6">✦</span>
      <span class="star s7">✦</span>
      <span class="star s8">✦</span>

      <svg width="100%" height="100%">
        <line x1="6vh" y1="2.4vh" x2="55vh" y2="2.4vh" stroke="#73B436" stroke-width="1"/>
        <line x1="2.2vh" y1="6vh" x2="2.2vh" y2="85.8vh" stroke="#73B436" stroke-width="1"/>
        <line x1="58.8vh" y1="6vh" x2="58.8vh" y2="85.8vh" stroke="#73B436" stroke-width="1"/>
        <line x1="6vh" y1="89.6vh" x2="55vh" y2="89.6vh" stroke="#73B436" stroke-width="1"/>
        <line x1="2.2vh" y1="22vh" x2="58.8vh" y2="22vh" stroke="#73B436" stroke-width="1"/>
      </svg>

      <div id="menu-function-button-box">
        <button class="menu-function-button">✦收藏夹</button>
        <button class="menu-function-button">pas</button>
        <button class="menu-function-button">pass</button>
        <button class="menu-function-button">pas</button>
        <button class="menu-function-button">pass</button>
        <button class="menu-function-button">pas</button>
        <button class="menu-function-button">pass</button>
        <button class="menu-function-button">pas</button>
        <button class="menu-function-button">pass</button>
        <button class="menu-function-button" style="border-radius:0 0 0 3vh">pas</button>
        <button class="menu-function-button">pass</button>
        <button class="menu-function-button" style="border-radius:0 0 3vh 0">pas</button>
      </div>
    </div>

    <button class="menu-button" id="button-left-up" :style="menuBtnStyle.leftUp"></button>
    <button class="menu-button" id="button-left-down" :style="menuBtnStyle.leftDown"></button>
    <button class="menu-button" id="button-right-up" :style="menuBtnStyle.rightUp"></button>
    <button class="menu-button" id="button-right-down" :style="menuBtnStyle.rightDown"></button>

    <input id="search-input" type="text" placeholder="查找……" v-model="navbarBtnStyle.searchKey" />
    <button id="search-button" @click="navbarFunction.DoSearch">GO</button>

    <div id="navbar-fuction-button-box">
      <button class="function-button" id="scrshot-button" @click="navbarFunction.handleScreenshot">✦</button>
      <button 
        class="function-button" 
        id="collect-button"
        :style="{ color: pageState.isCollected ? '#73B436' : 'rgb(90,25,27)'}"
        @click="navbarFunction.toggleColl"
      >✦</button>
      <button 
        class="function-button" 
        id="share-button" 
        @click="navbarFunction.toggleShare"
        :style="navbarBtnStyle.shareStyle"
      >{{ navbarBtnStyle.shareText }}</button>
      <button 
        class="function-button" 
        id="command-button"
        :style="{ color: !pageState.isCmdClosed ? 'red' : '#5A191B' }"
        @click="navbarFunction.toggleCmdUI"
      >/</button>
    </div>

    <div 
      id="command-menu" 
      :style="{ transform: pageState.isCmdClosed ? 'translateY(-76vh)' : 'none' }"
    >
      <p id="command-title">------------------Command Input------------------</p>
      <button id="close-command" @click="navbarFunction.toggleCmdUI">×</button>
    </div>
  </div>

  <div id="login-window">
		<div id="visitor-choice" @click="loginModule.visitorEnter"></div>
		<div id="member-choice" @click="loginModule.memberEnter">
      <canvas id="member-sign"></canvas>
      <div id="info-input">
        <input 
        id="input-email" 
        v-model="loginModule.inputEmail" 
        placeholder="邮箱"></input>
        <input 
        id="input-code" 
        v-model="loginModule.inputCode"
        placeholder="验证码"></input>
        <input 
        id="input-name" 
        v-model="loginModule.inputName" 
        placeholder="名称"></input>
        <input 
        id="input-password" 
        v-model="loginModule.inputPw" 
        placeholder="密码"></input>
        <button id="send-code" @click="loginModule.sendCode">send code</button>
        <button id="register" @click="loginModule.register">register</button>
        <button id="login" @click="loginModule.login">login</button>
      </div>
    </div>
	</div>
  <!-- iframe 页面容器 -->
  <iframe 
    ref="tframe" 
    id="static-frame" 
    loading="eager" 
    scrolling="no"
  ></iframe>
  <p id="tip">{{ tipText }}</p>
  <router-view />
</template>
<script setup>
import { 
  initUser, debounce, navbarFunction, 
  onGlobalClick, pageState, pageTransition, 
  menuBtnStyle, userStore, menuFunction, loginModule, 
  navbarBtnStyle
} from './utils/CommonScript.js';
import { onMounted, onUnmounted } from 'vue';
// ------------------------------
// 生命周期
// ------------------------------
const resizeHandler = debounce(navbarFunction.scaleNavbar);
onMounted(() => {
    initUser();
    navbarFunction.scaleNavbar();
    window.addEventListener('resize', resizeHandler);
    document.addEventListener('click', onGlobalClick);

    // 页面动画
    window.addEventListener('pageshow', () => {
        if (window !== window.top) return
        const lastPage = localStorage.getItem('lastPage');
        if (lastPage && lastPage !== location.href && !pageState.isTransitioning) {
            pageTransition(lastPage);
        }
        localStorage.setItem('lastPage', location.href);
    })
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    document.removeEventListener('click', onGlobalClick);
})
</script>