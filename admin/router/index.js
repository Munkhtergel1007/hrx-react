import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import Routes from './Routes';
import { message} from 'antd';
import {connect} from "react-redux";
import config from "../config";

const reducer = ({ main }) => ({ main });

class index extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
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
            window.location.assign("/admin/login");
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
        return(
            <BrowserRouter>
                {/*<Layer>*/}
                    {renderRoutes(Routes)}
                {/*</Layer>*/}
            </BrowserRouter>
        )
    }
}
export default  connect(reducer)(index);