import React, { Fragment } from "react";
import { connect } from "react-redux";
import { locale } from "../../lang";
import config, {
  actionsArray,
  formattedActionsArray,
  isId,
  isPhoneNum,
  uuidv4,
  hasAction,
  msg,
  string,
  isValidDate, companyAdministrator,
} from "../../config";
import {
  setPageConf,
  getEmployee,
  getEmployeeCV,
    delDelDel,
} from "../../actions/employee_actions";
import {
  IdcardOutlined,
  PaperClipOutlined,
  RadarChartOutlined,
  FieldTimeOutlined,
  FundOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
  CarryOutOutlined,
  InsertRowAboveOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Row,
  Col,
  Spin,
} from "antd";
import { InnerSider, BC } from "../staff/innerSider";
import EmployeeRole from "./EmployeeRole";
import Anket from "./Anket";
import CEmp from "./CreateEmployee";
import Career from "./Career";
import Undsen from "./Yrunhii";
import AttendanceEmp from "./Attendance";
import TimetableEmp from "./TimetableEmployee";
import EmployeeSalary from "./EmployeeSalary";
// import Job from "./Job";
// import EmployeeFire from "./EmployeeFire"
import EmployeeTerminate from "./EmployeeTerminate";
import {deleteEmployee} from '../../actions/employee_actions'
// import { locale } from "moment";
const { Sider, Content } = Layout;
const reducer = ({ main, employee, settings }) => ({
  main,
  employee,
  settings,
});

class WorkerSingle extends React.Component {
  constructor(props) {
    super(props);
    let disabled = [];
    let menus = [
      "anket",
      "attendance",
      "role",
      "timetable",
      "career",
      "terminate",
      "new",
      "salary",
    ];
    this.state = {
      menus: menus,
      openKeys: menus.filter(menu => !disabled.includes(menu)),
      selected: ((props.match || {}).params || {}).section || "anket",
    };
    let isNew = ((props.match || {}).params || {}).section === "new";
    if (menus.includes(((props.match || {}).params || {}).section)) {
      props.dispatch(
        setPageConf({
          menu: ((props.match || {}).params || {}).section,
          submenu: isNew ? "username" : (this.getSubmenu(((this.props.match || {}).params || {}).section)),
          newWorker: isNew,
        })
      );
    } else {
      this.props.history.replace("/not-found");
    }
  }
  getSubmenu(menu){
    switch (menu) {
      case 'anket': return 'Ерөнхий мэдээлэл';
      case 'attendance': return 'Ирц';
      case 'role': return 'Үүрэг';
      case 'timetable': return 'Цагийн хуваарь';
      case 'career': return 'Зөрчил';
      case 'terminate': return 'Хүсэлт';
      case 'new': return 'username';
      case 'salary': return 'Цалин';
      default: return 'Ерөнхий мэдээлэл';
    }
  }
  componentDidMount() {
    const {
      main: { employee, company }, employee: {pageConf, empSingle},
    } = this.props;
    // this.props.dispatch(delDelDel());
    if (((this.props.match || {}).params || {}).section !== "new") {
      if (
        hasAction(
          ["create_employee", "edit_employee"],
          employee,
          this.props.match.params._id
        )
        &&
        (employee.company || 'as').toString() === (company._id || '').toString()
      ) {
        this.props.dispatch(getEmployee(this.props.match.params._id));
        this.props.dispatch(getEmployeeCV(this.props.match.params._id));
        this.props.dispatch(
            setPageConf({
              menu: ((this.props.match || {}).params || {}).section,
              submenu: this.getSubmenu(((this.props.match || {}).params || {}).section),
              newWorker: false,
            })
        );
      } else {
        this.props.history.replace("/not-found");
      }
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      employee: {pageConf},
    } = this.props;
    if (!this.state.menus.includes(((this.props.match || {}).params || {}).section)) {
      this.props.history.replace("/not-found");
    }
    if (
      ((prevProps.match || {}).params || {}).section !==
      ((this.props.match || {}).params || {}).section
    ) {
      this.props.dispatch(
        setPageConf({
          menu: ((this.props.match || {}).params || {}).section,
          submenu: this.getSubmenu(((this.props.match || {}).params || {}).section),
          newWorker: false,
        })
      );
    }
  }
  componentWillUnmount() {
    this.props.dispatch(
        setPageConf({
          menu: 'anket',
          submenu: 'Ерөнхий мэдээлэл',
          newWorker: false,
        })
    );
  }
  changeMenu(e) {
    this.props.history.push(`/worker/${this.props.match.params._id}/${e.menu}`);
    this.props.dispatch(setPageConf({ menu: e.menu, submenu: e.submenu }));
    // this.setState({...this.state, openKeys: [e.menu]})
  }
  // addMenu(e){
  //     let openKeys = (this.state.openKeys || []);
  //     if(openKeys.includes(e.menu)){
  //         openKeys = openKeys.filter(key => key !== e.menu);
  //     }else{
  //         openKeys.push(e.menu);
  //     }
  //     this.setState({...this.state, openKeys: openKeys})
  // }
  render() {
    const {
      dispatch,
      employee: { createdUser, pageConf, gettingEmployee, empSingle },
      main: { employee },
    } = this.props;
    let disabled =
      pageConf.newWorker &&
      (!(createdUser.user || {})._id ||
        createdUser.employee ||
        createdUser.exists);
    // {
    //     key: 'undsen',
    //     title: 'Ерөнхий мэдээлэл',
    //     icon: <IdcardOutlined />,
    //     disabled: disabled,
    //     onMenuClick: (e) => this.changeMenu(e),
    //     onSubClick: (e) => this.changeMenu(e),
    //     subMenus: [
    //         {
    //             key: 'Ажилтны мэдээлэл',
    //             title: 'Ажилтны мэдээлэл'
    //         },
    //         {
    //             key: 'Зөрчлийн жагсаалт',
    //             title: 'Зөрчлийн жагсаалт'
    //         },
    //         {
    //             key: 'Гүйцэтгэл',
    //             title: 'Гүйцэтгэл'
    //         },
    //         {
    //             key: 'Сургалт',
    //             title: 'Сургалт'
    //         },
    //         {
    //             key: 'Томилолт',
    //             title: 'Томилолт'
    //         },
    //         {
    //             key: 'Ирц, чөлөө, амралт',
    //             title: 'Ирц, чөлөө, амралт'
    //         },
    //         {
    //             key: 'Ажилтны төлөв',
    //             title: 'Ажилтны төлөв'
    //         },
    //     ]
    // },
    const menus = [
      {
        key: "anket",
        title: "Анкет",
        disabled:
          gettingEmployee ||
          !hasAction(
            ["create_employee", "edit_employee"],
            employee,
            this.props.match.params._id
          ) ||
          disabled,
        icon: gettingEmployee ? <LoadingOutlined /> : <PaperClipOutlined />,
        onMenuClick: e => this.changeMenu(e),
        onSubClick: e => this.changeMenu(e),
        subMenus: [
          {
            key: locale("employee_single.main_info"),
            title: locale("employee_single.main_info"),
          },
          {
            key: locale("employee_single.family.info"),
            title: locale("employee_single.family.info"),
          },
          {
            key: locale("employee_single.edu.base"),
            title: locale("employee_single.edu.base"),
          },
          {
            key: locale("employee_single.course.base"),
            title: locale("employee_single.course.base"),
          },
          {
            key: locale("employee_single.workXp.base"),
            title: locale("employee_single.workXp.base"),
          },
          {
            key: locale("employee_single.talent.base"),
            title: locale("employee_single.talent.base"),
          },
          {
            key: "Эрүүл мэнд",
            title: locale("employee_single.medical"),
          },
          {
            key: "Цэргийн алба",
            title: locale("employee_single.military.service"),
          },
        ],
      },
      {
        key: "attendance",
        title: locale("employee_single.attendance.base"),
        disabled:
          gettingEmployee ||
          !hasAction(
            ["edit_employee"],
            employee,
            this.props.match.params._id
          ) ||
          disabled,
        icon: <FieldTimeOutlined />,
        onMenuClick: e => this.changeMenu(e),
        onSubClick: e => this.changeMenu(e),
        subMenus: [
          {
            key: "Чөлөө",
            title: locale("employee_single.attendance.chuluu"),
          },
          {
            key: "Ээлжийн амралт",
            title: locale("employee_single.attendance.amralt"),
          },
        ],
      },
      {
        key: "role",
        title: locale("common_employee.position"),
        disabled:
          gettingEmployee ||
          !hasAction(
            ["edit_roles", "read_roles"],
            employee,
            this.props.match.params._id
          ) ||
          disabled,
        icon: <CarryOutOutlined />,
        onMenuClick: e => this.changeMenu(e),
        onSubClick: e => this.changeMenu(e),
        subMenus: [
          {
            key: "Үүрэг",
            title: locale("common_employee.position"),
          },
        ],
      },
      {
        key: "timetable",
        title: locale("employee_single.time.table"),
        disabled:
          gettingEmployee ||
          !hasAction(
            ["deal_with_timetable"],
            employee,
            this.props.match.params._id
          ) ||
          disabled,
        icon: <InsertRowAboveOutlined />,
        onMenuClick: e => this.changeMenu(e),
        onSubClick: e => this.changeMenu(e),
        subMenus: [
          {
            key: "Цагийн хуваарь",
            title: locale("employee_single.time.table"),
          },
        ],
      },
      {
        key: "salary",
        title: locale("employee_single.salary"),
        disabled:
          gettingEmployee ||
          !hasAction(
            ["read_salary", "edit_salary"],
            employee,
            this.props.match.params._id
          ) ||
          disabled,
        icon: <WalletOutlined />,
        onMenuClick: e => this.changeMenu(e),
        onSubClick: e => this.changeMenu(e),
        subMenus: [
          {
            key: "Цалин",
            title: locale("employee_single.salary"),
          },
        ],
      },
      {
        key: "career",
        title: "Карьер",
        icon: <FundOutlined />,
        disabled: gettingEmployee || disabled || !companyAdministrator(employee),
        onMenuClick: e => this.changeMenu(e),
        onSubClick: e => this.changeMenu(e),
        subMenus: [
          {
            key: "Зөрчил",
            title: locale("employee_single.career.zurchil"),
          },
          {
            key: "Шагнал",
            title: locale("employee_single.career.reward"),
          },
          {
            key: "Томилолт",
            title: locale("employee_single.career.tomilolt"),
          },
          {
            key:"Сургалт" ,
            title: locale("employee_single.career.course"),
          },
          {
            key: "Албан тушаал",
            title: locale("common_employee.position"),
          },
        ],
      }
    ];
    // if(((empSingle || {}).staticRole || '') !== 'lord'){
    if(((empSingle || {}).staticRole || '') !== 'lord'){
      menus.push({
        key: "terminate",
        title: locale("employee_single.career.firing"),
        disabled: gettingEmployee || disabled || !companyAdministrator(employee) || ((empSingle || {})._id || 'as').toString() === (employee._id || 'as').toString(),
        // disabled: true,
        icon: <UserDeleteOutlined />,
        onMenuClick: e => this.changeMenu(e),
        onSubClick: e => this.changeMenu(e),
        subMenus: [
          // {
          //   key: "Өргөдөл",
          //   title: "Өргөдөл",
          // },
          // {
          //   key: "Шалтгаан",
          //   title: "Шалтгаан",
          // },
          {
            key: 'Хүсэлт',
            title: locale("employee_single.career.req")
          },
        ],
      },)
    }
    if (pageConf.newWorker) {
      menus.unshift({
        key: "newWorker",
        title: locale("common_employee.employee_add"),
        icon: <UserAddOutlined />,
        disabled: false,
        onMenuClick: e => this.changeMenu(e),
        onSubClick: e => this.changeMenu(e),
        subMenus: [
          {
            key: "username",
            title: locale("common_employee.username"),
          },
          {
            key: "password",
            title: locale("common_employee.password"),
          },
          {
            key: "phone",
            title: locale("common_employee.phone"),
          },
          {
            key: "email",
            title: locale("common_employee.email"),
          },
          {
            key: "role",
            title: locale("employee_single.role"),
          },
        ],
      });
    }
    return (
      <Row justify="center" align="center" className={"hrx-settings"}>
        <Col span={22}>
          <div style={{ marginBottom: 15 }}>
            <BC
              page={"Ажилтан"}
              menus={menus}
              selectedKey={pageConf.menu}
              onClick={e => this.changeMenu(e)}
            />
          </div>
          <Layout>
            <Sider>
              <InnerSider
                menus={menus}
                selectedKey={pageConf.submenu}
                onClick={e => this.changeMenu(e)}
                // disabled={["terminate", "career"]}
                openKeys={this.state.openKeys}
              />
            </Sider>
            <Layout className={"hrx-layout"}>
              {pageConf.menu === "new" ? <CEmp /> : null}
              {gettingEmployee ? (
                <Spin />
              ) : pageConf.menu === "undsen" ? (
                <Undsen />
              ) : pageConf.menu === "anket" ? (
                <Anket paramsId={this.props.match.params._id} />
              ) : pageConf.menu === "career" ? (
                <Career />
              ) : pageConf.menu === "role" ? (
                <EmployeeRole />
              ) : pageConf.menu === "attendance" ? (
                <AttendanceEmp paramsId={this.props.match.params._id} />
              ) : pageConf.menu === "salary" ? (
                <EmployeeSalary
                  paramsId={this.props.match.params._id}
                  empSingle={empSingle}
                />
              ) : pageConf.menu === "timetable" ? (
                <TimetableEmp
                  paramsId={this.props.match.params._id}
                  empSingle={empSingle}
                />
              ) : pageConf.menu === "terminate" ? (
                <>
                  {/*<EmployeeFire*/}
                  {/*    paramsId={this.props.match.params._id}*/}
                  {/*    empSingle={empSingle}*/}
                  {/*/>*/}
                  <EmployeeTerminate
                      paramsId={this.props.match.params._id}
                      empSingle={empSingle}
                  />
                </>
              ) : null}
            </Layout>
          </Layout>
          <div style={{ marginTop: 15 }}>
            <BC
              page={"Ажилтан"}
              menus={menus}
              selectedKey={pageConf.menu}
              onClick={e => this.changeMenu(e)}
            />
          </div>
        </Col>
      </Row>
    );
  }
}

export default connect(reducer)(WorkerSingle);
