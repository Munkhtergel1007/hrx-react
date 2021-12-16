import React, { Fragment } from "react";
import { connect } from "react-redux";
import config, { printStaticRole } from "../../../config";
import moment from "moment";
import { DeleteOutlined } from "@ant-design/icons";
import { UserOutlined, TeamOutlined, CloseOutlined } from "@ant-design/icons";
import {
	Layout,
	Menu,
	Button,
	Spin,
	Form,
	Row,
	Col,
	Input,
	Drawer,
	Typography,
	Popover,
	Space,
	Table,
	Image,
	Tag,
	DatePicker,
	List,
	Avatar,
	Empty,
	Popconfirm
} from "antd";
import { cancelSubsidiaryCompanyDeletion } from "../../../actions/settings_actions";

const reducer = ({ main, settings, subsidiary }) => ({
	main,
	settings,
	subsidiary
});

class SubsidiaryListItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			id: this.props._id,
			name: this.props.name,
			domain: this.props.domain,
			emp_count: this.props.emp_count,
			logo: this.props.logo,
			description: this.props.description,
			employees: this.props.employees || [],
			willBeDeletedBy: this.props.willBeDeletedBy,
			deletionRequestedBy: this.props.deletionRequestedBy || {}
		};
	}
	UNSAFE_componentWillReceiveProps(data, next) {
		this.setState({
			id: data._id,
			expanded: false,
			name: data.name,
			domain: data.domain,
			emp_count: data.emp_count,
			logo: data.logo,
			description: data.description,
			employees: data.employees || [],
			willBeDeletedBy: data.willBeDeletedBy,
			deletionRequestedBy: data.deletionRequestedBy || {}
		});
	}
	render() {
		return (
			<List.Item
				key={this.state.name}
                style={{position: 'relative'}}
				actions={[
					<Space key={`${this.state.name}_emp_count`}>
						<TeamOutlined />
						Ажилчдын тоо:
						{this.state.emp_count || 0}
					</Space>,
					<Space key={`${this.state.name}_cancel_deletion_div`}>
						{this.state.willBeDeletedBy &&
						this.state.deletionRequestedBy ? (
							<React.Fragment>
								<Tag color="red">
									Устах өдөр:{" "}
									{moment(this.props.willBeDeletedBy).format(
										"YYYY-MM-DD HH:mm"
									)}
									{/*Хүсэлт гаргасан:*/}
									{/*    {(((this.state.deletionRequestedBy || {}).user || {}).last_name || '').slice(0,1).toUpperCase()*/}
									{/*    +(((this.state.deletionRequestedBy || {}).user || {}).last_name || '').slice(1,(((this.state.deletionRequestedBy || {}).user || {}).last_name || '').length)}&nbsp;*/}
									{/*    {(((this.state.deletionRequestedBy || {}).user || {}).first_name || '').slice(0,1).toUpperCase()*/}
									{/*    +(((this.state.deletionRequestedBy || {}).user || {}).first_name || '').slice(1,(((this.state.deletionRequestedBy || {}).user || {}).first_name || '').length)}*/}
								</Tag>
								<Popconfirm
									title="Устгах хүсэлтийг цуцлах уу?"
									okText="Тийм"
									cancelText="Үгүй"
									onConfirm={() =>
										this.props.dispatch(
											cancelSubsidiaryCompanyDeletion({
												companyId: this.state.id
											})
										)
									}
								>
									<Button
										size="small"
										type="danger"
										icon={<CloseOutlined />}
									>
										Хүсэлтийг цуцлах
									</Button>
								</Popconfirm>
							</React.Fragment>
						) : null}
					</Space>
				]}
				extra={
					<Space
						direction="vertical"
						style={{ textAlign: "left", maxWidth: 300, width: 300 }}
						align="left"
					>
						{(this.state.employees || []).length > 1 ? (
							<b key={`${this.state._id}_lord_span`}>
								Удирдаж буй хэрэглэгчид
							</b>
						) : (
							<b key={`${this.state._id}_lord_span`}>
								Удирдаж буй хэрэглэгч
							</b>
						)}
						{(this.state.employees || []).map((emp) => (
							<Popover
								key={`${emp._id}_pop`}
								title={
									<b key={`${emp._id}_name`}>
										{((emp.user || {}).last_name || "")
											.slice(0, 1)
											.toUpperCase() +
											(
												(emp.user || {}).last_name || ""
											).slice(
												1,
												(
													(emp.user || {})
														.last_name || ""
												).length
											)}
										&nbsp;
										{((emp.user || {}).first_name || "")
											.slice(0, 1)
											.toUpperCase() +
											(
												(emp.user || {}).first_name ||
												""
											).slice(
												1,
												(
													(emp.user || {})
														.first_name || ""
												).length
											)}
									</b>
								}
								content={
									<span key={`${emp._id}_username`}>
										Нэвтрэх нэр: {(emp.user || {}).username}
									</span>
								}
							>
								{/*<div>*/}
								{/*    <Image*/}
								{/*        src={((emp.user || {}).avatar || {}).path ? `${config.get('hostMedia')}${emp.user.avatar.path}` : '/images/default-avatar.png'}*/}
								{/*        onError={(e) => e.target.src = '/images/default-avatar.png'}*/}
								{/*        style={{width: 75, height: 75, objectFit: 'cover', objectPosition: 'center'}}*/}
								{/*        preview={{*/}
								{/*            mask: <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Үзэх</div>*/}
								{/*        }}*/}
								{/*    />*/}
								{/*</div>*/}
								<div
									key={`${this.state._id}_lord_account`}
									style={{
										position: "relative",
										paddingLeft: 60,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "block",
										width: 300,
										height: 60
									}}
								>
									{((emp.user || {}).avatar || {}).path &&
									((emp.user || {}).avatar || {}).path !==
										"" ? (
										<div
											style={{
												position: "absolute",
												left: 0,
												top: 0,
												borderRadius: 8
											}}
										>
											<Image
												src={
													(
														(emp.user || {})
															.avatar || {}
													).path
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
												style={{
													width: 60,
													height: 60,
													objectFit: "cover",
													objectPosition: "center",
													borderRadius: 8
												}}
												preview={{
													mask: (
														<div
															style={{
																width: "100%",
																height: "100%",
																borderRadius: 8,
																backgroundColor:
																	"rgba(0,0,0,0.4)",
																display: "flex",
																justifyContent:
																	"center",
																alignItems:
																	"center"
															}}
														>
															Үзэх
														</div>
													)
												}}
											/>
										</div>
									) : (
										<img
											src={
												((emp.user || {}).avatar || {})
													.path
													? `${config.get(
															"hostMedia"
													  )}${emp.user.avatar.path}`
													: "/images/default-avatar.png"
											}
											onError={(e) =>
												(e.target.src =
													"/images/default-avatar.png")
											}
											style={{
												position: "absolute",
												left: 0,
												top: 0,
												width: 60,
												height: 60,
												objectFit: "cover",
												objectPosition: "center",
												borderRadius: 8
											}}
										/>
									)}
									{/*{((emp.user || {}).last_name || '').slice(0,1).toUpperCase()}.{((emp.user || {}).first_name || '').slice(0,1).toUpperCase()+*/}
									{/*                    ((emp.user || {}).first_name || '').slice(1,((emp.user || {}).first_name || '').length)}*/}
									{/*{((emp.user || {}).first_name || '').slice(0,1).toUpperCase()+*/}
									<div style={{ paddingLeft: 10 }}>
										<div>
											{((emp.user || {}).last_name || "")
												.slice(0, 1)
												.toUpperCase() +
												(
													(emp.user || {})
														.last_name || ""
												).slice(
													1,
													(
														(emp.user || {})
															.last_name || ""
													).length
												)}
										</div>
										{/*{((emp.user || {}).first_name || '').slice(0,1).toUpperCase()+*/}
										<div>
											{((emp.user || {}).first_name || "")
												.slice(0, 1)
												.toUpperCase() +
												(
													(emp.user || {})
														.first_name || ""
												).slice(
													1,
													(
														(emp.user || {})
															.first_name || ""
													).length
												)}
										</div>
									</div>
								</div>
							</Popover>
						))}
					</Space>
				}
			>
				<div className={"subsidiary-number-index"}>
					{(this.props.index || 0) + 1}
				</div>
				<List.Item.Meta
					style={
						this.state.willBeDeletedBy
							? { margin: 0, opacity: 0.5 }
							: { margin: 0 }
					}
					avatar={
						<div
							key={`${this.state._id}_div`}
							className="image-round"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: "100%",
								backgroundColor: "#ffffff"
							}}
						>
							<Image
								src={
									(this.state.logo || {}).path
										? `${config.get("hostMedia")}${
												(this.state.logo || {}).path
										  }`
										: "/images/default-company.png"
								}
								onError={(e) =>
									(e.target.src =
										"/images/default-company.png")
								}
								style={{
									width: 75,
									height: 75,
									objectFit: "cover",
									objectPosition: "center"
								}}
								preview={{
									mask: (
										<div
											style={{
												width: "100%",
												height: "100%",
												backgroundColor:
													"rgba(0,0,0,0.4)",
												display: "flex",
												justifyContent: "center",
												alignItems: "center"
											}}
										>
											Үзэх
										</div>
									)
								}}
							/>
						</div>
					}
					title={
						<a
							style={{ display: "block" }}
							href={`${config.get("redirectHostHead")}${
								this.state.domain
							}.${config.get("redirectHostTail")}`}
						>
							<Typography.Paragraph
								strong
								ellipsis={{ rows: 1, tooltip: true }}
							>
								{this.state.name}
							</Typography.Paragraph>
						</a>
					}
					description={
						<React.Fragment>
							<Typography.Paragraph
								style={{ maxWidth: "100%", marginBottom: 0 }}
								ellipsis={
									!this.state.expanded ? { rows: 2 } : false
								}
							>
								{this.state.description}
							</Typography.Paragraph>
							{this.state.description ? (
								// (this.state.description || '').length > 220 &&
								this.state.expanded ? (
									<p
										style={{
											color: "#1890ff",
											textAlign: "right",
											cursor: "pointer"
										}}
										onClick={() =>
											this.setState({ expanded: false })
										}
									>
										Хураангуйлан харах
									</p>
								) : (
									<React.Fragment>
										<p
											style={{
												color: "#1890ff",
												textAlign: "right",
												cursor: "pointer"
											}}
											onClick={() =>
												this.setState({
													expanded: true
												})
											}
										>
											Дэлгэрэнгүй харах
										</p>
									</React.Fragment>
								)
							) : null}
						</React.Fragment>
					}
				/>
			</List.Item>
		);
	}
}

export default connect(reducer)(SubsidiaryListItem);
