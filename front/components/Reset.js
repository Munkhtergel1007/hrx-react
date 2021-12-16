import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { string } from '../config';
import * as actions from "../actions/home_actions";


const reducer = ({main}) => ({main})

class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: {
                text: '',
                error: false
            },
            passwordRepeat: {
                text: '',
                error: false
            },
            showReset: false,
            submiting : false,
        }
    }
    componentDidMount(){
        if(this.props.main.userReset && !(this.props.main.user && this.props.main.user._id)){
            this.setState({showReset: true})
        }
    }
    submitReset(e) {
        e.preventDefault()
        const {
            password,
            passwordRepeat
        } = this.state
        if(string(password.text) === ''){
            this.setState({password: {text: password.text, error: 'Нууц үгээ оруулна уу'}});
        } else if(password.text.trim().length<8) {
            this.setState({password: {text: password.text, error: 'Доод тал нь 8 оронтой нууц үг оруулна уу'}});
        } else if(password.text.trim().length>30) {
            this.setState({password: {text: password.text, error: 'Нууц үг хэт урт байна'}});
        } else if(string(password.text) !== string(passwordRepeat.text)){
            this.setState({passwordRepeat: {text: passwordRepeat.text, error: 'Нууц үгийн давталт зөрж байна'}})
        } else {
            this.setState({submitting : true}, () => {
                this.props.dispatch(actions.savePassword({
                    newPassword: this.state.password.text, 
                    newPasswordRepeat: this.state.passwordRepeat.text, 
                    id: this.props.main.userReset._id,
                    token: this.props.main.token
                })).then(c => {
                    if(c.json.success){
                        this.props.dispatch(actions.loginFrontToCompany({
                            username: this.props.main.userReset.username,
                            password: this.state.password.text
                        })).then(hhe => {
                            if(hhe.json.success){
                                this.setState({
                                    submitting: false,
                                    showReset: false,
                                })
                            }
                        })   
                    }
                })
            })
        }
        

    }
    render() {
        
        const {main: {user}}=this.props
        return(
            <Modal dialogClassName="modalReset" show={this.state.showReset} onHide={() => this.setState({showReset: false})} backdrop="static" >
                <form>       
                            <Modal.Header>
                                <div className="resetHeader">
                                        <img loading="lazy" src="/images/hrx-logo.png" alt="logo" width="100"/>
                            
                                </div>
                                <h5  id="headerResetModal">Нууц үг сэргээх</h5>
                            </Modal.Header>
                                    <Modal.Body className="resetBody">
                                        <div className="forgotSpan">
                                        <span >Та шинэ нууц үгээ оруулна уу.</span>
                                        </div>
                                        <div className="form-item">
                                            <input className="loginField"
                                            style={this.state.password.error ? {
                                                border: '2px solid #e0393985',
                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                height: 40
                                                } : {height: 40}}
                                            onChange={e => this.setState({password: {text: e.target.value, error: false}})}
                                            value={this.state.password.text ? this.state.password.text :   ''}
                                                    placeholder="Шинэ нууц үг" type="password"
                                            />
                                        {this.state.password.error ?
                                                <div className="displayState">{this.state.password.error}</div>
                                                    :
                                                null
                                                        }
                                        </div>
                                        <div className="form-item">
                                            <input className="loginField"
                                            style={this.state.passwordRepeat.error ? {
                                                border: '2px solid #e0393985',
                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                height: 40
                                                } : {height: 40}}
                                            onChange={e => this.setState({passwordRepeat: {text: e.target.value, error: false}})}
                                            value={this.state.passwordRepeat.text ? this.state.passwordRepeat.text :  ''}
                                                    placeholder="Шинэ нууц үгээ давтана уу" type="password"
                                            />
                                            {this.state.passwordRepeat.error ?
                                                <div className="displayState">{this.state.passwordRepeat.error}</div>
                                                    :
                                                null
                                                        }
                                        </div>
                                        
                                    </Modal.Body>
                                    <div className="resetFooter">
                                        <hr style={{paddingLeft: 0, paddingRight: 0 }} />
                                            <button 
                                                className="resetButton crumina-button button--dark loginField" 
                                                onClick={e => this.submitReset(e)}
                                            > 
                                            {
                                                this.state.submitting ? <>
                                                <i className="fa fa-circle-o-notch fa-spin loadingReset"/> 
                                                Шинэчлэх
                                                </>
                                                :
                                                "Шинэчлэх"
                                                
                                            }
                                            </button>
                                            
                                    </div>
                    </form>     
                        
            </Modal>
            
        )
    }
}
export default connect(reducer)(Reset)