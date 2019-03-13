/**
 * Dependencies
 */
const _users = require('./users');
const handlers = {}
handlers.users = (data, callback)=>{
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    _users[data.method](data, callback);
  }else {
    callback(405);
  }
}

handlers.notFound = (data, callback)=>{
  callback(404);
}
module.exports = handlers;