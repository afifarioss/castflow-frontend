```javascript
const { prisma } = require('../config/database.config');

// GET /api/analytics/impressions?start=&end=&creatorId=
async function getImpressions(req, res, next) {
  try {
    const { start, end, creatorId } = req.query;
    const where = { status: 'DELIVERED' };

    if (creatorId) where.slot = { creatorId };
    if (start) where.deliveredAt = { gte: new Date(start) };
    if (end) where.deliveredAt = { lte: new Date(end) };

    const totals = await prisma.adDelivery.aggregate({
      where,
      _sum: { impressions: true, clicks: true, revenueUsdc: true },
    });

    res.json({
      totalImpressions: totals._sum.impressions || 0,
      totalClicks: totals._sum.clicks || 0,
      totalRevenue: totals._sum.revenueUsdc || 0,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/analytics/revenue/:fid
async function getRevenue(req, res, next) {
  try {
    const { fid } = req.params;
    const user = await prisma.user.findUnique({ where: { fid: parseInt(fid) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const result = await prisma.adDelivery.aggregate({
      where: { slot: { creatorId: user.id }, status: 'DELIVERED' },
      _sum: { revenueUsdc: true },
    });

    res.json({ fid, revenue: result._sum.revenueUsdc || 0 });
  } catch (error) {
    next(error);
  }
}

module.exports = { getImpressions, getRevenue };
```