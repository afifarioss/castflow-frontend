```javascript
const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiser.controller');

router.post('/campaign', advertiserController.createCampaign);
router.post('/bid', advertiserController.placeBid);
router.get('/campaigns', advertiserController.getCampaigns);

module.exports = router;
```