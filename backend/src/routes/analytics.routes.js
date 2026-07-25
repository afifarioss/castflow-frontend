```javascript
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/impressions', analyticsController.getImpressions);
router.get('/revenue/:fid', analyticsController.getRevenue);

module.exports = router;
```