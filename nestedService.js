const logger = require('./logger');

module.exports = () => {
    logger('Inside the beast');    
    return Promise.resolve('Hello World!')
}