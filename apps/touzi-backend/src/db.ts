/**
 * v1 backend skeleton uses an in-memory store to keep the repo self-contained.
 * Replace with Postgres + migrations for production (Render/AWS).
 */

export type User = {
  id: string;
  appleSub: string;
  createdAt: Date;
};

export type SafetySettings = {
  userId: string;
  alertsEnabled: boolean;
  thresholdHours: number; // fixed 72
  includeLocationInAlert: 'none' | 'approx' | 'precise';
  cooldownHours: number; // default 24
  updatedAt: Date;
};

export type EmergencyContact = {
  id: string;
  userId: string;
  name: string;
  relation?: string;
  email: string;
  enabled: boolean;
  updatedAt: Date;
  createdAt: Date;
};

export type CheckinState = {
  userId: string;
  lastCheckInAt: Date | null;
  lastLocation?: {
    lat: number;
    lng: number;
    accuracyMeters?: number;
    shareMode: 'none' | 'approx' | 'precise';
  };
  updatedAt: Date;
};

export type AlertLog = {
  id: string;
  userId: string;
  kind: 'missed_checkin';
  recipient: string;
  sentAt: Date;
  triggeredAt: Date;
  status: 'sent' | 'failed';
  error?: string;
};

export const mem = {
  users: new Map<string, User>(), // id -> user
  usersByAppleSub: new Map<string, string>(), // appleSub -> id
  settings: new Map<string, SafetySettings>(), // userId -> settings
  contacts: new Map<string, EmergencyContact[]>(), // userId -> contacts
  checkinState: new Map<string, CheckinState>(), // userId -> state
  alertLog: new Map<string, AlertLog[]>() // userId -> logs
};
