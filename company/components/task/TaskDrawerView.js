import React, { Component } from "react";
import { connect } from "react-redux";
import config, {
	hasAction,
	isValidDate,
	companyAdministrator
} from "../../config";
import moment from "moment";

import {
	CloseCircleFilled,
	SearchOutlined,
	PlusOutlined,
	EnterOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
	DeleteFilled
} from "@ant-design/icons";
import {
	Button,
	Popover,
	Popconfirm,
	Table,
	Tooltip,
	Alert,
	Tag,
	InputNumber,
	Input,
	Space,
	Row,
	Spin,
	Typography,
	Form,
	Calendar,
	DatePicker,
	Divider,
	Select,
	Col,
	Checkbox,
	Empty,
	Drawer
} from "antd";
import {locale} from "../../lang";

class TaskDrawerView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	clear(cb) {
		this.setState(
			{
				visible: false,
				employees: [],
				title: "",
				description: "",
				dates: [],
				tag: "",
				price: 0,
				image: "",
				list: []
			},
			() => cb()
		);
	}
	dateCellRender(value) {
		let style = {
			backgroundColor: "#1A3452",
			minWidth: "20px",
			height: "auto",
			fontWeight: 400,
			borderRadius: 4,
			display: "inline-flex",
			color: "#fff",
			paddingInline: "5px",
			margin: "3px",
			position: "relative",
			userSelect: "none"
		};
		let style1 = {
			minWidth: "20px",
			height: "auto",
			fontWeight: 400,
			borderRadius: 4,
			display: "inline-flex",
			paddingInline: "5px",
			margin: "3px",
			position: "relative",
			userSelect: "none"
		};
		return (
			<div
				style={
					(this.props.dates || []).includes(
						moment(value).format("YYYY-MM-DD")
					)
						? style
						: style1
				}
			>
				{moment(value).format("DD")}
			</div>
		);
	}
	render() {
		let total = (this.props.list || []).length,
			done = 0;
		(this.props.list || []).map((li) => {
			if (li.status) done++;
		});
		let color = "default";
		if ((length * 75) / 100 <= done) color = "success";
		else if ((length * 75) / 100 >= done) color = "red";
		function getTag(e) {
			switch (e) {
				case "doing":
					return <Tag>{locale('common_task.hiij_bui')}</Tag>;
				case "declined":
					return <Tag color={"red"}>{locale('common_task.tatgalzsan')}</Tag>;
				case "done":
					return <Tag color={"geekblue"}>{locale('common_task.zuwshuurul_huleej_bui')}</Tag>;
				case "finished":
					return <Tag color={"success"}>{locale('common_task.duussan')}</Tag>;
				default:
					return <Tag>-</Tag>;
			}
		}
		return (
			<Drawer
				title={locale('common_task.ajil')}
				maskClosable={false}
				onClose={() =>
					this.clear(() =>
						this.props.changeParentState?.({
							modal: false,
							task: {}
						})
					)
				}
				width={600}
				className={"task-drawer"}
				visible={this.props.modal}
				key={"drawer-task-drawer"}
				footer={
					this.props.status === "done" &&
					companyAdministrator(this.props.employee) ? (
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between"
							}}
						>
							<>
								<Button
									size={"small"}
									style={{ marginRight: 20 }}
									onClick={() =>
										this.clear(() =>
											this.props.changeParentState?.({
												modal: false,
												task: {}
											})
										)
									}
								>
									{locale('common_task.bolih')}
								</Button>
								<div style={{ textAlign: "right" }}>
									<Popconfirm
										disabled={
											(
												this.props?.finishingTask ||
												"as"
											).toString() ===
											(this.props?._id || "").toString()
										}
										title={locale('common_task.tatgalzah_uu')}
										cancelText={locale('common_task.ugui')}
										okText={locale('common_task.tiim')}
										onConfirm={() =>
											this.props.finishTask?.({
												_id: this.props?._id,
												status: "declined"
											})
										}
									>
										<Button
											danger
											style={{ marginRight: 10 }}
											size={"small"}
											type={"primary"}
											loading={
												(
													this.props?.finishingTask ||
													"as"
												).toString() ===
												(
													this.props?._id || ""
												).toString()
											}
										>
											{locale('common_task.tatgalzah')}
										</Button>
									</Popconfirm>
									<Popconfirm
										disabled={
											(
												this.props?.finishingTask ||
												"as"
											).toString() ===
											(this.props?._id || "").toString()
										}
										title={locale('common_task.duusgah_uu')}
										cancelText={locale('common_task.ugui')}
										okText={locale('common_task.tiim')}
										onConfirm={() =>
											this.props.finishTask?.({
												_id: this.props?._id,
												status: "finished"
											})
										}
									>
										<Button
											type={"primary"}
											size={"small"}
											loading={
												(
													this.props?.finishingTask ||
													"as"
												).toString() ===
												(
													this.props?._id || ""
												).toString()
											}
										>
											{locale('common_task.duusgah')}
										</Button>
									</Popconfirm>
								</div>
							</>
						</div>
					) : null
				}
			>
				<div>
					<b style={{ fontSize: 18 }}>{this.props.title}</b>
					<div style={{ textAlign: "right" }}></div>
				</div>
				<Row gutter={20}>
					<Col span={12}>
						<Calendar
							className={"calendar-task"}
							mode={"month"}
							dateFullCellRender={(e) => this.dateCellRender(e)}
						/>
					</Col>
					<Col span={12}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginBottom: 15,
								padding: "12px 0"
							}}
						>
							{getTag(this.props.status)}
							{this.props.price ? (
								<span>
									{(this.props.price || 0)
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
									₮
								</span>
							) : null}
						</div>
						{locale('common_task.tailbar')}:
						<div>{this.props.description}</div>
					</Col>
				</Row>
				{locale('common_task.ajliin_jagsaalt')}:
				<div
					style={
						(this.props.list || []).length > 0
							? {
									height: 200,
									overflowY: "auto",
									marginBottom: 10
							  }
							: {
									height: 200,
									overflowY: "auto",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									marginBottom: 10
							  }
					}
				>
					{(this.props.list || []).length > 0 ? (
						(this.props.list || []).map((li, idx) => (
							<div
								key={`${li._id}-item`}
								style={{
									paddingLeft: 3,
									display: "flex",
									flexDirection: "row",
									position: "relative",
									transition: ".3s"
								}}
								className={"workplan_job_hover_ss"}
							>
								<div
									style={{
										width: "calc(100% - 25px)",
										display: "flex",
										flexDirection: "row"
									}}
								>
									<div style={{ width: 65 }}>
										<Checkbox
											disabled={true}
											checked={li.status}
										>
											<div
												style={{
													width: 25
												}}
											>
												{idx + 1}.
											</div>
										</Checkbox>
									</div>
									<div>
										<Popover
											title={locale('common_task.ajil_oruulsan')}
											content={
												<Row gutter={20}>
													<Col
														style={{
															display: "flex",
															justifyContent:
																"center",
															alignItems: "center"
														}}
													>
														<img
															style={{
																width: 35,
																height: 35,
																borderRadius:
																	"50%",
																overflow:
																	"hidden",
																objectFit:
																	"cover"
															}}
															src={
																(
																	li.employee
																		?.user ||
																	{}
																).avatar?.path
																	? `${config.get(
																			"hostMedia"
																	  )}${
																			li
																				.employee
																				?.user
																				?.avatar
																				.path
																	  }`
																	: "/images/default-avatar.png"
															}
															onError={(e) =>
																(e.target.src =
																	"/images/default-avatar.png")
															}
														/>
													</Col>
													<Col>
														<div
															style={{
																fontWeight:
																	"bolder",
																fontSize: 18
															}}
														>
															{li.employee?.user
																?.first_name ||
																"-"}
														</div>
														<div>
															{li.employee?.user
																?.last_name ||
																"-"}
														</div>
													</Col>
												</Row>
											}
										>
											<span>{li.text}</span>
										</Popover>
									</div>
								</div>
							</div>
						))
					) : (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={
								<span
									style={{
										color: "#495057",
										userSelect: "none"
									}}
								>
									{locale('common_task.ajil_baihgui')}
								</span>
							}
						/>
					)}
				</div>
				{total > 0 ? (
					<div style={{ textAlign: "right", marginBottom: 10 }}>
						<Tag color={color}>
							{done}/{total}
						</Tag>
					</div>
				) : null}
				{locale('common_task.hamtran_ajillagsad')}:
				{(this.props.employees || []).map((emp) => (
					<Row
						key={`${emp._id}-employee-drawer-view`}
						gutter={20}
						style={{
							width: "calc(100% - 25px)",
							marginBottom: 5
						}}
					>
						<Col
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center"
							}}
						>
							<img
								style={{
									width: 35,
									height: 35,
									borderRadius: "50%",
									overflow: "hidden",
									objectFit: "cover"
								}}
								src={
									(emp.user || {}).avatar?.path
										? `${config.get("hostMedia")}${
												emp.user.avatar.path
										  }`
										: "/images/default-avatar.png"
								}
								onError={(e) =>
									(e.target.src =
										"/images/default-avatar.png")
								}
							/>
						</Col>
						<Col>
							<div
								style={{
									fontWeight: "bolder",
									fontSize: 18
								}}
							>
								{emp.user?.first_name || "-"}
							</div>
							<div>{emp.user?.last_name || "-"}</div>
						</Col>
					</Row>
				))}
			</Drawer>
		);
	}
}

export default TaskDrawerView;
