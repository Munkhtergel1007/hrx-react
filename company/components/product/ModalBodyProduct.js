import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
	Tabs,
	Card,
	Button,
	Modal,
	Form,
	Switch,
	Input,
	Row,
	Col,
	Popconfirm,
	InputNumber,
	Radio,
	List,
	Dropdown,
	Avatar,
	Menu,
	Select,
	Spin,
	Table,
	Divider,
	DatePicker,
	Tooltip,
	Tag,
	Collapse,
	Space,
	Skeleton,
	Empty
} from "antd";
import config from "../../config";
import {
	FileDoneOutlined,
	GiftOutlined,
	PlusOutlined,
	UsergroupAddOutlined,
	UserAddOutlined,
	DownOutlined,
	DeleteOutlined,
	EyeOutlined,
	EditFilled,
	DeleteFilled,
	CaretRightOutlined
} from "@ant-design/icons";
import moment from "moment";
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

import { getCategory } from "../../actions/category_actions";
import { getAsset } from "../../actions/asset_actions.js";
import * as actions from "../../actions/product_actions";

const reducer = ({ product, main }) => ({ product, main });

class ModalBodyProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			_id: this.props._id || "",
			assets: this.props.assets || [],
			category: this.props.category || {},
			subCategory: this.props.subCategory || {},
			title: this.props.title || ""
		};
	}
	componentDidMount() {}
	submitProduct() {
		const { title, category, subCategory, assets, _id } = this.state;
		if(!title) return config.get('emitter').emit('warning', 'Нэр оруулна уу.');
		if(!assets || assets.length === 0) return config.get('emitter').emit('warning', 'Нэмэлт талбар оруулна уу.');
		if(!category || Object.keys(category || {}).length === 0) return config.get('emitter').emit('warning', 'Ангилал оруулна уу.');
		if(!subCategory || Object.keys(subCategory || {}).length === 0) return config.get('emitter').emit('warning', 'Дэд ангилал оруулна уу.');
		this.props.dispatch(actions.submitProduct({title, category, subCategory, assets, _id})).then(c => {
			if(c.json.success){
				this.props.changeParentState({modalProduct: {}})
			}
		})
	}
	dealWithAssets(e){
		if((this.state.assets || []).some(asset => (asset._id || 'as').toString() === (e || '').toString())){
			this.setState({assets: (this.state.assets || []).filter(asset => (asset._id || 'as').toString() !== (e || '').toString())})
		}else{
			const {assets} = this.props.product;
			let found = {};
			(assets || []).map(asset => {
				if((asset._id || 'as').toString() === (e || '').toString()){
					found = asset;
				}
			})
			this.setState({assets: [...(this.state.assets || []), found]});
		}
	}
	dealWithCategories(e){
		const {categories} = this.props.product;
		let found = {};
		(categories || []).map(category => {
			if((category._id || 'as').toString() === (e || '').toString()){
				found = category;
			}
		})
		this.setState({category: found, subCategory: {}});
	}
	dealWithSubCategories(e){
		const {category} = this.state;
		let found = {};
		(category.child || []).map(subCategory => {
			if((subCategory._id || 'as').toString() === (e || '').toString()){
				found = subCategory;
			}
		})
		this.setState({subCategory: found});
	}
	render() {
		const {
			product: {
				categories,
				loadingCategory,
				assets,
				loadingAssets,
				products,
				loadingProducts,
				submitProductLoader
			}
		} = this.props;
		return (
			<>
				<div key={"modalBodyProduct-body]"} style={{ padding: 20 }}>
					<Form.Item label="Нэр" labelCol={{ span: 6 }}>
						<Input
							maxLength={60}
							value={this.state.title ? this.state.title : ""}
							name="title"
							onChange={(e) =>
								this.setState({ title: e.target.value })
							}
							allowClear
							autoComplete="off"
						/>
					</Form.Item>
					<Form.Item label="Нэмэлт талбар" labelCol={{ span: 6 }}>
						<Select
							loading={loadingAssets}
							value={(this.state.assets || []).map(asset => asset._id)}
							mode={"multiple"}
							onSelect={this.dealWithAssets.bind(this)}
							onDeselect={this.dealWithAssets.bind(this)}
							notFoundContent={'Нэмэлт талбар хоосон байна'}
							filterOption={(input, option) =>  
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
							// tagRender={(e) => 
							// 	<Tag key={e.value?._id} closable onClose={() => this.dealWithAssets(e.value?._id)}>
							// 		{e.value?.title}
							// 	</Tag>
							// }
						> {/* Selectiig goy bolgoh */}
							{(assets || []).map((asset) => (
								<Select.Option
									key={asset._id}
									value={asset._id}
								>
									{asset.title}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Ангилал" labelCol={{ span: 6 }}>
						<Select
							showSearch
							loading={loadingCategory}
							value={this.state.category?._id ? this.state.category?._id : ''}
							onSelect={this.dealWithCategories.bind(this)}
							notFoundContent={'Aнгилал хоосон байна'}
							filterOption={(input, option) =>  
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
						>
							{(categories || []).map((category) => (
								<Select.Option
									key={category._id}
									value={category._id}
								>
									{category.title}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					{
						Object.keys(this.state.category || {}).length > 0 ?
							<Form.Item label="Дэд ангилал" labelCol={{ span: 6 }}>
								<Select
									showSearch
									loading={loadingCategory}
									value={this.state.subCategory?._id ? this.state.subCategory?._id : ''}
									onSelect={this.dealWithSubCategories.bind(this)}
									notFoundContent={'Дэд ангилал хоосон байна'}
									filterOption={(input, option) =>  
										option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{(this.state.category?.child || []).map((category) => (
										<Select.Option
											key={category._id}
											value={category._id}
										>
											{category.title}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							:
							null
					}
				</div>
				<div
					key={"modalBodyProduct-buttons"}
					style={{
						borderTop: "1px solid #f0f0f0",
						padding: "10px 16px",
						textAlign: "right"
					}}
				>
					<Button
						onClick={() =>
							this.props.changeParentState?.({ modalProduct: {} })
						}
					>
						Болих
					</Button>
					<Button
						loading={submitProductLoader}
						style={{ marginLeft: 8 }}
						type={"primary"}
						onClick={() => this.submitProduct()}
					>
						{this.props._id ? "Засах" : "Нэмэх"}
					</Button>
				</div>
			</>
		);
	}
}

export default connect(reducer)(ModalBodyProduct);
