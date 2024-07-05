import i18n from 'i18next';

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
      label: i18n.t('node_sfgf_label'),
      layerID: 'SFGF',
      tooltip: i18n.t('node_sfgf_tooltip'),
    },
  },
  {
    id: '6',
    position: { x: 500, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_sfi_label'),
      layerID: 'SFI',
      tooltip: i18n.t('node_sfi_tooltip'),
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
    id: 'OA->SFGF',
    source: '3',
    target: '5',
    type: edgeType,
  },
  {
    id: 'SFGF->SFI',
    source: '5',
    target: '6',
    type: edgeType,
  }
]