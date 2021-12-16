import React from "react";
import { connect } from "react-redux";
import { Button, Form, Popconfirm, Input, InputNumber, Select, Tag } from "antd";
import config from "../../config";
import { giveSubProduct } from "../../actions/warehouse_actions";
import { getWarehouses } from "../../actions/warehouse_actions";
import { locale } from "../../lang";
const reducer = ({ main, warehouse }) => ({ main, warehouse });

class ModalBodyProductGive extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedProduct: "",
			selectedSubProduct: "",
			warehouseSelected: "",
			quantity: 0
		};
	}
	componentDidMount() {
		const {
			dispatch,
			main: {
				company: { _id }
			},
			warehouse: { warehouses }
		} = this.props;
		if ((warehouses || []).length === 0)
			dispatch(getWarehouses({ companyID: _id }));
	}
	submitGive(e) {
		if (!(this.state.selectedProduct || "").trim())
			return config
				.get("emitter")
				.emit("warning", "Алдаатай мэдээлэл орсон байна.");
		if (!(this.state.selectedSubProduct || "").trim())
			return config
				.get("emitter")
				.emit("warning", "Бүтээгдэхүүг сонгоно уу.");
		if (!this.state.quantity || this.state.quantity <= 0)
			return config
				.get("emitter")
				.emit("warning", "Тоо ширхэгийг оруулна уу.");
		if (!this.state.warehouseSelected)
			return config
				.get("emitter")
				.emit("warning", "Агуулахыг оруулна уу.");
		this.props
			.dispatch(
				giveSubProduct({
					product: this.state.selectedProduct,
					subProduct: this.state.selectedSubProduct,
					subProductObj: e,
					quantity: this.state.quantity,
					warehouse: this.props.warehouseID,
					warehouseGiven: this.state.warehouseSelected,
				})
			)
			.then((c) => {
				if (c.json.success) {
					this.props.changeParentState?.({
						give: false
					});
				}
			});
	}
	selectSubProduct(e) {
		const {
			warehouse: { subProducts }
		} = this.props;
		let id = "";
		(subProducts || []).map((subProduct) => {
			if (
				(subProduct._id || "as").toString() === (e || "").toString()
			) {
				id = subProduct?.product?._id;
			}
		});
		this.setState({ selectedProduct: id, selectedSubProduct: e });
	}
	render() {
		const {
			warehouse: {
				giving,
				subProducts,
				loadingSupplies,
				fetchingWarehouses,
				warehouses
			}
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
				<div key={"modalBodyProductGive-body"} style={{ padding: 20 }}>
					<Form.Item label={locale("common_warehouse.product")} labelCol={{ span: 6 }}>
						<Select
							loading={loadingSupplies}
							value={this.state.selectedSubProduct}
							showSearch
							allowClear
							onClear={() =>
								this.setState({ selectedSubProduct: "" })
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
					<Form.Item label={locale("common_warehouse.warehouse")} labelCol={{ span: 6 }}>
						<Select
							value={this.state.warehouseSelected}
							onChange={(e) =>
								this.setState({ warehouseSelected: e })
							}
							loading={fetchingWarehouses}
						>
							{(warehouses || []).map((warehouseSingle) =>
								(warehouseSingle._id || "as").toString() !==
								(this.props.warehouseID || "").toString() ? (
									<Select.Option
										key={warehouseSingle._id}
										value={warehouseSingle._id}
									>
										{warehouseSingle.title}
									</Select.Option>
								) : null
							)}
						</Select>
					</Form.Item>
					<Form.Item label={locale("common_warehouse.unit")} labelCol={{ span: 6 }}>
						{/* <InputNumber
							style={{ width: 300 }}
							onChange={(e) => this.setState({ quantity: e })}
							value={this.state.quantity}
							min={0}
						/> */}
						<Input
							style={{ width: 300 }}
							type={"number"}
							onChange={(e) =>
								this.setState({ quantity: e.target.value })
							}
							max={subProduct?.quantity || 100}
							min={0}
							addonBefore={
								<span>{locale("common_warehouse.currentStock")} {subProduct?.quantity}</span>
							}
						/>
					</Form.Item>
				</div>
				<div
					key={"modalBodyProductGive-buttons"}
					style={{
						borderTop: "1px solid #f0f0f0",
						padding: "10px 16px",
						textAlign: "right"
					}}
				>
					<Button
						onClick={() =>
							this.props.changeParentState?.({
								give: false
							})
						}
					>
						{locale("common_warehouse.cancel")}
					</Button>
					<Popconfirm
						title={locale("warehouse_modal.askProduct")}
						onConfirm={() => this.submitGive(subProduct)}
						okText={locale("yes")}
						cancelText={locale("no")}>
						<Button
							loading={giving}
							style={{ marginLeft: 8 }}
							type={"primary"}
						>
							{locale("warehouse_modal.give")}
						</Button>
					</Popconfirm>
				</div>
			</>
		);
	}
}

export default connect(reducer)(ModalBodyProductGive);
