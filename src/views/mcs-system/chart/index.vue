<template>
  <div>
    <canvas id="productionChart"></canvas>
  </div>
</template>

<script>
// Chart.js와 필요한 모듈 임포트
import { Chart } from 'chart.js';
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, registerables } from 'chart.js';

// Chart.js 등록
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

Chart.register(...registerables);

export default {
  name: 'MachineChart',
  data() {
    return {
      machineData1: {},  // 기계 1 데이터 저장
      machineData2: {},  // 기계 2 데이터 저장
      machineData3: {}   // 기계 3 데이터 저장
    };
  },
  mounted() {
    // 컴포넌트 마운트 시 데이터 요청
    this.fetchMachineData();
  },
  methods: {
    async fetchMachineData() {
      try {
        // 기계 1, 2, 3의 데이터 각각 가져오기
        const response1 = await fetch('http://localhost:3000/api/machine1_Data');
        const data1 = await response1.json();
        this.machineData1 = data1;

        const response2 = await fetch('http://localhost:3000/api/machine2_Data');
        const data2 = await response2.json();
        this.machineData2 = data2;

        const response3 = await fetch('http://localhost:3000/api/machine3_Data');
        const data3 = await response3.json();
        this.machineData3 = data3;

        this.renderChart();
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다:', error);
      }
    },
    renderChart() {
      // 월별 데이터를 계산하기 위해서
      const monthlyData1 = this.aggregateMonthlyData(this.machineData1);
      const monthlyData2 = this.aggregateMonthlyData(this.machineData2);
      const monthlyData3 = this.aggregateMonthlyData(this.machineData3);

      // canvas context 가져오기
      const ctx = document.getElementById('productionChart').getContext('2d');

      // 월별 날짜 (예: "2023-01")
      const labels = Object.keys(monthlyData1);
      const machine1Production = labels.map(date => monthlyData1[date].production);
      const machine2Production = labels.map(date => monthlyData2[date].production);
      const machine3Production = labels.map(date => monthlyData3[date].production);
      const machine1ChargeAvg = labels.map(date => monthlyData1[date].chargeAvg);
      const machine2ChargeAvg = labels.map(date => monthlyData2[date].chargeAvg);
      const machine3ChargeAvg = labels.map(date => monthlyData3[date].chargeAvg);

      // 차트 그리기
      new Chart(ctx, {
        type: 'line',  // 차트 유형: 선 그래프
        data: {
          labels: labels,  // x축에 월별 날짜 표시
          datasets: [
            {
              label: 'CF AGV 생산량',
              data: machine1Production,  // 기계1 생산량 데이터
              borderColor: '#1f77b4',  // 선 색상 (기계 1)
              backgroundColor: 'rgba(31, 119, 180, 0.2)',  // 배경색
              fill: true,  // 선 아래 영역 채우기
              tension: 0.3,  // 선의 곡률
              borderWidth: 2,  // 선 두께
              pointStyle: 'circle',  // 포인트 스타일을 원으로 설정
              yAxisID: 'y1',  // 첫 번째 y축
            },
            {
              label: 'PT AGV 생산량',
              data: machine2Production,  // 기계2 생산량 데이터
              borderColor: '#2ca02c',  // 선 색상 (기계 2)
              backgroundColor: 'rgba(44, 160, 44, 0.2)',  // 배경색
              fill: true,  // 선 아래 영역 채우기
              tension: 0.3,  // 선의 곡률
              borderWidth: 2,  // 선 두께
              pointStyle: 'triangle',  // 포인트 스타일을 삼각형으로 설정
              yAxisID: 'y1',  // 첫 번째 y축
            },
            {
              label: 'HR AGV 3 생산량',
              data: machine3Production,  // 기계3 생산량 데이터
              borderColor: '#ff7f0e',  // 선 색상 (기계 3)
              backgroundColor: 'rgba(255, 127, 14, 0.2)',  // 배경색
              fill: true,  // 선 아래 영역 채우기
              tension: 0.3,  // 선의 곡률
              borderWidth: 2,  // 선 두께
              pointStyle: 'rect',  // 포인트 스타일을 사각형으로 설정
              yAxisID: 'y1',  // 첫 번째 y축
            },
            {
              label: 'CF AGV 1 평균 충전횟수',
              data: machine1ChargeAvg,  // 기계1 평균 충전횟수 데이터
              borderColor: '#e7298a',  // 선 색상 (기계 1 충전횟수)
              backgroundColor: 'rgba(231, 41, 138, 0.2)',  // 배경색
              fill: false,  // 선 아래 영역 채우지 않음
              borderDash: [5, 5],  // 점선 스타일
              tension: 0.3,  // 선의 곡률
              borderWidth: 2,  // 선 두께
              yAxisID: 'y2',  // 두 번째 y축
            },
            {
              label: 'PT AGV 2 평균 충전횟수',
              data: machine2ChargeAvg,  // 기계2 평균 충전횟수 데이터
              borderColor: '#ff6347',  // 선 색상 (기계 2 충전횟수)
              backgroundColor: 'rgba(255, 99, 71, 0.2)',  // 배경색
              fill: false,  // 선 아래 영역 채우지 않음
              borderDash: [5, 5],  // 점선 스타일
              tension: 0.3,  // 선의 곡률
              borderWidth: 2,  // 선 두께
              yAxisID: 'y2',  // 두 번째 y축
            },
            {
              label: 'HR AGV 3 평균 충전횟수',
              data: machine3ChargeAvg,  // 기계3 평균 충전횟수 데이터
              borderColor: '#d62728',  // 선 색상 (기계 3 충전횟수)
              backgroundColor: 'rgba(214, 39, 40, 0.2)',  // 배경색
              fill: false,  // 선 아래 영역 채우지 않음
              borderDash: [5, 5],  // 점선 스타일
              tension: 0.3,  // 선의 곡률
              borderWidth: 2,  // 선 두께
              yAxisID: 'y2',  // 두 번째 y축
            }
          ]
        },
        options: {
          responsive: true,  // 반응형 차트
          maintainAspectRatio: false,  // 비율 유지하지 않음 (자유롭게 크기 조정)
          scales: {
            x: {
              type: 'category',  // x축은 날짜별 카테고리
              title: {
                display: true,
                text: '날짜'
              },
              ticks: {
                maxRotation: 45,  // x축 레이블 회전
                minRotation: 45
              }
            },
            y1: {
              title: {
                display: true,
                text: '생산량'
              },
              beginAtZero: true,  // y축 0부터 시작
              ticks: {
                stepSize: 20  // 간격 설정
              }
            },
            y2: {
              position: 'right',  // 오른쪽 y축
              title: {
                display: true,
                text: '평균 충전횟수'
              },
              ticks: {
                beginAtZero: true,
                max: 10,  // 충전횟수 최대값 설정
                stepSize: 1  // 간격 설정
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
    // 월별 생산량과 평균 충전횟수를 집계하는 함수
    aggregateMonthlyData(machineData) {
      const monthlyData = {};

      // 각 날짜에 대해 기계의 생산량과 충전횟수를 월별로 집계
      for (const date in machineData) {
        const [year, month] = date.split('-');  // "YYYY-MM" 형식으로 날짜를 분리
        const monthKey = `${year}-${month}`;  // 월별 키 (예: "2023-01")

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { production: 0, charge: 0, days: 0 };
        }

        // 기계의 생산량과 충전횟수 합산
        monthlyData[monthKey].production += machineData[date].production;
        monthlyData[monthKey].charge += machineData[date].charge;
        monthlyData[monthKey].days += 1;  // 해당 월에 포함된 일수를 카운트
      }

      // 평균 충전횟수 계산
      for (const monthKey in monthlyData) {
        monthlyData[monthKey].chargeAvg = monthlyData[monthKey].charge / monthlyData[monthKey].days;
      }

      return monthlyData;
    }
  }
};
</script>

<style scoped>
#productionChart {
  width: 50%;
}
</style>
