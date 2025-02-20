<script setup>
  import { onMounted, ref, inject} from 'vue';
  import html2canvas from 'html2canvas';

  const props = defineProps({
    fileName: {
      type: String,
      default: 'HydroApps_Screenshot.png'
    }
  })

  // define variable to trigger spinner of wrapper
  const { updateSpinnerActive } = inject('screenshot-spinner-active');

  // get highlight from screenshot/Wrapper
  const { updateHighlight } = inject('screenshot-highlight');

  // checkout if zoom of fullscreen is active
  const { zoomActive } = inject('fullscreen-zoomActive') || ref(false);

  // Button tooltip
  const buttonRef = ref(null);
  onMounted(() => {
    new window.bootstrap.Tooltip(buttonRef.value);
  });

  // Save screenshot
  const saveScreenshot = async () => {
    updateSpinnerActive(true);
    let screenshotContainer = document.getElementById('screenshot-container');
    html2canvas(screenshotContainer, {
      onclone: (clonedDOM) => {
        // this plugin has problems with shadows, therefor remove all shadows
        clonedDOM.getElementById('screenshot-container').classList.remove('highlight');

        // remove all shadows from legend
        let leg = clonedDOM.querySelector('div.legend-overlay');
        leg.style.boxShadow = "none";
        leg.style.border = "1px solid grey";

        // there is a problem while rendering the closing svg
        clonedDOM.querySelectorAll('button.btn-close').forEach((b) => b.remove());

        // remove layer switcher
        clonedDOM.querySelectorAll('div.ol-layerswitcher-image').forEach((b) => b.remove());
      },
      // backgroundColor: "#ffffff",
    }).then(canvas => {
      updateSpinnerActive(false);
      var link = document.createElement('a');
      link.download = props.fileName;
      link.href = canvas.toDataURL();
      link.click();
    }).exception((error) => {
      console.error('Screenshot failed:', error);
      updateSpinnerActive(false);
    });
  };
</script>

<template>
  <a class="screenshot-button" @click="saveScreenshot()"
    @mouseover="updateHighlight(true&&!zoomActive)" @mouseleave="updateHighlight(false)"
    data-html2canvas-ignore>
    <i  class="bi bi-camera"
        :data-bs-title='$t("common:tooltip_screenshot")' data-bs-placement="auto"
        data-bs-toggle="tooltip"
        ref="buttonRef" />
  </a>
</template>

<style scoped>
  /* Zoom Button */
  a.screenshot-button{
    font-size: x-large;
    cursor: pointer;
    color: black;
  }
  a.screenshot-button:hover{
    opacity: 1;
    color: var(--bs-primary);
  }
  .tooltip{
    z-index: 2000;
  }
</style>