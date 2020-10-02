import ENV from 'ENV';

let config = {
    domain: ENV.DOMAIN || 'http://localhost:8001'
};

export default config;