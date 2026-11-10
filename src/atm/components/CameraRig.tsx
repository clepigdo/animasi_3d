import { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FPS } from "../config/timing";
import { monotoneCubic } from "../utils/easing";

export type CameraKey = {
  t: number; // detik
  pos: [number, number, number];
  target: [number, number, number];
};

type Props = { frame: number; keys: CameraKey[] };

// Kamera berbasis keyframe. Jalur posisi dan target = spline Catmull-Rom, kecepatan = kubik monoton
// (mulus, tidak mundur, berhenti pelan di ujung). Murni fungsi frame → deterministik.
export const CameraRig: React.FC<Props> = ({ frame, keys }) => {
  const camera = useThree((s) => s.camera);

  const rig = useMemo(() => {
    const posCurve = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k.pos)), false, "centripetal");
    const tgtCurve = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k.target)), false, "centripetal");
    const toU = monotoneCubic(
      keys.map((k) => k.t),
      keys.map((_, i) => i / (keys.length - 1)),
    );
    return { posCurve, tgtCurve, toU };
  }, [keys]);

  useLayoutEffect(() => {
    const u = Math.min(1, Math.max(0, rig.toU(frame / FPS)));
    const p = rig.posCurve.getPoint(u);
    const t = rig.tgtCurve.getPoint(u);
    camera.position.copy(p);
    camera.lookAt(t);
    camera.updateMatrixWorld();
  }, [camera, rig, frame]);

  return null;
};
