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
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
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

// Create a string of random alpha numeric characters of a given length
helpers.createRandomString = (len)=> {
  const strLen = typeof(len) === 'number' && len > 0 ? len : false;
  if(strLen) {
    // Define all the possible characters
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Create the final string
    let str = '';
    for(let i = 0; i < len; i++) {
      // Get a random character from the possible characters string
      let randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      // Append this character to the final string
      str += randomChar;
    }
    return str;
  } else {
    return false;
  }
}
// Verify tokens
helpers._verifyTokens = (id, phone, callback)=> {
  // Lookup the token
  require('./data').read('tokens', id, (err, data)=>{
    if(!err && data) {
      // Check that the token is for the given user and has not expired;
      if(data.phone === phone && data.expires > Date.now()){
        callback(true);
      } else {
        callback(false);
      }
    }else {
      callback(false)
    }
  })
}
// Export the helpers 
module.exports = helpers;