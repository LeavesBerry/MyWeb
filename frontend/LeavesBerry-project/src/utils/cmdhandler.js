import { useGoPage, showTips, createQRCode } from "./base"

const { goPage, backPage, goPageByName } = useGoPage()

export const cmdHandler = {
    tp: goPage(url),
    tip: showTips(text),
    qrcode: createQRCode(url),
},