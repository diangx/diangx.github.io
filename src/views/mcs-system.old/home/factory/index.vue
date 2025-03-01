<template>
  <v-container fluid>
    <!-- 통합 카드 -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" height="100%">
          <v-card-title>Factory Environment</v-card-title>
          <v-card-text>
            <v-row>
              <!-- 공장 내부 레이아웃 -->
              <!-- <v-col cols="12" md="6" class="layout-container">
                <div class="responsive-svg-container">
                  <svg viewBox="0 0 500 350" preserveAspectRatio="xMidYMid meet">
                    <rect x="20" y="20" width="450" height="300" fill="#e0e0e0" stroke="#333" stroke-width="2" />
                    <text x="200" y="40" fill="#333" font-size="14" font-weight="bold">Factory Floor</text>
                    
                    <rect x="50" y="70" width="120" height="60" fill="#b0bec5" stroke="#455a64" stroke-width="2" />
                    <text x="80" y="100" fill="#333">Work Area 1</text>
                    
                    <rect x="50" y="160" width="120" height="60" fill="#b0bec5" stroke="#455a64" stroke-width="2" />
                    <text x="80" y="190" fill="#333">Work Area 2</text>

                    <circle cx="200" cy="70" r="15" fill="blue" />
                    <text x="220" y="75" fill="black">A/C #1</text>
                    <circle cx="200" cy="180" r="15" fill="blue" />
                    <text x="220" y="185" fill="black">A/C #2</text>

                    <circle cx="300" cy="100" r="10" fill="red" />
                    <text x="320" y="105" fill="black">Temp Sensor</text>
                  </svg>
                </div>
              </v-col> -->

              <!-- 평균 온도 및 에어컨 상태 -->
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="6">
                    <v-icon color="red">mdi-thermometer</v-icon> Temperature: 
                    <strong>{{ roomAverage.temperature }}°C</strong>
                  </v-col>
                  <v-col cols="6">
                    <v-icon color="blue">mdi-water-percent</v-icon> Humidity: 
                    <strong>{{ roomAverage.humidity }}%</strong>
                  </v-col>
                </v-row>
                <v-divider class="my-4"></v-divider>
                
                <!-- 24시간 온습도 차트 -->
                <v-card-title>24 Hour Temperature & Humidity</v-card-title>
                <v-row>
                  <v-col cols="12">
                    <canvas id="temperatureHumidityChart"></canvas>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data() {
    return {
      roomAverage: { temperature: '', humidity: '' },
      apiUrl: "http://localhost:3000/api/random-data",
      chartInstance: null, // 차트 인스턴스
      timestamps: [],
      temperature: [],
      humidity: []
    };
  },
  mounted() {
    // this.fetchData();
  },
  props: {
      factory_status_ws_data: Object // WebSocket 데이터를 부모에서 받아옴
  },
  watch: {
    factory_status_ws_data: {
      handler(newVal) {
        if (newVal && newVal.response) {

          this.roomAverage.temperature = newVal.response.currentTemperature;
          this.roomAverage.humidity = newVal.response.currentHumidity;
          this.timestamps = newVal.response.timestamps;
          this.temperature = newVal.response.temperature;
          this.humidity = newVal.response.humidity; 

          if (!this.chartInstance) {
            this.renderChart();
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // async fetchData() {
    //   try {
    //     const response = await fetch(this.apiUrl);
    //     const data = await response.json();

    //     this.timestamps = data.timestamps;
    //     this.temperature = data.temperature;
    //     this.humidity = data.humidity;

    //     this.renderChart();
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // },
    renderChart() {
      const ctx = document.getElementById('temperatureHumidityChart');

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.timestamps,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: this.temperature,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            {
              label: 'Humidity (%)',
              data: this.humidity,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: 'Time' }
            },
            y: {
              title: { display: true, text: 'Values' },
              beginAtZero: true
            }
          }
        }
      });
    }
  }
};
</script>
