import request from 'utils/request';
import { StockUrls } from 'utils/api';

const StockService = {
    getListStocks() {
        return request({
            method: 'GET',
            url: StockUrls.getListStocks,
        });
    },
    fetchNews(type, group, startIndex, count, symbol) {
        return request({
            method: 'GET',
            url: StockUrls.fetchNews(type, group, startIndex, count, symbol)
        })
    },
    getYearlyFinancialInfo(symbol) {
        return request({
            method: 'GET',
            url: StockUrls.getYearlyFinancialInfo(symbol)
        })
    },
    getQuarterlyFinancialInfo(symbol) {
        return request({
            method: 'GET',
            url: StockUrls.getQuarterlyFinancialInfo(symbol)
        })
    },
    getLastestFinancialInfo(params=null) {
        return request({
            method: 'GET',
            url: StockUrls.getLastestFinancialInfo(),
            params
        })
    },
    getLastestFinancialReports(symbol, financialType, year, quarter) {
        return request({
            method: 'GET',
            url: StockUrls.getLastestFinancialReports(symbol, financialType, year, quarter)
        })
    },
    getHistoricalQuotes(symbol, startDate, endDate) {
        return request({
            method: 'GET',
            url: StockUrls.getHistoricalQuotes(symbol, startDate, endDate)
        })
    },
    filterStocks(data) {
        return request({
            method: 'POST',
            data,
            url: StockUrls.filterStocks()
        })
    },
    updateStock(data) {
        return request({
            method: 'PATCH',
            data,
            url: StockUrls.updateStock(data.id)
        })
    },
    scanStock(data) {
        return request({
            method: 'POST',
            data,
            url: StockUrls.scanStock()
        })
    },
    getLatest(data) {
        return request({
            method: 'POST',
            data,
            url: StockUrls.getLatest()
        })
    },
    fetchCompanyInfo() {
        return request({
            method: 'GET',
            url: StockUrls.fetchCompanyInfo()
        })
    },
    fetchDecisiveIndexes() {
        return request({
            method: 'GET',
            url: StockUrls.fetchDecisiveIndexes()
        })
    },
    getListUrlGoValue() {
        return request({
            method: 'GET',
            url: StockUrls.getListUrlGoValue()
        })
    }

};

export default StockService;
