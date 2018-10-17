const authentication = require('./authentication') // azure ACTIVE DIRECTORY AUTH
const logger = require('./logger') // winston logger
const spike = require('./spike') // mysql interface
const asky = require('./asky')
const { allcores } = require('../app/models/connections')

/**
 * express middleware that adds json formatting
 * @param {*} _ requiest (not used)
 * @param {*} res response
 * @param {*} next next
 */
function sendJSON(_, res, next) {
  /**
   * Logs and outputs a response to the express client
   * @param {Object|string} err Error 
   * @param {*} data Return payload
   * @param {*} meta Other info
 */
  res.sendJSON = function (err, data, meta) {
    if (!err) err = undefined
    if (err) {
      this.status(500)
      err = { level: err.level || 'info', message: err.message || err }
      logger.log(err.level, err.message)
    }
    this.send({ err, data, meta })
  }
  next()
}

/**
 * Permission decorator for express methods
 * @param {!Object<Asky>} asky Object
 */
function askyDecorator(asky) {
  /**
   * @param {!string} method ask method name
   * @param {!string} action ask action name
   * @param {!function} wrapped callback route function to be called
   */
  return function (method, action, wrapped) {
    if (!['create', 'read', 'update', 'delete'].includes(method)) {
      throw Error('Invalid ask method passed to request decorator')
    } else {
      return function (req, res) {
        if (!asky.canUser(req.locals)[method](action)) {
          res.sendJSON(`Unauthorized to ${method} ${action}`)
        } else {
          return wrapped.apply(this, arguments)
        }
      }
    }
  }
}

/**
 * Validates that authorization has been completed
 * @param {Object} req request
 * @param {Object} res response
 * @param {Object} next next
 */
function authenticationCheck(req, res, next) {
  // Verify user has JWT and assign context
  if ((req.locals || 0) && (req.locals.jwt || 0) && (req.locals.jwt.oid)) {
    next()
  } else {
    logger.warn(req.headers['x-forwarded-for'] || req.connection.remoteAddress
      + ' Authentication method not recognized')
    res.setStatus = 401
    res.end('Authentication method not recognized')
  }
}

/**
 * add authorization groups from storage
 * @param {Object} req request
 * @param {Object} res response
 * @param {Object} next next
 */
function authorizationGroups(req, res, next) {
  // adding user CPRM
  allcores.query('SELECT `groups` FROM `users` WHERE `oid` = ? AND `enabled` = 1 LIMIT 1',
    [String(req.locals.jwt.oid)])
    .then(groups => {
      const [data] = groups
      const first = data.shift()
      req.locals.groups = first.groups || {}
      next()
    }).catch(err => {
      logger.warn(req.headers['x-forwarded-for'] || req.connection.remoteAddress
        + ' Unable to assign user level access')
      res.setStatus = 500
      res.end('Unable to assign user level access')
    })
}

module.exports = {
  authentication,
  logger,
  spike,
  asky,
  askyDecorator,
  sendJSON,
  authenticationCheck,
  authorizationGroups
}
