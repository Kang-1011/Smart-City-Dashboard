<template>
  <v-card class="mx-auto" color="surface-light" min-height="400">
    <template v-slot:prepend>
      <v-icon
        :color="iconColor"
        class="me-8"
        :icon="icon"
        size="64"
      ></v-icon>
    </template>

    <template v-slot:title>
      <div class="text-caption text-grey text-uppercase">
        {{ title }}
      </div>
      <span class="text-h3 font-weight-black" v-text="value || '—'"></span>
      <strong v-if="value !== '—'">{{ unit }}</strong>
    </template>

    <v-sheet color="transparent">
      <v-sparkline
        v-if="history.length > 0"
        :key="title + value"
        :gradient="sparklineGradient"
        :line-width="3"
        :model-value="history"
        :smooth="16"
        stroke-linecap="round"
        auto-draw
        :height="200"
      ></v-sparkline>
    </v-sheet>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: String,
  title: String,
  value: [String, Number],
  unit: String,
  history: {
    type: Array,
    default: () => [],
  },
  iconColor: String,
});

const sparklineGradient = computed(() => {
  // A generic gradient for the sparklines
  return ['#42b883', '#35495e'];
});
</script>