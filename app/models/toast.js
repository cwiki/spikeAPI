// toast model definition
const definition = {
    tableName: 'toast_soft',
    primaryField: 'id',
    softDeleteField: "deleted_at",
    searchFields: ['id', 'name'],
}

module.exports = {
    definition
}
