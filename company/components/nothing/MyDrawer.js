import React, {Component} from "react";
import { connect } from 'react-redux';
import config from "../../config";
import moment from "moment";
import * as actions from "../../actions/orlogoZarlaga_actions";
import {CloseCircleFilled} from '@ant-design/icons'
import {
    Button, Col,
    Drawer, Form, Row, Select, Tag, Input
} from 'antd';
const {TextArea} = Input;


class MyDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = props.data;
    }
    renderComp(e, obj, idx){
        if(obj && typeof obj.tag === 'string' && obj.tag.toUpperCase() === 'INPUT'){
            return this.myInput(obj, idx)
        } else if(obj && typeof obj.tag === 'string' && obj.tag.toUpperCase() === 'TEXTAREA'){
            return this.myTextArea(obj, idx)
        } else {
            return <span />
        }
    }
    myInput(obj, idx){
        return <Input
                      key={`input${idx}`}
                      value={this.state[obj.name]}
                      onChange={(e) => this.setState({[obj.name]:e.target.value})}
                      {...(obj.tagProps || {})}
        />
    }
    myTextArea(obj, idx){
        return <TextArea {...(obj.tagProps || {})} />
    }
    render() {
        let rend = [];
        let dis = this;
        let order;
        // this.props.column?.map((r, idx) => rend.push(this.renderComp(this, r, idx)));
        console.log('this.props.column', this.props.column);


        // function recursive(recDada){
        //     let lol;
        //     recDada?.map(function (outer, idx) {
        //         let i = 0;
        //         let eniigUurchil = outer;
        //         if(eniigUurchil.child){
        //             lol = outer.child
        //         }
        //         do{
        //             order[idx][i] = {...eniigUurchil, child:null};
        //
        //             eniigUurchil = eniigUurchil.child;
        //             console.log('eniigUurchil', eniigUurchil);
        //             i++;
        //             console.log(idx, '-',i )
        //         }while(eniigUurchil && eniigUurchil.child)
        //     })
        //     recursive(lol);
        // }
        // recursive(this.props.column[0].child);

        let count = 0;
        let recCount = 0;
        let secret = 0;
        let nude = 0;
        function recursive(data, ddd){
            let check = data;
            let countIn = 0;
            let countInner = 0;
            recCount ++;
            (check || []).map(function (r, idx) {
                countIn++;
                count ++;
                console.log(countInner, '_', nude, '_', ddd, '_', countIn, '_', recCount, '_', count, '_', idx ,' --- ', r);
                if(r.child){
                    check = r.child;
                    ddd++;
                    nude++;
                    countInner++;
                    recursive(check, ddd);
                }
            })
        }
        recursive(this.props.column, secret);
        console.log(count);

        // let a = [];
        // do{
        //     this.props.column?.map(function (outer, idx) {
        //         let i = 0;
        //         let eniigUurchil = outer;
        //         do{
        //             // order[idx][i] = {...eniigUurchil, child:null};
        //
        //             eniigUurchil = eniigUurchil.child;
        //             console.log('eniigUurchil', eniigUurchil);
        //             i++;
        //             console.log(idx, '-',i )
        //         }while(eniigUurchil && eniigUurchil.child)
        //     })
        // }while(a && a.length>0)

        // let colum = this.props.column;
        // do{
        //     colum = colum.child;
        //     console.log(colum);
        // }while(colum && colum.child)
        console.log(order);
        return (
            <React.Fragment>
                <Drawer
                    title={`${this.props.modalTitle}`}
                    maskClosable={false}
                    onClose={this.props.closeModal.bind(this)}
                    width={720}
                    visible={this.props.visible}
                    key={'my-drawer'}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button style={{marginRight: 20}} onClick={this.props.closeModal.bind(this)}>Хаах</Button>
                            <Button
                                type="primary"
                                loading={this.props.modalLoading}
                                onClick={this.props.modalSubmit.bind(this)}
                            >
                                Хадгалах
                            </Button>
                        </div>
                    }
                >
                    {/*{rend.map(r => r)}*/}
                </Drawer>
            </React.Fragment>
        );
    }
}

export default MyDrawer;