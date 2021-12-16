import React, { Component } from "react";
import { connect } from "react-redux";
import config, {
	hasAction,
	isValidDate,
	companyAdministrator,
	isId
} from "../../config";
import moment from "moment";
import {
	getTasks,
	createTask,
	changeTask,
	getEmployeeStandardInner,
	getDoneTasks,
	finishTask,
	getIdleTasks
} from "../../actions/task_actions";
import { getEmployeeStandard } from "../../actions/employee_actions";
import { getSubTagsWithParent } from "../../actions/main_actions";
import { getSubsidiaryCompanies } from "../../actions/employee_actions";

import TaskCardUser from "./TaskCardUser";
import TaskCardTag from "./TaskCardTag";
import TaskCardDate from "./TaskCardDate";
import TaskDrawerForm from "./TaskDrawerForm";
import TaskDrawerView from "./TaskDrawerView";
import {locale} from "../../lang";
// import TaskModal from "./TaskModal";

const reducer = ({ main, task, employee }) => ({ main, task, employee });
import {
	CloseCircleFilled,
	SearchOutlined,
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	CheckOutlined,
	EyeOutlined,
	UserOutlined,
	CalendarOutlined,
	TagOutlined
} from "@ant-design/icons";
import {
	Button,
	Popover,
	Popconfirm,
	Table,
	Tooltip,
	Alert,
	Tag,
	Card,
	InputNumber,
	Input,
	Space,
	Row,
	Spin,
	Typography,
	Form,
	List,
	DatePicker,
	Divider,
	Select,
	Col,
	Empty,
	Drawer
} from "antd";
const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

let starting_date = new Date();
starting_date.setDate(1);
starting_date.setHours(0, 0, 0, 0);
let ending_date = new Date(starting_date);
ending_date.setMonth(ending_date.getMonth() + 1);
ending_date.setMilliseconds(ending_date.getMilliseconds() - 1);

class Task extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			modal: false,
			starting_date: moment(starting_date),
			ending_date: moment(ending_date),
			search: "",
			status: "all",
			employee: "",
			company: "all",
			subtag: "all",

			pageSize: 10,
			pageNum: 0,
			view: "user",
			task: {},
			localLoading: false,
			mask: "",
			maskOne: ""
		};
		this.changeParentState = this.changeParentState.bind(this);
		this.searchEmployees = this.searchEmployees.bind(this);
		this.searchEmployeesInner = this.searchEmployeesInner.bind(this);
		this.finishTask = this.finishTask.bind(this);
		this.submitTask = this.submitTask.bind(this);
		this.statusChange = this.statusChange.bind(this);
	}
	componentDidMount() {
		let {
			task: { all, loadingMore },
			main: { employee, company },
			dispatch
		} = this.props;
		dispatch(getSubTagsWithParent());
		dispatch(getSubsidiaryCompanies());
		let cc = {
			pageSize: this.state.pageSize,
			pageNum: this.state.pageNum,
			starting_date: moment(this.state.starting_date).format(
				"YYYY-MM-DD"
			),
			ending_date: moment(this.state.ending_date).format("YYYY-MM-DD"),
			view: this.state.view,
			search: this.state.search,
			status: "all",
			employee: "",
			company: "all",
			subtag: "all"
		};
		dispatch(getTasks(cc)).then((c) => {
			if (c.json?.success) {
				document
					.querySelector("#task-main-window")
					.addEventListener("scroll", (e) => {
						let width =
							document.querySelector("#task-main").scrollWidth -
							document.querySelector("#task-main").clientWidth;
						if (
							width - e.target.scrollLeft <= 200 &&
							(this.state.pageNum + 1) * this.state.pageSize <=
								this.props.task?.all &&
							!loadingMore &&
							!this.state.localLoading
						) {
							this.setState(
								{
									pageNum: this.state.pageNum + 1,
									localLoading: true
								},
								() => {
									this.props
										.dispatch(
											getTasks({
												pageSize: this.state.pageSize,
												pageNum: this.state.pageNum,
												starting_date: moment(
													this.state.starting_date
												).format("YYYY-MM-DD"),
												ending_date: moment(
													this.state.ending_date
												).format("YYYY-MM-DD"),
												view: this.state.view,
												search: this.state.search,
												status: this.state.status,
												employee: this.state.employee,
												company: this.state.company,
												subtag: this.state.subtag
											})
										)
										.then((c) => {
											if (c.json?.success) {
												this.setState({
													localLoading: false
												});
											}
										});
								}
							);
						}
					});
			}
		});
		let empCC = {
			pageNum: 0,
			pageSize: 10,
			staticRole: ["hrManager", "employee", "chairman", "lord"],
			extraProp: ["register_id"],
			// search: self.state.userSearch,
			getAvatars: true
		};
		if (!companyAdministrator(employee)) {
			empCC.company = company._id;
			dispatch(getIdleTasks());
			dispatch(getEmployeeStandardInner(empCC));
		} else {
			dispatch(getDoneTasks());
			dispatch(getEmployeeStandardInner(empCC));
			empCC.subsidiaries = true;
			dispatch(getEmployeeStandard(empCC));
		}
	}
	search(e) {
		let cc = {
			pageSize: this.state.pageSize,
			pageNum: e,
			starting_date: moment(this.state.starting_date).format(
				"YYYY-MM-DD"
			),
			ending_date: moment(this.state.ending_date).format("YYYY-MM-DD"),
			search: this.state.search,
			status: this.state.status,
			employee: (this.state.employee || {})._id,
			company: this.state.company,
			subtag: this.state.subtag,
			view: this.state.view
		};
		this.props.dispatch(getTasks(cc));
	}
	selectEmployee(e) {
		const {
			task: { employees }
		} = this.props;
		let selected = {};
		(employees || []).map((emp) => {
			if ((e || "as").toString() === ((emp || {})._id || "").toString()) {
				selected = emp;
			}
		});
		this.setState({ employee: selected });
	}
	searchEmployees(e) {
		const {
			main: { company, employee }
		} = this.props;
		let self = this;
		clearTimeout(this.state.timeOut);
		let timeOut = setTimeout(function () {
			self.setState(
				{
					timeOut: timeOut
				},
				() => {
					const {
						main: { company }
					} = self.props;
					self.props.dispatch(
						getEmployeeStandard({
							pageNum: 0,
							pageSize: 10,
							staticRole: [
								"hrManager",
								"employee",
								"chairman",
								"lord"
							],
							search: e,
							extraProp: ["register_id"],
							getAvatars: true,
							subsidiaries: true,
							company: self.state.company
						})
					);
				}
			);
		}, 500);
	}
	searchEmployeesInner(e) {
		const {
			main: { company }
		} = this.props;
		this.props.dispatch(
			getEmployeeStandardInner({
				pageNum: 0,
				pageSize: 10,
				staticRole: ["hrManager", "employee", "chairman", "lord"],
				search: e,
				extraProp: ["register_id"],
				getAvatars: true,
				company: company._id
			})
		);
	}
	clear() {
		this.setState({
			visible: false,
			modal: false,
			starting_date: moment(starting_date),
			ending_date: moment(ending_date),
			search: "",
			status: "all",
			employee: "",
			company: "all",
			subtag: "all",
			task: {}
		});
	}
	setCompany(e) {
		this.setState(
			{
				visible: false,
				starting_date: moment(starting_date),
				ending_date: moment(ending_date),
				search: "",
				status: "all",
				employee: "",
				company: e,
				subtag: "all"
			},
			() => this.search(0)
		);
	}
	setRangePickerExtraFooter(type) {
		if (type === "thisWeek" || type === "lastWeek") {
			let curr = new Date();
			let first = curr.getDate() - curr.getDay() + 1;
			let last = first + 6;
			let startDate = new Date(curr.setDate(first));
			let endDate = new Date(curr.setDate(last));
			if (type === "lastWeek") {
				startDate.setDate(startDate.getDate() - 7);
				endDate.setDate(endDate.getDate() - 7);
			}
			this.setState({
				...this.state,
				starting_date: moment(startDate).format("YYYY-MM-DD"),
				ending_date: moment(endDate).format("YYYY-MM-DD")
			});
		} else if (type === "thisMonth" || type === "lastMonth") {
			let todayy = new Date();
			let yearr = todayy.getFullYear();
			let monthh = todayy.getMonth();
			let dayy, startDate, endDate;
			if (type === "thisMonth") {
				dayy = new Date(yearr, monthh + 1, 0).getDate();
				startDate = new Date(yearr, monthh, 1);
				endDate = new Date(yearr, monthh, dayy);
			}
			if (type === "lastMonth") {
				monthh = monthh - 1;
				dayy = new Date(yearr, monthh + 1, 0).getDate();
				startDate = new Date(yearr, monthh, 1);
				endDate = new Date(yearr, monthh, dayy);
			}
			this.setState({
				...this.state,
				starting_date: moment(startDate).format("YYYY-MM-DD"),
				ending_date: moment(endDate).format("YYYY-MM-DD")
			});
		}
	}
	changeParentState(e) {
		this.setState(e);
	}
	submitTask(e) {
		const {
			employees,
			title,
			description,
			dates,
			tag,
			price,
			image,
			_id,
			list,
			owner,
			employee
		} = e;
		if (!title || (title || "").trim() === "")
			return config
				.get("emitter")
				.emit("warning", locale('common_task.garchig_zaawal_baih_ystoi'));
		// if (!dates || (dates || []).length === 0)
		// 	return config
		// 		.get("emitter")
		// 		.emit("warning", "Хугацаа заавал байх ёстой.");
		if (
			employees &&
			(employees || []).length > 0 &&
			(employees || []).some((employee) => !isId(employee._id))
		)
			return config
				.get("emitter")
				.emit("warning", locale('common_task.ajiltnii_medeeleld_aldaa_garlaa'));
		if (image && !isId(image))
			return config
				.get("emitter")
				.emit("warning", locale('common_task.zurgiin_medeeleld_aldaa_garlaa'));
		this.props
			.dispatch(
				createTask({
					_id: _id,
					employees: employees,
					title,
					description,
					dates,
					tag,
					price,
					image,
					list: list,
					owner,
					filters: {
						search: this.state.search,
						starting_date: this.state.starting_date,
						ending_date: this.state.ending_date,
						employee: this.state.employee,
						subtag: this.state.subtag,
						view: this.state.view,
						company: this.state.company
					},
					employee
				})
			)
			.then((c) => {
				if (c.json.success) {
					this.clear();
				}
			});
	}
	finishTask(e) {
		const {
			main: { employee }
		} = this.props;
		if (companyAdministrator(employee)) {
			this.props.dispatch(finishTask(e)).then((c) => {
				if (c.json?.success) {
					this.setState({ modal: false, task: {} });
				}
			});
		} else {
			return config
				.get("emitter")
				.emit("warning", "locale('common_task.zuwhun_erhtei_humuus_duusgah_bolomjtoi')");
		}
	}
	statusChange(e) {
		this.props.dispatch(changeTask(e)).then(c => {
			if(c.json?.success){
				this.setState({mask: ""})
			}
		});
	}
	render() {
		let {
			main: { employee, company, user },
			task: {
				employees,
				tasks,
				loadingTasks,
				loadingEmployees,
				creatingTask,
				deletingTask,
				subtags,
				loadingSubtags,
				companies,
				loadingCompanies,
				loadingEmployeesInner,
				employeesInner,
				loadingDoneTasks,
				doneTasks,
				view,
				loadingIdleTasks,
				idleTasks,
				all,
				loadingMore,
				finishingTask,
				changingTask
			}
		} = this.props;
		return (
			<div>
				{loadingTasks ? (
					<div style={{ textAlign: "center", marginTop: 60 }}>
						<Spin size="large" />
					</div>
				) : (
					<>
						{companyAdministrator(employee) ? (
							<>
								<Row
									style={{
										justifyContent: "space-between",
										textAlign: "right",
										width: "100%",
										marginBottom: 10
									}}
								>
									<>
										<div
											style={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center"
											}}
										>
											<Title
												level={5}
												style={{
													marginRight: 10,
													marginBottom: 0,
													display: "inline-block",
													width: 126,
													textAlign: "right"
												}}
											>
												{locale('common_task.kompani')}:
											</Title>
											<Select
												placeholder={locale('common_task.kompani')}
												onSelect={(e) =>
													this.setState({
														company: e
													})
												}
												value={this.state.company}
												key={"company"}
												style={{
													width: 586,
													marginRight: 20,
													textAlign: "left"
												}}
												loading={loadingCompanies}
												onChange={this.setCompany.bind(
													this
												)}
											>
												<Select.Option
													value={"all"}
													key={"all"}
												>
													{locale('common_task.bugd')}
												</Select.Option>
												<Select.Option
													value={company._id}
													key={company._id}
												>
													{company.name}
												</Select.Option>
												{(companies || []).map(
													(company) => (
														<Select.Option
															value={company._id}
															key={company._id}
														>
															{company.name}
														</Select.Option>
													)
												)}
											</Select>
										</div>
										<Button
											icon={<PlusOutlined />}
											type={"primary"}
											key={"task-button"}
											loading={creatingTask}
											onClick={() =>
												this.setState({ visible: true })
											}
										>
											{locale('common_task.ajil_nemeh')}
										</Button>
									</>
								</Row>
								<Divider key={"task-company"} />
							</>
						) : null}
						<div key={"header-div"}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between"
								}}
							>
								<Row key="date" style={{ marginBottom: 10 }}>
									<Title
										level={5}
										style={{
											marginRight: 10,
											marginBottom: 0,
											display: "inline-block",
											width: 126,
											textAlign: "right"
										}}
									>
										{locale('common_task.ajil')}:{" "}
									</Title>
									<div>
										<RangePicker
											loading={loadingTasks}
											disabled={loadingTasks}
											renderExtraFooter={() => (
												<div className="range-picker-extra-footer-css">
													<div
														className="clickable-dv"
														onClick={this.setRangePickerExtraFooter.bind(
															this,
															"thisWeek"
														)}
													>
														{locale('common_task.ene_doloo_honog')}
													</div>
													<div
														className="clickable-dv"
														onClick={this.setRangePickerExtraFooter.bind(
															this,
															"lastWeek"
														)}
													>
														{locale('common_task.umnuh_doloo_honog')}
													</div>
													<div
														className="clickable-dv"
														onClick={this.setRangePickerExtraFooter.bind(
															this,
															"thisMonth"
														)}
													>
														{locale('common_task.ene_sar')}
													</div>
													<div
														className="clickable-dv"
														onClick={this.setRangePickerExtraFooter.bind(
															this,
															"lastMonth"
														)}
													>
														{locale('common_task.umnuh_sar')}
													</div>
												</div>
											)}
											allowClear={false}
											value={
												this.state.starting_date &&
												this.state.ending_date
													? [
															moment(
																this.state
																	.starting_date
															),
															moment(
																this.state
																	.ending_date
															)
													  ]
													: null
											}
											style={{ marginRight: 20 }}
											placeholder={[
												locale('common_task.ehleh_hugatsaa'),
												locale('common_task.duusah_hugatsaa')
											]}
											onChange={(dateMoment, dateValue) =>
												this.setState({
													starting_date:
														dateMoment[0],
													ending_date: dateMoment[1]
												})
											}
										/>
										<Input
											disabled={loadingTasks}
											style={{
												width: 150,
												marginRight: 20
											}}
											addonAfter={
												<CloseCircleFilled
													style={{ color: "white" }}
													onClick={() =>
														this.setState({
															search: ""
														})
													}
												/>
											}
											maxLength={60}
											placeholder={locale('common_task.garchig')}
											value={this.state.search}
											onChange={(e) =>
												this.setState({
													search: e.target.value
												})
											}
										/>
										<Select
											loading={loadingSubtags}
											placeholder={locale('common_task.temdeglegee')}
											onSelect={(e) =>
												this.setState({ subtag: e })
											}
											value={this.state.subtag}
											key={"subtag"}
											style={{
												width: 200,
												marginRight: 20
											}}
										>
											<Select.Option
												value={"all"}
												key={"all"}
											>
												{locale('common_task.bugd')}
											</Select.Option>
											{subtags?.map((r) =>
												r.subTags &&
												r.subTags.length > 0 ? (
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
										<Button
											icon={<SearchOutlined />}
											type={"primary"}
											onClick={() => this.search(0)}
										>
											{locale('common_task.haih')}
										</Button>
									</div>
								</Row>
								{!companyAdministrator(employee) ? (
									<Button
										icon={<PlusOutlined />}
										type={"primary"}
										key={"task-button"}
										loading={creatingTask}
										onClick={() =>
											this.setState({ visible: true })
										}
									>
										{locale('common_task.ajil_nemeh')}
									</Button>
								) : null}
							</div>
							{companyAdministrator(employee) ? (
								<Row key={"user"}>
									<Title
										level={5}
										style={{
											marginRight: 10,
											marginBottom: 0,
											display: "inline-block",
											width: 126,
											textAlign: "right"
										}}
									>
										{locale('common_task.hereglegch')}:
									</Title>
									<Select
										loading={loadingEmployees}
										allowClear
										showSearch={true}
										style={{ width: 886 }} //586
										placeholder={locale('common_task.hereglegchiin_n_b_u_h')}
										onSelect={(e) => this.selectEmployee(e)}
										onClear={() =>
											this.setState({ employee: "" })
										}
										onSearch={this.searchEmployees.bind(
											this
										)}
										filterOption={false}
										value={(this.state.employee || {})._id}
										dropdownClassName={
											"orlogo-zarlaga-dropdown"
										}
										dropdownRender={(record) =>
											((record.props || {}).options || [])
												.length > 0 ? (
												(
													(record.props || {})
														.options || []
												).map((opt, index) => (
													<Row
														key={`multiple-column-select-column-${index}`}
														className={
															(
																(
																	this.state
																		.employee ||
																	{}
																)._id || "a"
															).toString() ===
															opt.value
																? "row active"
																: "row"
														}
														onClick={() =>
															this.selectEmployee(
																opt.value
															)
														}
														style={{
															display: "flex",
															alignItems: "center"
														}}
													>
														{(
															opt.children || []
														).map((child, ind) =>
															typeof child ===
															"object" ? (
																<div
																	style={{
																		borderRadius:
																			"50%",
																		overflow:
																			"hidden",
																		marginRight: 10
																	}}
																	key={`multiple-column-select-row-${ind}`}
																>
																	<img
																		style={{
																			width: 50,
																			height: 50,
																			objectFit:
																				"cover",
																			objectPosition:
																				"center"
																		}}
																		src={
																			(
																				child.props ||
																				{}
																			)
																				.src
																				? (
																						child.props ||
																						{}
																				  )
																						.src
																				: "/images/default-avatar.png"
																		}
																		onError={(
																			e
																		) =>
																			(e.target.src =
																				"/images/default-avatar.png")
																		}
																	/>
																</div>
															) : (
																<span
																	key={`multiple-column-select-span-${ind}`}
																	style={{
																		fontWeight:
																			"bold",
																		fontSize: 17,
																		display:
																			"inline-block"
																	}}
																>
																	{child}
																</span>
															)
														)}
													</Row>
												))
											) : (
												<Empty
													description={
														<span
															style={{
																color: "#495057",
																userSelect:
																	"none"
															}}
														>
															{locale('common_task.hailtiin_ilerts_oldsongui')}!
														</span>
													}
												/>
											)
										}
									>
										{(employees || []).map((emp) => (
											<Select.Option
												value={emp._id}
												key={emp._id}
											>
												<img
													style={{ display: "none" }}
													src={
														(
															(emp.user || {})
																.avatar || {}
														).path
															? `${config.get(
																	"hostMedia"
															  )}${
																	(
																		(
																			emp.user ||
																			{}
																		)
																			.avatar ||
																		{}
																	).path
															  }`
															: "/images/default-avatar.png"
													}
													onError={(e) =>
														(e.target.src =
															"/images/default-avatar.png")
													}
												/>
												{(
													((emp || {}).user || {})
														.last_name || ""
												)
													.slice(0, 1)
													.toUpperCase()}
												.
												{(
													((emp || {}).user || {})
														.first_name || ""
												)
													.slice(0, 1)
													.toUpperCase() +
													(
														((emp || {}).user || {})
															.first_name || ""
													).slice(
														1,
														(
															(
																(emp || {})
																	.user || {}
															).first_name || ""
														).length
													)}
												&nbsp;
												{` - ${
													((emp || {}).company || {})
														.name
												}`}
											</Select.Option>
										))}
									</Select>
								</Row>
							) : null}
						</div>
					</>
				)}
				<Divider key={"task"} />
				<Row
					gutter={20}
					style={{
						alignItems: "flex-start",
						zIndex: 12,
						position: "relative",
						backgroundColor: "#F0F2F5"
					}}
				>
					<div
						id={"task-mask-row"}
						className={
							this.state.mask ? "task-mask active" : "task-mask"
						}
						onClick={() => this.setState({ mask: "" })}
					/>
					<Col span={6}>
						<Card
							headStyle={{
								display: "flex",
								justifyContent: "space-evenly"
							}}
							className={"custom-task-scroll"}
							bodyStyle={{ maxHeight: 550, overflowY: "auto" }}
							title={[
								<Button
									type={
										this.state.view === "user"
											? "primary"
											: "default"
									}
									key={"userButton"}
									icon={<UserOutlined />}
									onClick={() =>
										this.state.view !== "user" &&
										this.setState(
											{ view: "user", pageNum: 0 },
											() => this.search(0)
										)
									}
									style={{ marginRight: 10 }}
									shape={"circle"}
								/>,
								<Button
									type={
										this.state.view === "date"
											? "primary"
											: "default"
									}
									key={"calendarButton"}
									icon={<CalendarOutlined />}
									onClick={() =>
										this.state.view !== "date" &&
										this.setState(
											{ view: "date", pageNum: 0 },
											() => this.search(0)
										)
									}
									style={{ marginRight: 10 }}
									shape={"circle"}
								/>,
								<Button
									type={
										this.state.view === "tag"
											? "primary"
											: "default"
									}
									key={"tagButton"}
									icon={<TagOutlined />}
									onClick={() =>
										this.state.view !== "tag" &&
										this.setState(
											{ view: "tag", pageNum: 0 },
											() => this.search(0)
										)
									}
									style={{ marginRight: 10 }}
									shape={"circle"}
								/>
							]}
						>
							{companyAdministrator(employee) ? (
								loadingDoneTasks ? (
									<div
										style={{
											width: "100%",
											height: "100%",
											display: "flex",
											justifyContent: "center",
											alignItems: "center"
										}}
									>
										<Spin size={"large"} />
									</div>
								) : (
									<div>
										<div
											style={{
												fontWeight: "bold",
												textAlign: "left",
												marginBottom: 10
											}}
										>
											{this.state.view === "user"
												? locale('common_task.hereglegcheer_harj_baina')
												: this.state.view === "date"
												? locale('common_task.udruur_harj_baina')
												: locale('common_task.temdeglegeegeer_harj_baina')}
										</div>
										{(doneTasks || []).length > 0 ? (
											(doneTasks || []).map((task) => (
												<Row
													key={`${task._id}-sidebar`}
													style={{ marginBottom: 10 }}
												>
													<Col span={20}>
														<Title
															level={5}
															ellipsis={{
																rows: 1,
																expandable: false,
																tooltip: true
															}}
															style={{
																marginBottom: 0
															}}
														>
															{task.title || "-"}
														</Title>
														<Paragraph
															ellipsis={{
																rows: 1,
																expandable: false,
																tooltip: true
															}}
															style={{
																marginBottom: 0
															}}
														>
															{task.description ||
																"-"}
														</Paragraph>
													</Col>
													<Col
														span={4}
														style={{
															display: "flex",
															justifyContent:
																"center",
															alignItems: "center"
														}}
													>
														<Button
															onClick={() => {
																let emps =
																	task.employees ||
																	[];
																if (
																	Object.keys(
																		emps[0] ||
																			{}
																	).length < 2
																) {
																	emps = [];
																}
																this.setState({
																	modal: true,
																	task: {
																		...task,
																		employees:
																			emps
																	}
																});
															}}
															shape={"circle"}
															icon={
																<EyeOutlined />
															}
														/>
													</Col>
												</Row>
											))
										) : (
											<Empty
												image={
													Empty.PRESENTED_IMAGE_SIMPLE
												}
												description={
													<span
														style={{
															color: "#495057",
															userSelect: "none"
														}}
													>
														{locale('common_task.huleegdej_bui_ajil_baihgui')}
													</span>
												}
											/>
										)}
									</div>
								)
							) : loadingIdleTasks ? (
								<div
									style={{
										width: "100%",
										height: "100%",
										display: "flex",
										justifyContent: "center",
										alignItems: "center"
									}}
								>
									<Spin size={"large"} />
								</div>
							) : (
								<div>
									<div
										style={{
											fontWeight: "bold",
											textAlign: "left",
											marginBottom: 10
										}}
									>
										{this.state.view === "user"
											? locale('common_task.hereglegcheer_harj_baina')
											: this.state.view === "date"
											? locale('common_task.udruur_harj_baina')
											: locale('common_task.temdeglegeegeer_harj_baina')}
									</div>
									{(idleTasks || []).length > 0 ? (
										(idleTasks || []).map((task) => (
											<Row
												key={`${task._id}-sidebar`}
												style={{ marginBottom: 10 }}
											>
												<Col span={20}>
													<Title
														level={5}
														ellipsis={{
															rows: 1,
															expandable: false,
															tooltip: true
														}}
														style={{
															marginBottom: 0
														}}
													>
														{task.title || "-"}
													</Title>
													<Paragraph
														ellipsis={{
															rows: 1,
															expandable: false,
															tooltip: true
														}}
														style={{
															marginBottom: 0
														}}
													>
														{task.description ||
															"-"}
													</Paragraph>
												</Col>
												<Col
													span={4}
													style={{
														display: "flex",
														justifyContent:
															"center",
														alignItems: "center"
													}}
												>
													<Button
														onClick={() => {
															let emps =
																task.employees ||
																[];
															if (
																Object.keys(
																	emps[0] ||
																		{}
																).length < 2
															) {
																emps = [];
															}
															this.setState({
																visible: true,
																task: {
																	...task,
																	employees:
																		emps
																}
															});
														}}
														shape={"circle"}
														icon={<EditOutlined />}
													/>
												</Col>
											</Row>
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
													{locale('common_task.duusaagui_ajil_baihgui')}
												</span>
											}
										/>
									)}
								</div>
							)}
						</Card>
					</Col>
					<Col
						span={18}
						id={"task-main-window"}
						className={"task-window"}
						style={{
							overflow: "auto",
							zIndex: 13
							// backgroundColor: '#F0F2F5'
						}}
					>
						<div
							id={"task-main"}
							style={{
								transform: "rotateX(180deg)",
								display: "flex",
								flexDirection: "row",
								flexWrap: "nowrap",
								alignItems: "flex-start",
								zIndex: 15,
								// backgroundColor: '#F0F2F5',
								height: "calc(100vh - 300px)",
								position: "relative"
							}}
						>
							{(tasks || []).length > 0 ? (
								loadingTasks ? (
									<Card
										loading={true}
										style={{
											width: "100%"
										}}
									/>
								) : view === "user" ? (
									<>
										{(tasks || []).map((task, index) => (
											<TaskCardUser
												key={`${task._id}-task-card-user`}
												{...task}
												index={
													(tasks || []).length - index
												}
												submitTask={this.submitTask}
												length={(tasks || []).length}
												mask={this.state.mask}
												maskOne={this.state.maskOne}
												employee={employee}
												statusChange={this.statusChange}
												finishingTask={finishingTask}
												changingTask={changingTask}
												changeParentState={
													this.changeParentState
												}
											/>
										))}
										{loadingMore ? (
											<Card
												loading={true}
												style={{ width: 150 }}
												key={"card-loader-user"}
											/>
										) : (
											<div style={{ width: 150 }} />
										)}
										<div
											id="task-mask-card"
											style={{
												backgroundColor: "transparent"
											}}
											className={
												this.state.mask
													? "task-mask active"
													: "task-mask"
											}
											onClick={() =>
												this.setState({ mask: "" })
											}
										/>
									</>
								) : view === "tag" ? (
									<>
										{(tasks || []).map((task, index) => (
											<TaskCardTag
												key={`${task._id}-task-card-user`}
												{...task}
												index={
													(tasks || []).length - index
												}
												submitTask={this.submitTask}
												length={(tasks || []).length}
												mask={this.state.mask}
												maskOne={this.state.maskOne}
												employee={employee}
												user={user}
												statusChange={this.statusChange}
												finishingTask={finishingTask}
												changingTask={changingTask}
												changeParentState={
													this.changeParentState
												}
											/>
										))}
										{loadingMore ? (
											<Card
												loading={true}
												style={{ width: 150 }}
												key={"card-loader-tag"}
											/>
										) : (
											<div style={{ width: 150 }} />
										)}
										<div
											id="task-mask-card"
											style={{
												backgroundColor: "transparent"
											}}
											className={
												this.state.mask
													? "task-mask active"
													: "task-mask"
											}
											onClick={() =>
												this.setState({ mask: "" })
											}
										/>
									</>
								) : (
									<>
										{(tasks || []).map((task, index) => (
											<TaskCardDate
												key={`${task._id}-task-card-user`}
												{...task}
												index={
													(tasks || []).length - index
												}
												submitTask={this.submitTask}
												length={(tasks || []).length}
												mask={this.state.mask}
												maskOne={this.state.maskOne}
												employee={employee}
												user={user}
												statusChange={this.statusChange}
												finishingTask={finishingTask}
												changingTask={changingTask}
												changeParentState={
													this.changeParentState
												}
											/>
										))}
										{loadingMore ? (
											<Card
												loading={true}
												style={{ width: 150 }}
												key={"card-loader-date"}
											/>
										) : (
											<div style={{ width: 150 }} />
										)}
										<div
											id="task-mask-card"
											style={{
												backgroundColor: "transparent"
											}}
											className={
												this.state.mask
													? "task-mask active"
													: "task-mask"
											}
											onClick={() =>
												this.setState({ mask: "" })
											}
										/>
									</>
								)
							) : (
								<Card
									style={{
										width: "100%",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: 500
									}}
								>
									<Empty
										description={
											<span
												style={{
													color: "#495057",
													userSelect: "none"
												}}
											>
												{locale('common_task.hooson_baina')}
											</span>
										}
									/>
								</Card>
							)}
						</div>
						<div
							id="task-mask-scroll"
							style={{ backgroundColor: "transparent" }}
							className={
								this.state.mask
									? "task-mask active"
									: "task-mask"
							}
							onClick={() => this.setState({ mask: "" })}
						/>
					</Col>
				</Row>
				{this.state.visible ? (
					<TaskDrawerForm
						employee={employee}
						submitTask={this.submitTask}
						searchEmployeesInner={this.searchEmployeesInner}
						changeParentState={this.changeParentState}
						employeesInner={employeesInner}
						user={user}
						subtags={subtags}
						creatingTask={creatingTask}
						loadingEmployeesInner={loadingEmployeesInner}
						visible={this.state.visible}
						loadingSubtags={loadingSubtags}
						{...this.state.task}
					/>
				) : null}
				{this.state.modal ? (
					<TaskDrawerView
						employee={employee}
						modal={this.state.modal}
						finishTask={this.finishTask}
						finishingTask={finishingTask}
						changeParentState={this.changeParentState}
						{...this.state.task}
					/>
				) : null}
				{/* {this.state.modal ? (
					<TaskModal
						visible={this.state.modal}
						finishTask={this.finishTask}
						finishingTask={finishingTask}
						changeParentState={this.changeParentState}
						{...(this.state.task || {})}
					/>
				) : null} */}
				<div
					id={"task-mask-main"}
					className={
						this.state.mask
							? "task-mask main-mask active"
							: "task-mask main-mask"
					}
					onClick={() => this.setState({ mask: "" })}
				/>
			</div>
		);
	}
}

export default connect(reducer)(Task);
