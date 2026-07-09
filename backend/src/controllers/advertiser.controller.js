```javascript
const { prisma } = require('../config/database.config');
const { moderateAd } = require('../services/mbd.service');
const { labelContent } = require('../services/phala.service');

// POST /api/advertiser/campaign
async function createCampaign(req, res, next) {
  try {
    const { fid, creativeUrl, budgetUsdc, targeting, startTime, endTime } = req.body;

    // Moderate the ad creative
    const moderation = await moderateAd(creativeUrl);
    if (!moderation.approved) {
      return res.status(400).json({ error: 'Ad rejected', reason: moderation.reason });
    }

    // Optionally label content for better targeting
    // const label = await labelContent(creativeUrl);

    // Get user
    const user = await prisma.user.findUnique({ where: { fid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Create campaign (DRAFT by default)
    const campaign = await prisma.adCampaign.create({
      data: {
        advertiserId: user.id,
        creativeUrl,
        budgetUsdc,
        targeting: targeting || {},
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        contractAdId: 0, // placeholder
        status: 'DRAFT',
      },
    });

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    next(error);
  }
}

// POST /api/advertiser/bid
async function placeBid(req, res, next) {
  try {
    const { fid, slotId, bidAmount } = req.body;

    const slot = await prisma.adSlot.findUnique({
      where: { id: slotId },
      include: { creator: true },
    });
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    // Check minimum bid
    if (bidAmount < slot.reservePrice) {
      return res.status(400).json({ error: 'Bid below reserve price' });
    }

    // Update slot price if bid is higher
    if (bidAmount > slot.currentPrice) {
      await prisma.adSlot.update({
        where: { id: slotId },
        data: { currentPrice: bidAmount },
      });
    }

    // In production, this would call the auction contract.
    // For now, we just record the bid in a separate table (not required).
    // We'll simulate a successful placement.
    res.json({ success: true, message: 'Bid placed', slotId, amount: bidAmount });
  } catch (error) {
    next(error);
  }
}

// GET /api/advertiser/campaigns
async function getCampaigns(req, res, next) {
  try {
    const { fid } = req.query;
    if (!fid) return res.status(400).json({ error: 'fid required' });

    const user = await prisma.user.findUnique({ where: { fid: parseInt(fid) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const campaigns = await prisma.adCampaign.findMany({
      where: { advertiserId: user.id },
      include: { deliveries: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ campaigns });
  } catch (error) {
    next(error);
  }
}

module.exports = { createCampaign, placeBid, getCampaigns };
```