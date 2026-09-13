<template>
    <div class="page" id="sponsor-page">
		<div class="slide-page">
            <div class="content-container">
                <p>为本站运行费用提供支持者的名单</p>
                <p>按名称首字母排序</p>
            </div>
            <div id="sponsor-box">
                <div class="sponsor-card" v-for="item, index in sponsorList" :key="index">
                    <p>{{ item }}</p>
                    <div id="sponsor-card-decoration" :style="{backgroundColor: sponsorColorMap[item] 
                        ?? 'var(--secondary-color)'}"></div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

let isUnmounted = false

const sponsorList = ref([])
const sponsorColorMap = ref({})

function applySponsorList(data) {
    if (isUnmounted) return

	const map = Object.prototype.toString.call(data) === '[object Object]' ? data : {}

    sponsorColorMap.value = map

    let list = []

    for (const key in map) {
        list.push(key)
    }
    sponsorList.value = list
}

async function getSponsor() {
    const sponsorCache = sessionStorage.getItem('sponsor_cache')

    if (sponsorCache && sponsorCache.length !== 0) {
        try {
            applySponsorList(JSON.parse(sponsorCache))
            return
        } catch {
            sessionStorage.removeItem('sponsor_cache')
        }
        
    }

    try {
        const res = await fetch('/text/sponsor_list.json')
        const data = await res.json()
        applySponsorList(data)
        sessionStorage.setItem("sponsor_cache", JSON.stringify(data))
    } catch {
		const res = await apiRequest.getTextResourse("sponsorList")
		if (isUnmounted) return

		if (!disposeReturn(res)) {
			applySponsorList(res)
			sessionStorage.setItem("sponsor_cache", JSON.stringify(res))
		}
	}
}

onMounted(async() => {
    await getSponsor()
})

onUnmounted(() => {
    isUnmounted = true
})
</script>

<style scoped>
#sponsor-box {
    position: absolute;
    margin-top: 20vh;
    left: 2.5vw;
    width: 95vw;
    display: grid;
    gap: 3vw;
    grid-template-columns: 1fr 1fr 1fr;
}

.sponsor-card {
    height: calc(25 * var(--design-vh, 4.57px));
    border-radius: calc(8 * var(--design-vh));
    background-color: var(--primary-color);
    box-shadow: 8px 10px 25px rgb(180, 145, 80, 1);
    border: none;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
}

.sponsor-card p {
    font-size: calc(8 * var(--design-vh, 4.57px));
    color: var(--secondary-color);
    font-weight: 800;
    position: absolute;
    top: 20%;
    left: 8%;
}

.sponsor-card #sponsor-card-decoration {
    position: absolute;
    right: -13%;
    top: 65%;
    transform: rotate(-15deg);
    width: 80%;
    height: 20%;
}

.content-container {
    height: 11vh;
    padding-bottom: 20px;
    margin-top: calc(2 * var(--design-vh, 4.57px));
    justify-items: center;
}

.content-container p {
    color: var(--secondary-color);
    height: 12px;
    font-size: 25px;
    font-weight: 500;
    padding: 15px 0;
}
</style>