import React, { useMemo } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { ClayMaterial } from "./ClayMaterial";

type Props = {
  color: string;
  size?: [number, number, number];
  radius?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

// Balok bersudut bulat dengan material clay. Dipakai sebagai tes Milestone 1.
export const ClayTestBlock: React.FC<Props> = ({
  color,
  size = [1, 1, 1],
  radius = 0.18,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const geometry = useMemo(
    () => new RoundedBoxGeometry(size[0], size[1], size[2], 5, radius),
    [size[0], size[1], size[2], radius],
  );

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} castShadow receiveShadow>
      <ClayMaterial color={color} />
    </mesh>
  );
};
