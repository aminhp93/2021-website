import React from 'react';
import { get, uniqBy, each } from 'lodash';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { AgGridReact } from 'ag-grid-react';

import {
    getYearlyFinancialInfo,
    getQuarterlyFinancialInfo,
    getLastestFinancialInfo,
    scanStock
} from 'reducers/stocks';
import { BILLION_UNIT } from 'utils/unit';
import { formatNumber } from 'utils/common';
import { analysisDailyColumnDefs } from 'utils/columnDefs';


interface IProps {
    selectedSymbol: string,
    getYearlyFinancialInfo: any,
    getQuarterlyFinancialInfo: any,
    getLastestFinancialInfo: any,
    scanStock: any,
    data: any,
    companies: any,
    stocks: any,
    decisiveIndexes: any,
}

interface IState {
    QuarterlyFinancialInfoArray: any,
    YearlyFinancialInfoArray: any,
    LastestFinancialInfoObj: any,
    rowData: any,
    columnDefs: any,
    defaultColDef: any,
}

class Summary extends React.Component<IProps, IState> {
    scanning: boolean;
    gridApi: any;
    gridColumnApi: any;

    constructor(props) {
        super(props);
        this.state = {
            QuarterlyFinancialInfoArray: [],
            YearlyFinancialInfoArray: [],
            LastestFinancialInfoObj: {},
            // modules: AllModules,
            rowData: [],
            columnDefs: analysisDailyColumnDefs(this, "SoSanhCungNganh", true),
            defaultColDef: {
                flex: 1,
                filter: true,
                sortable: true,
                minWidth: 100,
                enableValue: true,
                enableRowGroup: true,
                enablePivot: true,
            },
        }
    }

    componentDidMount() {
        this.crawlData();
    }

    componentDidUpdate(preProps) {
        if (this.props.selectedSymbol !== preProps.selectedSymbol) {
            this.crawlData();
        }
    }

    crawlData = async () => {
        try {
            const res1 = await this.props.getYearlyFinancialInfo()
            let YearlyFinancialInfoArray = res1.data
            const res2 = await this.props.getQuarterlyFinancialInfo()
            let QuarterlyFinancialInfoArray = res2.data
            const res3 = await this.props.getLastestFinancialInfo()
            let LastestFinancialInfoObj = res3.data
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
        let keys = uniqBy(QuarterlyFinancialInfoArray.map(i => i.Year)).sort((a, b) => a - b)
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
        let result = [];

        let keys = uniqBy(data.map(i => i.Year)).sort((a, b) => a - b)
        for (let j = 1; j < keys.length + 1; j++) {
            let itemObj = {}
            for (let i = 0; i < data.length; i++) {
                let item = data[i]
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

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.scan();
    }

    scan = async () => {
        if (this.scanning) return;
        try {
            let data: any = { ...this.state }
            data.endDate = this.props.data.endDate;
            data.startDate = this.props.data.startDate;
            const stock: any = Object.values(this.props.stocks).filter((i: any) => i.Symbol === this.props.selectedSymbol)[0]
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
        const { rowData, columnDefs, defaultColDef } = this.state;
        return <div className="Summary">
            <div className="flex">
                <div className="flex-1 Summary-revenue">
                    <div className="medium">Doanh thu</div>
                    {this.renderRevenueTable()}
                </div>
                <div className="flex-1">
                    <div className="medium">Loi nhuan</div>
                    {this.renderRevenueTable(true)}
                </div>
            </div>
            
            <div className="medium">Compare same ICBCode</div>
            <div style={{ width: '100%', height: '100%' }}>
                <div
                    id="myGrid"
                    style={{
                        height: '500px',
                    }}
                    className="ag-theme-alpine"
                >
                    <AgGridReact
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        onGridReady={this.onGridReady}
                        rowData={rowData}
                        onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    />
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
