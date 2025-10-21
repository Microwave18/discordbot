import { Request, Response } from 'express';
import prisma from '../prismaClient';

export async function getAdminStats(req: Request, res: Response) {
  try {
    const openTickets = await prisma.ticket.count({ where: { status: 'open' } });
    const closedTickets = await prisma.ticket.count({ where: { status: 'closed' } });
    const avgRatingObj = await prisma.adminRating.aggregate({ _avg: { rating: true } });
    const avgRating = avgRatingObj._avg.rating || 0;
    // Leaderboard: top admins by XP
    const leaderboard = await prisma.xP.findMany({
      orderBy: { xpTotal: 'desc' },
      take: 10
    });
    // Get badge info for each admin
    const badges = await prisma.badge.findMany();
    res.json({ openTickets, closedTickets, avgRating, leaderboard, badges });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get admin stats', details: e });
  }
}
