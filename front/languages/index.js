const landingMn = require('./mgl/landing.json');
const landingRs = require('./rus/landing.json');
const landingKz = require('./kaz/landing.json');

const user_homeMn = require('./mgl/user_home.json');
const user_homeRs = require('./rus/user_home.json');
const user_homeKz = require('./kaz/user_home.json');

export const mn = {
    ...landingMn,
    ...user_homeMn,
}
export const rs = {
    ...landingRs,
    ...user_homeRs,
}
export const kz = {
    ...landingKz,
    ...user_homeKz,
}