const winston = require("winston");
const { format } = winston;
const {
  timestamp,
  json,
  prettyPrint,
  combine,
  printf,
  colorize,
  splat,
  align,
} = format;

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        splat(),
        align(),
        printf((info) => {
          return `${info.level}: ${info.message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "logs.log",
      format: combine(timestamp(), splat(), json(), prettyPrint()),
    }),
  ],
});

//Export logger instance
module.exports = { logger };