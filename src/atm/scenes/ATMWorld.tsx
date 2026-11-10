import React, { useMemo } from "react";
import { PALETTE } from "../config/palette";
import { sec } from "../config/timing";
import { characterPose, extraPedestrianPose } from "../animation/characterPath";
import { ATMExterior, computeATMOpen } from "../components/ATMExterior";
import { ATMInterior } from "../components/ATMInterior";
import { CameraKey, CameraRig } from "../components/CameraRig";
import { ClayCharacter } from "../components/ClayCharacter";
import { ClayCity, SIDEWALK_Y } from "../components/ClayCity";
import { easeInOutSine, progress } from "../utils/easing";

// Kamera prototype 15 detik (9:16). Sementara; disetel ulang setelah narasi dipetakan (Milestone 4).
const CAMERA_KEYS: CameraKey[] = [
  { t: 0, pos: [-1.0, 4.4, 15.5], target: [-4.2, 1.1, 0.5] },
  { t: 2.2, pos: [0.4, 3.3, 11.5], target: [-2.2, 1.0, 0.5] },
  { t: 4.4, pos: [1.0, 2.3, 7.2], target: [-0.2, 1.1, 0.2] },
  { t: 6.0, pos: [0.9, 1.7, 5.0], target: [0.0, 1.1, -0.5] },
  { t: 9.0, pos: [0.3, 1.4, 3.0], target: [0.0, 1.0, -0.7] },
  { t: 12.0, pos: [0.45, 1.3, 2.1], target: [-0.05, 0.95, -0.8] },
  { t: 15.0, pos: [0.45, 1.25, 1.5], target: [-0.05, 0.95, -0.85] },
];

const ATM_POS: [number, number, number] = [0, SIDEWALK_Y, -0.8];
const ATM_SCALE = 0.8;
const REVEAL_START = sec(8.0);

type Props = { frame: number };

export const ATMWorld: React.FC<Props> = ({ frame }) => {
  const keys = useMemo(() => CAMERA_KEYS, []);
  const pose = characterPose(frame);
  const ped = extraPedestrianPose(frame);
  const open = computeATMOpen(frame, REVEAL_START);
  const interiorLight = open.top;

  const t = frame / 60;
  // Kepala menoleh ke layar ATM setelah berhenti (5.0–6.0 s), lalu kembali.
  const lookUp = easeInOutSine(progress(t, 4.8, 0.6)) * (1 - easeInOutSine(progress(t, 6.0, 0.4)));
  const headPitch = -0.12 * lookUp;

  return (
    <>
      <color attach="background" args={["#F1E4C9"]} />
      <CameraRig frame={frame} keys={keys} />

      <hemisphereLight args={["#fff4dc", "#d9c29a", 0.9]} />
      <directionalLight
        position={[-5, 9, 7]}
        intensity={2.0}
        color="#ffe2b4"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={8}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      <ClayCity frame={frame} />

      <group position={ATM_POS} scale={ATM_SCALE}>
        <ATMInterior light={interiorLight} />
        <ATMExterior open={open} />
      </group>

      <group position={[0, SIDEWALK_Y, 0]}>
        <ClayCharacter pose={pose} headPitch={headPitch} />
        <ClayCharacter
          pose={{ ...ped, z: ped.z }}
          scale={0.85}
          sweater={PALETTE.coral}
          trousers={PALETTE.mutedLavender}
          shoes={PALETTE.cream}
          hair={PALETTE.navy}
          seed={77}
        />
      </group>
    </>
  );
};
