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
	EyeOutlined,
	LoadingOutlined,
	CommentOutlined,
	CloseOutlined,
	ScheduleOutlined
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

class TaskSingle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clicked: ""
		};
		this.num = `${Math.random()}`;
		this.timeOut = null;
	}
	edit(task) {
		let emps = task.employees || [],
			dates = task.dates || [],
			tag = task.tag || {};
		if (Object.keys(emps[0] || {}).length < 2) {
			emps = [];
		} else {
			emps = (emps || []).map((emp) => {
				return {
					_id: emp.emp,
					user: emp.user
				};
			});
		}
		let filteredList = task.list || [];
		if (Object.keys(filteredList[0] || {}).length < 2) {
			filteredList = [];
		}
		dates = (dates || []).map((date) => {
			let newDate = new Date(date);
			newDate.setHours(8, 0, 0, 0);
			return moment(newDate).format("YYYY-MM-DD");
		});
		this.props.changeParentState?.({
			visible: true,
			task: {
				...task,
				employees: emps,
				dates: dates,
				tag: tag,
				list: filteredList,
				mask: ""
			}
		});
	}
	view(task) {
		let emps = task.employees || [],
			dates = task.dates || [],
			tag = task.tag || {};
		if (Object.keys(emps[0] || {}).length < 2) {
			emps = [];
		} else {
			emps = (emps || []).map((emp) => {
				return {
					_id: emp.emp,
					user: emp.user
				};
			});
		}
		let filteredList = task.list || [];
		if (Object.keys(filteredList[0] || {}).length < 2) {
			filteredList = [];
		}
		dates = (dates || []).map((date) => {
			let newDate = new Date(date);
			newDate.setHours(8, 0, 0, 0);
			return moment(newDate).format("YYYY-MM-DD");
		});
		this.props.changeParentState?.({
			modal: true,
			task: {
				...task,
				employees: emps,
				dates: dates,
				tag: tag,
				list: filteredList,
				mask: ""
			}
		});
	}
	render() {
		let task = this.props.task || {};
		let dateString =
			moment((task.dates || [])[0]).format("YYYY-MM-DD") ||
			moment().format("YYYY-MM-DD");
		(task.dates || []).map((date) => {
			let temp = moment(date).format("YYYY-MM-DD");
			if (temp > dateString) dateString = temp;
		});
		let total = (task.list || []).length,
			done = 0;
		(task.list || []).map((li) => {
			if (li.status) done++;
		});
		let isClicked =
			this.props.mask &&
			(this.props.mask || "as").toString() ===
				(task._id || "").toString();
		let className = "taskSingle";
		switch (task.status) {
			case "doing":
				className += " taskSingle-doing";
				break;
			case "done":
				className += " taskSingle-done";
				break;
			case "finished":
				className += " taskSingle-finished";
				break;
			case "declined":
				className += " taskSingle-declined";
				break;
			default:
				className += " taskSingle-doing";
		}
		let canEdit = false;
		(task.employees || []).map((emp) => {
			if (
				(this.props.employee?._id || "as").toString() ===
				(emp.emp || "").toString()
			) {
				canEdit = true;
			}
		});
		return (
			<div
				key={task._id}
				className={className}
				style={
					isClicked
						? this.props.lengthInd === 1 &&
						  this.num === this.props.maskOne
							? {
									zIndex: 20,
									position: "relative",
									marginBottom: 40
							  }
							: { zIndex: 20, position: "relative" }
						: {}
				}
				// onClick={() => {
				// 	let timeOut = setTimeout(
				// 		() =>
				// 			this.props.changeParentState?.({ mask: task._id }),
				// 		300
				// 	);
				// 	this.timeOut = timeOut;
				// }}
				// onDoubleClick={() => {
				// 	let emps = task.employees || [],
				// 		dates = task.dates || [],
				// 		tag = task.tag || {};
				// 	if (Object.keys(emps[0] || {}).length < 2) {
				// 		emps = [];
				// 	} else {
				// 		emps = (emps || []).map((emp) => {
				// 			return {
				// 				_id: emp.emp,
				// 				user: emp.user
				// 			};
				// 		});
				// 	}
				// 	let filteredList = task.list || [];
				// 	if (Object.keys(filteredList[0] || {}).length < 2) {
				// 		filteredList = [];
				// 	}
				// 	dates = (dates || []).map((date) => {
				// 		let newDate = new Date(date);
				// 		newDate.setHours(8, 0, 0, 0);
				// 		return moment(newDate).format("YYYY-MM-DD");
				// 	});
				// 	clearTimeout(this.timeOut);
				// 	this.timeOut = null;
				// 	this.props.changeParentState?.({
				// 		visible: true,
				// 		task: {
				// 			...task,
				// 			employees: emps,
				// 			dates: dates,
				// 			tag: tag,
				// 			list: filteredList,
				// 			mask: ""
				// 		}
				// 	});
				// }}
				onClick={() => {
					if (task.status === "finished") {
						this.view(task);
					} else {
						if (
							(task.employees || []).some(
								(emp) =>
									(emp.emp || "as").toString() ===
									(this.props.employee?._id || "").toString()
							)
						) {
							if (!this.props.mask) {
								if (this.timeOut !== null) {
									this.edit(task);
									clearTimeout(this.timeOut);
									this.timeOut = null;
								} else {
									let body = document.querySelector("body"),
										mask =
											document.querySelector(
												"#task-mask-main"
											);
									mask.style.height = `100%`;
									mask.style.width = `${body.clientWidth}px`;
									// mask.style.display = 'block';
									// mask.style.top = "-51px";
									document.querySelector(
										"#task-mask-card"
									).style.width = `${
										300 * this.props.length
									}px`;
									mask.style.left = "-200px";
									this.timeOut = setTimeout(() => {
										this.props.changeParentState?.({
											mask: task._id,
											maskOne: this.num
										});
										clearTimeout(this.timeOut);
										this.timeOut = null;
									}, 200);
								}
							}
						} else {
							if (!this.props.mask) {
								if (this.timeOut !== null) {
									this.view(task);
									clearTimeout(this.timeOut);
									this.timeOut = null;
								} else {
									let body = document.querySelector("body"),
										mask =
											document.querySelector(
												"#task-mask-main"
											);
									mask.style.height = `100%`;
									mask.style.width = `${body.clientWidth}px`;
									// mask.style.display = 'block';
									// mask.style.top = "-51px";
									document.querySelector(
										"#task-mask-card"
									).style.width = `${
										300 * this.props.length
									}px`;
									mask.style.left = "-200px";
									this.timeOut = setTimeout(() => {
										this.props.changeParentState?.({
											mask: task._id,
											maskOne: this.num
										});
										clearTimeout(this.timeOut);
										this.timeOut = null;
									}, 200);
								}
							}
						}
					}
				}}
			>
				<div className={"taskSingle-title"}>{task.title}</div>
				<div className={"taskSingle-description"}>
					<div className={"description-infos"}>
						{task.employees.some(
							(emp) =>
								(emp._id || "").toString() ===
								(this.props.employee._id || "as").toString()
						) ? (
							<div className="info">
								<EyeOutlined />
							</div>
						) : null}
						<div className="info">{dateString}</div>
						{/* <div className="info">
							<CommentOutlined />
							{(task.comment || []).length}
						</div> */}
						{(task.list || []).length > 0 ? (
							<div className="info">
								<ScheduleOutlined />
								{done}/{total}
							</div>
						) : null}
					</div>
					<div className="description-employees">
						{((task.employees || [])[0] || {}).user ? (
							<div className={"employees"}>
								<img
									src={
										(
											((task.employees || [])[0] || {})
												.user || {}
										).avatar
											? `${config.get("hostMedia")}${
													task.employees[0]?.user
														?.avatar?.path
											  }`
											: "/images/default-avatar.png"
									}
									onError={(e) =>
										(e.target.src =
											"/images/default-avatar.png")
									}
								/>
								{(task.employees || []).length > 1 ? (
									<Popover
										style={{
											maxWidth: 200
										}}
										title={"Хамтран ажиллагсад"}
										content={
											<>
												{(task.employees || []).map(
													(emp) => (
														<Tag
															key={`${task._id}-${emp._id}-tooltip`}
														>
															{emp.user?.last_name.slice(
																0,
																1
															)}
															.
															{
																emp.user
																	?.first_name
															}
														</Tag>
													)
												)}
											</>
										}
									>
										<div className={"more-employees"}>
											{`+${task.employees.length - 1}`}
										</div>
									</Popover>
								) : null}
							</div>
						) : (
							`+${task.employees.length}`
						)}
					</div>
					<div style={{ clear: "both" }} />
				</div>
				<div
					style={
						this.props.maskOne !== this.num || !isClicked
							? { display: "none" }
							: {}
					}
					// className={
					// 	this.props.left && this.props.length !== 1
					// 		? isClicked
					// 			? "side-dropdown active left"
					// 			: "side-dropdown left"
					// 		: isClicked
					// 		? "side-dropdown active"
					// 		: "side-dropdown"
					// }
					className={
						this.props.last && this.props.lengthInd !== 1
							? isClicked
								? "side-dropdown active bottom"
								: "side-dropdown bottom"
							: isClicked
							? "side-dropdown active"
							: "side-dropdown"
					}
				>
					{task.status !== "done" ? (
						<>
							{canEdit ? (
								<>
									<div
										className={"item edit"}
										key={`${task._id}-edit-button`}
										onClick={() => {
											this.props.changeParentState?.({
												mask: ""
											});
											this.edit(task);
										}}
									>
										<EditOutlined /> Засах
									</div>
									<Popconfirm
										title={"Ажлыг устгах уу?"}
										okText={"Тийм"}
										cancelText={"Үгүй"}
										disabled={
											(task._id || "as").toString() ===
											(
												this.props?.changingTask || ""
											).toString()
										}
										onConfirm={() =>
											this.setState(
												{
													clicked: ""
												},
												() =>
													this.props.statusChange?.({
														_id: task._id,
														status: "delete"
													})
											)
										}
										onCancel={() =>
											this.setState({ clicked: "" })
										}
									>
										<div
											className={
												this.state.clicked === "delete"
													? "item delete hovering"
													: "item delete"
											}
											key={`${task._id}-delete-button`}
											onClick={() =>
												this.setState({
													clicked: "delete"
												})
											}
										>
											{(task._id || "as").toString() ===
											(
												this.props?.changingTask || ""
											).toString() ? (
												<LoadingOutlined />
											) : (
												<>
													<DeleteOutlined /> Устгах
												</>
											)}
										</div>
									</Popconfirm>
									<Popconfirm
										title={"Ажлыг илгээх уу?"}
										okText={"Тийм"}
										cancelText={"Үгүй"}
										disabled={
											(task._id || "as").toString() ===
											(
												this.props?.changingTask || ""
											).toString()
										}
										onConfirm={() =>
											this.setState(
												{
													clicked: ""
												},
												() =>
													this.props.statusChange?.({
														_id: task._id,
														status: "done"
													})
											)
										}
										onCancel={() =>
											this.setState({ clicked: "" })
										}
									>
										<div
											className={
												this.state.clicked === "done"
													? "item done hovering"
													: "item done"
											}
											key={`${task._id}-done-button`}
											onClick={() =>
												this.setState({
													clicked: "done"
												})
											}
										>
											{(task._id || "as").toString() ===
											(
												this.props?.changingTask || ""
											).toString() ? (
												<LoadingOutlined />
											) : (
												<>
													<CheckOutlined /> Илгээх
												</>
											)}
										</div>
									</Popconfirm>
								</>
							) : (
								<div
									className={"item edit"}
									key={`${task._id}-view-button`}
									onClick={() => {
										this.props.changeParentState?.({
											mask: ""
										});
										this.view(task);
									}}
								>
									<EyeOutlined /> Үзэх
								</div>
							)}
						</>
					) : (
						<>
							{canEdit ? (
								<Popconfirm
									title={"Хүсэлтээ цуцлах уу?"}
									okText={"Тийм"}
									cancelText={"Үгүй"}
									disabled={
										(task._id || "as").toString() ===
										(
											this.props?.changingTask || ""
										).toString()
									}
									onConfirm={() =>
										this.setState(
											{
												clicked: ""
											},
											() =>
												this.props.statusChange?.({
													_id: task._id,
													status: "doing"
												})
										)
									}
								>
									<div
										className={
											this.state.clicked === "declined"
												? "item declined hovering"
												: "item declined"
										}
										key={`${task._id}-back-button`}
										onClick={() =>
											this.setState({
												clicked: "declined"
											})
										}
									>
										{(task._id || "as").toString() ===
										(
											this.props?.changingTask || ""
										).toString() ? (
											<LoadingOutlined />
										) : (
											<>
												<DownloadOutlined /> Цуцлах
											</>
										)}
									</div>
								</Popconfirm>
							) : null}
							<div
								className={"item edit"}
								key={`${task._id}-view-button`}
								onClick={() => {
									this.props.changeParentState?.({
										mask: ""
									});
									this.view(task);
								}}
							>
								<EyeOutlined /> Үзэх
							</div>
						</>
					)}
					<div
						className={"item back"}
						key={`${task._id}-back-button`}
						onClick={() =>
							this.props.changeParentState?.({ mask: "" })
						}
					>
						<CloseOutlined /> Болих
					</div>
				</div>
			</div>
		);
	}
}

export default TaskSingle;
