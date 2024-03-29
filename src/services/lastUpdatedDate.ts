import moment from 'moment';

import request from 'utils/request';
import { LastUpdatedDateUrls } from 'utils/api';


const LastUpdatedDateService = {
    getLastUpdatedDate() {
        return request({
            method: 'GET',
            url: LastUpdatedDateUrls.getLastUpdatedDate('LAST_UPDATED_HISTORICAL_QUOTES'),
        });
    },
    updateLastUpdatedDate(data) {
        return request({
            method: 'PUT',
            url: LastUpdatedDateUrls.updateLastUpdatedDate(data.id),
            data: {
                key: data.key,
                value: moment().format('YYYY-MM-DD') + 'T00:00:00Z'
            }
        });
    },

};

export default LastUpdatedDateService;
