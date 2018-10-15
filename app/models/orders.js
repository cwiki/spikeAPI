// toast model definition
const definition = {
    tableName: 'orders',
    primaryField: 'id',
    softDeleteField: "deleted",
    searchFields: ['id', 'name'],
}

module.exports = {
    definition
}
