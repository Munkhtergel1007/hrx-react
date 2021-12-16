import moment from "moment";
import React, { Component } from "react";
import { connect } from 'react-redux';
import config, {isPhoneNum, string, isValidDate} from '../config';
import * as actions from "../actions/home_actions";
import {locale} from '../lang';
import Cookies from "js-cookie";

const reducer = ({ main, home }) => ({ main, home })

class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordChange: false,
            activeList: 1,
            editingProfile: false,
            first_name: {
                text: props.main.user.first_name,
                error: false
            },
            last_name: {
                text: props.main.user.last_name,
                error: false
            },
            username: {
                text: '',
                error: false
            },
            register_id: {
                text: props.main.user.register_id,
                error: false
            },             
            email: {
                text: props.main.user.email,
                error: false
            },
            gender: {
                text: props.main.user.gender,
                error: false
            }, 
            phone: {
                text: props.main.user.phone,
                error: false
            },
            birthday: {
                text: props.main.user.birthday,
                error: false
            },
            birth_place: {
                text: props.main.user.birth_place,
                error: false
            },
            bloodType: {
                text: props.main.user.bloodType,
                error: false
            },
            password: {
                text: '',
                error: false
            },
            oldPassword: {
                text: '',
                error: false
            },
            passwordRepeat: {
                text: '',
                error: false
            },
            passwordVerify: {
                text: '',
                error: false
            },
            drivingLicense: this.props.main?.user?.drivingLicense || [],
            sidebarShow: false
        }
    }

    throw(company, e){
        e.preventDefault();
        if(company && company.domain && company.domain !==''){
            let url = config.get('redirectHostHead')+ company.domain.toLowerCase() +'.' + config.get('redirectHostTail');
            window.location.assign(url);
        }
    }
    bolio(){
        const {main:{user}} = this.props;
        this.setState({
            editingProfile: false,
            first_name: {
                text: user.first_name,
                error: false
            },
            last_name: {
                text: user.last_name,
                error: false
            },
            username: {
                text: '',
                error: false
            },
            register_id: {
                text: user.register_id,
                error: false
            },
            email: {
                text: user.email,
                error: false
            },
            gender: {
                text: user.gender,
                error: false
            },
            phone: {
                text: user.phone,
                error: false
            },
            birthday: {
                text: user.birthday,
                error: false
            },
            birth_place: {
                text: user.birth_place,
                error: false
            },
            bloodType: {
                text: user.bloodType,
                error: false
            },
            password: {
                text: '',
                error: false
            },
            oldPassword: {
                text: '',
                error: false
            },
            passwordRepeat: {
                text: '',
                error: false
            },
            passwordVerify: {
                text: '',
                error: false
            },
            drivingLicense: user.drivingLicense
        })
    }
    changeList(e) {
        this.setState({activeList: e})
    }
    passwordRepeat(e) {
        e.preventDefault();
        const {
            password,
            passwordRepeat,
            oldPassword
        } = this.state
        if(!password.text){
            this.setState({password: {text: password.text, error: locale("user_home_error.password.insert")}});
        } else if(password.text.trim().length<8){
            this.setState({password: {text: password.text, error: locale("user_home_error.password.min_length")}});
        } else  if(password.text.trim().length>30){
            this.setState({password: {text: password.text, error: locale("user_home_error.password.too_long")}});
        } else if(passwordRepeat.text === '') {
            this.setState({passwordRepeat: {text: passwordRepeat.text, error: locale("user_home_error.password.repeat")}})
        } else if(password.text !== passwordRepeat.text) {
            this.setState({passwordRepeat: {text: passwordRepeat.text, error: locale("user_home_error.password.repeat_not_match")}})
        }
        else if(oldPassword.text === '') {
            this.setState({oldPassword: {text: oldPassword.text, error: locale("user_home_error.password.enter_old")}})
        }
        else {
            let cc = {
                user_id: this.props.main.user._id,
                password: this.state.password,
                passwordRepeat: this.state.passwordRepeat,
                oldPassword: this.state.oldPassword
            }
            console.log(cc)
            this.props.dispatch(actions.passwordChange({data: cc})).then(c => {
                if(c.json.success) {
                    this.setState({passwordChange: false,
                                    password: {
                                        text: '',
                                        error: false
                                    },
                                    passwordRepeat: {
                                        text: '',
                                        error: false
                                    }})

                }
            })
        }
    }
    submitInfo(e) {
        e.preventDefault();
            const {
                first_name,
                last_name,
                register_id,
                email,
                gender,
                phone,
                birthday,
                birth_place,
                bloodType,
                drivingLicense,
                passwordVerify
            } = this.state
            const nameRegex = config.get('name_regex');
            const registerRegex = config.get('register_id_regex');
            const usernameRegex =config.get('username_regex');
            const emailRegex =config.get('email_regex');

            if(string(last_name.text) === '' || !isNaN(last_name.text)){
                this.setState({last_name: {text: last_name.text, error: locale("user_home_error.last_name.insert")}});
            } else if(last_name.text.trim().length>30){
                this.setState({last_name: {text: last_name.text, error: locale("user_home_error.last_name.long")}});
            } else if(!nameRegex.test(last_name.text?.trim())){
                this.setState({last_name: {text: last_name.text, error: locale("user_home_error.last_name.error")}});
            } else

            if(string(first_name.text) === '' || !isNaN(first_name.text)){
                this.setState({first_name: {text: first_name.text, error: locale("user_home_error.first_name.insert")}});
            } else if(first_name.text.trim().length>30){
                this.setState({first_name: {text: first_name.text, error: locale("user_home_error.first_name.long")}});
            } else if(!nameRegex.test(first_name.text.trim())){
                this.setState({first_name: {text: first_name.text, error: locale("user_home_error.first_name.error")}});
            } else

            if(!registerRegex.test(register_id.text.trim())){
                this.setState({register_id: {text: register_id.text, error: locale("user_home_error.register_id.error")}});
            } else

            if(string(email.text) === '' || !isNaN(email.text)){
                this.setState({email: {text: email.text, error: locale("user_home_error.email.insert")}});
            } else if(email.text.trim().length>60){
                this.setState({email: {text: email.text, error: locale("user_home_error.email.long")}});
            } else if(!emailRegex.test(email.text.trim())){
                this.setState({email: {text: email.text, error: locale("user_home_error.email.error")}});
            } else

            if(!isPhoneNum(phone.text)){
                this.setState({phone: {text: phone.text, error: locale("user_home_error.phone.error")}});
            } else

            if(!phone.text){
                this.setState({phone: {text: phone.text, error: locale("user_home_error.phone.insert")}});
            } else if(!isPhoneNum(phone.text)){
                this.setState({phone: {text: phone.text.trim(), error: locale("user_home_error.phone.error")}});
            } else

            if(!isValidDate(birthday.text)) {
                this.setState({birthday: {text: birthday.text, error: locale("user_home_error.birthday.error")}})
            } else
            if(passwordVerify.text === '') {
                this.setState({passwordVerify: {text: passwordVerify.text, error: locale("user_home_error.password.insert")}})
            }

            else {
                console.log('aaa 10')

                let cc = {
                    user_id:  this.props.main.user._id,
                    last_name: (this.state.last_name.text || '').trim(),
                    first_name: (this.state.first_name.text || '').trim(),
                    register_id: (this.state.register_id.text || '').trim(),
                    birth_place: (this.state.birth_place.text || '').trim(),
                    birthday: this.state.birthday.text,
                    drivingLicense: this.state.drivingLicense,
                    email: this.state.email.text.trim(),
                    phone: this.state.phone.text.trim(),
                    gender: this.state.gender.text,
                    bloodType: this.state.bloodType.text,
                    passwordVerify: this.state.passwordVerify.text
                };
                this.props.dispatch(actions.submitInformation({data: cc})).then(c => {
                    
                    if(c.json.success) {
                        this.setState({
                            editingProfile: false,
                            first_name: {
                                text: c.json.first_name,
                                error: false
                            },
                            last_name: {
                                text: c.json.last_name,
                                error: false
                            },
                            username: {
                                text: '',
                                error: false
                            },
                            register_id: {
                                text: c.json.register_id,
                                error: false
                            },             
                            email: {
                                text: c.json.email,
                                error: false
                            },
                            gender: {
                                text: c.json.gender,
                                error: false
                            }, 
                            phone: {
                                text: c.json.phone,
                                error: false
                            },
                            birthday: {
                                text: c.json.birthday,
                                error: false
                            },
                            birth_place: {
                                text: c.json.birth_place,
                                error: false
                            },
                            bloodType: {
                                text: c.json.bloodType,
                                error: false
                            },
                            drivingLicense: c.json.drivingLicense,
                            passwordVerify: {
                                text: '',
                                error: false
                            }
                        })
                    }
                })
            } 
    }
    licenseToggle(e) {
        if(this.state.drivingLicense.some(c => c === e)){
            this.setState({
                drivingLicense: this.state.drivingLicense.filter(c => c !== e)
            })
        } else {
            this.setState({
                drivingLicense: [e, ...this.state.drivingLicense]
            })
        }
    }
    onLangChange(language) {
        const {main: {domain}} = this.props;
        Cookies.set("lang", language, {domain:domain});
        window.location.assign("/");
        this.setState({ openLang: false });
    }

    render() {
        function printBloodType(bloodType){
            switch(bloodType){
                case 'o+':
                    return locale("blood_types.o+")
                    break
                case 'a+':
                    return locale("blood_types.a+")
                    break
                case 'b+':
                    return locale("blood_types.b+")
                    break
                case 'ab+':
                    return locale("blood_types.ab+")
                    break
                case 'o-':
                    return locale("blood_types.o-")
                    break
                case 'a-':
                    return locale("blood_types.a-")
                    break
                case 'b-':
                    return locale("blood_types.b-")
                    break
                case 'ab-':
                    return locale("blood_types.ab-")
                    break
                default:
                    return ''
            }
        }
        const {main: {user, companies, pendingCompanies, domain}}=this.props;
        let avatar = '/images/default-avatar.png';
        if (user && user.avatar && user.avatar.path !== '') {
            avatar = `${config.get('hostMedia')}${user.avatar.path}`;
        }
        return(
            <React.Fragment>
                <div className="main">
                    <div className="navbarHome">
                    <div className="langChanger">
									{domain.toLowerCase() === "tapsir.com" ||
									domain.toLowerCase() === "tapsir.mn" ? (
										<span>
											{Cookies.get("lang") === "rs" ? (
												<>
													{this.state.openLang ? (
														<div className="flagActive">
															<span
																onClick={() =>
																	this.setState(
																		{
																			openLang: false
																		}
																	)
																}
																className="flagIndex"
															>
																<img
																	className="flag"
																	src="/images/russianFlag.png"
																/>
																<p>Русский</p>
															</span>
															<span
																onClick={
																	Cookies.get("lang", {domain:domain}) !== "kz"
																		? this.onLangChange.bind(
																				this,
																				"kz"
																		  )
																		: null
																}
																className="flagIndex"
															>
																<img
																	className="flag"
																	src="/images/kazakhFlag.png"
																/>
																<p>Қазақша</p>
															</span>
														</div>
													) : (
														<div
															onClick={() =>
																this.setState({
																	openLang: true
																})
															}
															className="flagCont"
														>
															<img
																className="flag"
																src="/images/russianFlag.png"
															/>
															<p>Русский</p>
														</div>
													)}
												</>
											) : (
												<>
													{this.state.openLang ? (
														<div className="flagActive">
															<span
																onClick={() =>
																	this.setState(
																		{
																			openLang: false
																		}
																	)
																}
																className="flagIndex"
															>
																<img
																	className="flag"
																	src="/images/kazakhFlag.png"
																/>
																<p> Қазақша</p>
															</span>
															<span
																onClick={
																	Cookies.get(
																		"lang", {domain:domain}
																	) !== "rs"
																		? this.onLangChange.bind(
																				this,
																				"rs"
																		  )
																		: null
																}
																className="flagIndex"
															>
																<img
																	className="flag"
																	src="/images/russianFlag.png"
																/>
																<p>Русский</p>
															</span>
														</div>
													) : (
														<div
															onClick={() =>
																this.setState({
																	openLang: true
																})
															}
															className="flagCont"
														>
															<img
																className="flag"
																src="/images/kazakhFlag.png"
															/>
															<p>Қазақша</p>
														</div>
													)}
												</>
											)}
											
										</span>
									) : null}
								</div>
                        <a href="#" className="notification">
                            {/* <div className="notificationNumber">3</div> */}
                            <ion-icon name="notifications" style={{ fontSize: 20,}}></ion-icon>
                        </a>
                        {(companies && companies.length>0) || (pendingCompanies && pendingCompanies.length > 0) ?
                            <a href="#"  className="companyButton button--xs hrxButton" data-toggle="modal" data-target="#companies">{locale("user_home_common.companies")}</a>
                            :
                            null
                        }
                        <a href="/logout" style={{padding: '10px 30px'}} className="button--xs logOut hrxButton" >{locale("user_home_common.logout")}</a>
                    </div>
                    <a className="sidebarButton" onClick={()=> this.setState({sidebarShow: true})}>
                        <ion-icon style={{fontSize: '24px'}} name="list-outline"></ion-icon>
                    </a>

                    <div className="sideBar" style={this.state.sidebarShow ? {display: 'flex'} : {}}>
                        {/* <a className="site-logo" href="/" style={{paddingTop: 10}}>
                            <img loading="lazy" className="hrxLogo" src="/images/hrx-logo.png"  alt="logo" width="60"/>
                        </a> */}
                        <a className="sidebarButtonX" onClick={()=> this.setState({sidebarShow: false})}>
                            <ion-icon style={{fontSize: '48px', color: '#f8513c'}} name="close-circle"></ion-icon>
                        </a>
                        <div className="avatar" style={{overflow:'hidden'}}>
                            <div className="avatarBorder">
                                <img loading="lazy" 
                                     src={avatar}
                                     // src="/images/avatar.jpg"
                                     alt="logo" id="avatarSidebar"/>
                            </div>
                        </div>
                        <div>
                                <span className="firstNameHome"> {user.first_name}</span>
                                
                        </div>
                        <div>
                                <span className="lastNameHome"> {user.last_name}</span>
                        </div>

                        <div className="sidebarList">
                            <div className={this.state.activeList=== 1 ? "lists" : "lists disabledList"} onClick={(e)=> this.changeList(1)}>
                                <ion-icon name="person-outline" style={this.state.activeList === 1? {
                                    marginRight: '180px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '180px',
                                    position: 'absolute',
                                    }}></ion-icon>
                                <span className="sidebarSpan">
                                    {locale("user_home_sidebar.user")}
                                </span>
                                
                                <ion-icon name="chevron-forward-outline" style={this.state.activeList === 1? {
                                    marginRight: '-200px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '-200px',
                                    position: 'absolute',
                                    }}></ion-icon>
                            </div>
                            <div  className={this.state.activeList=== 2 ? "lists" : "lists disabledList"} onClick={(e)=> this.changeList(2)} 
                                style={{
                                    marginTop: 60
                                }}>
                                <ion-icon name="id-card-outline" style={this.state.activeList === 2? {
                                    marginRight: '180px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '180px',
                                    position: 'absolute',
                                    }}></ion-icon>
                                <span className="sidebarSpan">
                                    {locale("user_home_sidebar.anket")}
                                </span>
                                <ion-icon name="chevron-forward-outline" style={this.state.activeList === 2? {
                                    marginRight: '-200px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '-200px',
                                    position: 'absolute',
                                    }}></ion-icon>
                            </div>
                            <div className={this.state.activeList=== 3 ? "lists" : "lists disabledList"} onClick={(e)=> this.changeList(3)}
                                style={{
                                    marginTop: 120
                                }}>
                                <ion-icon name="newspaper-outline" style={this.state.activeList === 3? {
                                    marginRight: '180px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '180px',
                                    position: 'absolute',
                                    }}></ion-icon>
                                <span className="sidebarSpan">
                                    {locale("user_home_sidebar.info")}
                                </span>
                                <ion-icon name="chevron-forward-outline" style={this.state.activeList === 3? {
                                    marginRight: '-200px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '-200px',
                                    position: 'absolute',
                                    }}></ion-icon>
                            </div>
                        </div>
                        <div className="sidebarList2">
                            <div className={this.state.activeList=== 1 ? "lists" : "lists disabledList"} onClick={(e)=> this.changeList(1)}>
                                <ion-icon name="person-outline" style={this.state.activeList === 1? {
                                    marginRight: '10px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '10px',
                                    position: 'absolute',
                                    }}></ion-icon>
                                
                                <ion-icon name="chevron-forward-outline" style={this.state.activeList === 1? {
                                    marginRight: '-45px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '-45px',
                                    position: 'absolute',
                                    }}></ion-icon>
                            </div>
                            <div  className={this.state.activeList=== 2 ? "lists" : "lists disabledList"} onClick={(e)=> this.changeList(2)} 
                                style={{
                                    marginTop: 100
                                }}>
                                <ion-icon name="id-card-outline" style={this.state.activeList === 2? {
                                    marginRight: '10px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '10px',
                                    position: 'absolute',
                                    }}></ion-icon>
                                <ion-icon name="chevron-forward-outline" style={this.state.activeList === 2? {
                                    marginRight: '-45px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '-45px',
                                    position: 'absolute',
                                    }}></ion-icon>
                            </div>
                            <div className={this.state.activeList=== 3 ? "lists" : "lists disabledList"} onClick={(e)=> this.changeList(3)}
                                style={{
                                    marginTop: 160
                                }}>
                                <ion-icon name="newspaper-outline" style={this.state.activeList === 3? {
                                    marginRight: '10px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '10px',
                                    position: 'absolute',
                                    }}></ion-icon>
                                <ion-icon name="chevron-forward-outline" style={this.state.activeList === 3? {
                                    marginRight: '-45px',
                                    position: 'absolute',
                                    color: '#7952B3'
                                    }
                                :
                                    {
                                    marginRight: '-45px',
                                    position: 'absolute',
                                    }}></ion-icon>
                            </div>
                        </div>
                        
                        <div className="sidebarFooter">
                            <img loading="lazy" src="/images/sidebarFooter.png" alt="logo" />
                        </div>
                    </div>


                    <div className={this.state.activeList === 1 ? "mainContent" : "contentTab"}>
                        <div className="headerTitle">
                            <h5 style={{color: '#7952B3', marginBottom: '-5px'}}>{locale("user_home_common.organization's")} 
                                <br/> &nbsp; &nbsp;&nbsp; {locale("user_home_common.united_system")}
                            </h5>
                            <h1 className="hrxHomeHeader" style={{color: '#23232A'}}>
                            {locale("user_home_common.user_info")}
                            </h1>
                        </div>
                        {
                            this.state.editingProfile ? 
                            <div className="widgets">
                                <div className="mainWidget">
                                    <div className="avatarDiv">
                                        <div className="changingAvatar">
                                            <ion-icon style={{color: '#23232A', fontSize: '30px'}} name="camera"></ion-icon>
                                            <ion-icon name="add" style={{position: 'absolute', left: '90px', top: '46px'}}></ion-icon>
                                        </div>
                                        <img  loading="lazy" className="avatarMain"
                                                style={{objectFit:'cover'}}
                                              src={avatar}
                                              alt="logo" width="120"/>
                                    </div>
                                    <div className="fields">

                                        <h5 className="titleHome">tatatunga.mn {locale("user_home_common.registration_info")} </h5>
                                        <div className="namesHome"> 
                                            <div style={{marginBottom: '-5px'}}>
                                                    <span style={{
                                                        fontSize: '16px',
                                                        color: '#AEACB8',
                                                        fontWeight: '700',
                                                        
                                                    }}> {locale("user_home_common.username")}</span>
                                            </div>
                                            <div style={{marginLeft: '5px'}}>
                                                    <h3 className="usernameHome"> {user?.username}</h3>
                                            </div>
                                        </div>
                                        <div className="fieldRow">
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.last_name")}</span> 
                                                {
                                                    this.state.last_name.error &&
                                                        <span className="errorSpan">
                                                            {this.state.last_name.error}
                                                        </span>
                                                }
                                                <div className="inputContainer"> 
                                                    <input type="text" className="inputDiv" 
                                                     value={this.state.last_name.text}
                                                    onChange={(e) => this.setState({last_name: {text: e.target.value, error: false}})}
                                                    style={this.state.last_name.error ?
                                                    {   border: '2px solid #e0393985',
                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                    :
                                                    {}
                                                    }
                                                    />
                                                </div>
                                            </div>
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.first_name")}</span> 
                                                {
                                                    this.state.first_name.error &&
                                                        <span className="errorSpan">
                                                            {this.state.first_name.error}
                                                        </span>
                                                }
                                                <div className="inputContainer"> 
                                                    <input type="text" className="inputDiv" 
                                                     value={this.state.first_name.text}
                                                    onChange={(e) => this.setState({first_name: {text: e.target.value, error: false}})}
                                                    style={this.state.first_name.error ?
                                                    {   border: '2px solid #e0393985',
                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                    :
                                                    {}
                                                    }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="fieldRow">
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.email")}</span> 
                                                {
                                                    this.state.email.error &&
                                                        <span className="errorSpan">
                                                            {this.state.email.error}
                                                        </span>
                                                }
                                                <div className="inputContainer"> 
                                                    <input type="text" className="inputDiv" 
                                                     value={this.state.email.text}
                                                    onChange={(e) => this.setState({email: {text: e.target.value, error: false}})}
                                                    style={this.state.email.error ?
                                                    {   border: '2px solid #e0393985',
                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                    :
                                                    {}
                                                    }
                                                    />
                                                </div>
                                            </div>
                                                <div className="fieldItem ">
                                                    <span className="inputSpan">{locale("user_home_common.phone")}</span> 
                                                    {
                                                        this.state.phone.error &&
                                                            <span className="errorSpan">
                                                                {this.state.phone.error}
                                                            </span>
                                                    }
                                                    <div className="inputContainer"> 
                                                        <input type="text" className="inputDiv" 
                                                        value={this.state.phone.text}
                                                        onChange={(e) => this.setState({phone: {text: e.target.value, error: false}})}
                                                        style={this.state.phone.error ?
                                                        {   border: '2px solid #e0393985',
                                                            boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                        :
                                                        {}
                                                        }
                                                        />
                                                    </div>
                                                </div>
                                        </div>
                                        <div className="fieldRow">
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.register_id")}</span> 
                                    
                                                <div className="inputContainer"> 
                                                    <input type="text" className="inputDiv" 
                                                     value={this.state.register_id.text}
                                                    onChange={(e) => this.setState({register_id: {text: e.target.value, error: false}})}
                                                    style={this.state.register_id.error ?
                                                    {   border: '2px solid #e0393985',
                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                    :
                                                        {}
                                                    }
                                                    />
                                                    {
                                                    this.state.register_id.error &&
                                                        <span className="errorSpan">
                                                            {this.state.register_id.error}
                                                        </span>
                                                }
                                                </div>
                                            </div>
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.gender")}</span>
                                                
                                                <div className="inputContainer"> 
                                                    <select className="inputDiv" name="gender" 
                                                        defaultValue={this.state.gender.text}
                                                        onChange={(e)=> this.setState({gender: {text: e.target.value, error: false}})}>
                                                        <option disabled selected value='' style={{display:"none"}}> {locale("user_home_common.gender")} </option>
                                                        <option value="male">{locale("user_home_common.male")}</option>
                                                        <option value="female">{locale("user_home_common.female")}</option>
                                                    </select>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div className="passwordRow">{locale("user_home_common.password")}</div>
                                        <hr />
                                    { this.state.passwordChange ?
                                    <>
                                        <div className="fieldRow">
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.new_password")}</span>
                                                {
                                                    this.state.password.error &&
                                                        <span className="errorSpan">
                                                            {this.state.password.error}
                                                        </span>
                                                }
                                                <div className="inputContainer"> 
                                                    <input type="password" className="inputDiv" 
                                                    name="password"
                                                    value={this.state.password.text}
                                                    onChange={(e) => this.setState({password: {text: e.target.value, error: false}})}
                                                    style={this.state.password.error ?
                                                    {   border: '2px solid #e0393985',
                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                    :
                                                        {}
                                                    }
                                                    />
                                                </div>
                                            </div>
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.new_password_repeat")}</span>
                                                <div className="inputContainer"> 
                                                    <input type="password" className="inputDiv"
                                                    name="passwordRepeat"
                                                    value={this.state.passwordRepeat.text}
                                                    onChange={(e) => this.setState({passwordRepeat: {text: e.target.value, error: false}})}
                                                    style={this.state.passwordRepeat.error ?
                                                    {   border: '2px solid #e0393985',
                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                    :
                                                        null
                                                    }
                                                    />
                                                {
                                                    this.state.passwordRepeat.error &&
                                                        <span className="errorSpan">
                                                            {this.state.passwordRepeat.error}
                                                        </span>
                                                }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="fieldRow">
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.old_password")}</span>
                                                <div className="inputContainer"> 
                                                    <input type="password" className="inputDiv" 
                                                    onChange={(e) => this.setState({oldPassword: {text: e.target.value, error: false}})}
                                                    />
                                                {
                                                    this.state.oldPassword.error &&
                                                        <span className="errorSpan">
                                                            {this.state.oldPassword.error}
                                                        </span>
                                                }
                                                </div>
                                            </div>
                                            <div className="fieldItem">
                                                    <button  className="returnButtonHome"
                                                        onClick={()=>this.setState({
                                                            passwordChange: false,
                                                            })}>
                                                            {locale("user_home_common.cancel")}
                                                    </button>
                                                    <button style={{width: 130}} className="passwordChange"
                                                        onClick={(e)=>this.passwordRepeat(e)}>
                                                            {locale("user_home_common.renew")}
                                                    </button>
                                                
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>  
                                            <div className="minimizeDiv" style={{fontSize: 15,fontWeight: 500, color: '#F8513C'}}>{locale("user_home_common.change_message")} </div>                
                                        
                                        <div className="fieldRow" style={{marginTop: 20}}>
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.password")}</span>
                                                {
                                                    this.state.passwordVerify.error &&
                                                        <span className="errorSpan">
                                                            {this.state.passwordVerify.error}
                                                        </span>
                                                }
                                                <div className="inputContainer"> 
                                                    <input type="password" className="inputDiv" 
                                                    onChange={(e) => this.setState({passwordVerify: {text: e.target.value, error: false}})}
                                                    />
                                                </div>
                                            </div>

                                            {this.state.editingProfile?
                                                null
                                                :
                                                <div className="fieldItem">
                                                    <button className="passwordChange"
                                                            onClick={()=>this.setState({passwordChange: true})}>
                                                        {locale("user_home_common.change_password")}
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    </>
                                    }

                                    </div>
                                    
                                    
                                </div>
                                <div className="sideWidgets">
                                    <div className="widgetButton" style={{
                                        height: 80, display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',    
                                        }}>
                                        <button className="hrxButton editButton" style={{
                                            width: 120,
                                            marginLeft: 10,
                                            padding: '5px 25px'
                                        }}
                                            onClick={(e) =>this.submitInfo(e)} >
                                            {locale("user_home_common.save")}
                                        </button>

                                        <button className="hrxButton backButton"
                                                onClick={(e) => this.bolio()} 
                                                style={{
                                                    width: 120,
                                                    marginRight: 10,
                                                    marginLeft: 10,
                                                    padding: '5px 25px',
                                                    color: '#F8513C'
                                                }}>
                                            {locale("user_home_common.cancel")}
                                        </button>
                                        
                                    </div>
                                    <div className="spacer"></div>
                                    <div className="widgetHome1">
                                        <div className="widgetIndex">
                                            <div className="fieldItem height65">
                                                <span className="inputSpan">{locale("user_home_common.birthday")}</span>
                                                {
                                                    this.state.birthday.error &&
                                                        <span className="errorSpan">
                                                            {this.state.birthday.error}
                                                        </span>
                                                }
                                                <br/>
                                                <div style={{display:"flex", flexDirection: "row", minWidth: "220px"}}>
                                                    
                                                    <div className=" inputDiv2">
                                                        <input type="date" className="inputDiv"  
                                                        value={moment(this.state.birthday.text).format("YYYY-MM-DD")}
                                                        onChange={(e) => this.setState({birthday: {text: e.target.value, error: false}})}
                                                        style={this.state.birthday.error ?
                                                        {   border: '2px solid #e0393985',
                                                            boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                        :
                                                        {   paddingLeft: 40}
                                                        }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="fieldItem height65">
                                                <span className="inputSpan">{locale("user_home_common.birth_place")}</span>
                                                {
                                                    this.state.birth_place.error &&
                                                        <span className="errorSpan">
                                                            {this.state.birth_place.error}
                                                        </span>
                                                }
                                                <br/>
                                                <div style={{display:"flex", flexDirection: "row", minWidth: "220px"}}>
                                                    <ion-icon style={{
                                                        color: '#1b2c38',
                                                        position: 'absolute',
                                                        fontSize: 22,
                                                        marginTop: 6,
                                                        marginLeft: 7
                                                        }} 
                                                            name="business-outline"></ion-icon>
                                                            
                                                    <div className="inputDiv2">
                                                        <input type="text" className="inputDiv"  
                                                            value={this.state.birth_place.text}
                                                            onChange={(e) => this.setState({birth_place: {text: e.target.value, error: false}})}
                                                            style={this.state.birth_place.error ?
                                                            {   border: '2px solid #e0393985',
                                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                            :
                                                            {}
                                                            }
                                                            />                                                            
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="widgetHome">
                                        <div className="widgetIndex">
                                                <div className="fieldItem height65">
                                                    <span className="inputSpan" >{locale("user_home_common.blood_type")}</span>
                                                    <br/>
                                                    
                                                    <div style={{display:"flex", flexDirection: "row", minWidth: "220px"}}>
                                                        <ion-icon style={{
                                                            color: '#F8513C',
                                                            position: 'absolute',
                                                            fontSize: 20,
                                                            marginTop: 5,
                                                            marginLeft: 2
                                                            }} 
                                                            name="water-outline"></ion-icon>
                                                        <ion-icon style={{
                                                            color: '#F8513C',
                                                            position: 'absolute',
                                                            marginLeft: '13px',
                                                            marginTop: '10px',
                                                            fontSize: 24
                                                            }}
                                                            name="water"></ion-icon>
                                                        <div className="inputDiv2" >
                                                            <select className="inputDiv bloodDiv" 
                                                            defaultValue={this.state.bloodType.text}
                                                            onChange={(e) => this.setState({bloodType: {text: e.target.value, error: false}})}>
                                                                <option disabled selected value='' style={{display:"none"}}>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;- - - - - - -</option>
                                                                <option value={'o+'}>{locale("user_home_blood_types.o+")}</option>
                                                                <option value={'a+'}>{locale("user_home_blood_types.a+")}</option>
                                                                <option value={'b+'}>{locale("user_home_blood_types.b+")}</option>
                                                                <option value={'ab+'}>{locale("user_home_blood_types.ab+")}</option>
                                                                <option value={'o-'}>{locale("user_home_blood_types.o-")}</option>
                                                                <option value={'a-'}>{locale("user_home_blood_types.a-")}</option>
                                                                <option value={'b-'}>{locale("user_home_blood_types.b-")}</option>
                                                                <option value={'ab-'}>{locale("user_home_blood_types.ab-")}</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" height65">
                                                    <span className="inputSpan">{locale("user_home_common.driving_type")}</span>
                                                        <div style={{display:"flex", flexDirection: "row", minWidth: "220px"}}>
                                                            <ion-icon style={{
                                                            color: '#7952B3',
                                                            position: 'absolute',
                                                            fontSize: 20,
                                                            marginTop: 5,
                                                            marginLeft: 2
                                                            }}
                                                            name="car-outline"></ion-icon>
                                                            <ion-icon style={{
                                                            color: '#7952B3',
                                                            position: 'absolute',
                                                            marginLeft: '15px',
                                                            marginTop: '10px',
                                                            fontSize: 24
                                                            }} 
                                                            name="car-sport"></ion-icon>
                                                            <div className="inputDiv2">
                                                                <div className="inputDiv" style={{background: '#F2E8E9', border: '1px solid #f5f7b2',padding: 0}}>
                                                                    <div className="inputDivDrive">
                                                                        {this.state.drivingLicense.map((c)=> {
                                                                            return  <div className="driverType">
                                                                                        {c.toUpperCase()}
                                                                                    </div>
                                                                        })}
                                                                    </div>
                                                                    <button className="xButton" onClick={() => this.setState({drivingLicense: []})}>
                                                                        <ion-icon name="close-circle" style={{
                                                                            fontSize: 20,
                                                                            position: 'absolute',
                                                                            marginLeft: '-30px',
                                                                            marginTop: '-40px'
                                                                            }}></ion-icon>
                                                                    </button>
                                                                </div>  
                                                            </div>
                                                        </div>
                                                        <div className="driverButtons">
                                                            <button value='a' className="driverButton" onClick={(e)=>this.licenseToggle(e.target.value)}>A</button>
                                                            <button value='b' className="driverButton" onClick={(e)=>this.licenseToggle(e.target.value)}>B</button>
                                                            <button value='c' className="driverButton" onClick={(e)=>this.licenseToggle(e.target.value)}>C</button>
                                                            <button value='d' className="driverButton" onClick={(e)=>this.licenseToggle(e.target.value)}>D</button>
                                                            <button value='e' className="driverButton" onClick={(e)=>this.licenseToggle(e.target.value)}>E</button>
                                                            <button value='m' className="driverButton" onClick={(e)=>this.licenseToggle(e.target.value)}>M</button>
                                                        </div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="widgets">
                            <div className="mainWidget">
                                <div className="avatarDiv">
                                    <div className="changingAvatar">
                                        <ion-icon style={{color: '#23232A', fontSize: '30px'}} name="camera"></ion-icon>
                                        <ion-icon name="add" style={{position: 'absolute', left: '90px', top: '46px'}}></ion-icon>
                                    </div>
                                    <img  loading="lazy" className="avatarMain"
                                          // src="/images/avatar.jpg"
                                          style={{objectFit:'cover'}}
                                          src={avatar}
                                          alt="logo" width="120"/>
                                </div>
                                <div className="fields">

                                    <h5 className="titleHome">tatatunga.mn {locale("user_home_common.registration_info")} </h5>
                                    <div className="namesHome"> 
                                        <div style={{marginBottom: '-5px'}}>
                                                <span style={{
                                                    fontSize: '16px',
                                                    color: '#AEACB8',
                                                    fontWeight: '700',
                                                    
                                                }}> {locale("user_home_common.username")}</span>
                                        </div>
                                        <div style={{marginLeft: '5px'}}>
                                                <h3 className="usernameHome"> {user?.username}</h3>
                                        </div>
                                    </div>
                                    <div className="fieldRow">
                                        <div className="fieldItem">
                                            <span className="inputSpan">{locale("user_home_common.last_name")}</span>
                                            <div className="inputDiv"> 
                                                {this.state.last_name.text}
                                            </div>
                                        </div>
                                        <div className="fieldItem">
                                            <span className="inputSpan">{locale("user_home_common.first_name")}</span>
                                            <div className="inputDiv">
                                                {this.state.first_name.text}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fieldRow">
                                        <div className="fieldItem">
                                            <span className="inputSpan">{locale("user_home_common.email")}</span>
                                            <div className="inputDiv">
                                                {this.state.email.text}
                                        </div>
                                        </div>
                                        <div className="fieldItem">
                                            <span className="inputSpan">{locale("user_home_common.phone")}</span>
                                            <div className="inputDiv"> 
                                                {this.state.phone.text}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fieldRow">
                                        <div className="fieldItem">
                                            <span className="inputSpan">{locale("user_home_common.register_id")}</span>
                                            <div className="inputDiv">
                                                {this.state.register_id.text}
                                        </div>
                                        </div>
                                        <div className="fieldItem">
                                            <span className="inputSpan">{locale("user_home_common.gender")}</span>
                                            <div className="inputDiv"> 
                                               {this.state.gender.text=== "male" ? locale("user_home_common.male") : locale("user_home_common.female")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="passwordRow">{locale("user_home_common.password")}</div>
                                    <hr />
                                    { this.state.passwordChange ?
                                    <>
                                        <div className="fieldRow">
                                            <div className="fieldItem ">
                                                <span className="inputSpan">{locale("user_home_common.new_password")}</span>
                                                {
                                                    this.state.password.error &&
                                                        <span className="errorSpan">
                                                            {this.state.password.error}
                                                        </span>
                                                }
                                                <div className="inputContainer"> 
                                                    <input type="password" className="inputDiv" 
                                                     value={this.state.password.text}
                                                    onChange={(e) => this.setState({password: {text: e.target.value, error: false}})}
                                                    style={this.state.password.error ?
                                                    {   border: '2px solid #e0393985',
                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                    :
                                                        {}
                                                    }
                                                    />
                                                </div>
                                            </div>
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.new_password_repeat")}</span>
                                                <div className="inputContainer"> 
                                                    <input type="password" className="inputDiv" 
                                                     value={this.state.passwordRepeat.text}
                                                    onChange={(e) => this.setState({passwordRepeat: {text: e.target.value, error: false}})}
                                                    style={this.state.passwordRepeat.error ?
                                                    {   border: '2px solid #e0393985',
                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',}
                                                    :
                                                        null
                                                    }
                                                    />
                                                {
                                                    this.state.passwordRepeat.error &&
                                                        <span className="errorSpan">
                                                            {this.state.passwordRepeat.error}
                                                        </span>
                                                }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="fieldRow">
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.old_password")}</span>
                                                <div className="inputContainer"> 
                                                    <input type="password" className="inputDiv" 
                                                    onChange={(e) => this.setState({oldPassword: {text: e.target.value, error: false}})}
                                                    />
                                                {
                                                    this.state.oldPassword.error &&
                                                        <span className="errorSpan">
                                                            {this.state.oldPassword.error}
                                                        </span>
                                                }
                                                </div>
                                            </div>
                                            <div className="fieldItem">
                                                
                                                    <button  className="returnButtonHome"
                                                    onClick={()=>this.setState({passwordChange: false,
                                                        password: {
                                                            text: '',
                                                            error: false
                                                        },
                                                        passwordRepeat: {
                                                            text: '',
                                                            error: false
                                                        }
                                                        })}>
                                                        {locale("user_home_common.cancel")}
                                                    </button>
                                                    <button style={{width: 130}} className="passwordChange"
                                                    onClick={(e)=>this.passwordRepeat(e)}>
                                                            {locale("user_home_common.renew")}
                                                    </button>
                                                
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        
                                        <div className="fieldRow" style={{marginTop: 10}}>
                                            <div className="fieldItem">
                                                <span className="inputSpan">{locale("user_home_common.password")}</span>
                                                    <div className="inputDiv"> 
                                                        * * * * * * * *
                                                    </div>
                                            </div>
                                            <div className="fieldItem">
                                                <button className="passwordChange"
                                                onClick={()=>this.setState({passwordChange: true})}>
                                                        {locale("user_home_common.change_password")}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                    }

                                </div>
                                
                                
                            </div>
                            <div className="sideWidgets">
                                <div className="widgetButton" style={{
                                    height: 80, display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'}}>
                                    <button className="hrxButton editButton"
                                    disabled={this.state.passwordChange}
                                    onClick={()=> this.setState({editingProfile: true})} >
                                        <ion-icon name="cog-outline" style={{ 
                                            fontSize: '20px', 
                                            position: 'absolute', 
                                            marginLeft: '-25px',
                                            marginTop: '-3px'}}></ion-icon> 
                                    {locale("user_home_common.change")}  
                                    </button>
                                    
                                </div>
                                <div className="spacer"></div>
                                <div className="widgetHome1">
                                    <div className="widgetIndex">
                                        <div className="fieldItem height65">
                                            <span className="inputSpan">{locale("user_home_common.birthday")}</span>
                                            <br/>
                                            <div style={{display:"flex", flexDirection: "row", minWidth: "220px"}}>
                                                <ion-icon style={{
                                                    color: '#1b2c38',
                                                    position: 'absolute',
                                                    fontSize: 22,
                                                    marginTop: 6,
                                                    marginLeft: 7
                                                    }} 
                                                    name="calendar-outline"></ion-icon>
                                                <div className="inputDiv inputDiv2">
                                                    {moment(this.state.birthday.text).format("YYYY-MM-DD")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="fieldItem height65">
                                            <span className="inputSpan">{locale("user_home_common.birth_place")}</span>
                                            <br/>
                                            <div style={{display:"flex", flexDirection: "row", minWidth: "220px"}}>
                                                <ion-icon style={{
                                                    color: '#1b2c38',
                                                    position: 'absolute',
                                                    fontSize: 22,
                                                    marginTop: 6,
                                                    marginLeft: 7
                                                    }} 
                                                        name="business-outline"></ion-icon>
                                                        
                                                <div className="inputDiv inputDiv2">
                                                    {this.state.birth_place.text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="widgetHome">
                                    <div className="widgetIndex">
                                            <div className="fieldItem height65">
                                                <span className="inputSpan" >{locale("user_home_common.blood_type")}</span>
                                                <br/>
                                                <div style={{display:"flex", flexDirection: "row", minWidth: "220px"}}>
                                                    <ion-icon style={{
                                                        color: '#F8513C',
                                                        position: 'absolute',
                                                        fontSize: 20,
                                                        marginTop: 5,
                                                        marginLeft: 2
                                                        }} 
                                                        name="water-outline"></ion-icon>
                                                    <ion-icon style={{
                                                        color: '#F8513C',
                                                        position: 'absolute',
                                                        marginLeft: '13px',
                                                        marginTop: '10px',
                                                        fontSize: 24
                                                        }}
                                                        name="water"></ion-icon>
                                                    <div className="inputDiv inputDiv2" >
                                                        {this.state.bloodType.text ? printBloodType(this.state.bloodType.text) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="height65">
                                                { Cookies.get("lang") === "rs" ? (
                                                    <span style={{fontSize: 14}} className="inputSpan">{locale("user_home_common.driving_type")}</span>
                                                    )
                                                    :
                                                    Cookies.get("lang") === "kaz" ? (
                                                        <span style={{fontSize: 14}} className="inputSpan">{locale("user_home_common.driving_type")}</span>
                                                    )
                                                    :
                                                    <span className="inputSpan">{locale("user_home_common.driving_type")}</span>
                                                }
                                                
                                                    <div style={{display:"flex", flexDirection: "row", minWidth: "220px"}}>
                                                        <ion-icon style={{
                                                        color: '#7952B3',
                                                        position: 'absolute',
                                                        fontSize: 20,
                                                        marginTop: 5,
                                                        marginLeft: 2
                                                        }} 
                                                        name="car-outline"></ion-icon>
                                                        <ion-icon style={{
                                                        color: '#7952B3',
                                                        position: 'absolute',
                                                        marginLeft: '15px',
                                                        marginTop: '10px',
                                                        fontSize: 24
                                                        }} 
                                                        name="car-sport"></ion-icon>
                                                        <div className="inputDiv inputDiv2" style={{paddingLeft: 10}}>
                                                            {this.state.drivingLicense.map((c)=> {
                                                                return <div className="driverType">
                                                                    {c.toUpperCase()}
                                                                </div>
                                                            })}
                                                        </div>
                                                    </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>

                    <div className={this.state.activeList === 2 ? "mainContent" : "contentTab"}>
                        <h5>{locale("user_home_sidebar.anket")}</h5>
                    </div>
                </div>
                
                {/* Company modal */}
                <div className="modal fade" id="companies" tabIndex="-1" role="dialog" data-backdrop="static" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content companiesContent">
                            <div className="modal-header companyTitle">
                                <h5 className="modal-title"  id="exampleModalLabel">{locale("user_home_common.companies")}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="companiesBody">
                                {
                                     (companies || []).map(company => (
                                        <div className="companiesList" onClick={this.throw.bind(this, company)}>
                                            <div className="companyTitles">
                                                <div className="img">
                                                    <img
                                                        onError={(e) => e.target.src = `/images/logo_notfound.png`}
                                                        src={company.logo && typeof company.logo === "object" && company.logo.path && company.logo.path !== ''? `${config.get('hostMedia')}${company.logo.path}` : '/images/logo_notfound.png'}
                                                        alt=''
                                                    />
                                                </div>
                                                <div className="titles">
                                                    <span className="com-name">{company.name}</span>
                                                    <span className="website">{`${company.domain}.tatatunga.mn`}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    (pendingCompanies || []).length > 0 ?
                                        <>
                                            {locale("user_home_company_modal.pending_companies")}
                                            {
                                                (pendingCompanies || []).map(company => (
                                                    <div className="companiesList" style={{cursor: 'default'}}>
                                                        <div className="companyTitles">
                                                            <div className="img">
                                                                <img
                                                                    onError={(e) => e.target.src = `/images/logo_notfound.png`}
                                                                    src={company.logo && typeof company.logo === "object" && company.logo.path && company.logo.path !== ''? `${config.get('hostMedia')}${company.logo.path}` : '/images/logo_notfound.png'}
                                                                    alt=''
                                                                />
                                                            </div>
                                                            <div className="titles">
                                                                <span className="com-name">{company.name}</span>
                                                                <span className="website">{`${company.domain}.tatatunga.mn`}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <p style={{textAlign: 'center', padding: 10}}>
                                                {locale("user_home_company_modal.pending_message")}
                                            </p>
                                            <div className="container-fluid">
                                                <div className="row">
                                                    <div className="col-sm-6" style={{textAlign: 'center'}}>
                                                        <div><ion-icon name="mail-open" style={{position: 'relative', top: 5}}/>&nbsp; info@hrx.mn</div>
                                                    </div>
                                                    <div className="col-sm-6" style={{textAlign: 'center'}}>
                                                        <div><ion-icon name="call" style={{position: 'relative', top: 5}}/>&nbsp; +976 8852-6060</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
export default connect(reducer)(UserHome)