const hosts = [
  '127.0.0.1:3000',
  'localhost:3000'
]

const environment = (process.env.NODE_ENV || 'production').toLowerCase()

const databases = {
  allcores: {
    'connectionLimit' : 20,
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'test_db',
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
    res.send({ 'err': 'Rate limit reached, please try again later' })
  }
}

module.exports = {
  databases,
  environment,
  hosts,
  providers,
  rateLimit
}
