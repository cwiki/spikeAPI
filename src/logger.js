// File provides system logging using winston 
// Logs are written to /logs with date stamps
// use info and 
// example: logger.log('error', 'unable to lookup user ' + JSON.stringify(ident))
// 
// - Write to all logs with level `info` and below to `combined.log`
// - Write all logs error (and below) to `error.log`.
//
// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   verbose: 3,
//   debug: 4,
//   silly: 5
// }
const winston = require('winston')

// creates a standard datestring for logging
function datestr () {
  const date = new Date()
  const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0]
  return dateString
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: `./logs/${datestr()}-error.log`, level: 'error' }),
    new winston.transports.File({ filename: `./logs/${datestr()}-combined.log` })
  ]
})
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple()
//   }))
// }

module.exports = logger
