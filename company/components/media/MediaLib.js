import React from "react";
import {connect} from 'react-redux';
import config from "../../config";
import {fetchMedia, fetchMediaInfo, selectMedia, closeMediaModal, uploadMedia} from '../../actions/media_actions';
import { PlusOutlined, PictureOutlined, UploadOutlined } from '@ant-design/icons'
import {Modal, Button, Row, Col, Select, Spinner, Progress, Form, Input, Spin, Upload, message} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
const reducer = ({main, media}) => ({main, media});
import Dropzone from "react-dropzone";
import moment from 'moment';
// import * as actions from "../../actions/lessonLevel_actions";

class MediaLib extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            year: 'Он',
            month: [],
            name: '',
            selectedMonth: 'Сар'
        }
        this.dropzone = null
    }
    componentDidMount() {
        let type = this.props.type;
        if((type || '').trim() != ''){
            this.getMedia();
        }
    }
    componentWillUnmount() {
        this.props.dispatch(closeMediaModal())
    }

    getMedia(nums = -1 , search = false){
        let type = this.props.type;
        const {media: {medias}, data = [], forWhat} = this.props;
        type = type.replace('s', '');
        let dta = {type, forWhat:forWhat};
        const {name, year, selectedMonth} = this.state;
        if(this.state.search){
            if(name && name != ''){
                dta.name = name
            }
            if(year && year != '' && year != 'Он'){
                dta.year = year
            }
            if(selectedMonth && selectedMonth != '' && selectedMonth != 'Сар'){
                dta.month = parseInt(selectedMonth) - 1
            }
            if(search){
                dta.search = true;
            }
        }
        if(data.length > 0){
            dta.ids = data.map(c => c._id);
            dta.oldMedias = data;
        }
        this.props.dispatch(fetchMediaInfo(type, dta));
        this.props.dispatch(fetchMedia(type, nums >= 0 ? nums : parseInt(((medias[type] || []).length - data.length) / 50),dta))
    }
    closeModal(){
        const {onHide} = this.props
        onHide();
    }
    search(){
        this.setState({search: true}, () =>{
            this.getMedia(0 , true)
        })
    }
    setYear(e, aa){
        let year = aa.value;
        const {media: {medias, mediaYears}} = this.props;
        let month = year !== "Он" ? mediaYears.filter( a => a._id === year)[0].month || [] : [];
            month = month.map((m) => {
                m = {
                    _id: m
                }
                return m;
            })
        this.setState({year: year, month})
    }
    setMonth(e, aa){
        let month = aa.value;
        this.setState({selectedMonth: month})
    }
    loadMore(){
        const {media: {mediaMore}} = this.props;
        if(mediaMore){
            this.getMedia();
        }
    }
    selectMedia(id){
        const {multi = true} = this.props;
        this.props.dispatch(selectMedia(id, multi));
    }
    choose(){
        const {onOk, media: {medias}, type, onHide} = this.props;
        if(onOk){
            let data = (medias[type] || []).filter( c => c.selected);
            onOk(data, type);
            onHide();
        }
    }
    changeState(e, value){
        if (typeof e === 'string' || e instanceof String) {
            this.setState({ [e]: value});
        } else {
            this.setState({ [e.target.name]: e.target.value});
        }
    }

    customRequest(files) {
        const {type, visible, media: {medias, mediaYears, mediaMore}, main:{company}, dimension,forWhat, multi} = this.props;
        const {dispatch, main:{user}} = this.props;

        let id = user._id;
        if(type === 'image'){
            files.file.path = files.file.name;
            // this.props.dispatch(actions.uploadBundleThumbnail([files.file], 'image', id));
        }
        if(type === 'video'){
            files.file.path = files.file.name;
            // this.props.dispatch(actions.uploadTimelineVideo([files.file], 'video', id));
        }
        if(type === 'audio'){
            files.file.path = files.file.name;
            // this.props.dispatch(actions.uploadTimelineAudio([files.file], 'audio', id));
        }
        if(type === 'pdf'){
            files.file.path = files.file.name;
            // this.props.dispatch(actions.uploadTimelineFile([files.file], 'pdf', id));
        }
        dispatch(uploadMedia(
            [files.file],
            {
                type,
                forWhat:forWhat,
                domain:company.domain,
                size:files.file.size,
                multi: multi
            },
            ));
    }
    beforeUpload(file) {
        const {type, visible, media: {medias, mediaYears, mediaMore}, main:{user}} = this.props;
        // if( (user.type && user.type === '20/80') || file.size < ((user.max_file_size* 1024 * 1024 * 1024) - user.used_file_size)  ){
            if(type === 'image'){
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/JPEG' || file.type === 'image/PNG';
                if (!isJpgOrPng) {
                    message.error('You can only upload JPG/PNG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    message.error('Image must smaller than 10MB!');
                }
                return isJpgOrPng && isLt2M;
            }
            if(type === 'video'){
                const isJpgOrPng = file.type === 'video/mp4' || file.type === 'video/MP4';
                if (!isJpgOrPng) {
                    message.error('You can only upload .mp4 file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 1024;
                if (!isLt2M) {
                    message.error('Video must smaller than 1024MB!');
                }
                return isJpgOrPng && isLt2M;
            }
            if(type === 'audio'){
                const isJpgOrPng = file.type === 'audio/mp3' || file.type === 'audio/MP3' || file.type === 'audio/mpeg';
                if (!isJpgOrPng) {
                    message.error('You can only upload .mp3 file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 200;
                if (!isLt2M) {
                    message.error('Audio must smaller than 200MB!');
                }
                return isJpgOrPng && isLt2M;
            }
            if(type === 'pdf'){
                let fileName = (file.name || '').split('.');
                const isJpgOrPng = file.type === 'application/pdf' || (file.type === '' && fileName && fileName[fileName.length-1] === 'pdf');
                if (!isJpgOrPng) {
                    message.error('You can only upload PDF file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 200;
                if (!isLt2M) {
                    message.error('Pdf must smaller than 200MB!');
                }
                return isJpgOrPng && isLt2M;
            }
        // } else {
        //     message.error('Таны багтаамж дүүрсэн байна!');
        //     return false;
        // }
    }
    render() {
        const {type, visible, media: {medias, mediaYears, mediaMore,mediaUploading}} = this.props;
        let accept = '*';
        switch(type){
            case "image":
                accept = "image/*";
                break;
            case "video":
                accept = ".mp4,.MP4";
                break;
            case "audio":
                accept = ".mp3, .MP3";
                break;
            case "pdf":
                accept = ".pdf,.PDF";
                break;
            case "download":
                accept = ".zip,.rar,.ZIP,.RAR";
                break;
        }
        let title = 'Файл';
        switch(type){
            case 'pdf':
                title = 'PDF';
                break;
            case 'video':
                title = 'Видео';
                break;
            case 'audio':
                title = 'Аудио';
                break;
            case 'image':
                title = 'Зураг';
                break;
            case 'download':
                title = 'Татац';
                break;
        }
        let icon = 'document';
        switch(type){
            case 'video':
                icon = 'videocam';
                break;
            case 'audio':
                icon = 'musical-notes';
                break;
            case 'image':
                icon = 'images';
                break;
            case 'download':
                icon = 'cloud-download';
                break;
        }
        let mediaList = (medias[type] || []).sort((a , b) => {return moment(b.created) - moment(a.created)});
        return (
            <Modal
                title={<span><PictureOutlined /> {title} жагсаалт</span>}
                visible={visible}
                onCancel={this.closeModal.bind(this)}
                width={720}
                maskClosable={false}
                footer={[
                    <Button key="back" onClick={this.closeModal.bind(this)}>
                        Хаах
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.choose.bind(this)} loading={mediaUploading}>
                        Сонгох
                    </Button>
                ]}
            >
                <div className={'mediaFilter'}>
                    <Row>
                        <Col span={8}>
                            <Input
                                placeholder={`${title} нэр ...`}
                                type="text"
                                ref="textInput"
                                name="name"
                                // className="inp"
                                value={this.state.name}
                                onChange={this.changeState.bind(this)}
                                // style={{marginRight: 10}}
                            />
                        </Col>
                        <Col span={16}>
                                    {mediaYears && mediaYears.length>0?
                                        <Select defaultValue={this.state.year} value={this.state.year}  name='year' onChange={this.setYear.bind(this)} style={{marginRight: 10, marginLeft: 10}}>
                                            <Select.Option value='Он'>Он</Select.Option>
                                            {mediaYears.map((run, idx) =>
                                                <Select.Option value={run._id}>{run._id ? run._id : ''}</Select.Option>
                                            )}
                                        </Select>
                                        :
                                        null
                                    }
                                    {this.state.month.length > 0 ?
                                        <Select defaultValue={this.state.selectedMonth} value={this.state.selectedMonth}  name='selectedMonth' onChange={this.setMonth.bind(this)} style={{marginRight: 10}}>
                                            <Select.Option value='Сар'>Сар</Select.Option>
                                            {(this.state.month || []).map((run, idx) =>
                                                <Select.Option value={run._id}>{run._id ? run._id : ''}</Select.Option>
                                            )}
                                        </Select>
                                        :
                                        null
                                    }
                                <Button style={{marginRight: 10}} onClick={() => this.search()}>Хайх</Button>


                                <Upload
                                    listType="picture"

                                    // disabled={videoUploadLoadingT}
                                    showUploadList={false}
                                    beforeUpload={this.beforeUpload.bind(this)}
                                    customRequest={this.customRequest.bind(this)}
                                    // onRemove={this.removeUploadedFile.bind(this, 'timelineVideo')}
                                >
                                    <Button loading={mediaUploading} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                        </Col>
                    </Row>
                </div>
                <div>
                    <div className={'mediaLibModalBody'} id="fuckaaa">
                        <InfiniteScroll
                            scrollableTarget="fuckaaa"
                            dataLength={(medias[type] || []).length}
                            next={() => this.loadMore()}
                            hasMore={mediaMore}
                            loader={<div style={{textAlign: "center", clear: 'both'}}><Spin /></div>}
                            endMessage={
                                <p style={{textAlign: 'center', clear: 'both'}}>
                                    Нийт <b>{(medias[type] || []).length}</b> {title}
                                </p>
                            }
                        >
                            <div className={'mediaLists ' + (type != 'image' && type != 'video' ? 'list' : '')}>
                                {
                                    mediaList.map((media) =>
                                        <div key={media._id} className={'gridItem ' + (media.selected ? 'selected' : '')} onClick={this.selectMedia.bind(this, media._id)}>

                                            {
                                                type != 'image' && type != 'video' ?
                                                    <span>{media.original_name}</span>
                                                    :
                                                    <img src={type == 'image' ? `${config.get('hostMedia')}${media.path}` : `${config.get('hostMedia')}${media.thumbnail}` } style={{opacity: media.fake ? 0.5 : 1}}/>

                                            }
                                            {
                                                media.uploading ? (
                                                    <>
                                                        <Progress percent={media.uploading} />
                                                    </>
                                                ) : null
                                            }
                                            {
                                                media.selected &&
                                                <div className={'selectedMedia'}>
                                                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                                                </div>
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            </Modal>
        )
    }
}
export default connect(reducer)(MediaLib);