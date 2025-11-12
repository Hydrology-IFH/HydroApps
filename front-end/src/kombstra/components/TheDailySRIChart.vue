<script setup>
  import { computed, onMounted, ref, inject, watch } from 'vue';
  import Plotly from 'plotly.js-dist-min'

  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
  const plotRef = ref(null);
  //  get values from daily SRI Menu
  const allDatesMaxSRI = inject('daily_sri-allDatesMaxSRI', ref([]));
  const filteredDates = inject('daily_sri-filteredDates', ref([]));

  const dates = computed(() => {
    return allDatesMaxSRI.value.map(d => d.date);
  });
  const trace60 = computed(() => {
    const sri60 = allDatesMaxSRI.value.map(d => d.sri_60);
    return {
      x: dates.value,
      y: sri60,
      mode: 'lines+markers',
      name: 'SRI 60 min',
      type: 'bar',
    };
  });
  const trace240 = computed(() => {
    const sri240 = allDatesMaxSRI.value.map(d => d.sri_240);
    return {
      x: dates.value,
      y: sri240,
      mode: 'lines+markers',
      name: 'SRI 240 min',
      type: 'bar'
    };
  });
  const layout = computed(() => {
    return {
      title: 'Daily Maximum SRI',
      xaxis: { title: 'Date' },
      yaxis: { title: 'SRI' }
    };
  });
  const plot = ref(null);
  window.trace240 = trace240;
  window.trace60 = trace60;
  window.layout = layout;
  window.dates = dates;
  window.allDatesMaxSRI = allDatesMaxSRI;


  onMounted(() => {
    plot.value = Plotly.newPlot(plotRef.value, [trace60.value, trace240.value], layout.value);
  });

  watch(() => layout.value, (newLayout) => {
    plot.value?.relayout(plotRef.value, newLayout);
  });
  watch(() => [trace60.value, trace240.value], (newTraces) => {
    plot.value?.update(plotRef.value, newTraces, layout.value);
  });

  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      console.log('Hot Module Replacement: TheDailySRIChart.vue updated');
      plot.value = Plotly.newPlot(plotRef.value, [trace60.value, trace240.value], layout.value);
    });
  }
</script>

<template>
  <div
    id="daily-sri-plot"
    ref="plotRef"
  />
</template>




