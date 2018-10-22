const jwt = require('jsonwebtoken')

/**
 * Azure Auth is a small library that extracts JWT's from the authoriztion header
 * Keys are downloaded from MSFT and cached
 * The x5t is pulled from the jwt
 * The x5t is searched for
 *     NOT FOUND: Keys are refreshed
 * NOT FOUND: Error
 * else FOUND: verification attempted > Error|token assignment
 */

// used to reduce server side calls to MSFT key end point
const keyCache = new Map()
let verifyOptions = {}

/**
 * Verifies Token JS
 * @param token // Bearer token (should not include bearer text)
 * @param x5cString // MSFT decoder key
 * @param {audience, issuer} verifyOptions
 */
function validate(token, x5cString, verifyOptions) {
  const publicKey = '-----BEGIN CERTIFICATE-----\n' + x5cString + '\n-----END CERTIFICATE-----'
  let verifiedToken
  verifiedToken = jwt.verify(token, publicKey, verifyOptions)
  if (!verifiedToken) throw Error('Could not verify Token')
  return verifiedToken
}

/**
 * used to store keys, on first use. Keys can be retrieved and force updated
 * by default request keys will pull from the cache if it exists.
 * They DO NOT expire. instead when when the keys are forced! to refresh they will retrieve new keys
 * This will cut down on the number of server to server auth requests
 * @param {*} url
 * @param {*} force
 * @return {keys: {}}
 */
function requestKeys(url, force = false) {
  url = url || 'https://login.microsoftonline.com/common/discovery/keys'
  return new Promise((resolve, reject) => {
    if (keyCache.has(url) && !force) {
      // retrieves data from cache instead
      resolve(keyCache.get(url))
    } else {
      // retrieves keys from server
      const lib = url.startsWith('https') ? require('https') : require('http')
      const request = lib.get(url, (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load page, status code: ' + response.statusCode))
        }
        const body = []
        response.on('data', (chunk) => body.push(chunk))
        response.on('end', () => {
          const output = JSON.parse(body.join(''))
          keyCache.set(url, output)
          resolve(output)
        })
      })
      request.on('error', (err) => reject(err))
    }
  })
}

/**
 * Retrieves the x5t nexted in keys
 * @throws Error
 * @param {*} keys
 * @param token
 */
function findX5C(keys, token) {
  const jwtHeader = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString('ascii'))
  if (!jwtHeader.hasOwnProperty('x5t')) throw Error('x5t not present on JWT')
  let found = keys.find(key => key.x5t === jwtHeader.x5t)
  return (found && found.hasOwnProperty('x5c')) ? found.x5c : ''
}

/**
 * Retrieves the x5t nexted in keys
 * @param token
 * @param issuer
 * @return boolean
 */
function checkIssuer(token, issuer) {
  const splitToken = token.split('.')
  if (typeof splitToken[1] === undefined) return false
  const jwtHeader = JSON.parse(Buffer.from(splitToken[1], 'base64').toString('ascii'))
  if (!jwtHeader.hasOwnProperty('iss')) return false
  return (jwtHeader.iss === issuer)
}

/**
 * handles azure authentication
 * @param {!string} token
 * @throws error
 * @returns {Object} jwt
 */
async function authorizeToken(token) {
  try {
    // attempts to find x5t twice
    let keys = await requestKeys()
    let x5c = findX5C(keys.keys, token)
    if (!x5c) {
      keys = await requestKeys(null, true)
      x5c = findX5C(keys.keys, token)
    }
    return validate(token, x5c, verifyOptions)
  } catch (err) {
    throw err
  }
}

/**
 * Adapter straps the azure authentication to a express request
 * The adapter accesses the authoriztion header and removes the 'bearer ' string
 * On success the token is saved to req.locals.jwt
 *
 * @param {*} req
 * @param {*} res
 * @callback next
 */
async function expressAdapter(req, res, next) {
  if (!req.headers.authorization) {
    next()
  } else {
    // get token remove bearer text
    const bearer = req.headers.authorization
    const token = bearer.substr('bearer '.length, bearer.length)
    try {
      const jwt = await authorizeToken(token)
      if (!req.locals) req.locals = {}
      req.locals.jwt = jwt
      next()
    } catch (err) {
      // throw error if validation failure
      console.error(err)
      res.statusCode = 401
      res.set('Content-Type', 'text/json')
      res.json({ error: err.message })
    }
  }
}

/**
 * Azure Auth
 * Authoriztion headers are pulled from the req variable
 * @param {!Object} options configuration options
 * @return {function} express api
 */
module.exports = (options) => {
  verifyOptions = options
  return expressAdapter
}
