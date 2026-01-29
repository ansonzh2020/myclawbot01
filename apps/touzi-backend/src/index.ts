import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import { router } from './routes.js';
import { runAlertSweep } from './alerts.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use(router);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`touzi-backend listening on :${config.port}`);
});

// Minimal in-process cron for dev/staging.
if (config.cron.enabled) {
  const intervalMs = config.cron.intervalMinutes * 60_000;
  setInterval(async () => {
    try {
      const r = await runAlertSweep(new Date());
      // eslint-disable-next-line no-console
      console.log(`[cron] sweep ok`, r);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`[cron] sweep failed`, e);
    }
  }, intervalMs).unref();
}
