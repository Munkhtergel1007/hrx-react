import React from "react";
import { connect } from "react-redux";
import { Card, Button, Table, Select } from "antd";
const { Option } = Select;
import { Link } from "react-router-dom";
import config from "../../config";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import {
	getRestocks,
	deleteRestock,
	submitRestock,
	toggleRestockModal,
	toggleRestockSingleModal,
	getRestockSingle,
	updateRestock
} from "../../actions/restock_actions";
import ModalRestockSingle from "./ModalRestockSingle";
const reducer = ({ main, restock }) => ({ main, restock });
class RestockSingle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: "",
			newStatus: "",
			orderID: "",
			item: {}
		};
	}
	componentDidMount() {
		const {
			dispatch,
			match: {
				params: { _id }
			}
		} = this.props;
		dispatch(getRestockSingle({ orderID: _id }));
	}
	toggleModal(mod, item) {
		const {
			dispatch,
			match: {
				params: { _id }
			}
		} = this.props;
		this.setState({ item: item }, () =>
			dispatch(toggleRestockSingleModal({ data: mod }))
		);
	}
	deleteRestock(e) {
		const { dispatch } = this.props;
		dispatch(deleteRestock(e));
	}
	changeStatus(e) {
		this.setState({ newStatus: e });
	}
	updateStatus() {
		const {
			dispatch,
			match: {
				params: { _id }
			}
		} = this.props;
		dispatch(updateRestock({ status: this.state.newStatus, orderID: _id }));
	}
	render() {
		const {
			restock: { restock, fetchingRestockSingle, modalSingle },
			match: {
				params: { _id }
			}
		} = this.props;
		const columns = [
			{
				key: "_id",
				title: "№",
				render: (txt, record, idx) => idx + 1
			},
			{
				title: "Бараа",
				render: (txt, record, idx) => {
					return <div key={idx}>{record.name}</div>;
				}
			},
			{
				title: "Тоо",
				render: (txt, record, idx) => {
					return <div key={idx}>{record.quantity}</div>;
				}
			},
			{
				title: "Ш/Үнэ",
				render: (txt, record, idx) => {
					return <div key={idx}>{record.cost}₮</div>;
				}
			},
			{
				title: "Статус",
				render: (txt, record, idx) => {
					// console.log("record", record);
					return (
						<div key={idx}>
							{record.stocked ? "Түгээсэн" : "Хүлээгдэж байгаа"}
						</div>
					);
				}
			},
			{
				title: "Түгээх",
				render: (txt, record, idx) => {
					// console.log(
					// 	"record",
					// 	record.stocked,
					// 	record.status !== "arrived"
					// );
					return (
						<Button
							disabled={
								record.stocked || restock.status !== "arrived"
							}
							onClick={() => this.toggleModal(true, record)}
						>
							Түгээх
						</Button>
					);
				}
			}
		];
		return (
			<Card
				title={
					<Link
						to="/restock"
						style={{
							marginRight: 200,
							textDecoration: "underline"
						}}
					>
						<LeftOutlined />
						{`${
							(restock && restock.created
								? moment(restock.created).format("YYYY/MM/DD") +
								  " Бараа татлага"
								: "Бараа татлага") +
							(restock && restock.status
								? restock.status === "new"
									? " - Шинэ"
									: restock.status === "shipping"
									? " Хүргэгдэж байгаа"
									: restock.status === "arrived"
									? " - Ирсэн"
									: " - Татсан"
								: null)
						}`}
					</Link>
				}
				key={"foobar"}
				loading={fetchingRestockSingle}
				extra={[
					<>
						<Select
							style={{ width: 180 }}
							defaultValue={restock && restock.status}
							value={
								restock
									? restock.status === "new"
										? "Шинэ"
										: restock.status === "shipping"
										? "Хүргэгдэж байгаа"
										: restock.status === "arrived"
										? "Ирсэн"
										: "Татсан"
									: null
							}
							onChange={(value) => this.changeStatus(value)}
							disabled={restock.status === "stocked"}
						>
							{restock && restock.status ? (
								restock.status === "new" ? null : (
									<Option value={"new"} key={1}>
										Шинэ
									</Option>
								)
							) : null}
							{restock && restock.status ? (
								restock.status === "shipping" ? null : (
									<Option value={"shipping"} key={2}>
										Хүргэгдэж байгаа
									</Option>
								)
							) : null}
							{restock && restock.status ? (
								restock.status === "arrived" ? null : (
									<Option value={"arrived"} key={3}>
										Ирсэн
									</Option>
								)
							) : null}
							{/*{restock && restock.status ? (*/}
							{/*	restock.status === "stocked" ? null : (*/}
							{/*		<Option value={"stocked"} key={4}>*/}
							{/*			Татсан*/}
							{/*		</Option>*/}
							{/*	)*/}
							{/*) : null}*/}
						</Select>
						<Button
							key={"watkey"}
							type="primary"
							disabled={!this.state.newStatus}
							onClick={this.updateStatus.bind(this)}
							style={{ marginLeft: 10 }}
						>
							Хадгалах
						</Button>
					</>
				]}
			>
				<Table
					dataSource={(restock || {}).supplies}
					columns={columns}
					size={'small'}
				/>
				{modalSingle ? (
					<ModalRestockSingle item={this.state.item} orderID={_id} />
				) : null}
			</Card>
		);
	}
}

export default connect(reducer)(RestockSingle);
