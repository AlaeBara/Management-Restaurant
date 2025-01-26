import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        // Error logs only
        new transports.File({ 
            filename: 'error.log', 
            level: 'error',
            format: format.combine(
                format.timestamp(),
                format.json(),
                // Only process if it's an error level log
                format.printf(info => 
                    info.level === 'error' ? JSON.stringify(info) : ''
                )
            )
        }),
        // Info logs only
        new transports.File({ 
            filename: 'info.log', 
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.json(),
                // Only process if it's an info level log
                format.printf(info => 
                    info.level === 'info' ? JSON.stringify(info) : ''
                )
            )
        }),

        new transports.File({ 
            filename: 'warn.log', 
            level: 'warn',
            format: format.combine(
                format.timestamp(),
                format.json(),
                // Only process if it's an warn level log
                format.printf(info => 
                    info.level === 'warn' ? JSON.stringify(info) : ''
                )
            )
        }),
        // Console output for all logs
        new transports.Console()
    ],
});

export default logger;