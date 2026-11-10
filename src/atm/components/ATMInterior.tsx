import React from "react";
import { PALETTE } from "../config/palette";
import { CashCassette } from "./CashCassette";
import { ClayBox, ClayCylinder, ClaySphere } from "./ClayShapes";
import { RollerAssembly } from "./RollerAssembly";

type Props = {
  // 0..1: seberapa terang lampu interior (naik saat cangkang terbuka).
  light?: number;
};

// Interior ATM yang disederhanakan untuk edukasi. Koordinat lokal ATM: depan = +Z, dasar y=0.
// Representasi umum, bukan klaim tentang bagian dalam semua merek ATM.
export const ATMInterior: React.FC<Props> = ({ light = 1 }) => (
  <group>
    <pointLight position={[0, 1.2, 0.15]} color="#d6e8ff" intensity={0.7 * light} distance={3.5} decay={2} />

    {/* Pelat belakang interior */}
    <ClayBox color={PALETTE.cream} size={[1.04, 2.0, 0.03]} radius={0.01} position={[0, 1.15, -0.39]} bump={0.6} />

    {/* Rangka penyangga */}
    {[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) => (
        <ClayBox
          key={`${sx}${sz}`}
          color={PALETTE.navy}
          size={[0.05, 2.1, 0.05]}
          radius={0.02}
          position={[sx * 0.52, 1.15, sz * 0.37]}
        />
      )),
    )}
    <ClayBox color={PALETTE.navy} size={[1.04, 0.04, 0.78]} radius={0.015} position={[0, 1.42, 0]} />
    <ClayBox color={PALETTE.navy} size={[1.04, 0.04, 0.78]} radius={0.015} position={[0, 0.12, 0]} />

    {/* Elektronika kontrol (atas) */}
    <ClayBox color={PALETTE.teal} size={[0.9, 0.5, 0.08]} radius={0.03} position={[0, 1.8, -0.3]} />
    {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
      <ClayBox
        key={x}
        color={[PALETTE.mustard, PALETTE.coral, PALETTE.cream, PALETTE.mutedLavender][i]}
        size={[0.14, 0.1, 0.04]}
        radius={0.02}
        position={[x, 1.82, -0.24]}
      />
    ))}
    <ClaySphere color={PALETTE.statusGreen} radius={0.025} position={[-0.38, 1.98, -0.24]} bump={0} emissive={PALETTE.statusGreen} emissiveIntensity={0.25} />
    <ClaySphere color={PALETTE.statusRed} radius={0.025} position={[-0.31, 1.98, -0.24]} bump={0} />
    {/* Modul daya */}
    <ClayBox color={PALETTE.coral} size={[0.36, 0.26, 0.4]} radius={0.04} position={[-0.28, 1.57, -0.12]} />

    {/* Kaset uang (bawah) */}
    <CashCassette color={PALETTE.coral} position={[-0.27, 0.34, -0.08]} />
    <CashCassette color={PALETTE.mustard} position={[0.27, 0.34, -0.08]} />

    {/* Roller pengambil di atas kaset */}
    <ClayCylinder color={PALETTE.warmGrey} radius={0.05} length={0.4} position={[-0.27, 0.72, -0.3]} rotation={[0, 0, Math.PI / 2]} />
    <ClayCylinder color={PALETTE.warmGrey} radius={0.05} length={0.4} position={[0.27, 0.72, -0.3]} rotation={[0, 0, Math.PI / 2]} />

    {/* Pemandu jalur naik ke roller */}
    <ClayBox color={PALETTE.softBlue} size={[0.7, 0.26, 0.02]} radius={0.008} position={[0, 0.78, -0.34]} bump={0.3} />

    {/* Jalur roller (menuju slot keluar di depan) */}
    <RollerAssembly position={[0, 0.85, 0]} />

    {/* Area sensor/inspeksi sederhana */}
    <ClayBox color={PALETTE.mutedLavender} size={[0.5, 0.06, 0.1]} radius={0.02} position={[0, 0.99, 0.0]} />
    <ClaySphere color={PALETTE.statusGreen} radius={0.022} position={[0.18, 1.03, 0.0]} bump={0} emissive={PALETTE.statusGreen} emissiveIntensity={0.25} />

    {/* Modul penyaji di dekat slot keluar */}
    <ClayBox color={PALETTE.mustard} size={[0.6, 0.1, 0.12]} radius={0.03} position={[0, 0.78, 0.34]} />
  </group>
);
