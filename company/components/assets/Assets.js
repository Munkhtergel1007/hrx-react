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
import {
	FileDoneOutlined,
	GiftOutlined,
	PlusOutlined,
	CaretRightOutlined,
    EditOutlined,
	UsergroupAddOutlined,
	UserAddOutlined,
	DownOutlined,
	DeleteOutlined,
	EyeOutlined,
	EditFilled,
	DeleteFilled
} from "@ant-design/icons";
import moment from "moment";
import NumberFormat from "react-number-format";
import * as actions from "../../actions/asset_actions";
import { assetChangeHandlerSub } from "../../actions/asset_actions";
import { Link } from "react-router-dom";
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const reducer = ({ asset, main }) => ({ asset, main });

class Assets extends React.Component {
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
		if (hasAction(["asset"], employee)) {
			dispatch(
				actions.getAsset({
					pageNum: this.state.pageNum,
					pageSize: this.state.pageSize
				})
			);
		} else {
			this.props.history.replace("/not-found");
		}
	}
	componentWillUnmount() {
		this.props.dispatch(actions.unmountShopAssets());
	}

	openModal(data, e) {
		e.stopPropagation();
		this.props.dispatch(actions.openAssetModal(data));
	}
	closeModal() {
		this.props.dispatch(actions.closeAssetModal());
	}
	submitAsset() {
		const {
			asset: { asset },
			main: { company }
		} = this.props;
		if (!asset.title || (asset.title && asset.title.trim() === "")) {
			return config.get("emitter").emit("warning", "Нэр оруулна уу!");
		}
		this.props.dispatch(actions.submitAsset(asset));
	}
	onChangeHandler(e) {
		this.props.dispatch(
			actions.assetChangeHandler({
				name: e.target.name,
				value: e.target.value
			})
		);
	}
	deleteAsset(id, e) {
		const {
			main: { company }
		} = this.props;
		e.stopPropagation();
		this.props.dispatch(
			actions.deleteAsset({
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
				actions.openSubAssetModal({ ...data, asset: cat })
			);
		}
	}
	closeSubModal() {
		this.props.dispatch(actions.closeSubAssetModal());
	}
	submitSubAsset() {
		const {
			asset: { subAsset },
			main: { company }
		} = this.props;
		if (
			!subAsset ||
			!subAsset.asset ||
			!subAsset.asset._id ||
			subAsset.asset._id === ""
		) {
			return config
				.get("emitter")
				.emit("warning", "Алдаа, та browser-өө refresh хийнэ үү!");
		}
		if (
			!subAsset.title ||
			(subAsset.title && subAsset.title.trim() === "")
		) {
			return config.get("emitter").emit("warning", "Нэр оруулна уу!");
		}
		this.props.dispatch(actions.submitSubAsset(subAsset));
	}
	onChangeHandlerSub(e) {
		this.props.dispatch(
			actions.assetChangeHandlerSub({
				name: e.target.name,
				value: e.target.value
			})
		);
	}
	deleteSubAsset(id, catId, e) {
		const {
			main: { company }
		} = this.props;
		this.props.dispatch(
			actions.deleteSubAsset({
				_id: id,
				catId: catId,
				pageSize: this.state.pageSize,
				pageNum: this.state.pageNum
			})
		);
	}

	render() {
		let {
			asset: {
				status,
				openModal,
				asset,
				assets,
				submitAssetLoader,
				all,
				openSubModal,
				submitSubAssetLoader,
				subAsset
			},
			main: { user, employee }
		} = this.props;
		return (
			<Card
				title={"Нэмэлт талбар"}
				key={"assets_card"}
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
							hasAction(['asset'], employee) ?
								<Button
									key={'open_asset'}
									type={"primary"}
									onClick={this.openModal.bind(this, {})}
									icon={<PlusOutlined />}
								>
									Нэмэлт талбар нэмэх
								</Button>
								: null
						}
					</div>
				}
			>
				{assets && assets.length > 0 ? (
					<Collapse
						expandIconPosition={"left"}
						accordion
						expandIcon={({ isActive }) => (
							<CaretRightOutlined rotate={isActive ? 90 : 0} />
						)}
					>
						{assets.map(
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
													Дэд талбар нэмэх
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
													onConfirm={this.deleteAsset.bind(
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
																	onConfirm={this.deleteSubAsset.bind(
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
							//        extra={<Button type={'primary'} onClick={this.openSubModal.bind(this, {}, r)} size={"small"} icon={<PlusOutlined />}>Дэд талбар нэмэх</Button>}
							// />
						)}
					</Collapse>
				) : (
					<Empty description={`Нэмэлт талбар алга`} />
				)}

				<Modal
					title={`Нэмэлт талбар ${
						asset && asset._id ? "засах" : "нэмэх"
					}`}
					visible={openModal}
					onOk={this.submitAsset.bind(this)}
					onCancel={this.closeModal.bind(this)}
					okText="Хадгалах"
					cancelText="Болих"
					confirmLoading={submitAssetLoader}
					maskClosable={false}
				>
					<Form.Item label="Нэр" labelCol={{ span: 3 }}>
						<Input
							maxLength={60}
							value={asset.title ? asset.title : ""}
							name="title"
							onPressEnter={this.submitAsset.bind(this)}
							onChange={this.onChangeHandler.bind(this)}
							allowClear
							autocomplete="off"
						/>
					</Form.Item>
				</Modal>
				<Modal
					title={`Дэд талбар ${
						subAsset && subAsset._id ? "засах" : "нэмэх"
					}`}
					visible={openSubModal}
					onOk={this.submitSubAsset.bind(this)}
					onCancel={this.closeSubModal.bind(this)}
					okText="Хадгалах"
					cancelText="Болих"
					confirmLoading={submitSubAssetLoader}
					maskClosable={false}
				>
					<Form.Item
						label="Үндсэн нэмэлт талбар"
						labelCol={{ span: 8 }}
					>
						<span style={{ fontWeight: 600 }}>
							{((subAsset || {}).asset || {}).title}
						</span>
					</Form.Item>
					<Form.Item label="Нэр" labelCol={{ span: 8 }}>
						<Input
							maxLength={60}
							value={subAsset.title ? subAsset.title : ""}
							name="title"
							onPressEnter={this.submitSubAsset.bind(this)}
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

export default connect(reducer)(Assets);
