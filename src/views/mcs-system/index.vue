<template>
  <div>
    <statusData></statusData>
    <chartData></chartData>
  </div>
</template>

<script>
import statusData from './status/index.vue'
import chartData from './chart/index.vue'


export default {
	components: {
        statusData,
        chartData
	}
}
</script>