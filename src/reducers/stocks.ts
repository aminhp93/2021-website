import { keyBy } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

import { ThunkActionType } from 'store';
import StockService from 'services/stock';

const stocksSlice = createSlice({
    name: 'stocks',
    initialState: {},
    reducers: {
        fetchListStocksSuccess: (state, { payload }) => {
            return { ...state, ...payload };
        },
    },
});

export const {
    fetchListStocksSuccess,
} = stocksSlice.actions;

export default stocksSlice.reducer;

export const fetchListStocks = (): ThunkActionType => async (
    dispatch
) => {
    const response = await StockService.getListStocks();
    const data = keyBy(response.data, 'id');
    dispatch(fetchListStocksSuccess(data));
};

export const fetchNews = (data): ThunkActionType => async () => {
    const { type, group, startIndex, count, symbol } = data;
    const response = await StockService.fetchNews(type, group, startIndex, count, symbol);
    return response
}

export const getYearlyFinancialInfo = (): ThunkActionType => async (
    _,
    getStoreValue
) => {
    const { selectedSymbol, stocks } = getStoreValue();
    const symbol = (stocks[selectedSymbol] || {}).Symbol
    const response = await StockService.getYearlyFinancialInfo(symbol)
    return response
}

export const getQuarterlyFinancialInfo = (): ThunkActionType => async (
    _,
    getStoreValue
) => {
    const { selectedSymbol, stocks } = getStoreValue();
    const symbol = (stocks[selectedSymbol] || {}).Symbol
    const response = await StockService.getQuarterlyFinancialInfo(symbol)
    return response
}

export const getLastestFinancialInfo = (): ThunkActionType => async (
    _,
    getStoreValue
) => {
    const { selectedSymbol, stocks } = getStoreValue();
    const symbol = (stocks[selectedSymbol] || {}).Symbol
    const stock: any = Object.values(stocks).filter((i: any) => i.Symbol === symbol)[0]
    const response = await StockService.getLastestFinancialInfo(stock.id)
    return response
}

export const getLastestFinancialReports = (data: any): ThunkActionType => async (
    _,
    getStoreValue
) => {
    const { selectedSymbol, stocks } = getStoreValue();
    const { financialType, year, quarter } = data;
    const symbol = (stocks[selectedSymbol] || {}).Symbol

    const response = await StockService.getLastestFinancialReports(symbol, financialType, year, quarter)
    return response
}

export const getHistoricalQuotes = (): ThunkActionType => async (
    _,
    getStoreValue
) => {
    const { selectedSymbol, lastUpdatedDate, stocks } = getStoreValue();
    const endDate = moment(lastUpdatedDate.value).format('YYYY-MM-DD');
    const startDate = moment(lastUpdatedDate.value).add(-30, 'days').format('YYYY-MM-DD');
    const symbol = (stocks[selectedSymbol] || {}).Symbol

    const response = await StockService.getHistoricalQuotes(symbol, startDate, endDate)
    return response
}

export const filterStocks = (data: any): ThunkActionType => async () => {
    const response = await StockService.filterStocks(data)
    return response
}

export const updateStock = (data: any): ThunkActionType => async (
    dispatch
) => {

    const response = await StockService.updateStock(data)
    const updatedData = {}
    updatedData[response.data.id] = response.data
    dispatch(fetchListStocksSuccess(updatedData))
    return response
}

export const scanStock = (data: any): ThunkActionType => async () => {
    const dataRequest = {}
    const ALLOW_CONDITION_SEARCH = [
        'Symbol', 'TodayCapital',
        'startDate', 'endDate',
        'MinPrice', 'IsVN30',
        'IsFavorite', 'IsBlackList',
        'ICBCode', 'ChangePrice',
        'checkBlackList', 'checkStrong',
        'IsOnStudy'
    ]
    if (data) {
        const keys = Object.keys(data).filter(i => ALLOW_CONDITION_SEARCH.includes(i))
        keys.forEach(key => {
            dataRequest[key] = data[key]
        })
    }

    const response = await StockService.scanStock(dataRequest)
    return response
}

export const getLatest = (data: any): ThunkActionType => async () => {
    const response = await StockService.getLatest(data)
    return response
}

export const getListUrlGoValue = (): ThunkActionType => async () => {
    const res = await StockService.getListUrlGoValue()
    return res
}
