import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config from "../../config";
import {
    QuestionOutlined,
    CameraFilled
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Form,
    Row,
    Col,
    Typography,
    Tooltip,
    DatePicker,
    Image,
} from 'antd';
import {
    changeCompanyUploads,
} from '../../actions/settings_actions';
import {SwatchesPicker} from 'react-color'
import MediaLib from "../media/MediaLib";
import {locale} from "../../lang"

const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class LogoAndPhotos extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mediaType: '',
            forWhat: '',
        };
        document.title = 'Settings | Logo, Pictures  |  TAPSIR';
    }
    openMediaLib(mediaType, forWhat){
        this.setState({mediaType, forWhat:forWhat});
    }
    chooseMedia(data, type){
        this.props.dispatch(changeCompanyUploads({forWhat:this.state.forWhat, image:data[0]}));
    }
    render() {
        const { main:{company, companyUploadSelectLoading} } = this.props;
        return (
            <React.Fragment>
                <Row justify="center" align="center" style={{width: '100%'}}>
                    <Col span={18}>
                        <Form
                            size={'small'}
                            layout="vertical"
                            onFinish={() => false}
                        >
                            <Form.Item
                                label={
                                    <label style={{display: 'block', marginBottom: 10}}>
                                        <span style={{display: 'flex', alignItems: 'center'}}>
                                            <Tooltip title={locale ('common_organization.logo_max_size')}>
                                                <QuestionOutlined style={{fontSize: 10, backgroundColor: '#e6e6e6', padding: '3px', borderRadius: '50%', marginRight: '5px', color: 'red'}}/>
                                            </Tooltip>
                                            <Tooltip title={locale ('common_organization.logo_max_size_text')}>
                                                {locale ('common_organization.logo')}&nbsp;&nbsp;&nbsp;&nbsp;
                                                {/*{this.state.loadingCoverSize && <span style={{color: 'red', fontSize: 11}}>/ Зургын харьцааг уншиж байна. /</span>}*/}
                                            </Tooltip>
                                        </span>
                                    </label>
                                }
                                name="logo"
                            >
                                <div className='settings-upload-logo'>

                                    {company.logo && company.logo.path && company.logo.path !=='' ?
                                        <Image
                                            src={company.logo && company.logo.path ? `${config.get('hostMedia')}${company.logo.path}` : '/images/logo_notfound.png'}
                                            fallback="/images/logo_notfound.png"
                                        />
                                        :
                                        <img src='/images/logo_notfound.png' alt='' />
                                    }
                                    <Tooltip title={locale ('common_organization.zurag_solih')}>
                                        <div className='merchant-avatar-edit-icon'
                                             onClick={companyUploadSelectLoading ? null : this.openMediaLib.bind(this, 'image', 'logo')}
                                        >
                                            <CameraFilled />
                                        </div>
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <label style={{display: 'block', marginBottom: 10}}>
                                        <span style={{display: 'flex', alignItems: 'center'}}>
                                            <Tooltip title={locale ('common_organization.cover_max_size')}>
                                                <QuestionOutlined style={{fontSize: 10, backgroundColor: '#e6e6e6', padding: '3px', borderRadius: '50%', marginRight: '5px', color: 'red'}}/>
                                            </Tooltip>
                                            <Tooltip title={locale ('common_organization.cover_max_size_text')}>
                                                {locale ('common_organization.cover')}&nbsp;&nbsp;&nbsp;&nbsp;
                                                {/*{this.state.loadingCoverSize && <span style={{color: 'red', fontSize: 11}}>/ Зургын харьцааг уншиж байна. /</span>}*/}
                                            </Tooltip>
                                        </span>
                                    </label>
                                }
                                name="cover"
                            >
                                <div className='settings-upload-cover'>
                                    {company.cover && company.cover.path && company.cover.path !=='' ?
                                        <Image
                                            src={`${config.get('hostMedia')}${company.cover.path}`}
                                            fallback="/images/cover-notfound.jpg"
                                        />
                                        :
                                        <img src='/images/cover-notfound.jpg' alt='' />
                                    }
                                    <Tooltip title={locale ('common_organization.zurag_solih')}>
                                        <div className='merchant-avatar-edit-icon'
                                             onClick={companyUploadSelectLoading ? null : this.openMediaLib.bind(this, 'image', 'cover')}
                                        >
                                            <CameraFilled />
                                        </div>
                                    </Tooltip>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                {this.state.mediaType !== ''?
                    <MediaLib
                        visible={this.state.mediaType !== ''}
                        multi={false}
                        onOk={this.chooseMedia.bind(this)}
                        type={this.state.mediaType}
                        // dimension={{width:1200, height: 450}}
                        forWhat={this.state.forWhat}
                        onHide={() => this.setState({mediaType: ''})}
                    />
                    :
                    null
                }
            </React.Fragment>
        );
    }
}

export default connect(reducer)(LogoAndPhotos);