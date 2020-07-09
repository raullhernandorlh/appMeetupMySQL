const { createLogger, format, transports } = require('winston')

module.exports = createLogger({

    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
    ),
    transports: [
        new transports.File({
            maxsize: 512000,
            maxFiles: 1,
            filename: './logs/info.log',
            level:'info'
        }),
        new transports.File({
            maxsize: 512000,
            maxFiles: 1,
            filename: './logs/error.log',
            level:'error'
        }),
        new transports.Console({
            level: 'debug',
        })
    ]
})