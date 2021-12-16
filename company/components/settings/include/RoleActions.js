import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config, {formattedActionsArray, uuidv4} from "../../../config";
import moment from 'moment';
import {
    DeleteOutlined
} from "@ant-design/icons";
import {
    UserOutlined,
    TeamOutlined,
    CloseOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Button,
    Spin,
    Form,
    Row,
    Col,
    Input,
    Drawer,
    Typography,
    Popover,
    Space,
    Table, Image, Tag,
    DatePicker, List, Avatar, Empty, Popconfirm, Divider, Checkbox
} from 'antd';
import {changeActions} from "../../../actions/settings_actions";

const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class RoleActions extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }
    checkAction(e){
        this.props.dispatch(changeActions(e));
    }
    render() {
        const { main: {company}, settings: { actions } } = this.props;
        return (
            formattedActionsArray().map((c, i) =>
                c.actions.some((ca) => company.actions.indexOf(ca.key) > -1) ?
                    <div key={uuidv4()}>
                        <Divider />
                        <label style={{ color: "#808080" }}>
                            {c.value}
                        </label>
                        <br/>
                        <br/>
                        <Checkbox.Group options={c.actions.map(cc => {
                            if(company.actions.indexOf(cc.key) > -1){
                                return {
                                    label: cc.value,
                                    value: cc.key,
                                    onChange: (e) => this.checkAction(e),
                                    disabled: (((company || {}).actions || []).indexOf(cc.key) === -1)
                                }
                            } else {
                                return null;
                            }
                        }).filter(cc => cc)} value={actions}/>
                        {(i + 1) === formattedActionsArray().length && <Divider />}
                    </div>
                    : null
            )
        );
    }
}

export default connect(reducer)(RoleActions);