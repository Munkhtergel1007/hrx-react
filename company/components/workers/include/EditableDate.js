import React from "react";
import {
  Button, Tooltip,
  DatePicker,
} from "antd";
import moment from "moment";
import {
  CalendarOutlined,
} from "@ant-design/icons";

class EditableDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {
          this.state.editing ?
            <DatePicker
              placeholder={'Он сар өдөр оруулна уу'}
              allowClear={false} value={this.props.date}
              onChange={(e) => {
                this.setState({
                  editing:false
                }, () => {
                  this.props.sub && this.props.sub !== '' ?
                    this.props.changeParentState(this.props.parent, this.props.child, e, this.props.sub)
                    :
                    this.props.changeParentState(this.props.parent, this.props.child, e)
                })
              }}
            />
            :
            <span>
              {
                this.props.text === '' ?
                  <span style={{color: '#ccc', fontWeight: 600}}>{this.props.placeholder}</span>
                  :
                  <b>{moment(this.props.date).format("YYYY оны MM сарын DD")}</b>
              }
              <Tooltip title={'Засах'}>
                <Button
                  icon={<CalendarOutlined />} size={'small'} style={{border: 'none', outline: 'none', boxShadow: 'none'}}
                  onClick={() => this.setState({editing: true})}
                />
              </Tooltip>
            </span>
        }
      </div>
    );
  }
}

export default (EditableDate);
