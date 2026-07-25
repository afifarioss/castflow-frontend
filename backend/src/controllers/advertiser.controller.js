const { prisma } = require('../config/database.config');
const { moderateAd } = require('../services/mbd.service');

async function getOpenSlots(req, res, next) {
  try {
    const slots = await prisma.adSlot.findMany({
      where: { status: 'OPEN' },
      include: { creator: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ slots });
  } catch (error) {
    next(error);
  }
}

async function createBooking(req, res, next) {
  try {
    const { fid, walletAddress, slotId, campaignBrief } = req.body;

    if (!campaignBrief || typeof campaignBrief !== 'string' || !campaignBrief.trim()) {
      return res.status(400).json({ error: 'campaignBrief is required' });
    }
    if (!walletAddress && !fid) {
      return res.status(400).json({ error: 'walletAddress or fid is required' });
    }

    const slot = await prisma.adSlot.findUnique({ where: { id: slotId } });
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    if (slot.status !== 'OPEN') {
      return res.status(409).json({ error: 'Slot is no longer available' });
    }

    const moderation = await moderateAd(campaignBrief);
    if (!moderation.approved) {
      return res.status(400).json({ error: 'Booking rejected', reason: moderation.reason });
    }

    let user = walletAddress
      ? await prisma.user.findUnique({ where: { walletAddress } })
      : await prisma.user.findUnique({ where: { fid } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fid: fid ?? -Math.floor(Math.random() * 1000000000),
          username: walletAddress ? `wallet_${walletAddress.slice(0, 8)}` : `user_${fid}`,
          walletAddress: walletAddress || 'pending',
        },
      });
    }

    const [booking] = await prisma.$transaction([
      prisma.adBooking.create({
        data: {
          slotId: slot.id,
          advertiserId: user.id,
          priceEth: slot.priceEth,
          campaignBrief: campaignBrief.trim(),
        },
      }),
      prisma.adSlot.update({
        where: { id: slot.id },
        data: { status: 'BOOKED' },
      }),
    ]);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
}

async function getBookings(req, res, next) {
  try {
    const { fid, address } = req.query;
    let user;
    if (address) {
      user = await prisma.user.findUnique({ where: { walletAddress: address } });
    } else if (fid) {
      user = await prisma.user.findUnique({ where: { fid: parseInt(fid, 10) } });
    } else {
      return res.status(400).json({ error: 'fid or address required' });
    }
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bookings = await prisma.adBooking.findMany({
      where: { advertiserId: user.id },
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}

module.exports = { getOpenSlots, createBooking, getBookings };
