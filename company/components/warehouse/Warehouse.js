import React from "react";
import { connect } from "react-redux";
import Cookies from "js-cookie";

import {
	Tabs,
	Card,
	Button,
	Modal,
	Form,
	Switch,
	Input,
	Row,
	Col,
	Popconfirm,
	InputNumber,
	Radio,
	List,
	Dropdown,
	Avatar,
	Menu,
	Select,
	Spin,
	Table,
	Divider,
	DatePicker,
	Tooltip,
	Tag,
	Collapse,
	Space,
	Skeleton,
	Empty
} from "antd";
import { Link } from "react-router-dom";
import config, { companyAdministrator, hasAction } from "../../config";
import {
	FileDoneOutlined,
	GiftOutlined,
	PlusOutlined,
	UsergroupAddOutlined,
	UserAddOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
	EditFilled,
	DeleteFilled,
	CaretRightOutlined
} from "@ant-design/icons";
import moment from "moment";
import NumberFormat from "react-number-format";
import {
	getWarehouses,
	submitWarehouse,
	deleteWarehouse,
	toggleWarehouseModal,
	getWarehouseSells
} from "../../actions/warehouse_actions";
import { getEmployeeStandard } from "../../actions/employee_actions";
import { locale } from "../../lang";
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const reducer = ({ main, warehouse }) => ({ main, warehouse });

class Warehouse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: "",
			title: "",
			_id: "",
			employees: []
		};
		this.timeOut = null;
	}
	componentDidMount() {
		const {
			dispatch,
			main: {
				company: { _id }
			}
		} = this.props;
		let empCC = {
			pageNum: 0,
			pageSize: 10,
			staticRole: ["hrManager", "employee", "chairman", "lord"],
			extraProp: ["register_id"],
			// search: self.state.userSearch,
			getAvatars: true
		};
		dispatch(getEmployeeStandard(empCC));
		dispatch(getWarehouses({ companyID: _id }));
	}
	toggleModal(mod) {
		const { dispatch } = this.props;
		dispatch(toggleWarehouseModal({ data: mod }));
	}
	submitWarehouse(e) {
		const {
			dispatch,
			main: {
				company: { _id }
			}
		} = this.props;
		let payload = {
			title: this.state.title,
			company: _id,
			_id: this.state._id,
			employees: this.state.employees
		};
		dispatch(submitWarehouse(payload)).then((c) => {
			if (c.json.success) {
				this.toggleModal(false);
			}
		});
	}
	deleteWarehouse(e) {
		const { dispatch } = this.props;
		dispatch(deleteWarehouse(e));
	}
	getSells(id) {
		const { dispatch } = this.props;
		// console.log("getSells method", id);
		dispatch(getWarehouseSells({ warehouseID: id }));
	}
	searchEmployeesInner(e) {
		let self = this;
		clearTimeout(this.state.timeOut);
		let empCC = {
			pageNum: 0,
			pageSize: 10,
			staticRole: ["hrManager", "employee", "chairman", "lord"],
			extraProp: ["register_id"],
			search: e,
			getAvatars: true
		};
		let timeOut = setTimeout(function () {
			self.setState(
				{
					timeOut: timeOut
				},
				() => {
					self.props.dispatch(getEmployeeStandard(empCC));
				}
			);
		}, 500);
	}
	selectEmployee(e) {
		const {
			warehouse: { employees }
		} = this.props;
		let selected = {};
		(employees || []).map((emp) => {
			if ((e || "as").toString() === ((emp || {})._id || "").toString()) {
				selected = emp;
			}
		});
		this.dealWithEmployees(selected);
	}
	dealWithEmployees(e) {
		let initial = this.state.employees || [];
		if (
			(this.state.employees || []).some(
				(emp) =>
					(e._id || "as").toString() === (emp._id || "").toString()
			)
		) {
			this.setState({
				employees: (initial || []).filter(
					(emp) =>
						(emp._id || "as").toString() !==
						(e._id || "").toString()
				)
			});
		} else {
			this.setState({
				employees: [...(initial || []), e]
			});
		}
	}
	render() {
		const {
			warehouse: {
				warehouses,
				fetchingWarehouses,
				submittingWarehouse,
				submitSuccess,
				deletingWarehouse,
				deleteSuccess,
				modal,
				soldProducts,
				sells,
				gettingSells,
				employees
			},
			main: { user, employee }
		} = this.props;
		const { title } = this.state;
		const auth = companyAdministrator(employee);
		const columns = [
			{
				key: "_id",
				title: "№",
				render: (txt, record, idx) => idx + 1,
				width: 150
			},
			{
				title: locale("common_warehouse.name"),
				// dataIndex: "title",
				key: "title",
				render: (txt, record, idx) => {
					return (
						<Link to={`/warehouse/${record._id}`}>
                            <span style={{color:'#1890ff'}}>{record.title}</span>
						</Link>
					);
				}
			}
		];
		if (auth) {
			columns.push({
				title:  locale("common_warehouse.uildel"),
				key: "action",
				render: (record) => (
					<>
						<Button
							icon={<EditOutlined />}
							style={{marginRight:8}}
							size={"small"}
							onClick={() =>
								this.setState(
									{
										title: record.title,
										_id: record._id,
										employees: (record.employees || []).map(
											(employee) => {
												return {
													...employee.emp,
													user: employee.user
												};
											}
										)
									},
									() => this.toggleModal(true)
								)
							}
						>{locale("common_warehouse.edit")}</Button>
						<Popconfirm
							disabled={record.loading}
							title={locale("common_warehouse.warehouse.del")}
							okText={locale("yes")}
							cancelText={locale("no")}
							onConfirm={() =>
								this.deleteWarehouse({ warehouse: record._id })
							}
						>
							<Button
								loading={record.loading}
								size={"small"}
								icon={<DeleteOutlined />}
								danger
							>{locale("common_warehouse.del")}</Button>
						</Popconfirm>
					</>
				),
				width: 200
			});
		}
		const expandedRender = (record) => {
			// console.log("realRecord", record);
			// console.log("sells", sells);
			const sellsArr = (sells || {})[record._id];
			// console.log("sellsArr", sellsArr);
			let income = 0;
			if ((sellsArr || []).length > 0) {
				sellsArr.map((e) => {
					income += e.price * e.quantity;
				});
			}
			return gettingSells ? (
				<div style={{ textAlign: "center" }}>
					<Spin />
				</div>
			) : (
				<>
					<div key={"income"}>
						Орлого :{" "}
						{`${(Math.floor(income) || "0")
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`}
					</div>
					<div key={"employees"}>
						Ажилчид :{" "}
						{(record.employees || []).map((employee) => (
							<Tag key={`${employee.emp?._id}-employee-tag`}>
								{employee.user.last_name
									? `${(employee.user.last_name || [])[0]}.`
									: null}
								{employee.user.first_name}
							</Tag>
						))}
					</div>
				</>
			);
		};
		let dis = this;
		return (
			<Card
				title={locale("common_warehouse.warehouse.base")}
				key={"foobar"}
				loading={fetchingWarehouses}
				extra={
					<div>
						<Link
							key="/warehouse"
							to="/warehouse"
							style={{ marginRight: 30 }}
						>
							<Button type={this.props.location.pathname === '/warehouse' || this.props.location.pathname === '\\warehouse' ? "dashed" : "default"} key={"warehouse-link"}>
								{locale("common_warehouse.warehouse.base")}
							</Button>
						</Link>
						{
							hasAction(['category'], employee) ?
								<Link
									key="/category"
									to="/category"
									style={{ marginRight: 30 }}
								>
									<Button type={this.props.location.pathname === '/category' || this.props.location.pathname === '\\category' ? "dashed" : "default"} key={"warehouse-add"}>
										{locale("common_warehouse.cate")}
									</Button>
								</Link>
								: null
						}
						{
							hasAction(['asset'], employee) ?
								<Link
									to="/asset"
									style={{ marginRight: 30 }}
									key="/asset"
								>
									<Button type={this.props.location.pathname === '/asset' || this.props.location.pathname === '\\asset' ? "dashed" : "default"} key={"warehouse-add"}>
										{locale("common_warehouse.plusFlat")}
									</Button>
								</Link>
								: null
						}
						{
							hasAction(['product'], employee) ?
								<Link
									to="/product"
									style={{ marginRight: 30 }}
									key="/product"
								>
									<Button type={this.props.location.pathname === '/product' || this.props.location.pathname === '\\product' ? "dashed" : "default"} key={"warehouse-add"}>
										{locale("common_warehouse.product")}
									</Button>
								</Link>
								: null
						}
						{
							hasAction(['restock'], employee) ?
								<Link
									to="/restock"
									key="/restock"
									style={{ marginRight: 200 }}
								>
									<Button key={"warehouse-add"}>
										{locale("common_warehouse.getProduct")}
									</Button>
								</Link>
								: null
						}
						{
							hasAction(['warehouse'], employee) ?
								<Button
									key={"warehouse-add"}
									type={"primary"}
									onClick={() => this.toggleModal(true)}
									icon={<PlusOutlined />}
								>
									{locale("common_warehouse.warehouse.add")}
								</Button>
								: null
						}
					</div>
				}
			>
				<Table
					size={"small"}
					dataSource={warehouses}
					columns={columns}
					rowKey={(record) => record._id}
					loading={fetchingWarehouses}
					expandable={{
						rowExpandable: () => auth,
						expandedRowRender: expandedRender
					}}
					onExpand={(aa, record) => this.getSells(record._id)}
				/>
				{/* {warehouses && warehouses.length > 0 ? (
					warehouses.map((e, idx) => {
						return <div key={idx}>{e?.title}</div>;
					})
				) : (
					<Empty description={`Агуулах алга`} />
				)} */}
				<Modal
					title={locale("common_warehouse.warehouse.add")}
					visible={modal}
					onOk={this.submitWarehouse.bind(this)}
					onCancel={() => this.toggleModal(false)}
					destroyOnClose
					okText={locale("common_warehouse.save")}
					cancelText={locale("common_warehouse.cancel")}
					confirmLoading={submittingWarehouse}
					maskClosable={true}
				>
					<Form.Item label={locale("common_warehouse.name")} labelCol={{ span: 5 }}>
						<Input
							maxLength={60}
							value={title}
							name="title"
							onChange={(e) => {
								this.setState({ title: e.target.value });
							}}
							allowClear
							autoComplete="off"
						/>
					</Form.Item>
					<Form.Item label={"Ажилчид"} labelCol={{ span: 5 }}>
						<Select
							loading={this.props.loadingEmployeesInner}
							showSearch={true}
							// placeholder="Хэрэглэгчийн нэр, овог болон утсаар хайх"
							placeholder={locale("common_warehouse.workToge")}
							onSelect={(e) => this.selectEmployee(e)}
							onSearch={this.searchEmployeesInner.bind(this)}
							filterOption={false}
							value={null}
							listHeight={120}
							notFoundContent={locale("common_warehouse.empty")}
						>
							{(employees || []).map((emp) => (
								<Select.Option
									value={emp._id}
									key={emp._id}
									style={
										(this.state.employees || []).some(
											(employ) =>
												(emp._id || "as").toString() ===
												(employ._id || "").toString()
										)
											? {
													backgroundColor: "#6d6d6d",
													color: "white"
											  }
											: {}
									}
								>
									{(((emp || {}).user || {}).last_name || "")
										.slice(0, 1)
										.toUpperCase()}
									.
									{(((emp || {}).user || {}).first_name || "")
										.slice(0, 1)
										.toUpperCase() +
										(
											((emp || {}).user || {})
												.first_name || ""
										).slice(
											1,
											(
												((emp || {}).user || {})
													.first_name || ""
											).length
										)}
									&nbsp;
									{` - ${
										((emp || {}).user || {}).register_id
									}`}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					{(this.state.employees || []).length > 0
						? (this.state.employees || []).map((emp) => (
								<Tag
									style={{ marginBottom: 5 }}
									onClose={() => this.dealWithEmployees(emp)}
									key={emp._id}
									closable={true}
								>
									{((emp.user || {}).last_name || "")[0]}.
									{(emp.user || {}).first_name || ""}
								</Tag>
						  ))
						: null}
				</Modal>
			</Card>
		);
	}
}

export default connect(reducer)(Warehouse);
