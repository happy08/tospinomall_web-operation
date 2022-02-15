import CryptoJS from "crypto-js";

// 加密
export const encrypt = (word, keyStr, ivStr) => {
    keyStr = keyStr ? keyStr : "tospinomallkeyiv";
    ivStr = ivStr ? ivStr : "tospinomallkeyiv";
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);
    let srcs = CryptoJS.enc.Utf8.parse(word);

    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
};
// 解密
export const decrypt = (word, keyStr, ivStr) => {
    keyStr = keyStr ? keyStr : "tospinomallkeyiv";
    ivStr = ivStr ? ivStr : "tospinomallkeyiv";
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);

    var decrypt = CryptoJS.AES.decrypt(word, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
};
