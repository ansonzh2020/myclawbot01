import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { upsertUserFromSiwaIdentityToken, signToken, verifyToken } from './auth.js';
import { mem } from './db.js';
import { PutContactsBody, PutSafetySettingsBody, PostCheckinBody, SiwaAuthBody } from './validate.js';

export const router = express.Router();

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const h = req.header('authorization');
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'missing_token' });
  const token = h.slice('Bearer '.length);
  try {
    (req as any).user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

router.post('/v1/auth/siwa', (req, res) => {
  const body = SiwaAuthBody.parse(req.body);
  const { userId } = upsertUserFromSiwaIdentityToken(body.identityToken);
  const token = signToken(userId);
  return res.json({ token, user: { id: userId, createdAt: mem.users.get(userId)!.createdAt.toISOString() } });
});

router.get('/v1/safety-settings', authMiddleware, (req, res) => {
  const userId = (req as any).user.id as string;
  const s = mem.settings.get(userId);
  if (!s) return res.status(404).json({ error: 'not_found' });
  return res.json({
    alertsEnabled: s.alertsEnabled,
    thresholdHours: s.thresholdHours,
    includeLocationInAlert: s.includeLocationInAlert,
    cooldownHours: s.cooldownHours
  });
});

router.put('/v1/safety-settings', authMiddleware, (req, res) => {
  const userId = (req as any).user.id as string;
  const patch = PutSafetySettingsBody.parse(req.body);
  const s = mem.settings.get(userId);
  if (!s) return res.status(404).json({ error: 'not_found' });
  const updated = {
    ...s,
    alertsEnabled: patch.alertsEnabled ?? s.alertsEnabled,
    includeLocationInAlert: patch.includeLocationInAlert ?? s.includeLocationInAlert,
    updatedAt: new Date()
  };
  mem.settings.set(userId, updated);
  return res.json({
    alertsEnabled: updated.alertsEnabled,
    thresholdHours: updated.thresholdHours,
    includeLocationInAlert: updated.includeLocationInAlert,
    cooldownHours: updated.cooldownHours
  });
});

router.put('/v1/contacts', authMiddleware, (req, res) => {
  const userId = (req as any).user.id as string;
  const body = PutContactsBody.parse(req.body);
  const now = new Date();
  const contacts = body.contacts.map((c) => ({
    id: c.id ?? randomUUID(),
    userId,
    name: c.name,
    relation: c.relation,
    email: c.email,
    enabled: c.enabled,
    createdAt: now,
    updatedAt: now
  }));
  mem.contacts.set(userId, contacts);
  return res.json({ contacts: contacts.map((c) => ({ ...c, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() })) });
});

router.post('/v1/checkins', authMiddleware, (req, res) => {
  const userId = (req as any).user.id as string;
  const body = PostCheckinBody.parse(req.body);
  const timestamp = new Date(body.timestamp);

  const s = mem.checkinState.get(userId) ?? { userId, lastCheckInAt: null, updatedAt: new Date() };

  const shareMode = body.locationShareMode;
  const location = body.location;
  const lastLocation =
    shareMode === 'none' || !location
      ? { shareMode: 'none' as const, lat: 0, lng: 0 }
      : { shareMode, lat: location.lat, lng: location.lng, accuracyMeters: location.accuracyMeters };

  mem.checkinState.set(userId, {
    userId,
    lastCheckInAt: timestamp,
    lastLocation: lastLocation.shareMode === 'none' ? undefined : lastLocation,
    updatedAt: new Date()
  });

  return res.json({ accepted: true, lastCheckInAt: timestamp.toISOString() });
});

router.post('/v1/alerts/test-email', authMiddleware, async (req, res) => {
  // For v1: trigger a test email to current enabled contacts using current state.
  // In production you may restrict frequency.
  const userId = (req as any).user.id as string;
  const { runAlertSweep } = await import('./alerts.js');

  // Make the user immediately overdue by setting lastCheckInAt far in the past if null.
  const st = mem.checkinState.get(userId);
  if (st && !st.lastCheckInAt) {
    st.lastCheckInAt = new Date(Date.now() - 1000 * 60 * 60 * 73);
    mem.checkinState.set(userId, { ...st, updatedAt: new Date() });
  }

  const result = await runAlertSweep(new Date());
  return res.json({ ok: true, ...result });
});

router.delete('/v1/account', authMiddleware, (req, res) => {
  const userId = (req as any).user.id as string;
  const user = mem.users.get(userId);
  if (!user) return res.status(404).json({ error: 'not_found' });

  mem.users.delete(userId);
  mem.usersByAppleSub.delete(user.appleSub);
  mem.settings.delete(userId);
  mem.contacts.delete(userId);
  mem.checkinState.delete(userId);
  mem.alertLog.delete(userId);

  return res.json({ ok: true });
});
