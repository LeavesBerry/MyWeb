<template>
    <component :is="currentComponent" v-if="currentComponent"></component>
    <div v-else>
        <h1>界面不存在</h1>
    </div>
</template>
<script>
import { defineAsyncComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
export default {
    setup() {
        const route = useRoute();
        const pageModules = import.meta.glob('./*.vue')
        const currentComponent = computed(() => {
            const pageName = route.params.page;
            const componentPath = `./${pageName}.vue`;
            if (pageModules[componentPath]) {
                return defineAsyncComponent(pageModules[componentPath]);
            }
            return null;
        });
        return { currentComponent }
    }
}
</script>