function confValidator(config) {
    if (!config.tableName) throw ReferenceError('Malformed Config #101')
    if (!config.primaryField) throw ReferenceError('Malformed Config #103')
}

/**
 * Retrieves an entry from the database by config name
 * @param {Object} dbc MysqlDatabase connection
 * @param {!Object} config table configuration
 * @param {!string} config.tableName the target table name
 * @param {!string} config.primaryField the primary key field
 * @param {string} config.parentField the parent field (used if parent key provided)
 * @param {string} config.softDeleteField soft delete field
 * @param {!number|string} key primary restrait field
 * @param {number|string} parentKey secondary restraint for parent fields
 */
async function findOne(dbc, config, key, parentKey) {
    confValidator(config)
    let query = 'SELECT * FROM ?? WHERE ?? = ?'
    let args = [config.tableName, config.primaryField, key]
    // parent key constraint
    if (parentKey, config.parentField) {
        query += ' AND ?? = ? '
        args.push(config.parentField)
        args.push(parentKey)
    }
    // soft delete constraint
    if (config.softDeleteField) {
        query += ' AND ?? is NULL '
        args.push(config.softDeleteField)
    }
    query += ' LIMIT 1'
    return dbc.query(query, args)
}

/**
 * Finds results from the database accepting values by whitelist
 * @param {Object} dbc MysqlDatabase connection
 * @param {!Object} config table configuration
 * @param {!string} config.tableName the target table name
 * @param {!string} config.primaryField the primary key field
 * @param {string} config.parentField the parent field (used if parent key provided)
 * @param {string} config.softDeleteField soft delete field
 * @param {number|string} parentKey secondary restraint for parent fields
 */
async function find(dbc, config, args, parentKey) {
    confValidator(config)
    let marks = []
    let qargs = [config.tableName]
    if (parentKey && config.parentField) {
        args[config.parentField] = parentKey
    }
    // uses search field whitelisting
    if (config.searchFields) {
        for (let key in args) {
            if (!config.searchFields.includes(key)) continue
            let set = new Object()
            set[key] = args[key]
            qargs.push(set)
            marks.push(' ? ')
        }
    }
    // soft delete constraint
    if (config.softDeleteField) {
        qargs.push(config.softDeleteField)
        marks.push(' ?? is NULL ')
    }
    let query = 'SELECT * FROM ?? '
    if (qargs.length > 1) query += ' WHERE '
    return dbc.query(query + marks.join(' AND '), qargs)
}

/**
 * Updates an existing record
 * @param {Object} dbc MysqlDatabase connection
 * @param {!Object} config table configuration
 * @param {!string} config.tableName the target table name
 * @param {!string} config.primaryField the primary key field
 * @param {string} config.parentField the parent field (used if parent key provided)
 * @param {!Object} payload fields to updated in target row
 * @param {!number|string} primaryKey primary restrait field
 * @param {number|string} parentKey secondary restraint for parent fields
 * @throws Missing payload
 * @throws Missing Primary Key
 * @throws Payload and Primary key collision
 */
async function update(dbc, config, payload, primaryKey, parentKey) {
    confValidator(config)
    if (!payload) throw ReferenceError('Missing payload #121')
    if (!primaryKey) throw ReferenceError('Save does not have primary #130')
    if (payload[config.primaryField] && payload[config.primaryField] !== primaryKey) {
        throw ReferenceError('Obj key does not match target key #128')
    }
    if (parentKey && config.parentField) {
        payload[config.parentField] = parentKey
    }
    let query = 'UPDATE ?? SET ? WHERE ?? = ?'
    let args = [config.tableName, payload, config.primaryField, primaryKey]

    // soft delete constraint
    if (config.softDeleteField) {
        query += ' AND ?? is NULL '
        args.push(config.softDeleteField)
    }
    // updating
    return dbc.query(query, args)
}

/**
 * Inserts a new object into the database
 * @param {Object} dbc MysqlDatabase connection
 * @param {!Object} config table configuration
 * @param {!string} config.tableName the target table name
 * @param {!string} config.primaryField the primary key field
 * @param {string} config.parentField the parent field (used if parent key provided)
 * @param {!Object} payload fields to updated in target row
 * @param {number|string} parentKey secondary restraint for parent fields
 * @throws Missing payload
 * @throws Primary key exists on payload
 */
async function insert(dbc, config, payload, parentKey) {
    confValidator(config)
    if (!payload) throw ReferenceError('Missing payload #123')
    if (payload[config.primaryField]) throw ReferenceError('Insert has primary #128')
    // attach parent key if provided
    if (parentKey && config.parentField) {
        payload[config.parentField] = parentKey
    }
    return dbc.query('INSERT INTO ?? SET ?', [config.tableName, payload])
}

/**
 * Deletes ONE object from the database, can be constrainted by parentKey
 * @param {Object} dbc MysqlDatabase connection
 * @param {!Object} config table configuration
 * @param {!string} config.tableName the target table name
 * @param {!string} config.primaryField the primary key field
 * @param {string} config.parentField the parent field (used if parent key provided)
 * @param {string} config.softDeleteField soft delete field
 * @param {!number|string} primaryKey primary restrait field
 * @param {number|string} parentKey secondary restraint for parent fields
 * @throws Missing payload
 * @throws Primary key exists on payload
 */
async function destroy(dbc, config, primaryKey, parentKey) {
    confValidator(config)
    let query;
    let args;

    if (config.softDeleteField) {
        // soft delete constraint
        query = 'UPDATE ?? SET ?? = NOW() WHERE ?? = ?'
        args = [config.tableName, config.softDeleteField, config.primaryField, primaryKey]
    } else {
        // standard delete
        query = 'DELETE FROM ?? WHERE ?? = ?'
        args = [config.tableName, config.primaryField, primaryKey]
    }

    // primary key constraint
    if (parentKey && config.parentKey) {
        query += ' AND ?? = ?'
        args.push(config.parentField)
        args.push(parentKey)
    }

    query += ' LIMIT 1'
    return dbc.query(query, args)
}

module.exports = {
    findOne,
    find,
    update,
    insert,
    destroy
}