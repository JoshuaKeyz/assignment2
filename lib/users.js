const _data = require('./data');
const users = {}
const helpers = require('./helpers');
// Users get
users.get = (data, callback)=>{
  // Sanity checks
  const firstName = typeof(data.payload.firstName) === 'string' &&
    data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) === 'string' &&
    data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof(data.payload.phone) === 'string' &&
    data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) === 'string' &&
    data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const tosAgrement = typeof(data.payload.tosAgreement) === 'boolean' &&
    data.payload.tosAgreement === true ? true : false;

  if(firstName && lastName && phone && password && tosAgrement) {
    // Make sure that the user doesn't already exist
    _data.read('users', phone, (err, data)=>{
      if(!err) {
        // Hash the password
        const hashedPassword = helpers.hash(password);
      }else {
        callback(400, {'Error': 'user already exists'})
      }
    })
  }else {
    callback(400, {'Error': 'Missing required fields'});
  }
  
}

// Users put
users.put = (data, callback)=>{

}

// Users delete
users.delete = (data, callback)=>{

}

// Users post
users.post = (data, callback)=>{

}


// export the users 
module.exports = users;