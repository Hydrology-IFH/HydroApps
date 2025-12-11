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
            v-if="!config.editMode"
            class="edit-button"
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :data-bs-title="$t('location_detail_edit_tooltip')"
            @click="config.editMode = true"
          >
            <i :class="['bi', config.editMode ? 'bi-floppy' : 'bi-pencil']" />
          </button>
          <button
            v-else
            class="edit-button"
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :data-bs-title="$t('location_detail_edit_save_tooltip')"
            @click="saveButton"
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
            @click="abortEditButton"
          >
            <i :class="['bi', 'bi-x-circle']" />
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
        :clearable="config.editMode"
      />
    </template>
    <template v-else>
      <p>{{ $t('location_detail_no_location_selected') }}</p>
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
  const saveButton = () => {
    console.log("Save button clicked. Edit mode:", config.editMode);
    axios.put(`${config.aquariusAPIUrls["provision"].replace("ROUTE", "locations")}`, {
      subroutes: [locationData.value.Identifier],
      ...locationData.value,

    })
      .then(response => {
        console.log("Location data saved successfully:", response.data);
        onlineLocationData.value = { ...markRaw(locationData.value) };
        config.editMode = false;
      })
      .catch(error => {
        console.error("Error saving location data:", error);
      });
  };

  // button click handler to reset changes
  const abortEditButton = () => {
    config.editMode = false;
    locationData.value = { ...markRaw(onlineLocationData.value) };
  };

  // Initialize tooltips for form elements
  onMounted(() => {
    formRef.value.querySelectorAll('[data-bs-toggle=tooltip]').forEach((input) => {
      new window.bootstrap.Tooltip(input, {html: true, delay: {show: 100, hide: 100}, sanitize: false})
    });
  });
  window.onlineLocationData = onlineLocationData;
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