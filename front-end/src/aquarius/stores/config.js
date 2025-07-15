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
        axios.get(`${this.apiLocationsUrl}?filter=valid`)
          .then(response => {
            this.locations = response.data;
            this.loadingLocations = false;
          })
          .catch(error => {
            console.error('Error fetching locations:', error);
            this.loadingLocations = false;
          });

        // fetch(`${this.apiLocationsUrl}/?filter=valid`, {
        //   method: "GET",
        //   credentials: "include",
        //   headers: {
        //     'Content-Type': 'application/json',
      //       'CSRF-Token': this.csrfToken
      //     },
      //   })
      //     .then(response => {
      //       if (!response.ok) {
      //         throw new Error('Network response was not ok');
      //       }
      //       return response.json();
      //     })
      //     .then(data => {
      //       this.locations = data;
      //     })
      //     .catch(error => {
      //       console.error('Error fetching locations:', error);
      //     });
      // },
      }
    }
  }
)