import React from "react";
import { connect } from 'react-redux';
import config, {formattedActionsArray, uuidv4} from "../../config";
import * as actions from "../../actions/department_actions";

const reducer = ({ main, department }) => ({ main, department });
import {
    Card,
    Button,
    Switch,
    Form,
    Input,
    Select,
    Progress,
    Spin,
    Row,
    Col,
    TreeSelect,
    InputNumber,
    Steps,
    message,
    Divider, Checkbox
} from 'antd';
import { DeleteFilled, PlusOutlined, UploadOutlined, CloseCircleFilled, LoadingOutlined, CheckCircleFilled, CaretRightFilled, CaretLeftFilled,CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Editor } from '@tinymce/tinymce-react';
// import MediaLib from "../media/MediaLib";
import {Link} from "react-router-dom";
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const { Step } = Steps;

class DepartmentSingle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        this.props.dispatch(actions.getDepartment({_id:this.props.match.params._id}));
    }
    componentWillUnmount() {
        this.props.dispatch(actions.departmentUnmount());
    }


    // closeModal() {
    //     this.props.dispatch(actions.closeLessonModal());
    // }
    // onChangeHandler(e) {
    //     this.props.dispatch(actions.lessonChangeHandler({name:e.target.name, value: e.target.value}));
    // }
    // searchTeacher(event, value){
    //     const {dispatch} = this.props;
    //     function submitSearch(aa){
    //         dispatch(actions.searchTeacher({search_user:aa}));
    //     }
    //     if (event === 'search_member' && value !== '') {
    //         this.setState({ search_user: value });
    //         clearTimeout(this.state.timeOut);
    //         let text = value;
    //         let timeOut = setTimeout(function(){
    //             submitSearch(text)
    //         }, 300);
    //         this.setState({
    //             timeOut:timeOut
    //         });
    //     }
    // }
    //
    // chooseMember(item) {
    //     const {department:{searchTeachersResult}} = this.props;
    //     this.setState({selectedMember: ((searchTeachersResult || []).filter(run => run._id.toString() === item.toString())[0] || {}) });
    // };
    // onChangeHandle2(name, value) {
    //     this.props.dispatch(actions.lessonChangeHandler({name:name, value: value}));
    // }
    // removeSingleOrts(index, name){
    //     if(name === 'requirement'){
    //         let hold = [];
    //         if(this.state.requirementsArray && this.state.requirementsArray.length>0){
    //             hold = this.state.requirementsArray.filter((run, idx) => idx !== index);
    //             this.setState({requirementsArray: hold})
    //         }
    //     }
    //     if(name === 'learn_check_list'){
    //         let hold = [];
    //         if(this.state.learn_check_listArray && this.state.learn_check_listArray.length>0){
    //             hold = this.state.learn_check_listArray.filter((run, idx) => idx !== index);
    //             this.setState({learn_check_listArray: hold})
    //         }
    //     }
    // }
    // addSingleOrts(name){
    //     if(name === 'requirement'){
    //         const {requirement} = this.state;
    //         let s = requirement.trim();
    //         if(s && s !== ''){
    //             let hold = this.state.requirementsArray;
    //             hold.push(s);
    //             this.setState({requirementsArray: hold, requirement:''});
    //         }
    //     }
    //     if(name === 'learn_check_list'){
    //         const {learn_check_list} = this.state;
    //         let s = learn_check_list.trim();
    //         if(s && s !== ''){
    //             let hold = this.state.learn_check_listArray;
    //             hold.push(s);
    //             this.setState({learn_check_listArray: hold, learn_check_list:''});
    //         }
    //     }
    // }
    // changeState(e, value){
    //     if (typeof e === 'string' || e instanceof String) {
    //         this.setState({ [e]: value});
    //     } else {
    //         this.setState({ [e.target.name]: e.target.value});
    //     }
    // }
    // next() {
    //     const {department:{ lesson }} = this.props;
    //     const { selectedMember } = this.state;
    //     if(this.state.current === 0){
    //         let content = (this.editor || {}).editor.getContent({format:'raw'});
    //         if(!lesson.title || (lesson.title && lesson.title.trim() === '' )){
    //             return config.get('emitter').emit('warning', ("Нэр оруулна уу!"));
    //         }
    //         if(!lesson.description || (lesson.description && lesson.description.trim() === '' )){
    //             return config.get('emitter').emit('warning', ("Танилцуулга оруулна уу!"));
    //         }
    //         if(!content || content === '' || content === '<p><br data-mce-bogus="1"></p>' ){
    //             return config.get('emitter').emit('warning', ("Дэлгэрэнгүй танилцуулга оруулна уу!"));
    //         }
    //         this.setState({holdEditor: content});
    //     }
    //     if(this.state.current === 1){
    //         // if(!selectedMember || !selectedMember._id){
    //         //     return config.get('emitter').emit('warning', ("Багш сонгоно уу!"));
    //         // }
    //         if(!lesson.category || (lesson.category && lesson.category.trim() === '' )){
    //             return config.get('emitter').emit('warning', ("Ангилал сонгоно уу!"));
    //         }
    //         if(!lesson.lvl || (lesson.lvl && lesson.lvl.trim() === '' )){
    //             return config.get('emitter').emit('warning', ("Түвшин сонгоно уу!"));
    //         }
    //         if(!lesson.price || (lesson.price && lesson.price === 0 )){
    //             return config.get('emitter').emit('warning', ("Үнэ оруулна уу!"));
    //         }
    //         if(lesson.sale && lesson.sale > lesson.price){
    //             return config.get('emitter').emit('warning', ("Хямдрал үнэ-ээс их байж болохгүй!"));
    //         }
    //     }
    //     if(this.state.current === 2){
    //         if(!this.state.requirementsArray || (this.state.requirementsArray && this.state.requirementsArray.length<1 )){
    //             return config.get('emitter').emit('warning', ("Шаардлагатай зүйлс оруулна уу!"));
    //         }
    //         if(!this.state.learn_check_listArray || (this.state.learn_check_listArray && this.state.learn_check_listArray.length<1 )){
    //             return config.get('emitter').emit('warning', ("Сурах зүйлс оруулна уу!"));
    //         }
    //     }
    //     const current = this.state.current + 1;
    //     this.setState({ current });
    //
    // }
    // submitLesson(){
    //     const {department:{lesson, lessonImage, lessonSmallImage, lessonVideo}} = this.props;
    //     // if(!lessonImage || !lessonImage.path || lessonImage.path === '' || !lessonImage.type || lessonImage.type !== 'image' ){
    //     //     return config.get('emitter').emit('warning', ("Том зураг оруулна уу!"));
    //     // }
    //     // if(!lessonSmallImage || !lessonSmallImage.path || lessonSmallImage.path === '' || !lessonSmallImage.type || lessonSmallImage.type !== 'image' ){
    //     //     return config.get('emitter').emit('warning', ("Та заавал хичээлийнхээ холбогдолтой жижиг зураг оруулна уу!"));
    //     // }
    //     let cc = {
    //         ...lesson,
    //         selectedMember: this.state.selectedMember,
    //         intro_desc: (this.state.holdEditor || null),
    //         lessonImage: lessonImage,
    //         lessonSmallImage: lessonSmallImage,
    //         lessonVideo: (lessonVideo || {}),
    //         requirementsArray: this.state.requirementsArray,
    //         learn_check_listArray: this.state.learn_check_listArray
    //     };
    //     this.props.dispatch(actions.submitLesson(cc));
    // }
    // prev() {
    //     const current = this.state.current - 1;
    //     this.setState({ current });
    // }
    // removeUploadedFile(name) {
    //     this.props.dispatch(actions.removeUploadedFile({name: name}));
    //     return false;
    // };
    //
    //
    //
    // //MediaLibrary
    // openMediaLib(mediaType, forWhat){
    //     this.setState({mediaType, forWhat:forWhat})
    // }
    // chooseMedia(data, type){
    //     this.props.dispatch(actions.chooseMedia({data: data, medType:type, forWhat:this.state.forWhat}));
    // }
    // setFeatured(e){
    //     this.props.dispatch(actions.setFeatured());
    // }
    // onChangeHandlerLvlSelect(value){
    //     this.props.dispatch(actions.onChangeHandlerLvlSelect({name:'lvl', value: value}));
    // };
    render() {
        let { main:{user}, department:{statusEdit, imageUploadLoading, lessonImage, lessonSmallImage, videoUploadLoading, lessonVideo, status, openModal, lessonVideoProgress, lessonImageProgress, department, lessons, submitLessonLoader, all, searchTeachersResult, searchTeacherLoader, categories, level} } = this.props;
        return (

            <Card
                title={`${department && department.title? department.title : 'Шинэ хэлтэс'}`}
                bordered={true}
                loading={statusEdit}
                style={{margin:30}}
                // extra={
                //     <Link to={`/department`}>
                //         <Button type="default" key='backButton' icon={<CloseOutlined />}>
                //             Болих
                //         </Button>
                //     </Link>
                // }
            >
                <div style={{padding:20}}>
                    <Form
                        size={'small'}
                        layout="vertical"
                        // onFinish={this.changeCompanyMain.bind(this)}
                    >
                        <Form.Item
                            label="Нэр"
                            name="name"
                            rules={[
                                {
                                    required: this.state.name === '',
                                    message: 'Нэр оруулна уу!',
                                },
                            ]}
                            initialValue={this.state.name}
                        >
                            <Input style={{maxWidth:300}} onChange={(e) => this.setState({name: e.target.value})} placeholder="Компани нэр" />
                        </Form.Item>


                        <Button
                            style={{float: 'right'}}
                            htmlType="submit"
                            type={'primary'}
                            icon={<CheckOutlined />}
                            // loading={updating}
                            // disabled={
                            //     ((department || {}).title === this.state.name && (department || {}).domain === this.state.domain) || updating
                            // }
                        >
                            Шинэчлэх
                        </Button>
                        <Link to={`/department`}>
                            <Button style={{float: 'right', marginRight:20}} type="default" key='backButton' icon={<CloseOutlined />}>
                                Болих
                            </Button>
                        </Link>
                    </Form>
                </div>
                {/*<div className='lesson-edit'>*/}
                {/*    <Steps current={current} responsive={true}>*/}
                {/*        {steps.map(item => (*/}
                {/*            <Step key={item.title} title={item.title} />*/}
                {/*        ))}*/}
                {/*    </Steps>*/}
                {/*    <div className="steps-action">*/}
                {/*        {current > 0 && (*/}
                {/*            <Button style={{ margin: '0 8px' }} loading={submitLessonLoader} onClick={this.prev.bind(this)}>*/}
                {/*                <CaretLeftFilled /> Өмнөх*/}
                {/*            </Button>*/}
                {/*        )}*/}
                {/*        {current < steps.length - 1 && (*/}
                {/*            <Button type="primary" loading={submitLessonLoader} onClick={this.next.bind(this)}>*/}
                {/*                <CaretRightFilled /> Дараах*/}
                {/*            </Button>*/}
                {/*        )}*/}
                {/*        {current === steps.length - 1 && (*/}
                {/*            <Button type="primary" loading={submitLessonLoader} onClick={this.submitLesson.bind(this)}>*/}
                {/*                <CheckCircleFilled /> Хадгалах*/}
                {/*            </Button>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*    <div className="steps-content">*/}
                {/*        <Row>*/}
                {/*            <Col md={6} />*/}
                {/*            <Col md={12}>*/}
                {/*                {*/}
                {/*                    steps[current].content === 'description-content' ?*/}
                {/*                        <div className='description-content'>*/}
                {/*                            <Form>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Нэр'*/}
                {/*                                    // labelCol={{span: 5}}*/}
                {/*                                >*/}
                {/*                                    <Input autoFocus={true} size="middle" maxLength={60}*/}
                {/*                                           value={lesson.title ? lesson.title : ''} name='title'*/}
                {/*                                           onChange={this.onChangeHandler.bind(this)}/>*/}
                {/*                                </Form.Item>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Танилцуулга'*/}
                {/*                                >*/}
                {/*                                    <TextArea size="middle" rows={2}*/}
                {/*                                              value={lesson.description ? lesson.description : ''}*/}
                {/*                                              name='description'*/}
                {/*                                              onChange={this.onChangeHandler.bind(this)}/>*/}
                {/*                                </Form.Item>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Дэлгэрэнгүй танилцуулга'*/}
                {/*                                >*/}
                {/*                                    <Editor*/}
                {/*                                        ref={(ref) => {*/}
                {/*                                            this.editor = ref;*/}
                {/*                                        }}*/}
                {/*                                        apiKey='xo6szqntkvg39zc2iafs9skjrw8s20sm44m28p3klgjo26y3'*/}
                {/*                                        height="350px"*/}
                {/*                                        value={lesson.intro_desc}*/}
                {/*                                        init={{*/}
                {/*                                            height: "350px",*/}
                {/*                                            content_style: 'body { background-color: #f7f7f7;}' +*/}
                {/*                                                'img { max-width: 100%; }',*/}
                {/*                                            relative_urls: false,*/}
                {/*                                            remove_script_host: false,*/}
                {/*                                            plugins: 'image code paste link lists textcolor hr table emoticons advlist',*/}
                {/*                                            // file_picker_callback: this.onImageUpload.bind(this),*/}
                {/*                                            file_picker_types: 'image',*/}
                {/*                                            paste_data_images: true,*/}
                {/*                                            paste_webkit_styles: "color font-size",*/}
                {/*                                            valid_elements: 'img[src],*[style]',*/}
                {/*                                            toolbar: 'undo redo | bold italic | fontsizeselect | alignleft aligncenter alignright | image media link | numlist bullist | forecolor backcolor | emoticons',*/}
                {/*                                            extended_valid_elements: "iframe[src|style|scrolling|class|width|height|name|align]",*/}
                {/*                                            color_cols: "5",*/}
                {/*                                            custom_colors: false,*/}
                {/*                                            body_class: 'tiny_editor'*/}
                {/*                                        }}*/}
                {/*                                    />*/}
                {/*                                </Form.Item>*/}
                {/*                            </Form>*/}
                {/*                        </div>*/}
                {/*                        :*/}
                {/*                        null*/}
                {/*                }*/}
                {/*                {*/}
                {/*                    steps[current].content === 'settings-content' ?*/}
                {/*                        <div className='settings-content'>*/}
                {/*                            <Form>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Ангилал'*/}
                {/*                                    fieldKey='category_editz'*/}
                {/*                                >*/}
                {/*                                    <TreeSelect*/}
                {/*                                        size="middle"*/}
                {/*                                        treeDefaultExpandAll*/}
                {/*                                        showSearch*/}
                {/*                                        style={{width: '100%'}}*/}
                {/*                                        value={lesson.category}*/}
                {/*                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}*/}
                {/*                                        placeholder="Please select"*/}
                {/*                                        allowClear*/}
                {/*                                        onChange={this.onChangeHandle2.bind(this, 'category')}*/}
                {/*                                    >*/}
                {/*                                        {categories && categories.length > 0 ?*/}
                {/*                                            categories.map((run, idx) =>*/}
                {/*                                                <TreeNode value={`${run._id}`}*/}
                {/*                                                          title={run.title}>*/}
                {/*                                                    {run.child && run.child.length > 0 ?*/}
                {/*                                                        run.child.map(innerRun =>*/}
                {/*                                                            <TreeNode*/}
                {/*                                                                // value={`parent-${run._id}-${innerRun._id}`}*/}
                {/*                                                                value={innerRun._id}*/}
                {/*                                                                title={innerRun.title}/>*/}
                {/*                                                        )*/}
                {/*                                                        :*/}
                {/*                                                        null*/}
                {/*                                                    }*/}
                {/*                                                </TreeNode>*/}
                {/*                                            )*/}
                {/*                                            :*/}
                {/*                                            null*/}
                {/*                                        }*/}
                {/*                                    </TreeSelect>*/}
                {/*                                </Form.Item>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Түвшин'*/}
                {/*                                    name='lvl'*/}
                {/*                                    fieldKey='lvl_editz'*/}
                {/*                                    // labelCol={{span: 4}}*/}
                {/*                                >*/}
                {/*                                    /!*<span style={{display: "none"}}>{lesson.lvl? lesson.lvl : ''}</span>*!/*/}
                {/*                                    <Select*/}
                {/*                                        defaultValue={lesson.lvl ? lesson.lvl : ''}*/}
                {/*                                        value={lesson.lvl ? lesson.lvl : ''}*/}
                {/*                                        onChange={this.onChangeHandlerLvlSelect.bind(this)}*/}
                {/*                                    >*/}
                {/*                                        <Select.Option value="">Түвшин сонгоно уу</Select.Option>*/}
                {/*                                        <Select.Option value="elementary">Анхан</Select.Option>*/}
                {/*                                        <Select.Option value="intermediate">Дунд</Select.Option>*/}
                {/*                                        <Select.Option value="advanced">Ахисан</Select.Option>*/}
                {/*                                    </Select>*/}
                {/*                                </Form.Item>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Үнэ'*/}
                {/*                                    fieldKey='price_editz'*/}
                {/*                                >*/}
                {/*                                    <InputNumber*/}
                {/*                                        size="middle"*/}
                {/*                                        style={{width: '100%'}}*/}
                {/*                                        name='price'*/}
                {/*                                        min={0}*/}
                {/*                                        max={1000000000}*/}
                {/*                                        value={lesson.price ? lesson.price.toString().replace(/\$\s?|(,*)/g, '') : '0'.replace(/\$\s?|(,*)/g, '')}*/}
                {/*                                        formatter={value => `${value}₮`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                {/*                                        onChange={this.onChangeHandle2.bind(this, 'price')}*/}
                {/*                                    />*/}
                {/*                                </Form.Item>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Хямдрал'*/}
                {/*                                    fieldKey='sale_editz'*/}
                {/*                                >*/}
                {/*                                    <InputNumber*/}
                {/*                                        size="middle"*/}
                {/*                                        style={{width: '100%'}}*/}
                {/*                                        name='sale'*/}
                {/*                                        min={0}*/}
                {/*                                        max={1000000000}*/}
                {/*                                        value={lesson.sale ? lesson.sale.toString().replace(/\$\s?|(,*)/g, '') : '0'.replace(/\$\s?|(,*)/g, '')}*/}
                {/*                                        formatter={value => `${value}₮`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                {/*                                        onChange={this.onChangeHandle2.bind(this, 'sale')}*/}
                {/*                                    />*/}
                {/*                                </Form.Item>*/}
                {/*                            </Form>*/}
                {/*                        </div>*/}
                {/*                        :*/}
                {/*                        null*/}
                {/*                }*/}
                {/*                {*/}
                {/*                    steps[current].content === 'requirement-content' ?*/}
                {/*                        <div className='requirement-content'>*/}
                {/*                            <Form>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Шаардлагатай зүйлс'*/}
                {/*                                >*/}
                {/*                                    <div>*/}
                {/*                                        <div className='orts-outer'>*/}
                {/*                                            {this.state.requirementsArray && this.state.requirementsArray.length > 0 ?*/}
                {/*                                                this.state.requirementsArray.map((run, idx) =>*/}
                {/*                                                    <div className='orts-inner' key={idx + 'afro'}>*/}
                {/*                                                        {`${idx + 1}. ${run}`}*/}
                {/*                                                        <div className='action'*/}
                {/*                                                             onClick={this.removeSingleOrts.bind(this, idx, 'requirement')}>*/}
                {/*                                                            <CloseCircleFilled/></div>*/}
                {/*                                                    </div>*/}
                {/*                                                )*/}
                {/*                                                :*/}
                {/*                                                <div className='orts-inner' key='no-orts'*/}
                {/*                                                     style={{opacity: '0.7'}}>*/}
                {/*                                                    Шаардлагатай зүйлсийг оруулаагүй байна.*/}
                {/*                                                </div>*/}
                {/*                                            }*/}
                {/*                                        </div>*/}
                {/*                                        <Input*/}
                {/*                                            type="text"*/}
                {/*                                            ref="textInput"*/}
                {/*                                            name="requirement"*/}
                {/*                                            placeholder=''*/}
                {/*                                            style={{width: '100%', marginBottom: 10}}*/}
                {/*                                            value={this.state.requirement}*/}
                {/*                                            onChange={this.changeState.bind(this)}*/}
                {/*                                        />*/}
                {/*                                        <Button size='small' style={{width: 120, float: 'right'}}*/}
                {/*                                                onClick={this.addSingleOrts.bind(this, 'requirement')}>*/}
                {/*                                            <PlusOutlined/> Нэмэх*/}
                {/*                                        </Button>*/}
                {/*                                    </div>*/}
                {/*                                </Form.Item>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Сурах зүйлс'*/}
                {/*                                >*/}
                {/*                                    <div>*/}
                {/*                                        <div className='orts-outer'>*/}
                {/*                                            {this.state.learn_check_listArray && this.state.learn_check_listArray.length > 0 ?*/}
                {/*                                                this.state.learn_check_listArray.map((run, idx) =>*/}
                {/*                                                    <div className='orts-inner' key={idx + 'afro'}>*/}
                {/*                                                        {`${idx + 1}. ${run}`}*/}
                {/*                                                        <div className='action'*/}
                {/*                                                             onClick={this.removeSingleOrts.bind(this, idx, 'learn_check_list')}>*/}
                {/*                                                            <CloseCircleFilled/></div>*/}
                {/*                                                    </div>*/}
                {/*                                                )*/}
                {/*                                                :*/}
                {/*                                                <div className='orts-inner' key='no-orts'*/}
                {/*                                                     style={{opacity: '0.7'}}>*/}
                {/*                                                    Сурах зүйлсийг оруулаагүй байна.*/}
                {/*                                                </div>*/}
                {/*                                            }*/}
                {/*                                        </div>*/}
                {/*                                        <Input*/}
                {/*                                            type="text"*/}
                {/*                                            ref="textInput"*/}
                {/*                                            name="learn_check_list"*/}
                {/*                                            placeholder=''*/}
                {/*                                            style={{width: '100%', marginBottom: 10}}*/}
                {/*                                            value={this.state.learn_check_list}*/}
                {/*                                            onChange={this.changeState.bind(this)}*/}
                {/*                                        />*/}
                {/*                                        <Button size='small' style={{width: 120, float: 'right'}}*/}
                {/*                                                onClick={this.addSingleOrts.bind(this, 'learn_check_list')}>*/}
                {/*                                            <PlusOutlined/> Нэмэх*/}
                {/*                                        </Button>*/}
                {/*                                    </div>*/}
                {/*                                </Form.Item>*/}
                {/*                            </Form>*/}
                {/*                        </div>*/}
                {/*                        :*/}
                {/*                        null*/}
                {/*                }*/}
                {/*                {*/}
                {/*                    steps[current].content === 'content-content' ?*/}
                {/*                        <div className='content-content'>*/}
                {/*                            <Form>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Том зураг'*/}
                {/*                                    labelCol={{span: 4}}*/}
                {/*                                    help='Зурагны хэмжээ хамгийн багадаа 1200 x 450 байх'*/}
                {/*                                    style={{marginBottom: 10}}*/}
                {/*                                >*/}
                {/*                                    <div>*/}
                {/*                                        <Button onClick={this.openMediaLib.bind(this, 'image', 'lesson')} style={{marginBottom: 10}}>*/}
                {/*                                            <UploadOutlined /> {lessonImage && lessonImage._id? 'Солих' : 'Зураг'}*/}
                {/*                                        </Button>*/}
                {/*                                        {lessonImage && lessonImage._id ?*/}
                {/*                                            <div className='uploaded-i'>*/}
                {/*                                                    <span className='uploaded-i-image'>*/}
                {/*                                                        <img src={`${config.get('hostMedia')}${lessonImage.path}`} />*/}
                {/*                                                    </span>*/}
                {/*                                                <span onClick={this.removeUploadedFile.bind(this, 'lessonImage')} className='uploaded-i-action'>*/}
                {/*                                                        <DeleteFilled />*/}
                {/*                                                    </span>*/}
                {/*                                            </div>*/}
                {/*                                            :*/}
                {/*                                            null*/}
                {/*                                        }*/}
                {/*                                    </div>*/}
                {/*                                </Form.Item>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Жижиг зураг'*/}
                {/*                                    labelCol={{span: 4}}*/}
                {/*                                    help='Зурагны хэмжээ хамгийн багадаа 800 x 450 байх'*/}
                {/*                                    style={{marginBottom: 10}}*/}
                {/*                                >*/}
                {/*                                    <div>*/}
                {/*                                        <Button onClick={this.openMediaLib.bind(this, 'image', 'lessonSmall')} style={{marginBottom: 10}}>*/}
                {/*                                            <UploadOutlined /> {lessonSmallImage && lessonSmallImage._id? 'Солих' : 'Зураг'}*/}
                {/*                                        </Button>*/}
                {/*                                        {lessonSmallImage && lessonSmallImage._id ?*/}
                {/*                                            <div className='uploaded-i'>*/}
                {/*                                                    <span className='uploaded-i-image'>*/}
                {/*                                                        <img src={`${config.get('hostMedia')}${lessonSmallImage.path}`} />*/}
                {/*                                                    </span>*/}
                {/*                                                <span onClick={this.removeUploadedFile.bind(this, 'lessonSmallImage')} className='uploaded-i-action'>*/}
                {/*                                                        <DeleteFilled />*/}
                {/*                                                    </span>*/}
                {/*                                            </div>*/}
                {/*                                            :*/}
                {/*                                            null*/}
                {/*                                        }*/}
                {/*                                    </div>*/}
                {/*                                </Form.Item>*/}
                {/*                                <Form.Item*/}
                {/*                                    label='Бичлэг'*/}
                {/*                                    labelCol={{span: 4}}*/}
                {/*                                    help='Танилцуулга бичлэг бөгөөд худалдаж аваагүй хүмүүс үзэх боломжтой.'*/}
                {/*                                    className='upload-m'*/}
                {/*                                >*/}
                {/*                                    <div>*/}
                {/*                                        <Button onClick={this.openMediaLib.bind(this, 'video', 'lesson_video')} style={{marginBottom: 10}}>*/}
                {/*                                            <UploadOutlined /> {lessonVideo && lessonVideo._id? 'Солих' : 'Бичлэг'}*/}
                {/*                                        </Button>*/}
                {/*                                        {lessonVideo && lessonVideo._id ?*/}
                {/*                                            <div className='uploaded-v'>*/}
                {/*                                                    <span className='uploaded-v-image'>*/}
                {/*                                                        <img src={`${config.get('hostMedia')}${lessonVideo.thumbnail}`} />*/}
                {/*                                                    </span>*/}
                {/*                                                <span className='uploaded-v-name'>*/}
                {/*                                                        {lessonVideo.original_name}*/}
                {/*                                                    </span>*/}
                {/*                                                <span onClick={this.removeUploadedFile.bind(this, 'lessonVideo')} className='uploaded-v-action'>*/}
                {/*                                                        <DeleteFilled />*/}
                {/*                                                    </span>*/}
                {/*                                            </div>*/}
                {/*                                            :*/}
                {/*                                            null*/}
                {/*                                        }*/}
                {/*                                    </div>*/}
                {/*                                </Form.Item>*/}
                {/*                            </Form>*/}
                {/*                        </div>*/}
                {/*                        :*/}
                {/*                        null*/}
                {/*                }*/}
                {/*            </Col>*/}
                {/*            <Col md={6}/>*/}
                {/*        </Row>*/}

                {/*    </div>*/}
                {/*    <div className="steps-action">*/}
                {/*        {current > 0 && (*/}
                {/*            <Button style={{ margin: '0 8px' }} loading={submitLessonLoader} onClick={this.prev.bind(this)}>*/}
                {/*                <CaretLeftFilled /> Өмнөх*/}
                {/*            </Button>*/}
                {/*        )}*/}
                {/*        {current < steps.length - 1 && (*/}
                {/*            <Button type="primary" loading={submitLessonLoader} onClick={this.next.bind(this)}>*/}
                {/*                <CaretRightFilled /> Дараах*/}
                {/*            </Button>*/}
                {/*        )}*/}
                {/*        {current === steps.length - 1 && (*/}
                {/*            <Button type="primary" loading={submitLessonLoader} onClick={this.submitLesson.bind(this)}>*/}
                {/*                <CheckCircleFilled /> Хадгалах*/}
                {/*            </Button>*/}
                {/*        )}*/}
                {/*    </div>*/}


                {/*    {this.state.mediaType !== ''?*/}
                {/*        <MediaLib*/}
                {/*            visible={this.state.mediaType != ''}*/}
                {/*            multi={false}*/}
                {/*            onOk={this.chooseMedia.bind(this)}*/}
                {/*            type={this.state.mediaType}*/}
                {/*            dimension={{width:1200, height: 450}}*/}
                {/*            forWhat={this.state.forWhat}*/}
                {/*            onHide={() => this.setState({mediaType: ''})}*/}
                {/*        />*/}
                {/*        :*/}
                {/*        null*/}
                {/*    }*/}
                {/*</div>*/}
            </Card>

        );
    }
}

export default  connect(reducer)(DepartmentSingle);