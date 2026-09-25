<template>
    <p class="owner" @click="expandCopyRightInfo">•界面版权</p>
    <div id="copyright-info-box" v-if="isCrExpanded">
        <p class="copyright-info">本界面著作者:叶果</p>
        <p class="copyright-info">本界面字体:Harmony OS San<br>字体版权 © 华为终端有限公司</p>
        <p class="copyright-info">---------------</p>
        <p class="copyright-info">{{ crCountDown }}秒后关闭</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { showTips, sleep } from '../utils';

const isCrExpanded = ref(false)
const crCountDown = ref(5)

function expandCopyRightInfo() {
    if (isCrExpanded.value) return;
    showTips('详细版权说明请见<协议>界面')
    isCrExpanded.value = true;
    crCountDown.value = 5;

    (async () => {
        for (let i = 0; i < 5; i++) {
            await sleep(1000)
            console.log(1)
            crCountDown.value -= 1;
        }
        isCrExpanded.value = false;
    })()
    
   
}

</script>

<style scoped>
.owner {
    font-size: 15px;
    position: fixed;
    z-index: 9999;
    left: 4px;
    bottom: 1%;
    color: #3a251a91;
    cursor: pointer;
    font-family: 'Harmony';
    font-weight: 600;
}

#copyright-info-box {
    position: fixed;
    bottom: 1%;
    left: 4px;
    z-index: 10000;
    background-color: var(--primary-color);
    border: 1px solid var(--secondary-color);
    border-radius: 5px;
    padding: 10px;
    text-align: left;
}

.copyright-info {
    font-family: 'Harmony';
    font-weight: 600;
    color: var(--secondary-color);
    font-size: 20px;
}
</style>
