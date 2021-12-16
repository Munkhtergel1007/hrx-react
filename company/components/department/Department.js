import React, {Component} from "react";
import { connect } from 'react-redux';
import config from "../../config";
import moment from "moment";
import * as actions from "../../actions/department_actions";
import LessonEdit from "./DepartmentSingle";
import { Link } from 'react-router-dom';

const reducer = ({ main, department }) => ({ main, department });
import {Card, Button, Table, Popconfirm, Tag, Input, Badge, Select, List} from 'antd';
import { SearchOutlined, DeleteFilled, PlusOutlined, UnorderedListOutlined, EditFilled, CloseOutlined, ExclamationCircleOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, StopOutlined } from '@ant-design/icons'

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 0,
            pageSize:10,
            filter_publish:'',
        };
        // this.delete = this.delete.bind(this)
    }
    componentDidMount() {
        // this.props.dispatch(actions.getLesson({pageNum: this.state.pageNum, pageSize: this.state.pageSize}));
    }
    // openModal(data) {
    //     const { department:{categories, teacherCount} } = this.props;
    //     // if(!categories || categories.length < 1){
    //     //     return config.get('emitter').emit('warning', ("Эхлээд ангилал үүсгэнэ үү!"));
    //     // }
    //     // if(teacherCount < 1){
    //     //     return config.get('emitter').emit('warning', ("Эхлээд багш үүсгэнэ үү!"));
    //     // }
    //     // this.setState({ search_user: '', selectedMember: data.teacher, foodRequirementsArray: data.requirements, requirement: '', learn_check_listArray: data.learn_check_list, learn_check_list: '' });
    //     this.props.dispatch(actions.openLessonModal(data));
    // }
    // closeModal() {
    //     this.props.dispatch(actions.closeLessonModal());
    // }
    // tableOnChange(data){
    //     this.setState({pageNum : data - 1});
    //     let cc = {
    //         pageNum:data - 1,
    //         pageSize:this.state.pageSize,
    //         filter_publish: this.state.filter_publish
    //         // search: this.state.search
    //     };
    //     this.props.dispatch(actions.getLesson(cc));
    // }
    // delete(id){
    //     this.props.dispatch(actions.deleteLesson({_id:id, pageSize: this.state.pageSize, pageNum: this.state.pageNum}));
    // }
    // getChecked(id, publish){
    //     this.props.dispatch(actions.getChecked({_id:id, publish:publish}));
    // }
    // publish(id, publish){
    //     this.props.dispatch(actions.publishLesson({_id:id, publish:publish}));
    // }
    // unPublish(id){
    //     this.props.dispatch(actions.unPublish({_id:id}));
    // }
    // changeState(e, value){
    //     if (typeof e === 'string' || e instanceof String) {
    //         this.setState({ [e]: value});
    //     } else {
    //         this.setState({ [e.target.name]: e.target.value});
    //     }
    // }
    // filterHandler(){
    //     let cc  = {
    //         pageNum: this.state.pageNum,
    //         pageSize: this.state.pageSize,
    //         filter_publish: this.state.filter_publish
    //     };
    //     this.props.dispatch(actions.getLesson(cc));
    // }
    render() {
        let {  main:{user}, department:{status, openModal, lesson, lessons, all, openLevelSingle} } = this.props;
        let pagination = {
            total : all,
            current: this.state.pageNum + 1,
            pageSize : this.state.pageSize,
            position: 'bottom',
            showSizeChanger: false,
            key: 'pagin'
        };
        // const columns = [
        //     {
        //         key: 'num',
        //         title: '№',
        //         render: (text, record, idx) => (
        //             (this.state.pageNum * this.state.pageSize) + idx + 1
        //         ),
        //     },
        //     {
        //         key: 'name',
        //         title: 'Нэр',
        //         render: (text, record) => (
        //             <a href={`/lesson/${record.slug}`} target='_blank'>
        //                 {record.title ? record.title : '-'}
        //             </a>
        //         ),
        //     },
        //     {
        //         key: 'preview',
        //         title: 'Өөрчлөлт',
        //         render: (text, record) => (
        //             <a href={`/lesson/${record.slug}?type=preview`} target='_blank'>
        //                 Шинэчлэлт харах
        //             </a>
        //         ),
        //     },
        //     {
        //         key: 'created',
        //         title: 'Огноо',
        //         render: (text, record) => (
        //             record.created ? moment(record.created).format('YYYY-MM-DD') : '-'
        //         ),
        //     },
        //     {
        //         key: 'action',
        //         title: 'Үйлдэл',
        //         render: (text, record) => (
        //             <div className="lesson-tools" key='action-div'>
        //                 <Link to={`/merchant/lessons/levels/${record.slug}`}>
        //                     <Button size={"small"} style={{marginRight: 10}} key={record._id+'levels'} loading={!!record.loading}
        //                             // onClick={this.openLevelSingle.bind(this, record)}
        //                     >
        //                         <UnorderedListOutlined /> Хөтөлбөрүүд
        //                     </Button>
        //                 </Link>
        //                 <Link to={`/merchant/lesson/${record.slug}`}>
        //                     <Button size={"small"} style={{marginRight: 10}} key={record._id+'edit'} loading={!!record.loading}
        //                         // onClick={this.openLevelSingle.bind(this, record)}
        //                     >
        //                         <EditFilled /> Засах
        //                     </Button>
        //                 </Link>
        //                 {/*<Button size={"small"} style={{marginRight: 10}} key={record._id+'edit'} loading={!!record.loading}*/}
        //                 {/*        onClick = {this.openModal.bind(this, record )}*/}
        //                 {/*>*/}
        //                 {/*    <EditFilled /> Засах*/}
        //                 {/*</Button>*/}
        //                 <Popconfirm
        //                     title={`Та устгах гэж байна!`}
        //                     onConfirm={this.delete.bind(this, record._id)}
        //                     okText="Усгах"
        //                     placement="left"
        //                     cancelText="Болих"
        //                 >
        //                     <Button type={"primary"} style={{marginRight: 10}} key={record._id} danger size={"small"} loading={!!record.loading}>
        //                         <DeleteFilled/> Устгах
        //                     </Button>
        //                 </Popconfirm>
        //                 {!record.publish || record.publish === 'new'?
        //                     <Popconfirm
        //                         title={`Админаар шалгуулах гэж байна!`}
        //                         onConfirm={this.getChecked.bind(this, record._id, 'pending')}
        //                         okText="Шалгуулах"
        //                         placement="left"
        //                         cancelText="Болих"
        //                     >
        //                         <Button type={"default"} key={record._id+'publish'} danger size={"small"} loading={!!record.loading}>
        //                             <ExclamationCircleOutlined /> Шалгуулах
        //                         </Button>
        //                     </Popconfirm>
        //                     :
        //                     record.publish === 'pending'?
        //                         <Popconfirm
        //                             title={`Шалгуулахаа болих!`}
        //                             onConfirm={this.getChecked.bind(this, record._id, 'new')}
        //                             okText="Тийм"
        //                             placement="left"
        //                             cancelText="Үгүй"
        //                         >
        //                             <Button type={"dashed"} key={record._id+'publish'} size={"small"} loading={!!record.loading}>
        //                                 <ClockCircleOutlined /> Шалгагдаж байна
        //                             </Button>
        //                         </Popconfirm>
        //                         :
        //                         record.publish === 'approved'?
        //                         <Popconfirm
        //                             title={`Та хичээлээ нийтлэх гэж байна!`}
        //                             onConfirm={this.publish.bind(this, record._id, 'publish')}
        //                             okText="Нийтлэх"
        //                             placement="left"
        //                             cancelText="Болих"
        //                         >
        //                             <Button type={"primary"} key={record._id+'publish'} size={"small"} loading={!!record.loading}>
        //                                 <QuestionCircleOutlined /> {record.lessonPublish && record.lessonPublish.publish === 'publish' ? 'Шинэчлэх' : 'Нийтлэх'}
        //                             </Button>
        //                         </Popconfirm>
        //                             :
        //                             record.publish === 'unapproved'?
        //                                 <Popconfirm
        //                                     title={`Админаар дахин шалгуулах!`}
        //                                     onConfirm={this.getChecked.bind(this, record._id, 'pending')}
        //                                     okText="Шалгуулах"
        //                                     placement="left"
        //                                     cancelText="Болих"
        //                                 >
        //                                     <Button type={"default"} key={record._id+'publish'} danger size={"small"} loading={!!record.loading}>
        //                                         <CloseCircleOutlined /> Буцаагдсан
        //                                     </Button>
        //                                 </Popconfirm>
        //                                 :
        //                                 record.publish === 'publish'?
        //
        //                                     <Popconfirm
        //                                         title={`Нийтлэхээ болих!`}
        //                                         onConfirm={this.unPublish.bind(this, record._id)}
        //                                         okText="Тийм"
        //                                         placement="left"
        //                                         cancelText="Үгүй"
        //                                     >
        //                                         <Button type={"primary"} key={record._id+'publish'} size={"small"} loading={!!record.loading}>
        //                                             <CheckCircleOutlined /> Нийтэлсэн
        //                                         </Button>
        //                                     </Popconfirm>
        //                                     :
        //                                     null
        //                 }
        //             </div>
        //         ),
        //         width: 258
        //     },
        //     {
        //         key: 'Progress',
        //         title: 'Нийтэлсэн эсэх',
        //         render: (text, record) => (
        //             record.lessonPublish && record.lessonPublish.publish === 'publish'?
        //                 <Tag color="success">Нийтлэгдсэн</Tag>
        //                 :
        //                 <Tag color="error">Нийтлээгүй</Tag>
        //         ),
        //         width: 258
        //     },
        // ];
        // // List start
        // const listData = [];
        // if(lessons && lessons.length>0){
        //     lessons.map(r => listData.push({
        //         // href: 'https://ant.design',
        //         key: r._id,
        //         title:
        //             <span>
        //                 {r.lessonPublish && r.lessonPublish.status && r.lessonPublish.status === 'active' ?
        //                     <a style={{marginRight:20}} href={`/lesson/${r.slug}`} target='_blank'>
        //                         {r.title ? r.title : '-'}
        //                     </a>
        //                     :
        //                     <span style={{marginRight: 20}}>{r.title ? r.title : '-'}</span>
        //                 }
        //                 {/* <a href={`/lesson/${r.slug}?type=preview`} target='_blank'>
        //                     Шинэчлэлт харах
        //                 </a> */}
        //                 <Link to={`/lesson/${r.slug}?type=preview`} target='_blank'>
        //                     <Button
        //                         type="primary"
        //                         size={"small"}
        //                         icon={<SearchOutlined />}
        //
        //                     >
        //                         Урьдчилж харах
        //                     </Button>
        //                 </Link>
        //
        //             </span>
        //         ,
        //         description:
        //             r.created ? moment(r.created).format('YYYY-MM-DD') : '-'
        //         ,
        //         lessonPublish: r.lessonPublish,
        //         content:
        //             <div className="lesson-tools" key='action-div'>
        //                 <Link to={`/merchant/lessons/levels/${r.slug}`}>
        //                     <Button size={"small"} style={{marginRight: 10}} key={r._id+'levels'} loading={!!r.loading}
        //                     >
        //                         <UnorderedListOutlined /> Хөтөлбөрүүд
        //                     </Button>
        //                 </Link>
        //                 <Link to={`/merchant/lesson/${r.slug}`}>
        //                     <Button size={"small"} style={{marginRight: 10}} key={r._id+'edit'} loading={!!r.loading}
        //                     >
        //                         <EditFilled /> Засах
        //                     </Button>
        //                 </Link>
        //                 <Popconfirm
        //                     title={`Та устгах гэж байна!`}
        //                     onConfirm={this.delete.bind(this, r._id)}
        //                     okText="Усгах"
        //                     placement="left"
        //                     cancelText="Болих"
        //                 >
        //                     <Button type={"primary"} style={{marginRight: 10}} key={r._id} danger size={"small"} loading={!!r.loading}>
        //                         <DeleteFilled/> Устгах
        //                     </Button>
        //                 </Popconfirm>
        //                 {!r.publish || r.publish === 'new'?
        //                     <Popconfirm
        //                         title={`Админаар шалгуулах гэж байна!`}
        //                         onConfirm={this.getChecked.bind(this, r._id, 'pending')}
        //                         okText="Шалгуулах"
        //                         placement="left"
        //                         cancelText="Болих"
        //                     >
        //                         <Button type={"default"} key={r._id+'publish'} danger size={"small"} loading={!!r.loading}>
        //                             <ExclamationCircleOutlined /> Шалгуулах
        //                         </Button>
        //                     </Popconfirm>
        //                     :
        //                     r.publish === 'pending'?
        //                         <Popconfirm
        //                             title={`Шалгуулахаа болих!`}
        //                             onConfirm={this.getChecked.bind(this, r._id, 'new')}
        //                             okText="Тийм"
        //                             placement="left"
        //                             cancelText="Үгүй"
        //                         >
        //                             <Button type={"dashed"} key={r._id+'publish'} size={"small"} loading={!!r.loading}>
        //                                 <ClockCircleOutlined /> Шалгагдаж байна
        //                             </Button>
        //                         </Popconfirm>
        //                         :
        //                             r.publish === 'approved'?
        //                                 user.type && user.type === '20/80'?
        //                                     <Button type={"primary"} key={r._id+'publish'} size={"small"}>
        //                                         <QuestionCircleOutlined /> Зөвшөөрөгдсөн
        //                                     </Button>
        //                                     :
        //                                     <Popconfirm
        //                                         title={`Та хичээлээ нийтлэх гэж байна!`}
        //                                         onConfirm={this.publish.bind(this, r._id, 'publish')}
        //                                         okText="Нийтлэх"
        //                                         placement="left"
        //                                         cancelText="Болих"
        //                                     >
        //                                         <Button type={"primary"} key={r._id+'publish'} size={"small"} loading={!!r.loading}>
        //                                             <QuestionCircleOutlined /> {r.lessonPublish && r.lessonPublish.publish === 'publish' ? 'Шинэчлэх' : 'Нийтлэх'}
        //                                         </Button>
        //                                     </Popconfirm>
        //                             :
        //                             r.publish === 'unapproved'?
        //                                 <Popconfirm
        //                                     title={`Админаар дахин шалгуулах!`}
        //                                     onConfirm={this.getChecked.bind(this, r._id, 'pending')}
        //                                     okText="Шалгуулах"
        //                                     placement="left"
        //                                     cancelText="Болих"
        //                                 >
        //                                     <Button type={"default"} key={r._id+'publish'} danger size={"small"} loading={!!r.loading}>
        //                                         <CloseCircleOutlined /> Буцаагдсан
        //                                     </Button>
        //                                 </Popconfirm>
        //                                 :
        //                                 r.publish === 'publish'?
        //
        //                                     <Popconfirm
        //                                         title={`Нийтлэхээ болих!`}
        //                                         onConfirm={this.unPublish.bind(this, r._id)}
        //                                         okText="Тийм"
        //                                         placement="left"
        //                                         cancelText="Үгүй"
        //                                     >
        //                                         <Button type={"primary"} key={r._id+'publish'} size={"small"} loading={!!r.loading}>
        //                                             <CheckCircleOutlined /> Нийтэлсэн
        //                                         </Button>
        //                                     </Popconfirm>
        //                                     :
        //                                     null
        //                 }
        //             </div>
        //         ,
        //     }));
        // }

        //List end
        return (
            <Card
                title={`${openLevelSingle? lesson.title : 'Хэлтэс'}`}
                bordered={true}
                loading={status}
                style={{margin:30}}
                extra={
                    <Link to={`/department/new`}>
                        <Button type="primary" key='forwardButton' icon={<PlusOutlined />} >
                            Хэлтэс
                        </Button>
                    </Link>
                }
            >
                        <React.Fragment>
                            {/*<div style={{marginBottom: 20}}>*/}
                            {/*    /!*<Input addonAfter={<CloseCircleFilled style={{color:'white'}} onClick={() => this.setState({search:''})} />} maxLength={60} size='small' placeholder='Хайх /бүх талбар/' style={{width: 200, marginRight: 20}} value={this.state.search} name='search' onChange={(e) => this.setState({search: e.target.value})} />*!/*/}
                            {/*    <Select style={{width: 142, marginRight: 20}} size='small' name='filter_publish' value={this.state.filter_publish} onChange={(e) => this.setState({filter_publish: e})}*/}
                            {/*    >*/}
                            {/*        <Select.Option value=''>Бүгд</Select.Option>*/}
                            {/*        <Select.Option value='published'>Нийтэлсэн</Select.Option>*/}
                            {/*        <Select.Option value='unpublished'>Нийтлээгүй</Select.Option>*/}
                            {/*        /!*<Option value='pr'>Premium хэрэглэгч</Option>*!/*/}
                            {/*        /!*<Option value='pq'>Premium хүсэлттэй хэрэглэгч</Option>*!/*/}
                            {/*    </Select>*/}
                            {/*    <Button loading={status} type="primary" size='small' icon={<SearchOutlined />} onClick={this.filterHandler.bind(this)} >Хайх</Button>*/}
                            {/*</div>*/}

                            {/*<List*/}
                            {/*    itemLayout="vertical"*/}
                            {/*    size="large"*/}
                            {/*    pagination={{*/}
                            {/*        onChange: page => this.tableOnChange(page),*/}
                            {/*        total : all,*/}
                            {/*        current: this.state.pageNum + 1,*/}
                            {/*        pageSize : this.state.pageSize,*/}
                            {/*        position: 'bottom',*/}
                            {/*        showSizeChanger: false,*/}
                            {/*        size: 'small',*/}
                            {/*        key: 'pagins'*/}
                            {/*    }}*/}
                            {/*    */}
                            {/*    dataSource={listData}*/}
                            {/*    // footer={*/}
                            {/*    //     <div>*/}
                            {/*    //         <b>ant design</b> footer part*/}
                            {/*    //     </div>*/}
                            {/*    // }*/}
                            {/*    renderItem={(item, idx) => (*/}
                            {/*        <Badge.Ribbon */}
                            {/*            color={item.lessonPublish && item.lessonPublish.publish === 'publish' ? 'green' : 'red'} */}
                            {/*            text={item.lessonPublish && item.lessonPublish.publish === 'publish' ? "Нийтлэгдсэн" : "Нийтлээгүй"}*/}
                            {/*        >*/}
                            {/*            <Card>*/}
                            {/*                <List.Item*/}
                            {/*                    key={item._id}*/}
                            {/*                    // actions={[*/}
                            {/*                    //     <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,*/}
                            {/*                    //     <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,*/}
                            {/*                    //     <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,*/}
                            {/*                    // ]}*/}
                            {/*                    // extra={*/}
                            {/*                    //     item.lessonPublish && item.lessonPublish.publish === 'publish'?*/}
                            {/*                    //         <Tag color="success">Нийтлэгдсэн</Tag>*/}
                            {/*                    //         :*/}
                            {/*                    //         <Tag color="error">Нийтлээгүй</Tag>*/}
                            {/*                    // }*/}
                            {/*                >*/}
                            {/*                <List.Item.Meta*/}
                            {/*                    // avatar={<Avatar src={item.avatar} />}*/}
                            {/*                    title={<a href={item.href}>{item.title}</a>}*/}
                            {/*                    description={item.description}*/}
                            {/*                />*/}
                            {/*                    {item.content}*/}
                            {/*                </List.Item>*/}
                            {/*            </Card>*/}
                            {/*        </Badge.Ribbon>*/}
                            {/*    )}*/}
                            {/*/>*/}
                            {/*<Table size="small" dataSource={lessons} columns={columns} onChange={this.tableOnChange.bind(this)} pagination={pagination} />*/}
                        </React.Fragment>
            </Card>
        );
    }
}

export default  connect(reducer)(Department);