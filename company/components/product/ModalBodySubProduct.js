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

class ModalBodySubProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			_id: this.props._id || "",
			subAssets: this.props.subAssets || [],
			product: this.props.productSingle || {},
			price: this.props.price || 0,
		};
	}
	componentDidMount() {}
	submitSubProduct() {
		const { product, subAssets, _id, price } = this.state;
		if(!subAssets || (subAssets || []).length === 0) return config.get('emitter').emit('warning', 'Дэд нэмэлт талбар оруулна уу.');
		this.props.dispatch(actions.submitSubProduct({product, _id, subAssets, price})).then(c => {
			if(c.json.success){
				this.props.changeParentState({modalSubProduct: {}})
			}
		})
	}
	dealWithSubAssets(e){
		if((this.state.subAssets || []).some(subAsset => (subAsset._id || 'as').toString() === (e || '').toString())){
			this.setState({subAssets: (this.state.subAssets || []).filter(subAsset => (subAsset._id || 'as').toString() !== (e || '').toString())})
		}else{
			const {assets} = this.props.product;
			let found = {};
			(assets || []).map(asset => {
				(asset.child || []).map(subAsset => {
					if((subAsset._id || 'as').toString() === (e || '').toString()){
						found = subAsset;
					}
				})
			})
			this.setState({subAssets: [...(this.state.subAssets || []), found]});
		}
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
				submitSubProductLoader
			}
		} = this.props;
		return (
			<>
				<div key={"modalBodyProduct-body]"} style={{ padding: 20 }}>
					<Form.Item label={'Бүтээгдэхүүн'} labelCol={{ span: 6 }}>
						<Input 
							value={this.state.product?.title}
							readOnly bordered={false}
							style={{cursor: 'default'}}
						/>
					</Form.Item>
					<Form.Item label="Дэд нэмэлт талбар" labelCol={{ span: 6 }} wrapperCol={{span: 18}}>
						<Select
							loading={loadingAssets}
							value={(this.state.subAssets || []).map(asset => asset._id)}
							mode={"multiple"}
							onSelect={this.dealWithSubAssets.bind(this)}
							onDeselect={this.dealWithSubAssets.bind(this)}
							notFoundContent={'Дэд нэмэлт талбар хоосон байна'}
							filterOption={(input, option) =>  
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
							tagRender={(props) => {
								const { label, value, closable, onClose } = props;
								const { assets } = this.props.product;
								const onPreventMouseDown = event => {
									event.preventDefault();
									event.stopPropagation();
								};
								let parent = {};
								(assets || []).map(asset => {
									(asset.child || []).map(subAsset => {
										if((subAsset._id || 'as').toString() === (value || '').toString()){
											parent = asset;
										}
									})
								})
								return (
									<Tag
										onMouseDown={onPreventMouseDown}
										closable={closable}
										onClose={onClose}
										style={{ marginRight: 3 }}
									>
										{`${parent.title || '-'} > ${label}`}
									</Tag>
								);
							}}
						>
							{assets?.map(r =>
								(this.state.product?.assets || []).some(prod => (prod._id || 'as').toString() === (r._id || '').toString()) && r.child && r.child.length>0 ?
									<React.Fragment key={`${r._id}_option`}>
										<Option disabled value={r._id} key={`${r._id}_option_multi`}>{r.title}</Option>
										{r.child.map(c =>
											<Option value={c._id} key={`${c._id}_child
											`}>{c.title}</Option>
										)}
									</React.Fragment>
									:
									null
							)}
						</Select>
					</Form.Item>
					<Form.Item label={'Зарах үнэ'} labelCol={{ span: 6 }}>
						<InputNumber
							style={{width: 350}}
							value={this.state.price}
							formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
							onChange={(e) => this.setState({price: e})}
							min={0}
						/>
					</Form.Item>
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
							this.props.changeParentState?.({ modalSubProduct: {} })
						}
					>
						Болих
					</Button>
					<Button
						loading={submitSubProductLoader}
						style={{ marginLeft: 8 }}
						type={"primary"}
						onClick={() => this.submitSubProduct()}
					>
						{this.props._id ? "Засах" : "Нэмэх"}
					</Button>
				</div>
			</>
		);
	}
}

export default connect(reducer)(ModalBodySubProduct);
