import { combineReducers } from 'redux';
import main from "./main";
import home from "./home";
export default combineReducers({
    main: main,
    home: home,
});