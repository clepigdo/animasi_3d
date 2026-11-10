import React, { useLayoutEffect } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { ClayTestBlock } from "../components/ClayTestBlock";
import { ClayMaterial } from "../components/ClayMaterial";
import { PALETTE } from "../config/palette";
import { NARRATION_FILE, TOTAL_FRAMES } from "../config/timing";
import { easeInOutCubic, progress } from "../utils/easing";

// Sementara: arahkan kamera ke titik target. Diganti CameraRig di Milestone 2.
const CameraLookAt: React.FC<{ target: [number, number, number] }> = ({ target }) => {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [camera, target]);
  return null;
};

const LOOK_TARGET: [number, number, number] = [0, 0.6, 0];

const FrameHud: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps;
  const mm = Math.floor(t / 60);
  const ss = (t - mm * 60).toFixed(2).padStart(5, "0");
  return (
    <div
      style={{
        position: "absolute",
        left: 24,
        bottom: 24,
        padding: "8px 14px",
        borderRadius: 10,
        background: "rgba(82,97,125,0.85)",
        color: "#F2DEBB",
        fontFamily: "monospace",
        fontSize: 28,
      }}
    >
      f {frame}/{TOTAL_FRAMES} · {mm}:{ss}
    </div>
  );
};

type Props = { debugHud?: boolean };

// Milestone 1: bukti bahwa 3D tampil, bisa di-scrub, dan audio narasi nyambung.
// Semua gerak dihitung dari frame, tanpa useFrame dan tanpa wall-clock.
export const ATMEpisode01: React.FC<Props> = ({ debugHud = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const spin = easeInOutCubic(progress(frame, 0, 600)) * Math.PI * 0.5 + (frame / fps) * 0.35;
  const bob = Math.sin((frame / fps) * Math.PI * 0.8) * 0.06;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.cream }} from={-920}>
      <Audio src={staticFile(NARRATION_FILE)} />

      <ThreeCanvas
        width={width}
        height={height}
        shadows
        camera={{ position: [3.4, 2.6, 5.2], fov: 38, near: 0.1, far: 100 }}
      >
        <color attach="background" args={[PALETTE.cream]} />
        <CameraLookAt target={LOOK_TARGET} />

        <ambientLight intensity={0.85} color="#fff3dc" />
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.9}
          color="#ffe6bd"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0005}
        />

        {/* Alas */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <ClayMaterial color={PALETTE.paleMint} bump={0.8} />
        </mesh>

        {/* Blok uji */}
        <group position={[0, 0.55 + bob, 0]} rotation={[0, spin, 0]}>
          <ClayTestBlock color={PALETTE.teal} size={[1.2, 1.1, 1.2]} />
          <ClayTestBlock
            color={PALETTE.coral}
            size={[0.6, 0.6, 0.6]}
            radius={0.15}
            position={[1.1, -0.25, 0.2]}
          />
          <ClayTestBlock
            color={PALETTE.mustard}
            size={[0.5, 0.5, 0.5]}
            radius={0.14}
            position={[-1.0, -0.3, -0.3]}
          />
        </group>
      </ThreeCanvas>

      {debugHud ? <FrameHud frame={frame} fps={fps} /> : null}
    </AbsoluteFill>
  );
};
