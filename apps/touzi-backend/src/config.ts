import dotenv from 'dotenv';

dotenv.config();

function must(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

export const config = {
  port: Number(process.env.PORT ?? 8787),
  jwtSecret: must('JWT_SECRET', isTest ? 'test-secret' : undefined),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  smtp: {
    host: must('SMTP_HOST', isTest ? 'localhost' : undefined),
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: (process.env.SMTP_SECURE ?? 'false') === 'true',
    user: must('SMTP_USER', isTest ? 'test' : undefined),
    pass: must('SMTP_PASS', isTest ? 'test' : undefined),
    from: must('MAIL_FROM', isTest ? 'Touzi <no-reply@example.com>' : undefined)
  },
  cron: {
    enabled: (process.env.CRON_ENABLED ?? (isTest ? 'false' : 'true')) === 'true',
    intervalMinutes: Number(process.env.CRON_INTERVAL_MINUTES ?? 60),
    thresholdHours: Number(process.env.ALERT_THRESHOLD_HOURS ?? 72),
    cooldownHours: Number(process.env.ALERT_COOLDOWN_HOURS ?? 24)
  },
  apple: {
    audience: process.env.APPLE_AUDIENCE ?? 'com.touzi.touzi'
    // Note: SIWA verification is stubbed in v1 skeleton. Implement with Apple JWKS + JWT verification.
  }
} as const;
