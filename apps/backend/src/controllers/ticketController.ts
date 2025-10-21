import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { v4 as uuidv4 } from 'uuid';

// Create a ticket
export async function createTicket(req: Request, res: Response) {
  try {
    const { creatorId, category, priority, summary } = req.body;
    if (!creatorId || !category || !priority) return res.status(400).json({ error: 'Missing required fields' });
    const ticketChannelId = `ticket-${uuidv4()}`;
    const ticket = await prisma.ticket.create({
      data: {
        ticketChannelId,
        creatorId,
        category,
        priority,
        status: 'open'
      }
    });
    res.json({ ok: true, ticket });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create ticket', details: e });
  }
}

// Claim a ticket
export async function claimTicket(req: Request, res: Response) {
  try {
    const { ticketId, adminId } = req.body;
    if (!ticketId || !adminId) return res.status(400).json({ error: 'Missing required fields' });
    // Optionally: update ticket with claimedBy/adminId
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to claim ticket', details: e });
  }
}

// Close a ticket
export async function closeTicket(req: Request, res: Response) {
  try {
    const { ticketId, closedBy, closeReason } = req.body;
    if (!ticketId || !closedBy || !closeReason) return res.status(400).json({ error: 'Missing required fields' });
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'closed',
        closedAt: new Date(),
        closedBy,
        closeReason
      }
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to close ticket', details: e });
  }
}

// Get ticket transcript (placeholder)
export async function getTranscript(req: Request, res: Response) {
  try {
    const { ticketId } = req.params;
    // TODO: Fetch and format transcript
    res.json({ ok: true, transcript: 'Transcript coming soon.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get transcript', details: e });
  }
}
