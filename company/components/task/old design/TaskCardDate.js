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
	DownloadOutlined,
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
	Tag,
	Space,
	Popover,
	Popconfirm
} from "antd";
const { Title, Paragraph } = Typography;

class TaskCardDate extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let done = 0,
			length = (this.props.tasks || []).length;
		(this.props.tasks || []).map((task) =>
			task.status === "finished" ? done++ : null
		);
		let color = "default";
		if ((length * 75) / 100 <= done) color = "success";
		else if ((length * 75) / 100 >= done) color = "red";
		return (
			<Card
				style={{
					minWidth: length === 0 ? 200 : 600,
					display: "block",
					marginRight: 20
				}}
				bodyStyle={{
					maxHeight: 500,
					overflowY: "auto"
				}}
				className={"task-card custom-task-scroll"}
				key={this.props._id}
				title={moment(this.props.date).format("YYYY/MM/DD")}
				extra={
					length !== 0 ? (
						<Tag color={color}>
							{done}/{length}
						</Tag>
					) : null
				}
			>
				{(this.props.tasks || []).length > 0 ? (
					<List
						style={{ padding: "0 5px" }}
						dataSource={this.props.tasks}
						itemLayout={"vertical"}
						renderItem={(task) => (
							<List.Item
								key={task._id}
								className={"task-list-item-actions"}
								extra={
									<>
										{(task.employees || []).length > 0 &&
										Object.keys(
											((task.employees || [])[0] || {})
												.user || {}
										).length > 0 ? (
											<div
												style={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													height: 35,
													width: 55
												}}
											>
												{(
													(
														(task.employees ||
															[])[0] || {}
													).user || {}
												).avatar ? (
													<div
														style={{
															width: "100%",
															height: "100%",
															position: "relative"
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
																	(
																		(task.employees ||
																			[])[0] ||
																		{}
																	).user || {}
																).avatar
																	? `${config.get(
																			"hostMedia"
																	  )}${
																			task
																				.employees[0]
																				.user
																				.avatar
																				.path
																	  }`
																	: "/images/default-avatar.png"
															}
															onError={(e) =>
																(e.target.src =
																	"/images/default-avatar.png")
															}
														/>
														{(task.employees || [])
															.length > 1 ? (
															<Popover
																style={{
																	maxWidth: 200
																}}
																title={
																	"Хамтран ажиллагсад"
																}
																content={
																	<>
																		{(
																			task.employees ||
																			[]
																		).map(
																			(
																				emp
																			) => (
																				<Tag
																					key={`${task._id}-${emp._id}-tooltip`}
																				>
																					{emp.user?.last_name.slice(
																						0,
																						1
																					)}

																					.
																					{
																						emp
																							.user
																							?.first_name
																					}
																				</Tag>
																			)
																		)}
																	</>
																}
															>
																<div
																	style={{
																		position:
																			"relative",
																		backgroundColor:
																			"rgba(0,0,0,0.8)",
																		color: "white",
																		fontWeight:
																			"bold",
																		fontSize: 16,
																		top: -35,
																		right: -20,
																		width: 35,
																		height: 35,
																		borderRadius:
																			"50%",
																		overflow:
																			"hidden",
																		display:
																			"flex",
																		alignItems:
																			"center",
																		justifyContent:
																			"center"
																	}}
																>
																	{`+${
																		task
																			.employees
																			.length -
																		1
																	}`}
																</div>
															</Popover>
														) : null}
													</div>
												) : (
													`+${task.employees.length}`
												)}
											</div>
										) : (
											<div />
										)}
										{task.status === "done" ? (
											<Tag
												color={"orange"}
												style={{ marginTop: 10 }}
											>
												Хүлээгдэж буй
											</Tag>
										) : task.status === "finished" ? (
											<Tag
												color={"success"}
												style={{ marginTop: 10 }}
											>
												Дууссан
											</Tag>
										) : task.status === "declined" ? (
											<Tag
												color={"red"}
												style={{ marginTop: 10 }}
											>
												Татгалзсан
											</Tag>
										) : null}
									</>
								}
								actions={[
									<Space
										style={{
											width: "100%",
											display: "flex",
											justifyContent: "space-evenly",
											alignItems: "space-evenly"
										}}
									>
										{companyAdministrator(
											this.props.employee
										) ? (
											<Button
												type={"dashed"}
												shape={"circle"}
												key={"finish"}
												icon={<EyeOutlined />}
												onClick={() => {
													let emps =
														task.employees || [];
													if (
														Object.keys(
															emps[0] || {}
														).length < 2
													) {
														emps = [];
													}
													this.props.changeParentState?.(
														{
															modal: true,
															task: {
																...task,
																employees: emps
															}
														}
													);
												}}
											/>
										) : null}
										{task.status === "done" &&
										((task.owner.emp || "as").toString() ===
											(
												(this.props.employee || {})
													._id || ""
											).toString() ||
											(task.employees || []).some(
												(empss) =>
													(
														empss.emp || "as"
													).toString() ===
													(
														(
															this.props
																.employee || {}
														)._id || ""
													).toString()
											)) ? (
											<Popconfirm
												title={"Хүсэлтээ цуцлах уу?"}
												okText={"Тийм"}
												cancelText={"Үгүй"}
												disabled={
													(
														task._id || "as"
													).toString() ===
													(
														this.props
															?.changingTask || ""
													).toString()
												}
												onConfirm={() =>
													this.props.statusChange?.({
														_id: task._id,
														status: "doing"
													})
												}
											>
												<Button
													type={"dashed"}
													shape={"circle"}
													key={"finish"}
													danger
													loading={
														(
															task._id || "as"
														).toString() ===
														(
															this.props
																?.changingTask ||
															""
														).toString()
													}
													icon={<DownloadOutlined />}
												/>
											</Popconfirm>
										) : null}
										{(task.status === "doing" ||
											task.status === "declined") &&
										((task.owner.emp || "as").toString() ===
											(
												(this.props.employee || {})
													._id || ""
											).toString() ||
											(task.employees || []).some(
												(empss) =>
													(
														empss.emp || "as"
													).toString() ===
													(
														(
															this.props
																.employee || {}
														)._id || ""
													).toString()
											)) ? (
											<>
												<Popconfirm
													title={"Ажлыг илгээх уу?"}
													okText={"Тийм"}
													cancelText={"Үгүй"}
													disabled={
														(
															task._id || "as"
														).toString() ===
														(
															this.props
																?.changingTask ||
															""
														).toString()
													}
													onConfirm={() =>
														this.props.statusChange?.(
															{
																_id: task._id,
																status: "done"
															}
														)
													}
												>
													<Button
														loading={
															(
																task._id || "as"
															).toString() ===
															(
																this.props
																	?.changingTask ||
																""
															).toString()
														}
														type={"primary"}
														shape={"circle"}
														key={"check"}
														icon={<CheckOutlined />}
													/>
												</Popconfirm>
												<Button
													shape={"circle"}
													key={"edit"}
													icon={<EditOutlined />}
													onClick={() => {
														let emps =
																task.employees ||
																[],
															dates =
																task.dates ||
																[],
															tag =
																task.tag || {};
														if (
															Object.keys(
																emps[0] || {}
															).length < 2
														) {
															emps = [];
														} else {
															emps = (
																emps || []
															).map((emp) => {
																return {
																	_id: emp.emp,
																	user: emp.user
																};
															});
														}
														let filteredList = [];
														(task.list || []).map(
															(lis) => {
																if (
																	Object.keys(
																		lis ||
																			{}
																	).length > 1
																) {
																	filteredList.push(
																		lis
																	);
																}
															}
														);
														dates = (
															dates || []
														).map((date) => {
															let newDate =
																new Date(date);
															newDate.setHours(
																8,
																0,
																0,
																0
															);
															return moment(
																newDate
															).format(
																"YYYY-MM-DD"
															);
														});
														this.props.changeParentState?.(
															{
																visible: true,
																task: {
																	...task,
																	employees:
																		emps,
																	dates: dates,
																	tag: tag,
																	list: filteredList
																}
															}
														);
													}}
												/>
												<Popconfirm
													title={"Ажлыг устгах уу?"}
													okText={"Тийм"}
													cancelText={"Үгүй"}
													disabled={
														(
															task._id || "as"
														).toString() ===
														(
															this.props
																?.changingTask ||
															""
														).toString()
													}
													onConfirm={() =>
														this.props.statusChange?.(
															{
																_id: task._id,
																status: "delete"
															}
														)
													}
												>
													<Button
														loading={
															(
																task._id || "as"
															).toString() ===
															(
																this.props
																	?.changingTask ||
																""
															).toString()
														}
														danger
														type={"primary"}
														shape={"circle"}
														key={"delete"}
														icon={
															<DeleteOutlined />
														}
													/>
												</Popconfirm>
											</>
										) : (
											""
										)}
									</Space>
								]}
							>
								<List.Item.Meta
									avatar={
										<img
											style={{
												width: 35,
												height: 35,
												borderRadius: "50%",
												overflow: "hidden",
												objectFit: "cover"
											}}
											src={
												((task.owner || {}).user || {})
													.avatar?.path
													? `${config.get(
															"hostMedia"
													  )}${
															task?.owner?.user
																?.avatar?.path
													  }`
													: "/images/default-avatar.png"
											}
											onError={(e) =>
												(e.target.src =
													"/images/default-avatar.png")
											}
										/>
									}
									title={
										<Paragraph
											level={5}
											ellipsis={{
												rows: 2,
												expandable: false,
												tooltip: true
											}}
											style={{ marginBottom: 0 }}
										>
											{task?.title || "-"}
										</Paragraph>
									}
									description={
										<Paragraph
											ellipsis={{
												rows: 2,
												expandable: false,
												tooltip: true
											}}
											type={"secondary"}
											style={{ marginBottom: 0 }}
										>
											{task?.description || "-"}
										</Paragraph>
									}
								/>
							</List.Item>
						)}
					/>
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
								Ажил байхгүй
							</span>
						}
					/>
				)}
			</Card>
		);
	}
}

export default TaskCardDate;
