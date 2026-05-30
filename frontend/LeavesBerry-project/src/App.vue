<template>
  <div id="app">
    <div id="navbar">
      <div id="menu-box" @click="menuModule.toggleMenu" :style="menuModule.menuBox">
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

      <button class="menu-button" id="button-left-up" :style="menuModule.leftUp"></button>
      <button class="menu-button" id="button-left-down" :style="menuModule.leftDown"></button>
      <button class="menu-button" id="button-right-up" :style="menuModule.rightUp"></button>
      <button class="menu-button" id="button-right-down" :style="menuModule.rightDown"></button>

      <input id="search-input" type="text" placeholder="查找……" v-model="navbarModule.searchKey" />
      <button id="search-button" @click="navbarModule.DoSearch">GO</button>

      <div id="navbar-fuction-button-box">
        <button 
          class="navbar-function-button" 
          id="scrshot-button" 
          @click="navbarModule.handleScreenshot"
        >✦</button>
        <button 
          class="navbar-function-button" 
          id="collect-button"
          :style="{ color: pageState.isCollected ? '#73B436' : 'rgb(90,25,27)'}"
          @click="navbarModule.toggleColl"
        >✦</button>
        <button 
          class="navbar-function-button" 
          id="share-button" 
          @click="navbarModule.toggleShare"
          :style="navbarModule.shareStyle"
        >{{ navbarModule.shareText }}</button>
        <button 
          class="navbar-function-button" 
          id="command-button"
          :style="{ color: !pageState.isCmdClosed ? 'red' : '#5A191B' }"
          @click="navbarModule.toggleCmdUI"
        >/</button>
      </div>

      <div 
        id="command-menu" 
        :style="{ transform: pageState.isCmdClosed ? 'translateY(-76vh)' : 'none' }">
        <p id="command-title">------------------Command Input------------------</p>
        <button id="close-command" @click="navbarModule.toggleCmdUI">×</button>
      </div>
    </div>

    <div id="login-window" :style="loginModule.window">
      <div id="visitor-entry" @click="loginModule.visitorEnter"></div>
      <div id="member-entry" @click="loginModule.memberEnter" 
      :style="loginModule.memberEntry">
        
        <canvas id="member-sign" :style="loginModule.memberSign"></canvas>
        <div id="info-input" :style="loginModule.infoInput">
          <button 
            id="rechoose" 
            @click.stop="loginModule.rechoose"
          >返回</button>
          <input 
            id="input-email" 
            v-model="loginModule.inputEmail" 
            placeholder="邮箱"
          ></input>
          <input 
            id="input-code" 
            v-model="loginModule.inputCode"
            placeholder="验证码"
          ></input>
          <input 
            id="input-name" 
            v-model="loginModule.inputName" 
            placeholder="名称"
          ></input>
          <input 
            id="input-password" 
            v-model="loginModule.inputPw" 
            placeholder="密码"
          ></input>
          <button id="send-code" @click="loginModule.sendCode">send code</button>
          <button id="register" @click="loginModule.register">register</button>
          <button id="login" @click="loginModule.login">login</button>
        </div>
      </div>
    </div>

    <p id="tip">{{ tipText }}</p>


    

    <router-view v-slot="{ Component, route }">
      <transition name="page-cover-slide">
        <div :key="route.fullPath" class="page-cover-slide-view">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { 
  debounce, navbarModule, 
  onGlobalClick, pageState,
  userStore, menuModule, loginModule, 
} from './utils/CommonScript.js';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const tImg = ref(null);
window.tImg = tImg;

// ------------------------------
// 生命周期
// ------------------------------
const resizeHandler = debounce(navbarModule.scaleNavbar);
onMounted(() => {
    
    userStore.initUser();
    navbarModule.scaleNavbar();
    window.addEventListener('resize', resizeHandler);
    document.addEventListener('click', onGlobalClick);
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    document.removeEventListener('click', onGlobalClick);
})
</script>

<style>
/* 页面跳转动画：新页面从底部滑入并覆盖旧页面 */
#app {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  isolation: isolate;
}

.page-cover-slide-view {
  position: fixed;
  inset: 0;
  width: 100vw;
  min-height: 100vh;
  overflow: auto;
  z-index: 10;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: paint;
}

/* 新页面入场：只动画 transform，避免触发布局重排，性能更好 */
.page-cover-slide-enter-active {
  z-index: 20;
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.page-cover-slide-enter-from {
  transform: translate3d(0, 100%, 0);
}

.page-cover-slide-enter-to {
  transform: translate3d(0, 0, 0);
}

/* 旧页面不移动，留在下层，让新页面覆盖它 */
.page-cover-slide-leave-active {
  z-index: 10;
  transition: none;
}

.page-cover-slide-leave-from,
.page-cover-slide-leave-to {
  transform: translate3d(0, 0, 0);
}
</style>
