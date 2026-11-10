import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { ClayMaterialOptions, getClayMaterial } from "./ClayMaterial";
import { mulberry32 } from "../utils/seeded";

type V3 = [number, number, number];

type Common = ClayMaterialOptions & {
  color: string;
  position?: V3;
  rotation?: V3;
  scale?: V3 | number;
  // Ketidaksempurnaan "buatan tangan": skala non-uniform tipis, tetap per objek (bukan per frame).
  seed?: number;
  wobble?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

const geoCache = new Map<string, THREE.BufferGeometry>();
const cached = <T extends THREE.BufferGeometry>(key: string, make: () => T): T => {
  let g = geoCache.get(key);
  if (!g) {
    g = make();
    geoCache.set(key, g);
  }
  return g as T;
};

const useWobble = (seed: number | undefined, wobble: number, scale: V3 | number | undefined): V3 =>
  useMemo(() => {
    const base: V3 = Array.isArray(scale)
      ? (scale as V3)
      : [scale ?? 1, scale ?? 1, scale ?? 1];
    if (seed === undefined) return base;
    const r = mulberry32(seed);
    return [
      base[0] * (1 + (r() - 0.5) * 2 * wobble),
      base[1] * (1 + (r() - 0.5) * 2 * wobble),
      base[2] * (1 + (r() - 0.5) * 2 * wobble),
    ];
  }, [seed, wobble, scale]);

const materialOf = (p: Common) =>
  getClayMaterial(p.color, {
    bump: p.bump,
    roughness: p.roughness,
    emissive: p.emissive,
    emissiveIntensity: p.emissiveIntensity,
  });

type MeshProps = Common & { geometry: THREE.BufferGeometry };
const ClayMesh: React.FC<MeshProps> = ({ geometry, ...p }) => {
  const s = useWobble(p.seed, p.wobble ?? 0.02, p.scale);
  return (
    <mesh
      geometry={geometry}
      material={materialOf(p)}
      position={p.position}
      rotation={p.rotation}
      scale={s}
      castShadow={p.castShadow ?? true}
      receiveShadow={p.receiveShadow ?? true}
    />
  );
};

export const ClayBox: React.FC<Common & { size: V3; radius?: number }> = ({
  size,
  radius = 0.06,
  ...rest
}) => {
  const r = Math.min(radius, Math.min(size[0], size[1], size[2]) / 2 - 0.001);
  const geo = cached(
    `box|${size.join(",")}|${r}`,
    () => new RoundedBoxGeometry(size[0], size[1], size[2], 4, r),
  );
  return <ClayMesh geometry={geo} {...rest} />;
};

export const ClaySphere: React.FC<Common & { radius: number }> = ({ radius, ...rest }) => {
  const geo = cached(`sph|${radius}`, () => new THREE.SphereGeometry(radius, 28, 18));
  return <ClayMesh geometry={geo} {...rest} />;
};

export const ClayCapsule: React.FC<Common & { radius: number; length: number }> = ({
  radius,
  length,
  ...rest
}) => {
  const geo = cached(`cap|${radius}|${length}`, () => new THREE.CapsuleGeometry(radius, length, 6, 16));
  return <ClayMesh geometry={geo} {...rest} />;
};

export const ClayCylinder: React.FC<Common & { radius: number; length: number }> = ({
  radius,
  length,
  ...rest
}) => {
  const geo = cached(
    `cyl|${radius}|${length}`,
    () => new THREE.CylinderGeometry(radius, radius, length, 24),
  );
  return <ClayMesh geometry={geo} {...rest} />;
};
