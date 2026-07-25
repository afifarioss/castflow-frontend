```javascript
const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(status).json({
    success: false,
    error: message,
    stack,
  });
}

module.exports = errorHandler;
```