import React from 'react'
import {connect} from "react-redux";
import {
    Button,
    Card,
    Popconfirm,
} from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import config, {printStaticRole} from "../../config";
import moment from 'moment'
import {CloudUploadOutlined} from "@ant-design/icons";
import {submitReference} from "../../actions/main_actions";

import { Link } from 'react-router-dom';
const reducer = ({main, }) => ({main, })

class ReferenceSingle extends React.Component{
    constructor(props) {
        super(props);
        const {main: {employee, references}} = this.props;
        let ref_id = (this.props.match.params || {}).worker, reference = {};
        if(ref_id){
            (references || []).map(ref => {
                if((ref._id || "as").toString() === ref_id) reference = ref;
            });
            if((((reference || {}).written_by || {}).emp|| 'as').toString() !== (employee._id || '').toString()){
                window.location.assign('/not-found');
            }
            this.state = {
                reference: reference
            };
        }else{
            window.location.assign('/not-found');
        }
    }
    componentDidMount() {
        let {main: {employee}} = this.props;

    }
    submitReference(e){
        let content = (this.editor || {}).editor.getContent({format:'raw'});
        this.props.dispatch(submitReference({text: content, _id: (this.state.reference || {})._id, final: e})).then(c => {
            if(c.json.success){
                window.location.assign('/workers');
            }
        })
    }
    componentWillUnmount() {
        let content = (this.editor || {}).editor.getContent({format:'raw'});
        this.props.dispatch(submitReference({text: content, _id: (this.state.reference || {})._id}))
        this.editor = null;
        this.editorCb = null;
    }

    render(){
        const {dispatch,  main: {employee, references, referenceLoading}} = this.props;
        return (
            <div className={'referenceSingle'}>
                <Card
                    loading={referenceLoading}
                    title={
                        `
                        ${
                            ((((this.state.reference || {}).employee || {}).user || {}).last_name || '').slice(0,1).toUpperCase()
                            +((((this.state.reference || {}).employee || {}).user || {}).last_name || '')
                                .slice(1,((((this.state.reference || {}).employee || {}).user || {}).last_name || '').length)
                        } овогтой ${
                            ((((this.state.reference || {}).employee || {}).user || {}).first_name || '').slice(0,1).toUpperCase()
                            +((((this.state.reference || {}).employee || {}).user || {}).first_name || '')
                                .slice(1,((((this.state.reference || {}).employee || {}).user || {}).first_name || '').length)
                        } тодорхойлох захидал
                        `
                    }
                    bordered={true}
                    extra={
                        <Popconfirm
                            title={'Энэ тодорхойлох захидлыг илгээх үү?'}
                            onConfirm={this.submitReference.bind(this, true)}
                            disabled={referenceLoading} okText={'Тийм'} cancelText={'Үгүй'}
                        >
                            <Button
                                icon={<CloudUploadOutlined />}
                                type={'primary'}
                            >
                                Илгээх
                            </Button>
                        </Popconfirm>
                    }
                >
                    <Editor
                        ref={(ref) => {
                            this.editor = ref;
                        }}
                        apiKey='xo6szqntkvg39zc2iafs9skjrw8s20sm44m28p3klgjo26y3'
                        height="700px"
                        // value={news.tinymce ? news.tinymce : ''}
                        initialValue={(this.state.reference || {}).text ? (this.state.reference || {}).text : ''}
                        init={{
                            height: "700px",
                            content_style: 'body { background-color: #f7f7f7;}' +
                                'img { max-width: 100%; }',
                            relative_urls: false,
                            remove_script_host: false,
                            plugins: 'code paste link lists hr table emoticons advlist',
                            // file_picker_callback: this.onImageUpload.bind(this),
                            // file_picker_types: 'image',
                            paste_data_images: true,
                            paste_webkit_styles: "color font-size",
                            valid_elements: 'img[src],*[style]',
                            toolbar:
                                'undo redo | bold italic | fontsizeselect | alignleft aligncenter alignright | media link | numlist bullist | forecolor backcolor | emoticons',
                            extended_valid_elements: "iframe[src|style|scrolling|class|width|height|name|align]",
                            color_cols: "5",
                            custom_colors: false,
                            body_class: 'tiny_editor'
                        }}
                    />
                </Card>
            </div>
        );
    }
}

export default connect(reducer)(ReferenceSingle)