import { z } from 'zod';

export const LocationShareMode = z.enum(['none', 'approx', 'precise']);

export const SiwaAuthBody = z.object({
  identityToken: z.string().min(1),
  clientInfo: z
    .object({
      appVersion: z.string().optional(),
      deviceId: z.string().optional(),
      platform: z.string().optional()
    })
    .optional()
});

export const Contact = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(80),
  relation: z.string().max(80).optional(),
  email: z.string().email(),
  enabled: z.boolean().default(true)
});

export const PutContactsBody = z.object({
  contacts: z.array(Contact).min(0).max(5)
});

export const PutSafetySettingsBody = z.object({
  alertsEnabled: z.boolean().optional(),
  includeLocationInAlert: LocationShareMode.optional()
});

export const PostCheckinBody = z.object({
  timestamp: z.string().datetime(),
  locationShareMode: LocationShareMode,
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      accuracyMeters: z.number().positive().optional()
    })
    .optional()
});
