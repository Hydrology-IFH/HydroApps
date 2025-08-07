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
        publish: window.initSettings.aquariusAPIUrl.replace('ENDPOINT', 'publish')
      },
      permissionEdit: window.initSettings.permissionEdit,
      csrfToken: window.initSettings.csrfToken,
      locations: undefined,
      loadingLocations: false,
      availableTags: [],
      selectedTags: [],
    }),
    getters: {
      filteredLocations: (state) => {
        if (!state.locations) return undefined;
        var locations = {...state.locations};
        if (state.selectedTags.length === 0) return locations;
        locations.features = locations.features.filter(feature => {
          return feature.properties.tags.some(tag => state.selectedTags.includes(tag));
        }).map(markRaw);
        return locations;
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
          this.availableTags = response.data.Tags.map(tag => tag.Key);
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
      }
    }
  }
)