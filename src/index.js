const authentication = require('./authentication') // azure ACTIVE DIRECTORY AUTH
const logger = require('./logger') // winston logger
const spike = require('./spike') // mysql interface
const asky = require('./asky')

/**
 * express middleware that adds json formatting
 * @param {*} _ requiest (not used)
 * @param {*} res response
 * @param {*} next next
 */
function sendJSON(_, res, next){
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

module.exports = {
  authentication,
  logger,
  spike,
  asky,
  askyDecorator,
  sendJSON
}
