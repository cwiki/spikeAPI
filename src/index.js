const authentication = require('./authentication') // azure ACTIVE DIRECTORY AUTH
const logger = require('./logger') // winston logger
const spike = require('./spike') // mysql interface
const asky = require('./asky')


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
  askyDecorator
}
