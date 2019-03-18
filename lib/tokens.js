const _data = require('./data')
const helpers = require('./helpers');
const tokens = {};

tokens.options = (data, callback)=>{
  callback(200);
}

// Post
// Required data: phone, password
// Optional data: none
tokens.post = (data, callback)=> {
  // Sanity checks
  const phone = typeof (data.payload.phone) === 'string' &&
    data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
  const password = typeof (data.payload.password) === 'string' &&
    data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if(phone && password) {
    // Lookup user
    _data.read('users', phone, (err, data)=>{
      if(!err && data) {
        const hashedPassword = helpers.hash(password);
        if(hashedPassword === data.hashedPassword) {
          // Create new token with a random name 
          const tokenId = helpers.createRandomString(20);
          // Set expiration date 1hr in the future
          const expires = Date.now() + 1000 * 60 * 60;

          var tokenObj = {
            phone: phone, 
            id: tokenId, 
            expires: expires
          };
          _data.create('tokens', tokenId, tokenObj, (err)=> {
            if(!err) {
              callback(200, tokenObj);
            } else {
              callback(500, {'Error': 'could not create the user token'})
            }
          });
        }else {
          callback(400, {'Error': 'password did not match the specified user\'s stored password'});
        }
      }else {
        callback(400, {'Error': 'could not find the specified user'})
      }
    })
  }else {
    callback(400, {'Error': 'Missing required fields'});
  }
}

// Get
// Required data: id
// Optional data: none
tokens.get = (data, callback)=> {
  // Check that the id that they sent is valid
  const id = typeof (data.queryString.id) === 'string' &&
    data.queryString.id.trim().length === 20 ? data.queryString.id.trim() : false;
  
  if(id) {
    // Lookup the user
    _data.read('tokens', id, (err, data)=>{
      if(!err && data) {
        callback(200, data);
      } else {
        callback(404, {'Error': 'token doesn\'t exist'})
      }
    })
  }else {
    callback(400, {'Error': 'Missing required fields'});
  }
}

// Put
// Required fields: id, extend
// Optional data: none
tokens.put = (data, callback)=> {
  const id = typeof (data.payload.id) === 'string' &&
    data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  const extend = typeof (data.payload.extend) === 'boolean' &&
    data.payload.extend === true ? true : false;

  if(id && extend) {
    // lookup the token
    _data.read('tokens', id, (err, data)=>{
      if(!err && data) {
        // Check that the token isn't already expired
        if(data.expires > Date.now()) {
          // Set the expiration an hour from now
          data.expires = Date.now() + 1000 * 60 * 60;

          // Store the new updates
          _data.update('tokens', id, data, (err)=>{
            if(!err) {
              callback(200);
            }else {
              callback(500, {'Error': 'could not update the token\'s expiration'})
            }
          })
        }else {
          callback(400, {'Error': 'the token is expired and cannot be extended'})
        }
      }else {
        callback(400, {'Error': 'specified token doesn\'t exist'})
      }
    })
  } else {
    console.log(id, extend);
    callback(400, {'Error': 'missing required fields or fields are invalid'})
  }
}

// Delete
// Required data: id
// Optional data: none
tokens.delete = (data, callback)=> {
  // Check that the phone number is valid
  const id = typeof (data.queryString.id) === 'string' &&
    data.queryString.id.trim().length === 20 ? data.queryString.id.trim() : false;

  if (id) {
    // Lookup the user
    _data.read('tokens', id, (err, data) => {
      if (!err && data) {
        _data.delete('tokens', id, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { 'Error': 'could not delete the specified token' });
          }
        })
      } else {
        callback(400, { 'Error': 'could not find the specified token' })
      }
    })
  } else {
    callback(400, { 'Error': 'Missing required fields' });
  }
}

module.exports = tokens;