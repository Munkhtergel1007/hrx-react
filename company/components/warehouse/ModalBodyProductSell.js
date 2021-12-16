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
import { locale } from "../../lang";
import config from "../../config";
import { sellSubProduct } from "../../actions/warehouse_actions";
const reducer = ({ main, warehouse }) => ({ main, warehouse });

class ModalBodyProductSell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedProduct: this.props.selectedProduct || "",
			selectedSubProduct: this.props.selectedSubProduct || "",
			quantity: 0,
			price: 0,
			type: "sold",
			priceGot: 0,
			priceSold: 0,
			description: "",
			paidType: "bill"
		};
	}
	submitSellRequest(prod) {
		if (this.state.type === "sold") {
			if (!(this.state.selectedProduct || "").trim())
				return config
					.get("emitter")
					.emit("warning", locale("warehouse_modal.priceBought"));
			if (!(this.state.selectedSubProduct || "").trim())
				return config
					.get("emitter")
					.emit("warning", locale("warehouse_modal.priceSold"));
			if (!this.state.quantity || this.state.quantity <= 0)
				return config
					.get("emitter")
					.emit("warning", locale("warehouse_modal.fillQuan"));
			if (!this.state.price)
				return config
					.get("emitter")
					.emit("warning", locale("warehouse_modal.fillPrice"));
		} else if (
			this.state.type === "interGiven" ||
			this.state.type === "interTaken"
		) {
			if (
				// !(this.state.selectedSubProduct || "").trim() &&
				!(this.state.description || "").trim()
			)
				return config
					.get("emitter")
					.emit(
						"warning",
						locale("warehouse_modal.rqrExp")
					);
		}
		if (!this.state.paidType)
			return config
				.get("emitter")
				.emit("warning", locale("warehouse_modal.rqrPayType"));
		this.props
			.dispatch(
				sellSubProduct({
					product: this.state.selectedProduct,
					subProduct: this.state.selectedSubProduct,
					subProductObj: prod,
					quantity: this.state.quantity,
					warehouse: this.props.warehouseID,
					price: this.state.price,
					type: this.state.type,
					priceSold: this.state.priceSold,
					priceGot: this.state.priceGot,
					description: this.state.description,
					paidType: this.state.paidType
				})
			)
			.then((c) => {
				if (c.json.success) {
					this.props.changeParentState?.({
						modal: false,
						selectedSubProduct: ""
					});
				}
			});
	}
	selectSubProduct(e) {
		const {
			warehouse: { subProducts }
		} = this.props;
		let id = "",
			price = 0;
		(subProducts || []).map((subProduct) => {
			if ((subProduct._id || "as").toString() === (e || "").toString()) {
				id = subProduct?.product?._id;
				price = subProduct?.price;
			}
		});
		this.setState({
			selectedProduct: id,
			selectedSubProduct: e,
			price: price
		});
	}
	render() {
		const {
			warehouse: { selling, subProducts, loadingSupplies }
		} = this.props;
		let subProduct = {};
		if (this.state.selectedSubProduct) {
			(subProducts || []).map((subProd) => {
				if (
					(subProd._id || "as").toString() ===
					(this.state.selectedSubProduct || "").toString()
				) {
					subProduct = subProd;
				}
			});
		}
		return (
			<>
				<div
					key={"modalBodyProductSell-body"}
					style={{ padding: "0 20px 20px 20px" }}
				>
					<Tabs
						activeKey={this.state.type}
						onChange={(e) => this.setState({ type: e })}
						size={"small"}
					>
						<Tabs.TabPane key={"sold"} tab={locale("warehouse_modal.sell")}>
							<Form.Item
								label={locale("common_warehouse.product")}
								labelCol={{ span: 6 }}
							>
								<Select
									loading={loadingSupplies}
									value={this.state.selectedSubProduct}
									showSearch
									allowClear
									onClear={() =>
										this.setState({
											selectedSubProduct: ""
										})
									}
									onSelect={(e) => this.selectSubProduct(e)}
									notFoundContent={locale("warehouse_modal.productNF")}
									filterOption={(input, option) =>
										option.children[0]
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
								>
									{subProducts?.map((subProduct) => (
										<Select.Option
											value={subProduct._id}
											key={subProduct._id}
										>
											{subProduct?.product?.title}
											{" > "}
											{(subProduct.subAssets || []).map(
												(subAsset) => (
													<Tag
														key={`${subProduct._id}-${subAsset._id}`}
													>
														{subAsset.title}
													</Tag>
												)
											)}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item label={locale("common_warehouse.unitPrice")} labelCol={{ span: 6 }}>
								<InputNumber
									style={{ width: 300 }}
									onChange={(e) =>
										this.setState({ price: e })
									}
									value={this.state.price}
									formatter={(value) =>
										`₮ ${value}`.replace(
											/\B(?=(\d{3})+(?!\d))/g,
											"'"
										)
									}
									min={0}
								/>
							</Form.Item>
							<Form.Item label={locale("common_warehouse.unit")} labelCol={{ span: 6 }}>
								{/* <InputNumber
							// style={{width: 500}}
							onChange={(e) => this.setState({ quantity: e })}
							value={this.state.quantity}
							max={subProduct?.quantity || 100}
							min={0}
							addonBefore={
								<span>Үлдсэн: {subProduct?.quantity}</span>
							}
						/> */}
								<Input
									style={{ width: 300 }}
									type={"number"}
									onChange={(e) =>
										this.setState({
											quantity: e.target.value
										})
									}
									max={subProduct?.quantity || 100}
									min={0}
									addonBefore={
										<span>
											{locale("common_warehouse.left")}: {subProduct?.quantity}
										</span>
									}
								/>
							</Form.Item>
							<Form.Item
								label={locale("payType.base")}
								labelCol={{ span: 6 }}
							>
								<Select
									style={{ width: 300 }}
									value={this.state.paidType}
									onChange={(e) =>
										this.setState({ paidType: e })
									}
								>
									<Select.Option key={"bill"} value={"bill"}>
										{locale("payType.cash")}
									</Select.Option>
									<Select.Option key={"card"} value={"card"}>
									{locale("payType.card")}
									</Select.Option>
									<Select.Option
										key={"bankAccount"}
										value={"bankAccount"}
									>
											{locale("payType.bankAccount1")}
									</Select.Option>
									<Select.Option
										key={"bankAccountOther"}
										value={"bankAccountOther"}
									>
										{locale("payType.bankAccount2")}
									</Select.Option>
									<Select.Option
										key={"loan"}
										value={"loan"}
									>
										{locale("payType.loan")}
									</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item label={locale("common_warehouse.explanation")} labelCol={{ span: 6 }}>
								<Input.TextArea
									value={this.state.description}
									onChange={(e) =>
										this.setState({
											description: e.target.value
										})
									}
								/>
							</Form.Item>
						</Tabs.TabPane>
						{/* <Tabs.TabPane key={"interGiven"} tab={"Авлага"}>
							<Form.Item
								label="Бүтээгдэхүүн"
								labelCol={{ span: 6 }}
							>
								<Select
									loading={loadingSupplies}
									value={this.state.selectedSubProduct}
									showSearch
									allowClear
									onClear={() =>
										this.setState({
											selectedSubProduct: ""
										})
									}
									onSelect={(e) => this.selectSubProduct(e)}
									notFoundContent={"Бүтээгдэхүүн олдсонгүй"}
									filterOption={(input, option) =>
										option.children[0]
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
								>
									{subProducts?.map((subProduct) => (
										<Select.Option
											value={subProduct._id}
											key={subProduct._id}
										>
											{subProduct?.product?.title}
											{" > "}
											{(subProduct.subAssets || []).map(
												(subAsset) => (
													<Tag
														key={`${subProduct._id}-${subAsset._id}`}
													>
														{subAsset.title}
													</Tag>
												)
											)}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item label={"Тайлбар"} labelCol={{ span: 6 }}>
								<Input.TextArea
									value={this.state.description}
									onChange={(e) =>
										this.setState({
											description: e.target.value
										})
									}
								/>
							</Form.Item>
							<Form.Item
								label="Авсан мөнгө"
								labelCol={{ span: 6 }}
							>
								<InputNumber
									style={{ width: 300 }}
									onChange={(e) =>
										this.setState({ priceGot: e })
									}
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
							<Form.Item
								label="Татсан мөнгө"
								labelCol={{ span: 6 }}
							>
								<InputNumber
									style={{ width: 300 }}
									onChange={(e) =>
										this.setState({ priceSold: e })
									}
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
								label={"Төлсөн хэлбэр"}
								labelCol={{ span: 6 }}
							>
								<Select
									style={{ width: 300 }}
									value={this.state.paidType}
									onChange={(e) =>
										this.setState({ paidType: e })
									}
								>
									<Select.Option key={"bill"} value={"bill"}>
										Бэлэн
									</Select.Option>
									<Select.Option key={"card"} value={"card"}>
										Карт
									</Select.Option>
									<Select.Option
										key={"bankAccount"}
										value={"bankAccount"}
									>
										Байгууллагын данс
									</Select.Option>
								</Select>
							</Form.Item>
						</Tabs.TabPane> */}
						<Tabs.TabPane key={"interTaken"} tab={locale("common_warehouse.given")}>
							<Form.Item
								label={locale("common_warehouse.product")}
								labelCol={{ span: 6 }}
							>
								{/* <Select
									loading={loadingSupplies}
									value={this.state.selectedSubProduct}
									showSearch
									allowClear
									onClear={() =>
										this.setState({
											selectedSubProduct: ""
										})
									}
									onSelect={(e) => this.selectSubProduct(e)}
									notFoundContent={"Бүтээгдэхүүн олдсонгүй"}
									filterOption={(input, option) =>
										option.children[0]
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
								>
									{subProducts?.map((subProduct) => (
										<Select.Option
											value={subProduct._id}
											key={subProduct._id}
										>
											{subProduct?.product?.title}
											{" > "}
											{(subProduct.subAssets || []).map(
												(subAsset) => (
													<Tag
														key={`${subProduct._id}-${subAsset._id}`}
													>
														{subAsset.title}
													</Tag>
												)
											)}
										</Select.Option>
									))}
								</Select> */}
							</Form.Item>
							<Form.Item label={locale("common_warehouse.explanation")} labelCol={{ span: 6 }}>
								<Input.TextArea
									value={this.state.description}
									onChange={(e) =>
										this.setState({
											description: e.target.value
										})
									}
								/>
							</Form.Item>
							<Form.Item
								label={locale("common_warehouse.proPrice")}
								labelCol={{ span: 6 }}
							>
								<InputNumber
									style={{ width: 300 }}
									onChange={(e) =>
										this.setState({ priceGot: e })
									}
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
							<Form.Item
								label={locale("warehouse_int.pricePull")}
								labelCol={{ span: 6 }}
							>
								<InputNumber
									style={{ width: 300 }}
									onChange={(e) =>
										this.setState({ priceSold: e })
									}
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
								label={locale("payType.base")}
								labelCol={{ span: 6 }}
							>
								<Select
									style={{ width: 300 }}
									value={this.state.paidType}
									onChange={(e) =>
										this.setState({ paidType: e })
									}
								>
									<Select.Option key={"bill"} value={"bill"}>
									{locale("payType.cash")}
									</Select.Option>
									<Select.Option key={"card"} value={"card"}>
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
						</Tabs.TabPane>
					</Tabs>
				</div>
				<div
					key={"modalBodyProductSell-buttons"}
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
								selectedSubProduct: ""
							})
						}
					>
						{locale("common_warehouse.cancel")}
					</Button>
					<Popconfirm
						title={`Барааг ${
							this.state.type === "sold" ? locale("warehouse_modal.sell") : locale("common_warehouse.save")
						} уу?`}
						onConfirm={() => this.submitSellRequest(subProduct)}
						okText={"Тийм"}
						cancelText={"Үгүй"}
					>
						<Button
							loading={selling}
							style={{ marginLeft: 8 }}
							type={"primary"}
						>
							{this.state.type === "sold" ? locale("warehouse_modal.sell") : locale("common_warehouse.save")}
						</Button>
					</Popconfirm>
				</div>
			</>
		);
	}
}

export default connect(reducer)(ModalBodyProductSell);
