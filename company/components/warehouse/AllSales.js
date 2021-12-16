import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    Tag,
    Table,
    DatePicker,
    Space,
    Button,
    Tabs,
    Select,
    Row,
    Col
} from "antd";
const { Option } = Select;
import { locale } from "../../lang"
import Cookies from "js-cookie";;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
import { getAllDetails } from "../../actions/warehouse_actions";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
const reducer = ({ main, warehouse }) => ({ main, warehouse });

function paymentTypeMongolian(paymentType) {
    switch (paymentType) {
        case "card":
            return locale("payType.card");
        case "bill":
            return locale("payType.cash");
        case "bankAccount":
            return locale("payType.bankAccount");
        case "bankAccountOther":
            return locale("payType.bankAccount2");
        case "loan":
            return locale("payType.loan");
        case locale("payType.all"):
        default:
            return "Сонгоогүй";
    }
}
function formatThousands(num) {
    function isFloat(num) {
        return num % 1 !== 0;
    }
    if (isFloat(num)) {
        return num
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    } else {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }
}

function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
}

function AllSales(props) {
    const [search, setsearch] = useState([]);
    const [startingDate, setStartingDate] = useState(todaysDate());
    const [endingDate, setEndingDate] = useState(todaysDate());
    const [filter, setFilter] = useState("");
    const {
        dispatch,
        warehouse: { currentProduct, allDetails },
        main: { employee },
        warehouseID
    } = props;
    useEffect(() => {
        dispatch(
            getAllDetails({
                warehouseID: warehouseID,
                start: startingDate,
                end: endingDate,
                paymentType: filter
            })
        );
    }, []);
    const salesData = [...(allDetails.sells || [])];
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
            title:  locale("common_warehouse.subProduct"),
            render: (txt, record, idx) => {
                return (
                    <div>
                        {record?.product?.title}
                        {" > "}
                        {(record?.subProduct?.subAssets || []).map(
                            (subAsset) => (
                                <Tag
                                    key={`${record._id}-${record?._id}-${subAsset._id}`}
                                >
                                    {subAsset.title}
                                </Tag>
                            )
                        )}
                    </div>
                );
            }
        },
        {
            key: "lend",
            title:  locale("common_warehouse.type"),
            render: (txt, record, idx) => {
                return record.type === "sold"
                    ? "Зарсан"
                    : record.type === "interTaken"
                    ? "Өглөгө"
                    : "Авлага";
            }
        },
        {
            key: "paymentType",
            title: locale("payType.base"),
            render: (txt, record, idx) => {
                return paymentTypeMongolian(record.paidType);
            }
        },
        {
            key: "quantity",
            title: locale("warehouseSale.soldQuan"),
            render: (txt, record, idx) => {
                return (record.quantity || 0) + "ш";
            }
        },
        {
            key: "price",
            title:  locale("warehouseSale.soldQuanPrice"),
            render: (txt, record, idx) => {
                if (record.type === "interTaken")
                    return formatThousands(record.priceSold) + "₮";
                else return formatThousands(record.price) + "₮";
            }
        },
        {
            key: "supply",
            title:  locale("warehouseSale.supplyPrice"),
            render: (txt, record, idx) => {
                if (record.type !== "interTaken")
                    return formatThousands(record.supply.cost) + "₮";
                else return formatThousands(record.priceGot) + "₮";
            }
        },
        {
            key: "_id",
            title:  locale("warehouseSale.profitQuan"),
            render: (txt, record, idx) => {
                if (record.type === "interTaken")
                    return (
                        formatThousands(record.priceSold - record.priceGot) +
                        "₮"
                    );
                else
                    return (
                        formatThousands(
                            record.price - (record.supply?.cost || 0)
                        ) + "₮"
                    );
            }
        },
        {
            key: "total",
            title:  locale("common_warehouse.allIncome"),
            render: (txt, record, idx) => {
                if (record.type === "interTaken")
                    return formatThousands(record.priceSold) + "₮";
                else
                    return (
                        formatThousands(record.quantity * record.price) + "₮"
                    );
            }
        },
        {
            key: "_id",
            title:  locale("warehouseSale.allTaken"),
            render: (txt, record, idx) => {
                if (record.type === "interTaken")
                    return formatThousands(record.priceGot * 1) + "₮";
                else
                    return (
                        formatThousands(record.supply.cost * record.quantity) +
                        "₮"
                    );
            }
        },

        {
            key: "_id",
            title:  locale("warehouseSale.pureProfit"),
            render: (txt, record, idx) => {
                if (record.type === "sold")
                    return (
                        formatThousands(
                            record.quantity * record.price -
                                record.supply.cost * record.quantity
                        ) + "₮"
                    );
                else
                    return (
                        formatThousands(record.priceSold - record.priceGot) +
                        "₮"
                    );
            }
        }
    ];
    function searchByDate() {
        const [start, end] = search;
        if (startingDate && endingDate) {
            dispatch(
                getAllDetails({
                    warehouseID: warehouseID,
                    start: startingDate,
                    end: endingDate,
                    paymentType: filter
                })
            );
        }
    }
    function renderFooter() {
        const income = salesData.reduce((acc, curr) => {
            return (
                acc + (curr.quantity || 1) * (curr.price || curr.priceSold || 0)
            );
        }, 0);
        console.log("salesData", salesData);
        const costs = salesData.reduce((acc, curr) => {
            return (
                acc +
                (curr.type === "interTaken"
                    ? curr.priceGot
                    : curr.supply.cost * curr.quantity)
            );
        }, 0);
        console.log("costsare", costs);
        const profit = income - costs;
        // seperate salesData by paidType
        const paidType = salesData.reduce(
            (acc, curr) => {
                if (acc[curr.paidType]) {
                    acc[curr.paidType].push(curr);
                } else {
                    acc[curr.paidType] = [curr];
                }
                return acc;
            },
            {
                bill: [],
                card: [],
                bankAccount: [],
                bankAccountOther: [],
                loan: []
            }
        );
        function getIncome(type) {
            return (paidType[type] || []).reduce((acc, curr) => {
                return (
                    acc +
                    (curr.type === "interTaken"
                        ? curr.priceSold
                        : curr.price * curr.quantity)
                );
            }, 0);
        }
        function getCosts(type) {
            return (paidType[type] || []).reduce((acc, curr) => {
                return (
                    acc +
                    (curr.type === "interTaken"
                        ? curr.priceGot
                        : curr.supply.cost * curr.quantity)
                );
            }, 0);
        }
        function getProfit(income, costs) {
            console.log("income", income, "socts", costs);
            return income - (costs || 0);
        }
        const incomes = {
            bill: getIncome("bill"),
            card: getIncome("card"),
            bankAccount: getIncome("bankAccount"),
            bankAccountOther: getIncome("bankAccountOther"),
            loan: getIncome("loan"),
            undefined: getIncome("undefined")
        };
        const costsObj = {
            bill: getCosts("bill"),
            card: getCosts("card"),
            bankAccount: getCosts("bankAccount"),
            bankAccountOther: getCosts("bankAccountOther"),
            loan: getCosts("loan"),
            undefined: getCosts("undefined")
        };
        const profits = {
            bill: getProfit(incomes.bill, costsObj.bill),
            card: getProfit(incomes.card, costsObj.card),
            bankAccount: getProfit(incomes.bankAccount, costsObj.bankAccount),
            bankAccountOther: getProfit(
                incomes.bankAccountOther,
                costsObj.bankAccountOther
            ),
            loan: getProfit(incomes.loan, costsObj.loan),
            undefined: getProfit(incomes.undefined, costsObj.undefined)
        };
        const summaryCols = [
            {
                key: "name",
                title: locale("payType.base"),
                render: (txt, record, idx) => {
                    return paymentTypeMongolian(record);
                }
            },
            {
                key: "totalIncome",
                title: locale("common_warehouse.allIncome"),
                render: (txt, record, idx) => {
                    return formatThousands(incomes[record] || 0) + "₮";
                }
            },
            {
                key: "totalCost",
                title: locale("warehouseSale.allTaken"),
                render: (txt, record, idx) => {
                    return formatThousands(costsObj[record] || 0) + "₮";
                }
            },
            {
                key: "totalProfit",
                title: locale("common_warehouse.allProfit"),
                render: (txt, record, idx) => {
                    return formatThousands(profits[record] || 0) + "₮";
                }
            }
        ];
        function renderSummary() {
            return (
                <div>
                    <span style={{ margin: "0px 20px" }}>
                        {locale("warehouseSale.income")} :
                        {formatThousands(
                            Object.values(incomes).reduce((acc, curr) => {
                                return acc + curr;
                            }, 0)
                        )}{" "}
                        ₮
                    </span>
                    <span style={{ margin: "0px 20px" }}>
                        {locale("warehouseSale.taken")}  :
                        {formatThousands(
                            Object.values(costsObj).reduce((acc, curr) => {
                                return acc + curr;
                            }, 0)
                        )}{" "}
                        ₮
                    </span>
                    <span style={{ margin: "0px 20px" }}>
                        {locale("warehouseSale.profit")}  :
                        {formatThousands(
                            Object.values(profits).reduce((acc, curr) => {
                                return acc + curr || 0;
                            }, 0)
                        )}{" "}
                        ₮
                    </span>
                </div>
            );
        }
        return (
            <Table
                dataSource={Object.keys(paidType)}
                columns={summaryCols}
                footer={renderSummary}
            />
        );
    }
    return (
        <Space direction="vertical">
            <Space>
                <Select
                    style={{ width: 200 }}
                    size="small"
                    onChange={(e) => setFilter(e)}
                    value={filter}
                >
                    <Option key={1} value="">
                        {locale("payType.all")} 
                    </Option>
                    <Option key={2} value="bill">
                        {locale("payType.cash")} 
                    </Option>
                    <Option key={3} value="card">
                        {locale("payType.card")} 
                    </Option>
                    <Option key={4} value="bankAccount">
                        {locale("payType.bankAccount1")} 
                    </Option>
                    <Option key={5} value="bankAccountOther">
                        {locale("payType.bankAccount2")} 
                    </Option>
                    <Option key={6} value="loan">
                        {locale("payType.loan")} 
                    </Option>
                </Select>
                <RangePicker
                    onChange={(dateString, dateValue) => {
                        setStartingDate(dateValue[0]);
                        setEndingDate(dateValue[1]);
                    }}
                    placeholder={["Эхлэх", "Дуусах"]}
                    size="small"
                    value={
                        startingDate && endingDate
                            ? [moment(startingDate), moment(endingDate)]
                            : null
                    }
                />
                <Button onClick={searchByDate} size="small" type="default">
                {locale("common_warehouse.search")} 
                </Button>
            </Space>
            <Table
                size="small"
                bordered
                dataSource={salesData}
                columns={saleColumns}
                rowKey={(record) => record._id}
                title={renderFooter}
            />
        </Space>
    );
}

export default connect(reducer)(AllSales);
