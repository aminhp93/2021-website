import React from 'react';
import { connect } from 'react-redux';

import {
    postAuthToken,
    fetchAccount,
    fetchAccountAssets,
    fetchAccountPortfolio,
    fetchAccountStocks
} from 'reducers/account';

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
    accountStocksObj: any
}

class Account extends React.Component<IProps, IState> {
    constructor(props) {
        super(props)
        this.state = {
            accountObj: {},
            accountAssetsObj: {},
            accountPortfolioObj: {},
            accountStocksObj: []
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

    renderStocks = (data) => {
        if (!data) return;

        return data.sort((a, b) => b.quantity * b.currentPrice - a.quantity * a.currentPrice).map(i => {
            return (
                <div className="Account-Stocks-item Account-Stocks-item-Stock" key={i.symbol}>
                    <div>{i.symbol}</div>
                    <div key={i.symbol}>
                        <div className="flex flex-sp-bt"><div>available</div><div className="Account-Stocks-item-value">{formatNumber(i.available)}</div></div>
                        <div className="flex flex-sp-bt"><div>availableV2</div><div className="Account-Stocks-item-value">{formatNumber(i.availableV2)}</div></div>
                        {/* <div className="flex flex-sp-bt"><div>blocked</div><div className="Account-Stocks-item-value">{i.blocked}</div></div> */}
                        <div className="flex flex-sp-bt"><div>boCostPrice</div><div className="Account-Stocks-item-value">{formatNumber(i.boCostPrice)}</div></div>
                        {/* <div className="flex flex-sp-bt"><div>cashDividend</div><div className="Account-Stocks-item-value">{i.cashDividend}</div></div> */}
                        <div className="flex flex-sp-bt"><div>costPrice</div><div className="Account-Stocks-item-value">{formatNumber(i.costPrice)}</div></div>
                        <div className="flex flex-sp-bt"><div>currentPrice</div><div className="Account-Stocks-item-value">{formatNumber(i.currentPrice)}</div></div>
                        {/* <div className="flex flex-sp-bt"><div>df</div><div className="Account-Stocks-item-value">{i.df}</div></div> */}
                        {/* <div className="flex flex-sp-bt"><div>exercisedCA</div><div className="Account-Stocks-item-value">{i.exercisedCA}</div></div> */}
                        {/* <div className="flex flex-sp-bt"><div>matchInday</div><div className="Account-Stocks-item-value">{i.matchInday}</div></div> */}
                        {/* <div className="flex flex-sp-bt"><div>mortgage</div><div className="Account-Stocks-item-value">{i.mortgage}</div></div> */}
                        <div className="flex flex-sp-bt"><div>quantity</div><div className="Account-Stocks-item-value">{formatNumber(i.quantity)}</div></div>
                        {/* <div className="flex flex-sp-bt"><div>secure</div><div className="Account-Stocks-item-value">{i.secure}</div></div> */}
                        {/* <div className="flex flex-sp-bt"><div>sellremain</div><div className="Account-Stocks-item-value">{i.sellremain}</div></div> */}
                        {/* <div className="flex flex-sp-bt"><div>stockDividend</div><div className="Account-Stocks-item-value">{i.stockDividend}</div></div> */}
                        <div className="flex flex-sp-bt"><div>t0</div><div className="Account-Stocks-item-value">{formatNumber(i.t0)}</div></div>
                        <div className="flex flex-sp-bt"><div>t1</div><div className="Account-Stocks-item-value">{formatNumber(i.t1)}</div></div>
                        <div className="flex flex-sp-bt"><div>t2</div><div className="Account-Stocks-item-value">{formatNumber(i.t2)}</div></div>
                        {/* <div className="flex flex-sp-bt"><div>unexercisedCA</div><div className="Account-Stocks-item-value">{i.unexercisedCA}</div></div> */}
                        {/* <div className="flex flex-sp-bt"><div>waitfortrade</div><div className="Account-Stocks-item-value">{i.waitfortrade}</div></div> */}
                        {/* <div className="flex flex-sp-bt"><div>waitfortransfer</div><div className="Account-Stocks-item-value">{i.waitfortransfer}</div></div> */}
                    </div>
                </div>
            )
        })
    }

    renderStockPortfolio = (data) => {
        if (!data) return;
        return data.sort((a, b) => b.currentValue - a.currentValue).map(i => {
            return (
                <div className="Account-Portfolio-item Account-Portfolio-item-Stock" key={i.symbol}>
                    <div>{i.symbol}</div>
                    <div key={i.symbol}>
                        <div className="flex flex-sp-bt"><div>currentPrice</div><div className="Account-Portfolio-item-value">{formatNumber(i.currentPrice)}</div></div>
                        <div className="flex flex-sp-bt"><div>boCostPrice</div><div className="Account-Portfolio-item-value">{formatNumber(i.boCostPrice)}</div></div>
                        <div className="flex flex-sp-bt"><div>costPrice</div><div className="Account-Portfolio-item-value">{formatNumber(i.costPrice)}</div></div>
                        <div className="flex flex-sp-bt"><div>quantity</div><div className="Account-Portfolio-item-value">{formatNumber(i.quantity)}</div></div>
                        <div className="flex flex-sp-bt"><div>quantityV2</div><div className="Account-Portfolio-item-value">{formatNumber(i.quantityV2)}</div></div>
                        {/* <div className="flex flex-sp-bt"><div>tradingPlace</div><div className="Account-Portfolio-item-value">{formatNumber(i.tradingPlace)}</div></div> */}
                        <div className="flex flex-sp-bt"><div>currentValue</div><div className="Account-Portfolio-item-value">{formatNumber(i.currentValue)}</div></div>
                        <div className="flex flex-sp-bt"><div>cost</div><div className="Account-Portfolio-item-value">{formatNumber(i.cost)}</div></div>
                        <div className="flex flex-sp-bt"><div>gainLoss</div><div className={`Account-Portfolio-item-value white ${i.gainLoss > 0 ? "bg-green" : "bg-red" }`}>{formatNumber(i.gainLoss)}</div></div>
                        <div className="flex flex-sp-bt"><div>gainLossRatio</div><div className="Account-Portfolio-item-value">{formatNumber((i.gainLossRatio * 100).toFixed(1))}%</div></div>
                    </div>
                </div>
            )
        })
    }

    render() {
        const {
            accountObj,
            accountAssetsObj,
            accountPortfolioObj,
            accountStocksObj
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

        return (
            <div className="Account flex">
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
                    <div className="Account-Assets-item"><div>originWithdrawal</div> {formatNumber(originWithdrawal)}</div>
                    <div className="Account-Assets-item"><div>pp0</div> {formatNumber(pp0)}</div>
                    <div className="Account-Assets-item"><div>realAccountMoney</div> {formatNumber(realAccountMoney)}</div>
                    <div className="Account-Assets-item"><div>withdrawal</div> {formatNumber(withdrawal)}</div>
                    <div className="Account-Assets-item"><div>balance</div> {formatNumber(balance)}</div>

                </div>

                <div className="flex-1 Account-Portfolio">
                    <div>Portfolio</div>
                    <div className="Account-Portfolio-item"><div>totalCost</div> {formatNumber(totalCost)}</div>
                    <div className="Account-Portfolio-item"><div>totalCurrentValue</div> {formatNumber(totalCurrentValue)}</div>
                    <div className="Account-Portfolio-item"><div>profit</div><span className={`white ${profit > 0 ? 'bg-green' : 'bg-red'}`}>{formatNumber(profit)}</span></div>
                    <div className="Account-Portfolio-item"><div>ratio</div> {formatNumber((ratio * 100).toFixed(1))}%</div>
                    {this.renderStockPortfolio(stocks)}
                    
                </div>

                <div className="flex-1 Account-Stocks">
                    <div>Stocks</div>
                    {this.renderStocks(accountStocksObj)}
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
