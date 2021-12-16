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
import {locale} from '../../lang';

const reducer = ({ main, salary }) => ({ main, salary });
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
class Salary extends Component {
    constructor(props) {
        super(props);
        let today = new Date();
        if(today.getDate()<=14){
            today.setMonth(today.getMonth()-1);
        }
        this.state = {
            year_month: moment(today).format('YYYY-MM'),

            selected: '',
            user: '',
            first_name: '',
            last_name: '',

            register_id: '',
            visible: false,
            company: null,

            salary: 0,
            salary_id: '',

            sub: [
                {amount: 0, type: 'taslalt', description: ''},
                {amount: 0, type: 'hotsrolt', description: ''},
                {amount: 0, type: 'n_d_sh', description: ''},
                {amount: 0, type: 'h_h_o_a_t', description: ''},
                {amount: 0, type: 'busad', description: ''}
            ],
            add: [
                {amount: 0, type: 'nemegdel', description: ''},
                {amount: 0, type: 'uramshuulal', description: ''},
                {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
                {amount: 0, type: 'busad', description: ''}
            ],
            hungulult: 0,
            hool_unaanii_mungu: 0,


            exportChecked : {
                splitCompany: false, // company-aar salgah
                first_name: true,
                last_name: true,
                register: true, // Регистр
                company: false, // Компани
                salary: false, // Үндсэн цалин
                nemegdel: false, // Нэмэгдэл
                uramshuulal: false, // Урамшуулал
                iluu_tsagiin_huls: false, // Илүү цагийн хөлс
                bonus_busad: false, // Бусад
                n_d_sh: false, // НДШ
                h_h_o_a_t: false, // ХХОАТ
                hotsrolt: false, // Хоцролт
                taslalt: false, // Таслалт
                fine_busad: false, // Бусад
                hungulult: false, // ХХОАТ хөнгөлөлт
                hool_unaanii_mungu: false, // Хоол унааны мөнгө
                bank: true, // Данс
                total: true, // Нийт дүн
            },
            exportModal : false,
            exportType: '',

            searchUser: '',
            searchCompany: ''
        };
    }
    componentDidMount(){
        let {main: {employee}} = this.props;
        // if(!hasAction(['read_salary', 'edit_salary'], employee)){
        //     this.props.history.replace('/not-found');
        // }else{
            this.props.dispatch(getSalaries({year_month: this.state.year_month}));
            this.props.dispatch(getSubsidiaryCompanies());
        // }
    }
    clear(){
        this.setState({
            selected: '',
            user: '',
            first_name: '',
            last_name: '',

            register_id: '',
            visible: false,
            company: null,

            salary: 0,
            salary_id: '',

            sub: [
                {amount: 0, type: 'taslalt', description: ''},
                {amount: 0, type: 'hotsrolt', description: ''},
                {amount: 0, type: 'n_d_sh', description: ''},
                {amount: 0, type: 'h_h_o_a_t', description: ''},
                {amount: 0, type: 'busad', description: ''}
            ],
            add: [
                {amount: 0, type: 'nemegdel', description: ''},
                {amount: 0, type: 'uramshuulal', description: ''},
                {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
                {amount: 0, type: 'busad', description: ''}
            ],
            hungulult: 0,
            hool_unaanii_mungu: 0,
        })
    }
    deleteSalary(id, status){
        if(status !== 'idle'){
            config.get('emitter').emit('warning', locale('common_attendance.shine_tsalin_ustgah_bolomjtoi'));
        }else{
            this.props.dispatch(deleteSalary({_id: id}));
        }
    }
    getSalary(){
        this.props.dispatch(getSalaries({year_month: this.state.year_month, company: this.state.searchCompany, employee: this.state.searchUser}));
    }
    save(){
        this.props.dispatch(changeSalaryInfo({
            _id: this.state.selected,
            userId: this.state.user,
            salary: this.state.salary,
            add: this.state.add,
            sub: this.state.sub,
            hool_unaanii_mungu: this.state.hool_unaanii_mungu,
            hungulult: this.state.hungulult,
            year_month: this.state.year_month,
            salary_id: this.state.salary_id
        }));
        this.clear();
    }
    submitAndCancel(id, status){
        let {main: {employee}} = this.props;
        if(!hasAction(['edit_salary'], employee)){
            config.get('emitter').emit(locale('common_attendance.uurchlult_hiih_bolomjgui'));
        }else{
            if(!id || id === ''){
                config.get('emitter').emit('warning', locale('common_attendance.tsaling_oruulna_uu'));
            }else{
                this.props.dispatch(submitAndCancelSalary({_id: id, status: status, year_month: this.state.year_month}));
            }
        }
    }
    approveAndDeclineSalary(status, salary_id){
        let { main:{user, employee} } = this.props;
        // if(employee.staticRole !== 'lord'){
        //     config.get('emitter').emit('warning', 'Энэ үйлдлийг хийх боломжгүй байна');
        // }else{
        //     this.props.dispatch(approveAndDeclineSalary({_id: salary_id, status: status, year_month: this.state.year_month}));
        // }
        this.props.dispatch(approveAndDeclineSalary({_id: salary_id, status: status, year_month: this.state.year_month}));
    }
    export(type){
        let checkeds = {
            splitCompany: false, // company-aar salgah
            first_name: true,
            last_name: true,
            register: true, // Регистр
            company: false, // Компани
            salary: false, // Үндсэн цалин
            nemegdel: false, // Нэмэгдэл
            uramshuulal: false, // Урамшуулал
            iluu_tsagiin_huls: false, // Илүү цагийн хөлс
            bonus_busad: false, // Бусад
            n_d_sh: false, // НДШ
            h_h_o_a_t: false, // ХХОАТ
            hotsrolt: false, // Хоцролт
            taslalt: false, // Таслалт
            fine_busad: false, // Бусад
            hungulult: false, // ХХОАТ хөнгөлөлт
            hool_unaanii_mungu: false, // Хоол унааны мөнгө
            bank: true, // Данс
            total: true, // Нийт дүн
        }
        this.setState({exportType : type , exportModal : true , exportChecked : checkeds});
    }
    hideExportM(){
        this.setState({exportType : '' , exportModal : false});
        // this.props.dispatch(actions.eeStudentsAction.allExported());
    }
    setExport(e){
        let ch = this.state.exportChecked;
        ch[e.target.name] = !ch[e.target.name];
        this.setState({exportChecked : ch});
    }
    exportDisp(){
        this.exportSalary(this.props.salary.employees);
    }
    async exportSalary(salaries){
        function getBankName(e){
            switch (e) {
                case 'khaan': return 'Хаан банк';
                case 'golomt': return 'Голомт банк';
                case 'khas': return 'Хас банк';
                case 'khkh': return 'Худалдаа хөгжилийн банк';
                case 'bogd': return 'Богд банк';
                case 'turiin': return 'Төрийн банк';
                case 'arig': return 'Ариг банк';
                case 'credit': return 'Кредит банк';
                case 'capitron': return 'Капитрон банк';
                case 'undesnii_hurungu': return 'Үндэсний хөрөнгө оруулалтын банк';
                case 'ariljaa': return 'Арилжааны банк';
                case 'teever_hugjil': return 'Тээвэр хөгжлийн банк';
                default: return '';
            }
        }
        const {exportChecked} = this.state;
        let data = salaries.map((employee) => {
            let sheet = {};
            let total = (employee.salary || 0);
            total += employee.hungulult;
            total += employee.hool_unaanii_mungu;
            let nemegdel = 0, uramshuulal = 0, iluu_tsagiin_huls = 0, bonus_busad = 0;
            let n_d_sh = 0, h_h_o_a_t = 0, hotsrolt = 0, taslalt = 0, fine_busad = 0;
            (employee.add || []).map(function (r) {
                total += (r.amount || 0);
                if(r.type === 'nemegdel'){
                    nemegdel = r.amount;
                }
                if(r.type === 'uramshuulal'){
                    uramshuulal = r.amount;
                }
                if(r.type === 'iluu_tsagiin_huls'){
                    iluu_tsagiin_huls = r.amount;
                }
                if(r.type === 'busad'){
                    bonus_busad = r.amount;
                }
            });
            (employee.sub || []).map(function (r) {
                total -= (r.amount || 0);
                if(r.type === 'taslalt'){
                    taslalt = r.amount;
                }
                if(r.type === 'hotsrolt'){
                    hotsrolt = r.amount;
                }
                if(r.type === 'h_h_o_a_t'){
                    h_h_o_a_t = r.amount;
                }
                if(r.type === 'n_d_sh'){
                    n_d_sh = r.amount;
                }
                if(r.type === 'busad'){
                    fine_busad = r.amount;
                }
            });
            if(exportChecked.register){sheet[locale('common_salary.registr')] = ((employee.user || {}).register_id || '').toString().trim();}
            if(exportChecked.last_name){sheet[locale('common_salary.owog')] = ((employee.user || {}).last_name || '').toString().trim();}
            if(exportChecked.first_name){sheet[locale('common_salary.ner')] = ((employee.user || {}).first_name || '').toString().trim();}
            if(exportChecked.company){sheet[locale('common_salary.kompani')] = employee.company && employee.company.name ? employee.company.name.toString().trim() : '';}
            sheet['companyName'] = employee.company && employee.company.name ? employee.company.name.toString().trim() : '';
            sheet['companyId'] = employee.company && employee.company._id ? employee.company._id.toString().trim() : '';
            if(exportChecked.salary){sheet[locale('common_salary.undsen_tsalin')] = employee.salary;}
            if(exportChecked.nemegdel){sheet[locale('common_salary.nemegdel')] = nemegdel;}
            if(exportChecked.uramshuulal){sheet[locale('common_salary.uramshuulal')] = uramshuulal;}
            if(exportChecked.iluu_tsagiin_huls){sheet[locale('common_salary.iluu_tsagiin_huls')] = iluu_tsagiin_huls;}
            if(exportChecked.bonus_busad){sheet[locale('common_salary.busad_nemegdel')] = bonus_busad;}
            if(exportChecked.n_d_sh){sheet[locale('common_salary.n_d_sh')] = n_d_sh;}
            if(exportChecked.h_h_o_a_t){sheet[locale('common_salary.h_h_o_a_t')] = h_h_o_a_t;}
            if(exportChecked.hotsrolt){sheet[locale('common_salary.hotsrolt')] = hotsrolt;}
            if(exportChecked.taslalt){sheet[locale('common_salary.taslalt')] = taslalt;}
            if(exportChecked.fine_busad){sheet[locale('common_salary.busad_suutgalt')] = fine_busad;}
            if(exportChecked.hungulult){sheet[locale('common_salary.h_h_o_a_t_hungulult')] = employee.hungulult;}
            if(exportChecked.hool_unaanii_mungu){sheet[locale('common_salary.hool_unaanii_mungu')] = employee.hool_unaanii_mungu;}
            if(exportChecked.bank && employee.bank){
                sheet[locale('common_salary.bank')] = getBankName(employee.bank.name);
                sheet[locale('common_salary.dans')] = employee.bank.account;
                if(exportChecked.total){sheet[locale('common_salary.olgoj_bui_tsalin')] = total;}
            } else {
                if(exportChecked.total){sheet[locale('common_salary.olgoj_bui_tsalin')] = total;}
            }
            return sheet;
        })
        let companyIds = [];
        let sheets = [];
        if(exportChecked.splitCompany){
            (data || []).map(function (r) {
                if(!companyIds.some(s => s === r.companyId)){
                    // if(companyIds && companyIds.length>0){
                    companyIds.push(r.companyId);
                    // } else {
                    //     companyIds = [r.companyId];
                    // }
                }
            });
            (companyIds || []).map(function (r, idx) {
                let com = {name: `Цалин ${idx+1}`, data: []};
                (data || []).map(function (d) {
                    if(d.companyId === r){
                        // com.data.push(function (r) {
                        //     delete r.companyId;
                        //     return r;
                        // })
                        com.data.push(d)
                        com.name = (d.companyName || '').slice(0, 30)
                    }
                });
                sheets.push(com);
            });
        } else {
            sheets = [{name: 'Цалин', data: data}];
        }

        if(exportChecked.last_name || exportChecked.first_name || exportChecked.register || exportChecked.bank){
            // exportEx(data , 'Цалин');
            this.exEx(sheets );
            this.hideExportM();
        }
    }
    exEx(sheets){
        console.log(sheets);
        let workbook = utils.book_new();
        (sheets || []).map(function (r) {
            let data = r.data;
            data.map(function (da) {
                delete da.companyId;
                delete da.companyName;
            });
            let sheet = utils.json_to_sheet(data);
            utils.book_append_sheet(workbook , sheet , (r.name || 'salary'));
        });
        let result = xls.writeFile(workbook , `salary.xls`);
        return result;
    }
    exportAll(){
        // const {params , dispatch} = this.props;
        // const {numEXport} = this.state;
        // let num = numEXport + 1;
        // this.setState({numEXport : num} , () => {
        //     dispatch(actions.eeStudentsAction.exportStudent(params.schoolslug , "teacher" , numEXport * 50 , 'all'));
        // });
    }
    searchEmployees(e){
        let self = this;
        clearTimeout(this.state.timeOut);
        let timeOut = setTimeout(function(){
            self.setState({
                timeOut: timeOut
            }, () => {
                self.props.dispatch(getEmployeeStandard({
                    pageNum: 0, pageSize: 10,
                    staticRole: ['hrManager', 'employee', 'chairman', 'lord'],
                    search: self.state.searchUser, getAvatars: true, subsidiaries:true, company: self.state.searchCompany
                }));
            });
        }, 500);
    }
    render() {
        let {
            main:{user, employee, company},
            salary: { employees, gettingSalaries, changingStatus, changingEmp, found, subCompanies, gettingEmployees, gettingSubCompanies}
        } = this.props;
        function getStatus(str){
            switch (str) {
                case 'approved': return <Tag color='green'>{locale('common_salary.batlagdsan')}</Tag>;
                case 'pending': return <Tag color='geekblue'>{locale('common_salary.huleegdej_bui')}</Tag>;
                case 'idle': return <Tag>{locale('common_salary.shine')}</Tag>;
                case 'declined': return <Tag color='red'>{locale('common_salary.tsutslagdsan')}</Tag>;
                default: return str;
            }
        }
        function getBankName(e){
            switch (e) {
                case 'khaan': return 'Хаан банк';
                case 'golomt': return 'Голомт банк';
                case 'khas': return 'Хас банк';
                case 'khkh': return 'Худалдаа хөгжилийн банк';
                case 'bogd': return 'Богд банк';
                case 'turiin': return 'Төрийн банк';
                case 'arig': return 'Ариг банк';
                case 'credit': return 'Кредит банк';
                case 'capitron': return 'Капитрон банк';
                case 'undesnii_hurungu': return 'Үндэсний хөрөнгө оруулалтын банк';
                case 'ariljaa': return 'Арилжааны банк';
                case 'teever_hugjil': return 'Тээвэр хөгжлийн банк';
                default: return '';
            }
        }
        let actionColumns = [];

        let worthy = false;
        if(hasAction(['read_salary'], employee)){
            worthy = true;
        }
        // if(hasAction(['edit_salary'], employee) && (employee.staticRole !== 'lord' && (employees || []).some(emp => emp.salary_status !== 'approved') || employee.staticRole === 'lord')){
        if(hasAction(['edit_salary'], employee)){
            actionColumns.push(
                {
                    key: 'action',
                    title: locale('common_salary.uildluud'),
                    width: 168,
                    fixed: 'right',
                    align: 'center',
                    render: (record) =>
                        <div>
                            {
                                record.salary_status === 'idle' && record.salary_id ?
                                    <div>
                                        <Button icon={<SelectOutlined />}
                                                disabled={(record.company || {})._id !== employee.company}
                                                className='approve'
                                                loading={record.salary_id === changingEmp}
                                                onClick={() => this.submitAndCancel((record.salary_id || ''), 'pending')}
                                        >
                                            {locale('common_salary.ilgeeh')}
                                        </Button>
                                        <Popconfirm
                                            title={locale('common_salary.tsalin_ustgah_uu')}
                                            onConfirm={() => this.deleteSalary(record.salary_id, record.salary_status)}
                                            okText={locale('common_salary.tiim')}
                                            cancelText={locale('common_salary.ugui')}
                                            disabled={(record.company || {})._id !== employee.company}
                                        >
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size='small' shape='circle'
                                                danger style={{marginLeft: 10}}
                                                loading={record.salary_id === changingEmp}
                                                disabled={(record.company || {})._id !== employee.company}
                                            />
                                        </Popconfirm>
                                    </div>
                                    :
                                    null
                            }
                            {/*{*/}
                            {/*    record.salary_status === 'pending' || (record.salary_status === 'approved' && employee.staticRole === 'lord') ?*/}
                            {
                                record.salary_status === 'pending' || record.salary_status === 'approved' ?
                                    <Popconfirm
                                        title={locale('common_salary.huseltiig_butsaah_uu')}
                                        onConfirm={() => this.submitAndCancel((record.salary_id || ''), 'idle')}
                                        okText={locale('common_salary.tiim')}
                                        cancelText={locale('common_salary.ugui')}
                                        disabled={(record.company || {})._id !== employee.company}
                                    >
                                        <Button icon={<ExportOutlined />} danger disabled={(record.company || {})._id !== employee.company}>{locale('common_salary.butsaah')}</Button>
                                    </Popconfirm>
                                    :
                                    null
                            }
                        </div>
                }
            )
        }
        // if(employee.staticRole === 'lord' && (employees || []).some(emp => emp.salary_status === 'pending')){
        if(hasAction(['edit_salary'], employee)){
            actionColumns.push(
                {
                    key: 'lord_actions',
                    title: <FormOutlined />,
                    width: 70,
                    align: 'center',
                    fixed: 'right',
                    render: (record) =>
                        <>
                            {/*record.salary_status === 'pending' && employee.staticRole === 'lord' ?*/}
                            {
                                record.salary_status === 'pending' ?
                                    <Dropdown overlay={
                                        <Menu key={Math.random()} onClick={(e) => this.approveAndDeclineSalary(e.key, record.salary_id)}>
                                            <React.Fragment>
                                                <Menu.Item key={'approved'} className='approve' icon={<CheckCircleOutlined />}>
                                                    {locale('common_salary.batlah')}
                                                </Menu.Item>
                                                <Menu.Item key={'declined'} danger className='decline' icon={<CloseCircleOutlined />}>
                                                    {locale('common_salary.tatgalzah')}
                                                </Menu.Item>
                                            </React.Fragment>
                                        </Menu>
                                    }
                                              trigger={'click'}
                                              disabled={record.salary_id === changingEmp || (record.company || {})._id !== employee.company}
                                    >
                                        <Button icon={<DashOutlined />} shape='circle'/>
                                    </Dropdown>
                                    :
                                    null
                            }
                        </>
                }
            )
        }
        let columns =[
            {
                key: 'index',
                title: '№',
                width: 70,
                render: (record) => record.summary ? '' : employees.indexOf(record)+1 ,
                align: 'center',
                fixed: 'left',
            },
            {
                key: 'first_name',
                ellipsis: true,
                fixed: 'left',
                title: () => <div style={{textAlign: 'center'}}>{locale('common_salary.ner')}</div>,
                render: (record) =>
                    // hasAction(['edit_salary'], employee) ?
                    //     (((record.company || {})._id || 'as').toString() !== (employee.company || '').toString()) ?
                    //         <p style={{marginBottom: 0}}>{((record.user || {}).first_name || '').slice(0,1).toUpperCase()+((record.user || {}).first_name || '').slice(1,((record.user || {}).first_name || '').length)}</p>
                    //         :
                    //         record.salary_status !== 'approved' && record.salary_status !== 'pending' ?
                                <a
                                    style={{color: '#1890FF'}}
                                    onClick={() => this.setState({
                                        visible: true,
                                        selected: record._id,
                                        company: record.company,
                                        user: (record.user || {})._id,
                                        first_name: (record.user || {}).first_name,
                                        last_name: (record.user || {}).last_name,
                                        register_id: (record.user || {}).register_id,

                                        salary: (record.salary || 0),
                                        salary_id: (record.salary_id || ''),
                                        add: ((record || {}).add || []),
                                        sub: ((record || {}).sub || []),
                                        hool_unaanii_mungu: (record.hool_unaanii_mungu || 0),
                                        hungulult: (record.hungulult || 0)
                                    })}
                                >
                                    {((record.user || {}).first_name || '').slice(0,1).toUpperCase()+((record.user || {}).first_name || '').slice(1,((record.user || {}).first_name || '').length)}
                                </a>
                                // :
                                // <a style={{cursor: 'default'}}>{((record.user || {}).first_name || '').slice(0,1).toUpperCase()+((record.user || {}).first_name || '').slice(1,((record.user || {}).first_name || '').length)}</a>
                        // :
                        // <p style={{marginBottom: 0}}>{((record.user || {}).first_name || '').slice(0,1).toUpperCase()+((record.user || {}).first_name || '').slice(1,((record.user || {}).first_name || '').length)}</p>
            },
            {
                key: 'last_name',
                fixed: 'left',
                ellipsis: true,
                title: () => <div style={{textAlign: 'center'}}>{locale('common_salary.owog')}</div>,
                render: (record) => `${((record.user || {}).last_name || '').slice(0,1).toUpperCase()+((record.user || {}).last_name || '').slice(1,((record.user || {}).last_name || '').length)}`
            },
            {
                key: 'company',
                title: locale('common_salary.kompani'),
                ellipsis: true,
                render: (record) =>
                    <Tooltip
                        title={(record.company || {}).name}
                    >
                        {(record.company || {}).name}
                    </Tooltip>,
                align: 'center'
            },
            {
                key: 'salary',
                title: locale('common_salary.undsen_tsalin'),
                dataIndex: 'salary',
                render: (record) => record.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                align: 'center'
            },
            {
                key: 'bank',
                width: 250,
                title: locale('common_salary.tsalin_awah_dans'),
                ellipsis: true,
                render: (record) =>
                    record.bank ?
                        <Popover
                            title={getBankName((record.bank || {}).name)}
                            content={(record.bank || {}).account}
                        >
                            {getBankName((record.bank || {}).name)} {(record.bank || {}).account}
                        </Popover>
                    :
                    null,
                align: 'center'
            },
            {
                key: 'bonus',
                title: locale('common_salary.nemegdel'),
                align: 'center',
                children: [
                    {
                        key: 'nemegdel',
                        title: locale('common_salary.nemegdel'),
                        align: 'center',
                        render: (record) => (record.add || []).map(ad => ad.type === 'nemegdel' ? (ad || {}).amount || 0 : null)
                    },
                    {
                        key: 'uramshuulal',
                        title: locale('common_salary.uramshuulal'),
                        align: 'center',
                        render: (record) => (record.add || []).map(ad => ad.type === 'uramshuulal' ? (ad || {}).amount || 0 : null)
                    },
                    {
                        key: 'iluu_tsagiin_huls',
                        title: locale('common_salary.iluu_tsagiin_huls'),
                        align: 'center',
                        render: (record) => (record.add || []).map(ad => ad.type === 'iluu_tsagiin_huls' ? (ad || {}).amount || 0 : null)
                    },
                    {
                        key: 'bonus_busad',
                        title: locale('common_salary.busad'),
                        align: 'center',
                        render: (record) => (record.add || []).map(ad => ad.type === 'busad' ? (ad || {}).amount || 0 : null)
                    }
                ]
            },
            {
                key: 'fine',
                title: locale('common_salary.suutgal'),
                align: 'center',
                children: [
                    {
                        key: 'n_d_sh',
                        title: locale('common_salary.n_d_sh'),
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'n_d_sh' ? (su || {}).amount || 0 : null)
                    },
                    {
                        key: 'h_h_o_a_t',
                        title: locale('common_salary.h_h_o_a_t'),
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'h_h_o_a_t' ? (su || {}).amount || 0 : null)
                    },
                    {
                        key: 'hotsrolt',
                        title: locale('common_salary.hotsrolt'),
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'hotsrolt' ? (su || {}).amount || 0 : null)
                    },
                    {
                        key: 'taslalt',
                        title: locale('common_salary.taslalt'),
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'taslalt' ? (su || {}).amount || 0 : null)
                    },
                    {
                        key: 'fine_busad',
                        title: locale('common_salary.busad'),
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'busad' ? (su || {}).amount || 0 : null)
                    }
                ]
            },
            {
                key: 'hungulult',
                title: locale('common_salary.h_h_o_a_t_hungulult'),
                align: 'center',
                render: (record) => (record || {}).hungulult || 0
            },
            {
                key: 'hool_unaanii_mungu',
                title: locale('common_salary.hool_unaanii_mungu'),
                align: 'center',
                render: (record) => (record || {}).hool_unaanii_mungu || 0
            },
            {
                fixed: 'right',
                key: 'total',
                title: locale('common_salary.niit_dun'),
                align: 'center',
                render: (record) => {
                    let total = (record || {}).salary || 0;
                    ((record || {}).add || []).map(ad => {
                        total += ad.amount || 0;
                    });
                    ((record || {}).sub || []).map(su => {
                        total -= su.amount || 0;
                    });
                    total += ((record || {}).hungulult || 0);
                    total += ((record || {}).hool_unaanii_mungu || 0);
                    return (total || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
            },
            {
                fixed: 'right',
                key: 'status',
                title: locale('common_salary.tuluv'),
                dataIndex: 'salary_status',
                align: 'center',
                width: 150,
                render: (record) => getStatus(record)
            },
            ...actionColumns
        ];
        let salary = this.state.salary || 0;
        let hool_unaanii_mungu = this.state.hool_unaanii_mungu || 0;
        let hungulult = this.state.hungulult || 0;
        let nemegdel, uramshuulal, iluu_tsagiin_huls, bonus_busad_amount, bonus_busad_desc, n_d_sh, h_h_o_a_t, hotsrolt, taslalt, fine_busad_amount, fine_busad_desc;
        ((this.state || {}).add || []).map(ad => {
            switch (ad.type || '') {
                case 'nemegdel': nemegdel = ad.amount || 0; break;
                case 'uramshuulal': uramshuulal = ad.amount || 0; break;
                case 'iluu_tsagiin_huls': iluu_tsagiin_huls = ad.amount || 0; break;
                case 'busad':
                        bonus_busad_amount = ad.amount || 0;
                        bonus_busad_desc = ad.description || '';
                    break;
            }
        });
        ((this.state || {}).sub || []).map(su => {
            switch (su.type) {
                case 'n_d_sh': n_d_sh = su.amount || 0; break;
                case 'h_h_o_a_t': h_h_o_a_t = su.amount || 0; break;
                case 'hotsrolt': hotsrolt = su.amount || 0; break;
                case 'taslalt': taslalt = su.amount || 0; break;
                case 'busad':
                        fine_busad_amount = su.amount || 0;
                        fine_busad_desc = su.description || '';
                    break;
            }
        });
        let total = salary;
        ((this.state || {}).add || []).map(ad => {
            total += ad.amount || 0;
        });
        ((this.state || {}).sub || []).map(su => {
            total -= su.amount || 0;
        });
        total += hungulult;
        total += hool_unaanii_mungu;
        const exportModalOverlay = (
            <Menu>
                <Menu.Item>
                    <a
                        onClick={this.export.bind(this , 'disp')}
                    >
                        <i className="mdi mdi-checkbox-marked-outline" /> {locale('common_salary.ilerts_export')}
                    </a>
                </Menu.Item>
            </Menu>
        );
        return (
            <React.Fragment> {/* getEmployeeStandard, getSubsidiaryCompanies */}
                <Row key='header' style={{justifyContent: 'space-between'}}>
                    <Row key='date'>
                        <Title level={5} style={{display: 'flex', alignItems: 'center',marginBottom: 0, marginRight: 10}}>{locale('common_salary.sar')}:</Title>
                        <DatePicker
                            picker='month'
                            format='YYYY-MM'
                            defaultValue={moment(this.state.year_month)}
                            onChange={(e) => this.setState({year_month: moment(e).format('YYYY-MM')})}
                            allowClear={false}
                            disabled={gettingSalaries}
                        />
                        {
                            worthy && (company.parent || '').toString() === '' ?
                                <>
                                    <Title level={5} style={{display: 'flex', alignItems: 'center',marginBottom: 0, marginRight: 10, marginLeft: 10}}>{locale('common_salary.kompani')}:</Title>
                                    <Select
                                        value={this.state.searchCompany} style={{width: 200}} loading={gettingSubCompanies}
                                        onSelect={(e) => this.setState({searchCompany: e, searchUser: ''})} disabled={gettingSalaries}
                                    >
                                        <Select.Option value={'all'} key={'all'}>{locale('common_salary.bugd')}</Select.Option>
                                        <Select.Option value={company._id} key={company._id}>{company.name}</Select.Option>
                                        {
                                            subCompanies.map((subCompany) => <Select.Option value={subCompany._id} key={subCompany._id}>
                                                {subCompany.name}
                                            </Select.Option>)
                                        }
                                    </Select>
                                </>
                                :
                                null
                        }
                        {worthy?
                            <React.Fragment>
                                <Title level={5} style={{display: 'flex', alignItems: 'center',marginBottom: 0, marginRight: 10, marginLeft: 10}}>{locale('common_salary.hereglegch')}:</Title>
                                <Select
                                    loading={status || gettingEmployees}
                                    // disabled={status || gettingEmployees}
                                    name='user'
                                    allowClear showSearch={true}
                                    style={{ width: 300 }}
                                    placeholder={locale('common_salary.hereglegchiin_n_b_u_h')}
                                    disabled={gettingSalaries}
                                    // onSelect={(e) => this.selectEmployee(e)}
                                    onSelect={(e) => this.setState({searchUser: e})}
                                    onClear={() => this.setState({searchUser: ''})}
                                    onSearch={this.searchEmployees.bind(this)}
                                    filterOption={false}
                                    value={this.state.searchUser}
                                    dropdownClassName={'orlogo-zarlaga-dropdown'}
                                    dropdownRender={(record) =>
                                        ((record.props || {}).options || []).length > 0 ?
                                            ((record.props || {}).options || []).map((opt, index) =>
                                                <div key={`multiple-column-div-employee-salary-column-${index}`}
                                                     className={(this.state.searchUser || 'a').toString() === opt.value ? 'row active' : 'row'}
                                                     onClick={() => this.setState({searchUser: opt.value})}
                                                >
                                                    <Row
                                                        key={`multiple-column-select-employee-salary-column-${index}`}
                                                        // onClick={() => this.selectEmployee(opt.value)}
                                                        style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}
                                                    >
                                                        <div style={{borderRadius: '50%', overflow: 'hidden', marginRight: 10}}
                                                             key={`multiple-column-select-row-image`}
                                                        >
                                                            <img
                                                                style={{width: 35, height: 35, objectFit: 'cover', objectPosition: 'center'}}
                                                                src={(((opt.children || [])[0] || {}).props || {}).src ?
                                                                    (((opt.children || [])[0] || {}).props || {}).src
                                                                    :
                                                                    '/images/default-avatar.png'}
                                                                onError={(e) => e.target.src = '/images/default-avatar.png'}
                                                            />
                                                        </div>
                                                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', width: 229}} key={`multiple-column-select-row-last-name`}>
                                                            {
                                                                (opt.children || []).map((child, ind) =>
                                                                    ind > 0 && ind<4?
                                                                        <span
                                                                            key={`multiple-column-select-span-${ind}`}
                                                                            style={{fontWeight: 'bold', fontSize: 14, display: 'inline-block'}}
                                                                        >{child}</span>
                                                                        :
                                                                        null
                                                                )
                                                            }
                                                        </div>
                                                    </Row>
                                                    <span
                                                        key={`multiple-column-select-span-company}`}
                                                        style={{fontWeight: 'bold', fontSize: 14, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%'}}
                                                    >{(opt.children || [])[5]}</span>
                                                </div>
                                            )
                                            :
                                            <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_salary.hailtiin_ilerts_oldsongui')}</span>} />
                                    }
                                >
                                    {
                                        (found || []).map(emp =>
                                            <Select.Option value={emp._id} key={emp._id}>
                                                <img
                                                    style={{display: 'none'}}
                                                    src={((emp.user || {}).avatar || {}).path ?
                                                        `${config.get('hostMedia')}${((emp.user || {}).avatar || {}).path}`
                                                        :
                                                        '/images/default-avatar.png'}
                                                    onError={(e) => e.target.src = '/images/default-avatar.png'}
                                                />
                                                {
                                                    (((emp || {}).user || {}).last_name || '').slice(0,1).toUpperCase()
                                                }.
                                                {
                                                    (((emp || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+
                                                    (((emp || {}).user || {}).first_name || '').slice(1,(((emp || {}).user || {}).first_name || '').length)
                                                }&nbsp;
                                                {((emp || {}).company || {}).name}
                                            </Select.Option>
                                        )
                                    }
                                </Select>
                            </React.Fragment>
                            :
                            null
                        }
                        <Button icon={<SearchOutlined/>} onClick={() => this.getSalary()} loading={gettingSalaries} type={'primary'} style={{marginLeft: 10}} />
                    </Row>
                    {worthy?
                        <Dropdown overlay={exportModalOverlay}>
                            <Button icon={<ExportOutlined />} style={{marginRight: 15}}>{locale('common_salary.export')}</Button>
                        </Dropdown>
                        :
                        null
                    }
                    <div style={worthy ? {display: 'block'} : {display: 'none'}}>
                        <Link to={'/salary/logs'} style={{display: 'block', boxShadow: ' 0px 0px 0px 2px #2f3657', padding: 7, fontWeight: 500, backgroundColor: 'white', color: '#2f3647', borderRadius: 10}}>
                            {locale('common_salary.tsalingiin_uurchlultiig_harah')}
                        </Link>
                    </div>
                </Row>
                <Divider/>
                <Table
                    rowKey={(record) => {return record._id}}
                    loading={gettingSalaries}
                    dataSource={employees}
                    columns={columns}
                    locale={{emptyText: locale('common_salary.hooson_baina')}}
                    bordered={true}
                    className='salary_table'
                    pagination={false}
                    scroll={{ x: 3000 }}
                    sticky
                />
                <Drawer
                    title={
                        `${(this.state.last_name || '').slice(0,1).toUpperCase()+(this.state.last_name || '').slice(1,(this.state.last_name || '').length)} 
                        ${(this.state.first_name || '').slice(0,1).toUpperCase()+(this.state.first_name || '').slice(1,(this.state.first_name || '').length)} - 
                        ${(this.state.register_id || '').toUpperCase()}`
                    }
                    maskClosable={false}
                    onClose={this.clear.bind(this)}
                    width={720}
                    visible={ this.state.visible }
                    key={'drawer-roles'}
                    footer={
                        <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                            <b>{locale('common_salary.niit_dun')} {(total || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{locale('common_salary.currency')}</b>

                            {hasAction(['edit_salary'], employee) ?
                                (((this.state.company || {})._id || 'as').toString() === (employee.company || '').toString()) ?
                                    <div style={{textAlign: 'right'}}>
                                        <Button onClick={this.clear.bind(this)}>{locale('common_salary.bolih')}</Button>
                                        <Button style={{marginLeft: 10}} type="primary" onClick={this.save.bind(this)}>
                                            {locale('common_salary.hadgalah')}
                                        </Button>
                                    </div>
                                    :
                                    <div style={{textAlign: 'right'}}>
                                        <Alert message={locale('common_salary.tuhain_ajiltnii_k_n_sh')} type="warning" />
                                    </div>
                                :
                                null
                            }

                        </div>
                    }
                >
                    <Row justify="center" align="center">
                        <Col span={22}>
                            <Form
                                className='salary'
                                onFinish={this.save.bind(this)}
                                layout='horizontal'
                                fields={[
                                    {name: 'salary', value: salary},
                                    {name: 'nemegdel', value: nemegdel},
                                    {name: 'uramshuulal', value: uramshuulal},
                                    {name: 'iluu_tsagiin_huls', value: iluu_tsagiin_huls},
                                    {name: 'bonus_busad_amount', value: bonus_busad_amount },
                                    {name: 'bonus_busad_desc', value: bonus_busad_desc,},
                                    {name: 'n_d_sh', value: n_d_sh},
                                    {name: 'h_h_o_a_t', value: h_h_o_a_t},
                                    {name: 'hotsrolt', value: hotsrolt},
                                    {name: 'taslalt', value: taslalt},
                                    {name: 'fine_busad_amount', value: fine_busad_amount},
                                    {name: 'fine_busad_desc', value: fine_busad_desc},
                                    {name: 'hungulult', value: hungulult},
                                    {name: 'hool_unaanii_mungu', value: hool_unaanii_mungu},
                                ]}
                            >
                                <Form.Item
                                    label={locale('common_salary.undsen_tsalin')}
                                    name='salary'
                                >
                                    <InputNumber disabled={!worthy} name='salary' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={salary} onChange={(e) => this.setState({...this.state, salary: e})}/>
                                </Form.Item>
                                <b style={{fontSize: 15}}>{locale('common_salary.nemegdel')}</b>
                                <>
                                    <Form.Item
                                        label={locale('common_salary.nemegdel')}
                                        name='nemegdel'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='nemegdel' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={nemegdel} onChange={(e) => this.setState({...this.state, add: (this.state.add || []).map(ad => {if(ad.type !== 'nemegdel'){return ad}else{return {...ad, amount: e}}})})}/>
                                    </Form.Item>
                                </>
                                <>
                                    <Form.Item
                                        label={locale('common_salary.uramshuulal')}
                                        name='uramshuulal'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='uramshuulal' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={uramshuulal} onChange={(e) => this.setState({...this.state, add: (this.state.add || []).map(ad => {if(ad.type !== 'uramshuulal'){return ad}else{return {...ad, amount: e}}})})}/>
                                    </Form.Item>
                                </>
                                <>
                                    <Form.Item
                                        label={locale('common_salary.iluu_tgagiin_huls')}
                                        name='iluu_tsagiin_huls'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='iluu_tsagiin_huls' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={iluu_tsagiin_huls} onChange={(e) => this.setState({...this.state, add: (this.state.add || []).map(ad => {if(ad.type !== 'iluu_tsagiin_huls'){return ad}else{return {...ad, amount: e}}})})}/>
                                    </Form.Item>
                                </>
                                <>
                                    <Form.Item
                                        label={locale('common_salary.busad')}
                                        name='bonus_busad_amount'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='bonus_busad_amount' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={bonus_busad_amount} onChange={(e) => this.setState({...this.state, add: (this.state.add || []).map(ad => {if(ad.type !== 'busad'){return ad}else{return {...ad, amount: e}}})})}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={locale('common_salary.tailbar')}
                                        name='bonus_busad_desc'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <Input.TextArea disabled={!worthy} name='bonus_busad_desc' value={bonus_busad_desc} onChange={(e) => this.setState({...this.state, add: (this.state.add || []).map(ad => {if(ad.type !== 'busad'){return ad}else{return {...ad, description: ((e.target || {}).value || '')}}})})}/>
                                    </Form.Item>
                                </>

                                <b style={{fontSize: 15}}>{locale('common_salary.suutgal')}</b>

                                <Form.Item
                                    label={locale('common_salary.n_d_sh')}
                                    name='n_d_sh'
                                    labelCol={{
                                        span: 6,
                                    }}
                                    wrapperCol={{
                                        span: 14,
                                    }}
                                >
                                    <InputNumber disabled={!worthy} name='n_d_sh' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={n_d_sh} onChange={(e) =>this.setState({...this.state, sub: (this.state.sub || []).map(su => {if(su.type !== 'n_d_sh'){return su}else{return {...su, amount: e}}})})}/>
                                </Form.Item>
                                <Form.Item
                                    label={locale('common_salary.h_h_o_a_t')}
                                    name='h_h_o_a_t'
                                    labelCol={{
                                        span: 6,
                                    }}
                                    wrapperCol={{
                                        span: 14,
                                    }}
                                >
                                    <InputNumber disabled={!worthy} name='h_h_o_a_t' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={h_h_o_a_t} onChange={(e) => this.setState({...this.state, sub: (this.state.sub || []).map(su => {if(su.type !== 'h_h_o_a_t'){return su}else{return {...su, amount: e}}})})}/>
                                </Form.Item>
                                <>
                                    <Form.Item
                                        label={locale('common_salary.ilerts_export')}
                                        name='hotsrolt'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='hotsrolt' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={hotsrolt} onChange={(e) => this.setState({...this.state, sub: (this.state.sub || []).map(su => {if(su.type !== 'hotsrolt'){return su}else{return {...su, amount: e}}})})}/>
                                    </Form.Item>
                                </>
                                <>
                                    <Form.Item
                                        label={locale('common_salary.taslalt')}
                                        name='taslalt'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='taslalt' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={taslalt} onChange={(e) => this.setState({...this.state, sub: (this.state.sub || []).map(su => {if(su.type !== 'taslalt'){return su}else{return {...su, amount: e}}})})}/>
                                    </Form.Item>
                                </>
                                <>
                                    <Form.Item
                                        label={locale('common_salary.busad')}
                                        name='fine_busad_amount'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='fine_busad_amount' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={fine_busad_amount} onChange={(e) => this.setState({...this.state, sub: (this.state.sub || []).map(su => {if(su.type !== 'busad'){return su}else{return {...su, amount: e}}})})}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={locale('common_salary.tailbar')}
                                        name='fine_busad_desc'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <Input.TextArea disabled={!worthy} name='fine_busad_desc' value={fine_busad_desc} onChange={(e) => this.setState({...this.state, sub: (this.state.sub || []).map(su => {if(su.type !== 'busad'){return su}else{return {...su, description: ((e.target || {}).value || '')}}})})}/>
                                    </Form.Item>
                                </>
                                <hr />
                                <>
                                    <Form.Item
                                        label={locale('common_salary.hungulult')}
                                        name='hungulult'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='hungulult' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={hungulult} onChange={(e) => this.setState({...this.state, hungulult: e})}/>
                                    </Form.Item>
                                </>
                                <>
                                    <Form.Item
                                        label={locale('common_salary.hool_unaanii_mungu')}
                                        name='hool_unaanii_mungu'
                                        labelCol={{
                                            span: 6,
                                        }}
                                        wrapperCol={{
                                            span: 14,
                                        }}
                                    >
                                        <InputNumber disabled={!worthy} name='hool_unaanii_mungu' formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={hool_unaanii_mungu} onChange={(e) => this.setState({...this.state, hool_unaanii_mungu: e})}/>
                                    </Form.Item>
                                </>
                            </Form>
                        </Col>
                    </Row>
                </Drawer>


                <ExportExcel
                    exportChecked={this.state.exportChecked}
                    setExport={this.setExport.bind(this)}
                    hideExportM={this.hideExportM.bind(this)}
                    exportType={this.state.exportType}
                    exportDisp={this.exportDisp.bind(this)}
                    exportAll={this.exportAll.bind(this)}
                    exportModal={this.state.exportModal}
                    type="salary"
                />
            </React.Fragment>
        );
    }
}

export default connect(reducer)(Salary);