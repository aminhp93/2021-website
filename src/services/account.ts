import request from 'utils/request';
import { AccountUrls } from 'utils/api';

const headers = {
    "X-Auth-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJpc3N1ZXIiLCJzdWIiOiJzdWJqZWN0IiwiYXVkIjpbImF1ZGllbmNlIiwiaW9zIiwib25saW5lIiwidHJhZGVhcGkiLCJhdXRoIl0sImV4cCI6MTYwMzAzMTg3MSwibmJmIjoxNjAyOTg4MzcxLCJ0cmFkaW5nRXhwIjowLCJpZGdJZCI6bnVsbCwicm9sZXMiOiJbXSIsImFjY291bnRUeXBlIjoiVW5rbm93biIsImN1c3RvbWVySWQiOiIwMDAxODEzMTA5IiwidXNlcklkIjoibnVsbCIsInZlcnNpb24iOiJWMiIsImN1c3RvbWVyTmFtZSI6IlBo4bqhbSBOZ-G7jWMgTWluaCIsImVtYWlsIjoibWluaHBuLm9yZy5lYzFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhbWluaHA5MyIsInN0YXR1cyI6IkFDVElWQVRFRCJ9.vrQI1fqAhC24EzCqP7mgJejqG01J36q4OU-UM8y--2UA41u5RPcpjMJZD7nAZfror77C0Gy_mUv00etp45dVOoBk84U_TMyrtG8bN1_M7l5AmtaQMCKZZhYDWjsK4T-rvAK9D40YWpEmg7tTxdhIe7UG-EykXFGWxYFCyUzLoK1XqYaHk5KTzFWD7fJamTCuue_r17BMkuyCtJVXX_HhptL05jMug_RXBiBAiHWv9E7HWBGNcQlh5maxTVU5_tJSQO0hQPTl84-W-r5c394lzmirq1-aN7iQW0BoMcLVFafswqUobgDEQE-mEDlFyNTiNVAFMl6qB-rF3L9IjfANCQ",
    "content-type": "application/json"
}

const AccountService = {
    fetchAccount() {
        return request({
            headers,
            method: 'GET',
            url: AccountUrls.fetchAccount,
        });
    },
    fetchAccountPortfolio() {
        return request({
            headers,
            method: 'GET',
            url: AccountUrls.fetchAccountPortfolio,
        });
    },
    fetchAccountAssets() {
        return request({
            headers,
            method: 'GET',
            url: AccountUrls.fetchAccountAssets,
        });
    },
    fetchAccountStocks() {
        return request({
            headers,
            method: 'GET',
            url: AccountUrls.fetchAccountStocks,
        });
    },

};

export default AccountService;