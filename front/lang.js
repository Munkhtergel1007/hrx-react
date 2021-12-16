const {
    mn, kz, rs
} = require('./languages');
const Cookies = require('js-cookie');
let configList = {
    lang: Cookies.get('lang') ? Cookies.get('lang') : 'mn'
};
function printVal(value , arr){
    let strings = value.split(".");
    if(typeof arr[strings[0]] == 'string'){
        return arr[strings[0]];
    } else if(strings[1] && arr[strings[0]] && typeof arr[strings[0]][strings[1]] == 'string'){
        return arr[strings[0]][strings[1]];
    } else if(strings[2] && arr[strings[0]]&& arr[strings[0]][strings[1]] && typeof arr[strings[0]][strings[1]][strings[2]] == 'string'){
        return arr[strings[0]][strings[1]][strings[2]];
    } else if(strings[3] && arr[strings[0]] && arr[strings[0]][strings[1]] && arr[strings[0]][strings[1]][strings[2]] && typeof arr[strings[0]][strings[1]][strings[2]][strings[3]] == 'string'){
        return arr[strings[0]][strings[1]][strings[2]][strings[3]];
    } else if(strings[4] && arr[strings[0]] && arr[strings[0]][strings[1]] && arr[strings[0]][strings[1]][strings[2]] && arr[strings[0]][strings[1]][strings[2]][strings[3]] && typeof arr[strings[0]][strings[1]][strings[2]][strings[3]][strings[4]] == 'string'){
        return arr[strings[0]][strings[1]][strings[2]][strings[3]][strings[4]];
    }
}
const config = function (data) {
    configList = {
        ...configList,
        ...data
    };
};
const get = function (option) {
    return configList[option];
};
const locale = function (value) {
    switch(configList.lang){
        case "rs" :
            return printVal(value , rs);
        case "kz" :
            return printVal(value , kz);
        default :
            return printVal(value , mn);
    }
}

export {config,get, locale}