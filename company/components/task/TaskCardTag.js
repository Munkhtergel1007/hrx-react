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
	CommentOutlined,
	ScheduleOutlined,
	PlusCircleFilled
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
	Popconfirm,
	Modal,
	Input
} from "antd";
import TaskSingle from "./TaskSingle";
import {locale} from "../../lang";
const { Title, Paragraph } = Typography;

class TaskCardUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: ""
		};
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
			<>
				<Card
					bordered={false}
					style={
						(this.props.tasks || []).some(
							(task) =>
								(task._id || "as").toString() ===
								(this.props.mask || "").toString()
						)
							? {
									minWidth: 280,
									display: "block",
									marginRight: 20,
									zIndex: 17 + this.props.index
							  }
							: {
									minWidth: 280,
									display: "block",
									marginRight: 20,
									zIndex: 16 + this.props.index
							  }
					}
					bodyStyle={{
						maxHeight: "460px",
						padding: "10px 16px",
						overflow: "scroll"
					}}
					className={
						"task-card custom-task-scroll" +
						` card-body-${this.props._id}`
					}
					key={this.props._id}
					title={
						<Paragraph
							ellipsis={{
								rows: 2,
								expandable: false,
								tooltip: true
							}}
							style={{ marginBottom: 0 }}
						>
							{this.props.title || "-"}
						</Paragraph>
					}
					extra={
						length !== 0 ? (
							<Tag color={color}>
								{done}/{length}
							</Tag>
						) : null
					}
					actions={[
						<div
							style={{
								padding: "0 12px",
								position: "relative",
								overflow: "auto"
							}}
						>
							<Input.TextArea
								placeholder={locale('common_task.garchig_oruulna_uu')}
								style={{ paddingRight: 20 }}
								onPressEnter={(e) => {
									e.preventDefault();
									let tit = (this.state.title || "").trim();
									this.setState({ title: "" }, () => {
										if (
											document.querySelector(
												`.card-body-${this.props._id}`
											).children[1]
										) {
											document.querySelector(
												`.card-body-${this.props._id}`
											).children[1].style.maxHeight =
												"560px";
										}
										this.props.submitTask?.({
											title: tit,
											employee: {
												_id: this.props.employee._id,
												user: this.props.user
											},
											tag: {
												title: this.props.title,
												_id: this.props._id
											}
										});
									});
								}}
								value={this.state.title}
								onChange={(e) => {
									if (
										document.querySelector(
											`.card-body-${this.props._id}`
										).children[1] &&
										document.querySelector(
											`.card-body-${this.props._id}`
										).children[2]
									) {
										document.querySelector(
											`.card-body-${this.props._id}`
										).children[1].style.maxHeight = `${
											517 -
											document.querySelector(
												`.card-body-${this.props._id}`
											).children[2].clientHeight
										}px`;
									}
									this.setState({ title: e.target.value });
								}}
								autoSize={true}
							/>
							<div
								style={{
									position: "absolute",
									right: 16,
									top: "50%",
									transform: "translateY(-50%)"
								}}
								onClick={() => {
									let tit = (this.state.title || "").trim();
									this.setState({ title: "" }, () =>
										this.props.submitTask?.({
											title: tit,
											employee: {
												_id: this.props.employee._id,
												user: this.props.user
											},
											tag: {
												title: this.props.title,
												_id: this.props._id
											}
										})
									);
								}}
							>
								<PlusCircleFilled />
							</div>
						</div>
					]}
				>
					{(this.props.tasks || []).length > 0 ? (
						(this.props.tasks || []).map((task, ind) => (
							<TaskSingle
								maskOne={this.props.maskOne}
								last={
									(this.props.tasks || []).length - ind === 1
								}
								lengthInd={(this.props.tasks || []).length}
								left={this.props.index === 1}
								key={`${task._id}-taskSingle-component`}
								task={task}
								length={this.props.length}
								mask={this.props.mask}
								employee={this.props.employee}
								statusChange={this.props.statusChange}
								finishingTask={this.props.finishingTask}
								changingTask={this.props.changingTask}
								changeParentState={this.props.changeParentState}
							/>
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
					<div
						id="task-mask-single"
						className={
							this.props.mask ? "task-mask active" : "task-mask"
						}
						onClick={() =>
							this.props.changeParentState?.({ mask: "" })
						}
					/>
				</Card>
				{/* <div
					id='task-mask-card'
					className={
						this.props.mask ? "task-mask active" : "task-mask"
					}
					onClick={() => this.setState({ mask: "" })}
				/> */}
			</>
		);
	}
}

export default TaskCardUser;
