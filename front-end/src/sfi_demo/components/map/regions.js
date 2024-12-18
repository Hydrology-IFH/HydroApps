import { getCenter } from 'ol/extent';

export const regions = {
  Bonndorf: {
    extent: [441576.5, 5290318.5, 456351.5, 5300468.5],
  },
  Wieslauf: {
    extent: [536286.5, 5406178.5, 545986.5, 5420628.5]
  }
}

// Add center to regions
for (let key in regions){
  regions[key].center = getCenter(regions[key].extent);
}