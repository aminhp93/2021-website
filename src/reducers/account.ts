

import { createSlice } from '@reduxjs/toolkit';

import { ThunkActionType } from 'store';
import AccountService from 'services/account';

const accountSlice = createSlice({
    name: 'account',
    initialState: {},
    reducers: {},
});

// export const {} = accountSlice.actions;

export default accountSlice.reducer;

export const fetchAccount = (): ThunkActionType => async () => {
    const res = await AccountService.fetchAccount()
    return res
}

export const fetchAccountPortfolio = (): ThunkActionType => async () => {
    const res = await AccountService.fetchAccountPortfolio()
    return res
}

export const fetchAccountAssets = (): ThunkActionType => async () => {
    const res = await AccountService.fetchAccountAssets()
    return res
}

export const fetchAccountStocks = (): ThunkActionType => async () => {
    const res = await AccountService.fetchAccountStocks()
    return res
}