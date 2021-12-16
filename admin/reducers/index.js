import { combineReducers } from 'redux';
import category from "./category";
import auth from "./auth";
import main from "./main";
import company from "./company";
import bundle from "./bundle";
import companyTransactions from "./companyTransaction";
import companyRequests from "./companyreqs";
export default combineReducers({
    category: category,
    auth: auth,
    main: main,
    company: company,
    bundle: bundle,
    compTrans: companyTransactions,
    compReqs: companyRequests
});