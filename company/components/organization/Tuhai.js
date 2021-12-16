import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config, {
    hasAction,
} from "../../config";
import {
    Layout,
    Menu,
    Button,
    Form,
    Row,
    Col,
    Input,
    Typography,
    DatePicker
} from 'antd';
import {
    changeCompanyMain,
} from '../../actions/settings_actions';
import {locale} from '../../lang';

const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class Tuhai extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            slogan: ((props.main || {}).company || {}).slogan || '',
            vision: ((props.main || {}).company || {}).vision || '',
            mission: ((props.main || {}).company || {}).mission || '',
            description: ((props.main || {}).company || {}).description || '',
        };
        document.title = 'Тохиргоо | Тухай  |  TATATUNGA';
    }
    changeCompanyAbout(vals){
        const { main: {company} } = this.props;
        if(vals.slogan === company.slogan){
            delete vals.slogan;
        } else if(vals.vision === company.vision){
            delete vals.vision;
        } else if(vals.mission === company.mission){
            delete vals.mission;
        } else if(vals.description === company.description){
            delete vals.description;
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
                        layout="vertical"
                        onFinish={hasAction(['edit_company_informations'], employee) ? this.changeCompanyAbout.bind(this) : null}
                    >
                        <Form.Item
                            label="Эрхэм зорилго"
                            name="mission"
                            initialValue={this.state.mission}
                        >
                            <Input onChange={(e) => this.setState({mission: e.target.value})} placeholder={locale ('common_organization.kompani_ner')} />
                        </Form.Item>
                        <Form.Item
                            label="Алсын хараа"
                            name={"vision"}
                            initialValue={this.state.vision}
                        >
                            <Input onChange={(e) => this.setState({vision: e.target.value})} placeholder={locale ('common_organization.alsiin_haraa')} />
                        </Form.Item>
                        <Form.Item
                            label="Уриа үг"
                            name={"slogan"}
                            initialValue={this.state.slogan}
                        >
                            <Input onChange={(e) => this.setState({slogan: e.target.value})} placeholder={locale ('common_organization.uria_ug')} />
                        </Form.Item>
                        <Form.Item
                            label="Компанийн тухай"
                            name={"description"}
                            initialValue={this.state.description}
                        >
                            <Input.TextArea onChange={(e) => this.setState({description: e.target.value})} placeholder="Компанийн тухай" />
                        </Form.Item>
                        {hasAction(['edit_company_informations'], employee) ?
                            <Button
                                style={{float: 'right'}}
                                htmlType="submit"
                                type={'primary'}
                                loading={updating}
                                disabled={
                                    (
                                        (company || {}).mission === this.state.mission &&
                                        (company || {}).vision === this.state.vision &&
                                        (company || {}).description === this.state.description &&
                                        (company || {}).slogan === this.state.slogan
                                    ) ||
                                    updating
                                }
                            >
                                Шинэчлэх
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

export default connect(reducer)(Tuhai);