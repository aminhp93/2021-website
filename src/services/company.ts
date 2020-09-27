import request from '../utils/request';
import { CompanyUrls } from '../config/api';
// import QueryString from 'utils/queryString';

const CompanyService = {
    fetchCompany() {
        return request({
            method: 'GET',
            url: CompanyUrls.fetchCompany()
        })
    }
};

export default CompanyService;
