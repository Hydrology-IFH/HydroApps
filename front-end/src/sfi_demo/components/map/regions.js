import { getCenter } from 'ol/extent';

export const regions = {
  Bonndorf: {
    extent: [441751.5, 5290493.5, 456176.5, 5300293.5]
  },
  Wieslauf: {
    extent: [536461.5, 5406353.5, 545811.5, 5420453.5]
  },
  Emmendingen: {
    extent: [412221.5, 5324628.5, 420646.5, 5335653.5]
  },
}

// Add center to regions
for (let key in regions){
  regions[key].center = getCenter(regions[key].extent);
}