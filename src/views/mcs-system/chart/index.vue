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
      machineData1: {},
      machineData2: {},
      machineData3: {}
    };
  },
  mounted() {
    this.fetchMachineData();
    window.addEventListener('resize', this.resizeChart); // 화면 크기 변경 감지
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart); // 컴포넌트 해제 시 이벤트 제거
  },
  methods: {
    async fetchMachineData() {
      try {
        const response1 = await fetch('http://localhost:3000/api/machine1_Data');
        this.machineData1 = await response1.json();

        const response2 = await fetch('http://localhost:3000/api/machine2_Data');
        this.machineData2 = await response2.json();

        const response3 = await fetch('http://localhost:3000/api/machine3_Data');
        this.machineData3 = await response3.json();

        this.renderChart();
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다:', error);
      }
    },
    renderChart() {
      if (this.chart) {
        this.chart.destroy(); // 기존 차트 제거 후 다시 생성
      }

      const ctx = document.getElementById('productionChart').getContext('2d');
      const monthlyData1 = this.aggregateMonthlyData(this.machineData1);
      const monthlyData2 = this.aggregateMonthlyData(this.machineData2);
      const monthlyData3 = this.aggregateMonthlyData(this.machineData3);

      const labels = Object.keys(monthlyData1);
      const machine1Production = labels.map(date => monthlyData1[date].production);
      const machine2Production = labels.map(date => monthlyData2[date].production);
      const machine3Production = labels.map(date => monthlyData3[date].production);

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '기계 1 생산량',
              data: machine1Production,
              borderColor: '#1f77b4',
              backgroundColor: 'rgba(31, 119, 180, 0.2)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
            },
            {
              label: '기계 2 생산량',
              data: machine2Production,
              borderColor: '#2ca02c',
              backgroundColor: 'rgba(44, 160, 44, 0.2)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
            },
            {
              label: '기계 3 생산량',
              data: machine3Production,
              borderColor: '#ff7f0e',
              backgroundColor: 'rgba(255, 127, 14, 0.2)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // 📌 이 옵션을 false로 설정하면 반응형이 제대로 작동함
          scales: {
            x: {
              title: {
                display: true,
                text: '날짜'
              }
            },
            y: {
              title: {
                display: true,
                text: '생산량'
              },
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize(); // 📌 화면 크기 조정 시 차트 크기 업데이트
      }
    },
    aggregateMonthlyData(machineData) {
      const monthlyData = {};
      for (const date in machineData) {
        const [year, month] = date.split('-');
        const monthKey = `${year}-${month}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { production: 0, days: 0 };
        }

        monthlyData[monthKey].production += machineData[date].production;
        monthlyData[monthKey].days += 1;
      }

      return monthlyData;
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px; /* 적절한 높이 설정 */
  min-height: 300px;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
