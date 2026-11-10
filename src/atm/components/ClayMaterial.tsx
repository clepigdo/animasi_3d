import React from "react";
import * as THREE from "three";
import { mulberry32 } from "../utils/seeded";

const SIZE = 128;
const COARSE = 16;

let cachedBump: THREE.DataTexture | null = null;

// Bump map noise deterministik, dibuat sekali, tanpa DOM/canvas dan tanpa jaringan.
// Gabungan noise kasar (lekukan jempol) dan noise halus (butiran tanah liat).
export const getClayBumpTexture = (): THREE.DataTexture => {
  if (cachedBump) return cachedBump;

  const rand = mulberry32(1337);
  const grid = new Float32Array(COARSE * COARSE);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();

  const smooth = (t: number) => t * t * (3 - 2 * t);
  const sample = (u: number, v: number) => {
    const x = u * COARSE;
    const y = v * COARSE;
    const x0 = Math.floor(x) % COARSE;
    const y0 = Math.floor(y) % COARSE;
    const x1 = (x0 + 1) % COARSE; // tileable
    const y1 = (y0 + 1) % COARSE;
    const fx = smooth(x - Math.floor(x));
    const fy = smooth(y - Math.floor(y));
    const a = grid[y0 * COARSE + x0];
    const b = grid[y0 * COARSE + x1];
    const c = grid[y1 * COARSE + x0];
    const d = grid[y1 * COARSE + x1];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };

  const data = new Uint8Array(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const coarse = sample(x / SIZE, y / SIZE);
      const fine = rand();
      const v = Math.round(255 * (coarse * 0.75 + fine * 0.25));
      const i = (y * SIZE + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  cachedBump = tex;
  return tex;
};

export type ClayMaterialOptions = {
  // Seberapa terasa "lekukan tangan". 0 = mulus.
  bump?: number;
  roughness?: number;
  // Untuk layar / lampu kecil. Dipakai hemat (spesifikasi: tanpa efek glow berlebihan).
  emissive?: string;
  emissiveIntensity?: number;
};

const materialCache = new Map<string, THREE.MeshStandardMaterial>();

// Satu material per kombinasi warna+opsi, dipakai bersama oleh semua mesh.
export const getClayMaterial = (
  color: string,
  { bump = 1.2, roughness = 0.92, emissive, emissiveIntensity = 0 }: ClayMaterialOptions = {},
): THREE.MeshStandardMaterial => {
  const key = `${color}|${bump}|${roughness}|${emissive ?? ""}|${emissiveIntensity}`;
  const hit = materialCache.get(key);
  if (hit) return hit;
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
    bumpMap: bump > 0 ? getClayBumpTexture() : null,
    bumpScale: bump,
    emissive: emissive ?? "#000000",
    emissiveIntensity,
  });
  materialCache.set(key, mat);
  return mat;
};

type ClayMaterialProps = { color: string } & ClayMaterialOptions;

// Dipertahankan dari Milestone 1.
export const ClayMaterial: React.FC<ClayMaterialProps> = ({ color, ...opts }) => (
  <primitive object={getClayMaterial(color, opts)} attach="material" />
);
