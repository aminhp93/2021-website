import config from 'config';

const baseUrl = config.domain;

export const StockUrls = {
    getListStocks: `${baseUrl}/api/Data/Markets/TradingStatistic/`,
    fetchNews: (type, group, startIndex, count, symbol) => {
        if (symbol) {
            return `${baseUrl}/api/Data/News/${type}?startIndex=${startIndex}&count=${count}&symbol=${symbol}`
        } else {
            if (group) {
                return `${baseUrl}/api/Data/News/${type}?group=${group}&startIndex=${startIndex}&count=${count}`
            } else {
                return `${baseUrl}/api/Data/News/${type}?startIndex=${startIndex}&count=${count}`
            }
        }
    },
    getYearlyFinancialInfo: (symbol) => `${baseUrl}/api/Data/Finance/YearlyFinancialInfo/?symbol=${symbol}&fromYear=2016&toYear=2019`,
    getQuarterlyFinancialInfo: (symbol) => `${baseUrl}/api/Data/Finance/QuarterlyFinancialInfo/?symbol=${symbol}&fromYear=2016&fromQuarter=1&toYear=2020&toQuarter=2`,
    getLastestFinancialInfo: (stockId) => `${baseUrl}/api/Data/Finance/LastestFinancialInfo/?stockId=${stockId}`,
    getLastestFinancialReports: (symbol, type = 1, year = 2020, quarter = 0, count = 5) => `${baseUrl}/api/Data/Finance/LastestFinancialReports/?symbol=${symbol}&type=${type}&year=${year}&quarter=${quarter}&count=${count}`,
    getHistoricalQuotes: (symbol, startDate, endDate) => `${baseUrl}/api/Data/Companies/HistoricalQuotes/?symbol=${symbol}&startDate=${startDate}&endDate=${endDate}`,
    filterStocks: () => `${baseUrl}/api/Stock/Filter/`,
    updateStock: (id) => `${baseUrl}/api2/Stock/${id}/`,
    scanStock: () => `${baseUrl}/api/Stock/scan/`,
    getLatest: () => `${baseUrl}/api/Latest/`,
    fetchDecisiveIndexes: () => `${baseUrl}/api/DecisiveIndex/`,
    getListUrlGoValue: () => `https://govalue-prod-tnwwkvxisq-an.a.run.app/api/v1/user_idea/?limit=0&offset=0`
};

export const CompanyUrls = {
    fetchCompany: () => `${baseUrl}/api/Company/`
}

export const LastUpdatedDateUrls = {
    getLastUpdatedDate: (id) => `${baseUrl}/api/config/${id ? `?key=${id}` : ''}`,
    updateLastUpdatedDate: (id) => `${baseUrl}/api/config/${id}/`,
}

export const NoteUrls = {
    getListNotes: `${baseUrl}/api/Note/`,
    updateNote: (noteId) => `${baseUrl}/api/Note/${noteId}/`,
    getNote: (noteId) => `${baseUrl}/api/Note/${noteId}/`
}

export const AccountUrls = {
    fetchAccount: 'https://trade-api.vndirect.com.vn/accounts/0001069456',
    fetchAccountPortfolio: 'https://trade-api.vndirect.com.vn/accounts/v3/0001069456/portfolio',
    fetchAccountAssets: 'https://trade-api.vndirect.com.vn/accounts/v2/0001069456/assets',
    fetchAccountStocks: 'https://trade-api.vndirect.com.vn/accounts/v3/0001069456/stocks'
}