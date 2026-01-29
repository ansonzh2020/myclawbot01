import { randomUUID } from 'node:crypto';
import { config } from './config.js';
import { mem } from './db.js';
import { sendEmail } from './mailer.js';

function hoursBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / 36e5;
}

function buildBilingualEmail(opts: {
  appName: string;
  lastCheckInAt: Date;
  includeLocation: 'none' | 'approx' | 'precise';
  location?: { lat: number; lng: number; accuracyMeters?: number; shareMode: 'none' | 'approx' | 'precise' };
}): { subject: string; body: string } {
  const last = opts.lastCheckInAt.toISOString().replace('T', ' ').replace('Z', ' UTC');

  const includeLoc = opts.includeLocation !== 'none' && opts.location && opts.location.shareMode !== 'none';
  let locLineZh = '位置：未包含';
  let locLineEn = 'Location: not included';

  if (includeLoc && opts.location) {
    const { lat, lng } = opts.location;
    locLineZh = `位置：${lat}, ${lng}`;
    locLineEn = `Location: ${lat}, ${lng}`;

    if (opts.includeLocation === 'precise' && opts.location.shareMode === 'precise') {
      const url = `https://maps.google.com/?q=${lat},${lng}`;
      locLineZh += `\n地图：${url}`;
      locLineEn += `\nMap: ${url}`;
    }
  }

  const subject = `[${opts.appName}] 安全关怀提醒 / Safety Check-in Reminder`;

  const body = [
    '【中文】',
    `这是一封安全关怀提醒：用户已超过 72 小时未在 ${opts.appName} 完成签到。`,
    `最后签到时间：${last}`,
    locLineZh,
    '建议：请通过你们约定的方式联系对方确认安全。',
    '',
    '[English]',
    `This is a safety reminder: the user has not checked in on ${opts.appName} for 72+ hours.`,
    `Last check-in time: ${last}`,
    locLineEn,
    'Recommendation: Please contact them via your agreed channel to confirm they are safe.'
  ].join('\n');

  return { subject, body };
}

export async function runAlertSweep(now = new Date()): Promise<{ usersEvaluated: number; emailsSent: number }> {
  let usersEvaluated = 0;
  let emailsSent = 0;

  for (const [userId, state] of mem.checkinState.entries()) {
    usersEvaluated++;

    const settings = mem.settings.get(userId);
    if (!settings?.alertsEnabled) continue;

    const last = state.lastCheckInAt;
    if (!last) continue;

    const overdue = hoursBetween(now, last) >= config.cron.thresholdHours;
    if (!overdue) continue;

    const logs = mem.alertLog.get(userId) ?? [];
    const lastSent = logs
      .filter((l) => l.kind === 'missed_checkin' && l.status === 'sent')
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())[0];

    if (lastSent && hoursBetween(now, lastSent.sentAt) < config.cron.cooldownHours) {
      continue;
    }

    const contacts = (mem.contacts.get(userId) ?? []).filter((c) => c.enabled);
    if (contacts.length === 0) continue;

    const { subject, body } = buildBilingualEmail({
      appName: 'Touzi',
      lastCheckInAt: last,
      includeLocation: settings.includeLocationInAlert,
      location: state.lastLocation
    });

    for (const c of contacts) {
      try {
        await sendEmail({ to: c.email, subject, text: body });
        emailsSent++;
        logs.push({
          id: randomUUID(),
          userId,
          kind: 'missed_checkin',
          recipient: c.email,
          sentAt: now,
          triggeredAt: now,
          status: 'sent'
        });
      } catch (e: any) {
        logs.push({
          id: randomUUID(),
          userId,
          kind: 'missed_checkin',
          recipient: c.email,
          sentAt: now,
          triggeredAt: now,
          status: 'failed',
          error: String(e?.message ?? e)
        });
      }
    }

    mem.alertLog.set(userId, logs);
  }

  return { usersEvaluated, emailsSent };
}
