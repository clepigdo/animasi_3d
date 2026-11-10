import React from "react";
import { PALETTE } from "../config/palette";
import { ClayBox, ClayCylinder } from "./ClayShapes";

type Props = {
  position?: [number, number, number];
  // Rotasi roller (radian). Diam (0) sampai transaksi disetujui; animasi baru dipakai di Milestone 3.
  spin?: number;
};

const Z_POSITIONS = [-0.22, -0.07, 0.08, 0.23];

// Jalur roller berpasangan (atas-bawah) yang menjepit lembaran dan mendorongnya ke depan (+Z).
export const RollerAssembly: React.FC<Props> = ({ position = [0, 0, 0], spin = 0 }) => (
  <group position={position}>
    {Z_POSITIONS.map((z) => (
      <group key={z}>
        <ClayCylinder
          color={PALETTE.warmGrey}
          radius={0.045}
          length={0.74}
          position={[0, -0.05, z]}
          rotation={[0, 0, Math.PI / 2 + spin]}
          bump={0.4}
        />
        <ClayCylinder
          color={PALETTE.mutedLavender}
          radius={0.045}
          length={0.74}
          position={[0, 0.05, z]}
          rotation={[0, 0, Math.PI / 2 - spin]}
          bump={0.4}
        />
      </group>
    ))}
    {/* Pelat samping penyangga roller */}
    <ClayBox color={PALETTE.navy} size={[0.04, 0.24, 0.66]} radius={0.015} position={[0.4, 0, 0.0]} />
    <ClayBox color={PALETTE.navy} size={[0.04, 0.24, 0.66]} radius={0.015} position={[-0.4, 0, 0.0]} />
  </group>
);
