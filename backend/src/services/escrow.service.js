const { prisma } = require('../config/database.config');

// STUB: AdEscrow is not deployed on-chain yet. This service currently only
// tracks delivery status in the database. Nothing here moves real funds.
// Once AdEscrow exists, the release step below needs a real contract call.
async function checkDelivery(bookingId) {
  const booking = await prisma.adBooking.findUnique({
    where: { id: bookingId },
    include: { slot: true },
  });

  if (!booking) throw new Error('Booking not found');

  if (booking.status === 'DELIVERED') {
    return { status: 'already_delivered' };
  }

  await prisma.adBooking.update({
    where: { id: bookingId },
    data: { status: 'DELIVERED', deliveredAt: new Date() },
  });

  console.log(`Booking ${bookingId} marked delivered — no on-chain release yet, AdEscrow not deployed.`);

  return { status: 'delivered', onChainReleasePending: true };
}

module.exports = { checkDelivery };
