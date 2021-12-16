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
	EditOutlined,
	CheckOutlined,
	DeleteOutlined,
	EyeOutlined
} from "@ant-design/icons";
import {
	Card,
	List,
	Button,
	Empty,
	Typography,
	Tooltip,
	Calendar,
	Modal,
	Tag,
	Row,
	Col,
	Space,
	Popover,
	Popconfirm
} from "antd";
const { Title, Paragraph } = Typography;

class TaskCardUser extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	dateCellRender(value) {
		let style = {
			backgroundColor: "#1A3452",
			minWidth: "24px",
			height: "auto",
			fontWeight: 400,
			borderRadius: 4,
			display: "inline-flex",
			color: "#fff",
			paddingInline: "13px",
			margin: "5px",
			position: "relative",
			userSelect: "none",
			cursor: "default"
		};
		let style1 = {
			minWidth: "24px",
			height: "auto",
			fontWeight: 400,
			borderRadius: 4,
			display: "inline-flex",
			paddingInline: "13px",
			margin: "5px",
			position: "relative",
			userSelect: "none",
			cursor: "default"
		};
		let date = new Date(value);
		date.setHours(8, 0, 0, 0);
		return (
			<div
				style={
					(this.props.dates || []).includes(date.toISOString())
						? style
						: style1
				}
			>
				{moment(value).format("DD")}
			</div>
		);
	}
	render() {
		function getTag(e) {
			switch (e) {
				case "doing":
					return <Tag>Хийж буй</Tag>;
				case "declined":
					return <Tag color={'red'}>Татгалзсан</Tag>;
				case "done":
					return <Tag color={"geekblue"}>Зөвшөөрөл хүлээж буй</Tag>;
				case "finished":
					return <Tag color={"success"}>Дууссан</Tag>;
				default:
					return <Tag>-</Tag>;
			}
		}

		function getListStatus(e) {
			switch (e) {
				case "idle":
					return <Tag color={"magenta"}>Хийгдэж буй</Tag>;
				case "done":
					return <Tag color={"success"}>Болсон</Tag>;
			}
		}
		let allEmployees = [...(this.props.employees || [])];
		if (this.props.owner) {
			allEmployees.push(this.props.owner);
		} else {
			allEmployees.push({
				emp: this.props.employee?._id,
				user: this.props.user
			});
		}
		allEmployees = (allEmployees || []).map((emp) => {
			let list = [];
			(this.props.list || []).map((lis) => {
				if (
					(lis.employee?.emp || "as").toString() ===
					(emp.emp || "").toString()
				) {
					list.push(lis);
				}
			});
			if (Object.keys((list || [])[0] || {}).length > 1) {
				return {
					...(emp || {}),
					list: list
				};
			} else {
				return emp;
			}
		});
		return (
			<Modal
				visible={this.props.visible}
				title={this.props.title || "-"}
				onCancel={() =>
					this.props.changeParentState?.({ modal: false, task: {} })
				}
				width={800}
				footer={
					this.props.status === "done" ? (
						<div style={{ textAlign: "right" }}>
							<Popconfirm
								disabled={
									(
										this.props?.finishingTask || "as"
									).toString() ===
									(this.props?._id || "").toString()
								}
								title={"Татгалзах уу?"}
								cancelText={"Үгүй"}
								okText={"Тийм"}
								onConfirm={() =>
									this.props.finishTask?.({
										_id: this.props?._id,
										status: "declined"
									})
								}
							>
								<Button
									danger
									type={"primary"}
									loading={
										(
											this.props?.finishingTask || "as"
										).toString() ===
										(this.props?._id || "").toString()
									}
								>
									Татгалзах
								</Button>
							</Popconfirm>
							<Popconfirm
								disabled={
									(
										this.props?.finishingTask || "as"
									).toString() ===
									(this.props?._id || "").toString()
								}
								title={"Дуусгах уу?"}
								cancelText={"Үгүй"}
								okText={"Тийм"}
								onConfirm={() =>
									this.props.finishTask?.({
										_id: this.props?._id,
										status: "finished"
									})
								}
							>
								<Button
									type={"primary"}
									loading={
										(
											this.props?.finishingTask || "as"
										).toString() ===
										(this.props?._id || "").toString()
									}
								>
									Дуусгах
								</Button>
							</Popconfirm>
						</div>
					) : null
				}
			>
				<Row gutter={[20, 0]}>
					<Col span={10}>
						{/* <div style={{ textAlign: "center" }}> */}
						Төлөв: {getTag(this.props.status)}
						{/* </div> */}
						{this.props.price ? (
							<div>Үнэ: {this.props.price}</div>
						) : null}
						{this.props.tags &&
						Object.keys(this.props.tags || {}).length > 0 ? (
							<div>
								Тэмдэглэгээ:
								{this.props.tag?.title}
							</div>
						) : null}
						{this.props.tag?.title}
						<Calendar
							className={"calendar-task"}
							mode={"month"}
							dateFullCellRender={(e) => this.dateCellRender(e)}
						/>
						<div style={{ marginBottom: 5 }}>
							{(this.props.employees || []).map((emp) => (
								<Tag _id={`task-modal-${emp._id}`}>
									{(emp.user.last_name || "").slice(0, 1)}.
									{emp.user.first_name}
								</Tag>
							))}
						</div>
						<Paragraph
							ellipsis={{
								expandable: true,
								rows: 5,
								symbol: "Дэлгэрэнгүй"
							}}
						>
							{this.props.description}
						</Paragraph>
					</Col>
					<Col span={12}>
						{(allEmployees || []).map((emp) =>
							emp?.list ? (
								<div key={`${emp.emp}`}>
									<Row gutter={10}>
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
													(emp.user || {}).avatar
														?.path
														? `${config.get(
																"hostMedia"
														  )}${
																emp.user.avatar
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
													fontWeight: "bolder",
													fontSize: 18
												}}
											>
												{emp.user?.first_name || "-"}
											</div>
											<div>
												{emp.user?.last_name || "-"}
											</div>
										</Col>
									</Row>
									<ul
										key={`${emp.emp}-list`}
										style={{ marginLeft: 20 }}
									>
										{(emp.list || []).map((li) => (
											<li
												key={li._id}
												style={{
													position: "relative"
												}}
											>
												<div
													className={
														(
															this.state
																.editing_id ||
															"as"
														).toString() ===
														(
															li._id || ""
														).toString()
															? "task-drawer-list editing"
															: "task-drawer-list"
													}
												>
													Засагдаж байна...
												</div>
												{li.text}
												<Row gutter={20}>
													<Col
														style={{
															textAlign: "center"
														}}
														span={12}
													>
														{getListStatus(
															li.status
														)}
													</Col>
												</Row>
											</li>
										))}
									</ul>
									<hr
										style={{
											height: 1,
											border: "none",
											backgroundColor: "#00000014",
											margin: 10
										}}
									/>
								</div>
							) : null
						)}
					</Col>
				</Row>
			</Modal>
		);
	}
}

export default TaskCardUser;
