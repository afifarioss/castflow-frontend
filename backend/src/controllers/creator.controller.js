const { prisma } = require('../config/database.config');
const { validateFid } = require('../services/neynar.service');

// POST /api/creator/slot
async function createSlot(req, res, next) {
  try {
    const { fid, walletAddress, castHash, priceEth, durationSeconds, metadata, expiresAt } = req.body;

    if (!priceEth || Number(priceEth) <= 0) {
      return res.status(400).json({ error: 'priceEth must be greater than 0' });
    }
    if (!durationSeconds || !Number.isInteger(durationSeconds) || durationSeconds <= 0) {
      return res.status(400).json({ error: 'durationSeconds must be a positive integer' });
    }
    if (!metadata || typeof metadata !== 'string' || !metadata.trim()) {
      return res.status(400).json({ error: 'metadata is required' });
    }

    const { valid } = await validateFid(fid);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid Farcaster FID' });
    }

    let user = await prisma.user.findUnique({ where: { fid } });
    if (!user) {
      user = await prisma.user.create({
        data: { fid, username: `user_${fid}`, walletAddress: walletAddress || 'pending' },
      });
    }

    const slot = await prisma.adSlot.create({
      data: {
        creatorId: user.id,
        castHash,
        priceEth,
        durationSeconds,
        metadata: metadata.trim(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
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
    const user = await prisma.user.findUnique({ where: { fid: parseInt(fid, 10) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const result = await prisma.adBooking.aggregate({
      where: { slot: { creatorId: user.id }, status: 'DELIVERED' },
      _sum: { priceEth: true },
    });

    res.json({ fid: user.fid, totalEarningsEth: result._sum.priceEth || 0 });
  } catch (error) {
    next(error);
  }
}

// GET /api/creator/earnings/address/:address
async function getEarningsByAddress(req, res, next) {
  try {
    const { address } = req.params;
    const user = await prisma.user.findUnique({ where: { walletAddress: address } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const result = await prisma.adBooking.aggregate({
      where: { slot: { creatorId: user.id }, status: 'DELIVERED' },
      _sum: { priceEth: true },
    });

    res.json({ address, totalEarningsEth: result._sum.priceEth || 0 });
  } catch (error) {
    next(error);
  }
}

// GET /api/creator/slots/:fid
async function getSlots(req, res, next) {
  try {
    const { fid } = req.params;
    const user = await prisma.user.findUnique({ where: { fid: parseInt(fid, 10) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const slots = await prisma.adSlot.findMany({
      where: { creatorId: user.id },
      include: { bookings: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ slots });
  } catch (error) {
    next(error);
  }
}

module.exports = { createSlot, getEarnings, getEarningsByAddress, getSlots };
