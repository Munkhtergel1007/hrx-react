import React, {Component} from "react";
import config from "../../config";
import moment from "moment";
import {Button} from "antd";
import * as actions from "../../actions/orlogoZarlaga_actions";
import MyDrawer from "./MyDrawer";
class NothingComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerVisible: false,
            modalData:{},
        };
    }
    openModal(data = {}){
        this.setState({drawerVisible:true, modalData:data});
    }
    closeModal(){
        this.setState({drawerVisible:false, modalData:{}});
    }
    changinCons(){
        console.log('fjkslfjklesjil');
    }
    render() {
        const data = {
            _id: 'id34342',
            title: 'ene bol title 2',
            desription: '22 222'
        };
        let dis = this;
        const columns = [
            {
                tag:'input',
                tagProps: {
                    name: 'title',
                    style: {color: 'red', border: '2px solid red'},
                    // onChange: dis.changinCons.bind(dis)
                },
                name:'title',
            },
            {
                tag:'textArea',
                tagProps: {
                    name: 'description',
                    style: {color: 'pink', border: '2px solid pink'},
                    rows: 4,
                }
            },
        ];
        const asdf = [
            {
                tag: 'row',
                tagProps: {
                    gutter:20,
                    name:'row1'
                },
                child: [
                    {
                        tag: 'col',
                        name:'col1',
                        tagProps: {
                            span:12,
                        },
                        child: [
                            {
                                tag:'formItem',
                                tagProps:{
                                    label:'Гарчиг'
                                },
                                child:[
                                    {
                                        tag:'input',
                                        tagProps: {
                                            name: 'title',
                                            style: {color: 'red', border: '2px solid red'},
                                            // onChange: dis.changinCons.bind(dis)
                                        },
                                        name:'title',
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        tag: 'col',
                        name:'col2',
                        tagProps: {
                            span:12,
                        },
                        child: [
                            {
                                tag:'formItem',
                                tagProps:{
                                    label:'Тайлбар'
                                },
                                child:[
                                    {
                                        tag:'input',
                                        tagProps: {
                                            name: 'description',
                                            style: {color: 'red', border: '2px solid red'}
                                        },
                                        name:'description',
                                    },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                tag: 'row',
                tagProps: {
                    gutter:20,
                    name:'row2'
                },
                child: [
                    {
                        tag: 'col',
                        name:'col1',
                        tagProps: {
                            span:8,
                        },
                        child: [
                            {
                                tag:'formItem',
                                tagProps:{
                                    label:'Гарчиг'
                                },
                                child:[
                                    {
                                        tag:'input',
                                        tagProps: {
                                            name: 'title',
                                            style: {color: 'red', border: '2px solid red'},
                                            // onChange: dis.changinCons.bind(dis)
                                        },
                                        name:'title',
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        tag: 'col',
                        name:'col2',
                        tagProps: {
                            span:8,
                        },
                        child: [
                            {
                                tag:'formItem',
                                tagProps:{
                                    label:'Тайлбар'
                                },
                                child:[
                                    {
                                        tag:'input',
                                        tagProps: {
                                            name: 'description',
                                            style: {color: 'red', border: '2px solid red'}
                                        },
                                        name:'description',
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        tag: 'col',
                        name:'col3',
                        tagProps: {
                            span:8,
                        },
                        child: [
                            {
                                tag:'formItem',
                                tagProps:{
                                    label:'Тайлбар'
                                },
                                child:[
                                    {
                                        tag:'input',
                                        tagProps: {
                                            name: 'description',
                                            style: {color: 'red', border: '2px solid red'}
                                        },
                                        name:'description',
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
        const reverseDat = [
            {
                tag:'input',
                tagProps: {
                    name: 'title',
                    style: {color: 'red', border: '2px solid red'},
                    // onChange: dis.changinCons.bind(dis)
                },
                name:'title',
            },
        ];
        return (
            <React.Fragment>
                nothingComp
                <div>
                    <Button style={{marginRight:20}} onClick={this.openModal.bind(this, {})}>EmptyModal</Button>
                    <Button onClick={this.openModal.bind(this, data)}>FilledModal</Button>
                </div>
                {this.state.drawerVisible?
                    <MyDrawer
                        visible={this.state.drawerVisible}
                        closeModal={this.closeModal.bind(this)}
                        modalSubmit={() => console.log('ok ok')}
                        modalTitle={'modal title'}
                        modalLoading={false}
                        column={asdf}
                        data={this.state.modalData}
                    />
                    :
                    null
                }
            </React.Fragment>
        );
    }
}
export default NothingComp;