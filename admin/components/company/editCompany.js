import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {
    Card,
    Button,
    Form,
    Switch,
    Input,
    Row,
    Col,
    Tabs,
    Select,
    List,
    Avatar,
    Popconfirm,
    InputNumber,
    Radio,
    Spin
} from 'antd';

import {
    editCompany,
    saveCompanyForm,
    getLord,
    removeLord,
    createLord,
    findUser
} from '../../actions/company_actions';
import {
    isPhoneNum,
    uuidv4
} from '../../config'

const reducer = ({company, main, employee}) => ({company, main, employee});

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;


class EditCompany extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            username: {
                text: '',
                error: false
            },
            popVisible: false,
            first_name: {
                text: '',
                error: false
            },
            last_name: {
                text: '',
                error: false
            },
            register_id: {
                text: '',
                error: false
            },
            email: {
                text: '',
                error: false
            },
            password: {
                text: '',
                error: false
            },
            gender: {
                text: '',
                error: false
            },
            phone: {
                text: '',
                error: false
            },
            userEmail: '',
            userPhone: ''
        }
    }

    componentDidMount() {
        const {dispatch} = this.props;
        let {id} = this.props.match.params;
        dispatch(editCompany(id))
        dispatch(getLord(id))
    }


    saveCompanyForm(vals) {
        let compid = {
            ...vals,
            id: this.props.company.editCompany._id,
        }
        this.props.dispatch(saveCompanyForm(compid))
    }
    createLord(vals) {
        if(vals.existing){
            this.props.dispatch(createLord({user: {...vals}, company: this.props.company.editCompany._id})).then((data) => {
                if (data.json.success) {
                    this.setState({createLord: false});
                }
            });
        } else {
            this.props.dispatch(createLord({...vals, company: this.props.company.editCompany._id})).then((data) => {
                if (data.json.success) {
                    this.setState({createLord: false});
                }
            });
        }
    }
    searchUser(){

        if(isPhoneNum(this.state.userPhone)){
            this.props.dispatch(findUser({email: this.state.userEmail, phone: this.state.userPhone}))
        } else {
            //config.get('emitter').emit('error', '???????????? ???????????? ?????????????? ????.');

        }
    }

    removeLord() {
        const {
            company: {
                lord
            }
        } = this.props
        if(this.state.username !== (lord.user || {}).username) {
            this.setState({username: {error: true}})
        } else {
            this.props.dispatch(removeLord({
                company: this.props.match.params.id,
                employee: this.props.company.lord._id
            })).then(c => {
                if(c.json.success){
                    this.setState({
                        popVisible: false,
                        username: {
                            text: '',
                            error: false
                        }
                    })
                }
            })
        }
    }
    render() {
        const {
            
            company: {
                editCompany,
                editCompanyLoading,
                lord,
                foundedUsers,
                findingUser
            }
        } = this.props
        console.log(lord)
        let fields = [
            {
                name: 'name',
                value: editCompany.name
            }, {
                name: 'email',
                value: editCompany.email
            }, {
                name: 'phone',
                value: editCompany.phone
            }, {
                name: 'website',
                value: editCompany.website
            }, {
                name: 'domain',
                value: editCompany.domain
            }, {
                name: 'isCons',
                value: editCompany.isCons
            }, {
                name: 'address',
                value: editCompany.address
            }]
        if (this.props.match.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return (
                <Tabs defaultActiveKey="1" centered>
                    <TabPane
                    tab={
                        <span className="tabsHeader">
                        ?????????????? ??????????
                        </span>
                    }
                    key="1"
                    >
                        <Card loading={editCompanyLoading} style={{width: '50%', margin: 'auto'}}>
                            <br/>
                            <Form
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                size={'small'}
                                layout="horizontal"
                                fields={fields}
                                onFinish={this.saveCompanyForm.bind(this)}
                                style={{width: '70%', margin: 'auto'}}
                            >
                                <Form.Item
                                    label="??????"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: '?????? ?????????????? ????!',
                                            transform: (value) => value.trim()
                                        },
                                    ]}
                                >
                                    <Input placeholder="?????????????? ??????"/>
                                </Form.Item>
                                <Form.Item
                                    label="Email / ?????????????? /"
                                    name="email"
                                    rules={[
                                        {   
                                            required: false,
                                            message: 'Email / ?????????????? / ?????????????? ????!',
                                            pattern: new RegExp(/^\S+@\S+\.\S+$/)
                                        },
                                    ]}
                                >
                                    <Input placeholder="Email"/>
                                </Form.Item>
                                <Form.Item
                                    label="???????? / ?????????????? /"
                                    name="phone"
                                    rules={[
                                        {
                                            required: false,
                                            message: '???????? / ?????????????? / ?????????????? ????!',
                                            pattern: new RegExp(/^[0-9]{8}$/)
                                        },
                                    ]}
                                >
                                    <Input placeholder="????????"/>
                                </Form.Item>
                                <Form.Item label="Website" name="website">
                                    <Input placeholder="Website"/>
                                </Form.Item>
                                <Form.Item
                                    label="Domain"
                                    name="domain"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Domain ?????????????? ????!',
                                            transform: (value) => value.toLowerCase().trim()
                                        },
                                    ]}
                                >
                                    <Input addonBefore={<span style={{color: 'white'}}>https://</span>} suffix={".tatatunga.mn"}
                                        placeholder="Domain ??????"/>
                                </Form.Item>
                                <Form.Item label="Consulting" name="isCons">
                                    <Switch defaultChecked={editCompany.isCons}/>
                                </Form.Item>
                                <Form.Item
                                    label="????????"
                                    name="address"
                                    rules={[
                                        {
                                            required: false,
                                            message: '???????? ?????????????? ????!',
                                            transform: (value) => value.trim()
                                        },
                                    ]}
                                >
                                    <Input placeholder="????????"/>
                                </Form.Item>
                                <Row>
                                    <Col span={24} style={{textAlign: 'right'}}>
                                        <Link to="/admin/companies" style={{marginRight: 10}}>
                                            <Button>
                                                ??????????
                                            </Button>
                                        </Link>
                                        <Button type="primary" htmlType="submit">????????????????</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </TabPane>
                    <TabPane
                    tab={
                        <span>
                        ?????????????????? ??????????
                        </span>
                    }
                    key="2"
                    >
                        <Card style={{width: '50%', margin: 'auto'}}>
                        <Form
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                size={'small'}
                                layout="horizontal"
                                style={{width: '70%', margin: 'auto'}}
                            >
                        
                                <h3> ?????????????????? </h3>   
                                {
                                    lord ? 
                                   <div>
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={`/images/default-avatar.png`}/>}
                                            title={<span> {`${(lord.user || {}).first_name} ${(lord.user || {}).last_name}`} </span>}
                                            description={editCompany.name}
                                            style={{margin: '10px 40px'}}
                                        />
                                    </List.Item>
                                    
                                    <div style={{margin: '15px 80px'}}>
                                        <Link to="/admin/companies" style={{marginRight: 10}}>
                                            <Button>
                                                ??????????
                                            </Button>
                                        </Link>
                                        <Popconfirm
                                            title={<div>
                                                <h4>???????????????????? ???????????????? ???????? ?????????????? ???????????? ???????????????????????????? ????.</h4>
                                                <span style={{margin: '0px 90px'}}>?????????????? ??????: {(lord.user || {}).username}</span>
                                                <Form.Item name="username">
                                                    <Input placeholder="?????????????? ??????" value={this.state.username} onChange={(e)=> this.setState({username: e.target.value })} />
                                                </Form.Item>
                                                {
                                                    this.state.username.error ? 
                                                        <div> ?????????????? ?????? ???????? ?????????? ??????????.</div>
                                                    :
                                                    null
                                                }
                                                
                                            </div>}
                                            onConfirm={(e) => this.removeLord(e)}
                                            okText="????????"
                                            cancelText="????????"
                                            visible={this.state.popVisible}
                                            onCancel={()=> this.setState({popVisible: false})}
                                        >
                                            <Button type="primary" onClick={() => this.setState({popVisible: true})}>??????????</Button>
                                        </Popconfirm>
                                    </div>
                                    </div>
                                   
                                    
                                    :
                                    <div>
                                        <h4>???????? ???????????????? ????????????</h4>
                                        <Form.Item
                                            label="??-????????"
                                            name="user-email"
                                            rules={[
                                                {
                                                    required: this.state.userEmail === '',
                                                    message: '??-???????? ?????????????? ????!',
                                                },
                                            ]}
                                            initialValue={this.state.userEmail}
                                        >
                                            <Input onChange={(e) => this.setState({userEmail: e.target.value})} placeholder="??-????????" />
                                        </Form.Item>
                                        <Form.Item
                                            label="????????"
                                            name="user-phone"
                                            rules={[
                                                {
                                                    required: !isPhoneNum(this.state.userPhone),
                                                    message: '???????? ?????????????? ????!',
                                                },
                                            ]}
                                            initialValue={this.state.userPhone}
                                        >
                                            <Input onChange={(e) => this.setState({userPhone: e.target.value})} placeholder="????????" />
                                        </Form.Item>
                                        <Button
                                            type={'primary'}
                                            loading={findingUser}
                                            onClick={(e) => this.searchUser(e)}
                                            disabled={ findingUser || this.state.userPhone === '' || this.state.userEmail === ''}
                                            >
                                                ????????
                                        </Button>
                                        {
                                            findingUser ?
                                            <div style={{textAlign: 'center'}}>
                                                <Spin />
                                            </div>
                                            :  foundedUsers.length > 0 ?
                                            <Card style={{marginTop: 30}} size={'small'}>
                                                <List size={'small'}>
                                                    {
                                                        foundedUsers.map((c) =>
                                                            <List.Item key={uuidv4()}>
                                                                <List.Item.Meta
                                                                    avatar={<Avatar src={c.path ? c.url + c.path : '/images/default-avatar.png'} />}
                                                                    description={c.employee ? `@${c.employee.company.domain} - ?? ??????????????` : `@${c.username}`}
                                                                    title={<span>{c.first_name} {c.last_name}</span>}
                                                                />
                                                                <Button loading={c.loading} onClick={()=> this.createLord({...c, existing: true})} danger ghost >{c.employee ? `?????????????????? ????????????` : '?????????????? ????????????'}</Button>
                                                            </List.Item>
                                                        )
                                                    }
                                                </List>
                                            </Card>
                                            : null

                                        }

                                        <hr/>
                                        <Row type="flex" justify="center" align="middle">
                                        <div style={{marginTop: 30}}>
                                            <Form
                                                labelCol={{span: 10}}
                                                wrapperCol={{span: 14}}
                                                size={'small'}
                                                layout="horizontal"
                                                onFinish={this.createLord.bind(this)}
                                            >
                                                <Form.Item
                                                    label="????????"
                                                    name="last_name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '???????? ?????????????? ????!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="????????"/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="??????"
                                                    name="first_name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '?????? ?????????????? ????!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="??????"/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="???????????????????? ????????????"
                                                    name="register_id"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '???????????????????? ???????????? ?????????????? ????!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="???????????????????? ????????????"/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="??-????????"
                                                    name="email"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '??-???????? ?????????????? ????!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="??-????????"/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="?????????????? ??????"
                                                    name="username"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '?????????????? ?????? ?????????????? ????!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="?????????????? ??????"/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="???????????? ????????????"
                                                    name="phone"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '???????????? ???????????? ?????????????? ????!',
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber placeholder="???????????? ????????????" style={{width: 200}}/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="???????? ????"
                                                    name="password"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '???????? ???? ?????????????? ????!',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="???????? ????" style={{width: 200}}/>
                                                </Form.Item>
                                                <Form.Item
                                                    label="????????"
                                                    name="gender"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '???????? ?????????????? ????!',
                                                        },
                                                    ]}
                                                >
                                                    <Radio.Group>
                                                        <Radio value="male">????</Radio>
                                                        <Radio value="female">????</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Row>
                                                    <Col span={24} style={{textAlign: 'right'}}>
                                                        <React.Fragment>
                                                            <Button onClick={() => this.setState({createUser: false})}
                                                                    style={{marginRight: 10}}>
                                                                ??????????
                                                            </Button>
                                                            <Button type="primary" htmlType="submit"
                                                            >????????????</Button>
                                                        </React.Fragment>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </div>
                                    </Row>
                                    </div>
                                }
                            </Form>
                        </Card>
                    </TabPane>
                </Tabs>
                
            )
        } else {
            window.location.href = '/admin/companies'
        }

    }
}

export default connect(reducer)(EditCompany)
