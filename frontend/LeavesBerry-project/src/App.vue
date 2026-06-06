<template>
  <div id="app">
    <div id="navbar">

      <p id="tip" :style="tip.tipStyle">{{ tip.tipText }}</p>

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
      <!--复用visitorEntry属性更为方便-->
      <div id="enter-tip" :style="loginModule.visitorEntry">
        <p>-----选择您进入本站的方式-----</p>
      </div>
      
      <div id="visitor-entry" @click="loginModule.visitorEnter"
      :style="loginModule.visitorEntry"
      >
        
        <div class="entry-person entry-person--visitor" aria-hidden="true">
          <span class="entry-person__head"></span>
          <span class="entry-person__neck"></span>
          <span class="entry-person__body"></span>
        </div>
      </div>
      <div id="member-entry" @click="loginModule.memberEnter" 
      :style="loginModule.memberEntry">      
        <div 
          class="entry-person entry-person--member" 
          aria-hidden="true"
          :style="loginModule.memberSign" >
          <span class="entry-person__sparkle"></span>
          <span class="entry-person__head"></span>
          <span class="entry-person__neck"></span>
          <span class="entry-person__body"></span>
        </div>
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
            placeholder="验证码--仅注册须填"
          ></input>
          <input 
            id="input-name" 
            v-model="loginModule.inputName" 
            placeholder="名称--仅注册须填"
          ></input>
          <input 
            id="input-password" 
            v-model="loginModule.inputPw" 
            placeholder="密码"
          ></input>
          <button id="register" @click="loginModule.register">注册</button>
          <button id="login" @click="loginModule.login">登录</button>
        </div>
      </div>
    </div>


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
import axios from 'axios';
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce, tip, onGlobalClick,
navbarModule, menuModule, pageState, 
userStore, loginModule } from './utils';



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