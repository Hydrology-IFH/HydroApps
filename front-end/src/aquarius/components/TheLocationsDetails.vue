<template>
  <form
    id="menu"
    ref="formRef"
    class="form-horizontal"
    action="javascript:void(0);"
  >
    <template v-if="Object.keys(locationData).length > 0">
      <div class="row">
        <div class="col">
          <h4 class="col">{{ $t('location_detail_header') }}</h4>
        </div>
        <div class="col text-end mb-2">
          <button
            class="edit-button"
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :data-bs-title="config.editMode ? $t('location_detail_edit_save_tooltip') : $t('location_detail_edit_tooltip')"
            @click="editButton"
          >

            <i :class="['bi', config.editMode ? 'bi-floppy' : 'bi-pencil']" />
          </button>
          <button
            v-if="config.editMode"
            class="edit-button"
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :data-bs-title="$t('location_detail_edit_abort_tooltip')"
            @click="editButton"
          >
            <i :class="['bi', 'bi-x']" />
          </button>
        </div>
      </div>

      <TextInput
        v-model="locationData.LocationName"
        :label="$t('location_detail_name_label')"
        :tooltip-msg="$t('location_detail_name_tooltip')"
        :disabled="!config.editMode"
      />
      <TextPartsInput
        v-model="locationData.LocationNotes"
        :label="$t('location_detail_notes_label')"
        :tooltip-msg="$t('location_detail_notes_tooltip')"
        :disabled="!config.editMode"
      />
      <TextInput
        v-model="locationData.Identifier"
        :label="$t('location_detail_identifier_label')"
        :tooltip-msg="$t('location_detail_identifier_tooltip')"
        :disabled="!config.editMode"
      />
      <TextInput
        v-model="locationData.LocationType"
        :label="$t('location_detail_type_label')"
        :tooltip-msg="$t('location_detail_type_tooltip')"
        :disabled="!config.editMode"
      />
      <TagsInput
        v-model="locationData.tags"
        :label="$t('location_detail_tags_label')"
        :tooltip-msg="$t('location_detail_tags_tooltip')"
        :disabled="!config.editMode"
        :valid-tags="config.availableTags"
      />
      <SelectionPartsInput
        v-model="locationData.primaryFolder"
        :label="$t('location_detail_primary_folder_label')"
        :tooltip-msg="$t('location_detail_primary_folder_tooltip')"
        :disabled="!config.editMode"
        :options="config.availableFolders"
      />
    </template>
  </form>
</template>

<script setup>
  import { ref, onMounted, watch, markRaw } from 'vue';
  import axios from 'axios';
  import { useConfig } from '~/stores/config.js';
  import TextInput from '~~/components/inputs/TextInput.vue';
  import TextPartsInput from '~~/components/inputs/TextPartsInput.vue';
  import SelectionPartsInput from '~~/components/inputs/SelectionPartsInput.vue';
  import TagsInput from '~~/components/inputs/TagsInput.vue';

  const config = useConfig();
  const formRef = ref(null);

  const locationData = ref({});
  const onlineLocationData = ref({});

  // fetch location data when the selected location changes
  watch(() => config.selectedLocation, () => {
    config.editMode = false;
    if (config.selectedLocation) {
      axios.get(`${config.aquariusAPIUrls["publish"].replace("ROUTE", "GetLocationData")}`, {
        params: {
          LocationIdentifier: config.selectedLocation.get("identifier"),
        }
      }).then(response => {
        locationData.value = {
          ...markRaw(config.selectedLocation.getProperties()),
          ...response.data,
        };
        onlineLocationData.value = { ...markRaw(locationData.value) };
      }).catch(error => {
        console.error("Error fetching location data:", error);
        locationData.value = {};
      });
    } else {
      locationData.value = {};
    }
  });

  // button click handler to save changes
  const editButton = () => {
    if (config.editMode.value) {
      axios.post(`${config.aquariusAPIUrl.replace("ENDPOINT", "UpdateLocationData")}`, {
        LocationIdentifier: locationData.value.LocationIdentifier,
        LocationName: locationData.value.LocationName,
        LocationNotes: locationData.value.LocationNotes,
        LocationType: locationData.value.LocationType,
        tags: locationData.value.tags,
        primaryFolder: locationData.value.primaryFolder,
      }).then(() => {
        config.fetchLocations();
      }).catch(error => {
        console.error("Error saving location data:", error);
      });
      config.editMode = false;
    } else {
      config.editMode = true;
    }
  };

  // Initialize tooltips for form elements
  onMounted(() => {
    formRef.value.querySelectorAll('[data-bs-toggle=tooltip]').forEach((input) => {
      new window.bootstrap.Tooltip(input, {html: true, delay: {show: 100, hide: 100}, sanitize: false})
    });
  });
  window.locationData = locationData;
</script>

<style scoped>
  .edit-button {
    background-color: transparent;
    border: none;
    color: black;
    font-size: x-large;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
  }
  .edit-button:hover {
    color: var(--bs-primary);
  }
</style>