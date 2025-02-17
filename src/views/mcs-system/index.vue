<template>
  <div>
  <v-layout class="overflow-visible" style="height: 56px;">
    <v-bottom-navigation
      v-model="value"
      color="orange"
      grow
      style="bottom: unset;"
    >
      <v-btn :value="1">
        <v-icon>mdi-home</v-icon>
        Home
      </v-btn>

      <v-btn :value="2">
        <v-icon>mdi-history</v-icon>
        Data
      </v-btn>

      <v-btn :value="3">
        <v-icon> mdi-cog</v-icon>
        Upgrade
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
    <div v-show="value == 1">
      <statusData></statusData>
      <hr>
      <chartData></chartData>
    </div>
  </div>
</template>

<script>
import statusData from './status/index.vue'
import chartData from './chart/index.vue'


export default {
	components: {
        statusData,
        chartData
	},
  data() {
    return {
      value: 1
    };
  },
}
</script>