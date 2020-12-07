import React from 'react';
import { connect } from 'react-redux';
import { get, each } from 'lodash';
import { Tabs } from 'antd';


import CustomAgGridReact from 'components/CustomAgGridReact';
import { getPreviousDate, getEndDate } from 'utils/common';
import { scanStock } from 'reducers/stocks';

const { TabPane } = Tabs;

interface IProps {
    scanStock: any;
    lastUpdatedDate: any;
    companies: any;
    stocks: any;
    decisiveIndexes: any;
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
            // 
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
        const { companies, stocks, decisiveIndexes } = this.props;

        each(data, i => {
            i.ICBCode = Number((companies[i.Stock] || {}).ICBCode)
            i.Symbol = (stocks[i.Stock] || {}).Symbol
            i.LowestPoint = (decisiveIndexes[i.Stock] || {}).LowestPoint
            i.LowestPointChange = (i.PriceClose - (decisiveIndexes[i.Stock] || {}).LowestPoint) / (decisiveIndexes[i.Stock] || {}).LowestPoint * 100
            i.LastBuyPoint = (decisiveIndexes[i.Stock] || {}).LastBuyPoint
            i.SellPoint = (decisiveIndexes[i.Stock] || {}).SellPoint
            i.PercentSellPoint = Number(((1 - (i.PriceClose / 1000) / i.SellPoint) * 100).toFixed(1))
            i.PercentLastBuyPoint = Number(((1 - (i.PriceClose / 1000) / i.LastBuyPoint) * 100).toFixed(1))
            i.EPS = Number((Number(i.EPS)).toFixed(0))
            i.PE = Number((Number(i.PE)).toFixed(1))
            i.PS = Number((Number(i.PS)).toFixed(1))
            i.PB = Number((Number(i.PB)).toFixed(1))
            i.ROA = Number((Number(i.ROA) * 100).toFixed(1))
            i.ROE = Number((Number(i.ROE) * 100).toFixed(1))
            i.PriceClose = Number((i.PriceClose / 1000).toFixed(1))

            return i
        })
        console.log(data);
        return data
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.scan()
    };

    render() {
        const { columnDefs, rowData } = this.state;
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
                <CustomAgGridReact
                    columnDefs={columnDefs}
                    onGridReady={this.onGridReady}
                    rowData={rowData}
                />
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
        selectedSymbol: get(state, 'selectedSymbol')
    }
}

const mapDispatchToProps = {
    scanStock
}

export default connect(mapStateToProps, mapDispatchToProps)(AccumulatedAssets);
