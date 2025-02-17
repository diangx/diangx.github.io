<template>
  <div class="container">
    {{ machineData }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      machineData: null, // 웹소켓으로 받은 데이터 저장
      socket: null,
    };
  },
  mounted() {
    this.connectWebSocket();
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  },
  methods: {
    connectWebSocket() {
      // 서버의 웹소켓 주소 (로컬 개발 환경 기준)
      this.socket = new WebSocket("ws://localhost:3000");

      // 메시지를 받았을 때 실행
      this.socket.onmessage = (event) => {
        try {
          this.machineData = JSON.parse(event.data);
          console.log(this.machineData)
        } catch (error) {
          console.error("웹소켓 데이터 오류:", error);
        }
      };

      // 웹소켓 연결 종료 시 재연결 시도
      this.socket.onclose = () => {
        console.log("웹소켓 연결이 종료됨, 3초 후 재연결...");
        setTimeout(() => {
          this.connectWebSocket();
        }, 3000);
      };
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
}
</style>
