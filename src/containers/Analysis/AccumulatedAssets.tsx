import React from 'react';
import { connect } from 'react-redux';
import { get, groupBy } from 'lodash';
import { Tabs } from 'antd';

import CustomAgGridReact from 'components/CustomAgGridReact';
import { getPreviousDate, getEndDate } from 'utils/common';
import { scanStock } from 'reducers/stocks';

import { PieChart, Pie, Tooltip } from 'recharts';

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
                        field: '',
                    },
                    {
                        headerName: 'Cao nhat 52W',
                        field: '',
                    },
                    {
                        headerName: 'Thap Nhat 52W',
                        field: '',
                    },
                    {
                        headerName: 'Thay doi 1 nam',
                        field: '',
                    },
                    {
                        headerName: 'CP FREE',
                        field: 'FreeShares',
                    },
                    {
                        headerName: 'Room NN',
                        field: '',
                    },
                    {
                        headerName: 'GTGD/San',
                        field: '',
                    },
                    {
                        headerName: 'KLGD/CP FREE',
                        field: '',
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
            ChangePrice: -100,
            MinPrice: -1,
            TodayCapital: -1000000000,
            checkBlackList: true,
            checkStrong: true
        }
        this.gridApi.showLoadingOverlay();
        const res = await this.props.scanStock(data);
        this.gridApi.hideOverlay()
        this.setState({
            rowData: res
        })
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
        return <div>
            <PieChart width={400} height={400}>
                <Pie dataKey="value" isAnimationActive={false} data={data} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
                <Tooltip />
            </PieChart>
        </div>
    }

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
