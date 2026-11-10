import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { NARRATION_FILE, TOTAL_FRAMES } from "../config/timing";
import { ATMWorld } from "../scenes/ATMWorld";

type Props = { debugHud?: boolean; withAudio?: boolean };

// Milestone 2: prototype visual 15 detik (kota clay + karakter + ATM + reveal).
// Ini tes visual, bukan pembuka episode final.
export const ATMPrototype15s: React.FC<Props> = ({ debugHud = true, withAudio = true }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F1E4C9" }}>
      {withAudio ? <Audio src={staticFile(NARRATION_FILE)} /> : null}
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        camera={{ position: [-2.2, 2.6, 8.4], fov: 38, near: 0.1, far: 120 }}
      >
        <ATMWorld frame={frame} />
      </ThreeCanvas>
      {debugHud ? (
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
          f {frame}/{TOTAL_FRAMES} · {t.toFixed(2)}s
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
