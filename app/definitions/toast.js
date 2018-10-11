// toast model definition
module.exports = {
    tableName: 'toast_soft',
    primaryField: 'id',
    softDeleteField: "deleted_at",
    searchFields: ['id', 'name'],
}
