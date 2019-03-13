/**
 * Dependencies
 */
const crypto = require('crypto');
const config = require('./config')
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

// Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str) {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
}

// Export the helpers 
module.exports = helpers;