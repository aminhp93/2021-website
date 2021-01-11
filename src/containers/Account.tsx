import React from 'react';
import { connect } from 'react-redux';

import {
    postAuthToken,
    fetchAccount,
    fetchAccountAssets,
    fetchAccountPortfolio,
    fetchAccountStocks
} from 'reducers/account';

import CustomAgGridReact from 'components/CustomAgGridReact';
import { formatNumber } from 'utils/common';

interface IProps {
    postAuthToken: any,
    fetchAccount: any,
    fetchAccountAssets: any,
    fetchAccountPortfolio: any,
    fetchAccountStocks: any,
}

interface IState {
    accountObj: any,
    accountAssetsObj: any,
    accountPortfolioObj: any,
    accountStocksObj: any,
    columnDefs: any,
}

class Account extends React.Component<IProps, IState> {
    gridApi: any;
    gridColumnApi: any;

    constructor(props) {
        super(props)
        this.state = {
            accountObj: {},
            accountAssetsObj: {},
            accountPortfolioObj: {},
            accountStocksObj: [],
            columnDefs: [
                {
                    headerName: 'symbol',
                    field: 'symbol',
                },
                {
                    headerName: 'currentPrice',
                    field: 'currentPrice',
                    type: 'rightAligned',
                    cellRenderer: (params) => {
                        if (params.data && params.data.currentPrice) {
                            const div = document.createElement("div");
                            div.innerText = formatNumber(params.data.currentPrice)
                            return div
                        }
                    }
                },
                {
                    headerName: 'costPrice',
                    field: 'costPrice',
                    type: 'rightAligned',
                    cellRenderer: (params) => {
                        if (params.data && params.data.costPrice) {
                            const div = document.createElement("div");
                            div.innerText = formatNumber(params.data.costPrice)
                            return div
                        }
                    }
                },
                {
                    headerName: 'quantity',
                    field: 'quantity',
                    type: 'rightAligned',
                    cellRenderer: (params) => {
                        if (params.data && params.data.quantity) {
                            const div = document.createElement("div");
                            div.innerText = formatNumber(params.data.quantity)
                            return div
                        }
                    }
                },
                {
                    headerName: 'currentValue',
                    field: 'currentValue',
                    type: 'rightAligned',
                    cellRenderer: (params) => {
                        if (params.data && params.data.currentValue) {
                            const div = document.createElement("div");
                            div.innerText = formatNumber(params.data.currentValue)
                            return div
                        }
                    }
                },
                {
                    headerName: 'cost',
                    field: 'cost',
                    type: 'rightAligned',
                    cellRenderer: (params) => {
                        if (params.data && params.data.cost) {
                            const div = document.createElement("div");
                            div.innerText = formatNumber(params.data.cost)
                            return div
                        }
                    }
                },
                {
                    headerName: 'gainLoss',
                    field: 'gainLoss',
                    type: 'rightAligned',
                    cellRenderer: (params) => {
                        if (params.data && params.data.gainLoss) {
                            const div = document.createElement("div");
                            div.innerText = formatNumber(params.data.gainLoss.toFixed(0))
                            return div
                        }
                    }
                },
                {
                    headerName: 'gainLossRatio',
                    field: 'gainLossRatio',
                    type: 'rightAligned',
                    cellRenderer: (params) => {
                        if (params.data && params.data.gainLossRatio) {
                            const div = document.createElement("div");
                            div.innerText = Number(params.data.gainLossRatio * 100).toFixed(2)
                            div.className = params.data.gainLossRatio > 0 ? 'green' : 'red'

                            return div
                        }
                    }
                }
            ],
        }
    }
    
    async componentDidMount() {
        if (window.location.pathname !== "/stickies") {
            const a = document.querySelector(".lm_goldenlayout.lm_item.lm_root");
            a && a.remove();
        }
        const res = await this.props.postAuthToken()
        const res1 = await this.props.fetchAccount(res.data.token)
        const res2 = await this.props.fetchAccountAssets(res.data.token)
        const res3 = await this.props.fetchAccountPortfolio(res.data.token)
        const res4 = await this.props.fetchAccountStocks(res.data.token)
        this.setState({
            accountObj: res1.data.account,
            accountAssetsObj: res2.data,
            accountPortfolioObj: res3.data,
            accountStocksObj: res4.data.stocks
        })
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    };

    render() {
        const {
            accountObj,
            accountAssetsObj,
            accountPortfolioObj,
            accountStocksObj,
            columnDefs
        } = this.state;

        const {
            accountNumber,
            fullName,
            phoneNumber,
            customerId
        } = accountObj;

        const {
            balance,
            cashAvailable,
            depositFeeTotal,
            marketValueOfShares,
            nav,
            netAssetValue,
            originWithdrawal,
            pp0,
            realAccountMoney,
            withdrawal
        } = accountAssetsObj;

        const {
            profit,
            ratio,
            stocks,
            totalCost,
            totalCurrentValue
        } = accountPortfolioObj;

        const rowData = (stocks || []).sort((a, b) => b.currentValue - a.currentValue)
        return (
            <div className="Account flex">
                <div className="flex">
                    <div className="flex-1 Account-Account">
                        <div>Account</div>
                        <div className="Account-Account-item"><div>accountNumber</div> {accountNumber}</div>
                        <div className="Account-Account-item"><div>customerId</div> {customerId}</div>
                        <div className="Account-Account-item"><div>fullName</div> {fullName}</div>
                        <div className="Account-Account-item"><div>phoneNumber</div> {phoneNumber}</div>
                    </div>

                    <div className="flex-1 Account-Assets">
                        <div>Asset</div>
                        
                        <div className="Account-Assets-item"><div>netAssetValue</div> {formatNumber(netAssetValue)}</div>
                        <div className="Account-Assets-item"><div>marketValueOfShares</div> {formatNumber(marketValueOfShares)}</div>
                        <div className="Account-Assets-item"><div>cashAvailable</div> {formatNumber(cashAvailable)}</div>
                        <hr/>
                        <div className="Account-Assets-item"><div>nav</div> {formatNumber(nav)}</div>
                        <div className="Account-Assets-item"><div>depositFeeTotal</div> {formatNumber(depositFeeTotal)}</div>
                        {/* <div className="Account-Assets-item"><div>originWithdrawal</div> {formatNumber(originWithdrawal)}</div> */}
                        {/* <div className="Account-Assets-item"><div>pp0</div> {formatNumber(pp0)}</div> */}
                        {/* <div className="Account-Assets-item"><div>realAccountMoney</div> {formatNumber(realAccountMoney)}</div> */}
                        <div className="Account-Assets-item"><div>withdrawal</div> {formatNumber(withdrawal)}</div>
                        {/* <div className="Account-Assets-item"><div>balance</div> {formatNumber(balance)}</div> */}

                    </div>

                    <div className="flex-1 Account-Portfolio">
                        <div>Portfolio</div>
                        <div className="Account-Portfolio-item"><div>totalCost</div> {formatNumber(totalCost)}</div>
                        <div className="Account-Portfolio-item"><div>totalCurrentValue</div> {formatNumber(totalCurrentValue)}</div>
                        <div className="Account-Portfolio-item"><div>profit</div><span className={`white ${profit > 0 ? 'bg-green' : 'bg-red'}`}>{formatNumber(profit)}</span></div>
                        <div className="Account-Portfolio-item"><div>ratio</div> {formatNumber((ratio * 100).toFixed(1))}%</div>
                        
                    </div>
                </div>
                <div>
                    <CustomAgGridReact
                        columnDefs={columnDefs}
                        onGridReady={this.onGridReady}
                        rowData={rowData}
                    />
                </div>
                
            </div>

        )
    }
}


const mapDispatchToProps = {
    fetchAccount,
    fetchAccountAssets,
    fetchAccountPortfolio,
    fetchAccountStocks,
    postAuthToken
}

export default connect(null, mapDispatchToProps)(Account);
