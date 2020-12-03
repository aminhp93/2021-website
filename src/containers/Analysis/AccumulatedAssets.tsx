import React from 'react';
import { connect } from 'react-redux';
import { get, each } from 'lodash';

import CustomAgGridReact from 'components/CustomAgGridReact';
import { getPreviousDate, getEndDate } from 'utils/common';
import { scanStock } from 'reducers/stocks';

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

    scan = async () => {
        const data = {
            ChangePrice: -100,
            IsFavorite: true,
            MinPrice: -1,
            TodayCapital: -1000000000,
            checkBlackList: true,
            checkStrong: true,
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
            i.LastBuyPoint = (decisiveIndexes[i.Stock] || {}).LastBuyPoint * 1000
            i.SellPoint = (decisiveIndexes[i.Stock] || {}).SellPoint * 1000
            i.PercentSellPoint = ((1 - i.PriceClose / i.SellPoint) * 100).toFixed(1)
            i.PercentLastBuyPoint = ((1 - i.PriceClose / i.LastBuyPoint) * 100).toFixed(1)
            return i
        })
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
