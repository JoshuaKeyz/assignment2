/**
 * Dependencies
 */
const crypto = require('crypto');
const config = require('../config')
// Helpers container
const helpers = {};

// Helpers hash function
helpers.hash = (str)=>{
  if(typeof(str) === 'string' && str.length > 0){
    const hash = crypto.createHmac('sha256', config.hasingSecret).update(str).digest('hex');
    return hash;
  }else {
    return false;
  }
};

// Export the helpers 
module.exports = helpers;