import React from "react";
import config, {isPhoneNum, uuidv4} from "../../config";
import {createEmpByUser, createUser, findUser, handleCreateUser} from "../../actions/employee_actions";
import {Alert, Avatar, Button, Card, Col, Divider, Form, Input, List, Row, Spin} from "antd";
import {connect} from 'react-redux'
const reducer = ({employee}) => ({employee});

class CreateEmployee extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            phone: '',
        }
    }
    submitUser(vals){
        if(isPhoneNum(vals.phone)){
            this.props.dispatch(createUser({...vals, phone: isPhoneNum(vals.phone)})).then((c) => {
                if(c.json.success && c.json.newEmployee){
                    window.location.assign('/worker/' + c.json.newEmployee._id + '/anket');
                }
            })
        } else {
            config.get('emitter').emit('error', 'Утасны дугаар шалгана уу.');
        }
    }
    searchUser(vals){
        if(isPhoneNum(vals["user-phone"])){
            this.props.dispatch(findUser({email: vals["user-email"], phone: isPhoneNum(vals["user-phone"])}))
        } else {
            config.get('emitter').emit('error', 'Утасны дугаар шалгана уу.');
        }
    }
    createEmployee(user){
        this.props.dispatch(createEmpByUser({user: user})).then((c) => {
            if(c.json.success && c.json.newEmployee){
                window.location.assign('/worker/' + c.json.newEmployee._id + '/anket');
            }
        });
    }
    render() {
        const {
            dispatch,
            employee: {
                creatingUser,
                createdUser,
                foundedUsers,
                creatingEmp,
                findingUser
            }
        } = this.props;
        return (
            <Row justify="center" align="center" style={{width: '100%'}}>
                <Col span={18}>
                    <Divider orientation="left" plain>
                        Хэрэглэгч хайх
                    </Divider>
                    <Form
                        size={'small'}
                        layout="vertical"
                        onFinish={(e) => this.searchUser(e)}
                    >
                        <Form.Item
                            label="И-мэйл"
                            name="user-email"
                            rules={[
                                {
                                    required: this.state.email === '',
                                    message: 'И-мэйл оруулна уу!',
                                },
                            ]}
                            initialValue={this.state.email}
                        >
                            <Input onChange={(e) => this.setState({email: e.target.value})} placeholder="И-мэйл" />
                        </Form.Item>
                        <Form.Item
                            label="Утас"
                            name="user-phone"
                            rules={[
                                {
                                    required: !isPhoneNum(this.state.phone),
                                    message: 'Утас оруулна уу!',
                                },
                            ]}
                            initialValue={this.state.phone}
                        >
                            <Input onChange={(e) => this.setState({phone: e.target.value})} placeholder="Утас" />
                        </Form.Item>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button
                                htmlType="submit"
                                type={'primary'}
                                loading={findingUser}
                                disabled={creatingEmp || findingUser || this.state.phone === '' || this.state.email === ''}
                            >
                                Хайх
                            </Button>
                        </Col>
                    </Form>
                    {
                        findingUser ?
                            <div style={{textAlign: 'center'}}>
                                <Spin />
                            </div>
                            : foundedUsers.length > 0 ?
                            <Card style={{marginTop: 30}} size={'small'}>
                                <List size={'small'}>
                                    {
                                        foundedUsers.map((c) =>
                                            <List.Item key={uuidv4()}>
                                                <List.Item.Meta
                                                    avatar={<Avatar src={c.path ? c.url + c.path : '/images/default-avatar.png'} />}
                                                    description={c.employee ? `@${c.employee.company.domain} - д ажилдаг` : `@${c.username}`}
                                                    title={<span>{c.first_name} {c.last_name}</span>}
                                                />
                                                <Button loading={c.loading} onClick={this.createEmployee.bind(this, c._id)} danger ghost disabled={creatingEmp || c.employee}>{c.employee ? `@${c.username}` : 'Ажилтан болгох'}</Button>
                                            </List.Item>
                                        )
                                    }
                                </List>
                            </Card>
                            :  null
                    }
                    <div style={{marginTop: 60}}>
                        <Divider orientation="left" plain id={'createUser'}>
                            Хэрэглэгч үүсгэх
                        </Divider>
                        {
                            createdUser.exists ?
                                createdUser.email.toLowerCase() === (createdUser.user || {}).email.toLowerCase() ?
                                    <React.Fragment>
                                        <Alert
                                            style={{marginBottom: 10}}
                                            showIcon
                                            message={
                                                <b>
                                                    Хэрэглэгчийн <b>"И-мэйл"</b> давхцаж байна
                                                </b>
                                            }
                                            description={
                                                <span>
                                                    Хэрэглэгчийн бүртгэл давхцлын улмаас буруу үүсэхээс сэргийлж <b style={{textDecoration: 'underline'}} onClick={() => window.scroll({top: 0, behavior: 'smooth'})}>"Хэрэглэгч хайх" - ыг</b> санал болгож байна.
                                                </span>
                                            }
                                            type="warning"
                                        />
                                    </React.Fragment>
                                    : createdUser.phone === (createdUser.user || {}).phone ?
                                    <React.Fragment>
                                        <Alert
                                            style={{marginBottom: 10}}
                                            showIcon
                                            message={
                                                <b>
                                                    Хэрэглэгчийн <b>"Утасны дугаар"</b> давхцаж байна
                                                </b>
                                            }
                                            description={
                                                <span>
                                                    Хэрэглэгчийн бүртгэл давхцлын улмаас буруу үүсэхээс сэргийлж <b style={{textDecoration: 'underline'}} onClick={() => window.scroll({top: 0, behavior: 'smooth'})}>"Хэрэглэгч хайх" - ыг</b> санал болгож байна.
                                                </span>
                                            }
                                            type="warning"
                                        />
                                    </React.Fragment>
                                    : createdUser.register_id.toLowerCase() === (createdUser.user || {}).register_id.toLowerCase() ?
                                    <React.Fragment>
                                        <Alert
                                            style={{marginBottom: 10}}
                                            showIcon
                                            message={
                                                <b>
                                                    Хэрэглэгчийн <b>"Регистрийн дугаар"</b> давхцаж байна
                                                </b>
                                            }
                                            // description={
                                            //     <span>
                                            //         Хэрэглэгчийн бүртгэл давхцлын улмаас буруу үүсэхээс сэргийлж <b style={{textDecoration: 'underline'}} onClick={() => window.scroll({top: 0, behavior: 'smooth'})}>"Хэрэглэгч хайх" - ыг</b> санал болгож байна.
                                            //     </span>
                                            // }
                                            type="warning"
                                        />
                                    </React.Fragment>
                                    : createdUser.username.toLowerCase() === (createdUser.user || {}).username.toLowerCase() ?
                                        <React.Fragment>
                                            <Alert
                                                style={{marginBottom: 10}}
                                                showIcon
                                                message={
                                                    <span>
                                                    Хэрэглэгчийн <b>"Нэвтрэх нэр"</b> давхцаж байна.
                                                </span>
                                                }
                                                type="warning"
                                            />
                                        </React.Fragment>
                                        : null
                                : null
                        }
                        <Form
                            size={'small'}
                            layout="vertical"
                            onFinish={this.submitUser.bind(this)}
                        >
                            <Form.Item
                                label="Овог"
                                name="last_name"
                                rules={[
                                    {
                                        required: createdUser.last_name === '',
                                        message: 'Овог оруулна уу!',
                                    },
                                ]}
                                initialValue={createdUser.last_name}
                            >
                                <Input onChange={(e) => dispatch(handleCreateUser({last_name: e.target.value}))} placeholder="Овог" />
                            </Form.Item>
                            <Form.Item
                                label="Нэр"
                                name="first_name"
                                rules={[
                                    {
                                        required: createdUser.first_name === '',
                                        message: 'Нэр оруулна уу!',
                                    },
                                ]}
                                initialValue={createdUser.first_name}
                            >
                                <Input onChange={(e) => dispatch(handleCreateUser({first_name: e.target.value}))} placeholder="Нэр" />
                            </Form.Item>
                            <Form.Item
                                label="Регистрийн дугаар"
                                name="register_id"
                                rules={[
                                    {
                                        required: createdUser.register_id === '',
                                        message: 'Регистрийн дугаар оруулна уу!',
                                    },
                                ]}
                                initialValue={createdUser.register_id}
                            >
                                <Input onChange={(e) => dispatch(handleCreateUser({register_id: e.target.value}))} placeholder="Регистрийн дугаар" />
                            </Form.Item>
                            <Form.Item
                                label="Нэвтрэх нэр"
                                name="username"
                                rules={[
                                    {
                                        required: createdUser.username === '',
                                        message: 'Хэрэглэгчийн нэвтрэх нэр оруулна уу!',
                                    },
                                    {
                                        pattern: new RegExp(/^[a-zA-Z0-9._]{4,12}/g),
                                        message: 'Зөвхөн латин үсэг болон тоо оруулна уу"'
                                    }
                                ]}
                                initialValue={createdUser.username}
                            >
                                <Input onChange={(e) => dispatch(handleCreateUser({username: e.target.value}))} placeholder="Хэрэглэгчийн нэвтрэх нэр" />
                            </Form.Item>
                            <Form.Item
                                label="Нууц үг"
                                name="password"
                                rules={[
                                    {
                                        required: createdUser.password === '',
                                        message: 'Нууц үг оруулна уу!',
                                    },
                                ]}
                                initialValue={createdUser.password}
                            >
                                <Input.Password onChange={(e) => dispatch(handleCreateUser({password: e.target.value}))} placeholder="Нууц үг" visibilityToggle={true}/>
                            </Form.Item>
                            <Form.Item
                                label="Утас"
                                name="phone"
                                rules={[
                                    {
                                        required: createdUser.phone === '' || !isPhoneNum(createdUser.phone),
                                        message: 'Утас оруулна уу!',
                                    },
                                ]}
                                initialValue={createdUser.phone}
                            >
                                <Input onChange={(e) => dispatch(handleCreateUser({phone: e.target.value}))} placeholder="Утас" visibilityToggle={true}/>
                            </Form.Item>
                            <Form.Item
                                label="И - мэйл"
                                name="email"
                                rules={[
                                    {
                                        required: createdUser.email === '',
                                        message: 'И - мэйл оруулна уу!',
                                    },
                                ]}
                                initialValue={createdUser.email}
                            >
                                <Input onChange={(e) => dispatch(handleCreateUser({email: e.target.value}))} placeholder="И - мэйл" visibilityToggle={true}/>
                            </Form.Item>
                            <Button
                                style={{float: 'right'}}
                                htmlType="submit"
                                type={'primary'}
                                loading={creatingUser}
                                disabled={
                                    (
                                        createdUser.first_name === '' ||
                                        createdUser.last_name === '' ||
                                        createdUser.register_id === '' ||
                                        createdUser.username === '' ||
                                        createdUser.password === '' ||
                                        createdUser.phone === ''
                                    ) ||
                                    creatingUser
                                }
                            >
                                Ажилтан үүсгэх
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default connect(reducer)(CreateEmployee)