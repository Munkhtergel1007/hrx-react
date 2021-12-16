import React from "react";
import {getAllRoles} from "../../actions/settings_actions";
import config, {formattedActionsArray, hasAction, uuidv4} from "../../config";
import {setEmpRole, setEmpStaticRole} from "../../actions/employee_actions";
import {Button, Col, Divider, Row, Select, Tag} from "antd";
import {connect} from 'react-redux'
const {Option} = Select;

const reducer = ({main, employee, settings}) => ({main, employee, settings});

class EmployeeRoleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: '',
            staticRole: ''
        };
    }
    componentDidMount() {
        const {main:{employee}} = this.props;
        if(hasAction(['edit_roles', 'read_roles'], employee)){
            this.props.dispatch(getAllRoles());
        }
    }
    onRoleChange(role) {
        const {
            dispatch,
            employee: {
                empSingle
            }
        } = this.props;
        if(!role || role.role === ''){
            config.get('emitter').emit('error', 'Албан тушаал сонгоно уу.');
        }else {
            dispatch(setEmpRole({role: role, emp: (empSingle || {})._id}));
        }
    }
    onStaticRoleChange(staticRole){
        const {
            dispatch,
            employee: {
                empSingle
            }
        } = this.props;
        if(!staticRole || staticRole.staticRole === ''){
            config.get('emitter').emit('error', 'Албан тушаал сонгоно уу.');
        }else {
            dispatch(setEmpStaticRole({staticRole: staticRole.staticRole, emp: (empSingle || {})._id}));
        }
    }
    render() {
        let hadAction = hasAction(['read_roles', 'edit_roles'], this.props.main.employee);
        const {
            main: {
                employee
            },
            settings: {
                roles
            },
            employee: {
                empSingle,
                settingEmpRole,
                settingEmpStaticRole
            }
        } = this.props;
        function getSelected(str){
            if(str === ''){
                return empSingle.role ? {name: empSingle.role.name, desc: empSingle.role.desc, actions: empSingle.role.actions} : {};
            } else if(str === 'norole') {
                return {}
            } else {
                for(let i = 0; i<roles.length; i++){
                    if(roles[i]._id === str){
                        return {name: roles[i].name, desc: roles[i].desc, actions: roles[i].actions};
                    }
                }
            }
        }
        let key = Math.random();
        let actions = Object.keys(getSelected(this.state.role)).length !== 0 ? getSelected(this.state.role).actions : [];
        function getElements(role, acts){
            key = Math.random();
            let here = role.actions.some(rol => {
                if(acts.includes(rol.key)){
                    return rol;
                }
            });
            if(here){
                return role;
            }else{
                return false;
            }
        }
        return (
            <Row justify="center" align="center" style={{width: '100%'}} className={'emp-anket'}>
                <Col span={20}>
                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}>Албан тушаал</b>
                        </Divider>
                    </div>
                    {hasAction(['edit_roles', 'read_roles'], employee)?
                        <React.Fragment>
                            <Select onSelect={e => this.setState({...this.state, role: e})} loading={settingEmpRole} disabled={settingEmpRole || !hadAction} defaultValue={(empSingle.role || {}).name || 'norole'} placeholder="Албан тушаал" style={{ width: '50%' }}>
                                {
                                    <Option value='norole'>Албан тушаал тохируулаагүй</Option>
                                }
                                {
                                    roles.map((r) => <Option value={r._id} key={r._id}>{r.name}</Option>)
                                }
                            </Select>
                            <Button onClick={() => this.onRoleChange({role: this.state.role})} style={{marginLeft: '15px'}} type='primary'>Хадгалах</Button>
                        </React.Fragment>
                        :
                        null
                    }
                    <React.Fragment>
                        <br/>
                        <b key="name" style={{fontSize: '15px', display: 'block', marginTop: '30px'}}>{getSelected(this.state.role).name}</b>
                        <p key="description">{getSelected(this.state.role).desc}</p>
                        {
                            formattedActionsArray().map((c, i) =>(
                                getElements(c, actions) ? (
                                    <div key={uuidv4()}>
                                        <Divider />
                                        <label style={{ color: "#808080", fontSize: '15px' }}>
                                            {c.value}
                                        </label>
                                        <br/>
                                        {c.actions.map((act, i) => (
                                            actions.map(action => (
                                                act.key === action ?
                                                    <Tag style={{marginBottom: '5px'}}>{act.value}</Tag>
                                                    :
                                                    null
                                            ))
                                        ))}
                                    </div>
                                ) : null
                            ))
                        }
                    </React.Fragment>
                    {/*<div style={{margin: '50px auto 30px'}}>*/}
                    {/*    <Divider orientation="left" plain>*/}
                    {/*        <b style={{fontSize: 16}}>Албан тушаал</b>*/}
                    {/*    </Divider>*/}
                    {/*</div>*/}

                    {/*{hasAction(['edit_roles', 'read_roles'], employee)?*/}
                    {/*    <React.Fragment>*/}
                    {/*        <Select onSelect={e => this.setState({...this.state, staticRole: e})} loading={settingEmpStaticRole} disabled={settingEmpRole || !hadAction} defaultValue={empSingle.staticRole} placeholder="Албан тушаал" style={{ width: '50%' }}>*/}
                    {/*            <Option value='employee'>Ажилтан</Option>*/}
                    {/*            <Option value='attendanceCollector'>Цахим ирц бүртгэл</Option>*/}
                    {/*            <Option value='hrManager'>Хүний нөөц</Option>*/}
                    {/*            <Option value='chairman'>Удирдлага</Option>*/}
                    {/*            <Option value='lord'>Эзэмшигч</Option>*/}
                    {/*        </Select>*/}
                    {/*        <Button onClick={() => this.onStaticRoleChange({staticRole: this.state.staticRole})} style={this.state.staticRole !== '' && this.state.staticRole !== empSingle.staticRole ? {marginLeft: '15px'} : {display: 'none'}} type='primary'>Хадгалах</Button>*/}
                    {/*    </React.Fragment>*/}
                    {/*    :*/}
                    {/*    null*/}
                    {/*}*/}
                    </Col>
            </Row>
        )
    }
}

export default connect(reducer)(EmployeeRoleComponent)