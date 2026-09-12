<template>
    <div class="page" id="sponsor-page">
		<div class="slide-page">
            <div id="sponsor_box">
                <p v-for="item in sponsorList">{{ item }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

let isUnmounted = false

const sponsorList = ref([])

function applySponsorList(data) {
    if (isUnmounted) return

	const list = Array.isArray(data) ? data : []

    sponsorList.value = list
}

async function getSponsor() {
    const sponsorCache = sessionStorage.getItem('sponsor_cache')

    if (sponsorCache) {
        try {
            applySponsorList(JSON.parse(sponsorCache))
            return
        } catch {
            sessionStorage.removeItem('sponsor_cache')
        }
        
    }

    try {
        const res = await fetch('/text/sponsor_list.json')
        const data = res.json()
        applySponsorList(data)
    } catch {
		const res = await apiRequest.getTextResourse("sponsorList")
		if (isUnmounted) return

		if (!disposeReturn(res)) {
			applySponsorList(res)
			sessionStorage.setItem("sponsor_cache", JSON.stringify(sponsorList.value))
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