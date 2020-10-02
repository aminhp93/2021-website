import request from 'utils/request';
import { CompanyUrls } from 'utils/api';

const CompanyService = {
    fetchCompany() {
        return request({
            method: 'GET',
            url: CompanyUrls.fetchCompany()
        })
    }
};

export default CompanyService;
