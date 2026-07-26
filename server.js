const app = require('./app');
const { disconnect } = require('./config/database.config');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    logger.info(`CastFlow backend running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        disconnect();
        process.exit(0);
    });
});
