<template>
  <v-app>
    <v-main class="bg-grey-lighten-3">
      <v-container fluid>
        <v-row class="mb-4">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold">Smart City Dashboard</h1>
          </v-col>
        </v-row>
        
        <v-row class="mb-6">
          <v-col cols="12" md="12">
            <v-select
              v-model="selectedZone"
              :items="zones"
              label="Filter by Zone"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="12" lg="4">
            <MetricCard
              icon="mdi-thermometer"
              title="Temperature"
              :value="currentTemperature"
              unit="°C"
              :history="temperatureHistory"
              :icon-color="temperatureIconColor"
            />
          </v-col>
          <v-col cols="12" md="12" lg="4">
            <MetricCard
              icon="mdi-weather-windy"
              title="Air Quality Index"
              :value="currentAqi"
              unit="AQI"
              :history="aqiHistory"
              :icon-color="aqiIconColor"
            />
          </v-col>
          <v-col cols="12" md="12" lg="4">
            <MetricCard
              icon="mdi-car-multiple"
              title="Traffic Level"
              :value="currentTraffic"
              unit=""
              :history="trafficHistory"
              :icon-color="trafficIconColor"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import MetricCard from '@/components/MetricCard.vue';

// State
const selectedZone = ref('Suburbs');
const zones = ['Downtown', 'Suburbs', 'Financial District'];
const sensorData = ref([]);
let fetchInterval = null;

// Computed Properties for the current values
const filteredData = computed(() => {
  const data = sensorData.value.find(d => d.zone === selectedZone.value);
  return data || {};
});

const currentTemperature = computed(() => filteredData.value.temperature || '—');
const currentAqi = computed(() => filteredData.value.aqi || '—');
const currentTraffic = computed(() => filteredData.value.traffic || '—');

// Computed Properties for historical data (for sparklines)
const temperatureHistory = computed(() => filteredData.value.temperatureHistory || []);
const aqiHistory = computed(() => filteredData.value.aqiHistory || []);
const trafficHistory = computed(() => filteredData.value.trafficHistory || []);

// Computed Properties for dynamic icon colors
const temperatureIconColor = computed(() => {
  const temp = filteredData.value.temperature;
  if (temp > 30) return 'red';
  if (temp > 20) return 'orange';
  return 'blue';
});
const aqiIconColor = computed(() => {
  const aqi = filteredData.value.aqi;
  if (aqi > 150) return 'red';
  if (aqi > 100) return 'orange';
  return 'green';
});
const trafficIconColor = computed(() => {
  const traffic = filteredData.value.traffic;
  if (traffic > 7) return 'red';
  if (traffic > 4) return 'orange';
  return 'green';
});

// Mock API Call
const fetchSensorData = async () => {
  // Simulate an API call with a delay
  console.log("Fetching new sensor data...");
  const mockData = [
    {
      zone: 'Downtown',
      temperature: (25 + Math.random() * 5).toFixed(1),
      aqi: Math.floor(50 + Math.random() * 100),
      traffic: Math.floor(1 + Math.random() * 8),
      temperatureHistory: Array.from({ length: 25 }, () => (25 + Math.random() * 5).toFixed(1)),
      aqiHistory: Array.from({ length: 25 }, () => Math.floor(50 + Math.random() * 100)),
      trafficHistory: Array.from({ length: 25 }, () => Math.floor(1 + Math.random() * 8)),
    },
    {
      zone: 'Suburbs',
      temperature: (20 + Math.random() * 3).toFixed(1),
      aqi: Math.floor(20 + Math.random() * 50),
      traffic: Math.floor(1 + Math.random() * 3),
      temperatureHistory: Array.from({ length: 25 }, () => (20 + Math.random() * 3).toFixed(1)),
      aqiHistory: Array.from({ length: 25 }, () => Math.floor(20 + Math.random() * 50)),
      trafficHistory: Array.from({ length: 25 }, () => Math.floor(1 + Math.random() * 3)),
    },
    {
      zone: 'Financial District',
      temperature: (26 + Math.random() * 4).toFixed(1),
      aqi: Math.floor(60 + Math.random() * 80),
      traffic: Math.floor(5 + Math.random() * 5),
      temperatureHistory: Array.from({ length: 25 }, () => (26 + Math.random() * 4).toFixed(1)),
      aqiHistory: Array.from({ length: 25 }, () => Math.floor(60 + Math.random() * 80)),
      trafficHistory: Array.from({ length: 25 }, () => Math.floor(5 + Math.random() * 5)),
    },
  ];

  sensorData.value = mockData;
};

// Lifecycle Hooks
onMounted(() => {
  fetchSensorData();
  fetchInterval = setInterval(fetchSensorData, 60000); // Update every 3 seconds
});

onUnmounted(() => {
  clearInterval(fetchInterval);
});
</script>

<style scoped>
.fill-height {
    height: 100%;
}
</style>