import request from 'utils/request';
import { AccountUrls } from 'utils/api';

const AccountService = {
    postAuthToken(data) {
        return request({
            method: 'POST',
            url: AccountUrls.postAuthToken,
            data
        });
    },
    fetchAccount(headers) {
        return request({
            headers,
            method: 'GET',
            url: AccountUrls.fetchAccount,
        });
    },
    fetchAccountPortfolio(headers) {
        return request({
            headers,
            method: 'GET',
            url: AccountUrls.fetchAccountPortfolio,
        });
    },
    fetchAccountAssets(headers) {
        return request({
            headers,
            method: 'GET',
            url: AccountUrls.fetchAccountAssets,
        });
    },
    fetchAccountStocks(headers) {
        return request({
            headers,
            method: 'GET',
            url: AccountUrls.fetchAccountStocks,
        });
    },

};

export default AccountService;