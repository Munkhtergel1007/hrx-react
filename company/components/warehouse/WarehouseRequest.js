import React from "react";
import { connect } from "react-redux";
import {
	Card,
	Button,
	Col,
	Row,
	Popconfirm,
	Table,
	Tag,
	Space,
	Form,
	DatePicker,
	Input
} from "antd";
import { Link } from "react-router-dom";
import config, { companyAdministrator } from "../../config";
import { locale } from "../../lang";
import Cookies from "js-cookie";
import {
	CloseOutlined,
	CheckOutlined,
	SwapOutlined,
	LeftOutlined,
	SearchOutlined
} from "@ant-design/icons";
import moment from "moment";
import NumberFormat from "react-number-format";
import {
	getRequestSubProduct,
	getSubAssets,
	giveSubProductOffer,
	getWarehouseSingle
} from "../../actions/warehouse_actions";

const reducer = ({ main, warehouse }) => ({ main, warehouse });

class WarehouseRequest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: "",
			date: moment()
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
			getRequestSubProduct({
				warehouse: _id,
				date: moment().format('YYYY/MM/DD')
			})
		);
		// dispatch(getSubAssets({ pageNum: 0, pageSize: 0 }));
	}
	render() {
		const {
			warehouse: { loadingRequestProducts, requestProducts, requesting },
			match: {
				params: { _id }
			}
		} = this.props;
		function getTag(e) {
			switch (e) {
				case "active":
					return <Tag color={"success"}>Зөвшөөрсөн</Tag>;
				case "pending":
					return <Tag>Хүлээгдэж буй</Tag>;
				case "declined":
					return <Tag color={"magenta"}>Татгалзсан</Tag>;
				default:
					return <Tag>-</Tag>;
			}
		}
		const columns = [
			{
				key: "_id",
				title: "№",
				render: (txt, record, idx) => idx + 1,
				width: 50
			},
			{
				title: locale("warehouse_single.product.base"),
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
				title: locale("common_warehouse.product.unit"),
				key: "quantity",
				dataIndex: "quantity",
				width: 67
			},
			{
				title: locale("common_warehouse.unitPrice"),
				key: "price",
				dataIndex: "price",
				render: (record) =>
					`${(record || "0")
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`,
				width: 100
			},
			{
				title: locale("common_warehouse.status"),
				key: "status",
				dataIndex: "status",
				render: (record) => getTag(record),
				width: 100
			},
			{
				title:  locale("common_warehouse.date"),
				key: "created",
				dataIndex: "created",
				render: (record) => moment(record).format("YYYY/MM/DD"),
				width: 100
			}
		];
		let own = [],
			came = [];
		(requestProducts || []).map((prods) => {
			if (
				(prods.warehouse?._id || "as").toString() ===
				(_id || "").toString()
			) {
				own.push(prods);
			} else {
				came.push(prods);
			}
		});

		return (
			<Row gutter={20}>
				<Col
					span={12}
					style={{
						height: "calc(100vh - 100px)",
						// position: 'sticky', top: 20,
						overflowY: "auto"
					}}
					className={"custom-task-scroll-div"}
				>
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
								{locale("warehouse_req.arrived")}
							</Link>
						}
						key={"foobar"}
						loading={loadingRequestProducts}
					>
						<Form
							style={{ marginBottom: 10 }}
							layout={"horizontal"}
							fields={[
								{name: 'search', value: this.state.search},
								{name: 'date', value: this.state.date},
							]}
							onFinish={(e) =>
								this.props.dispatch(
									getRequestSubProduct({
										warehouse: _id,
										search: e.search,
										date: moment(e.date).format('YYYY/MM/DD')
									})
								)
							}
						>
							<Form.Item
								name={"search"}
								style={{
									display: "inline-block",
									marginBottom: 0,
									marginRight: 6
								}}
							>
								<Input
									size={"small"}
									style={{ width: 250 }}
									placeholder={locale("warehouse_single.product.name")}
									autoComplete={'off'}
									value={this.state.search}
									onChange={(e) => this.setState({search: e.target.value})}
								/>
							</Form.Item>
							<Form.Item
								name={"date"}
								style={{
									display: "inline-block",
									marginBottom: 0,
									marginRight: 6
								}}
							>
								<DatePicker
									size={"small"}
									style={{ width: 120 }}
									placeholder={locale("common_warehouse.time")}
									autoComplete={'off'}
									value={this.state.date}
									onChange={(e) => this.setState({date: e})}
								/>
							</Form.Item>
							<Button
								style={{ marginTop: 4 }}
								size={"small"}
								icon={<SearchOutlined />}
								htmlType={"submit"}
								type={"primary"}
							>
								{locale("common_warehouse.search")}
							</Button>
						</Form>
						<Table
							size={"small"}
							dataSource={came}
							expandable={{
								rowExpandable: () => true,
								expandedRowRender: (record) => (
									<div style={{ textAlign: "center" }}>
										<Tag>{record.warehouse?.title}</Tag>
										{" -> "}
										<Tag style={{ marginLeft: 8 }}>
											{record.warehouseGiven?.title}
										</Tag>
									</div>
								)
							}}
							columns={[
								...columns,
								{
									key: "action",
									title: <SwapOutlined />,
									render: (record) =>
										record.status === "pending" ? (
											<Space direction={"horizontal"}>
												<Popconfirm
													disabled={requesting}
													okText={locale("yes")}
													cancelText={locale("no")}
													onConfirm={() =>
														this.props.dispatch(
															giveSubProductOffer(
																{
																	_id: record._id,
																	status: "active"
																}
															)
														)
													}
													title={locale("confirmQ")}
												>
													<Button
														icon={<CheckOutlined />}
														type={"primary"}
														size={"small"}
													/>
												</Popconfirm>

												<Popconfirm
													disabled={requesting}
													okText={locale("yes")}
													cancelText={locale("no")}
													onConfirm={() =>
														this.props.dispatch(
															giveSubProductOffer(
																{
																	_id: record._id,
																	status: "declined"
																}
															)
														)
													}
													title={locale("refuseQ")}
												>
													<Button
														icon={<CloseOutlined />}
														size={"small"}
														danger
													/>
												</Popconfirm>
											</Space>
										) : null
								}
							]}
							rowKey={(record) => record._id}
							loading={loadingRequestProducts}
							locale={{ emptyText: locale("common_warehouse.empty") }}
							pagination={false}
						/>
					</Card>
				</Col>
				<Col
					span={12}
					style={{
						height: "calc(100vh - 100px)",
						// position: 'sticky', top: 20,
						overflowY: "auto"
					}}
					className={"custom-task-scroll-div"}
				>
					<Card
						title={locale("warehouse_req.sent")}
						key={"foobar"}
						loading={loadingRequestProducts}
					>
						<Form
							style={{ marginBottom: 10 }}
							layout={"horizontal"}
							fields={[
								{name: 'search', value: this.state.search},
								{name: 'date', value: this.state.date},
							]}
							onFinish={(e) =>
								this.props.dispatch(
									getRequestSubProduct({
										warehouse: _id,
										search: e.search,
										date: moment(e.date).format('YYYY/MM/DD')
									})
								)
							}
						>
							<Form.Item
								name={"search"}
								style={{
									display: "inline-block",
									marginBottom: 0,
									marginRight: 6
								}}
							>
								<Input
									size={"small"}
									style={{ width: 250 }}
									placeholder={locale("warehouse_single.product.name")}
									autoComplete={'off'}
									value={this.state.search}
									onChange={(e) => this.setState({search: e.target.value})}
								/>
							</Form.Item>
							<Form.Item
								name={"date"}
								style={{
									display: "inline-block",
									marginBottom: 0,
									marginRight: 6
								}}
							>
								<DatePicker
									size={"small"}
									style={{ width: 120 }}
									placeholder={locale("common_warehouse.time")}
									autoComplete={'off'}
									value={this.state.date}
									onChange={(e) => this.setState({date: e})}
								/>
							</Form.Item>
							<Button
								style={{ marginTop: 4 }}
								size={"small"}
								icon={<SearchOutlined />}
								htmlType={"submit"}
								type={"primary"}
							>
								{locale("common_warehouse.search")}
							</Button>
						</Form>
						<Table
							size={"small"}
							dataSource={own}
							columns={columns}
							rowKey={(record) => record._id}
							loading={loadingRequestProducts}
							locale={{ emptyText: locale("common_warehouse.empty")}}
							pagination={false}
							expandable={{
								rowExpandable: () => true,
								expandedRowRender: (record) => (
									<div style={{ textAlign: "center" }}>
										<Tag>{record.warehouse?.title}</Tag>
										{" -> "}
										<Tag style={{ marginLeft: 8 }}>
											{record.warehouseGiven?.title}
										</Tag>
									</div>
								)
							}}
						/>
					</Card>
				</Col>
			</Row>
		);
	}
}

export default connect(reducer)(WarehouseRequest);
