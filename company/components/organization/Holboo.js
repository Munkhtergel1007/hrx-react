import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config, {
    hasAction,
} from "../../config";
import {
    Layout,
    Menu,
    Button,
    InputNumber,
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
import {locale} from '../../lang'
import {SwatchesPicker} from 'react-color'
import MediaLib from "../media/MediaLib";
const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class Holboo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: ((props.main || {}).company || {}).email || '',
            website: ((props.main || {}).company || {}).website || '',
            phone: ((props.main || {}).company || {}).phone || '',
            address: ((props.main || {}).company || {}).address || '',
        };
        document.title = 'Settings | Contact  |  TAPSIR';
    }
    changeCompanyContact(vals){
        const { main: {company} } = this.props;
        if(vals.email === company.email){
            delete vals.email;
        } else if(vals.website === company.website){
            delete vals.website;
        } else if(vals.phone === company.phone){
            delete vals.phone;
        } else if(vals.address === company.address){
            delete vals.address;
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
                        onFinish={hasAction(['edit_company_informations'], employee) ? this.changeCompanyContact.bind(this) : null}
                    >
                        <Form.Item
                            label={locale ('common_organization.email')}
                            name="email"
                            initialValue={this.state.email}
                            rules={[{ type: 'email' }]}
                        >
                            <Input onChange={(e) => this.setState({email: e.target.value})} placeholder={locale ('common_organization.email')} />
                        </Form.Item>
                        <Form.Item
                            label={locale ('common_organization.website')}
                            name={"website"}
                            initialValue={this.state.website}
                        >
                            <Input onChange={(e) => this.setState({website: e.target.value})} placeholder={locale ('common_organization.website')} />
                        </Form.Item>
                        <Form.Item
                            label={locale ('common_organization.utas')}
                            name={"phone"}
                            initialValue={this.state.phone}
                        >
                            <InputNumber onChange={(e) => this.setState({phone: e})} placeholder={locale ('common_organization.utas')} />
                        </Form.Item>
                        <Form.Item
                            label={locale ('common_organization.hayg')}
                            name={"address"}
                            initialValue={this.state.address}
                        >
                            <Input.TextArea onChange={(e) => this.setState({address: e.target.value})} placeholder={locale ('common_organization.hayg')} />
                        </Form.Item>
                        {hasAction(['edit_company_informations'], employee) ?
                            <Button
                                style={{float: 'right'}}
                                htmlType="submit"
                                type={'primary'}
                                loading={updating}
                                disabled={
                                    (
                                        (company || {}).email === this.state.email &&
                                        (company || {}).website === this.state.website &&
                                        (company || {}).phone === this.state.phone &&
                                        (company || {}).address === this.state.address
                                    ) ||
                                    updating
                                }
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

export default connect(reducer)(Holboo);