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
    window.addEventListener('resize', this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
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
        this.chart.destroy();
      }

      const ctx = document.getElementById('productionChart').getContext('2d');
      const monthlyData1 = this.aggregateMonthlyData(this.machineData1);
      const monthlyData2 = this.aggregateMonthlyData(this.machineData2);
      const monthlyData3 = this.aggregateMonthlyData(this.machineData3);

      const labels = Object.keys(monthlyData1);
      const machine1Production = labels.map(date => monthlyData1[date].production);
      const machine2Production = labels.map(date => monthlyData2[date].production);
      const machine3Production = labels.map(date => monthlyData3[date].production);

      const machine1ChargeAvg = labels.map(date => monthlyData1[date].charge);
      const machine2ChargeAvg = labels.map(date => monthlyData2[date].charge);
      const machine3ChargeAvg = labels.map(date => monthlyData3[date].charge);

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            // 생산량 데이터 (왼쪽 y축: y)
            {
              label: '기계 1 생산량',
              data: machine1Production,
              borderColor: '#1f77b4',
              backgroundColor: 'rgba(31, 119, 180, 0.2)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
              yAxisID: 'y'
            },
            {
              label: '기계 2 생산량',
              data: machine2Production,
              borderColor: '#2ca02c',
              backgroundColor: 'rgba(44, 160, 44, 0.2)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
              yAxisID: 'y'
            },
            {
              label: '기계 3 생산량',
              data: machine3Production,
              borderColor: '#ff7f0e',
              backgroundColor: 'rgba(255, 127, 14, 0.2)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
              yAxisID: 'y'
            },
            // 평균 충전 횟수 데이터 (오른쪽 y축: y2) - 포인트와 선 두께를 키워서 가시성을 높임
            {
              label: '기계 1 평균 충전 횟수',
              data: machine1ChargeAvg,
              borderColor: '#9467bd',
              backgroundColor: 'rgba(148, 103, 189, 0.2)',
              fill: false,
              tension: 0.3,
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7,
              yAxisID: 'y2',
              borderDash: [5, 5],  // 점선 스타일
            },
            {
              label: '기계 2 평균 충전 횟수',
              data: machine2ChargeAvg,
              borderColor: '#d62728',
              backgroundColor: 'rgba(214, 39, 40, 0.2)',
              fill: false,
              tension: 0.3,
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7,
              yAxisID: 'y2',
              borderDash: [5, 5],  // 점선 스타일
            },
            {
              label: '기계 3 평균 충전 횟수',
              data: machine3ChargeAvg,
              borderColor: '#8c564b',
              backgroundColor: 'rgba(140, 86, 75, 0.2)',
              fill: false,
              tension: 0.3,
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7,
              yAxisID: 'y2',
              borderDash: [5, 5],  // 점선 스타일
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: '날짜'
              }
            },
            y: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: '생산량'
              },
              beginAtZero: true
            },
            y2: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: '평균 충전 횟수'
              },
              beginAtZero: true,
              min: 0,
              max: 5,
              grid: {
                drawOnChartArea: false
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: '월별 기계 생산량 및 평균 충전횟수 차트'
            },
            legend: {
              position: 'top',  // 범례 위치
              labels: {
                boxWidth: 20  // 범례 아이콘 크기
              }
            }
          }
        }
      });
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    aggregateMonthlyData(machineData) {
      const monthlyData = {};
      for (const date in machineData) {
        const [year, month] = date.split('-');
        const monthKey = `${year}-${month}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { production: 0, charge: 0, days: 0 };
        }

        monthlyData[monthKey].production += machineData[date].production;
        monthlyData[monthKey].charge += machineData[date].charge;
        monthlyData[monthKey].days += 1;
      }
      
      // 일별 충전 횟수의 평균값 계산
      for (const key in monthlyData) {
        monthlyData[key].charge /= monthlyData[key].days;
      }

      return monthlyData;
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
