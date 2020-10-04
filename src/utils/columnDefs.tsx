import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import {
    BarChartOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { BILLION_UNIT } from './unit';

import {
    mapColorPriceChange,
    formatNumber,
    mapColorFinancialReportChange,
    LATEST_FINANCIAL_REPORTS
} from './common';


export function getYearlyFinancialInfoColumnDefs() {
    return [
        {
            headerName: 'Stock',
            field: 'Stock',
            align: 'left',
        },
        {
            headerName: 'Year',
            field: 'Year',
        },
        {
            headerName: 'Sales',
            field: 'Sales',
            align: 'right',
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerText = formatNumber((params.data.Sales / BILLION_UNIT).toFixed(1))
                return div
            }
        },
        {
            headerName: 'ProfitFromFinancialActivities',
            field: 'ProfitFromFinancialActivities',
            align: 'right',
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerText = formatNumber((params.data.ProfitFromFinancialActivities / BILLION_UNIT).toFixed(1))
                return div
            }
        },
        {
            headerName: 'ProfitBeforeTax',
            field: 'ProfitBeforeTax',
            align: 'right',
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerText = formatNumber((params.data.ProfitBeforeTax / BILLION_UNIT).toFixed(1))
                return div
            }
        },
        {
            headerName: 'Cash',
            field: 'Cash',
            align: 'right',
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerText = formatNumber((params.data.Cash / BILLION_UNIT).toFixed(1))
                return div
            }
        },
        {
            headerName: 'TotalAssets',
            field: 'TotalAssets',
            align: 'right',
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerText = formatNumber((params.data.TotalAssets / BILLION_UNIT).toFixed(1))
                return div
            }
        },
        {
            headerName: 'Equity',
            field: 'Equity',
            align: 'right',
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerText = formatNumber((params.data.Equity / BILLION_UNIT).toFixed(1))
                return div
            }
        },
        {
            headerName: 'BookValuePerShare',
            field: 'BookValuePerShare',
            align: 'right',
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerText = formatNumber((params.data.BookValuePerShare).toFixed(1))
                return div
            }
        },
        {
            headerName: 'Liabilities',
            field: 'Liabilities',
            align: 'right',
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerText = formatNumber((params.data.Liabilities / BILLION_UNIT).toFixed(1))
                return div
            }
        },
    ]
}

export function getQuarterlyFinancialInfoColumnDefs() {
    const list = [
        'Year',
        'Quarter',
        // 'BasicEPS_TTM',
        'DilutedEPS_TTM',
        // 'SalesGrowth_MRQ',
        // 'SalesGrowth_TTM',
        // 'ProfitGrowth_MRQ',
        // 'ProfitGrowth_TTM',
        // 'BasicEPSGrowth_MRQ',
        // 'BasicEPSGrowth_TTM',
        // 'DilutedEPSGrowth_MRQ',
        // 'DilutedEPSGrowth_TTM',
        // 'QuickRatio_MRQ',
        // 'CurrentRatio_MRQ',
        // 'LTDebtToEquity_MRQ',
        // 'TotalDebtToEquity_MRQ',
        // 'TotalDebtToTotalAssets_MRQ',
        // 'GrossMargin_TTM',
        // 'EBITMargin_TTM',
        // 'OperatingMargin_TTM',
        // 'PreTaxMargin_TTM',
        // 'NetProfitMargin_TTM',
        // 'ROA_TTM',
        // 'ROE_TTM',
        // 'ROIC_TTM',
        // 'InventoryTurnover_TTM',
        // 'ReceivablesTurnover_TTM',
        // 'CurrentAssetsTurnover_TTM',
        // 'AssetsTurnover_TTM',
        // 'DividendGrowth_MRQ',
        // 'DividendGrowth_TTM',
        // 'TotalAssetsGrowth_MRQ',
        // 'TotalAssetsGrowth_TTM',
        // 'BookValuePerShare_MRQ',
        // 'SalesPerShare_TTM',
        // 'BasicEPS_MRQ',
        // 'DilutedEPS_MRQ',
        'NetSales_MRQ',
        // 'Dividend_MRQ',
        'TotalAssets_MRQ',
        // 'CurrentAssets_MRQ',
        // 'Inventories_MRQ',
        'ProfitAfterTax_MRQ',
        'SharesOutstanding_MRQ',
        // 'Cash_MRQ',
        // 'NetLiquidAssets_MRQ',
        // 'CurrentLiabilities_MRQ',
        // 'LongTermLiabilities_MRQ',
        // 'Liabilities_MRQ',
        'Equity_MRQ',
        'ProfitBeforeTax_MRQ',
        'FixedAssets_MRQ',
        // 'LiquidAssets_MRQ',
        'IntangibleAssets_MRQ',
    ]
    let result: any = [
        {
            headerName: 'Stock',
            field: 'Stock',
            align: 'left',
        },
    ];
    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        result.push({
            headerName: item,
            field: item,
            align: 'right',
            cellRenderer: params => {
                if (!params.data[item]) return ''
                const div = document.createElement("div");
                const unit = params.data[item] > 10000 ? BILLION_UNIT : 1
                div.innerText = formatNumber((params.data[item] / unit).toFixed(1))
                return div
            }
        })
    }
    return result
}

export const HistoricalQuotesPastPriceColumns = [
    {
        title: 'NGÀY',
        render: params => {
            return moment(params.Date).format('YYYY-MM-DD')
        }
    },
    {
        title: 'THAY ĐỔI',
        align: 'right',
        render: params => {
            const content = Number(((params.PriceClose - params.PriceBasic) / 1000).toFixed(2))
            let className = '';
            if (content > 0) {
                className = 'green';
            } else if (content < 0) {
                className = 'red';
            }
            return <div className={className}>{content}</div>
        }
    },
    {
        title: '%',
        align: 'right',
        render: params => {
            const content = Number(((params.PriceClose - params.PriceOpen) * 100 / (params.PriceOpen)).toFixed(2))
            let className = '';
            if (content > 0) {
                className = 'green';
            } else if (content < 0) {
                className = 'red';
            }
            return <div className={className}>{content}</div>
        }
    },
    {
        title: 'MỞ CỬA',
        align: 'right',
        render: params => {
            return (params.PriceOpen / 1000).toFixed(2)
        }
    },
    {
        title: 'CAO NHẤT',
        align: 'right',
        render: params => {
            return (params.PriceHigh / 1000).toFixed(2)
        }
    },
    {
        title: 'THẤP NHẤT',
        align: 'right',
        render: params => {
            return (params.PriceLow / 1000).toFixed(2)
        }
    },
    {
        title: 'ĐÓNG CỬA',
        align: 'right',
        render: params => {
            return (params.PriceClose / 1000).toFixed(2)
        }
    },
    {
        title: 'TRUNG BÌNH',
        align: 'right',
        render: params => {
            return (params.PriceAverage / 1000).toFixed(2)
        }
    },
    {
        title: 'ĐÓNG CỬA ĐC',
        align: 'right',
        render: params => {
            return (params.AdjClose / 1000).toFixed(2)
        }
    },
    {
        title: 'KHỐI LƯỢNG',
        align: 'right',
        render: params => {
            return formatNumber(params.Volume)
        }
    }
]

export const HistoricalQuotesForeignTradeColumns = [
    {
        title: 'NGÀY',
        render: params => {
            return moment(params.Date).format('YYYY-MM-DD')
        }
    },
    {
        title: 'ROOM NN',
        align: 'right',
        render: params => {
            return formatNumber(params.CurrentForeignRoom)
        }
    },
    {
        title: 'KL MUA',
        align: 'right',
        render: params => {
            return formatNumber(params.BuyForeignQuantity)
        }
    },
    {
        title: 'KL BÁN',
        align: 'right',
        render: params => {
            return formatNumber(params.SellForeignQuantity)
        }
    },
    {
        title: 'MUA-BÁN',
        align: 'right',
        render: params => {
            return formatNumber(params.BuyForeignQuantity - params.SellForeignQuantity)
        }
    },
    {
        title: 'GT MUA',
        align: 'right',
        render: params => {
            return formatNumber(params.BuyForeignValue)
        }
    },
    {
        title: 'GT BÁN',
        align: 'right',
        render: params => {
            return formatNumber(params.SellForeignValue)
        }
    },
    {
        title: 'MUA-BÁN',
        align: 'right',
        render: params => {
            return formatNumber(params.BuyForeignValue - params.SellForeignValue)
        }
    }
]

export const HistoricalQuotesSupplyDemandColumns = [
    {
        title: 'NGÀY',
        render: params => {
            return moment(params.Date).format('YYYY-MM-DD')
        }
    },
    {
        title: 'SL ĐẶT MUA',
        align: 'right',
        render: params => {
            return formatNumber(params.BuyCount)
        }
    },
    {
        title: 'KL ĐẶT MUA',
        align: 'right',
        render: params => {
            return formatNumber(params.BuyQuantity)
        }
    },
    {
        title: 'SL ĐẶT BÁN',
        align: 'right',
        render: params => {
            return formatNumber(params.SellCount)
        }
    },
    {
        title: 'KL ĐẶT BÁN',
        align: 'right',
        render: params => {
            return formatNumber(params.SellQuantity)
        }
    },
    {
        title: 'KL KHỚP',
        align: 'right',
        render: params => {
            return formatNumber(params.Volume)
        }
    },
    {
        title: 'GT KHỚP (1000 VND)',
        align: 'right',
        render: params => {
            return formatNumber(params.TotalValue)
        }
    }
]

export const getLastestFinancialReportsColumnDefs = (period, type, analysisType = null) => {
    let yearArray = [2015, 2016, 2017, 2018, 2019]
    let quarterArray: any = [
        {
            Year: 2018,
            Quarter: 4
        },
        {
            Year: 2019,
            Quarter: 1
        },
        {
            Year: 2019,
            Quarter: 2
        },
        {
            Year: 2019,
            Quarter: 3
        },
        {
            Year: 2019,
            Quarter: 4
        },
        {
            Year: 2020,
            Quarter: 1
        }
    ]
    let year = []
    let quarter = []
    let rowGroup = [
        {
            field: 'ParentID1',
            rowGroup: true,
            hide: true
        },
        {
            field: 'ParentID2',
            rowGroup: true,
            hide: true
        },
        {
            field: 'ParentID3',
            rowGroup: true,
            hide: true
        },
        {
            field: 'ParentID4',
            rowGroup: true,
            hide: true
        },
        {
            field: 'ParentID5',
            rowGroup: true,
            hide: true
        },
    ]
    if (type === LATEST_FINANCIAL_REPORTS.TYPE_1) {
        year = year.concat(rowGroup)
    }
    year.push({
        field: 'Name'
    })
    yearArray.forEach(yearItem => {
        year.push({
            headerName: yearItem,
            cellRenderer: (params) => {
                if (params.data && params.data.Values && params.data.Values.length) {
                    const data = params.data.Values.filter(item => item.Year === yearItem)
                    return formatNumber(data.length && (data[0].Value / BILLION_UNIT).toFixed(0))
                }
            }
        })
    })
    if (type === LATEST_FINANCIAL_REPORTS.TYPE_1) {


        if (analysisType === 'tyTrong') {
            let tyTrongArray = ['%2015', '%2016', '%2017', '%2018', '%2019']
            tyTrongArray.forEach((yearItem, index) => {
                year.push({
                    headerName: yearItem,
                    cellRenderer: (params) => {
                        if (params.data && params.data.Values && params.data.Values.length) {
                            const data = params.data.Values.filter(item => item.Year === yearItem)
                            const div = document.createElement("div");
                            if (data.length && Number((data[0].Value * 100).toFixed(1)) > 10) {
                                div.className = 'red'
                            }
                            div.innerText = data.length && (data[0].Value * 100).toFixed(1)
                            return div
                        }
                    }
                })
            })
        } else if (analysisType === 'chieuNgang') {
            let chieuNgangArray = ['2016-2015', '2017-2016', '2018-2017', '2019-2018']
            chieuNgangArray.forEach((yearItem, index) => {
                year.push({
                    headerName: yearItem,
                    cellRenderer: (params) => {
                        if (params.data && params.data.Values && params.data.Values.length) {
                            const data = params.data.Values.filter(item => item.Year === yearItem)
                            const div = document.createElement("div");
                            if (data.length && Number((data[0].Value * 100).toFixed(1)) > 0) {
                                div.className = 'green'
                            } else {
                                div.className = 'red'
                            }
                            div.innerText = data.length && (data[0].Value * 100).toFixed(1)
                            return div
                        }
                    }
                })
            })
        }
    }


    if (type === LATEST_FINANCIAL_REPORTS.TYPE_2) {
        if (analysisType === 'tyTrong') {
            let tyTrongArray = ['%2015', '%2016', '%2017', '%2018', '%2019']
            tyTrongArray.forEach((yearItem, index) => {
                year.push({
                    headerName: yearItem,
                    cellRenderer: (params) => {
                        if (params.data && params.data.Values && params.data.Values.length) {
                            const data = params.data.Values.filter(item => item.Year === yearItem)
                            if (!data.length) return ''
                            const div = document.createElement("div");
                            if (data.length && Number((data[0].Value * 100).toFixed(1)) > 10) {
                                div.className = 'red'
                            }
                            div.innerText = data.length && (data[0].Value * 100).toFixed(1)
                            return div
                        }
                    }
                })
            })
        } else if (analysisType === 'chieuNgang') {
            let chieuNgangArray = ['2016-2015', '2017-2016', '2018-2017', '2019-2018']
            chieuNgangArray.forEach((yearItem, index) => {
                year.push({
                    headerName: yearItem,
                    cellRenderer: (params) => {
                        if (params.data && params.data.Values && params.data.Values.length) {
                            const data = params.data.Values.filter(item => item.Year === yearItem)
                            const div = document.createElement("div");
                            if (data.length && Number((data[0].Value * 100).toFixed(1)) > 0) {
                                div.className = 'green'
                            } else {
                                div.className = 'red'
                            }
                            div.innerText = data.length && (data[0].Value * 100).toFixed(1)
                            return div
                        }
                    }
                })
            })
        }
    }


    quarterArray.push({
        field: 'Name'
    })
    quarterArray.map(quarterItem => (
        quarter.push({
            headerName: `${quarterItem.Year} ${quarterItem.Quarter}`,
            cellRenderer: (params) => {
                if (params.data && params.data.Values && params.data.Values.length) {
                    const data = params.data.Values.filter(item => item.Year === quarterItem.Year && item.Quarter === quarterItem.Quarter)
                    return data.length && (data[0].Value / BILLION_UNIT).toFixed(0)
                }
            }
        })
    ))

    return period === 'yearly' ? year : quarter
}

export const analysisDailyColumnDefs = (that, importantIndexType = null, allowICBCode = false) => {
    const Stock = {
        headerName: 'Stock',
        align: 'left',
        field: 'Symbol',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = params.data.Symbol
            return div
        }
    }

    const Actions = {
        headerName: 'Actions',
        align: 'left',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.className = 'flex space-between'
            ReactDOM.render(
                <>
                    <div className="flex">
                        <div onClick={() => {
                            that.setState({
                                visibleChart: true,
                                Symbol: params.data.Symbol
                            })
                            that.props.updateSelectedSymbolSuccess(params.data.Symbol)
                        }}><BarChartOutlined style={{ fontSize: '16px' }} /></div>
                        <div onClick={() => { 
                            that.setState({ 
                                visibleInfo: true, 
                                Symbol: params.data.Symbol 
                            }) 
                        }}><InfoCircleOutlined style={{ fontSize: '16px' }} /></div>
                    </div>
                </>,
                div
            );
            return div
        }
    }

    const ICBCode = {
        field: 'ICBCode',
        headerName: 'ICBCode',
        filter: 'agNumberColumnFilter',
        align: 'right',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = params.data.ICBCode
            return div
        }
    }

    const Price = {
        field: 'PriceClose',
        headerName: 'Price',
        filter: 'agNumberColumnFilter',
        align: 'right',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = formatNumber(params.data.PriceClose)
            return div
        }
    }
    const DealVolume = {
        field: 'DealVolume',
        align: 'right',
        headerName: 'DealVolume',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = formatNumber(params.data.DealVolume)
            return div
        }
    }

    const TodayCapital = {
        field: 'TodayCapital',
        align: 'right',
        headerName: 'TodayCapital',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = formatNumber((params.data.TodayCapital / BILLION_UNIT).toFixed(0))
            return div
        }
    }

    const LastPrice = {
        field: 'LastPrice',
        align: 'right',
        headerName: 'LastPrice',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = formatNumber(params.data.LastPrice)
            return div
        }
    }
    const PriceChange = {
        field: 'PriceChange',
        headerName: '%',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = Number(params.data.PriceChange).toFixed(2)
            div.className = mapColorPriceChange(params.data.PriceChange)
            return div
        }
    }
    const LowestPoint = {
        field: 'LowestPoint',
        headerName: 'LowestPoint',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = params.data.LowestPoint
            return div
        }
    }
    const LowestPointChange = {
        field: 'LowestPointChange',
        headerName: 'LowestPointChange',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = Number(params.data.LowestPointChange).toFixed(1)
            return div
        }
    }

    const LastRevenue = {
        field: 'LastRevenue',
        headerName: '2018Revenue',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = Number(params.data.LastRevenue / BILLION_UNIT).toFixed(0)
            return div
        }
    }

    const CurrentRevenue = {
        field: 'CurrentRevenue',
        headerName: '2019Revenue',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = Number(params.data.CurrentRevenue / BILLION_UNIT).toFixed(0)
            return div
        }
    }

    const RevenueChange = {
        field: 'RevenueChange',
        headerName: '%Rev',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (Number(params.data.RevenueChange) * 100).toFixed(1)
            div.className = mapColorFinancialReportChange(params.data.RevenueChange)

            return div
        }
    }
    const LastProfit = {
        field: 'LastProfit',
        headerName: '2018Profit',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = Number(params.data.LastProfit / BILLION_UNIT).toFixed(0)
            return div
        }
    }

    const CurrentProfit = {
        field: 'CurrentProfit',
        headerName: '2019Profit',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = Number(params.data.CurrentProfit / BILLION_UNIT).toFixed(0)
            return div
        }
    }

    const ProfitChange = {
        field: 'ProfitChange',
        headerName: '%Profit',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (Number(params.data.ProfitChange) * 100).toFixed(1)
            div.className = mapColorFinancialReportChange(params.data.ProfitChange)
            return div
        }
    }

    const PE = {
        field: 'PE',
        headerName: 'PE',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.PE).toFixed(0)
            return div
        }
    }

    const PS = {
        field: 'PS',
        headerName: 'PS',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.PS).toFixed(1)
            return div
        }
    }

    const PB = {
        field: 'PB',
        headerName: 'PB',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.PB).toFixed(1)
            return div
        }
    }

    const EPS = {
        field: 'EPS',
        headerName: 'EPS',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.EPS).toFixed(0)
            return div
        }
    }

    const QuickRatio = {
        field: 'QuickRatio',
        headerName: 'QuickRatio',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.QuickRatio).toFixed(2)
            return div
        }
    }

    const CurrentRatio = {
        field: 'CurrentRatio',
        headerName: 'CurrentRatio',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.CurrentRatio).toFixed(2)
            return div
        }
    }

    const TotalDebtOverEquity = {
        field: 'TotalDebtOverEquity',
        headerName: 'TotalDebtOverEquity',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.TotalDebtOverEquity).toFixed(2)
            return div
        }
    }
    const TotalDebtOverAssets = {
        field: 'TotalDebtOverAssets',
        headerName: 'TotalDebtOverAssets',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.TotalDebtOverAssets).toFixed(2)
            return div
        }
    }

    const TotalAssetsTurnover = {
        field: 'TotalAssetsTurnover',
        headerName: 'TotalAssetsTurnover',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.TotalAssetsTurnover).toFixed(2)
            return div
        }
    }

    const InventoryTurnover = {
        field: 'InventoryTurnover',
        headerName: 'InventoryTurnover',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.InventoryTurnover).toFixed(2)
            return div
        }
    }

    const ReceivablesTurnover = {
        field: 'ReceivablesTurnover',
        headerName: 'ReceivablesTurnover',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.ReceivablesTurnover).toFixed(2)
            return div
        }
    }

    const GrossMargin = {
        field: 'GrossMargin',
        headerName: 'GrossMargin',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.GrossMargin).toFixed(2)
            return div
        }
    }

    const OperatingMargin = {
        field: 'OperatingMargin',
        headerName: 'OperatingMargin',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.OperatingMargin).toFixed(2)
            return div
        }
    }

    const EBITMargin = {
        field: 'EBITMargin',
        headerName: 'EBITMargin',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.EBITMargin).toFixed(2)
            return div
        }
    }

    const NetProfitMargin = {
        field: 'NetProfitMargin',
        headerName: 'NetProfitMargin',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.NetProfitMargin).toFixed(2)
            return div
        }
    }

    const ROA = {
        field: 'ROA',
        headerName: 'ROA',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.ROA).toFixed(2)
            return div
        }
    }

    const ROE = {
        field: 'ROE',
        headerName: 'ROE',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.ROE).toFixed(2)
            return div
        }
    }

    const ROIC = {
        field: 'ROIC',
        headerName: 'ROIC',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.ROIC).toFixed(2)
            return div
        }
    }

    const MarketCap = {
        field: 'MarketCap',
        headerName: 'MarketCap',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.MarketCap / BILLION_UNIT).toFixed(0)
            return div
        }
    }

    const LastQuarterRev = {
        field: 'LastQuarterRev',
        headerName: 'LastQuarterRev',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.LastQuarterRev / BILLION_UNIT).toFixed(0)
            return div
        }
    }

    const LastQuarterProfit = {
        field: 'LastQuarterProfit',
        headerName: 'LastQuarterProfit',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.LastQuarterProfit / BILLION_UNIT).toFixed(0)
            return div
        }
    }

    const CurrentQuarterRev = {
        field: 'CurrentQuarterRev',
        headerName: 'CurrentQuarterRev',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.CurrentQuarterRev / BILLION_UNIT).toFixed(0)
            if (params.data.LastQuarterRev < params.data.CurrentQuarterRev) {
                div.className = 'green'
            } else if (params.data.LastQuarterRev > params.data.CurrentQuarterRev) {
                div.className = 'red'
            }
            return div
        }
    }

    const CurrentQuarterProfit = {
        field: 'CurrentQuarterProfit',
        headerName: 'CurrentQuarterProfit',
        align: 'right',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = (params.data.CurrentQuarterProfit / BILLION_UNIT).toFixed(0)
            if (params.data.LastQuarterProfit < params.data.CurrentQuarterProfit) {
                div.className = 'green'
            } else if (params.data.LastQuarterProfit > params.data.CurrentQuarterProfit) {
                div.className = 'red'
            }
            return div
        }
    }

    const { selectedSymbol, stocks, companies } = that.props;
    const stock: any = Object.values(stocks).filter((i: any) => i.Symbol === selectedSymbol)[0]
    const ICBCodeIndex = Number((companies[(stock || {}).id] || {}).ICBCode)
    if (allowICBCode) {
        switch (ICBCodeIndex) {
            // case 8355:
                // return [Stock, PE, PS, PB, EPS, MarketCap, TotalAssetsTurnover, ReceivablesTurnover, OperatingMargin, EBITMargin, NetProfitMargin, ROE, LowestPoint, LowestPointChange, LastRevenue, CurrentRevenue, RevenueChange, LastProfit, CurrentProfit, ProfitChange, DealVolume, TodayCapital, PriceChange]
            // QuickRatio, CurrentRatio, TotalDebtOverEquity, TotalDebtOverAssets, InventoryTurnover, GrossMargin, ROIC, LastPrice, Price, ROA
            default:
                return [Stock, MarketCap, PriceChange, LastQuarterRev, CurrentQuarterRev, LastQuarterProfit, CurrentQuarterProfit]
            // Price, LastPrice, PE, PS, PB, EPS, MarketCap, TotalAssetsTurnover, ReceivablesTurnover, OperatingMargin, EBITMargin, NetProfitMargin, ROA, ROE, LowestPoint, LowestPointChange, LastRevenue, CurrentRevenue, RevenueChange, LastProfit, CurrentProfit, ProfitChange, DealVolume, TodayCapital, QuickRatio, CurrentRatio, TotalDebtOverEquity, TotalDebtOverAssets, InventoryTurnover, GrossMargin, ROIC
        }
    } else {
        switch (importantIndexType) {
            case 'KhaNangThanhToan':
                return [Stock, Actions, ICBCode, PE, PS, PB, EPS, QuickRatio, CurrentRatio, TotalDebtOverEquity, TotalDebtOverAssets, MarketCap]
            case 'CoCauTaiSan':
                return [Stock, Actions, ICBCode, TotalAssetsTurnover, InventoryTurnover, ReceivablesTurnover, GrossMargin, OperatingMargin, EBITMargin, NetProfitMargin, ROA, ROE, ROIC, MarketCap]
            case 'HieuSuatHoatDong':
                return [Stock, Actions, ICBCode, LowestPoint, LowestPointChange, LastRevenue, CurrentRevenue, RevenueChange, LastProfit, CurrentProfit, ProfitChange, MarketCap]
            default:
                return [Stock, Actions, ICBCode, DealVolume, TodayCapital, PriceChange, MarketCap]
            // Price, LastPrice
        }
    }



}