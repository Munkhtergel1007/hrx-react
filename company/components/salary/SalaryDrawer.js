import React, {Component} from "react";
import { connect } from 'react-redux';
import config, {hasAction} from "../../config";
import moment from "moment";
import {
    changeSalaryInfo,
    getSalaries,
    submitAndCancelSalary,
    approveAndDeclineSalary,
    deleteSalary
} from "../../actions/salary_actions";
import {getEmployeeStandard, getSubsidiaryCompanies} from "../../actions/employee_actions";
import { Link } from 'react-router-dom';

import {DashOutlined, ExportOutlined, SelectOutlined, CheckCircleOutlined, CloseCircleOutlined, FormOutlined, DeleteOutlined, SearchOutlined} from '@ant-design/icons'
import {
    Button, Popover,
    Table, Tooltip,
    Tag, Input, Row,
    Col, Typography,
    Modal, InputNumber,
    Drawer, Form, Dropdown,
    Menu, Empty, Select,
    DatePicker, Divider, Popconfirm,
    Alert
} from 'antd';
import ExportExcel from "../utils/modalExportEx";
// import {exportEx} from "../utils/exportExel";
const {Title} = Typography;
const xls = require('xlsx');
const utils = xls.utils;

export default class SalaryDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount(){

    }
    render() {
        return (
            <>asd</>
        )
    }
}