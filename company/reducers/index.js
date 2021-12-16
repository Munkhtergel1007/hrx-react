import { combineReducers } from 'redux';
import main from "./main";
import auth from "./auth";
import dashboard from "./dashboard";
import settings from "./settings";
import employee from "./employee";
import department from "./department";
import breaks from "./breaks";
import attendance from "./attendance";
import massAttendance from "./massAttendance";
import media from "./media";
import vacation from './vacation';
import salary from './salary';
import subsidiary from './subsidiary';
import jobDescription from './jobDescription';
import orientation from './orientation';
import task from './task';
import asset from './asset';
import category from './category';
import warehouse from './warehouse';
import restock from './restock';
// import job from "./job";
import workplan from './workplan'
import projection from "./projection";
import product from "./product";
import orlogoZarlaga from "./orlogoZarlaga";
import reports from './reports';

export default combineReducers({
    main: main,
    auth: auth,
    dashboard: dashboard,
    settings: settings,
    reports: reports,
    employee: employee,
    department: department,
    breaks: breaks,
    media: media,
    massAttendance: massAttendance,
    attendance: attendance,
    vacation: vacation,
    // job: job,
    jobDescription: jobDescription,
    orientation: orientation,
    workplan: workplan,
    subsidiary: subsidiary,
    salary: salary,
    orlogoZarlaga: orlogoZarlaga,
    task: task,
    asset: asset,
    category: category,
    product: product,
    warehouse: warehouse,
    restock: restock,
    projection: projection
});