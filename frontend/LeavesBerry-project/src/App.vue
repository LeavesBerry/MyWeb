<template>
  <div id="app">

    <div id="page-filter" v-if="pageState.showFilter"></div>

    <div ref="qrBox" style="display: none;"></div>

    <div id="menu-box" 
    
      :class="pageState.isMenuClosed ? 'parent-prevent' : ''" 
      @click="menuModule.toggleMenu" 
      :style="menuModule.menuBox">

      <div id="user_info">
        <img id="avatar" :src="userState.avatarUrl" @click="userModule.changeAvatar">
        <p id="name">{{ userState.userName }}</p>
        <p id="bio" @click="userModule.changeBio">{{ userState.bio }}</p>
        <div id="level"><p>XP: Lv{{ userState.level }}</p>
          <div><line :style="{width: `${(userState.xp / 1000) * 100}%`}"></line></div>
        </div>
      </div>

      
      <span class="star s1">✦</span>
      <span class="star s2">✦</span>
      <span class="star s3">✦</span>
      <span class="star s4">✦</span>
      <span class="star s5">✦</span>
      <span class="star s6">✦</span>
      <span class="star s7">✦</span>
      <span class="star s8">✦</span>

      
      <svg width="100%" height="100%">
        <line x1="27.2px" y1="11px" x2="250px" y2="11px" stroke="#73B436" stroke-width="1"/>
        <line x1="10px" y1="27.42px" x2="10px" y2="392px" stroke="#73B436" stroke-width="1"/>
        <line x1="268px" y1="27.42px" x2="268px" y2="392px" stroke="#73B436" stroke-width="1"/>
        <line x1="27.2px" y1="410px" x2="250" y2="410px" stroke="#73B436" stroke-width="1"/>
        <line x1="10px" y1="100px" x2="268px" y2="100px" stroke="#73B436" stroke-width="1"/>
      </svg>

      <div id="menu-function-button-box">
        <button class="menu-function-button">✦邮箱✦</button>
        <button class="menu-function-button" @click="goPage('/Collect')">✦收藏夹✦</button>
        <button class="menu-function-button">✦设置✦</button>
        <button class="menu-function-button" 
        @click="userState.userAccessToken == 'visitor' ? 
        loginModule.openLoginWindow() : loginModule.logout()">
          {{ userState.userAccessToken == 'visitor' ? '✦登入✦' : '✦登出✦' }}
        </button>
        <button class="menu-function-button">✦反馈箱✦</button>
        <button class="menu-function-button">✦历史✦</button>
        <button class="menu-function-button" @click="goPage('/')">✦主页✦</button>
        <button class="menu-function-button" @click="goPage('/Announce')">✦公告栏✦</button>
        <button class="menu-function-button">✦协议✦</button>
        <button class="menu-function-button" style="border-radius:0 0 0 3vh">✦测试✦</button>
        <button class="menu-function-button">✦指令表✦</button>
        <button class="menu-function-button" style="border-radius:0 0 3vh 0">✦帮助✦</button>
      </div>
    </div>
    
      <button class="menu-button" id="button-left-up" :style="menuModule.leftUp"></button>
      <button class="menu-button" id="button-left-down" :style="menuModule.leftDown"></button>
      <button class="menu-button" id="button-right-up" :style="menuModule.rightUp"></button>
      <button class="menu-button" id="button-right-down" :style="menuModule.rightDown"></button>


    <div id="navbar" :style="navbarModule.navbar">

      <p id="tip" :style="tip.tipStyle">{{ tip.tipText }}</p>

      <input id="search-input" type="text" placeholder="查找……" v-model="navbarModule.searchKey" />
      <button id="search-button" @click="navbarModule.DoSearch">GO</button>

      <div id="navbar-fuction-button-box">
        <!-------------截图-------------->
        <button 
          class="navbar-function-button" 
          id="scrshot-button" 
          @click="navbarModule.handleScreenshot"
        >✦</button>
        <img id="screen-shot" v-if="navbarModule.isScrShot" :src="navbarModule.scrShot">
        <!-------------收藏-------------->
        <button 
          class="navbar-function-button" 
          id="collect-button"
          :style="{ color: pageState.isCollected ? '#73B436' : 'rgb(90,25,27)'}"
          @click="navbarModule.toggleColl"
        >✦</button>
        <!-------------分享-------------->
        <button 
          class="navbar-function-button" 
          id="share-button" 
          @click="navbarModule.toggleShare"
          :style="navbarModule.shareStyle"
        >{{ navbarModule.shareText }}</button>
        <!-------------指令-------------->
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
        <p id="identification">❖访客❖</p>
        <div class="entry-person entry-person--visitor" aria-hidden="true">
          <span class="entry-person__head"></span>
          <span class="entry-person__neck"></span>
          <span class="entry-person__body"></span>
        </div>
      </div>
      <div id="member-entry" @click="loginModule.memberEnter" 
      :style="loginModule.memberEntry"> 
        <p id="identification" :style="loginModule.visitorEntry">❖成员❖</p>     
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
import { useRouter } from 'vue-router';
import { debounce, tip, onGlobalClick,
navbarModule, menuModule, pageState, 
userState, userModule, loginModule, qrBox } from './utils/index';
import { useHead } from "@vueuse/head"
import { routeListener } from './utils/index';

const router = useRouter()

const goPage = (url) => {
  router.push(url);
}

useHead({
  title: () => pageState.currentTitle,
  meta: [{ name:"description", content: () => pageState.currentDesc}]
})

routeListener();
// ------------------------------
// 生命周期
// ------------------------------
onMounted(() => {
    userModule.initUser();
    console.log(userState);
    document.addEventListener('click', onGlobalClick);
})

onUnmounted(() => {
    document.removeEventListener('click', onGlobalClick);
})
</script>