/* eslint-disable react/display-name */
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
    LATEST_FINANCIAL_REPORTS,
    mapColorVolumeChange
} from './common';

import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


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

export const getLastestFinancialReportsColumnDefs = (period, type, analysisType = null, LastestFinancialReportsArray = []) => {
    if (LastestFinancialReportsArray.length === 0) return;
    let yearArray = []
    let quarterArray = []

    yearArray = LastestFinancialReportsArray[0].Values.map(i => i.Year)
    quarterArray = LastestFinancialReportsArray[0].Values.map(i => {
        return {
            Year: i.Year,
            Quarter: i.Quarter
        }
    })
    let year = []
    const quarter = []
    const rowGroup = [
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
    year.push({
        headerName: 'Chart',
        cellRendererFramework: (params) => {
            const data = params.data.Values;
            return <BarChart width={100} height={40} data={data}>
                <Bar dataKey="Value">
                    {data.map((entry, index) => (
                        <Cell key={index} fill={entry.Value > 0 ? 'green' : 'red'} />
                    ))}
                </Bar>
            </BarChart>
        }
    })
    yearArray.forEach(yearItem => {
        year.push({
            headerName: yearItem,
            type: 'rightAligned',
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


    quarter.push({
        field: 'Name'
    })

    quarter.push({
        headerName: 'Chart',
        cellRendererFramework: (params) => {
            const data = params.data.Values;
            return <BarChart width={100} height={40} data={data}>
                <Bar dataKey="Value">
                    {data.map((entry, index) => (
                        <Cell key={index} fill={entry.Value > 0 ? 'green' : 'red'} />
                    ))}
                </Bar>
            </BarChart>
        }
    })
    quarterArray.map(quarterItem => (
        quarter.push({
            headerName: `${quarterItem.Year} ${quarterItem.Quarter}`,
            type: 'rightAligned',
            cellRenderer: (params) => {
                if (params.data && params.data.Values && params.data.Values.length) {
                    const data = params.data.Values.filter(item => item.Year === quarterItem.Year && item.Quarter === quarterItem.Quarter)
                    return formatNumber(data.length && (data[0].Value / BILLION_UNIT).toFixed(0))
                }
            }
        })
    ))

    return period === 'yearly' ? year : quarter
}

export const marketAnalysisColumnDefs = (that, importantIndexType = null, allowICBCode = false) => {
    const Stock = {
        headerName: 'Stock',
        field: 'Symbol',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = params.data.Symbol
            return div
        }
    }

    const Actions = {
        headerName: 'Actions',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.className = 'flex space-between'
            ReactDOM.render(
                <>
                    <div className="flex">
                        <div onClick={() => {
                            that.setState({
                                visibleChart: true,
                                symbol: params.data.Symbol
                            })
                        }}><BarChartOutlined style={{ fontSize: '16px' }} /></div>
                        <div onClick={() => {
                            that.setState({
                                visibleInfo: true,
                                symbol: params.data.Symbol
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
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = formatNumber(params.data.PriceClose)
            return div
        }
    }
    const DealVolume = {
        field: 'DealVolume',
        headerName: 'DealVolume',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = formatNumber(params.data.DealVolume)
            return div
        }
    }

    const TodayCapital = {
        field: 'TotalValue',
        type: 'rightAligned',
        headerName: 'TotalValue',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = formatNumber((params.data.TotalValue / BILLION_UNIT).toFixed(0))
            return div
        }
    }

    const LastPrice = {
        field: 'LastPrice',
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
        headerName: '%P',
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = Number(params.data.PriceChange).toFixed(1)
            div.className = mapColorPriceChange(params.data.PriceChange)
            return div
        }
    }
    const LowestPoint = {
        field: 'LowestPoint',
        headerName: 'LowestPoint',
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
        type: 'rightAligned',
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

    const AverageVolume30 = {
        field: 'AverageVolume30',
        headerName: 'AverageVolume30',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = formatNumber(params.data.AverageVolume30)
            return div
        }
    }

    const VolumeChange = {
        field: 'VolumeChange',
        headerName: '%V',
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        cellRenderer: params => {
            const div = document.createElement("div");
            div.innerText = Number(params.data.VolumeChange).toFixed(1)
            div.className = mapColorVolumeChange(params.data.VolumeChange)
            return div
        }
    }

    const { selectedSymbol, companies } = that.props;
    const ICBCodeIndex = Number((companies[selectedSymbol] || {}).ICBCode)
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
                return [Stock, Actions, ICBCode, TodayCapital, PriceChange, VolumeChange, MarketCap]
            // Price, LastPrice
        }
    }



}