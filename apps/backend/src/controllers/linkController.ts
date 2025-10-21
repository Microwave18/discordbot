
import { Request, Response } from 'express';
import prisma from '../prismaClient';

export async function linkUser(req: Request, res: Response) {
  const { discordId, kickId, upgraderId, rustmagicId, otherId } = req.body;
  if (!discordId) return res.status(400).json({ error: 'discordId is required' });
  // Check duplicates
  const conflicts = await prisma.user.findMany({
    where: {
      OR: [
        kickId ? { kickId } : undefined,
        upgraderId ? { upgraderId } : undefined,
        rustmagicId ? { rustmagicId } : undefined,
        otherId ? { otherId } : undefined
      ].filter(Boolean) as any
    }
  });
  if (conflicts.length > 0) return res.status(409).json({ error: 'One or more IDs already linked to another account', conflicts });

  const user = await prisma.user.upsert({
    where: { discordId },
    update: {
      kickId,
      upgraderId,
      rustmagicId,
      otherId
    },
    create: {
      discordId,
      kickId,
      upgraderId,
      rustmagicId,
      otherId,
      verifiedFlags: {}
    }
  });

  // Log link
  await prisma.linkLog.create({ data: { userId: user.id, changesJson: { linked: true } } });

  return res.json({ ok: true, user });
}
