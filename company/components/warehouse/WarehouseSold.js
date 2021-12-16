import React from "react";
import { connect } from "react-redux";
import {
	Card,
	Button,
	Modal,
	Form,
	Input,
	Popconfirm,
	Table,
	Tag,
	DatePicker,
	Empty, Select
} from "antd";
import { Link } from "react-router-dom";
import { locale } from "../../lang";
import Cookies from "js-cookie";
import config, { companyAdministrator, companyLord } from "../../config";
import {
	PlusOutlined,
	EditOutlined,
	LeftOutlined,
	SearchOutlined
} from "@ant-design/icons";
import moment from "moment";
import NumberFormat from "react-number-format";
import {
	getSoldSubProduct,
	getSubAssets,
	getWarehouseSingle
} from "../../actions/warehouse_actions";

const reducer = ({ main, warehouse }) => ({ main, warehouse });

class WarehouseSold extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: "",
			datePickerData: moment().format("YYYY-MM-DD"),
			showDescriptionValue: false,
			description:""
		};
	}
	componentDidMount() {
		const {
			dispatch,
			match: {
				params: { _id }
			},
			main: { employee },
			warehouse: { warehouse }
		} = this.props;
		if (!companyAdministrator(employee)) {
			if (Object.keys(warehouse || {}).length > 0) {
				if (
					!(warehouse.employees || []).some(
						(emp) =>
							(emp.emp || "as").toString() ===
							(employee._id || "").toString()
					)
				) {
					window.location.assign("/not-found");
				}
			} else {
				dispatch(getWarehouseSingle({ warehouseID: _id })).then((c) => {
					if (
						!(c.json.data?.employees || []).some(
							(emp) =>
								(emp.emp || "as").toString() ===
								(employee._id || "").toString()
						)
					) {
						window.location.assign("/not-found");
					}
				});
			}
		}
		dispatch(
			getSoldSubProduct({
				date: this.state.datePickerData,
				company: this.props.main.company._id,
				warehouse: _id
			})
		);
		// dispatch(getSubAssets({ pageNum: 0, pageSize: 0 }));
	}
	searchProduct() {
		const {
			dispatch,
			match: {
				params: { _id }
			},
			warehouse: { warehouses }
		} = this.props;
		// dispatch(
		//     getWarehouseSingleProducts({ warehouse: _id, search: search })
		// );
		dispatch(
			getSoldSubProduct({
				date: this.state.datePickerData,
				warehouse: _id,
				search: this.state.search
			})
		);
	}
	showDescription(description){
		console.log('showDescription clicked');
		this.setState({showDescriptionValue: true,description:description})
	}
	render() {
		const {
			warehouse: { loadingSoldProducts, soldProducts },
			match: {
				params: { _id }
			},
			main: { employee }
		} = this.props;
		function getTag(e) {
			switch (e) {
				case "sold":
					return <Tag color={"success"}>Зарагдсан</Tag>;
				case "taken":
					return <Tag color={"magenta"}>Авагдсан</Tag>;
				default:
					return <Tag>-</Tag>;
			}
		}
		function getPaidType(e) {
			switch (e) {
				case "bill":
					return <Tag color={"green"}>{locale("payType.cash")}</Tag>;
				case "card":
					return <Tag color={"pink"}>{locale("payType.card")}</Tag>;
				case "bankAccount":
					return <Tag color={"yellow"}>{locale("payType.bankAccount")}</Tag>;
				case "bankAccountOther":
					return <Tag color={"orange"}>{locale("payType.bankAccount2")}</Tag>;
				case "loan":
					return <Tag color={"magenta"}>{locale("payType.loan")}</Tag>;
				case "Нийт":
					return <div style={{ textAlign: "right" }}>{locale("payType.all")}:</div>;
				default:
					return <Tag>-</Tag>;
			}
		}
		const columns = [
			{
				key: "_id",
				title: "№",
				render: (txt, record, idx) => idx + 1,
				width: 100
			},
			{
				title:locale("warehouse_single.product.base"),
				key: "product",
				render: (record) => (
					<>
						{record.product?.title}
						{" > "}
						{(record.subAssets || []).map((subAsset) => (
							<Tag key={subAsset._id}>{subAsset.title}</Tag>
						))}
					</>
				)
			},
			{
				title: locale("common_warehouse.explanation"),
				key: "description",
				render: (record) => (
					record.description ?
						<span className='link-like-span' onClick={() => this.showDescription(record.description)}>Харах</span>
						:
						null
				)
			},
			{
				title: locale("common_warehouse.unit"),
				key: "quantity",
				dataIndex: "quantity",
				width: 75
			},
			{
				title: locale("common_warehouse.unitPrice"),
				key: "price",
				dataIndex: "price",
				render: (record) =>
					`${(record || "0")
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`,
				width: 150
			},
			{
				title: locale("payType.all"),
				key: "total",
				render: (record) =>
					`${(record.price * record.quantity || "0")
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`,
				width: 175
			},
			{
				title: locale("payType.base"),
				key: "paidType",
				dataIndex: "paidType",
				render: (record) => getPaidType(record),
				width: 150
			},
			{
				title: locale("common_warehouse.type"),
				key: "type",
				dataIndex: "type",
				render: (record) => getTag(record),
				width: 150
			},
			{
				title: locale("common_warehouse.time"),
				key: "created",
				dataIndex: "created",
				render: (record) =>
					moment(record).format("YYYY/MM/DD HH:mm:ss"),
				width: 200
			}
		];
		let types = {};
		(soldProducts || []).map((soldProduct) => {
			let income = soldProduct.quantity * soldProduct.price || 0,
				cost =
					(soldProduct.supply?.cost || 0) *
						(soldProduct.quantity || 0) || 0;
			if (
				(Object.keys(types) || []).every(
					(type) => type !== soldProduct.paidType
				)
			) {
				types[soldProduct.paidType] = {
					type: soldProduct.paidType,
					cost: cost,
					income: income,
					total: income - cost
				};
			} else {
				types[soldProduct.paidType].cost += cost;
				types[soldProduct.paidType].income += income;
				types[soldProduct.paidType].total += income - cost;
			}
		});
		let formattedType = [],
			totalCost = 0,
			totalIncome = 0,
			total = 0;
		(Object.keys(types) || []).map((type) => {
			formattedType.push(types[type]);
			total += types[type].total;
			totalCost += types[type].cost;
			totalIncome += types[type].income;
		});
		formattedType.push({
			type: locale("payType.all"),
			total: total,
			cost: totalCost,
			income: totalIncome
		});
		let smallColumns = [
			{
				key: "paidType",
				title: locale("common_warehouse.type"),
				dataIndex: "type",
				render: (record) => getPaidType(record),
				width: 150
			},
			{
				key: "income",
				title: locale("common_warehouse.allIncome"),
				dataIndex: "income",
				render: (record) =>
					`${(record || "0")
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`
			}
		];
		if (companyLord(employee)) {
			smallColumns.push(
				{
					key: "cost",
					title: locale("common_warehouse.allOutcome"),
					dataIndex: "cost",
					render: (record) =>
						`${(record || "0")
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`
				},
				{
					key: "total",
					title: locale("common_warehouse.allProfit"),
					dataIndex: "total",
					render: (record) =>
						`${(record || "0")
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`
				}
			);
		}
		return (
			<Card
				title={
					<Link
						to={`/warehouse/${_id}`}
						style={{
							marginRight: 200,
							textDecoration: "underline"
						}}
					>
						<LeftOutlined style={{ marginRight: 5 }} />
						{locale("warehouse_single.product.sold")}
					</Link>
				}
				key={"foobar"}
				loading={loadingSoldProducts}
			>
				<Form
					onFinish={this.searchProduct.bind(this)}
					style={{ marginBottom: 10 }}
				>
					<DatePicker
						style={{ width: 200, marginRight: 20 }}
						size="small"
						format="YYYY-MM-DD"
						value={
							this.state.datePickerData
								? moment(this.state.datePickerData)
								: null
						}
						onChange={(e, val) =>
							this.setState({ datePickerData: val })
						}
					/>
					<Input
						allowClear
						maxLength={60}
						size="small"
						placeholder={locale("warehouse_single.product.name")}
						style={{ width: 200, marginRight: 20 }}
						value={this.state.search}
						name="search"
						onChange={(e) =>
							this.setState({
								search: e.target.value
							})
						}
					/>
					<Button
						type="primary"
						size="small"
						icon={<SearchOutlined />}
						htmlType="submit"
					>
						{locale("common_warehouse.search")}
					</Button>
				</Form>
				<Table
					size={"small"}
					style={{ width: "max-content", marginBottom: 15 }}
					dataSource={formattedType}
					rowKey={(record) => record.type}
					loading={loadingSoldProducts}
					locale={{ emptyText: locale("common_warehouse.empty") }}
					pagination={false}
					columns={smallColumns}
				/>
				<Table
					size={"small"}
					dataSource={soldProducts}
					columns={columns}
					rowKey={(record) => record._id}
					loading={loadingSoldProducts}
					locale={{ emptyText: locale("common_warehouse.empty") }}
					pagination={false}
				/>


				<Modal
					title={locale("common_warehouse.explanation")}
					visible={this.state.showDescriptionValue}
					// onOk={this.submitWarehouse.bind(this)}
					onCancel={() => this.setState({showDescriptionValue: false})}
					destroyOnClose
					okText={locale("common_warehouse.save")}
					cancelText={locale("common_warehouse.cancel")}
					maskClosable={true} //x
				>

					{this.state.description}
				</Modal>
			</Card>
		);
	}
}

export default connect(reducer)(WarehouseSold);
