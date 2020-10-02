import { keyBy } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

import { ThunkActionType } from 'store';
import StockService from 'services/stock';

const stocksSlice = createSlice({
    name: 'decisiveIndexes',
    initialState: {},
    reducers: {
        fetchDecisiveIndexesSuccess: (state, { payload }) => {
            return { ...state, ...payload };
        },
    },
});

export const {
    fetchDecisiveIndexesSuccess,
} = stocksSlice.actions;

export default stocksSlice.reducer;

export const fetchDecisiveIndexes = (data: any): ThunkActionType => async (
    dispatch,
    getStoreValue
) => {
    const response = await StockService.fetchDecisiveIndexes()
    const data = keyBy(response.data, 'Stock')
    dispatch(fetchDecisiveIndexesSuccess(data))
}