let {EventEmitter} = require('fbemitter');
let actions = require('../hrx_actions');
let actionsFormatted = require('../hrx_actions_formatted');
import {locale} from './lang';
let config = {};
let configList = {
    emitter: new EventEmitter(),
    host:process.env.NODE_ENV === 'development' ? 'http://hrx.com' : 'https://tatatunga.mn',
    hostMedia:process.env.NODE_ENV === 'development' ? 'http://cdn.hrx.com' : 'https://cdn.tatatunga.mn',
    socketUrl: process.env.NODE_ENV === 'development' ? 'http://hrx.com:8080' : 'https://tatatunga.mn',
    redirectHostHead:process.env.NODE_ENV === 'development' ? 'http://' : 'https://',
    redirectHostTail:process.env.NODE_ENV === 'development' ? 'hrx.com' : 'tatatunga.mn',
    fbApi: {},
    socket: {},
    actions: actions,
    actionsFormatted: actionsFormatted,
    logoPX: {
        maxWidth: 200,
        maxHeight: 200,
        aspectRatio: 1, // 1:1
    },
    coverPX: {
        maxWidth: 1466,
        maxHeight: 768,
        aspectRatio: 1.91, // 1.91:1
    },
    sliderPX: {
        maxWidth: 1466,
        maxHeight: 768,
        aspectRatio: 1.91, // 1.91:1
    },
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
export function msg(type = 'success', msg = ''){
    return configList.emitter.emit(type, msg);
}
export function isId(id){
    let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(id);
}
export async function picSize(file){
    let _URL = window.URL || window.webkitURL;
    return await getHeightAndWidthFromDataUrl(_URL.createObjectURL(file));

}
export function getHeightAndWidthFromDataUrl(dataURL){
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            resolve({
                height: img.height,
                width: img.width
            })
        };
        img.src = dataURL
    })
}
export function isPhoneNum(str){
    let phone = String(str) // yu ch orj irsen string l bolgono
                // .replaceAll(/(\+|\n|\s|-|\+976)/g, '') // + temdeg hasna
                .replaceAll(/\+/g, '') // + temdeg hasna
                .replaceAll(/\n/g, '') // enter darah ved
                .replaceAll(/\s/g, '') // bvh hooson zaig hasna
                .replaceAll(/-/g, '')  // bvh - zuraasiig hasna
                .replaceAll(/\+976/g, ''); // 976 hasna
    return phone.length === 8 && !isNaN(phone) ? phone : null;
}
export function isRegisterId(str = ''){
    let registerIdRegex = /^[а-яА-ЯөӨүҮёЁ]{2}[0-9]{8}$/;
    return registerIdRegex.test(str.trim());
}
export function string(string){
    return String(string).replace(/(<([^>]+)>)/gi, "").replace('undefined', '').replace('null', '');
}
export function isValidDate(dateObject){
    return (new Date(dateObject).toString() !== 'Invalid Date') ? dateObject : null;
}
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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

export function hasAction(actions, resEmployee, params=null, onlyMe=false){
    let me = false;
    if(params && resEmployee && params === resEmployee._id){
        me = true;
    }
    let employee = (resEmployee || window.__INITIAL_STATE__.main.employee || {});
    let hadAction = false;
    // if((actions || []).length > 0){
        hadAction = actions.length > 0 ? (((employee || {}).role || {}).actions || []).some((c) => actions.indexOf(c) > -1) : true;
    // }
    return (
        onlyMe ?
            me
            :
            (employee.staticRole === 'lord' || employee.staticRole === 'hrManager' || employee.staticRole === 'chairman'|| employee.staticRole === 'admin')
            || hadAction || me
    );
}
export function companyAdministrator(resEmployee){
    let employee = (resEmployee || window.__INITIAL_STATE__.main.employee || {});
    let hadAction = (employee.staticRole === 'lord' || employee.staticRole === 'hrManager' || employee.staticRole === 'chairman')
    return (
        hadAction
    );
}
export function companyLord(resEmployee){
    let employee = (resEmployee || window.__INITIAL_STATE__.main.employee || {});
    let hadAction = employee.staticRole === 'lord';
    return (
        hadAction
    );
}
export function companyHrManager(resEmployee){
    let employee = (resEmployee || window.__INITIAL_STATE__.main.employee || {});
    let hadAction = employee.staticRole === 'hrManager';
    return (
        hadAction
    );
}

export const mnMonth = function(n) {
    return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'][n];
};

export const printStaticRole = function(n) {
    let res = '';
    switch(n){
        case 'lord': res = locale('common_alba.Udirdah'); break;
        case 'chairman': res = 'Гүйцэтгэх захирал'; break;
        case 'hrManager': res = locale('common_alba.H_N_Ahlah'); break;
        case 'attendanceCollector' : res = locale('common_alba.TS_TS_Burtgegch'); break;
        case 'employee': res = locale('common_timetable.Ajiltan'); break;
        default: res = '';
    }
    return res;
};
export const printStaticRoleRus = function(n) {
    let res = '';
    switch(n){
        case 'lord': res = 'Управление'; break;
        case 'chairman': res = 'Директор'; break;
        case 'hrManager': res = 'Старший по кадрам'; break;
        case 'employee': res = 'Работник'; break;
        default: res = '';
    }
    return res;
};
export const printStaticRoleKaz = function(n) {
    let res = '';
    switch(n){
        case 'lord': res = 'Басқару'; break;
        case 'chairman': res = 'Бас атқарушы'; break;
        case 'hrManager': res = 'Кадыр бөлімінің кызметкері'; break;
        case 'employee': res = 'Қызметкер'; break;
        default: res = '';
    }
    return res;
};
export const printMnDay = function(n) {
    let res = '';
    switch((n || '').toLowerCase()){
        case 'monday': res = locale('common_attendance.davaa'); break;
        case 'tuesday': res = locale('common_attendance.myagmar'); break;
        case 'wednesday': res = locale('common_attendance.lkhagva'); break;
        case 'thursday' : res = locale('common_attendance.purev'); break;
        case 'friday': res = locale('common_attendance.baasan'); break;
        case 'saturday': res = locale('common_attendance.byamba'); break;
        case 'sunday': res = locale('common_attendance.nyam'); break;
        default: res = '';
    }
    return res;
};

export const mnDay = function(n) {
    return ['Дав', 'Мяг', 'Лха', 'Пү', 'Ба', 'Бя', 'Ня'][n];
};


export const getDatesBetweenDates = function(startDate, endDate){
    let dates = [];
    const theDate = new Date(startDate);
    const theEDate = new Date(endDate);
    while (theDate < theEDate) {
        dates = [...dates, new Date(theDate.toDateString())];
        theDate.setDate(theDate.getDate() + 1)
    }
    return dates
};
export const checkIfDayInGap = function(date, days=[]){
    let check = false;
    if(date && days && days.length > 0){
        let convertedDate = new Date(date.toString());
        (days || []).map(function (r) {
            let dat = new Date(r);
            // if((new Date(r.toDateString()) || 'aa').toString() === (new Date(date.toDateString()) || 'bb').toString()){
            if(dat.getFullYear() === convertedDate.getFullYear() && dat.getMonth() === convertedDate.getMonth() && dat.getDate() === convertedDate.getDate()){
                check = true;
            }
        });
    }
    return check
};
export const dayToNumber = function(day=''){
    switch (day.toLowerCase()) {
        case 'monday':      return 1;
        case 'tuesday':     return 2;
        case 'wednesday':   return 3;
        case 'thursday':    return 4;
        case 'friday':      return 5;
        case 'saturday':    return 6;
        case 'sunday':      return 7;
        default: return 0;
    }
};

String.prototype.insideText = function(idx, rem, str){
    return this.slice(0, idx + 1) + str + this.slice(idx + 1 + Math.abs(rem));
};

export default config
