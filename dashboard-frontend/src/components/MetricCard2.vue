<template>
  <v-card class="mx-auto" color="surface-light" min-height="400">
    <template v-slot:prepend>
      <v-icon :color="iconColor" class="me-8" :icon="icon" size="64" />
    </template>

    <template v-slot:title>
      <div class="text-caption text-grey text-uppercase">
        {{ title }}
      </div>
      <span class="text-h3 font-weight-black" v-text="value || '—'"></span>
      <strong v-if="value !== '—'">{{ unit }}</strong>
    </template>

    <v-sheet color="transparent">
      <TimeSeriesChart
        v-if="history.length > 0"
        :label="title"
        :data-points="history"
        :color="chartColor"
      />
    </v-sheet>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import TimeSeriesChart from './TimeSeriesChart.vue'

const props = defineProps({
  icon: String,
  title: String,
  value: [String, Number],
  unit: String,
  history: {
    type: Array,
    default: () => [], // Expecting: [{ timestamp: {_seconds}, value }]
  },
  iconColor: String,
})

const chartColor = computed(() => {
  return props.iconColor || '#42b883'
})
</script>
