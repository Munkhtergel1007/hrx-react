import React from 'react';
// import ReactGA from 'react-ga';
import ReactGA from 'react-ga';
import {connect} from "react-redux";
import * as actions from "../actions/index";

const reducer = ({ main }) => ({ main });

class Layer extends React.Component{
    constructor(props){
        super(props);
        // ReactGA.initialize('UA-185351105-1');
        // ReactGA.initialize('UA-210410336-1'); // hrx.mn
        ReactGA.initialize('UA-211875339-1'); // tatatunga.mn
        // ReactGA.pageview(window.location.pathname + window.location.search);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    async componentDidCatch(error, errorInfo) {
        const response = await actions.error({
            error: error && error.toString() || '',
            url: window.location.href,
            errorInfo: errorInfo.componentStack
        });
    }

    onPress() {
        window.location.assign('/');
    }

    render(){
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    backgroundImage: `url(../imagesSchool/404.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    padding: 0
                }}>
                    <div style={{
                        display: 'table',
                        position: 'absolute',
                        height: '100vh',
                        width: '100%',
                        left: 0,
                        background: 'rgba(17, 17, 17, .9)',
                    }}>
                        <div style={{
                            display: 'table-cell',
                            verticalAlign: 'middle',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0
                            }} onClick={() => this.onPress()}>
                                <img style={{marginTop: 30, cursor: 'pointer'}} width="240" id="single-logo"
                                   className="img-responsive"
                                   src="/images/logo-white.png"
                                   alt="logo"/>
                            </div>
                            <div style={{
                                fontSize: 220,
                                lineHeight: '220px',
                                color: '#999',
                                fontWeight: 700,
                                marginTop: 70
                            }}>403</div>
                            <h3 style={{
                                fontSize: 36,
                                lineHeight: '36px',
                                color: '#fff',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: 1
                            }}>oops ! ... Something went wrong</h3>
                            <p style={{
                                color: '#999',
                                fontSize: 15,
                                padding: '20px 0',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                margin: '0 auto',
                                maxWidth: 530
                            }}>Уучлаарай таны хандсан хуудсанд алдаа илэрлээ бид тун удахгүй засах болно.</p>
                            <button className="blue" onClick={() => this.onPress()}>
                                Нүүр хуудасруу буцах
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
export default  connect(reducer)(Layer);
