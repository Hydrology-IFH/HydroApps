import i18n from 'i18next';

import PopoverSFGF from './PopoverSFGF.vue';
import PopoverDamagePerHoushold from './PopoverDamagePerHoushold.vue';

const edgeType = "custom";
const nodeType = "custom";

const langCode = location.pathname.split("/")[1];

// nodes definition
export const nodesInit = [
  {
    id: 'VF',
    position: { x: 0, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_soil_moisture_label'),
      layerID: 'soil_moisture',
      tooltip: i18n.t('node_soil_moisture_tooltip')
    },
  },
  {
    id: 'N',
    position: { x: 0, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_precipitation_label'),
      icon: 'bi-cloud-rain-heavy',
      layerID: 'precipitation',
      tooltipConfig: ({ config }) => config.kind == "matrix" ? i18n.t('node_precipitation_tooltip_matrix') : i18n.t('node_precipitation_tooltip_event'),
    },
  },
  {
    id: 'OA',
    position: { x: 200, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_oa_label'),
      layerID: 'OA',
      tooltip: i18n.t('node_oa_tooltip'),
      additionalHandles: [
        { id: 'source-top', type:"source", position: "top" },
      ]
    },
  },
  {
    id: 'SRI',
    position: langCode=="de"? { x: 200, y: 0 } : { x: 180, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_sri_label'),
      layerID: 'SRI',
      tooltip: i18n.t('node_sri_tooltip'),
    },
  },
  {
    id: 'SFI',
    position: langCode == "de"? { x: 400, y: 50 } : { x: 370, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_sfi_label'),
      layerID: 'SFI',
      tooltip: i18n.t('node_sfi_tooltip'),
      popover: PopoverSFGF
    },
  },
  {
    id: 'ai_depth',
    position: { x: 45, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_ai_depth_label'),
      layerID: 'ai_depth',
      tooltip: i18n.t('node_ai_depth_tooltip')
    },
    condition: ({ config }) => config.region == "Emmendingen" && config.kind == "matrix",
    parentNode: 'ai'
  },
  {
    id: 'ai_speed',
    position: langCode == "de"? { x: 210, y: 0 } : { x: 190, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_ai_speed_label'),
      layerID: 'ai_speed',
      tooltip: i18n.t('node_ai_speed_tooltip')
    },
    condition: ({ config }) => config.region == "Emmendingen" && config.kind == "matrix",
    parentNode: 'ai',
    expandParent: true
  },
  {
    id: 'ai',
    position: langCode == "de"? { x: 300, y: 0 } : { x: 310, y: 0 },
    type: "wrapper",
    data: {
      layerID: 'ai',
      icon: 'bi-stars',
      label: i18n.t('node_ai_label'),
      tooltip: i18n.t('node_ai_tooltip'),
    },
    condition: ({ config }) => config.region == "Emmendingen" && config.kind == "matrix",
  },
  {
    id: 'damage',
    position: langCode == "de"? { x: 510, y: 50 } : { x: 495, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_damage_label'),
      layerID: 'damage',
      tooltip: i18n.t('node_damage_tooltip'),
      popover: PopoverDamagePerHoushold
    },
    condition: ({ config }) => config.region == "Emmendingen" && config.kind == "matrix",
  }
]

// edges definition
export const edgesInit = [
  {
    id: 'VF->OA',
    source: 'VF',
    target: 'OA',
    type: edgeType,
  },
  {
    id: 'N->OA',
    source: 'N',
    target: 'OA',
    type: edgeType,
  },
  {
    id: 'N->SRI',
    source: 'N',
    target: 'SRI',
    type: edgeType,
  },
  {
    id: 'OA->SFI',
    source: 'OA',
    target: 'SFI',
    type: edgeType,
  },
  {
    id: 'OA->AI',
    source: 'OA',
    sourceHandle: 'source-top',
    target: 'ai',
    type: edgeType,
  },
  {
    id: 'AI->damage',
    source: 'ai',
    sourceHandle: 'source-bottom',
    target: 'damage',
    type: edgeType,
  },
]