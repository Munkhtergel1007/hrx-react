var {EventEmitter} = require('fbemitter');
let config = {};
let configList = {
    emitter: new EventEmitter(),
    host:process.env.NODE_ENV == 'development' ? 'http://hrx.com' : 'https://tatatunga.mn',
    hostMedia:process.env.NODE_ENV == 'development' ? 'http://cdn.hrx.com' : 'https://cdn.tatatunga.mn',
    redirectHostHead:process.env.NODE_ENV == 'development' ? 'http://' : 'https://',
    redirectHostTail:process.env.NODE_ENV == 'development' ? 'hrx.com' : 'tatatunga.mn',
    register_id_regex: /^[а-яА-Яa-zA-ZөӨүҮёЁ]{2}[0-9]{8}$/,
    name_regex: /^[a-zA-Zа-яА-ЯөӨүҮёЁ-]*$/,
    phone_regex: /^[0-9]{8}$/,
    email_regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    username_regex: /^[0-9a-zA-Z_]*$/,
};
let alphabet = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 10,
    K: 11,
    L: 12,
    M: 13,
    N: 14,
    O: 15,
    P: 16,
    Q: 17,
    R: 18,
    S: 19,
    T: 20,
    U: 21,
    V: 22,
    W: 23,
    X: 24,
    Y: 25,
    Z: 26
};

config.lton = function(l) {
    // l[0]*26^n + l[1]*26^(n-1) + ... l[l.length - 1]*26^(0) + 26^(n-1) + ... + 26^1
    var n = l.length;
    var o = 0;

    for (var i = 0; i < n; i++) {
        o += (alphabet[l[i].toUpperCase()] || l[i]) * Math.pow(26, n - i - 1);
        if (i > 0) o += Math.pow(26, n - i);
    }
    return o;
};

config.config = function (data) {
    configList = {
        ...configList,
        ...data
    }
};
config.get = function (option) {
    return configList[option];
};

config.formatMoney = function (amount, decimalCount = 0, decimal = ".", thousands = "'", sign = "") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) + sign : "");
    } catch (e) {
        console.log(e)
    }
};
export function isValidDate(dateObject){
    return (new Date(dateObject).toString() !== 'Invalid Date') ? dateObject : null;
}
export function isPhoneNum(str){
    let phone = String(str).replace(/\+976|\+7|-|_|\n|\s/g, '');
    return configList.phone_regex.test(phone) ? phone : null;
}
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export function string(string) {
    return String(string).trim().replace(/(<([^>]+)>)/gi, "").replace('undefined', '').replace('null', '');
}
export default config
