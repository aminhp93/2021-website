import { keyBy } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

import { ThunkActionType } from 'store';
import CompanyService from 'services/company';

const stocksSlice = createSlice({
    name: 'companies',
    initialState: {},
    reducers: {
        fetchCompanySuccess: (state, { payload }) => {
            return { ...state, ...payload };
        },
    },
});

export const {
    fetchCompanySuccess,
} = stocksSlice.actions;

export default stocksSlice.reducer;

export const fetchCompany = (data: any): ThunkActionType => async (
    dispatch,
    getStoreValue
) => {
    const response = await CompanyService.fetchCompany()
    const data = keyBy(response.data, 'Stock')
    dispatch(fetchCompanySuccess(data))
}