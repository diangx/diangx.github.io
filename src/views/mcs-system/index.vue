<template>
  <div>
    <v-layout class="overflow-visible" style="height: 56px;">
      <v-bottom-navigation
        v-model="value"
        color="orange"
        grow
        style="bottom: unset;"
      >
        <v-btn :value="1" @click="toggleView(1)">
          <v-icon>mdi-home</v-icon>
          Home
        </v-btn>

        <v-btn :value="2" @click="toggleView(2)">
          <v-icon>mdi-history</v-icon>
          Data
        </v-btn>

        <v-btn :value="3" @click="toggleView(3)">
          <v-icon>mdi-cog</v-icon>
          Upgrade
        </v-btn>
      </v-bottom-navigation>
    </v-layout>

    <div v-show="value === 1">
      <!-- <statusData></statusData>
      <v-divider></v-divider> -->
        <chartData></chartData>
      <v-divider></v-divider>
        <factoryData></factoryData>
    </div>

    <div v-show="value === 2">
      <dataData></dataData>
    </div>

    <div v-show="value === 3">
      <p>Upgrade Page</p>
    </div>
  </div>
</template>

<script>
import statusData from './status/index.vue'
import chartData from './chart/index.vue'
import factoryData from './factory/index.vue'
import dataData from './data/index.vue'

export default {
  components: {
    statusData,
    chartData,
    factoryData,
    dataData
  },
  data() {
    return {
      value: 1
    };
  },
  methods: {
    toggleView(selectedValue) {
      this.value = selectedValue
    }
  }
}
</script>