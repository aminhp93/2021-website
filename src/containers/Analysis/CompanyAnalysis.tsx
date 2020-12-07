import React from 'react';
import { get, uniqBy, each } from 'lodash';
import { connect } from 'react-redux';
import { Table } from 'antd';

import {
    getYearlyFinancialInfo,
    getQuarterlyFinancialInfo,
    scanStock
} from 'reducers/stocks';
import { getLastestFinancialInfo } from 'reducers/latestFinancialInfo'

import { BILLION_UNIT } from 'utils/unit';
import { formatNumber } from 'utils/common';
import { marketAnalysisColumnDefs } from 'utils/columnDefs';

import FinancialAnalysis from 'containers/Analysis/FinancialAnalysis';
import CustomAgGridReact from 'components/CustomAgGridReact';

interface IProps {
    selectedSymbol: number,
    getYearlyFinancialInfo: any,
    getQuarterlyFinancialInfo: any,
    getLastestFinancialInfo: any,
    scanStock: any,
    data: any,
    companies: any,
    stocks: any,
    decisiveIndexes: any,
    symbol: string,
}

interface IState {
    QuarterlyFinancialInfoArray: any,
    YearlyFinancialInfoArray: any,
    LastestFinancialInfoObj: any,
    rowData: any,
    columnDefs: any,
}

class CompanyAnalysis extends React.Component<IProps, IState> {
    scanning: boolean;
    gridApi: any;
    gridColumnApi: any;

    constructor(props) {
        super(props);
        this.state = {
            QuarterlyFinancialInfoArray: [],
            YearlyFinancialInfoArray: [],
            LastestFinancialInfoObj: {},
            rowData: [],
            columnDefs: marketAnalysisColumnDefs(this, "SoSanhCungNganh", true),
        }
    }

    componentDidMount() {
        this.crawlData();
    }

    componentDidUpdate(preProps) {
        if (this.props.symbol !== preProps.symbol) {
            this.crawlData();
        }
    }

    crawlData = async () => {
        try {
            const symbol = (this.props.data || {}).symbol
            const res1 = await this.props.getYearlyFinancialInfo(symbol)
            const YearlyFinancialInfoArray = res1.data
            const res2 = await this.props.getQuarterlyFinancialInfo(symbol)
            const QuarterlyFinancialInfoArray = res2.data
            const res3 = await this.props.getLastestFinancialInfo({ stockId: symbol })
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
        keys.map((i, index) => {
            const pushObj = {
                title: String(i),
                render: (params) => {
                    if (index === keys.length - 1) {
                        let className = '';
                        if (Number(params[i]) > Number(params[keys[index - 1]])) {
                            className = 'green';
                        } else if (Number(params[i]) < Number(params[keys[index - 1]])) {
                            className = 'red';
                        }
                        return <div className={className}>{formatNumber((Number(params[i]) || 0).toFixed(0))}</div>
                    } else {
                        return formatNumber((Number(params[i]) || 0).toFixed(0))
                    }

                }
            }
            columns.push(pushObj)
        })
        return <Table dataSource={mappedData} columns={columns} pagination={false} />
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
            if (JSON.stringify(itemObj) !== "{}") {
                result.push(itemObj)
            }
        }
        const obj: any = {};

        result.map(i => {
            Object.keys(i).map(j => {
                if (!obj[j]) {
                    obj[j] = i[j]
                } else {
                    obj[j] = String(Number(i[j]) + Number(obj[j]))
                }
            })
        })
        obj['Quarter'] = 'total'
        result.push(obj)
        return result
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.scan();
    }

    scan = async () => {
        if (this.scanning) return;
        try {
            const data: any = { ...this.state }
            data.endDate = this.props.data.endDate;
            data.startDate = this.props.data.startDate;
            const stock: any = Object.values(this.props.stocks).filter((i: any) => i.Symbol === (this.props.data || {}).symbol)[0]
            data.ICBCode = Number((this.props.companies[stock.id] || {}).ICBCode)
            data.ChangePrice = -100
            data.MinPrice = 5000
            data.Symbol = ""
            data.TodayCapital = 1000000000
            data.checkBlackList = true
            data.checkStrong = true
            this.gridApi.showLoadingOverlay();
            this.scanning = true
            const res = await this.props.scanStock(data);
            this.scanning = false
            this.gridApi.hideOverlay()
            this.setState({
                rowData: this.mapData(res.data)
            })
        } catch (error) {
            this.scanning = false
        }
    }

    mapData = (data) => {
        const { companies, stocks, decisiveIndexes } = this.props;

        each(data, i => {
            i.ICBCode = Number((companies[i.Stock] || {}).ICBCode)
            i.Symbol = (stocks[i.Stock] || {}).Symbol
            i.LowestPoint = (decisiveIndexes[i.Stock] || {}).LowestPoint
            i.LowestPointChange = (i.PriceClose - (decisiveIndexes[i.Stock] || {}).LowestPoint) / (decisiveIndexes[i.Stock] || {}).LowestPoint * 100
            i.PE = Number(i.PE)
            i.PS = Number(i.PS)
            i.PB = Number(i.PB)
            i.EPS = Number(i.EPS)
            i.QuickRatio = Number(i.QuickRatio)
            i.CurrentRatio = Number(i.CurrentRatio)
            i.TotalDebtOverEquity = Number(i.TotalDebtOverEquity)
            i.TotalDebtOverAssets = Number(i.TotalDebtOverAssets)
            i.TotalAssetsTurnover = Number(i.TotalAssetsTurnover)
            i.InventoryTurnover = Number(i.InventoryTurnover)
            i.ReceivablesTurnover = Number(i.ReceivablesTurnover)
            i.GrossMargin = Number(i.GrossMargin)
            i.OperatingMargin = Number(i.OperatingMargin)
            i.EBITMargin = Number(i.EBITMargin)
            i.NetProfitMargin = Number(i.NetProfitMargin)
            i.ROA = Number(i.ROA)
            i.ROE = Number(i.ROE)
            i.ROIC = Number(i.ROIC)
            i.LastQuarterRev = Number(i.LastQuarterRev)
            i.LastQuarterProfit = Number(i.LastQuarterProfit)
            i.CurrentQuarterRev = Number(i.CurrentQuarterRev)
            i.CurrentQuarterProfit = Number(i.CurrentQuarterProfit)
            return i
        })
        return data
    }

    render() {
        const { rowData, columnDefs } = this.state;
        return <div className="CompanyAnalysis">
            <div className="flex">
                <div className="flex-1">
                    <div className="medium">Compare same ICBCode</div>
                    <CustomAgGridReact
                        columnDefs={columnDefs}
                        onGridReady={this.onGridReady}
                        rowData={rowData}
                    />
                </div>
            </div>
            <hr />
            <br />
            <div>
                <FinancialAnalysis symbol={(this.props.data || {}).symbol} />
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        selectedSymbol: get(state, 'selectedSymbol'),
        companies: get(state, 'companies'),
        stocks: get(state, 'stocks'),
        decisiveIndexes: get(state, 'decisiveIndexes')

    }
}

const mapDispatchToProps = {
    getYearlyFinancialInfo,
    getQuarterlyFinancialInfo,
    getLastestFinancialInfo,
    scanStock
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAnalysis);
