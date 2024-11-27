import i18n from 'i18next';

import PopoverSFGF from './PopoverSFGF.vue';

const edgeType = "custom";
const nodeType = "custom";

// nodes definition
export const nodesInit = [
  {
    id: '1',
    position: { x: 0, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_soil_moisture_label'),
      layerID: 'soil_moisture',
      tooltip: i18n.t('node_soil_moisture_tooltip'),
    },
  },
  {
    id: '2',
    position: { x: 5, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_precipitation_label'),
      icon: 'bi-cloud-rain-heavy',
      layerID: 'precipitation',
      tooltip: i18n.t('node_precipitation_tooltip'),
    },
  },
  {
    id: '3',
    position: { x: 200, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_oa_label'),
      layerID: 'OA',
      tooltip: i18n.t('node_oa_tooltip'),
    },
  },
  {
    id: '4',
    position: { x: 200, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_sri_label'),
      layerID: 'SRI',
      tooltip: i18n.t('node_sri_tooltip'),
    },
  },
  {
    id: '5',
    position: { x: 400, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_sfi_label'),
      layerID: 'SFI',
      tooltip: i18n.t('node_sfi_tooltip'),
      popover: PopoverSFGF
    },
  },
]

// edges definition
export const edgesInit = [
  {
    id: 'VF->OA',
    source: '1',
    target: '3',
    type: edgeType,
  },
  {
    id: 'N->OA',
    source: '2',
    target: '3',
    type: edgeType,
  },
  {
    id: 'N->SRI',
    source: '2',
    target: '4',
    type: edgeType,
  },
  {
    id: 'OA->SFI',
    source: '3',
    target: '5',
    type: edgeType,
  }
]