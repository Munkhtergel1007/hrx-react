import React from "react";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import {
	Card,
	Input,
	Button,
	Modal,
	Tag,
	Space,
	Row,
	Col,
	Table,
	Badge,
	Form,
	Drawer,
	DatePicker,
	Tabs,
	Spin
} from "antd";
const { TabPane } = Tabs;
import { Link } from "react-router-dom";
import { locale } from "../../lang";
import config, {
	companyAdministrator,
	printStaticRole,
	companyLord
} from "../../config";
import {
	PlusOutlined,
	MinusOutlined,
	EyeOutlined,
	ArrowUpOutlined,
	SearchOutlined,
	LeftOutlined,
	RightOutlined
} from "@ant-design/icons";
import moment from "moment";
import {
	getWarehouseSingle,
	deleteWarehouse,
	toggleWarehouseModal,
	getWarehouseSingleProducts,
	sellSubProduct,
	getSoldSubProduct,
	setCurrentProduct,
	toggleDetailsModal,
	toggleAllDetailsModal
} from "../../actions/warehouse_actions";
import { getWarehouses } from "../../actions/warehouse_actions";
import { getCategory } from "../../actions/category_actions";
import ModalBodyProductSell from "./ModalBodyProductSell";
import ModalBodyProductGive from "./ModalBodyProductGive";
import ProductDetails from "./ProductDetails";
import AllDetails from "./AllDetails";
import AllSales from "./AllSales";
const reducer = ({ main, warehouse }) => ({ main, warehouse });

function todaysDate() {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	return yyyy + "-" + mm + "-" + dd;
}
class WarehouseSingle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: "",
			searchSold: "",
			modal: false,
			give: false,
			activeTab: "1",
			datePickerData: todaysDate(),
			selectedSubProduct: "",
			selectedProduct: "",
			selectedCategory: "",
			selectedSubCategory: ""
		};
		this.changeParentState = this.changeParentState.bind(this);
	}
	componentDidMount() {
		const {
			dispatch,
			match: {
				params: { _id }
			},
			warehouse: { warehouses }
		} = this.props;
		dispatch(getWarehouseSingle({ warehouseID: _id })).then((c) => {
			if (c.json.success) {
				dispatch(getWarehouseSingleProducts({ warehouse: _id }));
				if ((warehouses || []).length === 0)
					dispatch(
						getWarehouses({
							companyID: this.props.main.company._id
						})
					);
				dispatch(
					getSoldSubProduct({
						date: this.state.datePickerData,
						warehouse: _id
					})
				);
				dispatch(getCategory());
			} else {
				window.location.assign("/not-found");
			}
		});
	}
	deleteWarehouse(e) {
		const { dispatch } = this.props;
		dispatch(deleteWarehouse(e));
	}
	changeParentState(e) {
		this.setState(e);
	}
	showDetails(e) {
		const { dispatch } = this.props;
		dispatch(setCurrentProduct({ data: e }));
		dispatch(toggleDetailsModal({ data: e }));
	}
	closeModal() {
		const { dispatch } = this.props;
		dispatch(toggleDetailsModal({ data: false }));
	};
	searchSoldProduct() {
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
				search: this.state.searchSold
			})
		);
	}
	searchProduct() {
		const {
			dispatch,
			match: {
				params: { _id }
			},
			warehouse: { warehouses }
		} = this.props;
		this.props.dispatch(
			getWarehouseSingleProducts({
				warehouse: _id,
				search: this.state.search,
				category: this.state.selectedCategory,
				subCategory: this.state.selectedSubCategory
			})
		);
	}
	openAllDetails() {
		const { dispatch } = this.props;
		dispatch(toggleAllDetailsModal({ data: true }));
	}
	closeModalAllDetails() {
		const { dispatch } = this.props;
		dispatch(toggleAllDetailsModal({ data: false }));
	}
	onChangeDatePicker(value) {
		this.setState({ datePickerData: value });
	}
	render() {
		const {
			warehouse: {
				warehouse,
				warehouses,
				fetchingWarehouse,
				fetchingWarehouses,
				subProducts,
				selling,
				giving,
				loadingSoldProducts,
				soldProducts,
				loadingSupplies,
				detailsModal,
				details,
				loadingDetails,
				modalDetails,
				modalAllDetails,
				loadingCategories,
				categories
			},
			match: {
				params: { _id }
			},
			main: { employee }
		} = this.props;
		let sortedProducts = subProducts || [];
		const columns = [
			{
				key: "№",
				title: "№",
				render: (record) =>
					this.state.pageNum * this.state.pageNum +
					(sortedProducts || []).indexOf(record) +
					1,
				width: 150
			},
			{
				key: "subProduct",
				title: locale("warehouse_single.product.base"),
				render: (record) => {
					return (
						<div
							onClick={companyLord(employee) ? this.showDetails.bind(this, record) : null}
							style={{
								// textDecoration: "underLine",
								// cursor: "pointer",
								userSelect: "none"
							}}
						>
							{record?.product?.title}
							{" > "}
							{(record?.subAssets || []).map((subAsset) => (
								<Tag
									key={`${record._id}-${record?._id}-${subAsset._id}`}
								>
									{subAsset.title}
								</Tag>
							))}
						</div>
					);
				}
			},
			{
				key: "Үнэ",
				title:  locale("common_warehouse.unitPrice"),
				dataIndex: "price",
				render: (record) =>
					record
						? `${(record || "0")
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`
						: "-",
				width: 120
			},
			{
				key: "quantity",
				title: locale("common_warehouse.unitNum"),
				dataIndex: "quantity",
				width: 100
			}
		];
		const soldColumns = [
			{
				key: "_id",
				title: "№",
				render: (txt, record, idx) => idx + 1,
				width: 100
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
				title:  locale("common_warehouse.unit"),
				key: "quantity",
				dataIndex: "quantity",
				width: 67
			},
			{
				title: "Ш.Үнэ",
				key: "price",
				dataIndex: "price",
				render: (record) =>
					`${(record || "0")
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`,
				width: 100
			},
			{
				title:  locale("common_warehouse.time"),
				key: "created",
				dataIndex: "created",
				render: (record) => moment(record).format("HH:mm:ss"),
				width: 100
			}
		];
		let worthy = false;
		if (
			companyAdministrator(employee) ||
			(warehouse.employees || []).some(
				(emp) =>
					(emp.emp || "as").toString() ===
					(employee._id || "").toString()
			)
		) {
			worthy = true;
		}
		let subCategories = [];
		(categories || []).map((category) => {
			if (category._id === this.state.selectedCategory) {
				subCategories = category.child;
			}
		});
		return (
			<>
				<Row gutter={20}>
					<Col
						span={14}
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
									to="/warehouse"
									style={{
										marginRight: 200,
										textDecoration: "underline"
									}}
								>
									<LeftOutlined style={{ marginRight: 5 }} />
									{(warehouse || {}).title || "Агуулах"}
								</Link>
							}
							key={"foobar"}
							loading={fetchingWarehouse}
							extra={
								worthy ? (
									<Space direction={"horizontal"}>
										{companyLord(employee) ? (
											<div
												style={{
													cursor: "pointer",
													textDecoration: "underline",
													color: "blue"
												}}
												onClick={() =>
													this.openAllDetails()
												}
											>
												Дэлгэрэнгүй
											</div>
										) : null}
										<Badge dot>
											<Link
												to={`/warehouse/${_id}/request`}
											>
												{locale("warehouse_single.product.check")}
											</Link>
										</Badge>
										{fetchingWarehouses ? (
											<Button
												icon={<ArrowUpOutlined />}
												loading={fetchingWarehouses}
											>
												{locale("warehouse_single.product.takeOther")}
											</Button>
										) : (warehouses || []).length > 0 ? (
											<Button
												icon={<ArrowUpOutlined />}
												loading={giving}
												onClick={() => {
													// this.setState({
													// 	selectedSubProduct: {
													// 		_id: ""
													// 	}
													// })
													this.setState({
														give: true
													});
												}}
											>
												{locale("warehouse_single.product.giveOther")}
											</Button>
										) : null}
										<Button
											icon={<PlusOutlined />}
											loading={selling}
											type={"primary"}
											onClick={() => {
												// this.setState({
												// 	selectedSubProduct: {
												// 		_id: ""
												// 	}
												// })
												this.setState({ modal: true });
											}}
										>
											{locale("warehouse_single.product.sell")}
										</Button>
									</Space>
								) : null
							}
						>
							<Form
								style={{ marginBottom: 10 }}
								layout={"horizontal"}
								onFinish={() => this.searchProduct()}
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
										allowClear
										style={{ width: 250 }}
										onChange={(e) =>
											this.setState({
												search: e.target.value
											})
										}
										value={this.state.search}
										placeholder={locale("warehouse_single.product.name")}
										autoComplete={"false"}
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
							{loadingCategories ? (
								<div
									style={{
										textAlign: "center",
										marginBottom: 10
									}}
								>
									<Spin />
								</div>
							) : (categories || []).length > 0 ? (
								<div
									className={"warehouseSingleCategory"}
									style={{ marginBottom: 10 }}
								>
									<div
										className={"scrollButton disabled"}
										id={"scroll-1"}
										onClick={(e) => {
											if (
												document.querySelector(
													"#scroll-1"
												).className === "scrollButton"
											) {
												document.querySelector(
													".tagDiv"
												).scrollLeft -= 150;
											}
										}}
									>
										<LeftOutlined />
									</div>
									<div
										className={"scrollHidden tagDiv"}
										onScroll={(e) => {
											if (e.target.scrollLeft === 0)
												document.querySelector(
													"#scroll-1"
												).className =
													"scrollButton disabled";
											else
												document.querySelector(
													"#scroll-1"
												).className = "scrollButton";
											if (
												e.target.scrollLeft ===
												e.target.scrollWidth -
													e.target.offsetWidth
											)
												document.querySelector(
													"#scroll-2"
												).className =
													"scrollButton disabled";
											else
												document.querySelector(
													"#scroll-2"
												).className = "scrollButton";
										}}
									>
										{(categories || []).map((category) => (
											<Tag
												className={
													this.state
														.selectedCategory ===
													category._id
														? "warehouseSingleCategoryTag selected"
														: "warehouseSingleCategoryTag"
												}
												onClick={() =>
													this.state
														.selectedCategory !==
													category._id
														? this.setState(
																{
																	selectedCategory:
																		category._id,
																	selectedSubCategory:
																		""
																},
																() =>
																	this.searchProduct()
														  )
														: this.setState(
																{
																	selectedCategory:
																		"",
																	selectedSubCategory:
																		""
																},
																() =>
																	this.searchProduct()
														  )
												}
											>
												{category.title}
											</Tag>
										))}
									</div>
									<div
										className={"scrollButton"}
										id={"scroll-2"}
										onClick={(e) => {
											if (
												document.querySelector(
													"#scroll-2"
												).className === "scrollButton"
											) {
												document.querySelector(
													".tagDiv"
												).scrollLeft += 150;
											}
										}}
									>
										<RightOutlined />
									</div>
								</div>
							) : (
								<div
									style={{
										textAlign: "center",
										color: "rgba(0,0,0,0.5)"
									}}
								>
									{locale("warehouse_single.cate.empty")}
								</div>
							)}
							{(subCategories || []).length > 0 ? (
								<div className={"warehouseSingleCategory"}>
									<div
										className={"scrollButton disabled"}
										id={"scroll-3"}
										onClick={(e) => {
											if (
												document.querySelector(
													"#scroll-3"
												).className === "scrollButton"
											) {
												document.querySelector(
													".tagSubDiv"
												).scrollLeft -= 150;
											}
										}}
									>
										<LeftOutlined />
									</div>
									<div
										className={"scrollHidden tagSubDiv"}
										onScroll={(e) => {
											if (e.target.scrollLeft === 0)
												document.querySelector(
													"#scroll-3"
												).className =
													"scrollButton disabled";
											else
												document.querySelector(
													"#scroll-3"
												).className = "scrollButton";
											if (
												e.target.scrollLeft ===
												e.target.scrollWidth -
													e.target.offsetWidth
											)
												document.querySelector(
													"#scroll-4"
												).className =
													"scrollButton disabled";
											else
												document.querySelector(
													"#scroll-4"
												).className = "scrollButton";
										}}
									>
										{(subCategories || []).map(
											(category) => (
												<Tag
													className={
														this.state
															.selectedSubCategory ===
														category._id
															? "warehouseSingleCategoryTag selected"
															: "warehouseSingleCategoryTag"
													}
													onClick={() =>
														this.state
															.selectedSubCategory !==
														category._id
															? this.setState(
																	{
																		selectedSubCategory:
																			category._id
																	},
																	() =>
																		this.searchProduct()
															  )
															: this.setState(
																	{
																		selectedSubCategory:
																			""
																	},
																	() =>
																		this.searchProduct()
															  )
													}
												>
													{category.title}
												</Tag>
											)
										)}
									</div>
									<div
										className={"scrollButton"}
										id={"scroll-4"}
										onClick={(e) => {
											if (
												document.querySelector(
													"#scroll-4"
												).className === "scrollButton"
											) {
												document.querySelector(
													".tagSubDiv"
												).scrollLeft += 150;
											}
										}}
									>
										<RightOutlined />
									</div>
								</div>
							) : null}
							<Table
								style={{ marginTop: 20 }}
								rowKey={(record) => record._id}
								columns={columns}
								dataSource={sortedProducts || []}
								// dataSource={asdasdasdasd || []}
								loading={loadingSupplies}
								locale={{ emptyText: locale("common_warehouse.empty") }}
								pagination={false}
								size={"small"}
							/>
						</Card>
					</Col>
					<Col
						span={10}
						style={{
							height: "calc(100vh - 100px)",
							overflowY: "auto"
						}}
						className={"custom-task-scroll-div"}
					>
						<Card
							className={"custom-task-scroll"}
							title={ locale("common_warehouse.sold")}
							key={"foobar"}
							loading={loadingSoldProducts}
							extra={
								worthy ? (
									<Space direction="horizontal">
										<Link
											to={`/warehouse/${_id}/interaction`}
										>
											{locale("warehouse_single.give_take")}
										</Link>
										<Link to={`/warehouse/${_id}/sold`}>
											{locale("warehouse_single.product.sold_check")}
										</Link>
									</Space>
								) : null
							}
						>
							<div style={{ marginBottom: 20 }}>
								<Form
									onFinish={this.searchSoldProduct.bind(this)}
								>
									<DatePicker
										style={{ width: 200, marginRight: 20 }}
										size="small"
										format="YYYY-MM-DD"
										value={
											this.state.datePickerData
												? moment(
														this.state
															.datePickerData
												  )
												: null
										}
										onChange={(e, val) =>
											this.onChangeDatePicker(val)
										}
									/>
									<Input
										allowClear
										maxLength={60}
										size="small"
										placeholder={locale("common_warehouse.product.name")}
										style={{ width: 200, marginRight: 20 }}
										value={this.state.searchSold}
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
							</div>
							<Table
								size={"small"}
								dataSource={soldProducts}
								columns={soldColumns}
								locale={{ emptyText: locale("common_warehouse.empty") }}
								rowKey={(record) => record._id}
								loading={loadingSoldProducts}
								pagination={false}
							/>
						</Card>
					</Col>
				</Row>
				<Modal
					width={700}
					visible={this.state.modal}
					title={locale("warehouse_single.product.base")}
					footer={null}
					onCancel={() =>
						this.setState({
							modal: false,
							selectedSubProduct: "",
							selectedProduct: ""
						})
					}
					bodyStyle={{ padding: 0 }}
					destroyOnClose
				>
					{this.state.modal ? (
						<ModalBodyProductSell
							selectedProduct={this.state.selectedProduct}
							selectedSubProduct={this.state.selectedSubProduct}
							changeParentState={this.changeParentState}
							warehouseID={warehouse._id}
						/>
					) : null}
				</Modal>
				<Modal
					width={700}
					visible={this.state.give}
					title={locale("warehouse_single.product.give ")}
					footer={null}
					onCancel={() =>
						this.setState({
							give: false
						})
					}
					bodyStyle={{ padding: 0 }}
					destroyOnClose
				>
					{this.state.give ? (
						<ModalBodyProductGive
							changeParentState={this.changeParentState}
							warehouseID={warehouse._id}
						/>
					) : null}
				</Modal>
				<Modal
					visible={modalDetails}
					onCancel={this.closeModal.bind(this)}
					onOk={this.closeModal.bind(this)}
					width={1200}
				>
					<ProductDetails warehouseID={warehouse._id} />
				</Modal>
				{modalAllDetails ? (
					<Drawer
						visible={modalAllDetails}
						title={locale("warehouse_single.product.info")}
						placement="bottom"
						height={window.innerHeight - 100}
						onClose={this.closeModalAllDetails.bind(this)}
						closable={true}
					>
						<Tabs
							defaultActiveKey="1"
							activeKey={this.state.activeTab}
							onChange={(e) => this.setState({ activeTab: e })}
						>
							<TabPane tab={locale("warehouse_single.product.gets")} key="1">
								{this.state.activeTab === "1" ? (
									<AllDetails warehouseID={warehouse._id} />
								) : null}
							</TabPane>
							<TabPane tab="Борлуулалтууд" key="2">
								{this.state.activeTab === "2" ? (
									<AllSales warehouseID={warehouse._id} />
								) : null}
							</TabPane>
						</Tabs>
					</Drawer>
				) : null}
			</>
		);
	}
}

export default connect(reducer)(WarehouseSingle);
