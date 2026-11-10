import React from "react";
import { PALETTE } from "../config/palette";
import { CharacterPose, CRUISE_SPEED } from "../animation/characterPath";
import { ClayBox, ClayCapsule, ClaySphere } from "./ClayShapes";

const STRIDE_CYCLE = 0.9; // meter per siklus langkah penuh (kiri+kanan)
const HIP_H = 0.52;

type Props = {
  pose: CharacterPose;
  scale?: number;
  sweater?: string;
  trousers?: string;
  shoes?: string;
  hair?: string;
  // Arah pandang kepala relatif badan (radian).
  headYaw?: number;
  headPitch?: number;
  seed?: number;
};

// Karakter clay utama. Menghadap +Z pada rotY = 0.
// Langkah dihitung dari jarak tempuh; amplitudo ikut kecepatan sehingga berhenti dengan mulus.
export const ClayCharacter: React.FC<Props> = ({
  pose,
  scale = 1,
  sweater = PALETTE.mustard,
  trousers = PALETTE.navy,
  shoes = PALETTE.cream,
  hair = PALETTE.hair,
  headYaw = 0,
  headPitch = 0,
  seed = 11,
}) => {
  const phase = (pose.distance / STRIDE_CYCLE) * Math.PI * 2;
  const speedRatio = Math.min(1.15, pose.speed / CRUISE_SPEED);
  const amp = 0.55 * speedRatio;
  const swing = Math.sin(phase) * amp;
  const bob = Math.abs(Math.cos(phase)) * 0.035 * speedRatio;
  const breathe = Math.sin(pose.time * 2.2) * 0.012 * (1 - Math.min(1, speedRatio));
  const lean = 0.07 * speedRatio;
  const sway = Math.sin(phase) * 0.05 * speedRatio;

  // Lutut tertekuk sedikit di kaki yang terangkat
  const kneeL = Math.max(0, -Math.sin(phase)) * 0.0;

  return (
    <group position={[pose.x, 0, pose.z]} rotation={[0, pose.rotY, 0]} scale={scale}>
      <group position={[0, HIP_H + bob, 0]} rotation={[lean, 0, sway]}>
        {/* Kaki */}
        {[1, -1].map((side) => {
          const a = side * swing;
          return (
            <group key={side} position={[side * 0.12, 0, 0]} rotation={[a + kneeL, 0, 0]}>
              <ClayCapsule color={trousers} radius={0.085} length={0.3} position={[0, -0.22, 0]} seed={seed + side} />
              <ClayBox
                color={shoes}
                size={[0.17, 0.1, 0.3]}
                radius={0.045}
                position={[0, -0.46, 0.05]}
                seed={seed + 3 + side}
              />
            </group>
          );
        })}

        {/* Badan */}
        <group scale={[1, 1 + breathe, 1]}>
          <ClayCapsule color={sweater} radius={0.2} length={0.2} position={[0, 0.3, 0]} seed={seed + 5} />
          {/* Kerah */}
          <ClayCapsule
            color={PALETTE.cream}
            radius={0.05}
            length={0.22}
            position={[0, 0.56, 0.02]}
            rotation={[0, 0, Math.PI / 2]}
          />
        </group>

        {/* Lengan */}
        {[1, -1].map((side) => (
          <group
            key={side}
            position={[side * 0.25, 0.5, 0]}
            rotation={[-side * swing * 0.9, 0, side * 0.1]}
          >
            <ClayCapsule color={sweater} radius={0.062} length={0.2} position={[0, -0.16, 0]} seed={seed + 8 + side} />
            <ClaySphere color={PALETTE.skin} radius={0.066} position={[0, -0.33, 0]} bump={0.6} />
          </group>
        ))}

        {/* Kepala */}
        <group position={[0, 0.62, 0]} rotation={[headPitch, headYaw, 0]}>
          <ClaySphere color={PALETTE.skin} radius={0.28} position={[0, 0.24, 0]} bump={0.7} seed={seed + 20} wobble={0.015} />
          {/* Rambut */}
          <ClaySphere
            color={hair}
            radius={0.295}
            position={[0, 0.3, -0.035]}
            scale={[1, 0.8, 1]}
            bump={1.0}
          />
          {/* Mata */}
          <ClaySphere color={PALETTE.navy} radius={0.034} position={[0.1, 0.23, 0.245]} scale={[1, 1.25, 0.6]} bump={0} />
          <ClaySphere color={PALETTE.navy} radius={0.034} position={[-0.1, 0.23, 0.245]} scale={[1, 1.25, 0.6]} bump={0} />
          {/* Alis */}
          <ClayCapsule color={hair} radius={0.012} length={0.06} position={[0.1, 0.3, 0.25]} rotation={[0, 0, Math.PI / 2 - 0.12]} bump={0} />
          <ClayCapsule color={hair} radius={0.012} length={0.06} position={[-0.1, 0.3, 0.25]} rotation={[0, 0, Math.PI / 2 + 0.12]} bump={0} />
          {/* Pipi */}
          <ClaySphere color={PALETTE.coral} radius={0.04} position={[0.16, 0.15, 0.22]} scale={[1, 0.7, 0.4]} bump={0} />
          <ClaySphere color={PALETTE.coral} radius={0.04} position={[-0.16, 0.15, 0.22]} scale={[1, 0.7, 0.4]} bump={0} />
        </group>
      </group>
    </group>
  );
};
