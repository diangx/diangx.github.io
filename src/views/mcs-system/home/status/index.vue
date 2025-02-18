<template>
    <v-container>
        <!-- 로딩 중일 때 로딩 스피너 표시 -->
        <v-row v-if="loading">
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-col>
        </v-row>

        <!-- 데이터가 로드되면 카드 내용 표시 -->
        <v-row v-else>
            <v-col
                v-for="(item, index) in machineData"
                :key="index"
                cols="12" md="4">
                <v-card class="mx-auto">
                    <v-card-item :title="item.machine">
                        <template v-slot:subtitle>
                            <v-icon
                                class="me-1 pb-1"
                                :color="item.status == 'easy' ? 'success' : (item.status == 'normal' ? 'warning' : 'error')"
                                icon="mdi-information"
                                size="18"
                            ></v-icon>
                            {{ 
                                item.status == 'easy' ? 'Good'
                                : (item.status == 'normal' ? 'Warning' : 'Critical')
                            }}
                        </template>
                    </v-card-item>

                    <v-card-text class="py-0">
                        <v-row align="center" no-gutters>
                            <v-col class="text-h3" cols="6">
                                <v-icon icon="mdi-battery" size="30"></v-icon>
                                {{ item.energy + "%" }}
                            </v-col>

                            <v-col class="text-right" cols="5">
                                <v-card outlined>
                                    <v-img :src="img[index]"></v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <div class="d-flex py-3 justify-space-between">
                        <v-list-item density="compact" prepend-icon="mdi-temperature-celsius">
                            <v-list-item-subtitle>{{ item.temperature }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item density="compact">
                            Status : {{ item.usage > 30 ? 'transporting' : 'go to charge' }}
                        </v-list-item>
                    </div>

                    <v-expand-transition>
                        <div v-if="expanded[index]">
                            <v-list class="bg-transparent">
                                <v-list-item subtitle="Version" :title="item.version"></v-list-item>
                                <v-list-item subtitle="IP Address" :title="item.ip"></v-list-item>
                            </v-list>
                        </div>
                    </v-expand-transition>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn
                            :text="!expanded[index] ? 'Full Status' : 'Hide Status'"
                            @click="toggleExpand(index)"
                        ></v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      machineData: null, // 웹소켓으로 받은 데이터 저장
      socket: null,
      expand: false,
      expanded: {},
      img : {
        machine1 : '',
        machine2 : '',
        machine3 : ''
      }
    };
  },
  mounted() {
    this.connectWebSocket();

    this.img.machine1 = this.$images.AGV_01
    this.img.machine2 = this.$images.AGV_02
    this.img.machine3 = this.$images.AGV_03
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  },
  methods: {
    toggleExpand(index) {
        this.expanded[index] = !this.expanded[index];
    },

    connectWebSocket() {
      // 서버의 웹소켓 주소 (로컬 개발 환경 기준)
      this.socket = new WebSocket("ws://localhost:3000");

      // 메시지를 받았을 때 실행
      this.socket.onmessage = (event) => {
        try {
          this.machineData = JSON.parse(event.data);
          this.loading = false;
        } catch (error) {
          console.error("웹소켓 데이터 오류:", error);
          this.loading = false;
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
  margin-top: 20px;
}
</style>
