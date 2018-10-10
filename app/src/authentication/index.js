const { expressAdapter } = require('./azure-auth')
const developmentAuth = require('./development-auth')

// determines which auth adapter to use based on environment
module.exports = (environemnt) => {
  switch (environemnt) {
    case 'producton':
      return expressAdapter
    case 'development':
      return developmentAuth
  }
}
