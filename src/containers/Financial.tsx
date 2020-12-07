import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { cloneDeep, get, uniqBy } from 'lodash';
import { Table, Button, Tabs, Radio, List } from 'antd';

import CustomAgGridReact from 'components/CustomAgGridReact';

import { v4 as uuidv4 } from 'uuid';

import {
    getYearlyFinancialInfo,
    getQuarterlyFinancialInfo,
    getLastestFinancialInfo,
    getLastestFinancialReports,
} from 'reducers/stocks';
import {
    getYearlyFinancialInfoUpdateUrl,
    getQuarterlyFinancialInfoUpdateUrl,
    getLastestFinancialInfoUpdateUrl,
    getLastestFinancialReportsNameUpdateUrl,
    getLastestFinancialReportsValueUpdateUrl
} from 'utils/request';
import { BILLION_UNIT } from 'utils/unit';
import { LATEST_FINANCIAL_REPORTS, formatNumber, mapDataLatestFinancialReport } from 'utils/common'
import { getLastestFinancialReportsColumnDefs } from 'utils/columnDefs';
import { IStock, IAnalysisType } from 'types'


const { TabPane } = Tabs;

interface IProps {
    selectedSymbol: number,
    stocks: IStock,
    getYearlyFinancialInfo: any,
    getQuarterlyFinancialInfo: any,
    getLastestFinancialInfo: any,
    getLastestFinancialReports: any,
    symbol: string,

}

interface IState {
    YearlyFinancialInfoArray: any,
    QuarterlyFinancialInfoArray: any,
    LastestFinancialReportsArray: any,
    isFinancialReports: boolean,
    period: string,
    lastestFinancialReportsType: string,
    LastestFinancialInfoObj: any,
    analysisType: IAnalysisType,
    hide: boolean,
}

class Financial extends React.Component<IProps, IState> {
    gridApi: any;
    gridColumnApi: any;
    xxx: any;

    constructor(props) {
        super(props);
        this.state = {
            YearlyFinancialInfoArray: [],
            QuarterlyFinancialInfoArray: [],
            LastestFinancialReportsArray: [],
            isFinancialReports: true,
            period: 'quarterly',
            lastestFinancialReportsType: LATEST_FINANCIAL_REPORTS.TYPE_2,
            LastestFinancialInfoObj: {},
            analysisType: null,
            hide: false
        }
        this.xxx = []
    }

    componentDidMount() {
        this.crawlData();
        this.getLastestFinancialReports()
    }

    componentDidUpdate(preProps) {
        if (this.props.selectedSymbol !== preProps.selectedSymbol) {
            if (this.state.isFinancialReports) {
                this.setState({
                    LastestFinancialReportsArray: []
                })
                this.getLastestFinancialReports()
            } else {
                this.crawlData();
            }
        }
    }

    crawlData = async () => {
        try {
            const symbol = this.props.symbol;
            const res1 = await this.props.getYearlyFinancialInfo(symbol)
            const YearlyFinancialInfoArray = res1.data
            const res2 = await this.props.getQuarterlyFinancialInfo(symbol)
            const QuarterlyFinancialInfoArray = res2.data
            const res3 = await this.props.getLastestFinancialInfo(symbol)
            const LastestFinancialInfoObj = res3.data
            if (YearlyFinancialInfoArray && QuarterlyFinancialInfoArray && LastestFinancialInfoObj) {
                this.setState({
                    YearlyFinancialInfoArray,
                    QuarterlyFinancialInfoArray,
                    LastestFinancialInfoObj
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    getLastestFinancialReports = async () => {
        const { lastestFinancialReportsType } = this.state;
        let type_index = 1
        switch (lastestFinancialReportsType) {
            case LATEST_FINANCIAL_REPORTS.TYPE_1:
                type_index = 1
                break;
            case LATEST_FINANCIAL_REPORTS.TYPE_2:
                type_index = 2
                break;
            case LATEST_FINANCIAL_REPORTS.TYPE_3:
                type_index = 3
                break;
            case LATEST_FINANCIAL_REPORTS.TYPE_4:
                type_index = 4
                break;
            default:
                break;
        }
        const quarter = this.state.period === 'quarterly' ? 4 : 0
        const year = 2020
        try {
            const res = await this.props.getLastestFinancialReports({ financialType: type_index, year, quarter, symbol: this.props.symbol })
            this.setState({
                LastestFinancialReportsArray: res.data
            })
        } catch (error) {
            console.log(error)
        }
    }

    mapDataRevenueTable = (data, data2, isProfit) => {
        if (!data || !data2) return []
        const result = [];

        const keys = uniqBy(data.map(i => i.Year)).sort((a, b) => a - b)
        for (let j = 1; j < keys.length + 1; j++) {
            const itemObj = {}
            for (let i = 0; i < data.length; i++) {
                const item = data[i]
                if (item.Quarter === j) {

                    itemObj['Quarter'] = j
                    for (let k = 0; k < keys.length; k++) {
                        if (item.Year === keys[k]) {
                            if (isProfit) {
                                itemObj[keys[k]] = (item.ProfitAfterTax_MRQ / BILLION_UNIT).toFixed(2)
                            } else {
                                itemObj[keys[k]] = (item.NetSales_MRQ / BILLION_UNIT).toFixed(2)
                            }
                        }
                    }
                }
            }
            result.push(itemObj)
        }
        const indexTotal = isProfit ? 'ProfitAfterTax' : 'Sales';
        const obj: any = { 'Quarter': 'total' };
        keys.map(i => obj[i] = data2.filter(item => item.Year === i).length && (data2.filter(item => item.Year === i)[0][indexTotal] / BILLION_UNIT).toFixed(2))
        result.push(obj)
        return result
    }

    handleOpenFinancialReports = () => {
        this.setState({
            isFinancialReports: true
        }, () => {
            this.getLastestFinancialReports()
        })
    }

    handleCloseFinancialReports = () => {
        this.setState({
            isFinancialReports: false
        }, () => {
            this.crawlData();
        })
    }

    handleChangeLastestFinancialReportsType = (index) => {
        this.setState({
            lastestFinancialReportsType: index,
            LastestFinancialReportsArray: []
        }, () => {
            this.getLastestFinancialReports()
        })

    }

    handlePeriod = e => {
        this.setState({ period: e.target.value }, () => {
            this.getLastestFinancialReports()
        });
    };

    updateLatestFinancialInfo = (symbol, resolve = null) => {
        if (!symbol) return
        axios({
            method: 'put',
            url: getLastestFinancialInfoUpdateUrl(symbol)
        })
            .then(response => {
                console.log(response)
                if (response.data) {
                    resolve && resolve(response.data)
                }
            })
            .catch(error => {
                console.log(error)
                resolve && resolve(error)
            })
    }

    updateLatestFinancialInfoPartial = (start, count) => {
        const listPromises = [];
        const arr = cloneDeep(Object.values(this.props.stocks));
        arr.splice(start, count)
        arr.forEach(item => {
            item.Symbol && listPromises.push(
                new Promise(resolve => {
                    this.updateLatestFinancialInfo(item.Symbol, resolve);
                })
            );
        });

        return Promise.all(listPromises)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    updateLatestFinancialInfoAll = async () => {
        await this.updateLatestFinancialInfoPartial(0, 500);
        await this.updateLatestFinancialInfoPartial(500, 500);
        await this.updateLatestFinancialInfoPartial(1000, 1000);
    }

    updateYearlyFinancialInfo = (symbol, resolve = null) => {
        if (!symbol) return
        axios({
            method: 'put',
            url: getYearlyFinancialInfoUpdateUrl(symbol)
        })
            .then(response => {
                console.log(response)
                if (response.data) {
                    resolve && resolve(response.data)
                }
            })
            .catch(error => {
                console.log(error)
                resolve && resolve(error)
            })
    }

    updateYearlyFinancialInfoPartial = (start, count) => {
        const listPromises = [];
        const arr = cloneDeep(Object.values(this.props.stocks));
        arr.splice(start, count)
        arr.forEach(item => {
            item.Symbol && listPromises.push(
                new Promise(resolve => {
                    this.updateYearlyFinancialInfo(item.Symbol, resolve);
                })
            );
        });

        return Promise.all(listPromises)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    updateYearlyFinancialInfoAll = async () => {
        await this.updateYearlyFinancialInfoPartial(0, 500);
        await this.updateYearlyFinancialInfoPartial(500, 500);
        await this.updateYearlyFinancialInfoPartial(1000, 1000);
    }

    updateQuarterlyFinancialInfo = (symbol, resolve = null) => {
        if (!symbol) return
        axios({
            method: 'put',
            url: getQuarterlyFinancialInfoUpdateUrl(symbol)
        })
            .then(response => {
                console.log(response)
                if (response.data) {
                    resolve && resolve(response.data)
                }
            })
            .catch(error => {
                console.log(error)
                resolve && resolve(error)
            })
    }

    updateQuarterlyFinancialInfoPartial = (start, count) => {
        const listPromises = [];
        const arr = cloneDeep(Object.values(this.props.stocks));
        arr.splice(start, count)
        arr.forEach(item => {
            item.Symbol && listPromises.push(
                new Promise(resolve => {
                    this.updateQuarterlyFinancialInfo(item.Symbol, resolve);
                })
            );
        });

        return Promise.all(listPromises)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    updateQuarterlyFinancialInfoAll = async () => {
        await this.updateQuarterlyFinancialInfoPartial(0, 500);
        await this.updateQuarterlyFinancialInfoPartial(500, 500);
        await this.updateQuarterlyFinancialInfoPartial(1000, 1000);
    }

    updateLastestFinancialReportsName = (symbol, type) => {
        axios({
            method: 'put',
            url: getLastestFinancialReportsNameUpdateUrl(symbol, type)
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    updateLastestFinancialReportsNameAll = () => {
        const listSymbols = [
            'ACB',
            'ABI',
            'AGR',
            'E1VFVN30',
            'FPT'
        ]
        listSymbols.forEach(item => {
            [1, 2, 3, 4].forEach(index => {
                this.updateLastestFinancialReportsName(item, index)
            })
        })
    }

    updateLastestFinancialReportsValue = (symbol, resolve = null) => {
        if (!symbol) return
        const { period } = this.state;
        axios({
            method: 'put',
            // url: getLastestFinancialReportsValueUpdateUrl(symbol, 1, 2019, period === 'quarterly' ? 4 : 0, period === 'quarterly' ? 32 : 8)
            url: getLastestFinancialReportsValueUpdateUrl(symbol, 1, 2020, period === 'quarterly' ? 4 : 0, period === 'quarterly' ? 4 : 0)
        })
            .then(response => {
                console.log(response)
                if (response.data) {
                    resolve && resolve(response.data)
                }
            })
            .catch(error => {
                console.log(error)
                resolve && resolve(error)
            })

        axios({
            method: 'put',
            // url: getLastestFinancialReportsValueUpdateUrl(symbol, 2, 2019, period === 'quarterly' ? 4 : 0, period === 'quarterly' ? 32 : 8)
            url: getLastestFinancialReportsValueUpdateUrl(symbol, 2, 2020, period === 'quarterly' ? 4 : 0, period === 'quarterly' ? 4 : 0)
        })
            .then(response => {
                console.log(response)
                if (response.data) {
                    resolve && resolve(response.data)
                }
            })
            .catch(error => {
                console.log(error)
                resolve && resolve(error)
            })

        axios({
            method: 'put',
            // url: getLastestFinancialReportsValueUpdateUrl(symbol, 3, 2019, period === 'quarterly' ? 4 : 0, period === 'quarterly' ? 32 : 8)
            url: getLastestFinancialReportsValueUpdateUrl(symbol, 3, 2020, period === 'quarterly' ? 4 : 0, period === 'quarterly' ? 4 : 0)
        })
            .then(response => {
                console.log(response)
                if (response.data) {
                    resolve && resolve(response.data)
                }
            })
            .catch(error => {
                console.log(error)
                resolve && resolve(error)
            })

        axios({
            method: 'put',
            // url: getLastestFinancialReportsValueUpdateUrl(symbol, 4, 2019, period === 'quarterly' ? 4 : 0, period === 'quarterly' ? 32 : 8)
            url: getLastestFinancialReportsValueUpdateUrl(symbol, 4, 2020, period === 'quarterly' ? 4 : 0, period === 'quarterly' ? 4 : 0)
        })
            .then(response => {
                console.log(response)
                if (response.data) {
                    resolve && resolve(response.data)
                }
            })
            .catch(error => {
                console.log(error)
                resolve && resolve(error)
            })
    }

    updateLastestFinancialReportsValuePartial = (start, count) => {
        const listPromises = [];
        const arr = cloneDeep(Object.values(this.props.stocks));
        const arr1 = arr.slice(start, count)
        arr1.forEach(item => {
            item.Symbol && listPromises.push(
                new Promise(resolve => {
                    this.updateLastestFinancialReportsValue(item.Symbol, resolve);
                })
            );
        });

        return Promise.all(listPromises)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    updateLastestFinancialReportsValueAll = async () => {
        await this.updateLastestFinancialReportsValuePartial(0, 100);
        await this.updateLastestFinancialReportsValuePartial(100, 200);
        await this.updateLastestFinancialReportsValuePartial(200, 300);
        await this.updateLastestFinancialReportsValuePartial(300, 400);
        await this.updateLastestFinancialReportsValuePartial(400, 500);
        await this.updateLastestFinancialReportsValuePartial(500, 600);
        await this.updateLastestFinancialReportsValuePartial(600, 700);
        await this.updateLastestFinancialReportsValuePartial(700, 800);
        await this.updateLastestFinancialReportsValuePartial(800, 900);
        await this.updateLastestFinancialReportsValuePartial(900, 1000);
        await this.updateLastestFinancialReportsValuePartial(1000, 1100);
        await this.updateLastestFinancialReportsValuePartial(1100, 1200);
        await this.updateLastestFinancialReportsValuePartial(1200, 1300);
        await this.updateLastestFinancialReportsValuePartial(1300, 1400);
        await this.updateLastestFinancialReportsValuePartial(1400, 1500);
        await this.updateLastestFinancialReportsValuePartial(1500, 1600);
        await this.updateLastestFinancialReportsValuePartial(1600, 1700);
        await this.updateLastestFinancialReportsValuePartial(1700, 1800);
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    };

    // RENDER PART

    renderRevenueTable = (isProfit = false) => {
        const columns = [
            {
                title: 'Quarter',
                render: (params) => {
                    return 'Quy ' + params.Quarter
                }
            }
        ];

        const { QuarterlyFinancialInfoArray, YearlyFinancialInfoArray } = this.state;
        const mappedData = this.mapDataRevenueTable(QuarterlyFinancialInfoArray, YearlyFinancialInfoArray, isProfit);
        const keys = uniqBy(QuarterlyFinancialInfoArray.map(i => i.Year)).sort((a, b) => a - b)
        keys.map(i => {
            const pushObj = {
                title: String(i),
                render: (params) => {
                    return formatNumber((Number(params[i]) || 0).toFixed(0))
                }
            }
            columns.push(pushObj)
        })
        return <Table dataSource={mappedData} columns={columns} pagination={false} />
    }

    renderRevenueQuarterChart = (isProfit = false) => {
        const index = isProfit ? 'ProfitAfterTax_MRQ' : 'NetSales_MRQ'
        const { QuarterlyFinancialInfoArray } = this.state;
        const data = cloneDeep(QuarterlyFinancialInfoArray).map(item => {
            item[index] = (item[index] / BILLION_UNIT).toFixed(2)
            item.Name = `Q${item.Quarter} ${item.Year}`
            return item
        }).sort((a, b) => {
            return a.Year !== b.Year ? a.Year - b.Year : a.Quarter - b.Quarter
        }).reverse().slice(0, 5).reverse()
        return null
        // return (
        // <div className="Financial-revenue-quarter-chart-container">
        //     <BarChart
        //         width={400}
        //         height={300}
        //         data={data}
        //         margin={{
        //             // top: 50, right: 30, left: 20, bottom: 5,
        //         }}
        //     >
        //         {/* <CartesianGrid strokeDasharray="3 3" /> */}
        //         <XAxis dataKey="Name" />
        //         <YAxis />
        //         <Tooltip />
        //         <Legend />
        //         <Bar dataKey={index} fill="lightblue" barSize={30} />
        //     </BarChart>
        // </div>

        // )
    }

    renderRevenueYearChart = (isProfit = false) => {
        const index = isProfit ? 'ProfitAfterTax' : 'Sales'
        const { YearlyFinancialInfoArray } = this.state;
        const data = cloneDeep(YearlyFinancialInfoArray).map(item => {
            item[index] = (Number(item[index]) / BILLION_UNIT).toFixed(0)
            return item
        }).sort((a, b) => a.Year - b.Year)
        return null
        // return (
        // <div className="Financial-revenue-year-chart-container">

        //     <BarChart
        //         width={400}
        //         height={300}
        //         data={data}
        //         margin={{
        //             // top: 50, right: 30, left: 20, bottom: 5,
        //         }}
        //     >
        //         {/* <CartesianGrid strokeDasharray="3 3" /> */}
        //         <XAxis dataKey="Year" />
        //         <YAxis />
        //         <Tooltip />
        //         <Legend />
        //         <Bar dataKey={index} fill="lightblue" barSize={30} />
        //     </BarChart>
        // </div>
        // )
    }

    renderLastestFinancialReports = () => {
        const { LastestFinancialReportsArray, period, lastestFinancialReportsType, analysisType } = this.state;
        return <CustomAgGridReact
            height="1000px"
            columnDefs={getLastestFinancialReportsColumnDefs(period, lastestFinancialReportsType, analysisType, LastestFinancialReportsArray)}
            onGridReady={this.onGridReady}
            rowData={mapDataLatestFinancialReport(LastestFinancialReportsArray, null, lastestFinancialReportsType)}
        />
    }

    renderEvaluation = () => {
        const { LastestFinancialInfoObj } = this.state;
        const dataEvaluation = [
            {
                'title': 'P/E',
                'detail': (Number(LastestFinancialInfoObj.PE) || 0).toFixed(2)
            },
            {
                'title': 'P/S',
                'detail': (Number(LastestFinancialInfoObj.PS) || 0).toFixed(2)
            },
            {
                'title': 'P/B',
                'detail': (Number(LastestFinancialInfoObj.PB) || 0).toFixed(2)
            },
            {
                'title': 'EPS',
                'detail': (Number(LastestFinancialInfoObj.EPS) || 0).toFixed(2)
            }
        ]
        return (
            <div>
                <List
                    header={<div>ĐỊNH GIÁ</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={dataEvaluation}
                    renderItem={item => (
                        <List.Item key={uuidv4()}>
                            <div className="row">
                                <div>{item.title}</div>
                                <div>{item.detail}</div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }

    renderFinancialPower = () => {
        const { LastestFinancialInfoObj } = this.state;

        const dataFinancialPower = [
            {
                'title': 'Thanh toán nhanh',
                'detail': (Number(LastestFinancialInfoObj.QuickRatio) || 0).toFixed(2)
            },
            {
                'title': 'Thanh toán hiện hành',
                'detail': (Number(LastestFinancialInfoObj.CurrentRatio) || 0).toFixed(2)
            },
            {
                'title': 'Tổng nợ/Vốn CSH',
                'detail': (Number(LastestFinancialInfoObj.TotalDebtOverEquity) || 0).toFixed(2)
            },
            {
                'title': 'Tổng nợ/Tổng tài sản',
                'detail': (Number(LastestFinancialInfoObj.TotalDebtOverAssets) || 0).toFixed(2)
            }
        ]
        return (
            <div>
                <List
                    header={<div>SỨC MẠNH TÀI CHÍNH</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={dataFinancialPower}
                    renderItem={item => (
                        <List.Item key={uuidv4()}>
                            <div className="row">
                                <div>{item.title}</div>
                                <div>{item.detail}</div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }

    renderRunningAbility = () => {
        const { LastestFinancialInfoObj } = this.state;

        const dataRunningAbility = [
            {
                'title': 'Vòng quay tổng tài sản',
                'detail': (Number(LastestFinancialInfoObj.TotalAssetsTurnover) || 0).toFixed(2)
            },
            {
                'title': 'Vòng quay hàng tồn kho',
                'detail': (Number(LastestFinancialInfoObj.InventoryTurnover) || 0).toFixed(2)
            },
            {
                'title': 'Vòng quay các khoản phải thu',
                'detail': (Number(LastestFinancialInfoObj.ReceivablesTurnover) || 0).toFixed(2)
            }
        ]
        return (
            <div>
                <List
                    header={<div>KHẢ NĂNG HOẠT ĐỘNG</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={dataRunningAbility}
                    renderItem={item => (
                        <List.Item key={uuidv4()}>
                            <div className="row">
                                <div>{item.title}</div>
                                <div>{item.detail}</div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }

    renderMakeProfitAbility = () => {
        const { LastestFinancialInfoObj } = this.state;

        const dataMakeProfitAbility = [
            {
                'title': 'Tỷ lệ lãi gộp',
                'detail': `${((Number(LastestFinancialInfoObj.GrossMargin) || 0) * 100).toFixed(2)}%`
            },
            {
                'title': 'Tỷ lệ lãi từ hoạt động KD',
                'detail': `${((Number(LastestFinancialInfoObj.OperatingMargin) || 0) * 100).toFixed(2)}%`
            },
            {
                'title': 'Tỷ lệ EBIT',
                'detail': `${((Number(LastestFinancialInfoObj.EBITMargin) || 0) * 100).toFixed(2)}%`
            },
            {
                'title': 'Tỷ lệ lãi ròng',
                'detail': `${((Number(LastestFinancialInfoObj.NetProfitMargin) || 0) * 100).toFixed(2)}%`
            }
        ]
        return (
            <div>
                <List
                    header={<div>KHẢ NĂNG SINH LỢI</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={dataMakeProfitAbility}
                    renderItem={item => (
                        <List.Item key={uuidv4()}>
                            <div className="row">
                                <div>{item.title}</div>
                                <div>{item.detail}</div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }

    renderManagement = () => {
        const { LastestFinancialInfoObj } = this.state;

        const dataManagement = [
            {
                'title': 'ROA',
                'detail': `${((Number(LastestFinancialInfoObj.ROA) || 0) * 100).toFixed(2)}%`
            },
            {
                'title': 'ROE',
                'detail': `${((Number(LastestFinancialInfoObj.ROE) || 0) * 100).toFixed(2)}%`
            },
            {
                'title': 'ROIC',
                'detail': `${((Number(LastestFinancialInfoObj.ROIC) || 0) * 100).toFixed(2)}%`
            }
        ]
        return (
            <div>
                <List
                    header={<div>KHẢ NĂNG SINH LỢI</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={dataManagement}
                    renderItem={item => (
                        <List.Item key={uuidv4()}>
                            <div className="row">
                                <div>{item.title}</div>
                                <div>{item.detail}</div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }

    render() {
        const { period, isFinancialReports } = this.state;
        const { selectedSymbol, stocks, symbol: symbolProps } = this.props;
        const symbol = symbolProps || (stocks[selectedSymbol] || {}).Symbol
        if (isFinancialReports) {
            return (
                <div className="Financial bg-white">
                    <div style={{ width: '100%' }}>
                        <div className="flex flex-sp-bt">
                            <div>
                                <div className="header">
                                    Bao cao tai chinh
                                    <Button onClick={this.handleCloseFinancialReports}>Chi tieu tai chinh</Button>
                                </div>
                                <div>
                                    <Radio.Group value={period} onChange={this.handlePeriod}>
                                        <Radio.Button value="quarterly">Hang quy</Radio.Button>
                                        <Radio.Button value="yearly">Hang nam</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <Button disabled={true} onClick={this.updateLastestFinancialReportsNameAll}>LastestFinancialReportsName</Button>
                                </div>
                                <div>
                                    <Button disabled={false} onClick={() => this.updateLastestFinancialReportsValue(symbol)}>LastestFinancialReportsValue</Button>
                                    <Button disabled={false} onClick={this.updateLastestFinancialReportsValueAll}>Update all</Button>
                                </div>
                            </div>
                        </div>

                        <div className="Financial-reports">
                            <Tabs defaultActiveKey="1" onChange={this.handleChangeLastestFinancialReportsType}>
                                <TabPane tab={LATEST_FINANCIAL_REPORTS.TYPE_2} key={LATEST_FINANCIAL_REPORTS.TYPE_2}>
                                    {this.renderLastestFinancialReports()}
                                </TabPane>
                                <TabPane tab={LATEST_FINANCIAL_REPORTS.TYPE_1} key={LATEST_FINANCIAL_REPORTS.TYPE_1}>
                                    {this.renderLastestFinancialReports()}
                                </TabPane>
                                <TabPane tab={LATEST_FINANCIAL_REPORTS.TYPE_3} key={LATEST_FINANCIAL_REPORTS.TYPE_3}>
                                    {this.renderLastestFinancialReports()}
                                </TabPane>
                                <TabPane tab={LATEST_FINANCIAL_REPORTS.TYPE_4} key={LATEST_FINANCIAL_REPORTS.TYPE_4}>
                                    {this.renderLastestFinancialReports()}
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="Financial flex">
                <div className="Financial-left-container">
                    <div className="Financial-revenue bg-white">
                        <div className="flex flex-sp-bt">
                            <div className="header">
                                DOANH THU (TỶ)
                                <Button onClick={this.handleOpenFinancialReports}>Bao cao tai chinh</Button>
                            </div>
                            <div>
                                <div>
                                    <Button disabled={true} onClick={() => this.updateYearlyFinancialInfo(symbol)}>YearlyFinancialInfo</Button>
                                    <Button disabled={true} onClick={this.updateYearlyFinancialInfoAll}>Update all</Button>
                                </div>
                                <div>
                                    <Button disabled={true} onClick={() => this.updateQuarterlyFinancialInfo(symbol)}>QuarterlyFinancialInfo</Button>
                                    <Button disabled={true} onClick={this.updateQuarterlyFinancialInfoAll}>Update all</Button>
                                </div>

                            </div>
                        </div>
                        <div>
                            {this.renderRevenueTable()}
                            <div className="Financial-revenue-chart">
                                {this.renderRevenueQuarterChart()}
                                {this.renderRevenueYearChart()}
                            </div>
                        </div>
                    </div>
                    <div className="Financial-profit bg-white">
                        <div className="header">
                            LỢI NHUẬN (TỶ)
                        </div>
                        <div>
                            {this.renderRevenueTable(true)}
                            <div className="Financial-revenue-chart">
                                {this.renderRevenueQuarterChart(true)}
                                {this.renderRevenueYearChart(true)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Financial-right-container bg-white">
                    <div className="header">
                        CHỈ TIÊU TÀI CHÍNH
                        <Button disabled={false} onClick={() => this.updateLatestFinancialInfo(symbol)}>update</Button>
                        <Button disabled={false} onClick={this.updateLatestFinancialInfoAll}>update all </Button>
                    </div>
                    <div className="Financial-criteria">
                        {this.renderEvaluation()}
                        {this.renderFinancialPower()}
                        {this.renderRunningAbility()}
                        {this.renderMakeProfitAbility()}
                        {this.renderManagement()}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedSymbol: get(state, 'selectedSymbol'),
        stocks: get(state, 'stocks'),
    }
}

const mapDispatchToProps = {
    getYearlyFinancialInfo,
    getQuarterlyFinancialInfo,
    getLastestFinancialInfo,
    getLastestFinancialReports
}

export default connect(mapStateToProps, mapDispatchToProps)(Financial);