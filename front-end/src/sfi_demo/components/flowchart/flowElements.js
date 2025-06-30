import i18n from 'i18next';
import { markRaw } from 'vue';

import PopoverSFGF from './PopoverSFGF.vue';
import PopoverDamagePerHoushold from './PopoverDamagePerHoushold.vue';
import { conditionAI, conditionDamage } from '~/stores/Layer/LAYERS.js';

const edgeType = "custom";
const nodeType = "custom";

const langCode = location.pathname.split("/")[1];

const conditionSVEmpty = ({ config }) => {
  return conditionDamage({ config }) && !conditionAI({ config })
}

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
      popover: markRaw(PopoverSFGF)
    },
  },
  {
    id: 'ai_depth',
    position: { x: 45, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_depth_label'),
      layerID: 'ai_depth',
      tooltip: i18n.t('node_ai_depth_tooltip')
    },
    condition: conditionAI,
    parentNode: 'ai_wrapper'
  },
  {
    id: 'ai_speed',
    position: langCode == "de"? { x: 210, y: 0 } : { x: 190, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_speed_label'),
      layerID: 'ai_speed',
      tooltip: i18n.t('node_ai_speed_tooltip')
    },
    condition: conditionAI,
    parentNode: 'ai_wrapper',
    expandParent: true
  },
  {
    id: 'ai_wrapper',
    position: langCode == "de"? { x: 300, y: 0 } : { x: 310, y: 0 },
    type: "wrapper",
    data: {
      icon: 'bi-stars',
      label: i18n.t('node_ai_wrapper_label'),
      tooltip: i18n.t('node_ai_wrapper_tooltip'),
    },
    condition: conditionAI,
  },
  // speed and depth nodes if no AI available
  {
    id: 'empty_depth',
    position: { x: 55, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_depth_label'),
      tooltip: i18n.t('node_empty_depth_tooltip')
    },
    condition: conditionSVEmpty,
    parentNode: 'sv_wrapper'
  },
  {
    id: 'empty_speed',
    position: langCode == "de"? { x: 220, y: 0 } : { x: 200, y: 0 },
    type: nodeType,
    data: {
      label: i18n.t('node_speed_label'),
      tooltip: i18n.t('node_empty_speed_tooltip')
    },
    condition: conditionSVEmpty,
    parentNode: 'sv_wrapper',
    expandParent: true
  },
  {
    id: 'sv_wrapper',
    position: langCode == "de"? { x: 290, y: 0 } : { x: 300, y: 0 },
    type: "wrapper",
    data: {
      label: i18n.t('node_sv_wrapper_label'),
      tooltip: i18n.t('node_sv_wrapper_tooltip'),
    },
    condition: conditionSVEmpty,
  },
  {
    id: 'damage',
    position: langCode == "de"? { x: 510, y: 50 } : { x: 495, y: 50 },
    type: nodeType,
    data: {
      label: i18n.t('node_damage_label'),
      layerID: 'damage',
      tooltip: i18n.t('node_damage_tooltip'),
      popover: markRaw(PopoverDamagePerHoushold)
    },
    condition: conditionDamage,
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
    target: 'ai_wrapper',
    type: edgeType,
  },
  {
    id: 'AI->damage',
    source: 'ai_wrapper',
    sourceHandle: 'source-bottom',
    target: 'damage',
    type: edgeType,
  },
  {
    id: 'OA->empty',
    source: 'OA',
    sourceHandle: 'source-top',
    target: 'sv_wrapper',
    type: edgeType
  },
  {
    id: 'empty->damage',
    source: 'sv_wrapper',
    sourceHandle: 'source-bottom',
    target: 'damage',
    type: edgeType
  }
]