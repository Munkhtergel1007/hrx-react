import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import Routes from './Routes';
import MassAttendanceRoutes from './MassAttendanceRoutes';
import Employee from './Employee';
import { message} from 'antd';
import {connect} from "react-redux";
import config from "../config";
import Cookies from "js-cookie";
import {config as lang} from "../../front/lang";

const reducer = ({ main }) => ({ main });

class index extends React.Component{
    constructor(props){
        super(props);
        config.config({host:(process.env.NODE_ENV == 'development' ? 'http://' : 'https://')+props.main.domain});
        config.config({hostMedia:(process.env.NODE_ENV == 'development' ? 'http://cdn.' : 'https://cdn.')+props.main.domain});
        config.config({redirectHostTail:props.main.domain});
    }

    componentDidMount() {
        const { main: {domain} } = this.props;
        if(Cookies.get('lang', {domain:domain})){
            console.log('astala bista', Cookies.get('lang'));
        } else {
            if(domain.toLowerCase() === 'tapsir.com' || domain.toLowerCase() === 'tapsir.mn'){
                console.log('company cookie', Cookies.get('lang'));
                Cookies.set('lang' , Cookies.get('lang') && Cookies.get('lang') !=='mn' ? Cookies.get('lang') : 'kz', {domain: domain});
                lang({lang : Cookies.get('lang') && Cookies.get('lang') !=='mn' ? Cookies.get('lang') : 'kz'});
            } else {
                Cookies.set('lang' , 'mn');
                lang({lang : 'mn'});
            }
        }
        //EVENT EMITTERS
        this.system_success = config.get('emitter').addListener('success',function(text){
            if(text != undefined && text != ''){
                message.success(text)
            }
        });
        this.system_errors = config.get('emitter').addListener('error',function(text){
            if(text != undefined && text != ''){
                message.error(text)
            }
        });
        this.system_alert = config.get('emitter').addListener('warning',function(text){
            if(text != undefined && text != ''){
                message.warning(text);
            }
        });
        this.auth_error = config.get('emitter').addListener('auth-error',function(){
            window.location.assign("/");
        });
        this.not_found = config.get('emitter').addListener('not-found',function(){
            window.location.assign("/not-found");
        });
        //EVENT EMITTERS END
    }
    componentWillUnmount() {
        this.auth_error.remove();
        this.not_found.remove();
        this.system_errors.remove();
        this.system_success.remove();
        this.system_alert.remove();
    }
    render(){
        const { main: {user, employee} } = this.props;
        return(
            <BrowserRouter>
                {/*<Layer>*/}
                {renderRoutes(
                    (employee || {}).staticRole === 'attendanceCollector' ?
                        MassAttendanceRoutes
                        :
                        (employee || {}).staticRole === 'employee' ?
                            Employee
                            :
                            Routes
                )}
                {/*</Layer>*/}
            </BrowserRouter>
        )
    }
}
export default  connect(reducer)(index);