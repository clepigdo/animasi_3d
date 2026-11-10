import React from "react";
import { PALETTE } from "../config/palette";
import { FPS } from "../config/timing";
import { ClayBox, ClayCapsule, ClayCylinder, ClaySphere } from "./ClayShapes";

// Blok kota mini. Sumbu: jalan membentang di X, bangunan di belakang (Z negatif), jalan raya di depan (Z positif).
// Trotoar: z -1.5..2.0, tinggi 0.12. Jalan: z 2.0..5.6.
export const SIDEWALK_Y = 0.12;

const BUILDINGS = [
  { x: -5.8, w: 3.2, h: 4.2, color: PALETTE.coral, roof: PALETTE.mustard },
  { x: -2.5, w: 3.4, h: 3.3, color: PALETTE.softBlue, roof: PALETTE.navy },
  { x: 0.9, w: 3.2, h: 4.6, color: PALETTE.mustard, roof: PALETTE.coral },
  { x: 4.2, w: 3.4, h: 3.2, color: PALETTE.paleMint, roof: PALETTE.teal },
] as const;
const B_DEPTH = 2.4;
const B_FRONT_Z = -1.5;

const Building: React.FC<{ b: (typeof BUILDINGS)[number]; index: number }> = ({ b, index }) => {
  const cz = B_FRONT_Z - B_DEPTH / 2;
  const cols = Math.max(2, Math.round(b.w / 1.1));
  const rows = Math.max(2, Math.floor((b.h - 1.2) / 1.0));
  const winW = 0.5;
  const colGap = b.w / cols;
  return (
    <group position={[b.x, SIDEWALK_Y, cz]}>
      <ClayBox color={b.color} size={[b.w, b.h, B_DEPTH]} radius={0.12} position={[0, b.h / 2, 0]} seed={100 + index} wobble={0.006} />
      <ClayBox color={b.roof} size={[b.w + 0.2, 0.22, B_DEPTH + 0.2]} radius={0.08} position={[0, b.h + 0.05, 0]} />
      {/* Pintu */}
      <ClayBox color={PALETTE.navy} size={[0.55, 0.95, 0.1]} radius={0.05} position={[index % 2 === 0 ? b.w * 0.28 : -b.w * 0.28, 0.5, B_DEPTH / 2 + 0.0]} />
      {/* Jendela */}
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <ClayBox
            key={`${r}-${c}`}
            color={PALETTE.cream}
            size={[winW, 0.62, 0.1]}
            radius={0.06}
            position={[-b.w / 2 + colGap * (c + 0.5), 1.55 + r * 0.98, B_DEPTH / 2 + 0.0]}
            seed={200 + index * 20 + r * 5 + c}
            wobble={0.02}
          />
        )),
      )}
    </group>
  );
};

const Tree: React.FC<{ x: number; z: number; frame: number; seed: number; s?: number }> = ({ x, z, frame, seed, s = 1 }) => {
  const sway = Math.sin((frame / FPS) * 0.9 + seed) * 0.018;
  return (
    <group position={[x, SIDEWALK_Y, z]} scale={s}>
      <ClayCapsule color={PALETTE.trunk} radius={0.07} length={0.7} position={[0, 0.45, 0]} seed={seed} />
      <group position={[0, 0.9, 0]} rotation={[0, 0, sway]}>
        <ClaySphere color={PALETTE.teal} radius={0.5} position={[0, 0.45, 0]} seed={seed + 1} wobble={0.05} />
        <ClaySphere color={PALETTE.paleMint} radius={0.34} position={[0.3, 0.75, 0.1]} seed={seed + 2} wobble={0.05} />
        <ClaySphere color={PALETTE.teal} radius={0.3} position={[-0.32, 0.7, -0.05]} seed={seed + 3} wobble={0.05} />
      </group>
    </group>
  );
};

const StreetLight: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <group position={[x, SIDEWALK_Y, z]}>
    <ClayCylinder color={PALETTE.navy} radius={0.045} length={2.4} position={[0, 1.2, 0]} bump={0.5} />
    <ClayBox color={PALETTE.navy} size={[0.35, 0.05, 0.05]} radius={0.02} position={[0.15, 2.4, 0]} />
    <ClaySphere color={PALETTE.cream} radius={0.12} position={[0.3, 2.32, 0]} bump={0.4} emissive={PALETTE.cream} emissiveIntensity={0.2} />
  </group>
);

const Car: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;
  const x = -9 + 1.5 * t;
  return (
    <group position={[x, 0.04, 3.2]}>
      <ClayBox color={PALETTE.coral} size={[1.7, 0.45, 0.8]} radius={0.16} position={[0, 0.4, 0]} seed={301} />
      <ClayBox color={PALETTE.coral} size={[0.95, 0.4, 0.74]} radius={0.16} position={[-0.1, 0.78, 0]} seed={302} />
      <ClayBox color={PALETTE.softBlue} size={[0.8, 0.26, 0.76]} radius={0.1} position={[-0.1, 0.8, 0]} bump={0.3} />
      {[-0.55, 0.55].flatMap((wx) =>
        [-0.4, 0.4].map((wz) => (
          <ClayCylinder
            key={`${wx}${wz}`}
            color={PALETTE.navy}
            radius={0.18}
            length={0.14}
            position={[wx, 0.18, wz]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        )),
      )}
    </group>
  );
};

export const ClayCity: React.FC<{ frame: number }> = ({ frame }) => (
  <group>
    {/* Dasar diorama */}
    <ClayBox color={PALETTE.base} size={[24, 0.5, 11.5]} radius={0.2} position={[0, -0.25, 0.9]} bump={1.0} />
    {/* Jalan raya */}
    <ClayBox color={PALETTE.street} size={[24, 0.05, 3.6]} radius={0.02} position={[0, 0.025, 3.8]} bump={0.8} />
    {[-8, -5, -2, 1, 4, 7].map((x) => (
      <ClayBox key={x} color={PALETTE.cream} size={[1.2, 0.02, 0.12]} radius={0.01} position={[x, 0.055, 3.8]} bump={0} />
    ))}
    {/* Trotoar */}
    <ClayBox color={PALETTE.cream} size={[24, SIDEWALK_Y, 3.5]} radius={0.04} position={[0, SIDEWALK_Y / 2, 0.25]} bump={0.9} />

    {BUILDINGS.map((b, i) => (
      <Building key={i} b={b} index={i} />
    ))}

    <Tree x={-7.4} z={1.8} frame={frame} seed={3} />
    <Tree x={3.2} z={1.8} frame={frame} seed={7} s={1.1} />
    <Tree x={6.4} z={1.8} frame={frame} seed={13} s={0.95} />
    <StreetLight x={-3.0} z={1.85} />
    <StreetLight x={3.6} z={1.85} />

    <Car frame={frame} />
  </group>
);
