import React from "react";
import { PALETTE } from "../config/palette";
import { sec } from "../config/timing";
import { easeInOutCubic, easeOutBack, progress } from "../utils/easing";
import { ClayBox, ClaySphere } from "./ClayShapes";

// Dimensi lokal (sebelum diskalakan): lebar 1.3, tinggi 2.3, dalam 1.0. Depan = +Z, dasar y = 0.
export type ATMOpenState = {
  top: number; // 0..1 tutup atas terangkat
  sides: number; // 0..1 panel samping bergeser keluar
  doors: number; // 0..1 dua pintu depan berayun
};

export const ATM_CLOSED: ATMOpenState = { top: 0, sides: 0, doors: 0 };

// Urutan reveal: atap naik → sisi bergeser → pintu berayun (dengan overshoot kecil).
// Dipakai ulang di episode lain: cukup ganti startFrame.
export const computeATMOpen = (frame: number, startFrame: number): ATMOpenState => ({
  top: easeInOutCubic(progress(frame, startFrame, sec(1.8))),
  sides: easeInOutCubic(progress(frame, startFrame + sec(0.6), sec(2.0))),
  doors: easeOutBack(progress(frame, startFrame + sec(1.4), sec(2.4)), 0.2),
});

const DOOR_ANGLE = 1.9; // radian (~109°)

type DoorProps = {
  hingeX: number;
  y: number;
  side: 1 | -1; // 1: daun pintu membentang ke +X dari engsel
  open: number;
  children?: React.ReactNode;
};

const Door: React.FC<DoorProps> = ({ hingeX, y, side, open, children }) => (
  <group position={[hingeX, y, 0.45]} rotation={[0, -side * DOOR_ANGLE * open, 0]}>
    <group position={[side * 0.65, 0, 0]}>
      <ClayBox color={PALETTE.teal} size={[1.3, 1.04, 0.1]} radius={0.05} seed={41 + side} />
      {children}
    </group>
  </group>
);

const KEY_X = [-0.14, 0, 0.14];
const KEY_Y = [0.09, 0.03, -0.03, -0.09];

type Props = { open?: ATMOpenState };

export const ATMExterior: React.FC<Props> = ({ open = ATM_CLOSED }) => {
  const { top, sides, doors } = open;
  return (
    <group>
      {/* Alas dan punggung (tetap) */}
      <ClayBox color={PALETTE.navy} size={[1.3, 0.1, 1.0]} radius={0.04} position={[0, 0.05, 0]} />
      <ClayBox color={PALETTE.teal} size={[1.3, 2.1, 0.1]} radius={0.05} position={[0, 1.15, -0.45]} seed={51} />

      {/* Tutup atas */}
      <group position={[0, 2.25 + top * 1.1, 0]} rotation={[0, 0, top * 0.12]}>
        <ClayBox color={PALETTE.mustard} size={[1.3, 0.1, 1.0]} radius={0.05} seed={52} />
        <ClayBox color={PALETTE.coral} size={[1.0, 0.04, 0.04]} radius={0.015} position={[0, 0.0, 0.5]} />
      </group>

      {/* Panel samping */}
      {[-1, 1].map((s) => (
        <group
          key={s}
          position={[s * (0.6 + sides * 1.0), 1.15, 0]}
          rotation={[0, 0, s * sides * 0.2]}
        >
          <ClayBox color={PALETTE.teal} size={[0.1, 2.1, 1.0]} radius={0.04} seed={60 + s} />
          <ClayBox color={PALETTE.coral} size={[0.12, 0.08, 0.9]} radius={0.03} position={[0, 0.2, 0]} />
        </group>
      ))}

      {/* Pintu atas: layar, kartu, keypad. Engsel kiri. */}
      <Door hingeX={-0.65} y={1.675} side={1} open={doors}>
        <ClayBox color={PALETTE.navy} size={[0.8, 0.52, 0.04]} radius={0.04} position={[0, 0.22, 0.065]} />
        <ClayBox
          color={PALETTE.softBlue}
          size={[0.68, 0.4, 0.03]}
          radius={0.02}
          position={[0, 0.22, 0.09]}
          bump={0.3}
          emissive={PALETTE.softBlue}
          emissiveIntensity={0.3}
        />
        {/* Isi layar abstrak: bukan angka nyata */}
        {[-0.17, 0.17].flatMap((x) =>
          [0.1, 0.3].map((y) => (
            <ClayBox
              key={`${x}${y}`}
              color={PALETTE.cream}
              size={[0.22, 0.07, 0.01]}
              radius={0.01}
              position={[x, y + 0.0, 0.11]}
              bump={0}
            />
          )),
        )}
        {/* Keypad (tanpa angka) */}
        <ClayBox color={PALETTE.cream} size={[0.5, 0.3, 0.05]} radius={0.03} position={[-0.1, -0.24, 0.07]} />
        {KEY_X.flatMap((x, i) =>
          KEY_Y.map((y, j) => (
            <ClayBox
              key={`${i}${j}`}
              color={PALETTE.navy}
              size={[0.09, 0.04, 0.03]}
              radius={0.012}
              position={[x - 0.1, y - 0.24, 0.1]}
              bump={0}
            />
          )),
        )}
        {/* Slot kartu */}
        <ClayBox color={PALETTE.navy} size={[0.22, 0.05, 0.04]} radius={0.02} position={[0.38, -0.12, 0.07]} />
        <ClaySphere color={PALETTE.mustard} radius={0.022} position={[0.38, -0.04, 0.08]} bump={0} />
      </Door>

      {/* Pintu bawah: slot uang. Engsel kanan. */}
      <Door hingeX={0.65} y={0.625} side={-1} open={doors}>
        <ClayBox color={PALETTE.navy} size={[0.62, 0.1, 0.04]} radius={0.03} position={[0, 0.2, 0.065]} />
        <ClayBox color={PALETTE.mustard} size={[0.72, 0.04, 0.1]} radius={0.02} position={[0, 0.12, 0.1]} />
        <ClayBox color={PALETTE.coral} size={[1.1, 0.05, 0.02]} radius={0.02} position={[0, -0.25, 0.06]} />
        <ClaySphere color={PALETTE.statusGreen} radius={0.03} position={[-0.4, 0.38, 0.07]} bump={0} />
        <ClaySphere color={PALETTE.statusRed} radius={0.03} position={[-0.3, 0.38, 0.07]} bump={0} />
      </Door>
    </group>
  );
};
