import React from "react";
import { connect } from "react-redux";
import {
	Button,
	Form,
	Input,
	Popconfirm,
	InputNumber,
	Select,
	Tag,
	Tabs
} from "antd";
import config from "../../config";
import { locale } from "../../lang";
import { setInteractionSubProduct } from "../../actions/warehouse_actions";
const reducer = ({ main, warehouse }) => ({ main, warehouse });

class ModalBodyProductInteraction extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			priceSold: this.props.priceSold || 0,
			priceGot: this.props.priceGot || 0,
			paidType: this.props.paidType || 'bill',
		};
	}
	submit() {
		let self = this;
		if (!this.state.priceSold)
			return config
				.get("emitter")
				.emit("warning", locale("warehouse_modal.priceBought"));
		if (!this.state.priceGot)
			return config
				.get("emitter")
				.emit("warning", locale("warehouse_modal.priceSold"));
		if (!this.state.paidType)
			return config
				.get("emitter")
				.emit("warning", locale("warehouse_modal.paidType"));
		this.props.dispatch(setInteractionSubProduct({
			priceSold: this.state.priceSold,
			priceGot: this.state.priceGot,
			_id: this.props._id,
			paidType: this.state.paidType
		})).then(c => {
			if(c.json.success){
				self.props.changeParentState?.({
					modal: false,
					sell: {}
				})
			}
		});
	}
	render() {
		const {
			warehouse: { submittingInteractionSubProduct, subProducts }
		} = this.props;
		return (
			<>
				<div
					key={"ModalBodyProductInteraction-body"}
					style={{ padding: "20px" }}
				>
					{
						this.props.product ? 
							<Form.Item label={locale("common_warehouse.product")} labelCol={{ span: 6 }}>
								{this.props.product?.title}
								{" > "}
								{(this.props.subAssets || []).map((subAsset) => (
									<Tag
										key={`${this.props?.subProduct._id}-${subAsset._id}`}
									>
										{subAsset.title}
									</Tag>
								))}
							</Form.Item>
							:
							null
					}
					<Form.Item label={locale("warehouse_modal.explanation")} labelCol={{ span: 6 }}>
						<Input.TextArea
							value={this.props.description}
							disabled={true}
						/>
					</Form.Item>
					<Form.Item label={locale("warehouse_int.priceGot")} labelCol={{ span: 6 }}>
						<InputNumber
							style={{ width: 300 }}
							onChange={(e) => this.setState({ priceGot: e })}
							value={this.state.priceGot}
							formatter={(value) =>
								`₮ ${value}`.replace(
									/\B(?=(\d{3})+(?!\d))/g,
									"'"
								)
							}
							min={0}
						/>
					</Form.Item>
					<Form.Item label={locale("warehouse_int.pricePull")} labelCol={{ span: 6 }}>
						<InputNumber
							style={{ width: 300 }}
							onChange={(e) => this.setState({ priceSold: e })}
							value={this.state.priceSold}
							formatter={(value) =>
								`₮ ${value}`.replace(
									/\B(?=(\d{3})+(?!\d))/g,
									"'"
								)
							}
							min={0}
						/>
					</Form.Item>
					<Form.Item
						label={locale("warehouse_int.paidStatus")}
						labelCol={{ span: 6 }}
					>
						<Select
							style={{ width: 300 }}
							value={this.state.paidType}
							onChange={(e) =>
								this.setState({ paidType: e })
							}
						>
							<Select.Option
								key={"bill"}
								value={"bill"}
							>
								{locale("payType.cash")}
							</Select.Option>
							<Select.Option
								key={"card"}
								value={"card"}
							>
								{locale("payType.card")}
							</Select.Option>
							<Select.Option
								key={"bankAccount"}
								value={"bankAccount"}
							>
								{locale("payType.bankAccount1")}
							</Select.Option>
						</Select>
					</Form.Item>
				</div>
				<div
					key={"ModalBodyProductInteraction-buttons"}
					style={{
						borderTop: "1px solid #f0f0f0",
						padding: "10px 16px",
						textAlign: "right"
					}}
				>
					<Button
						onClick={() =>
							this.props.changeParentState?.({
								modal: false,
								sell: {}
							})
						}
					>
						{locale("common_warehouse.cancel")}
					</Button>
					<Popconfirm
						title={`Барааг дуусгах уу?`}
						onConfirm={() => this.submit()}
						okText={"Тийм"}
						cancelText={"Үгүй"}
					>
						<Button
							loading={submittingInteractionSubProduct}
							style={{ marginLeft: 8 }}
							type={"primary"}
						>
							{locale("common_warehouse.finish")}
						</Button>
					</Popconfirm>
				</div>
			</>
		);
	}
}

export default connect(reducer)(ModalBodyProductInteraction);
