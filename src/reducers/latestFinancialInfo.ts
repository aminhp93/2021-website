import { createSlice } from '@reduxjs/toolkit';
import { keyBy } from 'lodash';

import { ThunkActionType } from 'store';
import StockService from 'services/stock';


const latestFinancialInfoSlice = createSlice({
    name: 'latestFinancialInfo',
    initialState: null,
    reducers: {
        getLatestFinancialInfoSuccess: (state, { payload }) => {
            return payload
        },
    },
});

export const {
    getLatestFinancialInfoSuccess,
} = latestFinancialInfoSlice.actions;

export default latestFinancialInfoSlice.reducer;

export const getLastestFinancialInfo = (data: string): ThunkActionType => async (dispatch, getStoreValue) => {
    const { selectedSymbol, stocks } = getStoreValue();
    const symbol = data || (stocks[selectedSymbol] || {}).Symbol
    const stock: any = Object.values(stocks).filter((i: any) => i.Symbol === symbol)[0]
    const requestData = (data && stock) ? { stockId: stock.id } : null
    const response = await StockService.getLastestFinancialInfo(requestData)
    const data2 = keyBy(response.data, 'Stock');
    dispatch(getLatestFinancialInfoSuccess(data2));
    return response
}
