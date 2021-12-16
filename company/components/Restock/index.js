import React from "react";
import { connect } from "react-redux";
import { Card, Button, Table } from "antd";
import { Link } from "react-router-dom";
import config, {hasAction} from "../../config";
import { companyAdministrator } from "../../config";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import {
	getRestocks,
	deleteRestock,
	submitRestock,
	toggleRestockModal
} from "../../actions/restock_actions";
import ModalRestock from "./ModalRestock";
import * as actions from "../../actions/category_actions";
const reducer = ({ main, restock }) => ({ main, restock });
class Restock extends React.Component {
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
			main: {
				employee,
				company: { _id }
			}
		} = this.props;
		if (hasAction(["restock"], employee)) {
			dispatch(getRestocks({ companyID: _id }));
		} else {
			this.props.history.replace("/not-found");
		}
	}
	toggleModal(mod) {
		const { dispatch } = this.props;
		dispatch(toggleRestockModal({ data: mod }));
	}
	deleteRestock(e) {
		const { dispatch } = this.props;
		dispatch(deleteRestock(e));
	}
	render() {
		const {
			restock: {
				restocks,
				restock,
				submittingRestock,
				submitSuccess,
				deletingRestock,
				deleteSuccess,
				fetchingRestocks,
				modal
			},
			main: { user, employee }
		} = this.props;
		const { title, product, subProduct, quantity, cost } = this.state;
		const columns = [
			{
				key: "_id",
				title: "№",
				render: (txt, record, idx) => idx + 1
			},
			{
				title: "Он сар",
				render: (txt, record, idx) => {
					return (
						<Link key={idx} to={`/restock/${record._id}`}>
							{moment(record.created).format(
								"YYYY-MM-DD, H:mm:ss"
							)}
						</Link>
					);
				}
			},
			{
				title: "Төлөв",
				render: (txt, record, idx) => {
					// console.log("record index", record);
					return (
						<div>
							{record.status === "new"
								? "Шинэ"
								: record.status === "shipping"
								? "Хүргэгдэж байгаа"
								: record.status === "arrived"
								? "Ирсэн"
								: "Татсан"}
						</div>
					);
				}
			}
		];
		const auth = companyAdministrator(employee)
		return (
			<Card
				title={"Бараа татлага"}
				key={"foobar"}
				loading={fetchingRestocks}
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
							hasAction(['restock'], employee) ?
								<Button
									key={"watkey"}
									type={"primary"}
									onClick={() => this.toggleModal(true)}
									icon={<PlusOutlined />}
								>
									Бараа таталт нэмэх
								</Button>
								: null
						}
					</div>
				}
			>
				<Table dataSource={restocks} columns={columns} />
				{modal ? <ModalRestock /> : null}
			</Card>
		);
	}
}

export default connect(reducer)(Restock);
