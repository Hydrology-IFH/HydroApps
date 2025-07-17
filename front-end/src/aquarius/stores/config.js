import { defineStore } from 'pinia'
import axios from 'axios'

export const useConfig = defineStore(
  "config",
  {
    state: () => ({
      apiLocationsUrl: window.initSettings.apiLocationsUrl,
      aquariusAPIUrl: window.initSettings.aquariusAPIUrl,
      permissionEdit: window.initSettings.permissionEdit,
      csrfToken: window.initSettings.csrfToken,
      locations: undefined,
      loadingLocations: false,
    }),
    actions: {
      async fetchLocations() {
        this.loadingLocations = true;
        axios.get(`${this.apiLocationsUrl}?filter=valid`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
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
      }
    }
  }
)