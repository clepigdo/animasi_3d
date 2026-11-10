import React from "react";
import { PALETTE } from "../config/palette";
import { ClayBox } from "./ClayShapes";

type Props = {
  color: string;
  position?: [number, number, number];
};

// Kaset uang: kotak penyimpan dengan tumpukan lembaran (fiktif) yang menyembul di atasnya.
// Representasi umum untuk edukasi, bukan model mesin tertentu.
export const CashCassette: React.FC<Props> = ({ color, position = [0, 0, 0] }) => (
  <group position={position}>
    <ClayBox color={color} size={[0.46, 0.4, 0.58]} radius={0.05} seed={31} />
    {/* Pegangan */}
    <ClayBox color={PALETTE.cream} size={[0.2, 0.05, 0.04]} radius={0.02} position={[0, 0.02, 0.3]} />
    {/* Tumpukan lembaran */}
    <ClayBox color={PALETTE.paleMint} size={[0.4, 0.14, 0.5]} radius={0.015} position={[0, 0.25, 0]} bump={0.5} />
    <ClayBox color={PALETTE.coral} size={[0.41, 0.025, 0.51]} radius={0.01} position={[0, 0.25, 0]} bump={0.3} />
  </group>
);
