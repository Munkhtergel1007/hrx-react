import React from "react";
import config, {hasAction, isPhoneNum, isValidDate, msg, string} from "../../config";
import Cookies from "js-cookie";
import { locale } from "../../lang";
import {
    addNewInfoHandler,
    editEmpMain,
    insertEmpExperience,
    insertEmpFamily, insertEmpMilitary,
    insertEmpProfession,
    insertEmpQtraining,
    insertEmpSkill,
    onMainChangeHandler,
    startEditMain,
    stopEditMain,
    insertEmpReward,
    changeAvatar,
    // uploadAvatar
} from "../../actions/employee_actions";
import moment from "moment";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Image,
    Input,
    InputNumber,
    Popconfirm,
    Row,
    Select,
    Switch,
    Table
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    CameraFilled,
} from '@ant-design/icons';
import {connect} from 'react-redux'
import MediaLib from "../../components/media/MediaLib";

const reducer = ({main, employee}) => ({main, employee});

import WorkerInfo from "./workerInfo/workerInfo";

const {Option} = Select;

class AnketComponent extends React.PureComponent{
    constructor(props){
        super(props);
        // if(!hasAction(['edit_employee'])){
        //     window.location.assign('/not-found');
        // }
        this.state = {
            needMainInfoUpdate: false,
            address: {},
            checked: ((this.props.employee.empSingle || {}).user || {}).hasChild,
            mediaType: '',
            forWhat: '',
        };
    }
    updateMainInfo(vals){
        const {employee: {empSingle}} = this.props;
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        if(vals.phone && !isPhoneNum(vals.phone)){
            msg('error', 'Утасны дугаараа шалгана уу.');
        } else if(vals.phoneFromComp && !isPhoneNum(vals.phoneFromComp)){
            msg('error', 'Ажлын утасны дугаараа шалгана уу.');
        } else if((vals.main || [])['bank.name'] && (vals.main || [])['bank.name'] === '' && (vals.main || [])['bank.account'] && (vals.main || [])['bank.account'] === '' ){
            msg('error', 'Ажлын утасны дугаараа шалгана уу.');
        } else {
            const { employee: {empSingle = {}} } = this.props;
            this.props.dispatch(editEmpMain({...vals.main, address: this.state.address, emp: empSingle._id})).then(c => {
                if(c.json.userExists){
                    if((vals.main.username || {}).toLowerCase() === (c.json.existing || {}).username.toLowerCase()){
                        return msg('error', 'Нэвтрэх нэр давхцаж байна.')
                    } else if((vals.main.email || {}).toLowerCase() === (c.json.existing || {}).email.toLowerCase()) {
                        return msg('error', 'Имэйл давхцаж байна.')
                    } else if ((vals.main.register_id || {}).toLowerCase() === (c.json.existing || {}).register_id.toLowerCase()){
                        return msg('error', 'Регистрийн дугаар давхцаж байна.')
                    }
                }
            });
        }
    }
    insertFamilyInfo(record, action){
        const { employee: {empSingle = {}, editFamily } } = this.props;
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        let values = Object.values(editFamily);
        if(action === 'delete') {
            this.props.dispatch(insertEmpFamily({...record, emp: empSingle._id, action: action}))
        }
        if(values.some((c) => string(c) !== '')){
            if(!editFamily.last_name || editFamily.last_name === ''){
                return msg('error', 'Овог оруулна уу.');
            } else if(!editFamily.first_name || editFamily.first_name === ''){
                return msg('error', 'Нэр оруулна уу.');
            }else if(!editFamily.hen_boloh || editFamily.hen_boloh === ''){
                return msg('error', 'Хэн болохыг сонгоно уу.');
            } else if(editFamily.phone && !isPhoneNum(editFamily.phone)){
                return msg('error', 'Эхний утасны дугаараа шалгана уу.');
            } else if(editFamily.phone1 && !isPhoneNum(editFamily.phone1)){
                return msg('error', '2 дахь утасны дугаараа шалгана уу.');
            } else if(editFamily.phone2 && !isPhoneNum(editFamily.phone2)){
                return msg('error', '3 дахь утасны дугаараа шалгана уу.');
            } else {
                if(editFamily.phone){
                    if((empSingle.user && empSingle.user.phone === editFamily.phone) || (empSingle.phoneFromComp === editFamily.phone)){
                        return msg('error', 'Эхний утасны дугаар бүртгэлтэй байна.');
                    }
                    if(
                        empSingle.user &&
                        empSingle.user.family &&
                        empSingle.user.family.familyMembers &&
                        empSingle.user.family.familyMembers.length>0 &&
                        empSingle.user.family.familyMembers.some(r => ( (r._id || 'a').toString() !== (editFamily._id || 'dd').toString() && ((r.phone && r.phone === editFamily.phone) || (r.phone1 && r.phone1 === editFamily.phone) || (r.phone2 && r.phone2 === editFamily.phone))  ) )
                    ){
                        return msg('error', 'Эхний утасны дугаар гэр бүлийн гишүүн дээр бүртгэлтэй байна.');
                    }
                }
                if(editFamily.phone1){
                    if((empSingle.user && empSingle.user.phone === editFamily.phone1) || (empSingle.phoneFromComp === editFamily.phone1)){
                        return msg('error', '2 дахь утасны дугаар бүртгэлтэй байна.');
                    }
                    if(
                        empSingle.user &&
                        empSingle.user.family &&
                        empSingle.user.family.familyMembers &&
                        empSingle.user.family.familyMembers.length>0 &&
                        empSingle.user.family.familyMembers.some(r => ((r._id || 'a').toString() !== (editFamily._id || 'dd').toString() && ((r.phone && r.phone === editFamily.phone1) || (r.phone1 && r.phone1 === editFamily.phone1) || (r.phone2 && r.phone2 === editFamily.phone1))) )
                    ){
                        return msg('error', '2 дахь утасны дугаар гэр бүлийн гишүүн дээр бүртгэлтэй байна.');
                    }
                }
                if(editFamily.phone2){
                    if((empSingle.user && empSingle.user.phone === editFamily.phone2) || (empSingle.phoneFromComp === editFamily.phone2)){
                        return msg('error', '3 дахь утасны дугаар бүртгэлтэй байна.');
                    }
                    if(
                        empSingle.user &&
                        empSingle.user.family &&
                        empSingle.user.family.familyMembers &&
                        empSingle.user.family.familyMembers.length>0 &&
                        empSingle.user.family.familyMembers.some(r => ((r._id || 'a').toString() !== (editFamily._id || 'dd').toString() && ((r.phone && r.phone === editFamily.phone2) || (r.phone1 && r.phone1 === editFamily.phone2) || (r.phone2 && r.phone2 === editFamily.phone2))) )
                    ){
                        return msg('error', '3 дахь утасны дугаар гэр бүлийн гишүүн дээр бүртгэлтэй байна.');
                    }
                }
                if(
                    (editFamily.phone && editFamily.phone1 && editFamily.phone === editFamily.phone1)
                    ||
                    (editFamily.phone && editFamily.phone2 && editFamily.phone === editFamily.phone2)
                    ||
                    (editFamily.phone1 && editFamily.phone2 && editFamily.phone1 === editFamily.phone2)
                ){
                    return msg('error', 'Оруулсан дугаарууд давхцаж байна.');
                }
                this.props.dispatch(insertEmpFamily({...editFamily, emp: empSingle._id}));
            }
        }
    }
    insertProfInfo(record, action){
        //editEmpProfession
        const {employee: {empSingle = {}, editProf = {}}} = this.props
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        let values = Object.values(editProf);
        if(action === 'delete') {
            this.props.dispatch(insertEmpProfession({...record, emp: empSingle._id, action: action}))
        }
        if(values.some((c) => string(c) !== '')){
            if (!editProf.name || editProf === '') {
                return msg('error', 'Сургуулийн нэр оруулна уу.');
            } else if (!editProf.type || editProf.type === '') {
                return msg('error', 'Боловсролын зэрэг сонгоно уу.')
            }
            // else if (!editProf.mergejil || editProf.mergejil === '') {
            //     return msg('error', 'Мэргэжил оруулна уу.')
            // }
            else if(editProf.enrolledDate && !isValidDate(editProf.enrolledDate)){
                return msg('error', 'Элссэн он шалгана уу.');
            } else if(editProf.graduatedDate && !isValidDate(editProf.graduatedDate)) {
                return msg('error', 'Төгссөн он шалгана уу.');
            } else if(editProf.gpa && editProf.gpa === '') {
                return msg('error', 'Голч дүн оруулна уу.')
            } else {
                this.props.dispatch(insertEmpProfession({...editProf, emp: empSingle._id}));
            }
        }
    }
    insertQualifInfo(record, action){
        const {employee: {empSingle = {}, editQtraining = {}}} = this.props;
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        let values = Object.values(editQtraining);
        if(action === 'delete') {
            this.props.dispatch(insertEmpQtraining({...record, emp: empSingle._id, action: action}))
        }
        if(values.some((c) => string(c) !== '')){
            if (!editQtraining.name || editQtraining.name === '') {
                return msg('error', 'Сургалт, дамжааны нэр оруулна уу.')
            } else if (!editQtraining.chiglel || editQtraining.chiglel === '') {
                return msg('error', 'Чиглэл оруулна уу.')
            } else if(editQtraining.start_date && !isValidDate(editQtraining.start_date)){
                return msg('error', 'Элссэн огноо шалгана уу.');
            } else if(editQtraining.end_date && !isValidDate(editQtraining.end_date)){
                return msg('error', 'Төгссөн огноо шалгана уу.');
            } else if(editQtraining.gerchilgee_date && !isValidDate(editQtraining.gerchilgee_date)){
                return msg('error', 'Гэрчилгээ олгосон огноо шалгана уу.');
            } else {
                this.props.dispatch(insertEmpQtraining({...editQtraining, emp: empSingle._id}));
            }
        }
        //insertEmpQtraining
    }
    insertExpInfo(record, action){
        const { employee: {empSingle = {}, editExperience = {}} } = this.props;
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        let values = Object.values(editExperience);
        if(action === 'delete') {
            this.props.dispatch(insertEmpExperience({...record, emp: empSingle._id, action: action}))
        }
        if(values.some((c) => string(c) !== '')){
            if (!editExperience.name || editExperience.name === '') {
                return msg('error', 'Байгууллагын нэр оруулна уу.')
            } else if (!editExperience.position || editExperience.position === '') {
                return msg('error', 'Албан тушаал оруулна уу.')
            } else if(editExperience.workFrom && !isValidDate(editExperience.workFrom)){
                return msg('error', 'Ажилд орсон он шалгана уу.');
            } else if(editExperience.workUntil && !isValidDate(editExperience.workUntil)){
                return msg('error', 'Ажлаас гарсан он шалгана уу.');
            } else {
                this.props.dispatch(insertEmpExperience({...editExperience, emp: empSingle._id}));
            }
        }
    }
    insertSkillInfo(record, action){
        const { employee: {empSingle = {}, editSkill = {}} } = this.props;
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        let values = Object.values(editSkill);
        if(action === 'delete') {
            this.props.dispatch(insertEmpSkill({...record, emp: empSingle._id, action: action}))
        }
        if(values.some((c) => string(c) !== '')){
            if(editSkill.name && !string(editSkill.name)){
                return msg('error', 'Ур чадварын нэр шалгана уу.');
            } else if(editSkill.level && !string(editSkill.level)){
                return msg('error', 'Ур чадварын түвшин шалгана уу.');
            } else {
                this.props.dispatch(insertEmpSkill({...editSkill, emp: empSingle._id}));
            }
        }
    }
    insertRewardInfo(record, action){
        const { employee: {empSingle = {}, editReward = {}} } = this.props;
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        let values = Object.values(editReward);
        if(action === 'delete') {
            this.props.dispatch(insertEmpReward({...record, emp: empSingle._id, action: action}))
        }
        if(values.some((c) => string(c) !== '')){
            if(editReward.name && !string(editReward.name)){
                return msg('error', 'Шагналын нэр шалгана уу.')
            } else if(editReward.date && !isValidDate(editReward.date)){
                return msg('error', '')
            } else if(editReward.company_name && !string(editReward.company_name)){
                return msg('error', 'Шагнал олгосон байгууллагын нэр шалгана уу.')
            } else {
                this.props.dispatch(insertEmpReward({...editReward, emp: empSingle._id}))
            }
        }
    }
    onValChange(obj, emp = false){
        const {employee: {empSingle}} = this.props;
        let val = Object.values(obj)[0];
        let key = Object.keys(obj)[0];
        let data = {
            ...empSingle,
            ...(emp ? obj : {}),
            user: {
                ...empSingle.user,
                ...(!emp ? obj : {}),
            }
        };
        if(val === ''){
            if((empSingle[key] === undefined || empSingle[key] === null) && data[key] === ''){
                delete data[key];
            } else if((empSingle.user[key] === undefined || empSingle.user[key] === null) && data.user[key] === ''){
                delete data.user[key];
            }
        } else if(typeof val === 'object'){
            let key1 = Object.keys(val)[0];
            if(((empSingle.user[key] || {})[key1] === undefined || (empSingle.user[key] || {})[key1] === null) && data.user[key][key1] === ''){
                delete data.user[key][key1];
                let key2 = Object.keys(data.user[key]);
                if(key2.length === 0){
                    delete data.user[key]
                }
            }
            this.setState({
                address: data.user[key]
            });
        }
        let needUpdate = (JSON.stringify(data) !== JSON.stringify(empSingle));
        if(needUpdate !== this.state.needMainInfoUpdate){
            this.setState({needMainInfoUpdate: needUpdate})
        }
    }
    startEditMain(vals, editing) {
        const {employee: {empSingle}} = this.props;
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        this.props.dispatch(startEditMain({...vals, editing}))
    }
    stopEditMain(stopping) {
        this.props.dispatch(stopEditMain({stopping}))
    }
    addNewInfoHandler(adding) {
        const {employee: {empSingle}} = this.props;
        if(empSingle.status !== 'active'){
            return config.get('emitter').emit('warning', 'Идэвхгүй хэрэглэгчийн мэдээллийг солих боломжгүй');
        }
        this.props.dispatch(addNewInfoHandler({adding}))
    }
    onChangeHandler(changing, e, name) {
        const {dispatch} = this.props
        if(name === 'hen_boloh' || name === 'type' || name === 'name' || name === 'level') {
            dispatch(onMainChangeHandler({changing: changing, name: name, value: e.value}));
        } else if (
            name === 'enrolledDate' ||
            name === 'graduatedDate' ||
            name === 'start_date' ||
            name === 'end_date' ||
            name === 'gerchilgee_date' ||
            name === 'workFrom' ||
            name === 'workUntil' ||
            name === 'birthday' ||
            name === 'percent' ||
            name === 'date' ||
            name === 'gpa'
        ) {
            dispatch(onMainChangeHandler({changing: changing, name: name, value: e}));
        } else {
            dispatch(onMainChangeHandler({changing: changing, name:e.target.name, value: e.target.value}));
        }
    }
    disabledStartDate(date, current){
        const {
            employee: {
                editProf,
                editQtraining,
                editExperience
            }
        } = this.props
        switch(date) {
            case 'prof':
                if(!editProf.graduatedDate) {
                    return false
                }
                return current > moment(editProf.graduatedDate)
            case 'Qtraining':
                if(!current || !editQtraining.end_date) {
                    return false
                }
                return current > moment(editQtraining.end_date)
            case 'experience':
                if(!current || !editExperience.workUntil) {
                    return false
                }
                return current > moment(editExperience.workUntil)
            default: return false
        }
    }
    disabledEndDate(date, current){
        const {
            employee: {
                editProf = {},
                editQtraining = {},
                editExperience = {}
            }
        } = this.props
        switch(date) {
            case 'prof':
                if(!current || !editProf.enrolledDate) {
                    return false
                }
                return current < moment(editProf.enrolledDate)
            case 'Qtraining':
                if(!current || !editQtraining.start_date) {
                    return false
                }
                return current < moment(editQtraining.start_date)
            case 'experience':
                if(!current || !editExperience.workFrom) {
                    return false
                }
                return current < moment(editExperience.workFrom)
            default: return false
        }
    }
    // async beforeUploadAvatar(file, before = true){
    //     let wh = await picSize(file)
    //     const {maxWidth, maxHeight, aspectRatio} = config.get('avatarPX')
    //     if(maxWidth < wh.width || maxHeight < wh.height) {
    //         if(before)
    //             config.get('emitter').emit('error', 'Зургийн хэмжээ хамгийн ихдээ байхыг анхаарна уу')
    //         return false
    //     } else {
    //         return true
    //     }
    // }
    // uploadAvatar(file){
    //     this.beforeUploadAvatar(file.file, false).then((e) => e ? this.props.dispatch(uploadAvatar(file.file)) : false)
    // }


    openMediaLib(mediaType, forWhat){
        this.setState({mediaType, forWhat:forWhat})
    }
    chooseMedia(data, type){
        if(this.state.forWhat === 'avatar'){
            this.props.dispatch(changeAvatar({image:data[0]}));
        }
    }
    render(){
        const {
            dispatch,
            employee: {
                empSingle = {},
                updatingEmpMain,
                settingMarried,
                insertingFamily,
                insertingProf,
                insertingQtraining,
                settingProfType,
                insertingExp,
                insertingSkill,
                settingMilitary,
                editingFamily,
                visibleFamily,
                editFamily,
                visibleProf,
                editProf,
                editingProf,
                editQtraining,
                editingQtraining,
                visibleQtraining,
                editingExperience,
                visibleExperience,
                editExperience,
                editingSkill,
                visibleSkill,
                editSkill,
                editingMain,
                editReward,
                editingReward,
                visibleReward,
                insertingReward,
                workerInfo,
            },
            main:{
                employee,
                avatarLoading,
                domain
            }
        } = this.props;
        const regions = ['Улаанбаатар', 'Архангай', 'Баян-Өлгий', 'Баянхонгор', 'Булган', 'Говь-Алтай', 'Говьсүмбэр', 'Дархан-Уул', 'Дорноговь', 'Дорнод', 'Дундговь', 'Завхан', 'Орхон', 'Өвөрхангай', 'Өмнөговь', 'Сүхбаатар', 'Сэлэнгэ', 'Төв', 'Увс', 'Ховд', 'Хөвсгөл', 'Хэнтий'];
        const skills = ["Стресс удирдах чадвар", "Асуудлыг бүтээлчээр шийдвэрлэх", "Баг бүрдүүлэх", "Мэдлэг мэдээллээ бусадтай хуваалцах", "Бусдад урам хайрлах", "Бусдыг халамжлах", "Бусдыг сонсох", "Эрх мэдлээ шилжүүлэх", "Бусдад нөлөөлөх", "Сөргөлдөх явдлыг арилгах", "Өөрийгөө хөгжүүлэх", "Үүрэг хүлээх", "Хариуцлага хүлээх", "Зорилгод тууштай байх"]
        let singleUser = empSingle.user || {};
        // let hadAction = hasAction(['create_employee', 'edit_employee'], employee, (empSingle._id || '').toString());
        let hadAction = hasAction(['create_employee', 'edit_employee'], employee, this.props.paramsId);
        let avatar = '/images/default-avatar.png';
        if (empSingle && empSingle.user && empSingle.user.avatar && empSingle.user.avatar.path !== '') {
            avatar = `${config.get('hostMedia')}${empSingle.user.avatar.path}`;
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
        function printBloodType(bloodType){
            switch(bloodType){
                case 'o+': return locale("employee_single.blood_types.o+");
                case 'a+': return locale("employee_single.blood_types.a+");
                case 'b+': return locale("employee_single.blood_types.b+");
                case 'ab+': return locale("employee_single.blood_types.ab+");
                case 'o-': return locale("employee_single.blood_types.o-");
                case 'a-': return locale("employee_single.blood_types.a-");
                case 'b-': return locale("employee_single.blood_types.b-");
                case 'ab-': return locale("employee_single.blood_types.ab-");
                default: return '';
            }
        }
        
        return (
            <Row justify="center" align="center" style={{width: '100%'}} className={'emp-anket'}>
                <Col span={20}>

                    <Form
                        size={'small'}
                        layout="vertical"
                        onFinish={this.updateMainInfo.bind(this)}
                    >
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <span style={{fontSize: 24, flex: 1, display: 'block'}}>
                                {(empSingle.user || {}).last_name} {(empSingle.user || {}).first_name}
                                <p style={{fontSize: 16, color: '#8c8b8b'}}>
                                    {
                                        (empSingle.user || {}).bio || ''
                                    }
                                </p>
                            </span>
                            <span style={{fontSize: 16, textAlign: 'right', flex: 1}}>
                                {empSingle.emailFromComp || (empSingle.user || {}).email || ''}
                                <p style={{fontSize: 16}}>
                                    {empSingle.phoneFromComp || (empSingle.user || {}).phone ? `+976${(empSingle.phoneFromComp || (empSingle.user || {}).phone || '').insideText(3, 0, '-')}` : null}
                                </p>
                            </span>
                        </div>
                        <div style={{margin: '10px auto 30px'}}>
                            <Divider orientation="left" plain>
                                <b style={{fontSize: 16}}>{locale("employee_single.main_info")}</b>
                            </Divider>
                        </div>
                        <div className={'main-info'} style={{marginBottom: 20, paddingTop: 10}}>
                            {/*{((empSingle || {}).avatar || {}).path ?*/}

                            <div className='merchant-avatar'>
                                <img
                                    style={{
                                        // objectFit:'cover',
                                        // width:100,
                                        height:120,
                                        // marginRight:30
                                    }}
                                    src={avatar}
                                />

                                {empSingle && empSingle._id && employee && employee._id && empSingle._id.toString() === employee._id.toString()?
                                    <div className='merchant-avatar-edit-icon'
                                         onClick={avatarLoading ? null : this.openMediaLib.bind(this, 'image', 'avatar')}
                                    >
                                        <CameraFilled />
                                    </div>
                                    :
                                    null
                                }
                            </div>
                            {/*:*/}
                            {/*<img className={'tseej_zurag'} src={"/images/default-avatar.png"}/>*/}
                            {/*}*/}
                            {editingMain ?
                                <div className={'info_inps'}>
                                    <Row>
                                        <Col span={12} style={{paddingRight: 12.5}}>
                                            <Form.Item
                                                label={locale("common_employee.last_name")}
                                                name={['main', 'last_name']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: locale("employee_single.error.last_name.insert")
                                                    }
                                                ]}
                                                initialValue={(empSingle.user || {}).last_name}
                                            >
                                                <Input className="editingInput"  onChange={(e) => this.onValChange({last_name: e.target.value})} disabled={!hadAction || !editingMain}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} style={{paddingLeft: 12.5}}>
                                            <Form.Item
                                                label={locale("common_employee.first_name")}
                                                name={['main', 'first_name']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: locale("employee_single.error.first_name.insert")
                                                    }
                                                ]}
                                                initialValue={(empSingle.user || {}).first_name}
                                            >
                                                <Input className="editingInput"  onChange={(e) => this.onValChange({first_name: e.target.value})} disabled={!hadAction || !editingMain}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} style={{paddingRight: 12.5}}>
                                            <Form.Item
                                                label={locale("common_employee.username")}
                                                name={['main', 'username']}
                                                initialValue={(empSingle.user || {}).username}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: locale("employee_single.error.user_name.insert"),
                                                    },
                                                    {
                                                        pattern: new RegExp(/^[a-zA-Z0-9._]{4,12}/g),
                                                        message: locale("employee_single.error.user_name.error")
                                                    }
                                                ]}
                                            >
                                                <Input className="editingInput"  onChange={(e) => this.onValChange({username: e.target.value})} disabled={!hadAction || !editingMain}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} style={{paddingLeft: 12.5}}>
                                            <Form.Item
                                                label={locale("common_employee.password")}
                                                name={['main', 'password']}
                                            >
                                                <Input.Password className="editingInput"  onChange={(e) => this.onValChange({password: e.target.value})} disabled={!hadAction || !editingMain}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            :
                                <div className={'info_inps'}>
                                    <Row>
                                        <Col span={12} style={{paddingRight: 12.5}}>
                                            <Form.Item>
                                                <span className="anketTitle">{locale("common_employee.last_name")} </span>
                                                <div className="anketInfo">
                                                    {(empSingle.user || {}).last_name}
                                                </div>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} style={{paddingLeft: 12.5}}>
                                            <Form.Item>
                                                <span className="anketTitle">{locale("common_employee.first_name")} </span>
                                                <div className="anketInfo">
                                                    {(empSingle.user || {}).first_name}
                                                </div>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} style={{paddingRight: 12.5}}>
                                            <Form.Item>
                                                <span className="anketTitle">{locale("common_employee.username")} </span>
                                                <div className="anketInfo">
                                                    {(empSingle.user || {}).username}
                                                </div>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} style={{paddingLeft: 12.5}}>
                                            <Form.Item>
                                                <div className="anketTitle">{locale("common_employee.password")}</div>
                                                <div className="anketInfo"></div>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            }       
                        </div>
                    
                        {
                            editingMain ?
                            <div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.register_id")}
                                                    name={['main', 'register_id']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.error.register_id.insert")
                                                        }
                                                    ]}
                                                    initialValue={(empSingle.user || {}).register_id}
                                                >
                                                    <Input className="editingInput" onChange={(e) => this.onValChange({register_id: e.target.value})} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.gender")}
                                                    name={['main', 'gender']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.error.gender.insert")
                                                        }
                                                    ]}
                                                    initialValue={(empSingle.user || {}).gender}
                                                    disabled={!hadAction || (empSingle.user || {}).gender}
                                                >
                                                    {/*<Select  defaultValue={(empSingle.user || {}).gender} nostyle disabled={!hadAction || !editingMain} onChange={e => this.onValChange({gender: e})}>*/}
                                                    <Select
                                                        // nostyle={true}
                                                        disabled={!hadAction || !editingMain} onChange={e => this.onValChange({gender: e})}
                                                    >
                                                        <Option key={'male'} value={'male'}>{locale("common_employee_single.male")}</Option>
                                                        <Option key={'female'} value={'female'}>{locale("common_employee_single.female")}</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.family_name")}
                                                    name={['main', 'family_name']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.error.family_name")
                                                        }
                                                    ]}
                                                    initialValue={(empSingle.user || {}).family_name}
                                                >
                                                    <Input className="editingInput" onChange={(e) => this.onValChange({family_name: e.target.value})} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.ys_undes")}
                                                    name={['main', 'nationality']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.error.ys_undes")
                                                        }
                                                    ]}
                                                    initialValue={(empSingle.user || {}).nationality}
                                                >
                                                    <Input className="editingInput"  onChange={(e) => this.onValChange({nationality: e.target.value})} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.birthday")}
                                                    name={['main', 'birthday']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.error.birthday.insert")
                                                        }
                                                    ]}
                                                    initialValue={(empSingle.user || {}).birthday ? moment(moment((empSingle.user || {}).birthday).format('YYYY-MM-DD')) : null}
                                                >
                                                    <DatePicker className="editingInput" onChange={(e, date) => this.onValChange({birthday: date})} disabled={!hadAction || !editingMain} style={{width: '100%'}}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.birth_place")}
                                                    name={['main', 'birth_place']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.error.birth_place.insert")
                                                        }
                                                    ]}
                                                    initialValue={(empSingle.user || {}).birth_place}
                                                >
                                                    <Input className="editingInput"  onChange={(e) => this.onValChange({birth_place: e.target.value})} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("common_employee.email")}
                                                    name={['main', 'email']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.error.email.insert")

                                                        },
                                                        {
                                                            pattern: new RegExp(/^\S+@\S+\.\S+$/),
                                                            message: locale("employee_single.error.email.error")
                                                        }
                                                    ]}
                                                    initialValue={(empSingle.user || {}).email}
                                                >
                                                    <Input className="editingInput" onChange={(e) => this.onValChange({email: e.target.value})} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item
                                                    label={locale("common_employee.phone")}
                                                    name={['main', 'phone']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.error.phone.insert")
                                                        }
                                                    ]}
                                                    initialValue={(empSingle.user || {}).phone}
                                                    disabled={!hadAction || (empSingle.user || {}).phone}
                                                >
                                                    <Input className="editingInput" onChange={(e) => this.onValChange({phone: e.target.value})} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.hasChild")}
                                                    name={['main', 'hasChild']}
                                                    initialValue={(empSingle.user || {}).hasChild}
                                                >
                                                    <Switch  onChange={(e) => {this.setState({checked: e}); this.onValChange({hasChild: e})}} checked={this.state.checked} disabled={!hadAction || !editingMain} checkedChildren={locale("employee_single.child")} unCheckedChildren={locale("employee_single.noChild")}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.childNum")}
                                                    name={['main', 'children']}
                                                    initialValue={(empSingle.user || {}).children}
                                                    disabled={!hadAction}
                                                >
                                                    <Input className="editingInput" onChange={(e) => this.onValChange({children: e.target.value})} disabled={!hadAction || !this.state.checked || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.blood_type")}
                                                    name={['main', 'bloodType']}
                                                    initialValue={(empSingle.user || {}).bloodType}
                                                    disabled={!hadAction || (empSingle.user || {}).bloodType}
                                                >
                                                    {/*<Select className="selectInput" defaultValue={(empSingle.user || {}).bloodType} nostyle disabled={!hadAction || !editingMain} onChange={e => this.onValChange({bloodType: e})}>*/}
                                                    <Select className="selectInput"
                                                            // nostyle={true}
                                                            disabled={!hadAction || !editingMain} onChange={e => this.onValChange({bloodType: e})}
                                                    > 
                                                                <Option key={'o+'} value={'o+'}> {locale("employee_single.blood_types.o+")}</Option>
                                                                <Option key={'a+'} value={'a+'}>{locale("employee_single.blood_types.a+")}</Option>
                                                                <Option key={'b+'} value={'b+'}>{locale("employee_single.blood_types.b+")}</Option>
                                                                <Option key={'ab+'} value={'ab+'}>{locale("employee_single.blood_types.ab+")}</Option>
                                                                <Option key={'o-'} value={'o-'}>{locale("employee_single.blood_types.o-")}</Option>
                                                                <Option key={'a-'} value={'a-'}>{locale("employee_single.blood_types.a-")}</Option>
                                                                <Option key={'b-'} value={'b-'}>{locale("employee_single.blood_types.b-")}</Option>
                                                                <Option key={'ab-'} value={'ab-'}>{locale("employee_single.blood_types.ab-")}</Option>
                                                                
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.driving_type")}
                                                    name={['main', 'drivingLicense']}
                                                    initialValue={(empSingle.user || {}).drivingLicense}
                                                    disabled={!hadAction}
                                                >
                                                    <Select className="selectInput"
                                                        mode='multiple'
                                                        allowClear
                                                            // nostyle={true}
                                                        // defaultValue={(empSingle.user || {}).drivingLicense}
                                                        disabled = {!hadAction || !editingMain}
                                                        onChange={e => this.onValChange({drivingLicense: e})}
                                                    > 
                                                        <Option key={'a'} value={'a'}>A</Option>
                                                        <Option key={'b'} value={'b'}>B</Option>
                                                        <Option key={'c'} value={'c'}>C</Option>
                                                        <Option key={'d'} value={'d'}>D</Option>
                                                        <Option key={'e'} value={'e'}>E</Option>
                                                        <Option key={'m'} value={'m'}>M</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.workEmail")}
                                                    name={['main', 'emailFromComp']}
                                                    rules={[
                                                        {
                                                            pattern: new RegExp(/^\S+@\S+\.\S+$/),
                                                            message: locale("employee_single.error.email.error")
                                                        }
                                                    ]}
                                                    initialValue={empSingle.emailFromComp}
                                                    disabled={!hadAction}
                                                >
                                                    <Input className="editingInput" onChange={(e) => this.onValChange({emailFromComp: e.target.value}, true)} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.workPhone")}
                                                    name={['main', 'phoneFromComp']}
                                                    initialValue={empSingle.phoneFromComp}
                                                    disabled={!hadAction}
                                                >
                                                    <Input className="editingInput" onChange={(e) => this.onValChange({phoneFromComp: e.target.value}, true)} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("common_employee.started_working_date")}
                                                    name={['main', 'workFrom']}
                                                    initialValue={(empSingle || {}).workFrom ? moment(moment((empSingle || {}).workFrom).format('YYYY-MM-DD')) : null}
                                                    disabled={!hadAction}
                                                >
                                                    <DatePicker className="editingInput" onChange={(e, date) => this.onValChange({workFrom: date}, true)} disabled={!hadAction || !editingMain} style={{width: '100%'}}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                {/*<Form.Item*/}
                                                {/*    label="Албан тушаал"*/}
                                                {/*    name={['main', 'position_name']}*/}
                                                {/*    initialValue={empSingle.position_name}*/}
                                                {/*    disabled={!hadAction}*/}
                                                {/*>*/}
                                                {/*    <Input className="editingInput" onChange={(e) => this.onValChange({position_name: e.target.value}, true)} disabled={!hadAction || !editingMain}/>*/}
                                                {/*</Form.Item>*/}
                                                <Form.Item
                                                    label="Цалин авах данс"
                                                >
                                                    <Input.Group compact>
                                                        <Form.Item
                                                            style={{width: '50%'}}
                                                            name={['main', 'bank.name']}
                                                            initialValue={((empSingle || {}).bank || {}).name}
                                                            disabled={!hadAction}
                                                        >
                                                            
                                                            {
                                                                domain.toLowerCase() === "tapsir.com" || this.props.main.domain.toLowerCase() === "tapsir.mn" ?
                                                                null
                                                                :
                                                                <Select
                                                                    style={{width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                                                                    onSelect={() => this.onValChange({bank: 'bank.name'}, true)}
                                                                >
                                                                    <Option key={'khaan'} value={'khaan'}>Хаан банк</Option>
                                                                    <Option key={'golomt'} value={'golomt'}>Голомт банк</Option>
                                                                    <Option key={'khas'} value={'khas'}>Хас банк</Option>
                                                                    <Option key={'khkh'} value={'khkh'}>Худалдаа хөгжилийн банк</Option>
                                                                    <Option key={'bogd'} value={'bogd'}>Богд банк</Option>
                                                                    <Option key={'turiin'} value={'turiin'}>Төрийн банк</Option>
                                                                    <Option key={'arig'} value={'arig'}>Ариг банк</Option>
                                                                    <Option key={'credit'} value={'credit'}>Кредит банк</Option>
                                                                    <Option key={'capitron'} value={'capitron'}>Капитрон банк</Option>
                                                                    <Option key={'undesnii_hurungu'} value={'undesnii_hurungu'}>Үндэсний хөрөнгө оруулалтын банк</Option>
                                                                    <Option key={'ariljaa'} value={'ariljaa'}>Арилжааны банк</Option>
                                                                    <Option key={'teever_hugjil'} value={'teever_hugjil'}>Тээвэр хөгжлийн банк</Option>
                                                                </Select>
                                                            }
                                                        </Form.Item>
                                                        <Form.Item
                                                            style={{width: '50%'}}
                                                            name={['main', 'bank.account']}
                                                            initialValue={((empSingle || {}).bank || {}).account}
                                                            disabled={!hadAction}
                                                        >
                                                            <Input
                                                                className="editingInput"
                                                                style={{width: '100%', borderRadius: 10, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                                                                onPressEnter={(e) => {e.preventDefault()}}
                                                                onChange={(e) => this.onValChange({bank: 'bank.account'}, true)}
                                                                disabled={!hadAction || !editingMain}
                                                            />
                                                        </Form.Item>
                                                    </Input.Group>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item
                                                    label={locale("employee_single.cardNum")}
                                                    name={['main', 'cardId']}
                                                    initialValue={(empSingle || {}).cardId}
                                                    disabled={!hadAction}
                                                >
                                                    <Input className="editingInput" onPressEnter={(e) => {e.preventDefault()}} onChange={(e) => this.onValChange({cardId: e.target.value}, true)} disabled={!hadAction || !editingMain}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                {/*<Form.Item*/}
                                                {/*    label="Цалин авах данс"*/}
                                                {/*>*/}
                                                {/*    <Input.Group compact>*/}
                                                {/*        <Form.Item*/}
                                                {/*            style={{width: '50%'}}*/}
                                                {/*            name={['main', 'bank.name']}*/}
                                                {/*            initialValue={((empSingle || {}).bank || {}).name}*/}
                                                {/*            disabled={!hadAction}*/}
                                                {/*        >*/}
                                                {/*            <Select*/}
                                                {/*                style={{width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0}}*/}
                                                {/*                onSelect={() => this.onValChange({bank: 'bank.name'}, true)}*/}
                                                {/*            >*/}
                                                {/*                <Option key={'khaan'} value={'khaan'}>Хаан банк</Option>*/}
                                                {/*                <Option key={'golomt'} value={'golomt'}>Голомт банк</Option>*/}
                                                {/*                <Option key={'khas'} value={'khas'}>Хас банк</Option>*/}
                                                {/*                <Option key={'khkh'} value={'khkh'}>Худалдаа хөгжилийн банк</Option>*/}
                                                {/*                <Option key={'bogd'} value={'bogd'}>Богд банк</Option>*/}
                                                {/*                <Option key={'turiin'} value={'turiin'}>Төрийн банк</Option>*/}
                                                {/*                <Option key={'arig'} value={'arig'}>Ариг банк</Option>*/}
                                                {/*                <Option key={'credit'} value={'credit'}>Кредит банк</Option>*/}
                                                {/*                <Option key={'capitron'} value={'capitron'}>Капитрон банк</Option>*/}
                                                {/*                <Option key={'undesnii_hurungu'} value={'undesnii_hurungu'}>Үндэсний хөрөнгө оруулалтын банк</Option>*/}
                                                {/*                <Option key={'ariljaa'} value={'ariljaa'}>Арилжааны банк</Option>*/}
                                                {/*                <Option key={'teever_hugjil'} value={'teever_hugjil'}>Тээвэр хөгжлийн банк</Option>*/}
                                                {/*            </Select>*/}
                                                {/*        </Form.Item>*/}
                                                {/*        <Form.Item*/}
                                                {/*            style={{width: '50%'}}*/}
                                                {/*            name={['main', 'bank.account']}*/}
                                                {/*            initialValue={((empSingle || {}).bank || {}).account}*/}
                                                {/*            disabled={!hadAction}*/}
                                                {/*        >*/}
                                                {/*            <Input*/}
                                                {/*                className="editingInput"*/}
                                                {/*                style={{width: '100%', borderRadius: 10, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}*/}
                                                {/*                onPressEnter={(e) => {e.preventDefault()}}*/}
                                                {/*                onChange={(e) => this.onValChange({bank: 'bank.account'}, true)}*/}
                                                {/*                disabled={!hadAction || !editingMain}*/}
                                                {/*            />*/}
                                                {/*        </Form.Item>*/}
                                                {/*    </Input.Group>*/}
                                                {/*</Form.Item>*/}
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <Col>
                                    <div className={'lalar'}>
                                    <Form.Item
                                        label={locale("employee_single.address")}
                                    >
                                        <Input.Group compact>
                                            <Form.Item
                                                name={['main', 'address', 'region']}
                                                style={{width: '20%'}}
                                                // nostyle={true}
                                                initialValue={(singleUser.address || {}).region || ''}
                                            >
                                                <Select onChange={(e) => this.onValChange({address: {...singleUser.address, ...this.state.address, region: e}})} disabled={!hadAction || !editingMain} placeholder={locale("employee_single.aimag")} style={{ width: '100%'}}>
                                                    {
                                                        regions.map((r) => <Option key={r} value={r}>{r}</Option>)
                                                    }
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name={['main', 'address', 'district']}
                                                style={{width: '20%'}}
                                                // nostyle={true}
                                                initialValue={(singleUser.address || {}).district || ''}
                                                disabled={!hadAction}
                                            >
                                                <Input className="editingInput" onChange={(e) => this.onValChange({address: {...singleUser.address, ...this.state.address, district: e.target.value}})} disabled={!hadAction || !editingMain} style={{ width: '100%', borderRadius: 3 }} placeholder={locale("employee_single.duureg")} />
                                            </Form.Item>
                                            <Form.Item
                                                name={['main', 'address', 'horoo']}
                                                style={{width: '20%'}}
                                                // noStyle
                                                initialValue={(singleUser.address || {}).horoo || ''}
                                                disabled={!hadAction}
                                            >
                                                <Input className="editingInput" onChange={(e) => this.onValChange({address: {...singleUser.address, ...this.state.address, horoo: e.target.value}})} disabled={!hadAction || !editingMain} style={{ width: '100%', borderRadius: 3 }} placeholder={locale("employee_single.horoo")} />
                                            </Form.Item>
                                            <Form.Item
                                                name={['main', 'address', 'street']}
                                                style={{width: '20%'}}
                                                // nostyle={true}
                                                initialValue={(singleUser.address || {}).street || ''}
                                                disabled={!hadAction}
                                            >
                                                <Input className="editingInput" onChange={(e) => this.onValChange({address: {...singleUser.address, ...this.state.address, street: e.target.value}})} disabled={!hadAction || !editingMain} style={{ width: '100%', borderRadius: 3 }} placeholder={locale("employee_single.bair")} />
                                            </Form.Item>
                                            <Form.Item
                                                name={['main', 'address', 'streetNum']}
                                                style={{width: '20%'}}
                                                // nostyle={true}
                                                initialValue={(singleUser.address || {}).streetNum || ''}
                                                disabled={!hadAction}
                                            >
                                                <Input className="editingInput" onChange={(e) => this.onValChange({address: {...singleUser.address, ...this.state.address, streetNum: e.target.value}})} disabled={!hadAction || !editingMain} style={{ width: '100%', borderRadius: 3 }} placeholder="Тоот" />
                                            </Form.Item>
                                        </Input.Group>
                                    </Form.Item>
                                </div>
                                </Col>
                                <Col span={editingMain && hadAction ? 24 : 0} style={{ textAlign: 'right' }}>
                                    <Button
                                        loading={updatingEmpMain}
                                        visible={editingMain}
                                        disabled={!hadAction || updatingEmpMain || !editingMain}
                                        style={{marginRight: '12.5px'}}
                                        onClick={this.stopEditMain.bind(this, 'main')}
                                        >
                                        {locale("employee_single.cancel")}
                                    </Button>
                                    <Button
                                        htmlType="submit"
                                        type={'primary'}
                                        loading={updatingEmpMain}
                                        visible={editingMain}
                                        disabled={!this.state.needMainInfoUpdate || !hadAction || updatingEmpMain || !editingMain || empSingle.status !== 'active'}
                                    >
                                       {locale("employee_single.save")}
                                    </Button> 
                                </Col>
                                
                            </div>
                            :
                            <div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.register_id")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle.user || {}).register_id}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item initialValue={(empSingle.user || {}).gender ? (empSingle.user || {}).gender === 'male' ? locale("employee_single.male") : locale("employee_single.female")  : ''}>                                                
                                                    <div className="anketTitle">{locale("employee_single.gender")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle.user || {}).gender ? (empSingle.user || {}).gender === 'male' ? locale("employee_single.male") : locale("employee_single.female") : ''} 
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.family_name")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle.user || {}).family_name}
                                                    </div>
                                                    
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item>
                                                    
                                                    <div className="anketTitle">{locale("employee_single.ys_undes")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle.user || {}).nationality}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.birthday")}</div>
                                                    <div className="anketInfo">
                                                     {(empSingle.user || {}).birthday ? moment((empSingle.user || {}).birthday).format('YYYY-MM-DD') : null} 
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item>
                                                    
                                                    <div className="anketTitle">{locale("employee_single.birth_place")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle.user || {}).birth_place}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("common_employee.email")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle.user || {}).email}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("common_employee.phone")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle.user || {}).phone}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.hasChild")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle.user || {}).hasChild ? locale("employee_single.child"): locale("employee_single.noChild")}
                                                    </div>
                                                    
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item>
                                                    
                                                    <div className="anketTitle">{locale("employee_single.childNum")}</div>
                                                    <div className="anketInfo">
                                                    
                                                       {(empSingle.user || {}).hasChild ? `${(empSingle.user || {}).children+locale("employee_single.child")}`  : '' }
                                                     
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    
                                                        <div className="anketTitle">{locale("employee_single.blood_type")}</div>
                                                        <div className="anketInfo">
                                                            {(empSingle.user || {}).bloodType ? printBloodType((empSingle.user || {}).bloodType) : ''}
                                                        </div>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item>
                                                        <div className="anketTitle">{locale("employee_single.driving_type")}</div>
                                                        <div className="anketInfo">
                                                            {(empSingle.user || {}).drivingLicense ? (empSingle.user || {}).drivingLicense.map(c => (<span className="driverLicense">{c.toUpperCase()}</span>)) : ''}
                                                        </div>
                                                    
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    
                                                        <div className="anketTitle">{locale("employee_single.workEmail")}</div>
                                                        <div className="anketInfo">
                                                            {empSingle.emailFromComp}
                                                        </div>
                                                    
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.workPhone")}</div>
                                                    <div className="anketInfo">
                                                        {empSingle.phoneFromComp}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("common_employee.started_date")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle || {}).workFrom ? moment((empSingle || {}).workFrom).format('YYYY-MM-DD') : null}
                                                        
                                                    </div>

                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                {/*<Form.Item>*/}
                                                {/*    <div className="anketTitle">Албан тушаал</div>*/}
                                                {/*    <div className="anketInfo">*/}
                                                {/*        {empSingle.position_name}*/}
                                                {/*    </div>*/}
                                                {/*</Form.Item>*/}
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.tsalin_dans")}</div>
                                                    <Row>
                                                        <Col span={12}>
                                                            <div className="anketInfo">
                                                                {getBankName(((empSingle || {}).bank || {}).name)}
                                                            </div>
                                                        </Col>
                                                        <Col span={12}>
                                                            <div className="anketInfo">
                                                                {((empSingle || {}).bank || {}).account}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.cardNum")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle || {}).cardId}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                {/*<Form.Item>*/}
                                                {/*    <div className="anketTitle">Цалин авах данс</div>*/}
                                                {/*    <Row>*/}
                                                {/*        <Col span={12}>*/}
                                                {/*            <div className="anketInfo">*/}
                                                {/*                {getBankName(((empSingle || {}).bank || {}).name)}*/}
                                                {/*            </div>*/}
                                                {/*        </Col>*/}
                                                {/*        <Col span={12}>*/}
                                                {/*            <div className="anketInfo">*/}
                                                {/*                {((empSingle || {}).bank || {}).account}*/}
                                                {/*            </div>*/}
                                                {/*        </Col>*/}
                                                {/*    </Row>*/}
                                                {/*</Form.Item>*/}
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <Col>
                                <div className="anketTitle">{locale("employee_single.address")}</div>
                                <div className="address">
                                    <div className="addressInput" style={{borderTopLeftRadius: '10px', borderRight: '1px solid #898e91'}}>
                                        {(singleUser.address || {}).region || ''}
                                    </div>
                                    <div className="addressInput" style={{borderRight: '1px solid #898e91'}}>
                                        {(singleUser.address || {}).district || ''}
                                    </div>
                                    <div className="addressInput" style={{borderRight: '1px solid #898e91'}}>
                                        {(singleUser.address || {}).horoo || ''}
                                    </div>
                                    <div className="addressInput" style={{borderRight: '1px solid #898e91'}}>
                                        {(singleUser.address || {}).street || ''}
                                    </div>
                                    <div className="addressInput" style={{borderBottomRightRadius: '10px',}}>
                                        {(singleUser.address || {}).streetNum || ''}
                                    </div>
                                </div>
                                    
                                </Col>
                                
                                <Col span={editingMain || !hadAction ? 0 : 24} style={{ textAlign: 'right' }}>
                                    <Button
                                        type={'primary'}
                                        visible={!editingMain}
                                        onClick={this.startEditMain.bind(this, {}, 'main')}
                                        disabled={!hadAction || editingMain || empSingle.status !== 'active'}
                                    >
                                        {locale("employee_single.edit")}
                                    </Button>
                                </Col>
                            </div>
                        }
                    
                     <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}>Aжлын мэдээлэл</b>
                        </Divider>
                    </div>

                    <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    
                                                        <div className="anketTitle">{locale("employee_single.workEmail")}</div>
                                                        <div className="anketInfo">
                                                            {empSingle.emailFromComp}
                                                        </div>
                                                    
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.workPhone")}</div>
                                                    <div className="anketInfo">
                                                        {empSingle.phoneFromComp}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("common_employee.started_date")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle || {}).workFrom ? moment((empSingle || {}).workFrom).format('YYYY-MM-DD') : null}
                                                        
                                                    </div>

                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.tsalin_dans")}</div>
                                                    <Row>
                                                        <Col span={12}>
                                                            <div className="anketInfo">
                                                                {getBankName(((empSingle || {}).bank || {}).name)}
                                                            </div>
                                                        </Col>
                                                        <Col span={12}>
                                                            <div className="anketInfo">
                                                                {((empSingle || {}).bank || {}).account}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={'main-info'}>
                                    <div className={'info_inps'}>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 12.5}}>
                                                <Form.Item>
                                                    <div className="anketTitle">{locale("employee_single.cardNum")}</div>
                                                    <div className="anketInfo">
                                                        {(empSingle || {}).cardId}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 12.5}}>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                        
                        
                    </Form>


                    {/*
                        Гэр бүлийн мэдээлэл
                    */}


                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}>{locale("employee_single.family.info")}</b>
                        </Divider>
                    </div>
                    <Table
                        size={'small'}
                        title={() =>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <p style={{margin: 0}}>
                                    {locale("employee_single.family.didMarry")}
                                </p>
                                <div>
                                    <Switch disabled={settingMarried || !hadAction || empSingle.status !== 'active'} loading={settingMarried} onClick={(e) => dispatch(insertEmpFamily({isMarried: e, emp: empSingle._id, setMarriage: true}))} checked={((empSingle.user || {}).family || {}).isMarried} checkedChildren={locale("employee_single.family.married")} unCheckedChildren={locale("employee_single.family.marriedNot")}/>
                                </div>
                            </div>
                        }
                        bordered={true}
                        footer={() =>
                            hadAction ?
                                visibleFamily ?
                                    <Form
                                        size={'small'}
                                        layout="vertical"
                                        onFinish={this.insertFamilyInfo.bind(this)}
                                    >
                                        <p><b>{locale("employee_single.add")}</b></p>
                                        <div className={'main-info'}>
                                            <div className={'info_inps'}>
                                                <Row>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("common_employee.last_name")}
                                                            // name={['family', 'last_name']}
                                                        >
                                                            <Input name="last_name" value={editFamily.last_name} onChange={this.onChangeHandler.bind(this, 'family')} placeholder={locale("common_employee.last_name")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 20, paddingRight: 20}}>
                                                        <Form.Item
                                                            label={locale("common_employee.first_name")}
                                                            // name={['family', 'first_name']}
                                                        >
                                                            <Input name="first_name" value={editFamily.first_name} onChange={this.onChangeHandler.bind(this, 'family')} placeholder={locale("common_employee.first_name")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("employee_single.relation")}
                                                            // name={['family', 'hen_boloh']}
                                                        >
                                                            <Select name="hen_boloh" value={editFamily.hen_boloh} onChange={(e, hen_boloh) => this.onChangeHandler('family', hen_boloh, 'hen_boloh')} placeholder={locale("employee_single.relation")}>
                                                                <Option key={'nuhur'} value={'nuhur'}>{locale("employee_single.related.husband")}</Option>
                                                                <Option key={'ehner'} value={'ehner'}>{locale("employee_single.related.wife")}</Option>
                                                                <Option key={'etseg'} value={'etseg'}>{locale("employee_single.related.father")}</Option>
                                                                <Option key={'eh'} value={'eh'}>{locale("employee_single.related.mother")}</Option>
                                                                <Option key={'ah'} value={'ah'}>{locale("employee_single.related.brother")}</Option>
                                                                <Option key={'egch'} value={'egch'}>{locale("employee_single.related.sister")}</Option>
                                                                <Option key={'dvvEr'} value={'dvvEr'}>{locale("employee_single.related.lilBro")}</Option>
                                                                <Option key={'dvvEm'} value={'dvvEm'}>{locale("employee_single.related.lilSis")}</Option>
                                                                <Option key={'huu'} value={'huu'}>{locale("employee_single.related.son")}</Option>
                                                                <Option key={'ohin'} value={'ohin'}>{locale("employee_single.related.daughter")}</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12} style={{paddingRight: '20px'}}>
                                                        <Form.Item
                                                            label={locale("employee_single.birthday")}
                                                        >
                                                            <DatePicker name='birthday' value={editFamily.birthday ? moment(editFamily.birthday) : null} onChange={(e, date) => this.onChangeHandler('family', date, 'birthday')} style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            label={locale("employee_single.family.work")}
                                                            // name={['family', 'work_place']}
                                                        >
                                                            <Input name="work_place" value={editFamily.work_place} onChange={this.onChangeHandler.bind(this, 'family')} placeholder={locale("employee_single.family.work")}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("employee_single.family.rPhone")+ ' 1'}
                                                            // name={['family', 'phone']}
                                                        >
                                                            <Input name="phone" value={editFamily.phone} onChange={this.onChangeHandler.bind(this, 'family')} placeholder={locale("employee_single.family.rPhone")+ ' 1'}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 20, paddingRight: 20}}>
                                                        <Form.Item
                                                            label={locale("employee_single.family.rPhone")+ ' 2'}
                                                            // name={['family', 'phone1']}
                                                        >
                                                            <Input name="phone1" value={editFamily.phone1} onChange={this.onChangeHandler.bind(this, 'family')} placeholder={locale("employee_single.family.rPhone")+ ' 2'}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("employee_single.family.rPhone")+ ' 3'}
                                                            // name={['family', 'phone2']}
                                                        >
                                                            <Input name="phone2" value={editFamily.phone2} onChange={this.onChangeHandler.bind(this, 'family')} placeholder={locale("employee_single.family.rPhone")+ ' 3'}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type={'default'}
                                                        loading={insertingFamily}
                                                        style={{marginRight: '10px'}}
                                                        onClick={this.stopEditMain.bind(this, 'family')}
                                                    >
                                                        {locale("employee_single.cancel")}
                                                    </Button>
                                                    <Button
                                                        htmlType="submit"
                                                        type={'primary'}
                                                        loading={insertingFamily}
                                                        disabled={!hadAction || empSingle.status !== 'active'}
                                                    >
                                                        {editingFamily ? locale("employee_single.save") : locale("employee_single.add")}
                                                    </Button>
                                                </Col>
                                            </div>
                                        </div>
                                    </Form>
                                    : <div style={{ textAlign: 'right'}}>
                                        <Button
                                            type={'primary'}
                                            disabled={!hadAction || empSingle.status !== 'active'}
                                            size='small'
                                            onClick={this.addNewInfoHandler.bind(this, 'family')}
                                        >
                                            {locale("employee_single.family.add")}
                                        </Button>
                                    </div>
                            : null
                        }
                        dataSource={((empSingle.user || {}).family || {}).familyMembers || []}
                        columns={[
                            {
                                title: '№',
                                key: '№',
                                width: 50,
                                align: 'center',
                                render: (record, text, idx) => idx + 1
                            },
                            {
                                title: locale("common_employee.last_name")+ locale("common_employee.first_name"),
                                key: locale("common_employee.first_name"),
                                render: (record) => (record.last_name || '').trim().charAt(0).toUpperCase() + '. ' + record.first_name
                            },
                            {
                                title: locale("employee_single.relation"),
                                key: locale("employee_single.relation"),
                                render: (record, text, idx) => {
                                    switch (record.hen_boloh) {
                                        case 'nuhur': return locale("employee_single.related.husband");
                                        case 'ehner': return locale("employee_single.related.wife");
                                        case 'etseg': return locale("employee_single.related.father");
                                        case 'eh': return locale("employee_single.related.mother");
                                        case 'ah': return locale("employee_single.related.brother");
                                        case 'dvvEr': return locale("employee_single.related.lilBro");
                                        case 'dvvEm': return locale("employee_single.related.lilSis");
                                        case 'egch': return locale("employee_single.related.sister");
                                        case 'huu': return locale("employee_single.related.son");
                                        case 'ohin': return locale("employee_single.related.daughter");
                                        default: return '-';
                                    }
                                }
                            },
                            {
                                title: locale("employee_single.birthday"),
                                key: locale("employee_single.birthday"),
                                render: (record) => record.birthday ? moment(record.birthday).format('YYYY-MM-DD') : null
                            },
                            {
                                title: locale("employee_single.family.rPhone"),
                                key: locale("employee_single.family.rPhone"),
                                render: (record) => `${record.phone || ''} ${record.phone1 || ''} ${record.phone2 || ''}`
                            },
                            {
                                title: locale("employee_single.family.work"),
                                key: locale("employee_single.family.work"),
                                render: (record) => record.work_place
                            },
                            {
                                title: locale("employee_single.uildel"),
                                key: locale("employee_single.uildel"),
                                width: '200px',
                                render: (record) => (
                                    <div>
                                        <Button
                                            icon={<EditOutlined/>}
                                            style={{marginRight: '10px'}}
                                            type={'default'}
                                            size='small'
                                            disabled={empSingle.status !== 'active' || !hadAction}
                                            onClick={this.startEditMain.bind(this, record, 'family')}
                                        >
                                            {locale("employee_single.edit")}
                                        </Button>
                                        <Popconfirm
                                            disabled={empSingle.status !== 'active' || !hadAction}
                                            placement="bottomRight"
                                            title={locale("employee_single.family.delete")}
                                            onConfirm={this.insertFamilyInfo.bind(this, record, 'delete')}
                                            okText={locale("yes")}
                                            cancelText={locale("no")}
                                        >
                                            <Button
                                                disabled={empSingle.status !== 'active' || !hadAction}
                                                type={'primary'}
                                                size='small'
                                                danger
                                                icon={<DeleteOutlined/>}
                                            >
                                                {locale("common_employee.delete")}
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        ]}
                        pagination={false}
                        loading={insertingFamily}
                    />


                    {/*
                        Боловсрол
                    */}


                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}>{locale("employee_single.edu.base")}</b>
                        </Divider>
                    </div>
                    <Table
                        size={'small'}
                        bordered={true}
                        title={() =>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <p style={{margin: 0}}>
                                    {locale("employee_single.edu.rank")}
                                </p>
                                {/*<div>*/}
                                {/*    <Select defaultValue={(empSingle.user || {}).professionType} style={{minWidth: 200, border: 1}} loading={settingProfType} disabled={settingProfType || !hadAction} onChange={(e) => dispatch(editEmpProfession({professionType: e, emp: empSingle._id}))} placeholder={'Боловсролын зэрэг сонгоно уу.'}>*/}
                                {/*        <Option value={'nothing'}>Боловсролгүй</Option>*/}
                                {/*        <Option value={'baga'}>Бага</Option>*/}
                                {/*        <Option value={'buren_bus_dund'}>Бүрэн бус дунд</Option>*/}
                                {/*        <Option value={'buren_dund'}>Бүрэн дунд</Option>*/}
                                {/*        <Option value={'tehnikiin_bolon_mergejliin'}>Техникийн болон мэргэжлийн</Option>*/}
                                {/*        <Option value={'tusgai_mergejliin_dund'}>Тусгай мэргэжлийн дунд</Option>*/}
                                {/*        <Option value={'buren_bus_deed'}>Бүрэн бус дээд</Option>*/}
                                {/*        <Option value={'deed'}>Дээд</Option>*/}
                                {/*    </Select>*/}
                                {/*</div>*/}
                            </div>
                        }
                        footer={() =>
                            hadAction ?
                                visibleProf ?
                                    <Form
                                        size={'small'}
                                        layout="vertical"
                                        onFinish={this.insertProfInfo.bind(this)}
                                    >
                                        <p><b>{locale("employee_single.edu")}</b></p>
                                        <div className={'main-info'}>
                                            <div className={'info_inps'}>
                                                <Row>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("employee_single.edu.school")}
                                                            // name={['prof', 'name']}
                                                        >
                                                            <Input name='name' value={editProf.name} onChange={this.onChangeHandler.bind(this, 'prof')} placeholder={locale("employee_single.edu.school")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 20, paddingRight: 20}}>
                                                        <Form.Item
                                                            label={locale("common_employee.started_date")}
                                                            // name={['prof', 'enrolledDate']}
                                                        >
                                                            <DatePicker name='enrolledDate' picker="year" disabledDate={this.disabledStartDate.bind(this, 'prof')} value={editProf.enrolledDate ? moment(editProf.enrolledDate) : null} onChange={(e, date) => this.onChangeHandler('prof', date, 'enrolledDate')} style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("common_employee.end_date")}
                                                            // name={['prof', 'graduatedDate']}
                                                        >
                                                            <DatePicker name='graduatedDate' picker="year" disabledDate={this.disabledEndDate.bind(this, 'prof')} value={editProf.graduatedDate ? moment(editProf.graduatedDate) : null} onChange={(e, date) => this.onChangeHandler('prof', date, 'graduatedDate')} style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8} style={{paddingRight: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.edu.rank")}
                                                            // name={['prof', 'type']}
                                                        >
                                                            <Select name="type" value={editProf.type} onChange={(e, type) => this.onChangeHandler('prof', type, 'type')} placeholder={locale("common_employee.edu.rank")}>
                                                                <Option key={'baga'} value={'baga'}>{locale("employee_single.eduRanking.baga")}</Option>
                                                                <Option key={'dund'} value={'dund'}>{locale("employee_single.eduRanking.dund")}</Option>
                                                                <Option key={'burendund'} value={'burendund'}>{locale("employee_single.eduRanking.buren_dund")}</Option>
                                                                <Option key={'bachelor'} value={'bachelor'}>{locale("employee_single.eduRanking.bachelor")}</Option>
                                                                <Option key={'magistr'} value={'magistr'}>{locale("employee_single.eduRanking.master")}</Option>
                                                                <Option key={'dr'} value={'dr'}>{locale("employee_single.eduRanking.doc")}</Option>
                                                                <Option key={'other'} value={'other'}>{locale("employee_single.eduRanking.extra")}</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 10, paddingRight: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.edu.diplom")}
                                                            // name={['prof', 'diplomId']}
                                                        >
                                                            <Input name='diplomId' value={editProf.diplomId} onChange={this.onChangeHandler.bind(this, 'prof')} placeholder={locale("employee_single.edu.diplom")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.edu.gpa")}
                                                            // name={['prof', 'diplomId']}
                                                        >
                                                            <InputNumber name='gpa' value={editProf.gpa} onChange={(e) => this.onChangeHandler('prof', e, 'gpa')} placeholder={locale("employee_single.edu.gpa")} style={{width: '100%'}} min={0} max={100} step={0.1}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12} style={{paddingRight: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.edu.majorOccu")}
                                                            // name={['prof', 'mergejil']}
                                                        >
                                                            <Input name='mergejil' value={editProf.mergejil} onChange={this.onChangeHandler.bind(this, 'prof')} placeholder={locale("employee_single.edu.majorOccu")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12} style={{paddingLeft: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.edu.occu")}
                                                            // name={['prof', 'mergeshil']}
                                                        >
                                                            <Input name='mergeshil' value={editProf.mergeshil} onChange={this.onChangeHandler.bind(this, 'prof')} placeholder={locale("employee_single.edu.occu")}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type={'default'}
                                                        loading={insertingProf}
                                                        style={{marginRight: '10px'}}
                                                        onClick={this.stopEditMain.bind(this, 'prof')}
                                                    >
                                                        {locale("employee_single.cancel")}
                                                    </Button>
                                                    <Button
                                                        disabled={empSingle.status !== 'active' || !hadAction}
                                                        htmlType="submit"
                                                        type={'primary'}
                                                        loading={insertingProf}
                                                        disabled={insertingProf || !hadAction}
                                                    >
                                                        {editingFamily ? locale("employee_single.save") : locale("employee_single.add")}
                                                    </Button>
                                                </Col>
                                            </div>
                                        </div>
                                    </Form>
                                : <div style={{ textAlign: 'right' }}>
                                        <Button
                                            type={'primary'}
                                            disabled={!hadAction || empSingle.status !== 'active'}
                                            visible
                                            size='small'
                                            onClick={this.addNewInfoHandler.bind(this, 'prof')}
                                        >
                                            {editingProf ? locale("employee_single.save") : locale("employee_single.edu.add")}
                                        </Button>
                                    </div>
                            : null
                        }
                        dataSource={(empSingle.user || {}).profession || []}
                        columns={[
                            {
                                title: '№',
                                key: '№',
                                width: 50,
                                align: 'center',
                                render: (record, text, idx) => idx + 1
                            },
                            {
                                title: locale("employee_single.edu.school"),
                                key: locale("employee_single.edu.school"),
                                render: (record) => record.name
                            },
                            {
                                title: locale("employee_single.edu.rank"),
                                key: locale("employee_single.edu.rank"),
                                render: (record) => {
                                    switch (record.type) {
                                        case 'baga': return locale("employee_single.eduRanking.baga");
                                        case 'dund': return locale("employee_single.eduRanking.dund");
                                        case 'burendund': return locale("employee_single.eduRanking.buren_dund");
                                        case 'bachelor': return locale("employee_single.eduRanking.bachelor");
                                        case 'magistr': return locale("employee_single.eduRanking.master");
                                        case 'dr': return locale("employee_single.eduRanking.doc");
                                        case 'other': return locale("employee_single.eduRanking.extra");
                                        default: return '-';
                                    }
                                }
                            },
                            {
                                title: locale("common_employee.started_date"),
                                key: locale("common_employee.started_date"),
                                render: (record, text, idx) => record.enrolledDate? `${moment(record.enrolledDate).format('YYYY')}` : '-'
                            },
                            {
                                title: locale("employee_single.end_date"),
                                key: locale("employee_single.end_date"),
                                render: (record, text, idx) => record.graduatedDate ? `${moment(record.graduatedDate).format('YYYY')}` : '-'
                            },
                            {
                                title: locale("employee_single.edu.majorOccu"),
                                key: locale("employee_single.edu.majorOccu"),
                                render: (record) => record.mergejil
                            },
                            {
                                title: locale("employee_single.edu.gpa"),
                                key: locale("employee_single.edu.gpa"),
                                render: (record) => record.gpa
                            },
                            // {
                            //     title: 'Дипломын дугаар',
                            //     key: 'Дипломын дугаар',
                            //     render: (record) => record.diplomId
                            // },
                            {
                                title: locale("employee_single.uildel"),
                                key: locale("employee_single.uildel"),
                                width: '200px',
                                render: (record) => (
                                    <div>
                                        <Button
                                            icon={<EditOutlined/>}
                                            style={{marginRight: '10px'}}
                                            type={'default'}
                                            size='small'
                                            disabled={!hadAction || empSingle.status !== 'active'}
                                            onClick={this.startEditMain.bind(this, record, 'prof')}
                                        >
                                            {locale("employee_single.edit")}
                                        </Button>
                                        <Popconfirm
                                            placement="bottomRight"
                                            title={locale("employee_single.edu.delete")}
                                            onConfirm={this.insertProfInfo.bind(this, record, 'delete')}
                                            disabled={!hadAction || empSingle.status !== 'active'}
                                            okText={locale("yes")}
                                            cancelText={locale("no")}
                                        >
                                            <Button
                                                type={'primary'}
                                                size='small'
                                                danger
                                                icon={<DeleteOutlined/>}
                                                disabled={!hadAction || empSingle.status !== 'active'}
                                            >
                                                {locale("common_employee.delete")}
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        ]}
                        pagination={false}
                        loading={insertingProf}
                    />


                    {/*
                        Сургалт , Дамжаа
                    */}


                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}>{locale("employee_single.course.base")}</b>
                        </Divider>
                    </div>
                    <Table
                        size={'small'}
                        bordered={true}
                        footer={() =>
                            hadAction ?
                                visibleQtraining ?
                                    <Form
                                        size={'small'}
                                        layout="vertical"
                                        onFinish={this.insertQualifInfo.bind(this)}
                                    >
                                        <p><b>{locale("employee_single.course.add")}</b></p>
                                        <div className={'main-info'}>
                                            <div className={'info_inps'}>
                                                <Row>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("employee_single.course.name")}
                                                            // name={['qualif', 'name']}
                                                        >
                                                            <Input name='name' value={editQtraining.name} onChange={this.onChangeHandler.bind(this, 'Qtraining')} placeholder={locale("employee_single.course.name")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 20, paddingRight: 20}}>
                                                        <Form.Item
                                                            label={locale("common_employee.started_date")}
                                                            // name={['qualif', 'start_date']}
                                                        >
                                                            <DatePicker name='start_date' disabledDate={this.disabledStartDate.bind(this, 'Qtraining')} value={editQtraining.start_date ? moment(editQtraining.start_date) : null} onChange={(e, date) => this.onChangeHandler('Qtraining', date, 'start_date')} style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("common_employee.end_date")}
                                                            // name={['qualif', 'end_date']}
                                                        >
                                                            <DatePicker name='end_date' disabledDate={this.disabledEndDate.bind(this, 'Qtraining')} value={editQtraining.end_date ? moment(editQtraining.end_date) : null} onChange={(e, date) => this.onChangeHandler('Qtraining', date, 'end_date')} style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("employee_single.course.direction")}
                                                            // name={['qualif', 'chiglel']}
                                                        >
                                                            <Input name='chiglel' value={editQtraining.chiglel} onChange={this.onChangeHandler.bind(this, 'Qtraining')} placeholder={locale("employee_single.course.direction")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 20, paddingRight: 20}}>
                                                        <Form.Item
                                                            label={locale("employee_single.course.certNum")}
                                                            // name={['qualif', 'gerchilgeenii_dugaar']}
                                                        >
                                                            <Input name='gerchilgeenii_dugaar' value={editQtraining.gerchilgeenii_dugaar} onChange={this.onChangeHandler.bind(this, 'Qtraining')} placeholder={locale("employee_single.course.certNum")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={locale("employee_single.course.certDate")}
                                                            // name={['qualif', 'gerchilgee_date']}
                                                        >
                                                            <DatePicker name='gerchilgee_date' value={editQtraining.gerchilgee_date ? moment(editQtraining.gerchilgee_date) : null} onChange={(e, date) => this.onChangeHandler('Qtraining', date, 'gerchilgee_date')} style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type={'default'}
                                                        loading={insertingQtraining}
                                                        style={{marginRight: '10px'}}
                                                        onClick={this.stopEditMain.bind(this, 'Qtraining')}
                                                    >
                                                        {locale("employee_single.cancel")}
                                                    </Button>
                                                    <Button
                                                        htmlType="submit"
                                                        type={'primary'}
                                                        loading={insertingQtraining}
                                                        disabled={insertingQtraining || !hadAction || empSingle.status !== 'active'}
                                                    >
                                                        {editingQtraining ? locale("employee_single.save") : locale("employee_single.add")}
                                                    </Button>
                                                </Col>
                                            </div>
                                        </div>
                                    </Form>
                                : <div style={{ textAlign: 'right' }}>
                                    <Button
                                        type={'primary'}
                                        disabled={!hadAction || empSingle.status !== 'active'}
                                        visible
                                        size='small'
                                        onClick={this.addNewInfoHandler.bind(this, 'Qtraining')}
                                    >
                                        {locale("employee_single.course.add")}
                                    </Button>
                                </div>
                            : null
                        }
                        dataSource={(empSingle.user || {}).qualification_training || []}
                        columns={[
                            {
                                title: '№',
                                key: '№',
                                width: 50,
                                align: 'center',
                                render: (record, text, idx) => idx + 1
                            },
                            {
                                title: locale("employee_single.course.base"),
                                key: locale("employee_single.course.base"),
                                render: (record) => record.name
                            },
                            {
                                title: locale("employee_single.course.direction"),
                                key: locale("employee_single.course.direction"),
                                render: (record) => record.chiglel
                            },
                            {
                                title: locale("employee_single.course.certNum"),
                                key: locale("employee_single.course.certNum"),
                                render: (record) => record.gerchilgeenii_dugaar
                            },
                            {
                                title: locale("employee_single.course.certDate"),
                                key: locale("employee_single.course.certDate"),
                                render: (record) => record.gerchilgee_date ? moment(record.gerchilgee_date).format('YYYY/MM/DD') : '-'
                            },
                            {
                                title: locale("common_employee.date"),
                                key: locale("common_employee.date"),
                                render: (record, text, idx) => record.start_date && record.end_date ? `${moment(record.start_date).format('YYYY/MM/DD')} - ${moment(record.end_date).format('YYYY/MM/DD')}` : '-'
                            },
                            {
                                title: locale("employee_single.uildel"),
                                key: locale("employee_single.uildel"),
                                width: '200px',
                                render: (record) => (
                                    <div>
                                        <Button
                                            icon={<EditOutlined/>}
                                            style={{marginRight: '10px'}}
                                            type={'default'}
                                            size='small'
                                            disabled={!hadAction || empSingle.status !== 'active'}
                                            onClick={this.startEditMain.bind(this, record, 'Qtraining')}
                                        >
                                            {locale("employee_single.edit")}
                                        </Button>
                                        <Popconfirm
                                            placement="bottomRight"
                                            disabled={!hadAction || empSingle.status !== 'active'}
                                            title={locale("employee_single.course.delete")}
                                            onConfirm={this.insertQualifInfo.bind(this, record, 'delete')}
                                            okText={locale("yes")}
                                            cancelText={locale("no")}
                                        >
                                            <Button
                                                type={'primary'}
                                                disabled={!hadAction || empSingle.status !== 'active'}
                                                size='small'
                                                danger
                                                icon={<DeleteOutlined/>}
                                            >
                                                {locale("common_employee.delete")}
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        ]}
                        pagination={false}
                        loading={insertingQtraining}
                    />


                    {/*
                        Ажлын туршлага
                    */}


                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}>{locale("employee_single.workXp.base")}</b>
                        </Divider>
                    </div>
                    <Table
                        size={'small'}
                        bordered={true}
                        footer={() =>
                            hadAction ?
                                visibleExperience ?
                                    <Form
                                        size={'small'}
                                        layout="vertical"
                                        onFinish={this.insertExpInfo.bind(this)}
                                    >
                                        <p><b>{locale("employee_single.workXp.add")}</b></p>
                                        <div className={'main-info'}>
                                            <div className={'info_inps'}>
                                                <Row>
                                                    <Col span={12} style={{paddingRight: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.companyName")}
                                                            // name={['exp', 'name']}
                                                        >
                                                            <Input name='name' value={editExperience.name} onChange={this.onChangeHandler.bind(this, 'experience')} placeholder={locale("employee_single.companyName")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12} style={{paddingLeft: 10}}>
                                                        <Form.Item
                                                            label={locale("common_employee.position")}
                                                            // name={['exp', 'position']}
                                                        >
                                                            <Input name='position' value={editExperience.position} onChange={this.onChangeHandler.bind(this, 'experience')} placeholder={locale("common_employee.position")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12} style={{paddingRight: 10}}>
                                                        <Form.Item
                                                            label={locale("common_employee.started_date")}
                                                            // name={['exp', 'workFrom']}
                                                        >
                                                            <DatePicker name='workFrom' picker="year" disabledDate={this.disabledStartDate.bind(this, 'experience')} value={editExperience.workFrom ? moment(editExperience.workFrom) : null} onChange={(e, date) => this.onChangeHandler('experience', date, 'workFrom')} style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12} style={{paddingLeft: 10}}>
                                                        <Form.Item
                                                            label={locale("common_employee.end_date")}
                                                            // name={['exp', 'workUntil']}
                                                        >
                                                            <DatePicker name='workUntil' picker="year" disabledDate={this.disabledEndDate.bind(this, 'experience')} value={editExperience.workUntil ? moment(editExperience.workUntil) : null} onChange={(e, date) => this.onChangeHandler('experience', date, 'workUntil')} style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type={'default'}
                                                        loading={insertingQtraining}
                                                        style={{marginRight: '10px'}}
                                                        onClick={this.stopEditMain.bind(this, 'experience')}
                                                    >
                                                        {locale("employee_single.cancel")}
                                                    </Button>
                                                    <Button
                                                        htmlType="submit"
                                                        type={'primary'}
                                                        loading={insertingExp}
                                                        disabled={insertingExp || !hadAction || empSingle.status !== 'active'}
                                                    >
                                                        {editingExperience ? locale("employee_single.save") : locale("employee_single.add")}
                                                    </Button>
                                                </Col>
                                            </div>
                                        </div>
                                    </Form>
                                : <div style={{ textAlign: 'right' }}>
                                    <Button
                                        type={'primary'}
                                        disabled={!hadAction || empSingle.status !== 'active'}
                                        visible
                                        size='small'
                                        onClick={this.addNewInfoHandler.bind(this, 'experience')}
                                    >
                                       {locale("employee_single.workXp.add")}
                                    </Button>
                                </div>
                            : null
                        }
                        dataSource={(empSingle.user || {}).work_experience || []}
                        columns={[
                            {
                                title: '№',
                                key: '№',
                                width: 50,
                                align: 'center',
                                render: (record, text, idx) => idx + 1
                            },
                            {
                                title: locale("employee_single.companyName"),
                                key: locale("employee_single.companyName"),
                                render: (record) => record.name
                            },
                            {
                                title: locale("common_employee.position"),
                                key: locale("common_employee.position"),
                                render: (record) => record.position
                            },
                            {
                                title: locale("common_employee.started_date"),
                                key: locale("common_employee.started_date"),
                                width: 200,
                                align: 'center',
                                render: (record, text, idx) => record.workFrom ? `${moment(record.workFrom).format('YYYY')}` : '-'
                            },
                            {
                                title: locale("common_employee.end_date"),
                                key: locale("common_employee.end_date"),
                                width: 200,
                                align: 'center',
                                render: (record, text, idx) => record.workUntil ? `${moment(record.workUntil).format('YYYY')}` : '-'
                            },
                            {
                                title: locale("employee_single.uildel"),
                                key: locale("employee_single.uildel"),
                                width: '200px',
                                render: (record) => (
                                    <div>
                                        <Button
                                            icon={<EditOutlined/>}
                                            style={{marginRight: '10px'}}
                                            disabled={!hadAction || empSingle.status !== 'active'}
                                            type={'default'}
                                            size='small'
                                            onClick={this.startEditMain.bind(this, record, 'experience')}
                                        >
                                            {locale("employee_single.edit")}
                                        </Button>
                                        <Popconfirm
                                            placement="bottomRight"
                                            title={locale("employee_single.xpDelete")}
                                            disabled={!hadAction || empSingle.status !== 'active'}
                                            onConfirm={this.insertExpInfo.bind(this, record, 'delete')}
                                            okText={locale("yes")}
                                            cancelText={locale("no")}
                                        >
                                            <Button
                                                type={'primary'}
                                                disabled={!hadAction || empSingle.status !== 'active'}
                                                size='small'
                                                danger
                                                icon={<DeleteOutlined/>}
                                            >
                                                {locale("common_employee.delete")}
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        ]}
                        pagination={false}
                        loading={insertingExp}
                    />


                    {/*
                        Ур чадвар
                    */}


                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}>{locale("employee_single.talent.base")}</b>
                        </Divider>
                    </div>
                    <Table
                        size={'small'}
                        bordered={true}
                        footer={() =>
                            hadAction ?
                                visibleSkill ?
                                    <Form
                                        size={'small'}
                                        layout="vertical"
                                        onFinish={this.insertSkillInfo.bind(this)}
                                    >
                                        <p><b>{locale("employee_single.talent.add")}</b></p>
                                        <div className={'main-info'}>
                                            <div className={'info_inps'}>
                                                <Row>
                                                    <Col span={12} style={{paddingRight: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.talent.base")}
                                                            // name={['skill', 'name']}
                                                        >
                                                            <Select name='name' value={editSkill.name} onChange={(e, name) => this.onChangeHandler('skill', name, 'name')} placeholder={locale("employee_single.talent")}>
                                                                {
                                                                    skills.map((c) => <Option key={c} value={c}>{c}</Option>)
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12} style={{paddingLeft: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.talent.level")}
                                                            // name={['skill', 'percent']}
                                                        >
                                                            <Select name='level' value={editSkill.level} onChange={(e, level) => this.onChangeHandler('skill', level, 'level')} style={{width: '100%'}} placeholder={locale("employee_single.level")}>
                                                                <Option key={'Маш сайн'} value={'excellent'}>{locale("employee_single.talent.veryGood")}</Option>
                                                                <Option key={'Сайн'} value={'good'}>{locale("employee_single.talent.good")}</Option>
                                                                <Option key={'Дунд'} value={'average'}>{locale("employee_single.talent.med")}</Option>
                                                                <Option key={'Муу'} value={'bad'}>{locale("employee_single.talent.bad")}</Option>
                                                                <Option key={'Маш муу'} value={'unskilled'}>{locale("employee_single.talent.worse")}</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type={'default'}
                                                        loading={insertingQtraining}
                                                        style={{marginRight: '10px'}}
                                                        onClick={this.stopEditMain.bind(this, 'skill')}
                                                    >
                                                    {locale("employee_single.cancel")}
                                                    </Button>
                                                    <Button
                                                        htmlType="submit"
                                                        type={'primary'}
                                                        loading={insertingSkill}
                                                        disabled={insertingSkill || !hadAction || empSingle.status !== 'active'}
                                                    >
                                                        {editingSkill ? locale("employee_single.save") : locale("employee_single.add")}
                                                    </Button>
                                                </Col>
                                            </div>
                                        </div>
                                    </Form>
                                : <div style={{ textAlign: 'right' }}>
                                    <Button
                                        type={'primary'}
                                        disabled={!hadAction || empSingle.status !== 'active'}
                                        visible
                                        size='small'
                                        onClick={this.addNewInfoHandler.bind(this, 'skill')}
                                    >
                                        {locale("employee_single.talent.add")}
                                    </Button>
                                </div>
                            : null
                        }
                        dataSource={(empSingle.user || {}).ability || []}
                        columns={[
                            {
                                title: '№',
                                key: '№',
                                width: 50,
                                align: 'center',
                                render: (record, text, idx) => idx + 1
                            },
                            {
                                title: locale("employee_single.talent.base"),
                                key: locale("employee_single.talent.base"),
                                render: (record) => record.name
                            },
                            {
                                title: locale("employee_single.talent.level"),
                                key: locale("employee_single.talent.level"),
                                width: 100,
                                align: 'center',
                                render: (record) => record.level === 'excellent' ? locale("employee_single.talent.veryGood") :
                                    record.level === 'good' ? locale("employee_single.talent.good") :
                                        record.level === 'average' ? locale("employee_single.talent.med") :
                                            record.level === 'bad' ? locale("employee_single.talent.bad") :
                                                record.level === 'unskilled' ? locale("employee_single.talent.worse") :
                                                    ''
                            },
                            {
                                title: locale("employee_single.uildel"),
                                key: locale("employee_single.uildel"),
                                width: '200px',
                                render: (record) => (
                                    <div>
                                        <Button
                                            icon={<EditOutlined/>}
                                            style={{marginRight: '10px'}}
                                            type={'default'}
                                            disabled={!hadAction  || empSingle.status !== 'active'}
                                            size='small'
                                            onClick={this.startEditMain.bind(this, record, 'skill')}
                                        >
                                            {locale("employee_single.edit")}
                                        </Button>
                                        <Popconfirm
                                            placement="bottomRight"
                                            title={locale("employee_single.talent.delete")}
                                            onConfirm={this.insertSkillInfo.bind(this, record, 'delete')}
                                            disabled={!hadAction  || empSingle.status !== 'active'}
                                            okText= {locale("yes")}
                                            cancelText={locale("no")}
                                        >
                                            <Button
                                                type={'primary'}
                                                size='small'
                                                disabled={!hadAction  || empSingle.status !== 'active'}
                                                danger
                                                icon={<DeleteOutlined/>}
                                            >
                                                {locale("common_employee.delete")}
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        ]}
                        pagination={false}
                        loading={insertingSkill}
                    />


                    {/*
                        Шагнал урамшуулал
                    */}


                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}> {locale("employee_single.reward.base")}</b>
                        </Divider>
                    </div>
                    <Table
                        size={'small'}
                        bordered={true}
                        footer={() =>
                            hadAction ?
                                visibleReward ?
                                    <Form
                                        size={'small'}
                                        layout={'vertical'}
                                        onFinish={this.insertRewardInfo.bind(this)}
                                    >
                                        <p><b>{locale("employee_single.reward.add")}</b></p>
                                        <div className={'main-info'}>
                                            <div className={'info_inps'}>
                                                <Row>
                                                    <Col span={8} style={{paddingRight: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.reward.name")}
                                                            // name={['skill', 'name']}
                                                        >
                                                            <Input name='name' value={editReward.name} onChange={this.onChangeHandler.bind(this, 'reward')} placeholder={locale("employee_single.reward.name")}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 10, paddingRight: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.reward.point")}
                                                            // name={['skill', 'percent']}
                                                        >
                                                            <DatePicker name='date' value={editReward.date ? moment(editReward.date) : null} onChange={(e, date) => this.onChangeHandler('reward', date, 'date')} style={{width: '100%'}} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{paddingLeft: 10}}>
                                                        <Form.Item
                                                            label={locale("employee_single.reward.orga")}
                                                            // name={['skill', 'percent']}
                                                        >
                                                            <Input name='company_name' value={editReward.company_name} onChange={this.onChangeHandler.bind(this, 'reward')} placeholder={locale("employee_single.reward.orga")}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type={'default'}
                                                        loading={insertingReward}
                                                        style={{marginRight: '10px'}}
                                                        onClick={this.stopEditMain.bind(this, 'reward')}
                                                    >
                                                       {locale("employee_single.cancel")}
                                                    </Button>
                                                    <Button
                                                        htmlType="submit"
                                                        type={'primary'}
                                                        loading={insertingReward}
                                                        disabled={insertingReward || !hadAction || empSingle.status !== 'active'}
                                                    >
                                                        {editingReward ? locale("employee_single.save") : locale("employee_single.add")}
                                                    </Button>
                                                </Col>
                                            </div>
                                        </div>
                                    </Form>
                                : <div style={{ textAlign: 'right' }}>
                                <Button
                                    type={'primary'}
                                    disabled={!hadAction || empSingle.status !== 'active'}
                                    visible
                                    size='small'
                                    onClick={this.addNewInfoHandler.bind(this, 'reward')}
                                >
                                    {locale("employee_single.reward.add")}
                                </Button>
                            </div>
                            : null
                        }
                        dataSource={(empSingle.user || {}).reward || []}
                        columns={[
                            {
                                title: '№',
                                key: '№',
                                width: 50,
                                align: 'center',
                                render: (record, text, idx) => idx + 1
                            },
                            {
                                title: locale("employee_single.reward.name"),
                                key: locale("employee_single.reward.name"),
                                render: (record) => record.name
                            },
                            {
                                title: locale("employee_single.reward.point"),
                                key: locale("employee_single.reward.point"),
                                render: (record) => moment(record.date).format('YYYY-MM-DD')
                            },
                            {
                                title: locale("employee_single.reward.orga"),
                                key: locale("employee_single.reward.orga"),
                                render: (record) => record.company_name
                            },
                            {
                                title: locale("employee_single.uildel"),
                                key: locale("employee_single.uildel"),
                                width: '200px',
                                render: (record) => (
                                    <div>
                                        <Button
                                            icon={<EditOutlined/>}
                                            style={{marginRight: '10px'}}
                                            type={'default'}
                                            size='small'
                                            disabled={!hadAction  || empSingle.status !== 'active'}
                                            onClick={this.startEditMain.bind(this, record, 'reward')}
                                        >
                                            {locale("employee_single.edit")}
                                        </Button>
                                        <Popconfirm
                                            placement="bottomRight"
                                            title={locale("employee_single.reward.delete")}
                                            disabled={!hadAction  || empSingle.status !== 'active'}
                                            onConfirm={this.insertRewardInfo.bind(this, record, 'delete')}
                                            okText={locale("yes")}
                                            cancelText={locale("no")}
                                        >
                                            <Button
                                                type={'primary'}
                                                size='small'
                                                disabled={!hadAction || empSingle.status !== 'active'}
                                                danger
                                                icon={<DeleteOutlined/>}
                                            >
                                                {locale("common_employee.delete")}
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        ]}
                        pagination={false}
                        loading={insertingSkill}
                    />


                    {/*
                        Цэргийн алба
                    */}


                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}> {locale("employee_single.military.service")}</b>
                        </Divider>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <p style={{margin: 0}}>
                            {locale("employee_single.military.ask")}
                        </p>
                        <div>
                            <Switch disabled={settingMilitary || !hadAction || empSingle.status !== 'active'} loading={settingMilitary} checked={(empSingle.user || {}).wasInmilitary} onClick={(e) => dispatch(insertEmpMilitary({wasInmilitary: e, emp: empSingle._id}))} checkedChildren={locale("employee_single.military.did")} unCheckedChildren={locale("employee_single.military.didNot")}/>
                        </div>
                    </div>
                </Col>



                {this.state.mediaType !== ''?
                    <MediaLib
                        visible={this.state.mediaType !== ''}
                        multi={false}
                        onOk={this.chooseMedia.bind(this)}
                        type={this.state.mediaType}
                        dimension={{width:1200, height: 450}}
                        forWhat={this.state.forWhat}
                        onHide={() => this.setState({mediaType: ''})}
                    />
                    :
                    null
                }
            </Row>
        )
    }
}

export default connect(reducer)(AnketComponent)