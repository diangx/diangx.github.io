<template>
  <div class="chart-container">
    <canvas id="productionChart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js';
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, registerables } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ...registerables);

export default {
  name: 'MachineChart',
  data() {
    return {
      chart: null,
      machineData: []
    };
  },
  mounted() {
    this.fetchMachineData();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    async fetchMachineData() {
      try {
        const axios = require('axios');
        let response;

        try {
            response = await axios.get("https://definitely-handy-cow.ngrok-free.app/api/machines/production_and_charge", {
                headers: { 'ngrok-skip-browser-warning': '69420' }
            });
        } catch {
            response = await axios.get("http://localhost:3000/api/machines/production_and_charge");
        }

        const machineData = response.data;
        const groupedData = {};

        Object.values(machineData).forEach(machine => {
          Object.keys(machine).forEach(date => {
            const record = machine[date];
            const { machineName, production, charge } = record;
            const month = date.substring(0, 7);

            if (!groupedData[machineName]) {
              groupedData[machineName] = {};
            }
            
            if (!groupedData[machineName][month]) {
              groupedData[machineName][month] = { totalProduction: 0, totalCharge: 0, count: 0 };
            }

            groupedData[machineName][month].totalProduction += production;
            groupedData[machineName][month].totalCharge += charge;
            groupedData[machineName][month].count += 1;
          });
        });

        this.machineData = Object.keys(groupedData).flatMap(machineName => 
          Object.keys(groupedData[machineName]).map(month => ({
            machineName,
            month,
            avgProduction: (groupedData[machineName][month].totalProduction / groupedData[machineName][month].count).toFixed(2),
            avgCharge: (groupedData[machineName][month].totalCharge / groupedData[machineName][month].count).toFixed(2)
          }))
        );
        this.renderChart();
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    },

    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = document.getElementById('productionChart').getContext('2d');
      const labels = [...new Set(this.machineData.map(item => item.month))].sort();
      const machineNames = [...new Set(this.machineData.map(item => item.machineName))];

      const datasets = machineNames.map((name, index) => ({
        label: `${name} 평균 생산량`,
        data: labels.map(month => {
          const entry = this.machineData.find(item => item.machineName === name && item.month === month);
          return entry ? parseFloat(entry.avgProduction) : null;
        }),
        borderColor: `hsl(${index * 60}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.3)`,
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        yAxisID: 'y'
      }));

      datasets.push(...machineNames.map((name, index) => ({
        label: `${name} 평균 충전 횟수`,
        data: labels.map(month => {
          const entry = this.machineData.find(item => item.machineName === name && item.month === month);
          return entry ? parseFloat(entry.avgCharge) : null;
        }),
        borderColor: `hsl(${index * 60 + 30}, 70%, 40%)`,
        backgroundColor: `hsla(${index * 60 + 30}, 70%, 40%, 0.3)`,
        fill: false,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y2',
        borderDash: [5, 5]
      })));

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { title: { display: true, text: '월별' } },
            y: { type: 'linear', position: 'left', title: { display: true, text: '평균 생산량' }, beginAtZero: true },
            y2: { type: 'linear', position: 'right', title: { display: true, text: '평균 충전 횟수' }, beginAtZero: true, min: 0, max: 5, grid: { drawOnChartArea: false } }
          },
          plugins: {
            title: { display: true, text: '월별 기기 평균 생산량 및 충전 횟수' },
            legend: { position: 'top', labels: { boxWidth: 20 } }
          }
        }
      });
    },

    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  min-height: 300px;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>