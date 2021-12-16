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
import config from "../../config";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
	submitRestock,
	toggleRestockModal,
	toggleRestockSingleModal,
	addItem,
	removeItem
} from "../../actions/restock_actions";
import { getWarehouses } from "../../actions/warehouse_actions";
import { getProduct } from "../../actions/product_actions";
import { distributeRestock } from "../../actions/restock_actions";
const reducer = ({ main, restock, warehouse }) => ({
	main,
	restock,
	warehouse
});
class ModalRestockSingle extends React.Component {
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
			typingTimeout: 0,
			maxQuant: 0,
			currentQuant: {},
			itemArr: [],
			orderID: "",
			disabled: []
		};
	}
	componentDidMount() {
		const {
			dispatch,
			main: {
				company: { _id }
			},
			item,
			orderID
		} = this.props;
		this.setState({ orderID: orderID });
		dispatch(getWarehouses({ companyID: _id }));
	}
	toggleModal(mod) {
		const { dispatch } = this.props;
		dispatch(toggleRestockSingleModal({ data: mod }));
	}
	async distribute() {
		const { item, orderID, dispatch } = this.props;
		const max = item.quantity;
		const nums = this.state.currentQuant;
		let sum = Object.values(nums).reduce((hold, a) => hold + a, 0);
		const subP = item.subProduct;
		if (sum !== max) {
			config.get("emitter").emit("warning", "Тоо ширхэг зөрж байна");
		} else {
			let payload = {
				order: orderID,
				subProduct: subP,
				cost: item.cost,
				supplies: []
			};
			for (const key of Object.keys(nums)) {
				payload.supplies.push({
					warehouse: key,
					quantity: nums[key]
				});
			}
			dispatch(distributeRestock(payload));
			// .then(() => {
			// 	window.location.reload(false);
			// });
		}
	}
	render() {
		const columns = [
			{
				key: "_id",
				title: "№",
				render: (txt, record, idx) => idx + 1
			},
			{
				title: "Агуулах",
				key: "subProduct",
				render: (txt, record, idx) => {
					return (
						<div className="ayayayayaya" key={idx}>
							{record.title}
						</div>
					);
				}
			},
			{
				title: "Ширхэг",
				key: "subProduct",
				render: (txt, record, idx) => {
					return (
						<InputNumber
							key={idx}
							min={0}
							defaultValue={0}
							value={this.state.currentQuant[idx]}
							onChange={(val) => {
								let temp = this.state.currentQuant;
								temp[record._id] = val;
								this.setState({ currentQuant: temp });
							}}
						></InputNumber>
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
				modalSingle,
				supplies
			},
			warehouse: { warehouses },
			item
		} = this.props;
		const { title, product, subProduct, quantity, cost } = this.state;
		return (
			<Modal
				title={
					item && item.name && item.quantity
						? item.name + " " + item.quantity + " ш"
						: "Бараа"
				}
				visible={modalSingle}
				onOk={this.distribute.bind(this)}
				onCancel={() => this.toggleModal(false)}
				okText="Хадгалах"
				cancelText="Болих"
				confirmLoading={submittingRestock}
				maskClosable={true}
				width={800}
				height={600}
				className="restock-modal"
			>
				<Table
					dataSource={warehouses}
					columns={columns}
					pagination={false}
					size={'small'}
				/>
			</Modal>
		);
	}
}

export default connect(reducer)(ModalRestockSingle);
