
import { useState } from 'react';

export const useLayerBlending = () => {
  const [primaryLayer, setPrimaryLayer] = useState('temperature');
  const [secondaryLayer, setSecondaryLayer] = useState('precipitation');
  const [blendMode, setBlendMode] = useState('normal');
  const [opacity, setOpacity] = useState(0.7);

  return {
    primaryLayer,
    setPrimaryLayer,
    secondaryLayer,
    setSecondaryLayer,
    blendMode,
    setBlendMode,
    opacity,
    setOpacity
  };
};
