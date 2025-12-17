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
          <h4 class="col">
            {{ $t('location_detail_header') }}
          </h4>
        </div>
        <div
          v-if="config.permissionEdit"
          class="col text-end mb-2"
        >
          <template v-if="config.editMode">
            <button
              class="edit-button"
              type="button"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              :data-bs-title="$t('location_detail_edit_save_tooltip')"
              @click="saveButton"
            >
              <i class="bi bi-floppy" />
            </button>
            <button
              class="edit-button"
              type="button"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              :data-bs-title="$t('location_detail_edit_abort_tooltip')"
              @click="abortEditButton"
            >
              <i class="bi bi-x-circle" />
            </button>
          </template>
          <button
            v-else
            class="edit-button"
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :data-bs-title="$t('location_detail_edit_tooltip')"
            @click="config.editMode = true"
          >
            <i class="bi bi-pencil" />
          </button>
        </div>
      </div>

      <TextInput
        v-model="locationData.name"
        :label="$t('location_detail_name_label')"
        :tooltip-msg="$t('location_detail_name_tooltip')"
        :disabled="!config.editMode"
      />
      <TextPartsInput
        v-model="locationData.notes"
        :label="$t('location_detail_notes_label')"
        :tooltip-msg="$t('location_detail_notes_tooltip')"
        :disabled="true"
      />
      <TextInput
        v-model="locationData.identifier"
        :label="$t('location_detail_identifier_label')"
        :tooltip-msg="$t('location_detail_identifier_tooltip')"
        :disabled="!config.editMode"
      />
      <TextInput
        v-model="locationData.type"
        :label="$t('location_detail_type_label')"
        :tooltip-msg="$t('location_detail_type_tooltip')"
        :disabled="!config.editMode"
      />
      <TagsInput
        v-model="locationTagKeys"
        :label="$t('location_detail_tags_label')"
        :tooltip-msg="$t('location_detail_tags_tooltip')"
        :disabled="!config.editMode"
        :valid-tags="config.availableTagKeys"
      />
      <SelectionPartsInput
        v-model="locationData.primaryFolder"
        :label="$t('location_detail_primary_folder_label')"
        :tooltip-msg="$t('location_detail_primary_folder_tooltip')"
        :disabled="!config.editMode"
        :options="config.availableFolders"
        :clearable="config.editMode"
      />
      <!-- TODO: add link to AQUARIUS editing page: Somehow AQuarius uses yet another id to open the locations detail page, which I can't find in the API -->
    </template>
    <template v-else>
      <p>{{ $t('location_detail_no_location_selected') }}</p>
    </template>
  </form>
</template>

<script setup>
  import { ref, onMounted, watch, markRaw, computed } from 'vue';
  import axios from 'axios';
  import { useConfig } from '~/stores/config.js';
  import TextInput from '~~/components/inputs/TextInput.vue';
  import TextPartsInput from '~~/components/inputs/TextPartsInput.vue';
  import SelectionPartsInput from '~~/components/inputs/SelectionPartsInput.vue';
  import TagsInput from '~~/components/inputs/TagsInput.vue';

  const config = useConfig();
  const formRef = ref(null);

  const locationIdentifier = ref(null);
  const locationData = ref({});
  const onlineLocationData = ref({});
  const apiLocationData = ref({});

  // fetch location identifier when the selected location changes
  watch(() => config.selectedLocation, () => {
    config.editMode = false;
    if (config.selectedLocation) {
      // fetch the LocationIdentifier from Aquarius
      axios.get(`${config.aquariusAPIUrls["provision"].replace("ROUTE", "locations")}${config.selectedLocation.getId()}`, {
      })
      .then(response => {
        if (response.data) {
          locationIdentifier.value = response.data.Identifier;
        } else {
          new Error("No data returned for location");
        }
      })
      .catch(error => {
        console.error("Error fetching location identifier from Aquarius:", error);
        locationIdentifier.value = config.selectedLocation.get("identifier");
      });
    } else {
      locationIdentifier.value = null;
    }
  });

  // fetch full location data when the location identifier changes
  watch(() => locationIdentifier.value, () => {
    console.debug("Location identifier changed:", locationIdentifier.value);
    if (!locationIdentifier.value || !config.selectedLocation) {
      locationData.value = {};
      onlineLocationData.value = {};
      apiLocationData.value = {};
      return;
    }

    // fetch the full location data from Aquarius
    axios.get(`${config.aquariusAPIUrls["publish"].replace("ROUTE", "GetLocationData")}`, {
      params: {
        LocationIdentifier: locationIdentifier.value,
      }
    }).then(response => {
      console.debug("Fetched location data from Aquarius:", response.data);
      locationData.value = {
        UniqueId: response.data.UniqueId || markRaw(config.selectedLocation.getId()) || null,
        identifier: response.data.Identifier || markRaw(config.selectedLocation.get("identifier")) || "",
        name: response.data.LocationName || markRaw(config.selectedLocation.get("name")) || "",
        type: response.data.LocationType || "",
        tags: response.data.Tags || markRaw(config.selectedLocation.get("tags")) || [],
        notes: response.data.LocationNotes || [],
        longitude: response.data.Longitude || markRaw(config.selectedLocation.getGeometry().getCoordinates()[0]) || null,
        latitude: response.data.Latitude || markRaw(config.selectedLocation.getGeometry().getCoordinates()[1]) || null,
        primaryFolder: markRaw(config.selectedLocation.get("primaryFolder")) || [],
      };
      onlineLocationData.value = { ...response.data };
      apiLocationData.value = response.data;
    }).catch(propError => {
      console.error("Error fetching location data from Aquarius:", propError);
      locationData.value = {
        UniqueId: markRaw(config.selectedLocation.getId()) || null,
        name: markRaw(config.selectedLocation.get("name")) || "",
        identifier: markRaw(config.selectedLocation.get("identifier")) || "",
        type: markRaw(config.selectedLocation.get("type")) || "",
        tags: markRaw(config.selectedLocation.get("tags")) || [],
        notes: [],
        longitude: markRaw(config.selectedLocation.getGeometry().getCoordinates()[0]) || null,
        latitude: markRaw(config.selectedLocation.getGeometry().getCoordinates()[1]) || null,
        primaryFolder: markRaw(config.selectedLocation.get("primaryFolder")) || [],
      };
      onlineLocationData.value = {};
      apiLocationData.value = {};
    });
  })

  //  computed values
  const locationTagKeys = computed({
    get() {
      return locationData.value.tags.map(tag => tag.Key);
    },
    set(newValue) {
      locationData.value.tags = newValue.filter(tagKey => {
        return !locationData.value.tags.find(tag => tag.Key === tagKey);
      }).map(tagKey => {
        return config.availableTags.find(tag => tag.Key === tagKey) || { Key: tagKey, Value: "" };
      });
    }
  })

  // button click handler to save changes
  const saveButton = () => {
    let neededUpdates = 0;
    let successfulUpdates = 0;
    // update location data in Aquarius
    if ((locationData.value.identifier !== onlineLocationData.value.identifier) ||
        (locationData.value.name !== onlineLocationData.value.name) ||
        (locationData.value.primaryFolder !== onlineLocationData.value.primaryFolder) ||
        (locationData.value.type !== onlineLocationData.value.type)){
      console.debug("Location identifier changed, updating overall location data in Aquarius");
      neededUpdates += 1;
      axios.put(`${config.aquariusAPIUrls["provision"].replace("ROUTE", "locations")}${locationData.value.UniqueId}/`, {
        ...onlineLocationData.value,
        LocationUniqueId: locationData.value.UniqueId,
        LocationIdentifier: locationIdentifier.value,
        LocationName: locationData.value.name,
        LocationPath: locationData.value.primaryFolder.join("."),
        LocationType: locationData.value.type,
      })
      .then(response => {
        successfulUpdates += 1;
      })
      .catch(error => {
        console.error("Error saving location data:", error);
      });
    };

    // update location tags in Aquarius
    if (locationData.value.tags !== onlineLocationData.value.tags){
      console.debug("Location tags changed, updating tags in Aquarius");
      neededUpdates += 1;
      axios.put(`${config.aquariusAPIUrls["provision"].replace("ROUTE", "locations")}${locationData.value.UniqueId}/tags/`, {
        LocationUniqueId: locationData.value.UniqueId,
        TagUniqueIds: locationData.value.tags.map(tag => tag.UniqueId),
      })
      .then(response => {
        successfulUpdates += 1;
      })
      .catch(error => {
        console.error("Error saving location tags:", error);
      });
    }

    // TODO: add updater for notes, but somehow I can't find a n Aquarius API for this

    // finalize edit mode if all updates were successful
    const checkUpdatesInterval = setInterval(() => {
      if (neededUpdates === successfulUpdates) {
        // trigger HydroApps location update from Aquarius data
        axios.patch(`${config.apiUpdateLocationUrl.replace('IDENTIFIER', locationIdentifier.value)}`, {},{
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': config.csrfToken,
          },
        })
        .then(response => {
          // fetch updated location data from HydroApps Database
          axios.get(`${config.apiLocationsUrl}`, {
            params: {
              LocationIdentifier: locationIdentifier.value,
            }
          })
          .then(response => {
            console.debug("Fetched updated location data from HydroApps Database:", response.data);
            config.locations.features.splice(
              config.locations.features.findIndex(feature => feature.id === onlineLocationData.value.UniqueId),
              1,
              response.data.features[0]
            );
          })
          .catch(propError => {
            console.error("Error fetching updated location data from Aquarius:", propError);
          });
        })
        .catch(propError => {
          console.error("Error fetching updated location data from Aquarius:", propError);
        });

        config.editMode = false;
        clearInterval(checkUpdatesInterval);
      }
    }, 500);
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