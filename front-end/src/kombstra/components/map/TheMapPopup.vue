<script setup>
  import { ref, onMounted, inject } from 'vue';
  import { OlOverlay } from "vue3-openlayers/map";
  import { OlVectorLayer } from "vue3-openlayers/layers";
  import { OlSourceVector } from "vue3-openlayers/sources";
  import { OlStyle, OlStyleStroke } from "vue3-openlayers/styles";
  import { GeoJSON } from 'ol/format.js';
  import { getCenter, containsCoordinate } from 'ol/extent.js';
  import { useTranslation } from 'i18next-vue';

  import { useLayerLib } from '~/stores/layerLib.js';
  import TheMapPopupContent from './TheMapPopupContent.vue';

  const active = defineModel("active", {
    type: Boolean,
    default: true,
  });

  const layerLib = useLayerLib();
  const { i18next } = useTranslation();
  const map = inject("map");

  const closerRef = ref(null);
  const cellSourceRef = ref(null);
  const overlayPosition = ref(undefined);
  const popupPosClass = ref('popup-bottom');
  const cellData = ref([]);
  const errorMsg = ref(null);

  // functions to set popup position
  function updatePopupPosition() {
    let ext = cellSourceRef.value.source.getExtent();
    let center = getCenter(ext);
    let pixel = map.getPixelFromCoordinate(center);
    let screenTopPos = pixel[1] + map.getTargetElement().getBoundingClientRect().y;

    // determine popup position top/left/right/bottom
    if (screenTopPos <= (window.screen.availHeight * 0.4)) {
      popupPosClass.value = 'popup-bottom';
      overlayPosition.value = [center[0], ext[1]];
    } else if (screenTopPos <= (window.screen.availHeight * 0.6)) {
      if ((pixel[0] > map.getTargetElement().getBoundingClientRect().width * 0.6) &&
          (pixel[0] + map.getTargetElement().getBoundingClientRect().x > 450)) {
        popupPosClass.value = 'popup-left';
        overlayPosition.value = [ext[0], center[1]];
      } else {
        popupPosClass.value = 'popup-right';
        overlayPosition.value = [ext[2], center[1]];
      }
    } else {
      popupPosClass.value = 'popup-top';
      overlayPosition.value = [center[0], ext[3]];
    }
  };

  // get kombstra data from api
  function fetchPolygon(long, lat) {
    fetch(`/en/kombstra/api/kombstra_polygon/?long=${long}&lat=${lat}`)
      .then((res) => res.json())
      .then((data) => {
        cellData.value = data[0];
        cellSourceRef.value.source.addFeatures(
          new GeoJSON().readFeatures(data[0].geometry));
        updatePopupPosition();
      })
      .catch((err) => {
        console.log(err);
        errorMsg.value = i18next.t('popup_error_msg_position');
        overlayPosition.value = [long, lat];
      });
  }

  function removePopupCellLayer() {
    cellSourceRef.value.source.clear();
  }

  // pointermove handler to remove the popup when focus outside map
  function draggingHandler(evt) {
    let cell_center = getCenter(cellSourceRef.value.source.getExtent());
    let view_extent = map.getView().getViewStateAndExtent().extent;
    if (!containsCoordinate(view_extent, cell_center)) {
      active.value = false;
    } else {
      active.value = true;
      updatePopupPosition();
    }
  }
  function addDraggingHandler() {
    map.on('pointerdrag', draggingHandler)
    map.on('moveend', draggingHandler)
    window.addEventListener("scroll", draggingHandler);
  };
  function removeDraggingHandler() {
    map.un('pointerdrag', draggingHandler)
    map.un('moveend', draggingHandler)
    window.removeEventListener("scroll", draggingHandler);
  };

  //  function to remove the popup
  function removePopup() {
    overlayPosition.value = undefined;
    active.value = false;
    removePopupCellLayer();
    removeDraggingHandler();
  }

  // click handler
  function mapClickHandler(evt) {
    active.value = true;

    let coordinate = evt.coordinate;
    let cellFeatures = cellSourceRef.value.source.getFeatures();

    // only update if clicked outside last clicked cell
    if (!((cellFeatures.length > 0) && cellFeatures[0].getGeometry().containsXY(...coordinate))) {
      removePopupCellLayer();

      // check if inside kombstra layer and update popup
      let pix_value = layerLib.selectedLayer.olLayer.getData(map.getEventPixel(evt.originalEvent));
      if ((pix_value != null) && (pix_value[1] != 0)) {
        overlayPosition.value = coordinate;
        fetchPolygon(coordinate[0], coordinate[1]);
      } else {
        console.log("clicked outside kombstra layer");
        removePopup();
      }
    }

    addDraggingHandler();
  }

  // click handler to hide the popup.
  function closerClick() {
    removePopup();
    return false;
  };

  // create popup and add to map
  onMounted(() => {
    // Add a click handler to the map to render the popup.
    map.on('singleclick', mapClickHandler);
  })

</script>
<template>
  <OlOverlay
    v-show="active && !errorMsg"
    ref="popup"
    :position="overlayPosition"
    :auto-pan="false"
    :stop-event="true"
    class-name="overlay-popup-container"
  >
    <div
      id="popup"
      :class="['ol-popup', popupPosClass]"
    >
      <a
        id="popup-closer"
        ref="closerRef"
        href="#"
        class="ol-popup-closer"
        @click.prevent="closerClick"
      />
      <div id="popup-content">
        <TheMapPopupContent
          :grid-id="cellData?.grid_id"
          :cell-center="cellData?.center"
          :error-msg="errorMsg"
        />
      </div>
    </div>
  </OlOverlay>
  <OlVectorLayer
    :z-index="9"
  >
    <OlSourceVector ref="cellSourceRef">
      <OlStyle>
        <OlStyleStroke
          color="rgba(225, 0, 255, 1)"
          width="4"
        />
      </OlStyle>
    </OlSourceVector>
  </OlVectorLayer>
</template>

<style>
  div.overlay-popup-container{
    z-index: 100 !important;
  }
  .ol-overlaycontainer-stopevent {
    z-index: revert!important;
  }
</style>

<style scoped>
  .ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    height: max-content;
    width: max-content;
  }


  /* small box-arrow */
  .ol-popup:after{
    border: 1px solid #cccccc;
    content: " ";
    position: absolute;
    pointer-events: none;
    width: 17px;
    height: 17px;
    transform: rotate(45deg);
    /* left: 50px;
    margin-left: -9px; */
    background-color: white;
  }

  /* common top and bottom */
  .ol-popup.popup-top, .ol-popup.popup-bottom {
    left: -50px;
  }
  .ol-popup.popup-top:after, .ol-popup.popup-bottom:after {
    left: 50px;
    margin-left: -10px;
  }


  /* top arrow */
  .ol-popup.popup-top{
    bottom: 12px;
  }
  .ol-popup.popup-top:after {
    bottom: -10px;
    border-left: none;
    border-top: none;
  }

  /* bottom arrow */
  .ol-popup.popup-bottom{
    top: 12px;
  }
  .ol-popup.popup-bottom:after{
    top: -10px;
    border-bottom: none;
    border-right: none;
  }

  /* common left and rigth */
  .ol-popup.popup-left, .ol-popup.popup-right {
    top: -200px;
  }
  .ol-popup.popup-left:after, .ol-popup.popup-right:after {
    top: 200px;
    margin-top:-10px;
  }

  /* left arrow */
  .ol-popup.popup-right{
    left: 12px;
  }
  .ol-popup.popup-right:after{
    left: -10px;
    border-right: none;
    border-top: none;
  }

  /* right arrow */
  .ol-popup.popup-left{
    right: 12px;
  }
  .ol-popup.popup-left:after{
    right: -10px;
    border-left: none;
    border-bottom: none;
  }

  /* closer button */
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.2em 0.4em 0.4em 0.2em;
    font-size: 1.1em;
  }
  .ol-popup-closer:after {
    content: "✖";
  }

</style>