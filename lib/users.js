const _data = require('./data');
const users = {}
const helpers = require('./helpers');
// Users get

users.options = (data, callback)=>{
  callback(200);
}
users.post = (data, callback) => {
  // Sanity checks
  console.log(data);
  const firstName = typeof (data.payload.firstName) === 'string' &&
    data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof (data.payload.lastName) === 'string' &&
    data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof (data.payload.phone) === 'string' &&
    data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
  const password = typeof (data.payload.password) === 'string' &&
    data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const tosAgrement = typeof (data.payload.tosAgreement) === 'boolean' &&
    data.payload.tosAgreement === true ? true : false;

  if (firstName && lastName && phone && password && tosAgrement) {
    // Make sure that the user doesn't already exist

    _data.read('users', phone, (err, data) => {
      if (err) {
        // Hash the password
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          // Create the user object
          const userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashedPassword': hashedPassword,
            'tosAgreement': true
          };

          // Store the user
          _data.create('users', phone, userObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { 'Error': 'Could not create the new user' });
            }
          })
        }

      } else {
        callback(400, { 'Error': 'user already exists' })
      }
    })
  } else {
    callback(400, { 'Error': 'Missing required fields' });
  }

}

// Users get
// Required data: phone
// Optional data: none
users.get = (data, callback) => {
  const phone = typeof (data.queryString.phone) === 'string' &&
    data.queryString.phone.trim().length === 10 ? data.queryString.phone.trim() : false;

  if (phone) {

    // Get the token from the header
    const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
    
    helpers._verifyTokens(token, phone, (tokenIsValid) => {
      console.log(tokenIsValid);
      if (tokenIsValid) {
        // Lookup the user
        _data.read('users', phone, (err, data) => {
          if (!err && data) {
            // Remove the hashed password from the user object before 
            // returning it to the requester
            delete data.hashedPassword;
            console.log(typeof data);
            callback(200, data);
          } else {
            callback(404, { 'Error': 'user doesn\'t exist' })
          }
        })
      } else {
        callback(403, { 'Error': 'Missing required token in header or the token is invalid' })
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required fields' });
  }
}

// Users put
// Required data: phone
// Optional data: firstName, lastName, password
// At least one must be specified
users.put = (data, callback) => {
  // Check for the required field
  const phone = typeof (data.payload.phone) === 'string' &&
    data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;

  // Check for the optional fields
  const firstName = typeof (data.payload.firstName) === 'string' &&
    data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof (data.payload.lastName) === 'string' &&
    data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const password = typeof (data.payload.password) === 'string' &&
    data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if the phone is invalid
  if (phone) {
    // Error if nothing is sent to update
    if (firstName || lastName || password) {
      const token = typeof (data.headers.token) === 'string' ? data.headers.token : false
      helpers._verifyTokens(token, phone, (tokenIsValid) => {
        if (tokenIsValid) {
          // Lookup the user
          _data.read('users', phone, (err, data) => {
            if (!err && data) {
              // Update the fields neccessary
              if (firstName) {
                data.firstName = firstName;
              }

              if (lastName) {
                data.lastName = lastName;
              }

              if (password) {
                data.password = helpers.hash(password)
              }

              // Store the new updates
              _data.update('users', phone, data, (err) => {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { 'Error': 'Could not update the user' });
                }
              })
            } else {
              callback(400, { 'Error': 'user doesn\'t exist' })
            }
          })
        } else {
          callback(403, { 'Error': 'Missing required token in header or token is invalid' })
        }
      });
    } else {
      callback(400, { 'Error': 'Missing field to update' });
    }
  } else {
    callback(400, { 'Error': 'Missing required field' })
  }
}

// Users delete
// Required field: phone
// Delete any other data files associated with this user
users.delete = (data, callback) => {
  // Check that the phone number is valid
  const phone = typeof (data.queryString.phone) === 'string' &&
    data.queryString.phone.trim().length === 10 ? data.queryString.phone.trim() : false;

  if (phone) {
    const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
    helpers._verifyTokens(token, phone, (tokenIsValid) => {
      if (tokenIsValid) {
        // Lookup the user
        _data.read('users', phone, (err, data) => {
          if (!err && data) {
            _data.delete('users', phone, (err) => {
              if (!err) {
                callback(200);
              } else {
                callback(500, { 'Error': 'could not delete the specified user' });
              }
            })
          } else {
            callback(400, { 'Error': 'could not find the specified user' })
          }
        })
      } else {
        callback(403, { 'Error': 'Missing required token in header or token is invalid' })
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required fields' });
  }
}


// export the users 
module.exports = users;