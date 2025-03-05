<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, registerables } from 'chart.js';
import { HTTP_URL } from "@/shared/config";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ...registerables);

export default {
  name: 'MachineChart',
  data() {
    return {
      chart: null,
      machineData: [] // 필요 시 API 데이터를 저장할 변수
    };
  },
  mounted() {
    this.fetchMachineData();
    window.addEventListener('resize', this.resizeChart);
    // 실제 환경에서는 setInterval로 주기적으로 업데이트 할 수 있습니다.
    // setInterval(() => this.fetchMachineData(), 60 * 60 * 1000);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    async fetchMachineData() {
      try {
        // 실제 API 주소에 맞춰 수정하세요.
        const response = await fetch(`${HTTP_URL}/api/warehouse`, {
          headers: { 'ngrok-skip-browser-warning': '69420' }
        });

        if (!response.ok) {
          throw new Error(`창고 API 에러: ${response.statusText}`);
        }
        const data = await response.json();

        // 모든 층의 데이터를 하나의 배열로 합칩니다.
        const machines = Object.values(data).flat();

        // 데이터 내에서 가장 최신 시간(maxTime)을 구합니다.
        const maxTime = new Date(Math.max(...machines.map(m => new Date(m.date))));
        // 최신 시간 기준으로 버킷의 끝을 정하기 위해, 최신 시간을 정각으로 맞춥니다.
        maxTime.setMinutes(0, 0, 0);

        // 최신 버킷을 maxTime으로 하고, 거기서 11시간 전까지 총 12개 버킷을 생성합니다.
        const startBucket = new Date(maxTime.getTime() - 11 * 60 * 60 * 1000);
        const buckets = [];
        for (let i = 0; i < 12; i++) {
          const bucketStart = new Date(startBucket.getTime() + i * 60 * 60 * 1000);
          const bucketEnd = new Date(bucketStart.getTime() + 60 * 60 * 1000);
          const label = bucketStart.getHours().toString().padStart(2, '0') + ':00';
          buckets.push({ label, start: bucketStart, end: bucketEnd });
        }
        // 버킷 배열의 순서는 왼쪽: 오래된 시간, 오른쪽: 최신 시간
        const labels = buckets.map(b => b.label);

        const grouped = {};
        machines.forEach(machine => {
          const machineTime = new Date(machine.date);
          // 버킷 범위: startBucket ~ (maxTime + 1시간)
          if (machineTime >= startBucket && machineTime < new Date(maxTime.getTime() + 60 * 60 * 1000)) {
            // 해당 데이터가 속하는 버킷 찾기
            const bucket = buckets.find(b => machineTime >= b.start && machineTime < b.end);
            if (bucket) {
              const name = machine.name;
              if (!grouped[name]) grouped[name] = {};
              // 초기값 0으로 설정 후 1씩 더합니다.
              grouped[name][bucket.label] = (grouped[name][bucket.label] || 0) + 1;
            }
          }
        });

        // 각 기계별로 12개 버킷에 대한 처리 건수 배열 구성
        const datasets = [];
        for (const [machineName, bucketData] of Object.entries(grouped)) {
          const dataArr = labels.map(label => bucketData[label] || 0);
          // 기계별 배경색 설정
          const colorMap = {
            "Counter-Balance Forklift Type AGV": "rgba(255, 99, 132, 0.8)",  // 빨간색 계열
            "Pallet Truck Type AGV": "rgba(54, 162, 235, 0.8)",              // 파란색 계열
            "High-mast Reach Forklift Type AGV": "rgba(153, 102, 255, 0.8)"     // 보라색 계열
          };
          const backgroundColor = colorMap[machineName] || 'rgba(255, 159, 64, 0.8)';

          datasets.push({
            label: machineName,
            data: dataArr,
            backgroundColor,
            borderWidth: 1
          });
        }

        // 차트 생성 또는 업데이트
        const ctx = document.getElementById('myChart').getContext('2d');
        if (this.chart) {
          this.chart.data.labels = labels;
          this.chart.data.datasets = datasets;
          this.chart.update();
        } else {
          this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels,
              datasets
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: 'AGV별 시간당 처리 건수'
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                }
              },
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: '시간 (왼쪽: 오래된 시간, 오른쪽: 최신 시간)'
                  }
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: '처리 건수'
                  }
                }
              }
            }
          });
        }
      } catch (error) {
        console.error("❌ 창고 데이터 로딩 오류:", error);
      }
    }
  }
};
</script>
