import React from 'react';
import { connect } from 'react-redux';
import { get, each, groupBy } from 'lodash';
import { Tabs } from 'antd';

import CustomAgGridReact from 'components/CustomAgGridReact';
import { getPreviousDate, getEndDate } from 'utils/common';
import { scanStock } from 'reducers/stocks';

import {
    PieChart, Pie, Legend, Tooltip,
  } from 'recharts';

const { TabPane } = Tabs;

interface IProps {
    scanStock: any;
    lastUpdatedDate: any;
    companies: any;
    stocks: any;
    decisiveIndexes: any;
    latestFinancialInfo: any;
}

interface IState {
    columnDefs: any;
    rowData: any;
}

class AccumulatedAssets extends React.Component<IProps, IState> {
    gridApi: any;
    gridColumnApi: any;

    constructor(props) {
        super(props);
        this.state = {
            rowData: [],
            columnDefs: [
                {
                    headerName: 'Stock',
                    field: 'Symbol',
                },
                {
                    headerName: 'PriceClose',
                    field: 'PriceClose',
                },
                {
                    headerName: 'LastBuyPoint',
                    field: 'LastBuyPoint',
                },
                {
                    headerName: '%LastBuyPoint',
                    field: 'PercentLastBuyPoint',
                },
                {
                    headerName: 'SellPoint',
                    field: 'SellPoint',
                },
                {
                    headerName: '%SellPoint',
                    field: 'PercentSellPoint',
                },
            ]
        }
    }

    changeTab = (key) => {
        if (key === '1') {
            this.setState({
                columnDefs: [
                    {
                        headerName: 'Stock',
                        field: 'Symbol',
                    },
                    {
                        headerName: 'PriceClose',
                        field: 'PriceClose',
                    },
                    {
                        headerName: 'LastBuyPoint',
                        field: 'LastBuyPoint',
                    },
                    {
                        headerName: '%LastBuyPoint',
                        field: 'PercentLastBuyPoint',
                    },
                    {
                        headerName: 'SellPoint',
                        field: 'SellPoint',
                    },
                    {
                        headerName: '%SellPoint',
                        field: 'PercentSellPoint',
                    },
                ]
            })
        } else if (key === '2') {
            this.setState({
                columnDefs: [
                    {
                        headerName: 'Stock',
                        field: 'Symbol',
                    },
                    {
                        headerName: 'KLTB 10ngay',
                        field: 'PercentSellPoint',
                    },
                    {
                        headerName: 'Cao nhat 52W',
                        field: 'PercenCao nhat 52W',
                    },
                    {
                        headerName: 'Thap Nhat 52W',
                        field: 'PercentSellPoint',
                    },
                    {
                        headerName: 'Thay doi 1 nam',
                        field: 'PercentSellPoint',
                    },
                    {
                        headerName: 'CP FREE',
                        field: 'FreeShares',
                    },
                    {
                        headerName: 'Room NN',
                        field: 'LastBuyPoint',
                    },
                    {
                        headerName: 'GTGD/San',
                        field: 'PercentLastBuyPoint',
                    },
                    {
                        headerName: 'KLGD/CP FREE',
                        field: 'SellPoint',
                    },
                ]
            })
        } else if (key === '3') {
            // 
        } else if (key === '4') {
            this.setState({
                columnDefs: [
                    {
                        headerName: 'Stock',
                        field: 'Symbol',
                    },
                    {
                        headerName: 'EPS',
                        field: 'EPS',
                    },
                    {
                        headerName: 'P/E',
                        field: 'PE',
                    },
                    {
                        headerName: 'P/B',
                        field: 'PB',
                    },
                    {
                        headerName: 'ROE',
                        field: 'ROE',
                    },
                    {
                        headerName: 'ROA',
                        field: 'ROA',
                    },
                    {
                        headerName: 'Co tuc tien TB 3 nam',
                        field: 'DividendInCash_03YrAvg',
                    },
                    {
                        headerName: 'Co tuc CP TB 3 nam',
                        field: 'DividendInShares_03YrAvg',
                    },
                ]
            })
        }
    }

    scan = async () => {
        const data = {
            IsFavorite: true,
            startDate: getPreviousDate(this.props.lastUpdatedDate.value),
            endDate: getEndDate(this.props.lastUpdatedDate.value),
        }
        this.gridApi.showLoadingOverlay();
        const res = await this.props.scanStock(data);
        this.gridApi.hideOverlay()
        this.setState({
            rowData: this.mapData(res.data).sort((a, b) => a.Symbol.localeCompare(b.Symbol))
        })
    }

    mapData = (data) => {
        const { companies, stocks, decisiveIndexes, latestFinancialInfo } = this.props;

        each(data, i => {
            i.ICBCode = Number((companies[i.Stock] || {}).ICBCode)
            i.Symbol = (stocks[i.Stock] || {}).Symbol
            i.LowestPoint = (decisiveIndexes[i.Stock] || {}).LowestPoint
            i.LowestPointChange = (i.PriceClose - (decisiveIndexes[i.Stock] || {}).LowestPoint) / (decisiveIndexes[i.Stock] || {}).LowestPoint * 100
            i.LastBuyPoint = (decisiveIndexes[i.Stock] || {}).LastBuyPoint
            i.SellPoint = (decisiveIndexes[i.Stock] || {}).SellPoint
            i.PercentSellPoint = Number(((1 - (i.PriceClose / 1000) / i.SellPoint) * 100).toFixed(1))
            i.PercentLastBuyPoint = Number(((1 - (i.PriceClose / 1000) / i.LastBuyPoint) * 100).toFixed(1))
            i.EPS = Number(Number((latestFinancialInfo[i.Stock] || {}).EPS)).toFixed(0)
            i.PE = Number(Number((latestFinancialInfo[i.Stock] || {}).PE)).toFixed(0)
            i.PS = Number(Number((latestFinancialInfo[i.Stock] || {}).PS)).toFixed(0)
            i.PB = Number(Number((latestFinancialInfo[i.Stock] || {}).PB)).toFixed(0)
            i.ROA = Number(Number((latestFinancialInfo[i.Stock] || {}).ROA) * 100).toFixed(0)
            i.ROE = Number(Number((latestFinancialInfo[i.Stock] || {}).ROE) * 100).toFixed(0)
            i.DividendInCash_03YrAvg = Number(Number((latestFinancialInfo[i.Stock] || {}).DividendInCash_03YrAvg)).toFixed(0)
            i.DividendInShares_03YrAvg = Number(Number((latestFinancialInfo[i.Stock] || {}).DividendInShares_03YrAvg) * 100).toFixed(1)
            i.PriceClose = Number((i.PriceClose / 1000).toFixed(1))
            i.FreeShares = Number(Number((latestFinancialInfo[i.Stock] || {}).FreeShares)).toFixed(0)
            return i
        })
        return data
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.scan()
    };

    renderReport = () => {
        const { rowData } = this.state;

        const groupData = groupBy(rowData, 'ICBCode')
        const data = Object.keys(groupData).map( i => {
            return {
                name: i,
                value: groupData[i].length
            }
        })
        console.log(data);
        return <div>
            <PieChart width={400} height={400}>
                <Pie dataKey="value" isAnimationActive={false} data={data} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
                <Tooltip />
            </PieChart>
        </div>
    }

    render() {
        const { columnDefs, rowData } = this.state;
        console.log(rowData);
        return (
            <div className="AccumulatedAssets height100">
                <div>
                    <Tabs defaultActiveKey="1" onChange={this.changeTab}>
                        <TabPane tab="Tong quan" key="1" />
                        <TabPane tab="Thong ke" key="2" />
                        <TabPane tab="Tin tuc" key="3" />
                        <TabPane tab="Tai chinh" key="4" />
                    </Tabs>
                </div>
                <div>
                    <CustomAgGridReact
                        columnDefs={columnDefs}
                        onGridReady={this.onGridReady}
                        rowData={rowData}
                    />
                </div>
                
                {this.renderReport()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        stocks: get(state, 'stocks'),
        lastUpdatedDate: get(state, 'lastUpdatedDate') || {},
        companies: get(state, 'companies'),
        decisiveIndexes: get(state, 'decisiveIndexes'),
        selectedSymbol: get(state, 'selectedSymbol'),
        latestFinancialInfo: get(state, 'latestFinancialInfo')
    }
}

const mapDispatchToProps = {
    scanStock
}

export default connect(mapStateToProps, mapDispatchToProps)(AccumulatedAssets);
