import base from './base';

let config = {};

if (process.env.ENV === 'production') {

} else {
    config = base
}

export default config;