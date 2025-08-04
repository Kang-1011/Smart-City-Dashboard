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
          <v-col cols="12" md="4" lg="4">
            <MetricCard
              icon="mdi-thermometer"
              title="Temperature"
              :value="currentTemperature"
              unit="°C"
              :history="temperatureHistory"
              :icon-color="temperatureIconColor"
            />
          </v-col>
          <v-col cols="12" md="4" lg="4">
            <MetricCard
              icon="mdi-weather-windy"
              title="Air Quality Index"
              :value="currentAqi"
              unit="AQI"
              :history="aqiHistory"
              :icon-color="aqiIconColor"
            />
          </v-col>
          <v-col cols="12" md="4" lg="4">
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
const zones = ["Downtown", "Suburbs", "Industrial"];
let fetchInterval = null;

import { useSensorStore } from '@/stores/sensors';
const sensorStore = useSensorStore();

const currentTemperature = ref(0);
const currentAqi = ref(0);
const currentTraffic = ref(0);
const temperatureHistory = ref([]);
const aqiHistory = ref([]);
const trafficHistory = ref([]);

async function fetchSensorData() {
  await sensorStore.fetchSensorData(selectedZone.value, 50);

  const sensorReadings = sensorStore.readings;

  const latestReading = sensorReadings.reduce((latest, current) => {
    const latestTime = new Date(latest.timestamp._seconds * 1000);
    const currentTime = new Date(current.timestamp._seconds * 1000);

    return currentTime > latestTime ? current : latest;
  });
  currentTemperature.value = latestReading.temperature;
  currentAqi.value = latestReading.aqi;
  currentTraffic.value = latestReading.traffic;

  temperatureHistory.value = sensorReadings.map(reading => reading.temperature);
  aqiHistory.value = sensorReadings.map(reading => reading.aqi);
  trafficHistory.value = sensorReadings.map(reading => reading.traffic);
}

// Watch for changes in selectedZone
watch(selectedZone, async (newZone) => {
  await fetchSensorData();
})

// Computed Properties for dynamic icon colors
const temperatureIconColor = computed(() => {
  const temp = currentTemperature.value
  if (temp > 30) return 'red';
  if (temp > 20) return 'orange';
  return 'blue';
});
const aqiIconColor = computed(() => {
  const aqi = currentAqi.value
  if (aqi > 150) return 'red';
  if (aqi > 100) return 'orange';
  return 'green';
});
const trafficIconColor = computed(() => {
  const traffic = currentTraffic.value
  if (traffic > 7) return 'red';
  if (traffic > 4) return 'orange';
  return 'green';
});

// Lifecycle Hooks
onMounted(async () => {
  await fetchSensorData();
  fetchInterval = setInterval(fetchSensorData, 60000);
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