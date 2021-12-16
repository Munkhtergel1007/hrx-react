let {EventEmitter} = require('fbemitter');
let actions = require('../hrx_actions');
let actionsFormatted = require('../hrx_actions_formatted');
let config = {};
let configList = {
    emitter: new EventEmitter(),
    host:process.env.NODE_ENV === 'development' ? 'http://tatatunga.mn' : 'https://hrx.com',
    hostMedia:process.env.NODE_ENV === 'development' ? 'http://cdn.tatatunga.mn' : 'https://cdn.hrx.com',
    socketUrl: process.env.NODE_ENV === 'development' ? 'http://tatatunga.mn:8080' : 'https://hrx.com',
    fbApi: {},
    socket: {},
    actions: actions,
    actionsFormatted: actionsFormatted,
};

config.config = function (data) {
    configList = {
        ...configList,
        ...data
    }
};

config.checkObjId = function(id){
    let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(id);
};

config.get = function (option) {
    return configList[option];
};

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function isId(id){
    let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(id);
}
export function isPhoneNum(str){
    let phone = String(str) // yu ch orj irsen string l bolgono
        .replaceAll(/\+/g, '') // + temdeg hasna
        .replaceAll(/\n/g, '') // enter darah ved
        .replaceAll(/\s/g, '') // bvh hooson zaig hasna
        .replaceAll(/-/g, '')  // bvh - zuraasiig hasna
        .replaceAll(/\+976/g, ''); // 976 hasna
    return phone.length === 8 && !isNaN(phone) ? phone : null;
}

export function actionsArray() {
    let keys = Object.keys(actions);
    return keys.map((c) => {
        return {key: c, value: actions[c]};
    });
}

export function formattedActionsArray() {
    let keys = Object.keys(actionsFormatted);
    return keys.map((c) => {
        let acts = Object.keys(actionsFormatted[c]).filter((cc) => cc !== 'val');
        return {
            key: c,
            value: actionsFormatted[c].val,
            actions: acts.map((cc) => {
                return {key: cc, value: actionsFormatted[c][cc]};
            })
        };
    });
}

export const mnMonth = function(n) {
    return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'][n];
};

export const mnDay = function(n) {
    return ['Дав', 'Мяг', 'Лха', 'Пү', 'Ба', 'Бя', 'Ня'][n];
};

export default config
