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

    <input id="search-input" type="text" placeholder="查找……" v-model="searchKey" />
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
        :style="shareStyle"
      >{{ shareText }}</button>
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
		<div id="visitor"></div>
		<div id="member">
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
  <router-view />
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { userStore, testError, axiosRequest } from './utils/CommonScript.js';

// 搜索
const searchKey = ref('')

// 页面状态
const pageState = reactive({
  isMenuClosed: true,
  isCollected: false,
  isShareClosed: true,
  isCmdClosed: true,
  isTransitioning: false,
  currentUrl: location.href,
  currentTitle: document.title
})

// 菜单按钮样式
const menuBtnStyle = reactive({
  leftUp: '',
  leftDown: '',
  rightUp: '',
  rightDown: ''
})

// 分享按钮
const shareStyle = ref({})
const shareText = ref('➹')

// iframe 引用
const tframe = ref(null)

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    const area = document.createElement('textarea')
    area.value = text
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    document.body.removeChild(area)
  }
}

function debounce(fn, delay = 100) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ------------------------------
// 菜单切换
// ------------------------------
const menuFunction = {
  toggleMenu() {
    const menuBox = document.querySelector('#menu-button-box')
    if (pageState.isMenuClosed) {
      menuBtnStyle.leftUp = 'transform:scale(0.8)'
      menuBtnStyle.leftDown = 'transform:translateY(68.65vh) scale(0.8)'
      menuBtnStyle.rightUp = 'transform:translateX(44vh) scale(0.8)'
      menuBtnStyle.rightDown = 'transform:translate(44vh,68.65vh) scale(0.8)'
      menuBox.style.cssText = 'z-index:21;opacity:1;transform:scale(0.8,0.8)'
    } else {
      menuBtnStyle.leftUp = ''
      menuBtnStyle.leftDown = ''
      menuBtnStyle.rightUp = ''
      menuBtnStyle.rightDown = ''
      menuBox.style.cssText = 'z-index:23;opacity:0;transform:scale(0.1,0.067)'
    }
    pageState.isMenuClosed = !pageState.isMenuClosed
  }
}

// ------------------------------
// 页面切换动画
// ------------------------------
function pageTransition(href) {
  if (pageState.isTransitioning) return
  pageState.isTransitioning = true

  const frame = tframe.value
  frame.onload = null
  frame.style.transition = '-webkit-mask-image 0s ease, mask-image 0s ease';
  frame.style.webkitMaskImage = 'linear-gradient(to top left, transparent 0%, #000, 100%)';
  frame.style.maskImage = 'linear-gradient(to top left, transparent 0%, #000, 100%)';
  frame.offsetWidth;
  frame.src = href;
  frame.style.transition = '-webkit-mask-image 0.8s ease, mask-image 0.8s ease';

  frame.onload = function () {
    try {
      const win = frame.contentWindow;
      win.clearInterval?.();
      win.clearTimeout?.();
      win.cancelAnimationFrame?.();
    } catch (e) {}
  }

  requestAnimationFrame(() => {
    frame.style.webkitMaskImage = 'linear-gradient(to top left, transparent 100%, #000, 0%)';
    frame.style.maskImage = 'linear-gradient(to top left, transparent 100%, #000, 0%)';
  })

  setTimeout(() => {
    pageState.isTransitioning = false;
  }, 800)
}

// ------------------------------
// 收藏功能
// ------------------------------
const navbarFunction = {
  async initColl() {
    const collCacheKey = `coll_${pageState.currentUrl}`;
    const cached = localStorage.getItem(collCacheKey);
    if (cached !== null) {
      pageState.isCollected = cached === 'true'
      return
    }
    try {
      const data = await axiosRequest.initColl(pageState.currentUrl)
      if (!testError(data)) {
        pageState.isCollected = data.is_collected
        localStorage.setItem(collCacheKey, data.is_collected)
      }
    } catch (e) {}
  },

  async toggleColl() {
    if (!userStore.isLogined) return
    try {
      const data = await axiosRequest.toggleColl(pageState.currentUrl, pageState.currentTitle);
      if (!testError(data)) {
        pageState.isCollected = data.is_collected
        localStorage.setItem(`coll_${pageState.currentUrl}`, data.is_collected)
      }
    } catch (e) {}
  },

  // ------------------------------
  // 分享功能
  // ------------------------------
  toggleShare(e) {
    if (!pageState.isShareClosed && e) {
      const btn = document.querySelector('#share-button');
      const rect = btn.getBoundingClientRect();
      if (e.clientX - rect.left >= rect.width / 2) {
        copyText(pageState.currentUrl);
      }
    }

    pageState.isShareClosed = !pageState.isShareClosed
    if (!pageState.isShareClosed) {
      shareStyle.value = {
        width: '9vh',
        paddingLeft: '4.5vh',
        paddingRight: '4.5vh',
        backgroundImage: 'url("static/Picture/QR.png"),url("static/Picture/Link.png")',
        backgroundPosition: '1vh center, right 1vh center',
        backgroundSize: '3vh 3vh, 3vh 3vh',
        backgroundRepeat: 'no-repeat,no-repeat'
      }
      shareText.value = '';
    } else {
      shareStyle.value = {};
      shareText.value = '➹';
    }
  },

  // ------------------------------
  // 命令面板
  // ------------------------------
  toggleCmdUI() {
    pageState.isCmdClosed = !pageState.isCmdClosed;
  },

  // ------------------------------
  // 截图（懒加载）
  // ------------------------------
  html2canvasLoaded: false,
  async handleScreenshot() {
    if (html2canvasLoaded) return;
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      script.onload = () => {
        html2canvasLoaded = true;
        resolve();
      }
      document.head.appendChild(script);
    })
  },
  // ------------------------------
  // 导航栏缩放
  // ------------------------------
  scaleNavbar() {
    const navbar = document.querySelector('#navbar');
    if (!navbar) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = (vw / vh / 2.4).toFixed(2);
    const unscale = 1 / scale * vw;
    navbar.style.transform = `scale(${scale})`;
    navbar.style.width = `${unscale}px`;
  },

  // 搜索
  DoSearch() {
    console.log('搜索:', searchKey.value);
  }
}


// ------------------------------
// 初始化用户
// ------------------------------
async function initUser() {
    userStore.userToken = userStore.getToken()
    if (!userStore.userToken) {
        loginModule.openLogin();
        return;
    }
    else if (userStore.userToken == 'vistor') {
      return;
    }
    const cacheData = userStore.getCache()
    if (cacheData) {
        userStore.isLogined = true;
        userStore.userName = cacheData.user_name;
        userStore.userId = cacheData.user_id;
        userStore.userEmail = cacheData.user_email;
        await initColl();
        return;
    }
    try {
        const data = await axiosRequest.getUserInfo();
        if (testError(data)) {
            userStore.clear();
            loginModule.openLogin();
            return;
        }
        userStore.isLogined = true;
        userStore.userName = data.user_name;
        userStore.userId = data.user_id;
        userStore.userEmail = data.user_email;
        userStore.setCache(data);
        await initColl()
    } catch (e) {
        userStore.clear();
        loginModule.openLoginWindow();
    }
}

// ------------------------------
// 登录模块
// ------------------------------

const loginModule = reactive({
  inputCode: ref(''),
  inputEmail: ref(''),
  inputName: ref(''),
  inputPw: ref(''),
//  if (!inputEmail || !sendCodeButton) return
  openLoginWindow() {
    const loginWindow = document.querySelector('#login-window');
    loginWindow.style.display = 'block';
  },

  closeLoginWindow() {
    const loginWindow = document.querySelector('#login-window');
    loginWindow.style.display = 'none';
  },

  visitorEnter() {
    userStore.userToken = 'vistor';
    userStore.userId = 0;
    this.closeLoginWindow();
  },

  memberEnter() {
    const member = document.querySelector('#member');
    const memberSign = document.querySelector('#member-sign');
    const infoInput = document.querySelector('#info-input');
    member.style.transform = 'scale(2.2,1)';
    memberSign.style.visibility = 'hidden';
    infoInput.style.visibility = 'visible';
  },

  rechoose() {
    const member = document.querySelector('#member');
    const memberSign = document.querySelector('#member-sign');
    const infoInput = document.querySelector('#info-input');
    member.style.transform = 'scale(1,1)';
    setTimeout(() => {
      memberSign.style.visibility = 'hidden';
      infoInput.style.visibility = 'visible';
    },500);
  },

  async sendCode() {
    const email = this.inputEmail;
      if (!email) return;
        testError(await axiosRequest.sendCode(email));
  },

  async register() {
    const data = {
      user_name: this.inputName,
      user_email: this.inputEmail,
      code: this.inputCode,
      password: this.inputPw
    }
    testError(await axiosRequest.register(data));
  },

  async login () {
    const data = {
      user_email: this.inputEmail,
      password: this.inputPw
    }
    const result = await axiosRequest.login(data);
    if (testError(result)) return;
    userStore.setToken(result.user_token);
    await initUser();
    this.closeLoginWindow();
    await initColl();
  }
    
})
// ------------------------------
// 全局点击关闭
// ------------------------------
function onGlobalClick(e) {
  const shareBtn = document.querySelector('#share-button');
  const menuBox = document.querySelector('#menu-button-box');
  const isClickShare = shareBtn?.contains(e.target);
  const isClickMenu = menuBox?.contains(e.target);

  if (!pageState.isShareClosed && !isClickShare) {
    navbarFunction.toggleShare();
  }
  if (!pageState.isMenuClosed && !isClickMenu) {
    menuFunction.toggleMenu();
  }
}

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