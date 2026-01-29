import { describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import { router } from '../src/routes.js';
import { mem } from '../src/db.js';

function mkApp() {
  const app = express();
  app.use(express.json());
  app.use(router);
  return app;
}

describe('touzi-backend routes', () => {
  it('auth -> get settings', async () => {
    const app = mkApp();

    const auth = await request(app)
      .post('/v1/auth/siwa')
      .send({ identityToken: 'test-sub-1' })
      .expect(200);

    expect(auth.body.token).toBeTruthy();

    const settings = await request(app)
      .get('/v1/safety-settings')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .expect(200);

    expect(settings.body.thresholdHours).toBe(72);
  });

  it('checkin updates state', async () => {
    const app = mkApp();

    const auth = await request(app).post('/v1/auth/siwa').send({ identityToken: 'test-sub-2' });
    const token = auth.body.token;

    await request(app)
      .post('/v1/checkins')
      .set('Authorization', `Bearer ${token}`)
      .send({
        timestamp: new Date().toISOString(),
        locationShareMode: 'none'
      })
      .expect(200);

    const userId = auth.body.user.id as string;
    const state = mem.checkinState.get(userId);
    expect(state?.lastCheckInAt).toBeInstanceOf(Date);
  });
});
