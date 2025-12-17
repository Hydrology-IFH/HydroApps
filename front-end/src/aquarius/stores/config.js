import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import axios from 'axios'

export const useConfig = defineStore(
  "config",
  {
    state: () => ({
      apiLocationsUrl: window.initSettings.apiLocationsUrl,
      aquariusAPIUrls: {
        acquisition: window.initSettings.aquariusAPIUrl.replace('ENDPOINT', 'acquisition'),
        publish: window.initSettings.aquariusAPIUrl.replace('ENDPOINT', 'publish'),
        provision: window.initSettings.aquariusAPIUrl.replace('ENDPOINT', 'provision')
      },
      apiUpdateLocationUrl: window.initSettings.apiUpdateLocationUrl,
      permissionEdit: window.initSettings.permissionEdit,
      csrfToken: window.initSettings.csrfToken,
      locations: undefined,
      loadingLocations: false,
      availableTags: [],
      availableFolders: [],
      filter: {
        tagKeys: [],
        folders: ["All Locations"],
      },
      editMode: false,
    }),
    getters: {
      filteredLocations: (state) => {
        if (!state.locations) return undefined;
        var locations = {...state.locations};

        // Filter by tags
        if (state.filter.tagKeys.length > 0){
          locations.features = locations.features.filter(feature => {
            return feature.properties.tags.some(tag => state.filter.tagKeys.includes(tag));
          });
        }

        // Filter by folders
        if (state.filter.folders.length > 1 || (state.filter.folders.length == 1 && state.filter.folders[0] !== "All Locations")) {
          locations.features = locations.features.filter(feature => {
            return feature.properties.primaryFolder.length >= state.filter.folders.length &&
              state.filter.folders.every((folder, index) => {
                return folder === feature.properties.primaryFolder[index];
              });
          });
        }
        // Mark features as raw to prevent reactivity issues
        locations.features = locations.features.map(markRaw);
        return locations;
      },
      availableTagKeys: (state) => {
        return state.availableTags.map(tag => tag.Key);
      },
    },
    actions: {
      async fetchLocations() {
        this.loadingLocations = true;
        axios.get(`${this.apiLocationsUrl}?filter=valid`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Expires': '0'
            }
          })
          .then(response => {
            this.locations = response.data;
            this.loadingLocations = false;
          })
          .catch(error => {
            console.error('Error fetching locations:', error);
            this.loadingLocations = false;
          });
      },
      async fetchTags() {
        try {
          const response = await axios.get(
            `${this.aquariusAPIUrls["publish"].replace('ROUTE', 'GetTagList')}`,
            {
              headers: {
                'Cache-Control': 'max-age=60',
                'Expires': new Date(Date.now() + 60 * 1000).toUTCString(),
              },
              params: {
                Applicability: "AppliesToLocations",
              }
          });
          this.availableTags = response.data.Tags;
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
      },
      async fetchFolders() {
        try {
          const response = await axios.get(
            `${this.aquariusAPIUrls["provision"].replace('ROUTE', 'locationfolders')}`,
            {
              headers: {
                'Cache-Control': 'max-age=60',
                'Expires': new Date(Date.now() + 60 * 1000).toUTCString(),
              }
          });
          this.availableFolders = response.data.Results.map(folder => {
            return {
              label: folder.LocationFolderName,
              value: folder.LocationFolderPath?.split(".").slice(-1)[0],
              parentValue: folder.ParentLocationFolderPath?.split(".").slice(-1)[0] || null
            };
          });
        } catch (error) {
          console.error('Error fetching folders:', error);
        }
      }
    }
  }
)