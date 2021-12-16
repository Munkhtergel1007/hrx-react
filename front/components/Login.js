import React, {Component} from 'react';
import { connect } from 'react-redux';
import config, {string} from "../config";
import Reset from './Reset';
import { Modal } from 'react-bootstrap';
import * as actions from "../actions/home_actions";
import {locale} from '../lang';

const reducer = ({main}) => ({main})

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            submittingReset: false,
            success: false,
            timer: 59,
            username: {
                text: '',
                error: false
            },
            password: {
                text: '',
                error: false
            },
            modalShow: 'true',
            forgotPassword: false,
            email: {
                text:'',
                error: false
            }
        }
        
    }
    forgotLogin(e) {
        e.preventDefault();
        const {
            email
        } = this.state;
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if(string(email.text) === '' || !isNaN(email.text)){
            this.setState({email: {text: email.text, error: locale('frontend_warning.nevtreh_modal.err1')}});
        } else if(email.text.trim().length>60){
            this.setState({email: {text: email.text, error: locale('frontend_warning.nevtreh_modal.err2')}});
        } else if(!emailRegex.test(email.text)){
            this.setState({email: {text: email.text, error: locale('frontend_warning.nevtreh_modal.err3')}});
        } else {
            this.setState({submittingReset: true, timer: 59}, () => {
                this.props.dispatch(actions.resetPassword({email: email.text})).then(c => {
                    if(c.json.success){
                        this.setState({
                            success: true,
                        }, this.timer())
                    } else {
                        this.setState({
                            submittingReset: false
                        })
                    }
                })
            })
        }
    }
    timer() {
        let interval = setInterval(() => {
                this.setState({
                    timer: this.state.timer - 1
                })
                if(this.state.timer === 0) {clearInterval(interval)}
            }
            , 1000)
    }
    submitLogin(e){
        e.preventDefault();
        const {
            username,
            password,
        } = this.state;
        const {
            domain
        } = this.props;
        if(string(username.text) === '' || !isNaN(username.text)){
            this.setState({username: {text: username.text, error: locale('frontend_warning.nevtreh_modal.err4')}});
        } else

        if(!password.text){
            this.setState({password: {text: password.text, error: locale('frontend_warning.nevtreh_modal.err5')}});
        } else {
            let cc = {
                username: this.state.username.text,
                password: this.state.password.text,
            };
            this.setState({submitting: true}, () => {
                this.props.dispatch(actions.loginFrontToCompany(cc))
                    .then((c) => {
                        let state = {submitting: false};
                        if(c.json.success){

                            // let url = config.get('redirectHostHead') + config.get('redirectHostTail') + (c.json.redirectToCompany ? '?rd=true' : '');
                            // window.location.assign(url);

                            // if(c.json.redirectToCompany && c.json.company && c.json.company[0]){
                            //     let url = config.get('redirectHostHead')+ c.json.company[0].domain +'.' + config.get('redirectHostTail');
                            //     window.location.assign(url);
                            // }
                            // $('#login').modal('hide');
                            // this.setState(state);

                            // let url = config.get('redirectHostHead') + config.get('redirectHostTail');
                            let url = config.get('redirectHostHead') + domain;
                            window.location.assign(url);
                        } else {
                            (c.json.errorData || []).map(function (r) {
                                if((Object.keys(r) || [])[0] === 'company_domain'){
                                    state = {...state, activeTab:1};
                                }
                                state = {...state, [(Object.keys(r) || [])[0]]:r[Object.keys(r)[0]]};
                            });
                            this.setState(state);
                        }
                    });
            });
        }

    }
    
    render() {
        
        const {main: {user},domain}=this.props;
        return(
            <>
            <div className="modal fade modalHeader" id="login" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modalContainer" role="document">
                    <div className="modal-content modalContent">
                        <form onSubmit={(e) => this.state.submitting ? false : this.state.forgotPassword ? this.forgotLogin(e) : this.submitLogin(e)}>
                            <div className="modal-header modalHeader">
                                {
                                    domain.toLowerCase() === 'tapsir.com' || domain.toLowerCase() === 'tapsir.mn' ?
                                    <a className="site-logo" >
                                        <img loading="lazy" src="/images/tapsir.png" alt="logo" width="90"/>
                                    </a>
                                    : 
                                    <a className="site-logo" >
                                        <img loading="lazy" src="/images/hrx-logo.png" alt="logo" width="60"/>
                                    </a>
                                }
                                
                            
                                        <h5 className="modal-title" id="loginHeader">{this.state.forgotPassword ? locale('common.nevtreh_modal.pass_sergeeh') : locale('common.nevtreh_modal.nevtreh')}</h5>
                                        </div>
                                {
                                    this.state.forgotPassword ? 
                                    <div className="modal-body">
                                        <div className="forgotSpan">
                                        <span >{locale('common.nevtreh_modal.ta_bur_email_oruul')}</span>
                                        </div>
                                        <div className="form-item">
                                            <input className="loginField"
                                            style={this.state.email.error ? {
                                                border: '2px solid #e0393985',
                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                height: 36
                                                } : this.state.submittingReset ? 
                                                    {border: '2px solid #D8B384',
                                                    boxShadow: '0 5px 10px 0 #D8B384',
                                                    height: 36 }
                                                :  {height: 36}} 

                                            onChange={e => this.setState({email: {text: e.target.value, error: false}})}
                                            value={this.state.email.text ? this.state.email.text :   ''}
                                                    placeholder={locale('common.nevtreh_modal.email')} type="text"
                                            />
                                            {this.state.email.error ?
                                                <div className="displayState">{this.state.email.error}</div>
                                                :
                                                this.state.success  ? 
                                                <>  {
                                                    this.state.timer !== 0 ?
                                                        <div style={{color: '#D8B384', marginTop: '5px', fontWeight: 500}} className="displayState">
                                                            {locale('common.nevtreh_modal.amj_ta_email_check')}
                                                        </div>
                                                    :
                                                    null
                                                }
 
                                                    { this.state.timer !== 0 ?
                                                        <div style={{ marginTop: '30px',
                                                            fontSize:'14px',
                                                            fontWeight: '600',
                                                            marginLeft: '20px'}}> {locale('common.nevtreh_modal.dahin_ilgeeh')}:
                                                            <span> {this.state.timer} </span> 
                                                        </div>
                                                        :
                                                        <div style={{ marginTop: '30px',
                                                            fontSize:'14px',
                                                            fontWeight: '600',
                                                            marginLeft: '20px'
                                                        }}>
                                                            {locale('common.nevtreh_modal.no_email_dahin_avah_bolomjtoi')}
                                                        </div>
                                                    }
                                                    
                                                </>
                                                :
                                                null
                                            }
                                        </div>
                                    </div>
                                    :
                                    <div className="modal-body">
                                        <div className="form-item">
                                            <input className="loginField"
                                                value={this.state.username.text ? this.state.username.text : ''}
                                                    placeholder={locale('common.nevtreh_modal.nevt_ner')} type="text" onChange={(e) => this.setState({username: {text: e.target.value, error: false}})}
                                            />
                                            {this.state.username.error?
                                                <div className="displayState" >{this.state.username.error}</div>
                                                :
                                                null
                                            }
                                        </div>
                                        <div className="form-item">
                                            <input className="loginField"
                                                value={this.state.password.text ? this.state.password.text : ''}
                                                    placeholder={locale('common.nevtreh_modal.nuuts_ug')} type="password" onChange={(e) => this.setState({password: {text: e.target.value, error: false}})}
                                            />
                                            {this.state.password.error?
                                                <div className="displayState" >{this.state.password.error}</div>
                                                :
                                                null
                                            }
                                            <a href="#" onClick={()=>this.setState({forgotPassword: true})} className="loginSpan">{locale('common.nevtreh_modal.nuuts_ug_ser')}</a>
                                        </div>
                                    </div>
                                    
                                }
                            
                            <div className="modal-footer modalFoot">
                                {
                                    this.state.forgotPassword ?
                                    <>
                                        {
                                            this.state.submittingReset && this.state.success && this.state.timer !== 0 ?
                                                <button  className="crumina-button button--dark submitButton loginField landingButton" disabled style={{position: "relative"}}> <i className="fa fa-circle-o-notch fa-spin loading"/>{locale('common.nevtreh_modal.ilgeeh')}
                                                </button>
                                                :
                                                <button className="crumina-button button--dark submitButton loginField landingButton"> {locale('common.nevtreh_modal.ilgeeh')} </button>
                                        }
                                        <button  type="button" className="returnButton crumina-button loginField landingButton" onClick={()=> this.setState({forgotPassword:false})}>{locale('common.nevtreh_modal.butsah')}</button>
                                    </>
                                    :
                                    <>
                                        <button  className="crumina-button submitButton loginField" style={{position: "relative"}}> {
                                            this.state.submitting ? <> <i className="fa fa-circle-o-notch fa-spin loading"/>{locale('common.nevtreh_modal.nevtreh')} </>
                                                :
                                                locale('common.nevtreh_modal.nevtreh')
                                        }</button>
                                        <button  type="button" className="returnButton crumina-button loginField" data-dismiss="modal">{locale('common.nevtreh_modal.haah')}</button>
                                    </>
                                }
                                
                            
            
                                
                            </div>
                        </form>
                    </div>
                    <div className="modalPic">
                        <img loading="lazy" src="/images/loginImg.png" />
                    </div>
                </div>
            </div>
        </>
        )
    }
}
export default connect(reducer)(Login)