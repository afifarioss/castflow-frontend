const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiser.controller');

router.get('/slots/open', advertiserController.getOpenSlots);
router.post('/booking', advertiserController.createBooking);
router.get('/bookings', advertiserController.getBookings);

module.exports = router;
