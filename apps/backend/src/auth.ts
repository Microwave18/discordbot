import session from 'express-session';
declare module 'express-session' {
  interface SessionData {
    kickUser?: any;
  }
}
// Discord & Kick OAuth2 endpoints (WIP)
import express from 'express';

import passport from 'passport';
// (type augmentation for express-session is above)
import dotenv from 'dotenv';
import { Strategy as DiscordStrategy } from 'passport-discord';
import axios from 'axios';
dotenv.config();

const router = express.Router();
// Get current user (Discord or Kick)
router.get('/me', (req, res) => {
  res.json({
    discord: req.user || null,
    kick: req.session.kickUser || null
  });
});

// Session setup
router.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}));

// Passport Discord strategy (register only if env vars exist)
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET && process.env.FRONTEND_URL) {
  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.FRONTEND_URL + '/api/auth/discord/callback',
    scope: ['identify', 'guilds']
  }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
    // You can save the user profile to DB here if needed
    return done(null, profile);
  }));
} else {
  console.warn('Discord OAuth not configured: DISCORD_CLIENT_ID/SECRET/FRONTEND_URL missing');
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

router.use(passport.initialize());
router.use(passport.session());

// Discord OAuth2 login
router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/login',
  successRedirect: '/dashboard'
}));


// Kick OAuth2 login (manual, using Kick docs)
router.get('/kick', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.KICK_CLIENT_ID!,
    redirect_uri: process.env.KICK_REDIRECT_URI!,
    response_type: 'code',
    scope: 'user',
    state: 'kick_' + Math.random().toString(36).slice(2)
  });
  res.redirect(`https://kick.com/oauth2/authorize?${params.toString()}`);
});

router.get('/kick/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');
  try {
    // Exchange code for token
    const tokenRes = await axios.post('https://kick.com/oauth2/token', new URLSearchParams({
      grant_type: 'authorization_code',
      code: code as string,
      redirect_uri: process.env.KICK_REDIRECT_URI!,
      client_id: process.env.KICK_CLIENT_ID!,
      client_secret: process.env.KICK_CLIENT_SECRET!
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  const access_token = (tokenRes.data as any).access_token;
    // Fetch user info
    const userRes = await axios.get('https://kick.com/api/v1/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    // Save user info to session or DB as needed
    req.session.kickUser = userRes.data;
    res.redirect('/dashboard');
  } catch (e) {
    res.status(500).send('Kick OAuth2 failed');
  }
});

export default router;
