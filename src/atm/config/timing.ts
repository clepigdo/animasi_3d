// Satu-satunya sumber kebenaran untuk timing. Semua nilai dalam DETIK lalu dikonversi ke frame.
// Mau ganti FPS? Cukup ubah FPS di bawah.

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Diukur dari ATM_VOICE.mp3 dengan ffprobe.
export const NARRATION_SECONDS = 133.459583;
export const TOTAL_FRAMES = Math.ceil(NARRATION_SECONDS * FPS); // 8008 @ 60 fps

export const sec = (s: number) => Math.round(s * FPS);

// Jeda napas narator, diukur dengan ffmpeg silencedetect (noise -35 dB, min 0.45 s).
// Ini KANDIDAT titik potong saja. Belum dipetakan ke kalimat; itu dikerjakan di Milestone 4.
export const MEASURED_PAUSES_SEC: ReadonlyArray<readonly [number, number]> = [
  [5.61, 6.27],
  [9.22, 9.71],
  [12.9, 13.41],
  [18.34, 19.02],
  [21.7, 22.28],
  [23.86, 24.43],
  [29.89, 30.44],
  [34.52, 35.1],
  [36.98, 37.52],
  [43.75, 44.21],
  [49.67, 50.17],
  [53.66, 54.17],
  [57.97, 58.45],
  [62.72, 63.22],
  [68.35, 68.85],
  [72.65, 73.12],
  [78.06, 78.52],
  [82.5, 82.96],
  [86.9, 87.37],
  [96.34, 96.82],
  [109.15, 109.68],
  [116.98, 117.45],
  [128.26, 128.75],
];

// Jendela sementara untuk prototype Milestone 2 (15 detik). Bukan timing final.
export const PROTO = {
  cityIntro: { from: 0, duration: sec(6) },
  reveal: { from: sec(6), duration: sec(9) },
  total: sec(15),
} as const;

export const NARRATION_FILE = "audio/ATM_VOICE.mp3"; // relatif terhadap /public
