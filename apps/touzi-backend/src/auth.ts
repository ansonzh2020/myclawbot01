import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { config } from './config.js';
import { mem } from './db.js';

export type AuthUser = { id: string };

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
  return { id: payload.sub };
}

/**
 * v1 skeleton: treat identityToken as an opaque stable string and map it to appleSub.
 * Production: verify SIWA JWT with Apple JWKS and use the real `sub`.
 */
export function upsertUserFromSiwaIdentityToken(identityToken: string): { userId: string } {
  const appleSub = identityToken; // placeholder
  const existingUserId = mem.usersByAppleSub.get(appleSub);
  if (existingUserId) return { userId: existingUserId };

  const userId = randomUUID();
  mem.users.set(userId, { id: userId, appleSub, createdAt: new Date() });
  mem.usersByAppleSub.set(appleSub, userId);
  mem.settings.set(userId, {
    userId,
    alertsEnabled: true,
    thresholdHours: 72,
    includeLocationInAlert: 'approx',
    cooldownHours: 24,
    updatedAt: new Date()
  });
  mem.contacts.set(userId, []);
  mem.checkinState.set(userId, { userId, lastCheckInAt: null, updatedAt: new Date() });
  mem.alertLog.set(userId, []);

  return { userId };
}
