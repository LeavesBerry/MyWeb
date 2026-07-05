import { ref, reactive } from 'vue'

export const arrowStyle = reactive({
    transform: {}
})

export function switchArrow(sn) {
    const arrowTransfrom = 188 * sn;
    arrowStyle.transform = { transform: `translateY(${arrowTransfrom}%)` }
}