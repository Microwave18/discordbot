import express from 'express';
import authRouter from './auth';

const router = express.Router();

router.use('/auth', authRouter);



import { linkUser } from './controllers/linkController';
import { createTicket, claimTicket, closeTicket, getTranscript } from './controllers/ticketController';
import { getAdminStats } from './controllers/adminController';
// Admin dashboard stats
router.get('/api/admin/stats', getAdminStats);

// Health check
router.get('/health', (req, res) => res.json({ ok: true }));


// Link user IDs
router.post('/api/link', linkUser);

// Ticket system endpoints
router.post('/api/ticket', createTicket);
router.post('/api/ticket/claim', claimTicket);
router.post('/api/ticket/close', closeTicket);
router.get('/api/ticket/:ticketId/transcript', getTranscript);

export default router;
