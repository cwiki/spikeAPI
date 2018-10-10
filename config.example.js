const { formatError } = require('graphql')
const databases = {
  development: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'database_name'
  },
  production: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'database_name'
  },
  sequelizeConfig: {
    host: null, // cast this to host from db conf
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}
const environment = (process.env.NODE_ENV || 'development').toLowerCase()
const path = __dirname
const port = 9000
const playground = {
  settings: {
    'general.betaUpdates': true,
    'editor.cursorShape': 'line',
    'editor.fontSize': 14,
    'editor.fontFamily': "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
    'editor.theme': 'dark',
    'editor.reuseHeaders': true,
    'prettier.printWidth': 80,
    'request.credentials': 'omit',
    'tracing.hideTracingResponse': true
  }
}
const providers = {
  azure_auth: {
    audience: '<audience from azure>',
    issuer: '<issuer from azure>'
  }
}
// global rate limit configuration
const rateLimit = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5000, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  handler: ({ res }) => {
    res.send(formatError({ message: 'Rate limit reached, please try again later' }))
  }
}

const actionProfile = require('./action-profile')
const actionPermissions = require('./action-permissions')
// development.context -> provide a current context for the user
const development = {
  context: {

  }
}

module.exports = {
  databases,
  environment,
  path,
  port,
  playground,
  providers,
  rateLimit,
  actionProfile,
  actionPermissions,
  development
}
