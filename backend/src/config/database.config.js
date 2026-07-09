const { PrismaClient } = require('@prisma/client');

// Singleton pattern to avoid multiple connections
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

// Graceful shutdown
const disconnect = async () => {
  await prisma.$disconnect();
};

process.on('SIGINT', disconnect);
process.on('SIGTERM', disconnect);

module.exports = { prisma, disconnect };