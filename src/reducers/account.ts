

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

export const postAuthToken = (): ThunkActionType => async () => {
    const data = {
        password: "Miamikki521",
        username: "aminhp93"
    }
    const res = await AccountService.postAuthToken(data)
    return res
}

export const fetchAccount = (token): ThunkActionType => async () => {
    const headers = {
        'X-Auth-Token': token
    }
    const res = await AccountService.fetchAccount(headers)
    return res
}

export const fetchAccountPortfolio = (token): ThunkActionType => async () => {
    const headers = {
        'X-Auth-Token': token
    }
    const res = await AccountService.fetchAccountPortfolio(headers)
    return res
}

export const fetchAccountAssets = (token): ThunkActionType => async () => {
    const headers = {
        'X-Auth-Token': token
    }
    const res = await AccountService.fetchAccountAssets(headers)
    return res
}

export const fetchAccountStocks = (token): ThunkActionType => async () => {
    const headers = {
        'X-Auth-Token': token
    }
    const res = await AccountService.fetchAccountStocks(headers)
    return res
}