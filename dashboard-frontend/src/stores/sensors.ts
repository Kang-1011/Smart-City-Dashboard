import { defineStore } from "pinia";
import axios from 'axios';

interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface Reading {
  zone: string;
  temperature: number;
  aqi: number;
  traffic: number;
  timestamp: Timestamp;
}

export const useSensorStore = defineStore("sensor", {
  state: () => ({
    readings: [] as Reading[],
  }),

  getters: {},

  actions: {
    async fetchSensorData(zone: string, limit: number) {
      try {
        if( zone == null || limit == null ) {
          throw new Error("Missing required parameters");
        }
        const params = {
          zone: zone,
          limit: limit
        };

        const response = await axios.get("https://getlatestsensorreadings-pssqmcnt7q-uc.a.run.app/", { params });
        const data = response.data;

        this.readings = data;
        console.log("Fetched sensor readings: ", this.readings);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    },
  },
});
