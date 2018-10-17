// Loads a fake JWT to be used when the app is in development mode
// mimics a AZURE JWT
const faker = require('faker')
module.exports = (req, _, next) => {
  const family_name = faker.name.lastName()
  const given_name = faker.name.firstName()
  const upn = faker.internet.email(given_name, family_name)
  if (!req.locals) req.locals = {}
  req.locals.jwt = {
    family_name,
    given_name,
    'ipaddr': faker.internet.ip(),
    'name': given_name + ' ' + family_name,
    'oid': '00000000-0000-0000-0000-000000000000',
    'unique_name': upn,
    upn
  }
  next()
}
