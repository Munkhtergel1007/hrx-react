import React from "react";
import {
  Button, Tooltip,
  Select,
  DatePicker,
  Form,
  Input,
  Typography,
} from "antd";
import { connect } from "react-redux";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Item } = Form;
const { Option } = Select;
const { Paragraph, Text, Title } = Typography;
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CloseCircleOutlined, CheckCircleOutlined, CloseCircleFilled, CheckCircleFilled
} from "@ant-design/icons";

class EditableText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: '',
      editing: false
    };
  }
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {
          this.state.editing ?
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <Input
                onChange={(e) => this.setState({edit: e.target.value})} size={'small'}
                placeholder={this.props.placeholder} value={this.state.edit} style={{width: 350}}
              />
              <Tooltip title={'Өөрчлөх'}>
                <Button
                  onClick={() => {
                    let text = this.state.edit;
                    this.setState({
                      edit: '', editing:false
                    }, () => {
                      this.props.sub && this.props.sub !== '' ?
                        this.props.changeParentState(this.props.parent, this.props.child, text, this.props.sub)
                        :
                        this.props.changeParentState(this.props.parent, this.props.child, text)
                    })
                  }}
                  icon={<CheckOutlined />} size={'small'} style={{border: 'none', outline: 'none', boxShadow: 'none'}}
                />
              </Tooltip>
              <Tooltip title={'Болих'}>
                <Button
                  onClick={() => this.setState({editing: false, edit: ''})}
                  icon={<CloseOutlined />} size={'small'} danger style={{border: 'none', outline: 'none', boxShadow: 'none'}}
                />
              </Tooltip>
            </div>
            :
            <span>
              {
                this.props.text === '' ?
                  <span style={{color: '#ccc', fontWeight: 600}}>{this.props.placeholder}</span>
                  :
                  <b>{this.props.text}</b>
              }
              <Tooltip title={'Засах'}>
                <Button
                  icon={<EditOutlined />} size={'small'} style={{border: 'none', outline: 'none', boxShadow: 'none'}}
                  onClick={() => this.setState({editing: true, edit: this.props.text})}
                />
              </Tooltip>
            </span>
        }
      </div>
    );
  }
}

export default (EditableText);
