import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {locale} from "../../lang";
import config, {
    hasAction,
} from "../../config";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
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
    Popconfirm,
    Empty,
    List,
    Table,
    Avatar,
    DatePicker,
} from 'antd';
import {
    addTag,
    getAllTags,
    deleteTag,
    addSubTag,
    deleteSubTag,
} from '../../actions/settings_actions';
import {SwatchesPicker} from 'react-color'
const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class Tags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagVisible: false,
            _id: '',
            title: '',
            desc: '',
            color: '',
            editing: false,
            subId: '',
            editingSub: false
        }
    }
    componentDidMount() {
        let {main: {employee}} = this.props;
        if(!hasAction(['read_tags'], employee)){
            this.props.history.replace('/not-found');
        } else {
            this.props.dispatch(getAllTags())
        }
    }
    handleCancel() {
        this.setState({
            tagVisible: false,
            _id: '',
            title: '',
            desc: '',
            color: '',
            editing: false,
            subId: '',
            editingSub: false
        })
    }
    addTag(tag, vals) {
        if(tag === 'main') {
            this.props.dispatch(addTag({...vals, id: this.state._id})).then(c => {
                if(c.json.success) {
                    this.handleCancel()
                }
            })
        } else {
            this.props.dispatch(addSubTag({...vals, parent: this.state._id, id: this.state.subId})).then(c => {
                if(c.json.success) {
                    this.handleCancel()
                }
            })
        }
    }
    render() {
        const {
            main: {
                employee
            },
            settings: {
                tags,
                gettingTags,
                deletingTag,
                addingTag
            }
        } = this.props
        const {
            title,
            desc,
            color,
            editing
        } = this.state
        return (
            <React.Fragment>
                <Row justify="center" align="center" style={{width: '100%'}} className={'settings-roles'}>
                    <Col span={18}>
                        <div style={{width: '100%', height: 30, marginBottom: 30}}>
                            <Button onClick={() => this.setState({tagVisible: true, editingSub: false})} type='primary' style={{float: 'right'}} icon={<PlusOutlined />}>
                                {locale('common_tags.T_Uusgeh')}
                            </Button>
                        </div>
                        {
                            (gettingTags || addingTag || deletingTag) ?
                                <div style={{textAlign: 'center', marginTop: 30}}>
                                    <Spin />
                                </div>
                            : tags.length > 0 ?
                                tags.map(item =>
                                    <Table
                                        title={() =>
                                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <div className={'tag-table-title'}>
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            avatar={<Avatar style={{backgroundColor: item.color}} />}
                                                            title={item.title}
                                                            description={item.desc}
                                                            style={{display: 'flex', alignItems: 'center'}}
                                                        />
                                                    </List.Item>
                                                </div>
                                                {
                                                    hasAction(['edit_tags'], employee) ?
                                                        <div>
                                                            <Button
                                                                type='default'
                                                                style={{marginRight: '10px'}}
                                                                shape='circle'
                                                                icon={<EditOutlined />}
                                                                size={'small'}
                                                                onClick={() => this.setState({
                                                                    ...item,
                                                                    tagVisible: true,
                                                                    editing: true,
                                                                    editingSub: false
                                                                })}
                                                            />
                                                            {
                                                                hasAction(['delete_tags'], employee) ?
                                                                    <Popconfirm
                                                                        title={'Тэмдэглэгээ устгах уу?'}
                                                                        okText={'Тийм'}
                                                                        cancelText={'Үгүй'}
                                                                        onConfirm={() => this.props.dispatch(deleteTag({id: item._id}))}
                                                                    >
                                                                        <Button
                                                                            type='danger'
                                                                            size={'small'}
                                                                            style={{marginRight: '10px'}}
                                                                            icon={<DeleteOutlined />}
                                                                            shape='circle'
                                                                        />
                                                                    </Popconfirm>
                                                                : null
                                                            }
                                                            <Button
                                                                type='primary'
                                                                size={'small'}
                                                                icon={<PlusOutlined />}
                                                                onClick={() => this.setState({
                                                                    _id: item._id,
                                                                    tagVisible: true,
                                                                    editingSub: true
                                                                })}
                                                            >
                                                                Дэд тэмдэглэгээ
                                                            </Button>
                                                        </div>
                                                    : null
                                                }
                                            </div>
                                        }
                                        dataSource={item.sub_tags}
                                        bordered={true}
                                        pagination={false}
                                        style={{marginBottom: 20}}
                                        columns={[
                                            {
                                                title: '№',
                                                key: '№',
                                                width: 50,
                                                render: (render, text, idx) => idx + 1
                                            },
                                            {
                                                title: locale('common_tags.Ner'),
                                                key: 'Нэр',
                                                render: render => render.title
                                            },
                                            {
                                                title: locale('common_tags.Tailbar'),
                                                key: 'Тайлбар',
                                                ellipsis: true,
                                                render: render => render.desc
                                            },
                                            hasAction(['edit_tags'], employee) ?
                                            {
                                                title: locale('common_tags.Uildel'),
                                                key: 'actions',
                                                width: 170,
                                                render: (render) =>
                                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                                        <Button
                                                            type='default'
                                                            size='small'
                                                            onClick={() => this.setState({
                                                                ...render,
                                                                tagVisible: true,
                                                                editing: true,
                                                                editingSub: true,
                                                                _id: item._id,
                                                                subId: render._id
                                                            })}
                                                        >
                                                            Засах
                                                        </Button>
                                                        {
                                                            hasAction(['delete_tags'], employee) ?
                                                                <Popconfirm
                                                                    title={'Дэд тэмдэглэгээ устгах уу?'}
                                                                    okText={'Тийм'}
                                                                    cancelText={'Үгүй'}
                                                                    onConfirm={() => this.props.dispatch(deleteSubTag({id: render._id, parent: item._id}))}
                                                                >
                                                                    <Button
                                                                        type='danger'
                                                                        size='small'
                                                                    >
                                                                        Устгах
                                                                    </Button>
                                                                </Popconfirm>
                                                            : null
                                                        }
                                                    </div>
                                            }
                                            : {}
                                        ]}
                                    />
                                )
                            : <Empty />
                        }
                    </Col>
                </Row>
                <Drawer
                    visible={this.state.tagVisible}
                    width={500}
                    maskClosable={false}
                    onClose={this.handleCancel.bind(this)}
                    title={editing ? 'Тэмдэглэгээ засах' : locale('common_tags.T_Uusgeh')}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button
                                type='default'
                                style={{marginRight: '20px'}}
                                onClick={this.handleCancel.bind(this)}
                            >
                                {locale('common_tags.Bolih')}
                            </Button>
                            <Button
                                type='primary'
                                htmlType='submit'
                                form='tag'
                                // icon={<PlusOutlined />}
                            >
                                {editing ? 'Шинэчлэх' : locale('common_tags.Uusgeh')}
                            </Button>
                        </div>
                    }
                >
                    <div>
                        <Form
                            onFinish={this.state.editingSub ? this.addTag.bind(this, 'sub') : this.addTag.bind(this, 'main')}
                            layout='vertical'
                            id='tag'
                            fields={[
                                {name: 'title', value: title},
                                {name: 'desc', value: desc},
                                {name: 'color', value: color},
                            ]}
                        >
                            <Form.Item
                                label={locale('common_tags.Ner')}
                                rules={[
                                    {
                                        required: true,
                                        message: locale("common_tags.T_Ner oruulna uu")
                                    }
                                ]}
                                name='title'
                            >
                                <Input value={title} onChange={(e) => this.setState({title: e.target.value})} placeholder= {locale('common_tags.Ner')} />
                            </Form.Item>
                            <Form.Item
                                label={locale('common_tags.Tailbar')}
                                name='desc'
                                rules={[
                                    {
                                        required: this.state.editingSub,
                                        message: 'Тайлбар оруулна уу'
                                    }
                                ]}
                            >
                                <Input.TextArea value={desc} rows={4} onChange={(e) => this.setState({desc: e.target.value})} placeholder= {locale('common_tags.Tailbar')} />
                            </Form.Item>
                            {
                                this.state.editingSub ?
                                    null
                                :<Form.Item
                                    label={locale('common_tags.Ongo')}
                                    rules={[
                                        {
                                            required: true,
                                            message: locale('common_tags.T_O songono uu')
                                        }
                                    ]}
                                    name='color'
                                >
                                    <SwatchesPicker width={'100%'} color={color} onChangeComplete={(e) => this.setState({color: e.hex})} />
                                </Form.Item>
                            }
                        </Form>
                    </div>
                </Drawer>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(Tags);