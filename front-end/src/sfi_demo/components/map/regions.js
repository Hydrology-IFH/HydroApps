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
  Karlsbad: {
    extent: [461176.5, 5412418.5, 467616.5, 5422818.5]
  },
  Herrstein: {
    extent: [368450.5, 5510250.5, 383500.5, 5523450.5]
  },
  Stadtallendorf: {
    extent: [486170, 5620570, 505570, 5640050]
  },
  Ottingen: {
    extent: [625780, 5411685, 641850, 5430380]
  },
}

// Add center to regions
for (let key in regions){
  regions[key].center = getCenter(regions[key].extent);
}