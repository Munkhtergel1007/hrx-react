import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Tag, Table, DatePicker, Space, Button, Row, Col } from "antd";
const { RangePicker } = DatePicker;
import config, { companyAdministrator, hasAction } from "../../config";
import { locale } from "../../lang";
import {
    getDetails,
    toggleDetailsModal
} from "../../actions/warehouse_actions";
import {
    PlusOutlined,
    MinusOutlined,
    EyeOutlined,
    ArrowUpOutlined,
    LeftOutlined
} from "@ant-design/icons";
import moment from "moment";
const reducer = ({ main, warehouse }) => ({ main, warehouse });

function formatThousands(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function ProductDetails(props) {
    const [search, setsearch] = useState(null);
    const {
        dispatch,
        warehouse: {
            currentProduct,
            details,
            loadingDetails,
            viewingSubProduct,
            modalDetails
        },
        main: { employee },
        warehouseID
    } = props;
    useEffect(() => {
        dispatch(
            getDetails({ subID: currentProduct._id, warehouseID: warehouseID })
        );
    }, [modalDetails]);
    const salesData = [...(details.sells || [])].filter(
        (item) => !item.priceGot || !item.priceSold
    );
    const supplyData = [...(details.supplies || [])];
    const saleColumns = [
        {
            key: "created",
            title: locale("common_warehouse.date"),
            render: (txt, record, idx) => {
                return moment(record.created).format("DD-MM-YYYY/HH:MM");
            }
        },
        {
            key: "_id",
            title: locale("common_warehouse.subProduct"),
            render: (txt, record, idx) => {
                return (
                    <div>
                        {currentProduct?.product?.title}
                        {" > "}
                        {(currentProduct?.subAssets || []).map((subAsset) => (
                            <Tag
                                key={`${currentProduct._id}-${currentProduct?._id}-${subAsset._id}`}
                            >
                                {subAsset.title}
                            </Tag>
                        ))}
                    </div>
                );
            }
        },
        {
            key: "quantity",
            title: locale("warehouseSale.soldQuan"),
            render: (txt, record, idx) => {
                return record.quantity + "ш";
            }
        },
        {
            key: "price",
            title:  locale("warehouseSale.soldPrice"),
            render: (txt, record, idx) => {
                return formatThousands(record.price + "₮");
            }
        },
        {
            key: "total",
            title: locale("warehouseSale.soldPriceAll"),
            render: (txt, record, idx) => {
                return formatThousands(record.quantity * record.price + "₮");
            }
        },
        {
            key: "supply",
            title:  locale("warehouseSale.supplyPrice"),
            render: (txt, record, idx) => {
                return formatThousands(record.supply.cost + "₮");
            }
        },
        {
            key: "_id",
            title: locale("warehouseSale.allTaken"),
            render: (txt, record, idx) => {
                return formatThousands(
                    record.supply.cost * record.quantity + "₮"
                );
            }
        },
        {
            key: "_id",
            title: locale("warehouseSale.profitQuan"),
            render: (txt, record, idx) => {
                return formatThousands(record.price - record.supply.cost) + "₮";
            }
        },
        {
            key: "_id",
            title: locale("warehouseSale.profit"),
            render: (txt, record, idx) => {
                return (
                    formatThousands(
                        record.quantity * record.price -
                            record.supply.cost * record.quantity
                    ) + "₮"
                );
            }
        }
    ];
    const supplyColumns = [
        {
            key: "created",
            title: locale("common_warehouse.date"),
            render: (txt, record, idx) => {
                return moment(record.created).format("DD-MM-YYYY/HH:MM");
            }
        },
        {
            key: "_id",
            title: locale("common_warehouse.subProduct"),
            render: (txt, record, idx) => {
                return (
                    <div>
                        {currentProduct?.product?.title}
                        {" > "}
                        {(currentProduct?.subAssets || []).map((subAsset) => (
                            <Tag
                                key={`${currentProduct._id}-${currentProduct?._id}-${subAsset._id}`}
                            >
                                {subAsset.title}
                            </Tag>
                        ))}
                    </div>
                );
            }
        },
        {
            key: "quantity_initial",
            title: locale("warehouseSale.pullQuan"),
            render: (txt, record, idx) => {
                return record.quantity_initial + "ш";
            }
        },
        {
            key: "quantity",
            title: locale("common_warehouse.currentStock"),
            render: (txt, record, idx) => {
                return record.quantity + "ш";
            }
        },
        {
            key: "cost",
            title:locale("warehouseSale.pullQuanPrice"),
            render: (txt, record, idx) => {
                return formatThousands(record.cost + "₮");
            }
        }
    ];
    function searchByDate() {
        const [start, end] = search;
        if (start && end) {
            dispatch(
                getDetails({
                    subID: currentProduct._id,
                    warehouseID: warehouseID,
                    start: start,
                    end: end
                })
            );
        }
    }
    function onSelectDate(date, dateString) {
        setsearch(dateString);
    }
    function renderFooter() {
        const total = details.sells.reduce((acc, cur) => {
            return acc + cur.price * cur.quantity;
        }, 0);
        const costs = details.sells.reduce((acc, cur) => {
            return acc + cur.supply.cost * cur.quantity;
        }, 0);
        const profit = total - costs;
        return (
            <Row>
                <Col span={8}>
                    <h3>{locale("warehouseSale.proIncome")} {formatThousands(total + "₮")}</h3>
                </Col>
                <Col span={8}>
                    <h3>{locale("warehouseSale.proPrice")}: {formatThousands(costs + "₮")}</h3>
                </Col>
                <Col span={8}>
                    <h3>{locale("warehouseSale.proProfit")}: {formatThousands(profit + "₮")}</h3>
                </Col>
            </Row>
        );
    }
    return (
        <>
            <Space direction="vertical">
                <Space>
                    <RangePicker
                        onChange={onSelectDate}
                        placeholder={[locale("common_warehouse.start"), locale("common_warehouse.end")]}
                    />
                    <Button onClick={searchByDate} size="small" type="default">
                        {locale("common_warehouse.search")}
                    </Button>
                </Space>
                <Table
                    title={() => locale("common_warehouse.pullPros")}
                    bordered
                    dataSource={supplyData}
                    columns={supplyColumns}
                />
                <Table
                    title={() => locale("common_warehouse.soldPros")}
                    bordered
                    dataSource={salesData}
                    columns={saleColumns}
                />
                {details && Object.keys(details).length > 0 && renderFooter()}
            </Space>
        </>
    );
}

export default connect(reducer)(ProductDetails);
