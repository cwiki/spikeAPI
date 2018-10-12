const { ContextPermissions } = require('context-permissions')

/**
 * ContextPermissions Loading
 */
const permissions = {
    admin: ['toast']
}

module.exports = new ContextPermissions(permissions)
