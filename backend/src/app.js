```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');

// Route imports
const creatorRoutes = require('./routes/creator.routes');
const advertiserRoutes = require('./routes/advertiser.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/creator', creatorRoutes);
app.use('/api/advertiser', advertiserRoutes);
app.use('/api/analytics', analyticsRoutes);

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
```