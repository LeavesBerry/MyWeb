<template>
    <p id="title">对本站的一些建议或想法</p>
    <div id="title-input-devider"></div>
    <input id="feedback-input" :placeholder="placeholder" v-model="feedback">
    <button id="submit-button" @click="submitFeedback"></button>
    <p v-for="item in tipList">•{{ item.tip }}</p>
</template>

<script setup>
import { tip, apiRequest, userState, disposeReturn, showTips } from '../utils';
import { ref } from 'vue';

let feedback = ref(null)
let placeholder = ref("将你的想法或建议写在这里")
const FEEDBACK_COLDDOWN_TIME = 24
const tipList = [`${FEEDBACK_COLDDOWN_TIME}小时内只能提交一次反馈`, "请不要提交垃圾言论",
    "请不要提交空泛,废话式的反馈", "请不要提交不切实际的建议或想法", "请使用中文撰写反馈",
    "无法保证你的建议或想法一定被完整采纳", "反馈箱不是许愿池,难以过分地遵从你的个人喜好",
    "若你能提交有价值的反馈,我将感激不尽",
    "以上提示均是为了确保本人将精力花在有价值的反馈上以及避免不必要的争端"
]

function submitFeedback() {
    const lastSubmitTime = Number(localStorage.getItem("lastSubmitTime"))
    if (!lastSubmitTime) {
        localStorage.setItem("lastSubmitFeedbackTime", String(Date.now()))
        placeholder.value = `反馈冷却时间还有${(waitTime / 1000 / 3600).toFixed(1)}小时`
        showTips(`反馈冷却时间还有${(waitTime / 1000 / 3600).toFixed(1)}小时`)
        return
    }
    if (Number.isFinite(lastSubmitTime)) {
        const waitTime = Date.now() - lastSubmitTime
        if (waitTime > 0) {
            placeholder.value = `反馈冷却时间还有${(waitTime / 1000 / 3600).toFixed(1)}小时`
            showTips(`反馈冷却时间还有${(waitTime / 1000 / 3600).toFixed(1)}小时`)
            return
        }

        else {
            const res = apiRequest.submitFeedback(userState.userEmail, feedback)
            if (!disposeReturn(res)) {
                placeholder.value = "已成功提交反馈"
                showTips("已成功提交反馈")
                localStorage.setItem("lastSubmitFeedbackTime", String(Date.now()))
            }
        }
    }
}


</script>

<style></style>