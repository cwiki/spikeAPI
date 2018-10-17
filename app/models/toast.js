// toast model definition
const definition = {
    tableName: 'toast',
    primaryField: 'id',
    // softDeleteField: "deleted_at",
    searchFields: ['id', 'name'],
}

module.exports = {
    definition
}
