import { FPS } from "../config/timing";
import { easeInOutSine, lerp, progress } from "../utils/easing";

// Pose karakter utama untuk prototype 15 detik. Fungsi murni dari nomor frame.
// Model karakter menghadap +Z saat rotY = 0. rotY = PI/2 → menghadap +X, PI → menghadap -Z (ke ATM).

export type CharacterPose = {
  x: number;
  z: number;
  rotY: number;
  // Jarak tempuh kumulatif (meter): fase langkah dihitung dari jarak, bukan waktu, supaya kaki tidak meluncur.
  distance: number;
  // Kecepatan saat ini (m/s).
  speed: number;
  // Waktu (detik), untuk gerak diam seperti napas.
  time: number;
};

export const CRUISE_SPEED = 1.5; // m/s

const START_X = -5.4;
const STAND_X = 0;
const STAND_Z = 0.4;

// Fase 1: jalan 0–4.4 s. Kecepatan konstan lalu melambat linear sampai berhenti.
const WALK_T = 4.4;
const WALK_CRUISE_T = 2.8;
const walkDist1 = (t: number) => {
  const v0 = CRUISE_SPEED;
  if (t <= 0) return 0;
  if (t <= WALK_CRUISE_T) return v0 * t;
  const u = Math.min(t, WALK_T) - WALK_CRUISE_T;
  const decelT = WALK_T - WALK_CRUISE_T;
  return v0 * WALK_CRUISE_T + v0 * (u - (u * u) / (2 * decelT));
};
const D1 = walkDist1(WALK_T); // = 5.4 bila CRUISE_SPEED 1.5

// Fase 4: setelah t=6.5 s, melangkah ke kiri supaya ATM bebas terlihat.
const AWAY_START = 6.5;
const AWAY_T = 2.4;
const D2 = 2.6;
const walkDist2 = (t: number) => D2 * easeInOutSine((t - AWAY_START) / AWAY_T);

const cumDist = (t: number) => walkDist1(t) + walkDist2(t);

export const characterPose = (frame: number): CharacterPose => {
  const t = frame / FPS;

  // Arah hadap
  let rotY = Math.PI / 2; // jalan ke +X
  // Belok menghadap ATM: 4.4–5.4 s
  rotY = lerp(Math.PI / 2, Math.PI, easeInOutSine(progress(t, 4.4, 1.0)));
  // Belok balik ke -X sebelum pergi: 6.0–6.6 s (PI → 3PI/2)
  rotY = rotY + (Math.PI / 2) * easeInOutSine(progress(t, 6.0, 0.6)) * (t >= 6.0 ? 1 : 0);

  const x = START_X + walkDist1(t) * (STAND_X - START_X) / D1 - walkDist2(t);

  const d = cumDist(t);
  const dNext = cumDist(t + 1 / FPS);
  const speed = Math.max(0, (dNext - d) * FPS);

  return { x, z: STAND_Z, rotY, distance: d, speed, time: t };
};

// Pejalan latar belakang (jalan konstan, jauh dari subjek utama).
export const extraPedestrianPose = (frame: number): CharacterPose => {
  const t = frame / FPS;
  const v = 0.45;
  const x = -7.6 + v * t;
  return { x, z: 1.5, rotY: Math.PI / 2, distance: v * t, speed: v, time: t };
};
