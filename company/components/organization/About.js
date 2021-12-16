import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config, {
    uuidv4,
    formattedActionsArray,
    hasAction,
} from "../../config";
import {
    Layout,
    Menu,
    Checkbox,
    Button,
    Form,
    Row,
    Col,
    Input,
    Switch,
    Typography,
    Divider,
    DatePicker
} from 'antd';
import {
    changeCompanyMain,
} from '../../actions/settings_actions';
import {locale} from '../../lang'

const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class About extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: ((props.main || {}).company || {}).name || '',
            // domain: ((props.main || {}).company || {}).domain || '',
            slogan: ((props.main || {}).company || {}).slogan || '',
            vision: ((props.main || {}).company || {}).vision || '',
            mission: ((props.main || {}).company || {}).mission || '',
            value: ((props.main || {}).company || {}).value || '',
            description: ((props.main || {}).company || {}).description || '',
        };
        document.title = 'Organization | About | TAPSIR';
    }
    changeCompanyMain(vals){
        const { main: {company} } = this.props;
        const domainRegex = /^[a-zA-Z]*$/;
        if(vals.name === company.name) {
            delete vals.name;
            // } else if(vals.domain === company.domain){
            //     delete vals.domain;
            // }
        // if(!domainRegex.test((vals.domain || '').trim())){
        //     return config.get('emitter').emit('warning', ("Домайн нь латин үсэг /a-z/ байх ёстой!"));
        } else if(vals.slogan === company.slogan){
            delete vals.slogan;
        } else if(vals.vision === company.vision){
            delete vals.vision;
        } else if(vals.mission === company.mission){
            delete vals.mission;
        } else if(vals.description === company.description){
            delete vals.description;
        } else if(vals.value === company.value){
            delete vals.value;
        }
        this.props.dispatch(changeCompanyMain(vals));
    }
    render(){
        const { main: {company, employee}, settings: {updating} } = this.props;
        return (
            <Row justify="center" align="center" style={{width: '100%'}}>
                <Col span={18}>
                    <Form
                        size={'small'}
                        style={{width: 500}}
                        layout="vertical"
                        onFinish={hasAction(['edit_company_informations'], employee) ? this.changeCompanyMain.bind(this) : null}
                    >
                        <Form.Item
                            label={locale ('common_organization.ner')}
                            name="name"
                            rules={[
                                {
                                    required: this.state.name === '',
                                    message: locale ('common_organization.ner_oruulna_uu'),
                                },
                            ]}
                            initialValue={this.state.name}
                        >
                            <Input onChange={(e) => this.setState({name: e.target.value})} placeholder="Компани нэр" />
                        </Form.Item>
                        {/*<Form.Item*/}
                        {/*    label="Домэйн"*/}
                        {/*    name={"domain"}*/}
                        {/*    rules={[*/}
                        {/*        {*/}
                        {/*            required: this.state.domain === '',*/}
                        {/*            message: 'Домэйн оруулна уу!',*/}
                        {/*        },*/}
                        {/*    ]}*/}
                        {/*    initialValue={this.state.domain}*/}
                        {/*>*/}
                        {/*    <Input onChange={(e) => this.setState({domain: e.target.value})} addonBefore={<span style={{color: 'white'}}>https://</span>} suffix={".tatatunga.mn"} placeholder="Домэйн нэр" />*/}
                        {/*</Form.Item>*/}
                        {/*<Form.Item label="Консалтинг">*/}
                        {/*    /!*<Switch checked={(company || {}).isCons} disabled={(company || {}).isCons} onChange={() => alert('')}/>*!/*/}
                        {/*    <Switch checked={(company || {}).isCons} disabled={true}/>*/}
                        {/*</Form.Item>*/}
                        {/*<Form.Item label="Үйлдлүүд">*/}
                        {/*    <div className={'actions'}>*/}
                        {/*        {*/}
                        {/*            formattedActionsArray().map((c, i) =>*/}
                        {/*                <div key={uuidv4()}>*/}
                        {/*                    <Divider />*/}
                        {/*                    <label style={{ color: "#808080" }}>*/}
                        {/*                        {c.value}*/}
                        {/*                    </label>*/}
                        {/*                    <br/>*/}
                        {/*                    <br/>*/}
                        {/*                    <Checkbox.Group options={c.actions.map(cc => {*/}
                        {/*                        return {*/}
                        {/*                            label: cc.value,*/}
                        {/*                            value: cc.key,*/}
                        {/*                            // onChange: () => alert('Vildel zarah ch ym blvv'),*/}
                        {/*                            // disabled: (((company || {}).actions || []).indexOf(cc.key) > -1),*/}
                        {/*                            disabled: true,*/}
                        {/*                            checked: (((company || {}).actions || []).indexOf(cc.key) > -1),*/}
                        {/*                        }*/}
                        {/*                    })} value={((company || {}).actions || [])}  />*/}
                        {/*                    {(i + 1) === formattedActionsArray().length && <Divider />}*/}
                        {/*                </div>*/}
                        {/*            )*/}
                        {/*        }*/}
                        {/*    </div>*/}
                        {/*</Form.Item>*/}
                        <Form.Item
                            label={locale ('common_organization.erhem_zorilgo')}
                            name="mission"
                            initialValue={this.state.mission}
                        >
                            <Input onChange={(e) => this.setState({mission: e.target.value})} placeholder="Эрхэм зорилго" />
                        </Form.Item>
                        <Form.Item
                            label={locale ('common_organization.alsiin_haraa')}
                            name={"vision"}
                            initialValue={this.state.vision}
                        >
                            <Input onChange={(e) => this.setState({vision: e.target.value})} placeholder="Алсын хараа" />
                        </Form.Item>
                        <Form.Item
                            label={locale ('common_organization.uria_ug')}
                            name={"slogan"}
                            initialValue={this.state.slogan}
                        >
                            <Input onChange={(e) => this.setState({slogan: e.target.value})} placeholder="Уриа үг" />
                        </Form.Item>
                        <Form.Item
                            label={locale ('common_organization.unet_zuil')}
                            name={"value"}
                            initialValue={this.state.value}
                        >
                            <Input onChange={(e) => this.setState({value: e.target.value})} placeholder="Үнэт зүйл" />
                        </Form.Item>
                        <Form.Item
                            label={locale ('common_organization.kompaniin_tuhai')}
                            name={"description"}
                            initialValue={this.state.description}
                        >
                            <Input.TextArea onChange={(e) => this.setState({description: e.target.value})} placeholder={locale ('common_organization.kompaniin_tuhai')} />
                        </Form.Item>
                        {hasAction(['edit_company_informations'], employee) ?
                            <Button
                                style={{float: 'right'}}
                                htmlType="submit"
                                type={'primary'}
                                loading={updating}
                                disabled={
                                    (
                                        (company || {}).name === this.state.name &&
                                        // (company || {}).domain === this.state.domain) ||
                                        (company || {}).mission === this.state.mission &&
                                        (company || {}).vision === this.state.vision &&
                                        (company || {}).description === this.state.description &&
                                        (company || {}).slogan === this.state.slogan &&
                                        (company || {}).value === this.state.value
                                    ) ||
                                    updating
                                }
                                // disabled={true}
                            >
                                {locale ('common_organization.shinechleh')}
                            </Button>
                            :
                            null
                        }
                    </Form>
                </Col>
            </Row>
        )
    }
}

export default connect(reducer)(About);