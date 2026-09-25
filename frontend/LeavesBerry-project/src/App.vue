<template>
  <div id="app-root">
    <!-----------------------基本元素-------------------------->
    <!-------------蒙版-------------->
    <div id="page-filter" v-if="pageState.showFilter"></div>
    <!-------------截图弹窗-------------->
    <div id="screen-shot-window" v-if="pageState.isSrcShot">
      <img id="screen-shot" :src="pageState.srcShot">
      <button id="close-screen-shot-window-button" @click="navbarModule.cleanScreenShot">×</button>
    </div>
    <!-------------提示-------------->
    <p class="tip" :style="tip.tipStyle">{{ tip.tipText }}</p>
    <!-------------版权-------------->
    <CopyRight></CopyRight>
    <!-------------固定界面出口-------------->
    <div id="teleport-root"></div>
    


    <!-----------------------菜单-------------------------->
    <div id="menu-box" :class="pageState.isMenuClosed ? 'parent-prevent' : ''" @click="menuModule.toggleMenu"
      :style="pageState.menuBox">

      <!------------------用户信息------------------->
      <div id="user_info">
        <img id="avatar" :src="userState.avatarUrl" @click="userModule.changeAvatar">
        <p id="name">{{ userState.userName }}</p>
        <p id="bio" @click="userModule.changeBio">{{ userState.bio }}</p>
        <div id="level">
          <p>XP: Lv{{ userState.level }}</p>
          <div>
            <line :style="{ width: `${(userState.xp / 1000) * 100}%` }"></line>
          </div>
        </div>
      </div>

      <!------------------菜单边框装饰------------------->
      <!-------------星星-------------->
      <span v-for="index in 8" class="menu-star" :class="`s${index}`" :key="index">
        <svg class="navbar-function-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.8C12.8 7.8 16.2 11.2 21.2 12C16.2 12.8 12.8 16.2 12 21.2C11.2 16.2 7.8 12.8 2.8 12C7.8 11.2 11.2 7.8 12 2.8Z"
            fill="currentColor"></path>
        </svg>
      </span>
      <!-------------线条-------------->
      <svg width="100%" height="100%" class="menu-line">
        <line x1="27.2px" y1="11px" x2="250px" y2="11px" stroke="currentColor" stroke-width="1" />
        <line x1="10px" y1="27.42px" x2="10px" y2="392px" stroke="currentColor" stroke-width="1" />
        <line x1="268px" y1="27.42px" x2="268px" y2="392px" stroke="currentColor" stroke-width="1" />
        <line x1="27.2px" y1="410px" x2="250" y2="410px" stroke="currentColor" stroke-width="1" />
        <line x1="10px" y1="100px" x2="268px" y2="100px" stroke="currentColor" stroke-width="1" />
      </svg>

      <!-------------------菜单按钮------------------->
      <div id="menu-function-button-box">
        <button class="menu-function-button" @click="goPage('/Email')">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <rect x="4" y="7" width="24" height="18" rx="2"></rect>
            <path d="M5 9l11 8 11-8"></path>
          </svg>
          <span>邮箱</span>
        </button>

        <button class="menu-function-button" @click="goPage('/Collect')">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 4.5l3.5 7.1 7.8 1.1-5.6 5.5 1.3 7.8-7-3.7-7 3.7 1.3-7.8-5.6-5.5 7.8-1.1z"></path>
          </svg>
          <span>收藏夹</span>
        </button>

        <button class="menu-function-button" @click="goPage('/Setting')">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="4"></circle>
            <path
              d="M16 3.5v4M16 24.5v4M3.5 16h4M24.5 16h4M7.2 7.2l2.8 2.8M22 22l2.8 2.8M24.8 7.2L22 10M10 22l-2.8 2.8">
            </path>
            <circle cx="16" cy="16" r="9"></circle>
          </svg>
          <span>设置</span>
        </button>

        <button class="menu-function-button" @click="goPage('/')">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M5 15.5L16 6l11 9.5"></path>
            <path d="M8 14v12h16V14M13 26v-7h6v7"></path>
          </svg>
          <span>主页</span>
        </button>

        <button class="menu-function-button" @click="goPage('/Announce')">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M5 14v5h5l11 5V9l-11 5z"></path>
            <path d="M10 19l2 7h4l-2-6M24 12c2 2 2 6 0 8"></path>
          </svg>
          <span>公告栏</span>
        </button>

        <button class="menu-function-button" @click="goPage('/History')">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="11"></circle>
            <path d="M16 9v7l5 3"></path>
          </svg>
          <span>历史</span>
        </button>

        <button class="menu-function-button">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="11"></circle>
            <path d="M12.5 12a3.7 3.7 0 017-1.7c1.4 3.4-3.5 4.1-3.5 7.2"></path>
            <path d="M16 23h.01"></path>
          </svg>
          <span>帮助</span>
        </button>

        <button class="menu-function-button" @click="goPage('/Feedback')">
          <span class="menu-function-symbol" aria-hidden="true">@</span>
          <span>反馈箱</span>
        </button>

        <button class="menu-function-button" @click="goPage('/Protocol')">
          <span class="menu-function-symbol" aria-hidden="true">#</span>
          <span>协议</span>
        </button>

        <button class="menu-function-button" style="border-radius:0 0 0 3vh" @click="goPage('/Sponsor')">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M7 17l6 6L25 9"></path>
          </svg>
          <span>支持</span>
        </button>

        <button class="menu-function-button" @click="goPage('/CmdColumn')">
          <span class="menu-function-symbol menu-function-symbol--code" aria-hidden="true">&lt;/&gt;</span>
          <span>指令表</span>
        </button>

        <button class="menu-function-button" @click="userState.isLogined ?
          loginModule.logout() : (loginModule.openLoginWindow(), loginModule.memberEnter())" 
          style="border-radius:0 0 3vh 0">
          <svg class="menu-function-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M27 16H7M14 9l-7 7 7 7"></path>
          </svg>
          <span>{{ userState.isLogined ? '登出' : '登入' }}</span>
        </button>
      </div>
    </div>

    <!------------------菜单按钮------------------->
    <button class="menu-button" id="button-left-up" :style="pageState.leftUp"></button>
    <button class="menu-button" id="button-left-down" :style="pageState.leftDown"></button>
    <button class="menu-button" id="button-right-up" :style="pageState.rightUp"></button>
    <button class="menu-button" id="button-right-down" :style="pageState.rightDown"></button>

    

    <!-----------------------导航栏-------------------------->
    <div id="navbar" :style="pageState.navbar">

      <!-- 导航栏复古纹样：纯线条 SVG，不遮挡搜索框和功能按钮 -->
      <div class="navbar-decoration" aria-hidden="true">
        <svg class="navbar-ornament" viewBox="0 0 1000 80" preserveAspectRatio="none">
          <path class="ornament-line ornament-line--soft" d="M8 5H992 M8 75H992" />
          <path class="ornament-line" d="M18 9H982 M18 71H982" />

          <g class="ornament-corner ornament-corner--left">
            <path d="M8 5L23 5L34 16L46 5H77L87 15L98 5H124" />
            <path d="M8 75L23 75L34 64L46 75H77L87 65L98 75H124" />

            <path d="M47 9L56 18L66 9M47 71L56 62L66 71" />
            <path d="M74 9L83 18L92 9M74 71L83 62L92 71" />
          </g>

          <g class="ornament-corner ornament-corner--right" transform="translate(1000 0) scale(-1 1)">
            <path d="M8 5L23 5L34 16L46 5H77L87 15L98 5H124" />
            <path d="M8 75L23 75L34 64L46 75H77L87 65L98 75H124" />

            <path d="M47 9L56 18L66 9M47 71L56 62L66 71" />
            <path d="M74 9L83 18L92 9M74 71L83 62L92 71" />
          </g>

          <g class="ornament-mid">
            <path d="M310 40H388 M612 40H690" />
            <path d="M215 40H285 M715 40H785" />
            <path d="M112 40H188 M812 40H888" />
            <path d="M64 40H92 M908 40H936" />
            <path d="M292 40H302 M698 40H708" />
            <path d="M195 40H205 M795 40H805" />
            <path d="M99 40H105 M895 40H901" />
            <path class="ornament-node" d="M304 40l6-5 6 5-6 5z M684 40l6-5 6 5-6 5z" />
            <path class="ornament-node ornament-node--small"
              d="M282 40l3-3 3 3-3 3z M712 40l3-3 3 3-3 3z
                 M185 40l3-3 3 3-3 3z M812 40l3-3 3 3-3 3z
                 M89 40l3-3 3 3-3 3z M908 40l3-3 3 3-3 3z" />
          </g>

          <g class="ornament-center-flourish">
            <path d="M420 40H458 M542 40H580" />
            <path d="M458 40C469 40 472 31 480 27C474 36 477 40 486 40" />
            <path d="M542 40C531 40 528 31 520 27C526 36 523 40 514 40" />
            <path d="M466 40C475 46 480 50 489 51C483 46 480 42 480 38" />
            <path d="M534 40C525 46 520 50 511 51C517 46 520 42 520 38" />
            <path d="M451 40l7-6 7 6-7 6z M535 40l7-6 7 6-7 6z" />
          </g>

          <!-- 中央宝石简化为纯线条棱形 -->
          <g class="ornament-diamond">
            <path d="M500 17L523 40L500 63L477 40Z" />
            <path d="M500 23L517 40L500 57L483 40Z" />
            <path d="M500 29L511 40L500 51L489 40Z" />
            <path d="M500 17V23 M523 40H517 M500 63V57 M477 40H483" />
          </g>
        </svg>
      </div>


      <input id="search-input" type="text" placeholder="查找……" v-model="pageState.searchKey" />
      <button id="search-button" @click="navbarModule.DoSearch">GO</button>

      <div id="navbar-fuction-button-box">
        <!-------------截图-------------->
        <button class="navbar-function-button" id="scrshot-button"
          @click="navbarModule.createScreenshot" aria-label="截图">
          <svg class="navbar-function-icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4.5" y="4.5" width="15" height="15" rx="0.8"
              fill="none" stroke="currentColor" stroke-width="2"></rect>
            <path d="M19.5 4.5V19.5H4.5Z" fill="currentColor"></path>
          </svg>
        </button>
        <!-------------收藏-------------->
        <button class="navbar-function-button" id="collect-button"
          :style="{ color: pageState.isCollected ? 'var(--thirdary-color)' : 'var(--secondary-color)' }"
          @click="navbarModule.toggleColl" aria-label="收藏">
          <svg class="navbar-function-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.8C12.8 7.8 16.2 11.2 21.2 12C16.2 12.8 12.8 16.2 12 21.2C11.2 16.2 7.8 12.8 2.8 12C7.8 11.2 11.2 7.8 12 2.8Z"
              fill="currentColor"></path>
          </svg>
        </button>
        <!-------------分享-------------->
        <button class="navbar-function-button" id="share-button" @click="navbarModule.toggleShare"
          :style="pageState.shareStyle">
          <svg class="navbar-function-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true" style="transform: translateY(3%) scale(0.93);" v-if="pageState.isShareClosed">
            <path d="M18 8a3 3 0 1 0-2.83-4A3 3 0 0 0 15 5c0 .18.02.35.05.52L8.91 9.1A3 3 0 0 0 7 8.4a3 3 0 1 0 1.91 5.31l6.14 3.58A3 3 0 0 0 15 18a3 3 0 1 0 .95-2.18L9.8 12.24A3.2 3.2 0 0 0 10 11c0-.43-.09-.84-.25-1.21l6.12-3.57A3 3 0 0 0 18 8Z"
              fill="currentColor"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" 
            v-if="!pageState.isShareClosed" id="share-qr-icon">    
            <!-- 左上 -->
            <path fill-rule="evenodd" d="M0 0H15V15H0V0ZM3 3V12H12V3H3Z"/>
            <rect x="5" y="5" width="5" height="5"/>
            <!-- 右上 -->
            <path fill-rule="evenodd" d="M17 0H32V15H17V0ZM20 3V12H29V3H20Z"/>
            <rect x="22" y="5" width="5" height="5"/>  
            <!-- 左下 -->
            <path fill-rule="evenodd" d="M0 17H15V32H0V17ZM3 20V29H12V20H3Z"/>
            <rect x="5" y="22" width="5" height="5"/>
            <!-- 右下 -->
            <path fill-rule="evenodd" d="M17 17H32V32H17V17ZM20 20V29H29V20H20Z"/>
            <rect x="23" y="23" width="3" height="3"/>    
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" 
            v-if="!pageState.isShareClosed" id="share-link-icon">
            <path d="M7.2 14.7 L4.9 17 C2.4 19.5 2.4 23.5 4.9 26 C7.4 28.5 11.4 28.5 13.9 26 L20.7 19.2 C23.2 16.7 23.2 12.7 20.7 10.2 C18.8 8.3 16 7.8 13.6 8.9"
              stroke="currentColor" stroke-width="3.4" stroke-linecap="square" stroke-linejoin="round"/>
            <path d="M11.4 17.8 C9.1 15.3 9.2 11.5 11.6 9.1 L17.8 2.9 C20.3 0.4 24.3 0.4 26.8 2.9 C29.3 5.4 29.3 9.4 26.8 11.9 L23.9 14.8"
              stroke="currentColor" stroke-width="3.4" stroke-linecap="square" stroke-linejoin="round"/>
            <path d="M18.1 24.7H29" stroke="currentColor" stroke-width="3.4" stroke-linecap="square"/>
          </svg>   
        </button>
        <!-------------指令-------------->
        <button class="navbar-function-button" id="command-button"
          :style="{ color: !pageState.isCmdClosed ? 'red' : 'var(--secondary-color)' }"
          @click="navbarModule.toggleCmdUI" aria-label="指令">
          <svg class="navbar-function-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.5 21L15.5 3"
              fill="currentColor" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>
    </div>
    <!------------------指令面板------------------->
    <div id="command-menu" v-if="!pageState.isCmdClosed">
      <p class="none-select" id="command-title">指令面板</p>
      <button class="none-select" id="close-command" @click="navbarModule.toggleCmdUI">×</button>
      <input id="cmd-input" v-model="pageState.cmdInputValue" @keyup.enter="navbarModule.executeCmd(cmdOutputBox)"
      placeholder="请输入指令 | 按键盘<Enter>或右侧<RUN>执行">
      <button class="none-select"
      id="execute-cmd-button" @click="navbarModule.executeCmd(cmdOutputBox)">RUN</button>
      <div id="cmd-output-box" ref="cmdOutputBox">
        <p id="cmd-output">{{ pageState.cmdOutputText }}</p>
      </div>
    </div>
    


    <!-----------------------登录弹窗-------------------------->
    <div id="login-window" :style="loginModule.window">
      <!--复用visitorEntry属性更为方便-->
      <div id="enter-tip" :style="loginModule.visitorEntry">
        <p>-----选择您进入本站的方式-----</p>
      </div>

      <!-------------访客登录-------------->    
      <div id="visitor-entry" @click="loginModule.visitorEnter" :style="loginModule.visitorEntry">
        <p id="identification">❖访客❖</p>
        <div class="entry-person entry-person--visitor" aria-hidden="true">
          <span class="entry-person__head"></span>
          <span class="entry-person__neck"></span>
          <span class="entry-person__body"></span>
        </div>
      </div>
      <!-------------成员登录--------------> 
      <div id="member-entry" @click="loginModule.memberEnter" :style="loginModule.memberEntry">
        <p id="identification" :style="loginModule.visitorEntry">❖成员❖</p>
        <div class="entry-person entry-person--member" aria-hidden="true" :style="loginModule.memberSign">
          <span class="entry-person__sparkle"></span>
          <span class="entry-person__head"></span>
          <span class="entry-person__neck"></span>
          <span class="entry-person__body"></span>
        </div>
        <div id="info-input-box" :style="loginModule.infoInput">
          <button id="rechoose" @click.stop="loginModule.rechoose">返回</button>
          <input id="input-email" v-model="loginModule.inputEmail" placeholder="邮箱"></input>
          <input id="input-code" v-model="loginModule.inputCode" placeholder="验证码 | 仅注册须填"
          v-if="loginModule.isCodeSent"></input>
          <input id="input-name" v-model="loginModule.inputName" placeholder="名称 | 仅注册须填"
          v-if="loginModule.isCodeSent"></input>
          <input id="input-password" v-model="loginModule.inputPw" placeholder="密码"></input>
          <button id="register" @click="loginModule.isCodeSent ? loginModule.register() : loginModule.sendCode()">
            {{ loginModule.isCodeSent ? "验证" : "注册" }}</button>
          <button id="login" @click="loginModule.login">登录</button>
        </div>
      </div>
    </div>



    <!-----------------------路由出口-------------------------->
    <router-view v-slot="{ Component, route }">
      <transition name="page-cover-slide">
        <div :key="route.path" class="page-cover-slide-view">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  debounce, tip, onGlobalClick, useGoPage,
  navbarModule, menuModule, pageState, routeListener,
  userState, userModule, loginModule, startTimer
} from './utils/index';
import { useHead } from "@vueuse/head"
import CopyRight from './components/CopyRight.vue';

const { goPage, backPage, goPageByName } = useGoPage()

const cmdOutputBox = ref(null)

useHead({
  title: () => pageState.currentTitle,
  meta: [{ name: "description", content: () => pageState.currentDesc }]
})

// ------------------------------
// 生命周期
// ------------------------------
onMounted(async () => {
  routeListener()
  startTimer()
  await userModule.initUser()
  if (userState.isLogined) {
    await navbarModule.getAllColl()
    // 开始跨端监听
    navbarModule.connectCollSSE()
  }
  document.addEventListener(
    'click',
    onGlobalClick
  )
})


onUnmounted(() => {
  navbarModule.disconnectCollSSE()
  document.removeEventListener(
    'click',
    onGlobalClick
  )
})
</script>