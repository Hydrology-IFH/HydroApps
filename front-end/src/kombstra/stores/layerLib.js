import { useLayerLib as useLayerLibBase } from '~~/stores/layerLib/layerLib.js';
import { useConfig } from './config.js';
import { LAYERS } from './LAYERS.js';

export const useLayerLib = () => {
  const layerLib = useLayerLibBase();
  if (!layerLib.config) {
    const config = useConfig();
    layerLib.initConfig(config);
  }
  if (layerLib.layers.length == 0) layerLib.initLayers(LAYERS);
  return layerLib
};