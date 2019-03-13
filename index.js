/**
 * Dependencies
 */
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
// General server function

const _data = require('./lib/data');

const server = (req, res)=>{
  
  // Get the path which the user entered
  const path = req.url;
  const parsedUrl = url.parse(path, true);
  const trimmedSlashes = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

  // Get the request method
  const method = req.method.toLowerCase();

  // Get the query string sent from the client
  const queryString = parsedUrl.query;

  // Get the headers 
  const headers = req.headers;

  // Get the payload
  let payload = '';
  let decoder = new StringDecoder('utf-8');
  req.on('data', (chunk)=>{
    payload += decoder.write(chunk);
  });

  req.on('end', (chunk)=>{
    payload += decoder.end();

    payload = helpers.parseJsonToObject(payload);
    const dataObj = {
      headers, 
      payload, 
      method, 
      queryString, 
      trimmedSlashes
    }
    
    // Choose the handler this request should go to
    // If one is not found, use the not-found handler
    const choosenHandler = typeof(router[trimmedSlashes]) !== 'undefined' ? 
        router[trimmedSlashes] : handlers.notFound;
    
    choosenHandler(dataObj, function(statusCode, payload){

      // Define default status Code 
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Define the payload
      payload = typeof(payload) === 'object' ? payload : {};
      const payloadStr = JSON.stringify(payload);


      // Send response to the client
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json')
      res.end(payloadStr);

      // returning the response
      console.log('Returning this response ', statusCode, payloadStr)
    });
  })
  
}



const router = {
  'users': handlers.users,
  'tokens': handlers.tokens
}

// Http Server
const httpServer = http.createServer(server);

httpServer.listen(3000, ()=>{
  console.log('Localhost listening at localhost:3000');
});


