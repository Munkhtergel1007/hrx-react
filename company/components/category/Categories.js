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
import config, { hasAction } from "../../config";
import {
	FileDoneOutlined,
	GiftOutlined,
	PlusOutlined,
	UsergroupAddOutlined,
	UserAddOutlined,
	DownOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	EditFilled,
	DeleteFilled,
	CaretRightOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import NumberFormat from "react-number-format";
import * as actions from "../../actions/category_actions";
import {getEmployee, getEmployeeCV, setPageConf} from "../../actions/employee_actions";
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const reducer = ({ category, main }) => ({ category, main });

class Categories extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: ""
		};
	}
	componentDidMount() {
		const {
			dispatch,
			main: { company, employee }
		} = this.props;
		if (hasAction(["category"], employee)) {
			dispatch(
				actions.getCategory({
					pageNum: this.state.pageNum,
					pageSize: this.state.pageSize
				})
			);
		} else {
			this.props.history.replace("/not-found");
		}
	}
	componentWillUnmount() {
		this.props.dispatch(actions.unmountShopCategories());
	}

	openModal(data, e) {
		e.stopPropagation();
		this.props.dispatch(actions.openCategoryModal(data));
	}
	closeModal() {
		this.props.dispatch(actions.closeCategoryModal());
	}
	submitCategory() {
		const {
			category: { category },
			main: { company }
		} = this.props;
		if (
			!category.title ||
			(category.title && category.title.trim() === "")
		) {
			return config.get("emitter").emit("warning", "Нэр оруулна уу!");
		}
		this.props.dispatch(actions.submitCategory(category));
	}
	onChangeHandler(e) {
		this.props.dispatch(
			actions.categoryChangeHandler({
				name: e.target.name,
				value: e.target.value
			})
		);
	}
	deleteCategory(id, e) {
		const {
			main: { company }
		} = this.props;
		e.stopPropagation();
		this.props.dispatch(
			actions.deleteCategory({
				_id: id,
				pageSize: this.state.pageSize,
				pageNum: this.state.pageNum
			})
		);
	}

	openSubModal(data, cat, e) {
		e.stopPropagation();
		if (cat && cat._id && cat._id !== "") {
			this.props.dispatch(
				actions.openSubCategoryModal({ ...data, category: cat })
			);
		}
	}
	closeSubModal() {
		this.props.dispatch(actions.closeSubCategoryModal());
	}
	submitSubCategory() {
		const {
			category: { subCategory },
			main: { company }
		} = this.props;
		if (
			!subCategory ||
			!subCategory.category ||
			!subCategory.category._id ||
			subCategory.category._id === ""
		) {
			return config
				.get("emitter")
				.emit("warning", "Алдаа, та browser-өө refresh хийнэ үү!");
		}
		if (
			!subCategory.title ||
			(subCategory.title && subCategory.title.trim() === "")
		) {
			return config.get("emitter").emit("warning", "Нэр оруулна уу!");
		}
		this.props.dispatch(actions.submitSubCategory(subCategory));
	}
	onChangeHandlerSub(e) {
		this.props.dispatch(
			actions.categoryChangeHandlerSub({
				name: e.target.name,
				value: e.target.value
			})
		);
	}
	deleteSubCategory(id, catId, e) {
		const {
			main: { company }
		} = this.props;
		this.props.dispatch(
			actions.deleteSubCategory({
				_id: id,
				catId: catId,
				pageSize: this.state.pageSize,
				pageNum: this.state.pageNum
			})
		);
	}

	render() {
		let {
			category: {
				status,
				openModal,
				category,
				categories,
				submitCategoryLoader,
				all,
				openSubModal,
				submitSubCategoryLoader,
				subCategory
			},
			main: { user, employee }
		} = this.props;
		return (
			<Card
				title={"Ангилал"}
				key={"categories_card"}
				loading={status}
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
							hasAction(['category'], employee) ?
								<Button
									type={"primary"}
									onClick={this.openModal.bind(this, {})}
									icon={<PlusOutlined />}
								>
									Ангилал нэмэх
								</Button>
								: null
						}
					</div>
				}
			>
				{categories && categories.length > 0 ? (
					<Collapse
						expandIconPosition={"left"}
						accordion
						expandIcon={({ isActive }) => (
							<CaretRightOutlined rotate={isActive ? 90 : 0} />
						)}
					>
						{categories.map(
							(r, idx) => (
								// r.child && r.child.length>0?
								<Panel
									header={`${r.title} (${
										(r.child || []).length
									})`}
									key={`${r._id}_parent`}
									extra={
										<span>
											<Space>
												<Button
													loading={r.loading}
													type={"primary"}
													onClick={this.openSubModal.bind(
														this,
														{},
														r
													)}
													size={"small"}
													icon={<PlusOutlined />}
												>
													Дэд ангилал нэмэх
												</Button>
												<Button
													loading={r.loading}
													onClick={this.openModal.bind(
														this,
														r
													)}
													size={"small"}
													icon={<EditOutlined />}
												>
													Засах
												</Button>
												<Popconfirm
													title={`Та ${r.title} устгах гэж байна!`}
													onConfirm={this.deleteCategory.bind(
														this,
														r._id
													)}
													onCancel={(e) =>
														e.stopPropagation()
													}
													okText="Усгах"
													placement="left"
													cancelText="Болих"
												>
													<Button
														loading={r.loading}
														onClick={(e) =>
															e.stopPropagation()
														}
														size={"small"}
														danger
														icon={<DeleteOutlined />}
													>
														Устгах
													</Button>
												</Popconfirm>
											</Space>
										</span>
									}
								>
									<List
										key={`${r._id}_child_list`}
										itemLayout="horizontal"
										size="small"
										dataSource={r.child || []}
										renderItem={(item, idx) => (
											<List.Item
												key={item._id + "_list_item"}
												actions={
													item.loading
														? [
																<Spin
																	size={
																		"small"
																	}
																/>
														  ]
														: [
																<a
																	key="list-loadmore-edit"
																	onClick={this.openSubModal.bind(
																		this,
																		item,
																		r
																	)}
																>
																	Засах
																</a>,
																<Popconfirm
																	title={`Та ${item.title} устгах гэж байна!`}
																	onConfirm={this.deleteSubCategory.bind(
																		this,
																		item._id,
																		r._id
																	)}
																	okText="Усгах"
																	placement="left"
																	cancelText="Болих"
																>
																	<a key="list-loadmore-delete">
																		Устгах
																	</a>
																</Popconfirm>
														  ]
												}
											>
												<Skeleton
													title={false}
													active
													loading={false}
												>
													<List.Item.Meta
														title={item.title}
														// description={item.description}
													/>
													<div>{item.content}</div>
												</Skeleton>
											</List.Item>
										)}
									/>
								</Panel>
							)
							// :
							// <Panel collapsible='disabled' header={`${r.title} (0)`} key={`${r._id}_parent`}
							//        extra={<Button type={'primary'} onClick={this.openSubModal.bind(this, {}, r)} size={"small"} icon={<PlusOutlined />}>Дэд ангилал нэмэх</Button>}
							// />
						)}
					</Collapse>
				) : (
					<Empty description={`Ангилал алга`} />
				)}

				<Modal
					title={`Ангилал ${
						category && category._id ? "засах" : "нэмэх"
					}`}
					visible={openModal}
					onOk={this.submitCategory.bind(this)}
					onCancel={this.closeModal.bind(this)}
					okText="Хадгалах"
					cancelText="Болих"
					confirmLoading={submitCategoryLoader}
					maskClosable={false}
				>
					<Form.Item label="Нэр" labelCol={{ span: 3 }}>
						<Input
							maxLength={60}
							value={category.title ? category.title : ""}
							name="title"
							onPressEnter={this.submitCategory.bind(this)}
							onChange={this.onChangeHandler.bind(this)}
							allowClear
							autocomplete="off"
						/>
					</Form.Item>
				</Modal>
				<Modal
					title={`Дэд ангилал ${
						subCategory && subCategory._id ? "засах" : "нэмэх"
					}`}
					visible={openSubModal}
					onOk={this.submitSubCategory.bind(this)}
					onCancel={this.closeSubModal.bind(this)}
					okText="Хадгалах"
					cancelText="Болих"
					confirmLoading={submitSubCategoryLoader}
					maskClosable={false}
				>
					<Form.Item label="Үндсэн ангилал" labelCol={{ span: 6 }}>
						<span style={{ fontWeight: 600 }}>
							{((subCategory || {}).category || {}).title}
						</span>
					</Form.Item>
					<Form.Item label="Нэр" labelCol={{ span: 6 }}>
						<Input
							maxLength={60}
							value={subCategory.title ? subCategory.title : ""}
							name="title"
							onPressEnter={this.submitSubCategory.bind(this)}
							onChange={this.onChangeHandlerSub.bind(this)}
							allowClear
							autocomplete="off"
						/>
					</Form.Item>
				</Modal>
			</Card>
		);
	}
}

export default connect(reducer)(Categories);
