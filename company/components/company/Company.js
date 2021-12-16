import React, {Component} from "react";
import { connect } from 'react-redux';
import config from "../../config";
import moment from "moment";
import * as actions from "../../actions/dashboard_actions";
import { Link } from 'react-router-dom';

const reducer = ({ main }) => ({ main });
import {Card, Button, Table, Popconfirm, Tag, Input, Badge, Select, List, Row, Col, Typography, Slider, Progress, Tooltip, Divider } from 'antd';
const { Title } = Typography;
import { EnvironmentOutlined, PhoneOutlined, GlobalOutlined, CarryOutOutlined } from '@ant-design/icons'
import {locale} from '../../lang';

class Company extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let {  main:{user, employee, company}  } = this.props;
        let logo = '/images/default-company.png';
        if(company.logo && (company.logo || {}).path !== ''){
            logo = `${config.get('hostMedia')}${(company.logo || {}).path}`;
        }
        return (
            <React.Fragment>
                <div className='banner'>
                    {company.cover ? <img style={{width: '100%', maxHeight: '250px', objectFit: 'cover', objectPosition: 'center'}} src={`${config.get('hostMedia')}${company.cover.path}`} /> : <div style={{backgroundColor: '#D2B48C', height: '250px', width: '100%'}} />}
                </div>
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'relative'}}>
                    <div style={{width: '90%'}}>
                        {/*<Row style={ company.cover ? {top: '-50px', position: 'relative'} : {position: 'relative'}} gutter={[24, 0]}>*/}
                        <Row style={{top: '-50px', position: 'relative'}} gutter={[24, 0]}>
                            <Col span={company.address || company.phone || company.website || company.isCons ? 18 : 24}>
                                <div style={
                                    // company.cover ? {display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '24px'}
                                    //     : {position: 'relative', marginBottom: '24px'}
                                    {display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '24px'}
                                }>
                                    <Card
                                        cover={
                                            <div style={{position: 'relative', display: 'flex', justifyContent: 'center', height: '60px'}}>
                                                <div style={{display: 'flex', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', alignItems: 'center', position: 'absolute', top: '-75px', boxShadow: 'rgb(0 0 0 / 14%) 0px 1px 3px, rgb(0 0 0 / 24%) 2px 3px 4px'}}>
                                                    <img style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center'}} src={logo}/>
                                                </div>
                                            </div>
                                        }
                                        style={{width: '100%'}}
                                    >
                                        <Title style={{textAlign: 'center', marginBottom: '15px'}}>
                                            {company.name}
                                        </Title>
                                        <div style={{minHeight: '100px', marginBottom: '30px'}}>
                                            <Title level={4} style={{marginBottom: '5px', borderLeft: '2px solid #1A3452', paddingLeft: '5px'}}>{locale('common_organization.erhem_zorilgo')}</Title>
                                            <p>{company.mission ? company.mission : locale('common_organization.erhem_zorilgo_hooson_baina')}</p>
                                        </div>
                                        <div style={{minHeight: '100px', marginBottom: '30px'}}>
                                            <Title level={4} style={{marginBottom: '5px', borderLeft: '2px solid #1A3452', paddingLeft: '5px'}}>{locale('common_organization.alsiin_haraa')}</Title>
                                            <p>{company.vision ? company.vision : locale('common_organization.alsiin_haraa_hooson_baina')}</p>
                                        </div>
                                        <div style={{minHeight: '100px', marginBottom: '30px'}}>
                                            <Title level={4} style={{marginBottom: '5px', borderLeft: '2px solid #1A3452', paddingLeft: '5px'}}>{locale('common_organization.unet_zuils')}</Title>
                                            <p>{company.value ? company.value : locale('common_organization.unet_zuils_hooson_baina')}</p>
                                        </div>
                                        <div style={{minHeight: '100px', marginBottom: '30px'}}>
                                            <Title level={4} style={{marginBottom: '5px', borderLeft: '2px solid #1A3452', paddingLeft: '5px'}}>{locale('common_organization.kompaniin_tuhai')}</Title>
                                            <p>{company.description ? company.description : locale('common_organization.kompanii_d_m_h_b')}</p>
                                        </div>
                                        <div style={{minHeight: '100px', marginBottom: '30px'}}>
                                            <Title level={4} style={{marginBottom: '5px', borderLeft: '2px solid #1A3452', paddingLeft: '5px'}}>{locale('common_organization.kompanii_uria')}</Title>
                                            <p style={{marginBottom: '0'}}> {company.slogan ? company.slogan : locale('common_organization.kompanii_uria_hooson_baina')}</p>
                                        </div>
                                        {/*<Card title='Компаний тухай' style={{boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.2)', marginBottom: '24px'}} headStyle={{fontWeight: '600'}}>*/}
                                        {/*    <p style={{marginBottom: '0'}}>{company.description ? company.description : 'Компаний дэлгэрэнгүй мэдээлэл хоосон байна'}</p>*/}
                                        {/*</Card>*/}
                                        {/*<Card title='Компаний уриа' style={{boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.2)'}} headStyle={{fontWeight: '600'}}>*/}
                                        {/*    <p style={{marginBottom: '0'}}> {company.slogan ? company.slogan : 'Компаний уриа хоосон байна'}</p>*/}
                                        {/*</Card>*/}
                                    </Card>
                                    {/*{*/}
                                    {/*    company.cover ?*/}
                                    {/*        <Card*/}
                                    {/*            cover={*/}
                                    {/*                <div style={{position: 'relative', display: 'flex', justifyContent: 'center', height: '60px'}}>*/}
                                    {/*                    <div style={{display: 'flex', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', alignItems: 'center', position: 'absolute', top: '-75px', boxShadow: 'rgb(0 0 0 / 14%) 0px 1px 3px, rgb(0 0 0 / 24%) 2px 3px 4px'}}>*/}
                                    {/*                        <img style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center'}} src={logo}/>*/}
                                    {/*                    </div>*/}
                                    {/*                </div>*/}
                                    {/*            }*/}
                                    {/*            style={{width: '100%'}}*/}
                                    {/*        >*/}
                                    {/*            <Title style={{textAlign: 'center', marginBottom: '5px'}}>*/}
                                    {/*                {company.name}*/}
                                    {/*            </Title>*/}

                                    {/*            <div style={{borderLeft: '3px solid #1A3452', maxWidth: '700px', paddingLeft: '10px'}}>*/}
                                    {/*                <Title level={3}>Эрхэм зорилго</Title>*/}
                                    {/*                <p style={{marginBottom: '0'}}>{company.mission ? company.mission : 'Эрхэм зорилго хоосон байна'}</p>*/}
                                    {/*            </div>*/}
                                    {/*            <div style={{borderRight: '3px solid #1A3452', float: 'right', maxWidth: '700px', paddingRight: '10px', textAlign: 'right', marginBottom: '24px'}}>*/}
                                    {/*                <Title level={3}>Алсын хараа</Title>*/}
                                    {/*                <p style={{marginBottom: '0'}}>{company.vision ? company.vision : 'Алсын хараа хоосон байна'}</p>*/}
                                    {/*            </div>*/}
                                    {/*            <div style={{clear: 'both'}} />*/}
                                    {/*            <Card title='Компаний тухай' style={{boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.2)', marginBottom: '24px'}} headStyle={{fontWeight: '600'}}>*/}
                                    {/*                <p style={{marginBottom: '0'}}>{company.description ? company.description : 'Компаний дэлгэрэнгүй мэдээлэл хоосон байна'}</p>*/}
                                    {/*            </Card>*/}
                                    {/*            <Card title='Компаний уриа' style={{boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.2)'}} headStyle={{fontWeight: '600'}}>*/}
                                    {/*                <p style={{marginBottom: '0'}}> {company.slogan ? company.slogan : 'Компаний уриа хоосон байна'}</p>*/}
                                    {/*            </Card>*/}
                                    {/*        </Card>*/}
                                    {/*        :*/}
                                    {/*        <Card style={{boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.2)'}}>*/}
                                    {/*            <Row>*/}
                                    {/*                <Col span={6} style={{display: 'flex', justifyContent: 'center',}}>*/}
                                    {/*                    <div style={{display: 'flex', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', alignItems: 'center', width: '160px', height: '160px', boxShadow: 'rgb(0 0 0 / 14%) 0px 1px 3px, rgb(0 0 0 / 24%) 2px 3px 4px'}}>*/}
                                    {/*                        <img style={{width: '150px', height: '150px', borderRadius: '50%'}} src={logo}/>*/}
                                    {/*                    </div>*/}
                                    {/*                </Col>*/}
                                    {/*                <Col span={18}>*/}
                                    {/*                    <Title style={{marginBottom: '5px'}}>*/}
                                    {/*                        {company.name}*/}
                                    {/*                    </Title>*/}
                                    {/*                </Col>*/}
                                    {/*            </Row>*/}
                                    {/*            <div style={{borderLeft: '3px solid #1A3452', maxWidth: '700px', paddingLeft: '10px'}}>*/}
                                    {/*                <Title level={3}>Эрхэм зорилго</Title>*/}
                                    {/*                <p style={{marginBottom: '0'}}>{company.mission ? company.mission : 'Эрхэм зорилго хоосон байна'}</p>*/}
                                    {/*            </div>*/}
                                    {/*            <div style={{borderRight: '3px solid #1A3452', float: 'right', maxWidth: '700px', paddingRight: '10px', textAlign: 'right', marginBottom: '24px'}}>*/}
                                    {/*                <Title level={3}>Алсын хараа</Title>*/}
                                    {/*                <p style={{marginBottom: '0'}}>{company.vision ? company.vision : 'Алсын хараа хоосон байна'}</p>*/}
                                    {/*            </div>*/}
                                    {/*            <div style={{clear: 'both'}} />*/}
                                    {/*            <Card title='Компаний тухай' style={{boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.2)', marginBottom: '24px'}} headStyle={{fontWeight: '600'}}>*/}
                                    {/*                <p style={{marginBottom: '0'}}>{company.description ? company.description : 'Компаний дэлгэрэнгүй мэдээлэл хоосон байна'}</p>*/}
                                    {/*            </Card>*/}
                                    {/*            <Card title='Компаний уриа' style={{boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.2)'}} headStyle={{fontWeight: '600'}}>*/}
                                    {/*                <p style={{marginBottom: '0'}}> {company.slogan ? company.slogan : 'Компаний уриа хоосон байна'}</p>*/}
                                    {/*            </Card>*/}
                                    {/*        </Card>*/}
                                    {/*}*/}
                                </div>
                            </Col>
                            <Col span={company.address || company.phone || company.website || company.isCons ? 6 : 0} style={{marginTop: '40px'}}>
                                {
                                    company.address ?
                                        <Card style={{marginBottom: '24px'}}>
                                            <Row>
                                                <Col span={4} style={{display: 'flex', justifyItems: 'center', alignItems: 'center'}}>
                                                    <EnvironmentOutlined />
                                                </Col>
                                                <Col span={20} style={{textAlign: 'justify'}}>
                                                    {company.address}
                                                </Col>
                                            </Row>
                                        </Card>
                                        : null
                                }
                                {
                                    company.phone ?
                                        <Card style={{marginBottom: '24px'}}>
                                            <Row>
                                                <Col span={4} style={{display: 'flex', justifyItems: 'center', alignItems: 'center'}}>
                                                    <PhoneOutlined />
                                                </Col>
                                                <Col span={20}>
                                                    +967{company.phone[0] === 3 ? "11"+company.phone : company.phone}
                                                </Col>
                                            </Row>
                                        </Card>
                                        : null
                                }
                                {
                                    company.domain ?
                                        <Card style={{marginBottom: '24px'}}>
                                            <Row>
                                                <Col span={4} style={{display: 'flex', justifyItems: 'center', alignItems: 'center'}}>
                                                    <GlobalOutlined />
                                                </Col>
                                                <Col span={20}>
                                                    {company.domain}.tatatunga.com
                                                </Col>
                                            </Row>
                                        </Card>
                                        : null
                                }
                                {
                                    company.isCons === true ?
                                        <Card style={{marginBottom: '24px'}}>
                                            <Row>
                                                <Col span={4} style={{display: 'flex', justifyItems: 'center', alignItems: 'center'}}>
                                                    <CarryOutOutlined />
                                                </Col>
                                                <Col span={20}>
                                                    {locale('common_company.consalting')}
                                                </Col>
                                            </Row>
                                        </Card>
                                        : null
                                }
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default  connect(reducer)(Company);