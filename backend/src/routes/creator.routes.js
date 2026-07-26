const express = require('express');
const router = express.Router();
const creatorController = require('../controllers/creator.controller');

router.post('/slot', creatorController.createSlot);
router.get('/earnings/:fid', creatorController.getEarnings);
router.get('/earnings/address/:address', creatorController.getEarningsByAddress);
router.get('/slots/:fid', creatorController.getSlots);

module.exports = router;
