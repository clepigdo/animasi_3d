// Fungsi murni: input 0..1, output 0..1. Tanpa state.
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOutCubic = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const easeInOutSine = (x: number) => -(Math.cos(Math.PI * clamp01(x)) - 1) / 2;

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

// Ease-out dengan overshoot kecil (default 0.4 → sekitar 2-3% melewati target).
export const easeOutBack = (x: number, overshoot = 0.4) => {
  const t = clamp01(x);
  const c3 = overshoot + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
};

// Progres 0..1 dari frame, untuk jendela [from, from+duration].
export const progress = (frame: number, from: number, duration: number) =>
  clamp01((frame - from) / Math.max(1, duration));

// Interpolasi kubik monoton (Fritsch-Carlson), turunan di ujung = 0 (ease in/out di awal & akhir).
// Dipakai CameraRig supaya kecepatan kamera mulus dan tidak mundur.
export const monotoneCubic = (xs: number[], ys: number[]) => {
  const n = xs.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]);
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
};
