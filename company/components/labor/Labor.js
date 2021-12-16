import React from 'react'
import {connect} from 'react-redux'
import config, {hasAction, isId, isValidDate, msg, printStaticRole, string, uuidv4} from "../../config";
import moment from 'moment'
import {getAllEmployees} from "../../actions/employee_actions";
import {getAllVacations, changeCompanyVacation, respondToVacationRequest} from "../../actions/vacation_actions";
import {
    Button,
    Card,
    Col,
    Drawer,
    Empty,
    Form,
    Row,
    Select,
    Spin,
    Table,
    DatePicker,
    Popconfirm,
    Tag,
    Modal,
    Calendar,
    Badge,
    Typography,
    Space
} from "antd";
import {
    CheckCircleFilled,
    CheckCircleOutlined, CloseCircleFilled, CloseCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined,
    PlusOutlined
} from "@ant-design/icons";
import {editEmpBreak, getAllBreak} from "../../actions/break_actions";
const {RangePicker} = DatePicker
const {Title, Text} = Typography
const reducer = ({main}) => ({main})

class Labor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }
    render(){
        const {  } = this.props
        return (
            <Card
                title='Хөдөлмөрийн харилцаа'
                bordered={true}
            >
                wow
            </Card>
        )
    }
}

export default connect(reducer)(Labor)