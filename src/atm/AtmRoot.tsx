import React from "react";
import { Composition } from "remotion";
import { ATMEpisode01 } from "./compositions/ATMEpisode01";
import { ATMPrototype15s } from "./compositions/ATMPrototype15s";
import { FPS, HEIGHT, PROTO, TOTAL_FRAMES, WIDTH } from "./config/timing";

export const AtmRoot: React.FC = () => (
  <>
    <Composition
      id="ATMPrototype15s"
      component={ATMPrototype15s}
      durationInFrames={PROTO.total}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ debugHud: true, withAudio: true }}
    />
    <Composition
      id="ATMEpisode01"
      component={ATMEpisode01}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ debugHud: true }}
    />
  </>
);
