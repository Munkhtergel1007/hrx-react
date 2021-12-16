import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Tag, Table, Space } from "antd";
import { getAllDetails } from "../../actions/warehouse_actions";
import moment from "moment";
import { locale } from "../../lang";
import Cookies from "js-cookie";
const reducer = ({ main, warehouse }) => ({ main, warehouse });

function formatThousands(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}
function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
}
function AllDetails(props) {
    const [search, setsearch] = useState([]);
    const [startingDate, setStartingDate] = useState(todaysDate());
    const [endingDate, setEndingDate] = useState(todaysDate());
    const {
        dispatch,
        warehouse: { allDetails, modalAllDetails },
        warehouseID
    } = props;
    useEffect(() => {
        dispatch(
            getAllDetails({
                warehouseID: warehouseID
            })
        );
    }, [modalAllDetails]);
    const seperatedSupplies = allDetails.seperatedSupplies || {};
    const incomingSP = [...(allDetails.subProducts || [])];
    const spColumns = [
        {
            key: "subProduct",
            title: locale("common_warehouse.subProduct"),
            render: (txt, record, idx) => {
                return (
                    <div>
                        {record?.product?.title}
                        {" > "}
                        {(record?.subAssets || []).map((subAsset) => (
                            <Tag
                                key={`${record._id}-${record?._id}-${subAsset._id}`}
                            >
                                {subAsset.title}
                            </Tag>
                        ))}
                    </div>
                );
            }
        },
        {
            key: "currentStock",
            title: locale("common_warehouse.currentStock"),
            render: (txt, record, idx) => {
                const deezSupplies = seperatedSupplies[record._id];
                let runningTotal = 0;
                if (deezSupplies) {
                    deezSupplies.forEach((supply) => {
                        runningTotal += supply.quantity;
                    });
                }
                return runningTotal + " ш";
            }
        },
        // {
        //     key: "initial_Q",
        //     title: "Ирсэн ш.",
        //     render: (txt, record, idx) => {
        //         const deezSupplies = seperatedSupplies[record._id];
        //         let runningTotal = 0;
        //         if (deezSupplies) {
        //             deezSupplies.forEach((supply) => {
        //                 runningTotal += supply.quantity_initial;
        //             });
        //         }
        //         return runningTotal + " ш";
        //     }
        // },
        {
            key: "cost",
            title: locale("common_warehouse.cost"),
            render: (txt, record, idx) => {
                const deezSupplies = seperatedSupplies[record._id];
                let lowestCost = 0;
                let highestCost = 0;
                if (deezSupplies) {
                    deezSupplies.forEach((supply) => {
                        if (lowestCost === 0) {
                            lowestCost = supply.cost;
                        }
                        if (supply.cost < lowestCost) {
                            lowestCost = supply.cost;
                        }
                        if (highestCost === 0) {
                            highestCost = supply.cost;
                        }
                        if (supply.cost > highestCost) {
                            highestCost = supply.cost;
                        }
                    });
                }
                if (lowestCost === highestCost) {
                    return formatThousands(lowestCost + "₮");
                } else {
                    return `${formatThousands(lowestCost)}₮ - ${formatThousands(
                        highestCost
                    )}₮`;
                }
            }
        },
        {
            key: "totalCost",
            title: locale("common_warehouse.costAll"),
            render: (txt, record, idx) => {
                const deezSupplies = seperatedSupplies[record._id];
                let runningTotal = 0;
                if (deezSupplies) {
                    deezSupplies.forEach((supply) => {
                        runningTotal += supply.cost * supply.quantity_initial;
                    });
                }
                return formatThousands(runningTotal + "₮");
            }
        },
        // {
        //     key: "soldQuantity",
        //     title: "Зарагдсан тоо ширхэг",
        //     render: (txt, record, idx) => {
        //         const deezSales = seperatedSales[record._id];
        //         let runningTotal = 0;
        //         if (deezSales) {
        //             deezSales.forEach((sale) => {
        //                 runningTotal += sale.quantity;
        //             });
        //         }
        //         return runningTotal + " ш";
        //     }
        // },
        {
            key: "_id",
            title: locale("common_warehouse.sellPrice"),
            render: (txt, record, idx) => {
                return formatThousands((record?.price || 0) + "₮");
            }
        },
        // {
        //     key: "soldAmount",
        //     title: "Зарагдсан байгаа дүн",
        //     render: (txt, record, idx) => {
        //         const deezSales = seperatedSales[record._id];
        //         console.log("deezSales", deezSales);
        //         let runningTotal = 0;
        //         if (deezSales) {
        //             deezSales.forEach((sale) => {
        //                 runningTotal += sale.price * sale.quantity;
        //             });
        //         }
        //         return formatThousands(runningTotal + "₮");
        //     }
        // },
        {
            key: "_id",
            title: locale("common_warehouse.sellPriceAll"),
            render: (txt, record, idx) => {
                const deezSupplies = seperatedSupplies[record._id];
                let runningTotal = 0;
                if (deezSupplies) {
                    deezSupplies.forEach((supply) => {
                        runningTotal +=
                            (record?.price || 0) * supply.quantity_initial;
                    });
                }
                return formatThousands(runningTotal + "₮");
            }
        }
    ];
    function expandedRowRender(record, idx) {
        const spSingleCols = [
            {
                key: "created",
                title: locale("common_warehouse.createdDate"),
                render: (txt, subRecord, idx) => {
                    return moment(subRecord.created).format("DD-MM-YYYY/HH:MM");
                }
            },
            {
                key: "quantityInit",
                title: locale("common_warehouse.stockGet"),
                render: (txt, subRecord, idx) => {
                    return subRecord.quantity_initial + "ш";
                }
            },
            {
                key: "quantity",
                title: locale("common_warehouse.currentStock"),
                render: (txt, subRecord, idx) => {
                    return subRecord.quantity + "ш";
                }
            },
            {
                key: "cost",
                title: locale("common_warehouse.cost"),
                render: (txt, subRecord, idx) => {
                    return formatThousands(subRecord.cost + "₮");
                }
            },
            {
                key: "totalCost",
                title: locale("common_warehouse.costAll"),
                render: (txt, subRecord, idx) => {
                    return formatThousands(
                        subRecord.cost * subRecord.quantity_initial + "₮"
                    );
                }
            }
        ];
        const spSupplies = seperatedSupplies[record._id];
        return (
            <Table
                columns={spSingleCols}
                dataSource={spSupplies || {}}
                pagination={false}
                rowKey={idx}
            />
        );
    }

    return (
        <Space direction="vertical">
            <Table
                size="small"
                bordered
                dataSource={incomingSP}
                columns={spColumns}
                expandable={{ expandedRowRender }}
                rowKey={(record) => record._id}
            />
        </Space>
    );
}

export default connect(reducer)(AllDetails);
