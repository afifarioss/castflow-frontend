```javascript
const { prisma } = require('../config/database.config');
const { validateFid } = require('../services/neynar.service');

// POST /api/creator/slot
async function createSlot(req, res, next) {
  try {
    const { fid, castHash, auctionType, startingPrice, reservePrice, expiresAt } = req.body;

    // Validate FID
    const { valid } = await validateFid(fid);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid Farcaster FID' });
    }

    // Get or create user
    let user = await prisma.user.findUnique({ where: { fid } });
    if (!user) {
      // In real flow, you'd fetch username from Neynar
      user = await prisma.user.create({
        data: { fid, username: `user_${fid}`, walletAddress: 'pending' },
      });
    }

    // For MVP, contractAuctionId is generated later; use placeholder
    const slot = await prisma.adSlot.create({
      data: {
        creatorId: user.id,
        castHash,
        auctionType,
        startingPrice,
        reservePrice,
        currentPrice: startingPrice,
        expiresAt: new Date(expiresAt),
        contractAuctionId: 0, // placeholder, update after on-chain creation
      },
    });

    res.status(201).json({ success: true, slot });
  } catch (error) {
    next(error);
  }
}

// GET /api/creator/earnings/:fid
async function getEarnings(req, res, next) {
  try {
    const { fid } = req.params;
    const user = await prisma.user.findUnique({ where: { fid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Sum revenue from delivered ads
    const result = await prisma.adDelivery.aggregate({
      where: { slot: { creatorId: user.id }, status: 'DELIVERED' },
      _sum: { revenueUsdc: true },
    });

    res.json({ fid, totalEarnings: result._sum.revenueUsdc || 0 });
  } catch (error) {
    next(error);
  }
}

// GET /api/creator/slots/:fid
async function getSlots(req, res, next) {
  try {
    const { fid } = req.params;
    const user = await prisma.user.findUnique({ where: { fid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const slots = await prisma.adSlot.findMany({
      where: { creatorId: user.id },
      include: { deliveries: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ slots });
  } catch (error) {
    next(error);
  }
}

module.exports = { createSlot, getEarnings, getSlots };
```