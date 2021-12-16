import React, { Component } from "react";
import { connect } from "react-redux";
import config, {
	hasAction,
	isValidDate,
	companyAdministrator
} from "../../config";
import {locale} from '../../lang';
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

class TaskDrawerForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: this.props.visible || false,

			employees: this.props.employees || [],

			title: this.props.title || "",
			description: this.props.description || "",
			dates:
				(this.props.dates || []).map((date) =>
					moment(date).format("YYYY-MM-DD")
				) || [],
			tag: this.props.tag || {},
			price: this.props.price || 0,
			image: this.props.image || "",
			list: this.props.list || [],
			_id: this.props._id || "",
			owner: this.props.owner,

			tempText: ""
		};
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
	dealWithDates(e) {
		let initial = this.state.dates || [];
		if ((this.state.dates || []).includes(moment(e).format("YYYY-MM-DD"))) {
			this.setState({
				dates: (initial || []).filter(
					(date) =>
						moment(date).format("YYYY-MM-DD") !==
						moment(e).format("YYYY-MM-DD")
				)
			});
		} else {
			this.setState({
				dates: [...(initial || []), moment(e).format("YYYY-MM-DD")]
			});
		}
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
			paddingInline: "5px",
			margin: "3px",
			position: "relative",
			userSelect: "none"
		};
		let style1 = {
			minWidth: "24px",
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
				onClick={() => this.dealWithDates(value)}
				style={
					(this.state.dates || []).includes(
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
	dealWithEmployees(e) {
		let initial = this.state.employees || [];
		if (
			(this.state.employees || []).some(
				(emp) =>
					(e._id || "as").toString() === (emp._id || "").toString()
			)
		) {
			this.setState({
				employees: (initial || []).filter(
					(emp) =>
						(emp._id || "as").toString() !==
						(e._id || "").toString()
				)
			});
		} else {
			this.setState({
				employees: [...(initial || []), e]
			});
		}
	}
	searchEmployeesInner(e) {
		let self = this;
		clearTimeout(this.state.timeOutInner);
		let timeOutInner = setTimeout(function () {
			self.setState(
				{
					timeOutInner: timeOutInner
				},
				() => {
					self.props.searchEmployeesInner?.(e);
				}
			);
		}, 500);
	}
	selectEmployee(e) {
		const { employeesInner } = this.props;
		let selected = {};
		(employeesInner || []).map((emp) => {
			if ((e || "as").toString() === ((emp || {})._id || "").toString()) {
				selected = emp;
			}
		});
		this.dealWithEmployees(selected);
	}
	enterIntoList() {
		function getRandomKey() {
			return Math.random();
		}
		let str = (this.state.tempText || "").trim();
		if (str) {
			let list = [
				...(this.state.list || []),
				{
					_id: getRandomKey(),
					text: str,
					employee: {
						emp: this.props.employee?._id,
						user: this.props.user
					}
				}
			];
			this.setState({
				list: list,
				tempText: ""
			});
		}
	}
	selectTag(e) {
		const { subtags } = this.props;
		let selected = {};
		(subtags || []).map((subtag) => {
			(subtag.subTags || []).map((tag) => {
				if ((tag._id || "as").toString() === (e || "").toString())
					selected = tag;
			});
		});
		this.setState({
			tag: selected
		});
	}
	render() {
		return (
			<Drawer
				title={this.state._id ? locale('common_task.ajil_zasah') : locale('common_task.ajil_nemeh')}
				maskClosable={false}
				onClose={() =>
					this.clear(() =>
						this.props.changeParentState?.({
							visible: false,
							task: {}
						})
					)
				}
				width={600}
				className={"task-drawer"}
				visible={this.state.visible}
				key={"drawer-task-drawer"}
				footer={
					<div style={{ textAlign: "right" }}>
						<Button
							size={"small"}
							style={{ marginRight: 20 }}
							onClick={() =>
								this.clear(() =>
									this.props.changeParentState?.({
										visible: false,
										task: {}
									})
								)
							}
						>
							{locale('common_task.bolih')}
						</Button>
						<Button
							type="primary"
							size={"small"}
							// onClick={() => this.props.submitTask?.(this.state)}
							form={"task"}
							htmlType={"submit"}
							loading={this.props.creatingTask}
						>
							{this.state._id ? locale('common_task.shinechleh') : locale('common_task.uusgeh')}
						</Button>
					</div>
				}
			>
				<Form
					id="task"
					layout="vertical"
					// onSubmitCapture={(e) => e.preventDefault()}
					// onKeyPress={(e) => console.log(e.key === 'Enter')}
					onFinish={() => this.props.submitTask?.(this.state)}
					initialValues={{
						employees: this.state.employees,
						title: this.state.title,
						description: this.state.description,
						dates: this.state.dates,
						tag: null,
						price: this.state.price,
						image: this.state.image,
						list: this.state.list
					}}
				>
					<Form.Item
						// label={"Гарчиг"}
						name={"title"}
						rules={[
							{
								required: this.state.title === "",
								transfrom: (value) => (value || "").trim(),
								message: locale('common_task.garchig_baih_shaardlagatai')
							}
						]}
					>
						<Input
							placeholder={locale('common_task.garchig')}
							onChange={(e) =>
								this.setState({ title: e.target.value })
							}
						/>
					</Form.Item>
					{/* <Form.Item
						// label={"Тайлбар"}
						name={"description"}
					>
						<Input.TextArea
							placeholder={"Тайлбар"}
							onChange={(e) =>
								this.setState({ description: e.target.value })
							}
							rows={2}
						/>
					</Form.Item> */}
					{/* <div style={{position: 'absolute', right: -600, top: 0, padding: 24}}> */}
					{/* <label
							className={"ant-form-item-required"}
							title={"Ажиллах хугацаа"}
							style={
								(this.state.dates || []).length === 0
									? {
											fontWeight: "bolder",
											marginRight: 8
									  }
									: { fontWeight: 500, marginRight: 8 }
							}
						>
							<span style={{ color: "#ff4d4f" }}>
								{(this.state.dates || []).length === 0
									? "* "
									: null}
							</span>
							Ажиллах хугацаа:
						</label> */}
					<Row gutter={20} style={{ marginBottom: 10 }}>
						<Col span={12}>
							{/* <label title={"Ажиллах хугацаа"}>
								Ажиллах хугацаа:
							</label> */}
							<Calendar
								style={{ marginTop: -12 }}
								className={"calendar-task"}
								mode={"month"}
								dateFullCellRender={(e) =>
									this.dateCellRender(e)
								}
							/>
						</Col>
						<Col span={12}>
							<Form.Item
								// label={"Тайлбар"}
								name={"description"}
							>
								<Input.TextArea
									placeholder={locale('common_task.tailbar')}
									onChange={(e) =>
										this.setState({
											description: e.target.value
										})
									}
									rows={2}
								/>
							</Form.Item>
						</Col>
					</Row>
					{/* </div> */}
					<label
						title={locale('common_task.ajliin_jagsaalt')}
						style={{ textDecoration: "underline" }}
					>
						{locale('common_task.ajliin_jagsaalt')}:
					</label>
					{/* <div style={{ height: 200, overflowY: "auto" }}> */}
					<div style={{ marginBottom: 10 }}>
						{(this.state.list || []).length > 0
							? (this.state.list || []).map((li, idx) => (
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
													checked={li.status}
													onChange={(e) =>
														this.setState({
															list: (
																this.state
																	.list || []
															).map((lis) => {
																if (
																	(
																		lis._id ||
																		"as"
																	).toString() !==
																	(
																		li._id ||
																		""
																	).toString()
																) {
																	return lis;
																}
																return {
																	...lis,
																	status: e
																		.target
																		.checked
																};
															})
														})
													}
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
											<div
												style={{
													width: "calc(100% - 65px)"
												}}
											>
												<Popover
													title={locale('common_task.ajil_oruulsan')}
													content={
														<Row gutter={20}>
															<Col
																style={{
																	display:
																		"flex",
																	justifyContent:
																		"center",
																	alignItems:
																		"center"
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
																			li
																				.employee
																				?.user ||
																			{}
																		).avatar
																			?.path
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
																	onError={(
																		e
																	) =>
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
																	{li.employee
																		?.user
																		?.first_name ||
																		"-"}
																</div>
																<div>
																	{li.employee
																		?.user
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
										<div
											style={{ width: 22, marginLeft: 3 }}
										>
											<Popconfirm
												title={locale('common_task.ajil_ustgah_uu')}
												okText={locale('common_task.tiim')}
												cancelText={locale('common_task.ugui')}
												onConfirm={() => {
													this.setState({
														list: (
															this.state.list ||
															[]
														).filter(
															(lis) =>
																(
																	lis._id ||
																	"as"
																).toString() !==
																(
																	li._id || ""
																).toString()
														)
													});
												}}
											>
												<span className="hover_delete_button_ss">
													<DeleteFilled />
												</span>
											</Popconfirm>
										</div>
									</div>
							  ))
							: [0, 1, 2].map((idx) => (
									<div
										key={`${idx}-item`}
										style={{
											paddingLeft: 3,
											display: "flex",
											flexDirection: "row",
											position: "relative",
											transition: ".3s"
										}}
										className={"workplan_job_hover_ss"}
										onClick={() =>
											document
												.querySelector("#input-id")
												?.focus()
										}
									>
										<div
											style={{
												width: "calc(100% - 25px)",
												display: "flex",
												flexDirection: "row"
											}}
										>
											<div style={{ width: 65 }}>
												<Checkbox checked={false}>
													<div
														style={{
															width: 25
														}}
													>
														{idx + 1}.
													</div>
												</Checkbox>
											</div>
											<div
												style={{
													width: "calc(100% - 65px)"
												}}
											>
												<span>
													{locale('common_task.jishee_hiih_ajil')} {idx + 1}
												</span>
											</div>
										</div>
										<div
											style={{ width: 22, marginLeft: 3 }}
										>
											<span className="hover_delete_button_ss">
												<DeleteFilled />
											</span>
										</div>
									</div>
							  ))}
					</div>
					<Input
						style={{ marginBottom: 24 }}
						id={"input-id"}
						value={this.state.tempText}
						placeholder={locale('common_task.ajil_nemeh')}
						onChange={(e) =>
							this.setState({
								tempText: e.target.value
							})
						}
						onPressEnter={(e) => {
							e.preventDefault();
							this.enterIntoList();
						}}
						addonAfter={
							<PlusOutlined
								style={{ cursor: "pointer" }}
								onClick={() => this.enterIntoList()}
							/>
						}
					/>
					<Form.Item
					// label={
					// 	<span>
					// 		Тэмдэглэгээ:{" "}
					// 		{Object.keys(this.state.tag || {}).length >
					// 		0 ? (
					// 			<Tag
					// 				style={{ textDecoration: "underline" }}
					// 				closable
					// 				onClose={() =>
					// 					this.setState({ tag: {} })
					// 				}
					// 			>
					// 				{(this.state.tag || {}).title}
					// 			</Tag>
					// 		) : null}
					// 	</span>
					// }
					>
						<Select
							placeholder={locale('common_task.tag')}
							mode={"tags"}
							loading={this.props.loadingSubtags}
							onSelect={(e) => this.selectTag(e)}
							tagRender={() =>
								Object.keys(this.state.tag || {}).length > 0 ? (
									<Tag
										style={{ textDecoration: "underline" }}
										closable
										onClose={() =>
											this.setState({ tag: {} })
										}
									>
										{(this.state.tag || {}).title}
									</Tag>
								) : null
							}
							value={''}
							key={"subtag"}
						>
							{this.props.subtags?.map((r) =>
								r.subTags && r.subTags.length > 0 ? (
									<React.Fragment key={r._id}>
										<Select.Option
											disabled
											value={r._id}
											key={`${r._id}_option_multi`}
										>
											{r.title}
										</Select.Option>
										{r.subTags.map((c) => (
											<Select.Option
												value={c._id}
												key={`${c._id}_option_multi`}
											>
												{c.title}
											</Select.Option>
										))}
									</React.Fragment>
								) : null
							)}
						</Select>
					</Form.Item>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 24
						}}
					>
						<label title={"Үнэ"}>{locale('common_task.une')}:</label>
						<span style={{ visibility: "hidden" }}>b</span>
						<Form.Item
							noStyle
							// label={"Үнэ"}
							name={"price"}
						>
							<InputNumber
								formatter={(value) =>
									`${value}₮`.replace(
										/\B(?=(\d{3})+(?!\d))/g,
										"'"
									)
								}
								style={{ width: 250 }}
								onChange={(e) => this.setState({ price: e })}
								min={0}
							/>
						</Form.Item>
					</div>
					<Form.Item
					// label={"Хамтран ажиллах"}
					>
						<Select
							loading={this.props.loadingEmployeesInner}
							showSearch={true}
							// placeholder="Хэрэглэгчийн нэр, овог болон утсаар хайх"
							placeholder={locale('common_task.hamtran_ajillah')}
							onSelect={(e) => this.selectEmployee(e)}
							onSearch={this.searchEmployeesInner.bind(this)}
							filterOption={false}
							value={null}
							listHeight={120}
							notFoundContent={"Хоосон байна"}
						>
							{(this.props.employeesInner || []).map((emp) => (
								<Select.Option
									value={emp._id}
									key={emp._id}
									style={
										(this.state.employees || []).some(
											(employ) =>
												(emp._id || "as").toString() ===
												(employ._id || "").toString()
										)
											? {
													backgroundColor: "#6d6d6d",
													color: "white"
											  }
											: {}
									}
								>
									{(((emp || {}).user || {}).last_name || "")
										.slice(0, 1)
										.toUpperCase()}
									.
									{(((emp || {}).user || {}).first_name || "")
										.slice(0, 1)
										.toUpperCase() +
										(
											((emp || {}).user || {})
												.first_name || ""
										).slice(
											1,
											(
												((emp || {}).user || {})
													.first_name || ""
											).length
										)}
									&nbsp;
									{` - ${
										((emp || {}).user || {}).register_id
									}`}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					{(this.state.employees || []).length > 0
						? (this.state.employees || []).map((emp) => (
								<Tag
									style={{ marginBottom: 5 }}
									onClose={() => this.dealWithEmployees(emp)}
									key={emp._id}
									closable={true}
								>
									{((emp.user || {}).last_name || "")[0]}.
									{(emp.user || {}).first_name || ""}
								</Tag>
						  ))
						: null}
				</Form>
			</Drawer>
		);
	}
}

export default TaskDrawerForm;
