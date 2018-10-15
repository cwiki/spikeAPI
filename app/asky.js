/**
 * Project permissions configuration
 * This is the place to add your specific permissions to the project
 */
const { asky, askyDecorator } = require('../src')
const ask = asky()

// configuration
ask.allow('admin').to('toast').to('orders')

// provides a loaded askyDecorator 
module.exports = {
    ask,
    decorator: askyDecorator(ask)
}