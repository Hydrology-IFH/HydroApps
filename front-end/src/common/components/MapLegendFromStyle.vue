<script setup>
  import { computed } from 'vue';

  import { getReasonableDigits } from '~~/utils/reasonableDigits';
  import MapLegend from './MapLegend.vue';

  // define variables
  const props = defineProps({
    layer_name: String,
    style: Object,
    map: Object,
    ignoreLabels: { type: Array, default: [] }, // ["label1", "label2"]
    valueConverter: { type: Function, default: (x) => x},
    tooltips: { type: Array, default: [] }, // [{label: "label", message: "message"}]
    unit: { type: String, default: "" },
  })

  // get title
  const title = computed(() => {
    if (props.unit !== "") {
      return `${props.layer_name} in ${props.unit}`
    } else {
      return props.layer_name
    }
  })

  // utilities
  const zip = (a, b) => a.map((k, i) => [k, b[i]]);

  // get styling from style definition
  const getElementsFromStyle = (style) => {
    let elements = [];
    if (style[0] == "interpolate") {
      // continues elements
      // -------------------
      // calculate amount of labels
      let labels = style.slice(3).filter((el) => !(el instanceof Array));
      let n_labels = labels.length;
      let tick_min = labels[0];
      let tick_max = labels.at(-1);
      let n_max = 8;
      if (n_labels > n_max) {
        // select only some of the labels
        let factor;
        let start_i = (n_labels - (n_labels % n_max) + n_max) / n_max;
        for (let i = start_i; i <= n_labels + 1; i++) {
          if ((n_labels + 1) % i == 0) {
            factor = i;
            break;
          }
        }
        labels = labels.filter((el) => ((labels.indexOf(el) + 2) % factor == 0) | (labels.indexOf(el) == 0));
        n_labels = labels.length;
      }
      if ((n_labels == 2) & ((tick_max - tick_min) % 2 == 0)) {
        n_labels = 3;
        labels = [tick_min, tick_min + (tick_max - tick_min) / 2, tick_max];
      }

      // round labels
      let digits = getReasonableDigits(tick_min, tick_max);
      let rdigits = Math.pow(10, digits);
      labels = labels.map((el) => Math.round(el * rdigits) / rdigits)
        .map(props.valueConverter).map(String);

      // get colors
      let colors = style.slice(3).filter((el) => (el instanceof Array))
        .map((el) => {
          if (el.length == 3) { el.push(1) }
          return `rgb(${el.join(",")})`;
        });

      // check against ignoreLabels
      labels = labels.map((label) => props.ignoreLabels.includes(label)? "": label)

      // get tooltips
      if (props.tooltips.length > 0) {
        labels = labels.map((tick) => {
          let ttps = props.tooltips.filter((ttp) => ttp.label == tick)
          if (ttps.length > 0) {
            return { label: tick, tooltip: ttps[0].message }
          } else {
            return { label: tick }
          }
        })
      }

      elements.push({ type: "con", labels: labels, colors: colors })

    } else if (style[0] == "case") {
      // distinct values
      // ----------------
      let conditions = style.slice(1, -1).filter((el, i) => i % 2 == 0)
      let outputs = style.slice(1).filter((el, i) => i % 2 == 1)
      for (let [cond, out] of zip(conditions, outputs)) {
        if ((out[0] == "case") || (out[0] == "interpolate")) {
          getElementsFromStyle(out).forEach((el) => elements.push(el))
        } else {
          let element = { type: "dis" }

          // get label
          let label = String(props.valueConverter(cond[2]));
          switch (cond[0]) {
            case "==":
              break
            case "between":
              label = `>= ${label}`;
              break
            default:
              label = `${cond[0]} ${label}`
          }
          element.label = label

          // get color
          if (out.length == 3) {
            out.push(1);
          }
          element.color = `rgb(${out.join(",")})`

          // get tooltip
          if (props.tooltips.length > 0) {
            let ttps = props.tooltips.filter((ttp) => ttp.label == element.label)
            if (ttps.length > 0) {
              element.tooltip = ttps[0].message
            }
          }

          // add to elements
          elements.push(element)
        }
      }

      // check against ignoreLabels
      elements = elements.filter((el) => !props.ignoreLabels.includes(el.label))

      // check fallback value
      let fallback = style.slice(-1)[0]
      if ((fallback[0] == "case") || (fallback[0] == "interpolate")) {
        getElementsFromStyle(fallback).forEach((el) => elements.push(el))
      }

    } else {
      Error("Style not supported")
    }
    return elements
  }

  const elements = computed(() => {
    return getElementsFromStyle(props.style.color[2]);
  })
</script>

<template>
  <MapLegend :title="title" :elements="elements" :map="map" />
</template>