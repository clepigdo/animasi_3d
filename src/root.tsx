import React from 'react';
import {Composition} from 'remotion';
import {GravityPilot} from './scene';

export const Root: React.FC = () => (
  <Composition
    id="NikoGravityTest"
    component={GravityPilot}
    durationInFrames={900}
    fps={60}
    width={1080}
    height={1920}
  />
);
