<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import Plotly from 'plotly.js-dist-min'
  import { useTranslation } from 'i18next-vue';

  import { useConfig } from '~/stores/config.js';

  const { i18next } = useTranslation();
  const config = useConfig();
  const plotRef = ref(null);

  // prepare data
  const dates = computed(() => {
    return config.daily_all_dates_max_SRI.map(d => d.date);
  });
  const filteredDateIndexes = computed(() => {
    return dates.value.map((d, i) => {
      if (config.daily_filtered_dates.find(fd => fd.getTime() === d.getTime())) {
        return i;
      } else {
        return null;
      }
    }).filter(i => i !== null);
  });

  // define Plotly traces
  const traceNotAnalysedBackground = computed(() => {
    let x = [];
    let y = [];
    for (let year = config.spans.min_year; year <= config.spans.max_year; year++) {
      const startDate = new Date(year, 10, 1);
      const endDate = new Date(year+1, 4, 31);
      x.push(startDate, startDate, endDate, endDate);
      y.push(0, 12, 12, 0);
    }
    return {
      x: x,
      y: y,
      mode: 'none',
      name: i18next.t('daily_sri_chart_trace_not_analysed_label'),
      fill: 'tonexty',
      fillcolor: 'lightgrey',
      type: 'scatter',
      hoverinfo: 'skip',
      showlegend: true,
      legendgroup: 'additional',
      legendrank: 21,
    };
  });

  const baseBarTrace = computed(() => ({
    x: dates.value,
    mode: 'lines+markers',
    type: 'bar',
    legendgroup: 'SRI',
    hovertemplate: '%{x|%Y-%m-%d}<br>SRI: %{y}<br>%{meta.duration}<extra></extra>',
    selectedpoints: filteredDateIndexes.value,
  }));
  const trace60 = computed(() => {
    const sri60 = config.daily_all_dates_max_SRI.map(d => d.sri_60);
    return {
      y: sri60,
      name: i18next.t('daily_sri_chart_trace_short_label'),
      legendrank: 10,
      marker: { color: '#1F77B4' },
      meta: { duration: i18next.t('daily_sri_chart_trace_short_label') },
      ...baseBarTrace.value,
    };
  });
  const trace240 = computed(() => {
    const sri240 = config.daily_all_dates_max_SRI.map(d => d.sri_240);
    return {
      y: sri240,
      name: i18next.t('daily_sri_chart_trace_long_label'),
      legendrank: 11,
      marker: { color: '#FF7F0E' },
      meta: { duration: i18next.t('daily_sri_chart_trace_long_label') },
      // selectedpoints: config.daily_duration === 'long' ? filteredDateIndexes.value : [],
      ...baseBarTrace.value
    };
  });
  const traceMinDateLine = computed(() => {
    return {
      x: [new Date(config.spans.min_year, 5, 1), new Date(config.spans.max_year, 9, 31)],
      y: [config.daily_min_sri, config.daily_min_sri],
      mode: 'lines',
      name: i18next.t('daily_sri_chart_trace_min_date_label'),
      line: {
        color: 'black',
        width: 2,
        dash: 'dash'
      },
      type: 'scatter',
      legendgroup: 'additional',
      legendrank: 20,
    };
  });
  const traces = computed(() => {
    return [traceNotAnalysedBackground.value, trace60.value, trace240.value, traceMinDateLine.value];
  });

  // define Poltly layout
  function resizeLayout(layout) {
    // adjust legend position based on width
    if (window.innerWidth < 600) {
      layout.legend.orientation = "h";
      layout.legend.xanchor = "center";
      layout.legend.yanchor = "bottom";
      layout.legend.yref = "container";
      layout.legend.y = 0;
      layout.height = 340;
      layout.margin.b = 110;
    } else {
      layout.legend.orientation = "v";
      layout.legend.xanchor = "left";
      layout.legend.x = 1;
      layout.legend.yanchor = "top";
      layout.legend.yref = "paper";
      layout.legend.y = 1;
      layout.height = 250;
      layout.margin.b = 70;
    }
    // adjust number of x-axis ticks based on width
    if (window.innerWidth < 400) {
      layout.xaxis.nticks = 5;
    } else if (window.innerWidth < 800) {
      layout.xaxis.nticks = 10;
    } else if (window.innerWidth < 1000) {
      layout.xaxis.nticks = 16;
    } else if (window.innerWidth < 1200) {
        layout.xaxis.nticks = 18;
    } else {
        layout.xaxis.nticks = 20;
    }
    return layout;
  }
  const layout = computed(() => {
    let minDate = new Date(config.spans.min_year, 5, 1);
    let maxDate = new Date(config.spans.max_year, 9, 31);
    let newLayout = {
      title: {
        text: i18next.t('daily_sri_chart_title'),
        font: { size: '1em' },
      },
      xaxis: {
        type: "date",
        tickangle: -45,
        tickformat: "%Y-%m-%d",
        range: [minDate, maxDate],
        minallowed: minDate,
        maxallowed: maxDate,
      },
      yaxis: {
        title: {
          text: i18next.t('daily_sri_chart_yaxis_label'),
          font: {
            size: '1em',
          },
        },
        rangemode: 'tozero',
        fixedrange: true,
      },
      modebar: {
        remove: ['lasso2d', 'select2d', 'resetScale2d']
      },
      legend: {
        groupclick: 'toggleitem',
        traceorder: "grouped",
      },
      clickmode: "event",
      hovermode: 'closest',
      height: 250,
      margin: {
        t: 27,
        r: 20,
        b: 70,
        l: 50,
        pad: 0
      },
      font: {
        family: getComputedStyle(document.body).getPropertyValue("--bs-body-font-family"),
      },
    };
    newLayout = resizeLayout(newLayout);
    return newLayout;
  });

  // selection listener
  const onPlotlySelected = (eventData) => {
    if (eventData) {
      const selectedPoints = eventData.points;
      if (selectedPoints.length > 0) {
        const point = selectedPoints[0];
        config.daily_date = new Date(point.x);
        config.daily_duration = point.data.legendrank === 10 ? 'short' : 'long';
      }
    }
  };

  // create plot on mount
  onMounted(() => {
    Plotly.newPlot(
      plotRef.value,
      traces.value,
      layout.value,
      {responsive: true}
    );
    plotRef.value.on('plotly_click', onPlotlySelected);

    let dragLayer = document.getElementsByClassName('nsewdrag')[0]
    plotRef.value.on('plotly_hover', function(data){
      dragLayer.style.cursor = 'pointer'
    });

    plotRef.value.on('plotly_unhover', function(data){
      dragLayer.style.cursor = ''
    });

    window.addEventListener('resize', () => {
      layout.value = resizeLayout(layout.value);
    });
  });

  // watch for layout updates
  watch(() => layout.value, (newLayout) => {
    Plotly.relayout(plotRef.value, newLayout);
  });

  // watch for trace updates
  function updateTrace(index, newTrace, oldTrace) {
    let update = {};
    Object.keys(newTrace).forEach(key => {
      if (JSON.stringify(newTrace[key]) !== JSON.stringify(oldTrace[key])) {
        if (key === 'x' || key === 'y' || key === 'selectedpoints') {
          update[key] = [newTrace[key]];
        } else {
          update[key] = newTrace[key];
        }
      }
    });
    Plotly.restyle(plotRef.value, update, [index]);
  }
  watch(
    () => traceNotAnalysedBackground.value,
    (newTrace, oldTrace) => updateTrace(0, newTrace, oldTrace));
  watch(
    () => trace60.value,
    (newTrace, oldTrace) => updateTrace(1, newTrace, oldTrace));
  watch(
    () => trace240.value,
    (newTrace, oldTrace) => updateTrace(2, newTrace, oldTrace));
  watch(
    () => traceMinDateLine.value,
    (newTrace, oldTrace) => updateTrace(3, newTrace, oldTrace));


  // Hot Module Replacement
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      console.log('Hot Module Replacement: TheDailySRIChart.vue updated');
      Plotly.update(plotRef.value, traces.value, layout.value);
    });
  }
</script>

<template>
  <div
    id="daily-sri-plot"
    ref="plotRef"
  />
</template>

<style scoped>
  #daily-sri-plot {
    margin-top: 0.5em;
  }
</style>




