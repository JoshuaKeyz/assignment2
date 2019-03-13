
const environments = {};

environments.staging = {
  httpPort: 3000, 
  hashingSecret: 'This is a secret'
}

environments.production = {
  httpsPort: 3001, 
  hashingSecret: 'This is a secret'
}

const curEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.trim() : '';
const envToExp = typeof(environments[curEnv]) === 'object' ? environments[curEnv] : environments.staging;

// Export the module
module.exports = envToExp;
