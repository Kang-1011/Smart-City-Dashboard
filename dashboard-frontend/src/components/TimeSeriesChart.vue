<template>
  <Line :data="chartData" :options="chartOptions" :height="400" />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Filler)

const props = defineProps({
  label: String,
  dataPoints: Array, // [{ timestamp: { _seconds }, value: Number }]
  color: String
})

const chartData = {
  datasets: [
    {
      label: props.label,
      data: props.dataPoints.map(d => ({
        x: new Date(d.timestamp._seconds * 1000),
        y: d.value
      })),
      borderColor: props.color || '#42a5f5',
      backgroundColor: props.color + '33' || 'rgba(66, 165, 245, 0.2)',
      tension: 0.3,
      pointRadius: 3,
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: context => {
          const date = new Date(context.parsed.x)
          const value = context.parsed.y
          return `${date.toLocaleString()} — ${value}`
        }
      }
    },
    legend: { display: false }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        tooltipFormat: 'PPpp',
        unit: 'minute'
      },
      title: {
        display: true,
        text: 'Time'
      }
    },
    y: {
      title: {
        display: true,
        text: props.label
      }
    }
  }
}
</script>
