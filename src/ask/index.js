/**
 * Collects the scopes for a group
 * @param {!Object} storage state
 * @param {!string} scope the CRUD action associated
 * @param {!Object} groups the groups to collect
 * @param {string} context the groups to collect
 */
function getScopesForGroups(storage, scope, groups, context) {
    let scopes = []
    for (let group in groups) {
        // enforces scoping requirements
        if (context && Array.isArray(groups[group])) {
            if (!groups[group].includes(context)) {
                // skip iteration if not in context
                continue
            }
        }
        if (storage[group] && storage[group][scope]) {
            scopes = scopes.concat(storage[group][scope])
        }
    }
    return scopes
}

/**
 * Returns an instance of allow
 * @param {!Object} storage state
 * @param {!string} group group name to write access to
 */
function allow(storage, group) {
    if (!storage.hasOwnProperty(group)) {
        storage[group] = {
            create: [],
            read: [],
            update: [],
            delete: []
        }
    }

    let addAction = (from, action) => {
        storage[group][from].push(action)
    }
    let removeAction = (from, action) => {
        storage[group][from] = storage[group][from].filter(prop => prop !== action)
    }

    return {
        to(action) {
            this.toCreate(action)
            this.toRead(action)
            this.toUpdate(action)
            this.toDelete(action)
            return this
        },
        toCreate(action) {
            addAction('create', action)
            return this
        },
        toRead(action) {
            addAction('read', action)
            return this
        },
        toUpdate(action) {
            addAction('update', action)
            return this
        },
        toDelete(action) {
            addAction('delete', action)
            return this
        },
        notToCreate(action) {
            removeAction('create', action)
            return this
        },
        notToRead(action) {
            removeAction('read', action)
            return this
        },
        notToUpdate(action) {
            removeAction('update', action)
            return this
        },
        notToDelete(action) {
            removeAction('delete', action)
            return this
        },
    }
}

/**
 * Evaluates groups and scopes attached to them
 * @param {!Object} storage state
 * @param {!Object} groups array of groups or object with groups array
 */
function can(storage, groups) {
    return {
        when(context) {
            this.context = context
            return this
        },
        read(action) {
            return getScopesForGroups(storage, 'read', groups, this.context).includes(action)
        },
        create(action) {
            return getScopesForGroups(storage, 'create', groups, this.context).includes(action)
        },
        update(action) {
            return getScopesForGroups(storage, 'update', groups, this.context).includes(action)
        },
        delete(action) {
            return getScopesForGroups(storage, 'delete', groups, this.context).includes(action)
        }
    }
}

/**
 * Alternate interface for can that gets nested groups
 * @param {!Object} storage state
 * @param {!Object} user user object to evaluate permissions
 * @param {Object} user.groups target element for can evaluation
 */
function canUser(storage, user) {
    if (user.hasOwnProperty('groups')) {
        return can(storage, user.groups)
    } else {
        return false
    }
}

/**
 * Returns Ask object with own storage
 * @param {Object} storage passable storage
 */
module.exports = storage => {
    if (!storage) storage = {}
    return {
        allow: group => {
            return allow(storage, group)
        },
        can: groups => {
            return can(storage, group)
        },
        canUser: user => {
            return canUser(storage, user)
        }
    }
}