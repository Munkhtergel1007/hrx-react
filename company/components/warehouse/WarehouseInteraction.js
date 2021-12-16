import React from "react";
import { connect } from "react-redux";
import { Card, Button, Modal, Form, Input, Popconfirm, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import config, { companyAdministrator } from "../../config";
import { PlusOutlined, EditOutlined, LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { locale } from "../../lang";
import Cookies from "js-cookie";
import NumberFormat from "react-number-format";
import ModalBodyProductInteraction from "./ModalBodyProductInteraction";
import {
	setInteractionSubProduct,
	getInteractionSubProduct,
	getWarehouseSingle
} from "../../actions/warehouse_actions";

const reducer = ({ main, warehouse }) => ({ main, warehouse });

class WarehouseInteraction extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: "",
			modal: false,
			sell: {}
		};
		this.changeParentState = this.changeParentState.bind(this);
	}
	componentDidMount() {
		const {
			dispatch,
			match: {
				params: { _id }
			},
			main: { employee },
			warehouse: { warehouse }
		} = this.props;
		if (!companyAdministrator(employee)) {
			if (Object.keys(warehouse || {}).length > 0) {
				if (
					!(warehouse.employees || []).some(
						(emp) =>
							(emp.emp || "as").toString() ===
							(employee._id || "").toString()
					)
				) {
					window.location.assign("/not-found");
				}
			} else {
				dispatch(getWarehouseSingle({ warehouseID: _id })).then((c) => {
					if (
						!(c.json.data?.employees || []).some(
							(emp) =>
								(emp.emp || "as").toString() ===
								(employee._id || "").toString()
						)
					) {
						window.location.assign("/not-found");
					}
				});
			}
		}
		dispatch(
			getInteractionSubProduct({
				company: this.props.main.company._id,
				warehouse: _id
			})
		);
		// dispatch(getSubAssets({ pageNum: 0, pageSize: 0 }));
	}
	changeParentState(e) {
		this.setState(e);
	}
	render() {
		const {
			warehouse: {
				loadingInteractionSubProducts,
				interactionSubProducts
			},
			match: {
				params: { _id }
			}
		} = this.props;
		function getTypeTag(e) {
			switch (e) {
				case "interGiven":
					return <Tag color={"geekblue"}>Авлага</Tag>;
				case "interTaken":
					return <Tag color={"purple"}>Өглөгө</Tag>;
				default:
					return <Tag>-</Tag>;
			}
		}
		function getStatusTag(e) {
			switch (e) {
				case "pending":
					return <Tag>Хүлээгдэж буй</Tag>;
				case "active":
					return <Tag color={"success"}>Дууссан</Tag>;
				default:
					return <Tag>-</Tag>;
			}
		}
		function getPaidTypeTag(e) {
			switch (e) {
				case "bill":
					return <Tag>Бэлэн</Tag>;
				case "card":
					return <Tag>Карт</Tag>;
				case "bankAccount":
					return <Tag>Байгууллагын данс</Tag>;
				default:
					return <Tag>-</Tag>;
			}
		}
		const columns = [
			{
				key: "_id",
				title: "№",
				render: (txt, record, idx) => idx + 1,
				width: 100
			},
			{
				title: locale("warehouse_single.product.base"),
				key: "product",
				render: (record) => (
					<>
						{record.product?.title ? (
							<div
								style={{ marginBottom: 10 }}
								key={`${record.product?._id}-${Math.random()}`}
							>
								{record.product?.title}
								{" > "}
								{(record.subAssets || []).map((subAsset) => (
									<Tag key={subAsset._id}>
										{subAsset.title}
									</Tag>
								))}
							</div>
						) : null}
						{record.description ? (
							<p style={{ marginBottom: 0 }}>
								{record.description}
							</p>
						) : null}
					</>
				)				
			},
			{
				title: locale("warehouse_int.priceGot"),
				key: "priceGot",
				dataIndex: "priceGot",
				render: (record) =>
					`${(record || "0")
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`,
				width: 150
			},
			{
				title: locale("warehouse_int.pricePull"),
				key: "priceSold",
				dataIndex: "priceSold",
				render: (record) =>
					`${(record || "0")
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₮`,
				width: 150
			},
			{
				title: locale("warehouse_int.priceStatus"),
				key: "paidType",
				dataIndex: "paidType",
				render: (record) => getPaidTypeTag(record),
				width: 120
			},
			{
				title: locale("common_warehouse.type"),
				key: "type",
				dataIndex: "type",
				render: (record) => getTypeTag(record),
				width: 80
			},
			{
				title: locale("common_warehouse.status"),
				key: "status",
				dataIndex: "status",
				render: (record) => getStatusTag(record),
				width: 120
			},
			{
				title: locale("common_warehouse.date"),
				key: "created",
				dataIndex: "created",
				render: (record) => moment(record).format("YYYY/MM/DD"),
				width: 120
			},
			{
				title: locale("common_warehouse.uildel"),
				key: "action",
				render: (record) =>
					record.status === "pending" ? (
						<Button
							onClick={() =>
								this.setState({ sell: record, modal: true })
							}
						>
							{locale("common_warehouse.change")}
						</Button>
					) : null,
				width: 120
			}
		];
		return (
			<>
				<Card
					title={
						<Link
							to={`/warehouse/${_id}`}
							style={{
								marginRight: 200,
								textDecoration: "underline"
							}}
						>
							<LeftOutlined style={{ marginRight: 5 }} />
							{locale("warehouse_single.give_take")}
						</Link>
					}
					key={"foobar"}
					loading={loadingInteractionSubProducts}
				>
					<Table
						size={"small"}
						dataSource={interactionSubProducts}
						columns={columns}
						rowKey={(record) => record._id}
						loading={loadingInteractionSubProducts}
						locale={{ emptyText: locale("common_warehouse.empty") }}
						pagination={false}
					/>
				</Card>
				<Modal
					width={700}
					visible={this.state.modal}
					title={locale("warehouse_single.product.base")}
					footer={null}
					onCancel={() =>
						this.setState({
							modal: false
						})
					}
					bodyStyle={{ padding: 0 }}
					destroyOnClose
				>
					{this.state.modal ? (
						<ModalBodyProductInteraction
							{...(this.state.sell || {})}
							changeParentState={this.changeParentState}
						/>
					) : null}
				</Modal>
			</>
		);
	}
}

export default connect(reducer)(WarehouseInteraction);
