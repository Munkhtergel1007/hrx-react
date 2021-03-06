import React from "react";
import { connect } from "react-redux";
import {
	Modal,
	Form,
	Row,
	Col,
	InputNumber,
	Input,
	Select,
	Spin,
	Table,
	Button
} from "antd";
import { Link } from "react-router-dom";
import config from "../../config";
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import {
	submitRestock,
	toggleRestockModal,
	addItem,
	removeItem
} from "../../actions/restock_actions";
import { getProduct } from "../../actions/product_actions";
const reducer = ({ main, restock, product }) => ({ main, restock, product });
class ModalRestock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNum: 0,
			pageSize: 50,
			search: "",
			title: "",
			product: "",
			subProduct: "",
			quantity: "",
			cost: 0,
			name: "",
			typing: false,
			typingTimeout: 0
		};
	}
	componentDidMount() {
		const {
			dispatch,
			main: {
				company: { _id }
			}
		} = this.props;
	}
	toggleModal(mod) {
		const { dispatch } = this.props;
		dispatch(toggleRestockModal({ data: mod }));
	}
	addItem(e) {
		const {
			dispatch,
			main: {
				company: { _id }
			}
		} = this.props;
		let payload = {
			company: _id,
			subProduct: this.state.subProduct,
			quantity: this.state.quantity,
			cost: this.state.cost,
			name: this.state.name
		};
		this.setState({
			subProduct: null,
			quantity: null,
			cost: null,
			name: null
		});
		dispatch(addItem({ data: payload }));
		// dispatch(submitRestock(payload));
	}
	searchProduct(e) {
		const { dispatch } = this.props;
		if (this.state.typingTimeout) {
			clearTimeout(this.state.typingTimeout);
		}

		this.setState({
			title: e,
			typing: false,
			typingTimeout: setTimeout(() => {
				dispatch(
					getProduct({
						search: this.state.title
					})
				);
			}, 500)
		});
	}
	changeName(e) {
		this.setState({ name: e.children.join("") });
	}
	submitRestock() {
		const {
			dispatch,
			restock: { supplies }
		} = this.props;
		if (supplies && supplies.length > 0) {
			dispatch(submitRestock({ supplies: supplies }));
		} else {
			config.get("emitter").emit("warning", "???????????? ??????????");
		}
	}
	remove(e) {
		const { dispatch } = this.props;
		dispatch(removeItem({ data: e }));
	}
	render() {
		const columns = [
			{
				key: "_id",
				title: "???",
				render: (txt, record, idx) => idx + 1
			},
			{
				title: "??????????",
				key: "subProduct",
				render: (txt, record, idx) => {
					return (
						<div className="ayayayayaya" key={idx}>
							{record.name}
						</div>
					);
				}
			},
			{
				title: "????????????",
				dataIndex: "quantity",
				key: "quantity"
			},
			{
				title: "??/??????",
				dataIndex: "cost",
				key: "cost"
			},
			{
				title: "????????????",
				key: "hello",
				render: (txt, record, idx) => {
					return (
						<div
							className="ayayayayaya"
							onClick={() => this.remove(record.name)}
							key={idx}
							style={{ cursor: "pointer", color: "red" }}
						>
							<CloseCircleOutlined />
						</div>
					);
				}
			}
		];
		const {
			restock: {
				restocks,
				restock,
				submittingRestock,
				submitSuccess,
				modal,
				supplies
			},
			product: { products, loadingProducts }
		} = this.props;

		const { title, product, subProduct, quantity, cost } = this.state;
		return (
			<Modal
				title={`?????????? ???????????? ??????????`}
				visible={modal}
				onOk={this.submitRestock.bind(this)}
				onCancel={() => this.toggleModal(false)}
				okText="????????????????"
				cancelText="??????????"
				confirmLoading={submittingRestock}
				maskClosable={true}
				width={800}
				height={600}
				className="restock-modal"
			>
				<Table dataSource={supplies} columns={columns} />
				<Form>
					<Row>
						<Col span={12}>
							<Select
								value={this.state.subProduct}
								size={"small"}
								placeholder="?????????? ????????"
								notFoundContent={
									loadingProducts ? (
										<Spin size="small" />
									) : null
								}
								filterOption={false}
								onSearch={(e) => this.searchProduct(e)}
								onChange={(e) => {
									return this.setState({ subProduct: e });
								}}
								style={{
									width: "100%",
									marginTop: 5,
									marginRight: 5
								}}
								showSearch
								onSelect={(val, option) =>
									this.changeName(option)
								}
							>
								{products.map((d) =>
									d.child.map((subP) => {
										return (
											<Select.Option
												key={subP._id}
												value={subP._id}
											>
												{d.title} :{" "}
												{subP.subAssets
													.map((subA) => subA.title)
													.join("-")}
											</Select.Option>
										);
									})
								)}
							</Select>
						</Col>
						<Col span={6}>
							<Form.Item
								label="?????? ????????????"
								labelCol={{ span: 10 }}
							>
								<InputNumber
									maxLength={60}
									value={quantity}
									name="?????? ????????????"
									onChange={(e) => {
										this.setState({
											quantity: e
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label="??.??????" labelCol={{ span: 10 }}>
								<InputNumber
									maxLength={60}
									value={cost}
									name="??.??????"
									onChange={(e) => {
										this.setState({
											cost: e
										});
									}}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Button
					// style={{ float: "right" }}
					onClick={this.addItem.bind(this)}
					type="primary"
				>
					??????????
				</Button>
			</Modal>
		);
	}
}

export default connect(reducer)(ModalRestock);
