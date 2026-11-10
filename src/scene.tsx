import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// All movement is a deterministic function of frame. No useFrame(), random numbers, or physics simulation.
const C = {
  cream: "#fff2d9",
  navy: "#34365e",
  navy2: "#504c80",
  cyan: "#2ec9c3",
  sky: "#6ccafd",
  lavender: "#ad87ed",
  gold: "#ffca62",
  warm: "#ffde9d",
  purple: "#6643b7",
  pink: "#ed9fcb",
  wood: "#9f6c54",
  dark: "#272342",
  mint: "#8ce6c1",
  red: "#ec7b74",
};
const smooth = (x: number) =>
  Math.min(1, Math.max(0, x)) ** 2 * (3 - 2 * Math.min(1, Math.max(0, x)));
const ramp = (t: number, a: number, b: number) => smooth((t - a) / (b - a));

const Box: React.FC<{
  p?: [number, number, number];
  s?: [number, number, number];
  color?: string;
  metalness?: number;
  emissive?: string;
  emission?: number;
  rot?: [number, number, number];
}> = ({
  p = [0, 0, 0],
  s = [1, 1, 1],
  color = C.cream,
  metalness = 0,
  emissive = "#000000",
  emission = 0,
  rot = [0, 0, 0],
}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={0.65}
      emissive={emissive}
      emissiveIntensity={emission}
    />
  </mesh>
);
const Tile: React.FC<{ x: number; z: number; idx: number }> = ({
  x,
  z,
  idx,
}) => (
  <Box
    p={[x, -0.12, z]}
    s={[1.18, 0.12, 1.18]}
    color={idx % 2 ? "#ebe0ff" : "#f8efff"}
  />
);
const Spark: React.FC<{
  p: [number, number, number];
  scale?: number;
  color?: string;
}> = ({ p, scale = 0.3, color = C.gold }) => (
  <group position={p} rotation={[0, 0.45, 0.45]}>
    <Box
      s={[scale, scale * 0.32, scale * 0.32]}
      color={color}
      emissive={color}
      emission={0.23}
    />
    <Box
      s={[scale * 0.32, scale, scale * 0.32]}
      color={color}
      emissive={color}
      emission={0.23}
    />
  </group>
);

const Niko: React.FC<{ time: number }> = ({ time }) => {
  const approach = ramp(time, 3.2, 6.7);
  const startle = ramp(time, 9.65, 10.15) * (1 - ramp(time, 12.2, 12.7));
  // Before the accident Niko makes a small lateral step toward the console.
  // The satchel on his right hip is the source of the contact, not his hand.
  const sidestep = ramp(time, 7.95, 8.73);
  const contact = ramp(time, 8.73, 8.89) * (1 - ramp(time, 9.25, 9.48));
  const recoil = ramp(time, 9.55, 9.92) * (1 - ramp(time, 10.5, 11.0));
  const isWalking = time > 3.2 && time < 6.7;
  const walk = isWalking ? Math.sin((time - 3.2) * 11) * 0.5 : 0;
  const inspect = ramp(time, 6.5, 7.3) * (1 - ramp(time, 9.42, 9.85));
  const bodyLift = startle * 0.17;
  const x =
    -1.85 + approach * 1.2 + sidestep * 0.25 - recoil * 0.17 - startle * 0.1;
  const faceY = 1.52 + Math.sin(time * 2.7) * 0.018 + bodyLift;
  const eyeColor = C.dark;
  const eyes = startle > 0.3 ? 0.12 : 0.085;
  return (
    <group
      position={[x, 0.12, 1.2]}
      rotation={[
        0,
        -0.12 + inspect * -0.05 + contact * 0.06 - startle * 0.23,
        0,
      ]}
    >
      <group
        position={[0, Math.abs(walk) * 0.09 + bodyLift - contact * 0.035, 0]}
        rotation={[
          contact * 0.055 - recoil * 0.065,
          0,
          -contact * 0.045 + recoil * 0.08,
        ]}
      >
        {/* Legs pivot from hip */}
        <group position={[-0.17, 0.69, 0]} rotation={[walk, 0, 0]}>
          <Box p={[0, -0.31, 0]} s={[0.21, 0.67, 0.22]} color={C.navy} />
          <Box p={[0, -0.69, 0.09]} s={[0.31, 0.16, 0.45]} color={C.wood} />
        </group>
        <group position={[0.17, 0.69, 0]} rotation={[-walk, 0, 0]}>
          <Box p={[0, -0.31, 0]} s={[0.21, 0.67, 0.22]} color={C.navy} />
          <Box p={[0, -0.69, 0.09]} s={[0.31, 0.16, 0.45]} color={C.wood} />
        </group>
        {/* Torso / scarf */}
        <Box p={[0, 1.03, 0]} s={[0.79, 0.75, 0.46]} color={C.navy} />
        <Box p={[0, 1.37, 0.02]} s={[0.86, 0.19, 0.53]} color={C.cyan} />
        <Box
          p={[-0.3, 1.12, 0.3]}
          s={[0.12, 0.14, 0.07]}
          color={C.gold}
          metalness={0.5}
        />
        {/* Satchel on Niko's RIGHT hip, toward the console.
          It swings on its own pivot and clips the lever handle. */}
        <Box
          p={[-0.16, 1.09, 0.26]}
          s={[0.085, 0.69, 0.07]}
          color={C.wood}
          rot={[0, 0, -0.63]}
        />
        <group
          position={[0.43, 1.0, 0.05]}
          rotation={[0, 0, contact * 0.2 - recoil * 0.1]}
        >
          <Box p={[0, -0.22, 0]} s={[0.38, 0.36, 0.26]} color={C.wood} />
          <Box p={[0, -0.13, 0.16]} s={[0.35, 0.09, 0.035]} color={C.gold} />
          <Box p={[0.18, -0.22, 0.01]} s={[0.08, 0.17, 0.13]} color={C.gold} />
        </group>
        {/* Arms */}
        <group position={[-0.48, 1.26, 0]} rotation={[walk * 0.4, 0, -0.16]}>
          <Box p={[0, -0.3, 0]} s={[0.22, 0.61, 0.25]} color={C.navy} />
          <Box p={[0, -0.64, 0.015]} s={[0.25, 0.23, 0.26]} color={C.cream} />
        </group>
        <group
          position={[0.48, 1.26, 0]}
          rotation={[
            time > 6.7 && time < 9.8 ? -0.45 : -walk * 0.4,
            0,
            inspect * -0.38 - startle * 0.8,
          ]}
        >
          <Box p={[0, -0.3, 0]} s={[0.22, 0.61, 0.25]} color={C.navy} />
          <Box p={[0, -0.64, 0]} s={[0.25, 0.23, 0.26]} color={C.cream} />
        </group>
        {/* Head face looking camera */}
        <group
          position={[0, faceY + 0.19, 0.02]}
          rotation={[startle * -0.1, 0, inspect * 0.07]}
        >
          <Box s={[1.03, 0.94, 0.79]} color={C.cream} />
          <Box
            p={[-0.2, 0.07, 0.405]}
            s={[eyes, eyes * 1.9, 0.02]}
            color={eyeColor}
          />
          <Box
            p={[0.2, 0.07, 0.405]}
            s={[eyes, eyes * 1.9, 0.02]}
            color={eyeColor}
          />
          <Box
            p={[-0.32, -0.12, 0.407]}
            s={[0.14, 0.075, 0.02]}
            color={C.pink}
          />
          <Box
            p={[0.32, -0.12, 0.407]}
            s={[0.14, 0.075, 0.02]}
            color={C.pink}
          />
          {startle > 0.24 ? (
            <Box p={[0, -0.18, 0.413]} s={[0.15, 0.18, 0.03]} color={C.dark} />
          ) : inspect > 0.4 ? (
            <Box p={[0, -0.16, 0.413]} s={[0.16, 0.035, 0.03]} color={C.dark} />
          ) : (
            <Box p={[0, -0.19, 0.413]} s={[0.18, 0.05, 0.03]} color={C.dark} />
          )}
          {/* Hair / safety cap with goggles */}
          <Box p={[0, 0.53, 0]} s={[1.13, 0.22, 0.85]} color={C.navy2} />
          <Box p={[0, 0.63, 0.2]} s={[1.05, 0.15, 0.75]} color={C.navy} />
          <Box p={[-0.25, 0.7, 0.49]} s={[0.38, 0.23, 0.18]} color={C.gold} />
          <Box p={[0.25, 0.7, 0.49]} s={[0.38, 0.23, 0.18]} color={C.gold} />
          <Box
            p={[-0.25, 0.7, 0.595]}
            s={[0.28, 0.13, 0.03]}
            color={C.sky}
            emissive={C.sky}
            emission={0.25}
          />
          <Box
            p={[0.25, 0.7, 0.595]}
            s={[0.28, 0.13, 0.03]}
            color={C.sky}
            emissive={C.sky}
            emission={0.25}
          />
        </group>
      </group>
    </group>
  );
};

const Console: React.FC<{ time: number }> = ({ time }) => {
  // Explicit cause -> contact -> resistance -> lever travel -> system reaction.
  // The handle begins leaning toward Niko, then his satchel pushes it right.
  const activated = ramp(time, 8.87, 9.52);
  const leverAngle = 0.52 - activated * 1.14;
  return (
    <group position={[0.75, 0.13, 1]}>
      <Box p={[0, 0.43, 0]} s={[1.6, 0.85, 0.8]} color={C.navy2} />
      <Box p={[0, 0.89, -0.02]} s={[1.48, 0.23, 0.72]} color={C.lavender} />
      <Box
        p={[-0.34, 0.93, 0.3]}
        s={[0.42, 0.04, 0.1]}
        color={C.sky}
        emissive={C.sky}
        emission={0.7}
      />
      <Box
        p={[0.24, 0.93, 0.3]}
        s={[0.22, 0.045, 0.12]}
        color={activated > 0.5 ? C.red : C.cyan}
        emissive={activated > 0.5 ? C.red : C.cyan}
        emission={0.3}
      />
      <group position={[-0.55, 0.95, 0.2]} rotation={[0, 0, leverAngle]}>
        <Box
          p={[0, 0.31, 0]}
          s={[0.12, 0.7, 0.12]}
          color={C.gold}
          metalness={0.45}
        />
        <Box p={[0, 0.65, 0]} s={[0.31, 0.27, 0.26]} color={C.red} />
      </group>
    </group>
  );
};

const FloatingCube: React.FC<{
  p: [number, number, number];
  time: number;
  delay: number;
  color: string;
  size?: number;
}> = ({ p, time, delay, color, size = 0.35 }) => {
  const amount = ramp(time, 10 + delay, 11.6 + delay);
  return (
    <group
      position={[
        p[0],
        p[1] + amount * (0.55 + 0.25 * Math.sin(time * 2 + delay)),
        p[2],
      ]}
      rotation={[
        amount * time * 0.25,
        amount * time * 0.33,
        amount * time * 0.11,
      ]}
    >
      <Box
        s={[size, size, size]}
        color={color}
        emissive={color}
        emission={amount * 0.18}
      />
      <Box s={[size * 0.66, size * 0.66, size + 0.01]} color={C.cream} />
    </group>
  );
};

const Crystal: React.FC<{ time: number }> = ({ time }) => {
  const glitch = ramp(time, 9.55, 10.8);
  return (
    <group position={[2.23, 1.68, -1.2]} rotation={[0, time * 0.46, 0]}>
      <group position={[0, Math.sin(time * 1.6) * 0.08 + glitch * 0.2, 0]}>
        <Box
          s={[0.83, 0.83, 0.83]}
          rot={[0.25, 0.35, 0.25]}
          color={glitch > 0.6 ? C.red : C.lavender}
          emissive={glitch > 0.6 ? C.red : C.lavender}
          emission={0.6}
        />
        <Box s={[0.5, 0.5, 0.5]} rot={[0.25, 0.35, 0.25]} color={C.cream} />
      </group>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 + time * 0.17;
        return (
          <Spark
            key={i}
            p={[
              Math.cos(a) * 1.04,
              Math.sin(time * 1.6 + i) * 0.11,
              Math.sin(a) * 1.04,
            ]}
            scale={0.24}
            color={glitch > 0.6 ? C.red : C.gold}
          />
        );
      })}
    </group>
  );
};

const Office: React.FC<{ time: number }> = ({ time }) => (
  <group>
    {/* Floor, tiles and base */}
    <Box p={[0, -0.3, 0]} s={[11, 0.5, 9]} color={C.purple} />
    {Array.from({ length: 10 }, (_, i) =>
      Array.from({ length: 8 }, (_, j) => (
        <Tile
          key={`${i}-${j}`}
          x={i * 1.18 - 5.31}
          z={j * 1.18 - 4.13}
          idx={i + j}
        />
      )),
    )}
    {/* Walls */}
    <Box p={[0, 2.4, -4.6]} s={[11, 5.5, 0.35]} color={"#ddd1fc"} />
    <Box p={[-5.55, 2.4, 0]} s={[0.3, 5.5, 9]} color={"#e1d6ff"} />
    <Box p={[5.55, 2.4, 0]} s={[0.3, 5.5, 9]} color={"#e1d6ff"} />
    {/* tall fantasy windows and distant blue sky panels */}
    {[-3.25, 0, 3.25].map((x) => (
      <group key={x}>
        <Box p={[x, 2.75, -4.36]} s={[2.15, 3.1, 0.08]} color={C.gold} />
        <Box
          p={[x, 2.75, -4.29]}
          s={[1.94, 2.87, 0.09]}
          color={"#94dcff"}
          emissive={"#71c9ff"}
          emission={0.25}
        />
        <Box p={[x, 2.75, -4.21]} s={[0.1, 2.9, 0.08]} color={C.cream} />
      </group>
    ))}
    {/* beams and pillars */}
    {[-4.7, 4.7].map((x) => (
      <group key={x}>
        <Box p={[x, 2.5, -3.85]} s={[0.52, 5.1, 0.66]} color={C.cream} />
        <Box p={[x, 4.96, -3.83]} s={[0.89, 0.33, 0.96]} color={C.gold} />
      </group>
    ))}
    <Box p={[0, 5.15, -3.85]} s={[10.6, 0.35, 1.2]} color={C.gold} />
    {/* hanging magical ornaments */}
    {[-3, 0, 3].map((x, i) => (
      <group key={i}>
        <Box p={[x, 4.65, -2.4]} s={[0.08, 0.65, 0.08]} color={C.gold} />
        <Spark p={[x, 4.15, -2.4]} scale={0.36} />
      </group>
    ))}
    {/* control desk / secondary console */}
    <Box p={[3.4, 0.35, -2.65]} s={[1.65, 0.8, 0.85]} color={C.navy2} />
    <Box
      p={[3.4, 0.88, -2.65]}
      s={[1.4, 0.16, 0.62]}
      color={C.sky}
      emissive={C.sky}
      emission={0.15}
    />
    <Box p={[-3.5, 0.4, -2.7]} s={[1.3, 0.8, 0.9]} color={C.navy2} />
    <Box p={[-3.5, 0.93, -2.65]} s={[1.15, 0.15, 0.78]} color={C.lavender} />
    {/* raised crystal dais */}
    <Box p={[2.23, 0.24, -1.2]} s={[1.6, 0.46, 1.6]} color={C.gold} />
    <Box p={[2.23, 0.55, -1.2]} s={[1.35, 0.25, 1.35]} color={C.purple} />
    <Crystal time={time} />
    {/* props floating after error */}
    <FloatingCube
      p={[-3.2, 0.48, 0.65]}
      time={time}
      delay={0.1}
      color={C.gold}
      size={0.45}
    />
    <FloatingCube
      p={[2.9, 0.6, 2.1]}
      time={time}
      delay={0.4}
      color={C.pink}
      size={0.46}
    />
    <FloatingCube
      p={[-1.5, 1.4, -1.7]}
      time={time}
      delay={0.7}
      color={C.cyan}
      size={0.34}
    />
    <FloatingCube
      p={[3.5, 1.1, -2.6]}
      time={time}
      delay={1.0}
      color={C.purple}
      size={0.42}
    />
    <Console time={time} />
    <Niko time={time} />
  </group>
);

const CameraRig: React.FC<{ time: number }> = ({ time }) => {
  const { camera } = useThree();
  // ThreeCanvas owns the camera; update it directly on each deterministic frame render.
  const travel = ramp(time, 0, 3.0);
  const walk = ramp(time, 3.1, 6.4);
  const surprise = ramp(time, 9.7, 10.5);
  const pos = new THREE.Vector3(
    5.15 - travel * 0.65 - walk * 0.24 - surprise * 0.15,
    3.25 - travel * 0.23 + surprise * 0.09,
    8.5 - travel * 1.65 - walk * 0.4 - surprise * 0.55,
  );
  const focus = new THREE.Vector3(-0.05 - walk * 0.5, 1.6, 0);
  camera.position.copy(pos);
  camera.lookAt(focus);
  camera.updateProjectionMatrix();
  return null;
};

export const GravityPilot: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const time = frame / fps;
  return (
    <div
      style={{
        width,
        height,
        background:
          "linear-gradient(180deg,#6bbcff 0%,#cbb9ff 62%,#fff0d9 100%)",
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [5.15, 3.25, 8.5], fov: 41, near: 0.1, far: 100 }}
        shadows
        style={{ width, height }}
      >
        <color attach="background" args={["#a9ddff"]} />
        <ambientLight intensity={1.2} />
        <hemisphereLight args={["#d7efff", "#5b528b", 1.6]} />
        <directionalLight
          position={[0, 9, 7]}
          intensity={2.0}
          color={"#fff2d5"}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight
          position={[2, 4, -1]}
          intensity={9}
          distance={10}
          color={"#9f85ff"}
        />
        <CameraRig time={time} />
        <Office time={time} />
      </ThreeCanvas>
    </div>
  );
};
