const { providers } = require('../../config')
const azureAuth = require('./azure-auth')
const developmentAuth = require('./development-auth')

// determines which auth adapter to use based on environment
module.exports = (environemnt) => {
  switch (environemnt) {
    case 'production':
      console.log('Useing production auth');
      return azureAuth(providers.azure_auth);
      break;
    case 'development':
      console.warn('Useing development auth');
      return developmentAuth;
      break;
  }
}
