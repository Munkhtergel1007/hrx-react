import React, { Fragment } from "react";
import { connect } from "react-redux";
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
import config, {hasAction} from "../../config";
import { companyAdministrator } from "../../config";
import {
	FileDoneOutlined,
	GiftOutlined,
	PlusOutlined,
	UsergroupAddOutlined,
	UserAddOutlined,
	DownOutlined,
	DeleteOutlined,
	EyeOutlined,
	EditFilled,
	EditOutlined,
	DeleteFilled,
	CaretRightOutlined
} from "@ant-design/icons";
import moment from "moment";
import { getCategory } from "../../actions/category_actions";
import { getAsset } from "../../actions/asset_actions.js";
import { Link } from "react-router-dom";
import * as actions from "../../actions/product_actions.js";
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

import ModalBodyProduct from "./ModalBodyProduct";
import ModalBodySubProduct from "./ModalBodySubProduct";

const reducer = ({ product, main }) => ({ product, main });

class Product extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: "",

			modalProduct: {},
			modalSubProduct: {}
		};
		this.changeParentState = this.changeParentState.bind(this);
	}
	componentDidMount() {
		const {main:{employee}} = this.props;
		if (hasAction(["product"], employee)) {
			this.props.dispatch(getAsset());
			this.props.dispatch(getCategory());
			this.props.dispatch(actions.getProduct());
		} else {
			this.props.history.replace("/not-found");
		}
	}
	changeParentState(e) {
		this.setState(e);
	}
	render() {
		const {
			product: {
				loadingAssets,
				assets,
				loadingCategory,
				categories,
				loadingProducts,
				products,
				all
			},
			main: { user, employee }
		} = this.props;
		let pagination = {
			total: all,
			current: this.state.pageNum + 1,
			pageSize: this.state.pageSize,
			position: "bottom",
			showSizeChanger: false
		};
		let columns = [
			{
				key: "index",
				title: "№",
				render: (record) =>
					this.state.pageNum * this.state.pageSize +
					(products || []).indexOf(record) +
					1,
				ellipsis: true,
				width: 100
			},
			{
				key: "title",
				title: "Нэр",
				dataIndex: "title"
			},
			{
				key: "category",
				title: "Ангилал",
				render: (record) => record.category?.title || "-",
				ellipsis: true
			},
			{
				key: "subCategory",
				title: "Дэд ангилал",
				render: (record) => record.subCategory?.title || "-",
				ellipsis: true
			},
			{
				key: "assets",
				title: "Нэмэлт талбар",
				render: (record) =>
					(record.assets || []).map((asset) => (
						<Tag key={asset._id}>{asset.title}</Tag>
					)) || "-"
			},
			{
				key: "actions",
				title: "Үйлдэл",
				render: (record) => (
					<>
						<Button
							icon={<EditOutlined />}
                            size={"small"}
                            style={{marginRight:8}}
							onClick={() => {
								const { categories } = this.props.product;
								let cate = {};
								(categories || []).map((category) => {
									if (
										(category._id || "as").toString() ===
										(record.category?._id || "").toString()
									) {
										cate = category;
									}
								});
								this.setState({
									modalProduct: {
										assets: record.assets,
										category: cate,
										subCategory: record.subCategory,
										title: record.title,
										_id: record._id
									}
								});
							}}
                        >Засах</Button>
						<Popconfirm
							disabled={record.loading}
							title={"Бүтээгдэхүүн устгах уу?"}
							okText={"Тийм"}
							cancelText={"Үгүй"}
							onConfirm={() =>
								this.props.dispatch(
									actions.deleteProduct({ _id: record._id })
								)
							}
						>
							<Button
                                size={"small"}
								loading={record.loading}
								icon={<DeleteOutlined />}
								danger
                            >Устгах</Button>
						</Popconfirm>
					</>
				),
				width: 200
			}
		];
		const expandedRender = (record) => {
			let innerColumns = [
				{
					key: "index",
					title: "№",
					render: (recordInner) =>
						(record.child || []).indexOf(recordInner) + 1,
					ellipsis: true,
					width: 100
				},
				{
					key: "subAssets",
					title: "Дэд нэмэлт талбар",
					render: (recordInner) => {
						let asset = "",
							subAsset = "",
							arr = [];
						(recordInner.subAssets || []).map((subAsset) =>
							(record.assets || []).map((asset) => {
								if (
									(subAsset.asset || "as").toString() ===
									(asset._id || "").toString()
								) {
									arr.push(
										<Tag key={subAsset._id}>
											<b>{asset.title}</b>
											{` > ${subAsset.title}`}
										</Tag>
									);
								}
							})
						);
						return arr;
					}
				},
				{
					key: 'price',
					title: 'Ш.Үнэ',
					dataIndex: 'price',
					render: (record) => record ? `${(record || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₮` : '-',
					width: 120
				},
				{
					key: "actions",
					title: "Үйлдэл",
					render: (recordInner) => (
						<>
							<Button
								icon={<EditOutlined />}
                                style={{marginRight:8}}
                                size={"small"}
								onClick={() =>
									this.setState({
										modalSubProduct: {
											_id: recordInner._id,
											subAssets: recordInner.subAssets,
											productSingle: record,
											price: recordInner.price
										}
									})
								}
                            >Засах</Button>
							<Popconfirm
								disabled={record.loading}
								title={"Дэд бүтээгдэхүүн устгах уу?"}
								okText={"Тийм"}
								cancelText={"Үгүй"}
								onConfirm={() =>
									this.props.dispatch(
										actions.deleteSubProduct({
											_id: recordInner._id,
											catId: recordInner.product?._id
										})
									)
								}
							>
								<Button
									loading={record.loading}
                                    size={"small"}
									icon={<DeleteOutlined />}
									danger
                                >Устгах</Button>
							</Popconfirm>
						</>
					),
					width: 200
				}
			];
			return (
				<>
					<div style={{ textAlign: "right" }}>
						<Button
							size={"small"}
							key={"subProduct-add"}
							type={"primary"}
							onClick={() =>
								this.setState({
									modalSubProduct: {
										subAssets: [],
										productSingle: record
									}
								})
							}
							icon={<PlusOutlined />}
						>
							Дэд бүтээгдэхүүн нэмэх
						</Button>
					</div>
					<Table
						size={"small"}
						pagination={false}
						rowKey={(recordInner) =>
							`${record._id}-${recordInner._id}`
						}
						locale={{ emptyText: "Дэд бүтээгдэхүүн хоосон байна" }}
						columns={innerColumns}
						dataSource={record.child}
					/>
				</>
			);
		};
		const auth = companyAdministrator(employee)
		return (
			<>
				<Card
					title={"Бүтээгдэхүүн"}
					key={"product_card"}
					loading={this.state.modal}
					extra={
						<div>
							<Link
								key="/warehouse"
								to="/warehouse"
								style={{ marginRight: 30 }}
							>
								<Button type={this.props.location.pathname === '/warehouse' || this.props.location.pathname === '\\warehouse' ? "dashed" : "default"} key={"warehouse-link"}>
									Агуулах
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
											Ангилал
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
											Нэмэлт талбар
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
											Бүтээгдэхүүн
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
										<Button type={this.props.location.pathname === '/restock' || this.props.location.pathname === '\\restock' ? "dashed" : "default"} key={"warehouse-add"}>
											Бараа татлага
										</Button>
									</Link>
									: null
							}
							{
								hasAction(['product'], employee) ?
									<Button
										key={"product-add"}
										type={"primary"}
										onClick={() =>
											this.setState({
												modalProduct: {
													assets: [],
													category: "",
													subCategory: "",
													title: ""
												}
											})
										}
										icon={<PlusOutlined />}
									>
										Бүтээгдэхүүн нэмэх
									</Button>
									: null
							}
						</div>
					}
				>
					<Table
						size={"small"}
						rowKey={(record) => record._id}
						columns={columns}
						dataSource={products}
						pagination={pagination}
						expandable={{
							rowExpandable: (record) => record.child || [],
							expandedRowRender: expandedRender
						}}
						locale={{ emptyText: "Бүтээгдэхүүн хоосон байна" }}
						onChange={(e) =>
							this.setState({ pageNum: e.current - 1 }, () =>
								this.props.dispatch(
									actions.getProduct({
										pageNum: this.state.pageNum,
										pageSize: this.state.pageSize
									})
								)
							)
						}
					/>
				</Card>
				<Modal
					width={700}
					visible={
						Object.keys(this.state.modalProduct || {}).length > 0
					}
					title={`Бүтээгдэхүүн ${
						this.state.modalProduct?._id ? "засах" : "нэмэх"
					}`}
					footer={null}
					onCancel={() => this.setState({ modalProduct: {} })}
					bodyStyle={{ padding: 0 }}
					destroyOnClose
				>
					{Object.keys(this.state.modalProduct || {}).length > 0 ? (
						<ModalBodyProduct
							{...this.state.modalProduct}
							changeParentState={this.changeParentState}
						/>
					) : null}
				</Modal>
				<Modal
					width={700}
					visible={
						Object.keys(this.state.modalSubProduct || {}).length > 0
					}
					title={`Дэд бүтээгдэхүүн ${
						this.state.modalSubProduct?._id ? "засах" : "нэмэх"
					}`}
					footer={null}
					onCancel={() => this.setState({ modalSubProduct: {} })}
					bodyStyle={{ padding: 0 }}
					destroyOnClose
				>
					{Object.keys(this.state.modalSubProduct || {}).length >
					0 ? (
						<ModalBodySubProduct
							{...this.state.modalSubProduct}
							changeParentState={this.changeParentState}
						/>
					) : null}
				</Modal>
			</>
		);
	}
}

export default connect(reducer)(Product);
