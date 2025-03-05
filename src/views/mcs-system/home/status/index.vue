<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <div class="px-3 py-3" 
                    style="background-color: #FFF8E1; border-radius: 8px;">

                    <!-- Flex 컨테이너: 화면이 좁아지면 자동 줄바꿈 -->
                    <div class="d-flex flex-wrap align-center justify-center text-center">
                        
                        <!-- 총 로봇 수 -->
                        <div class="mx-2 my-1">
                        총 로봇 수:
                        <strong>{{ stats.totalRobots }}</strong>대
                        </div>
                        <v-divider vertical class="mx-2"></v-divider>
                        <!-- 충전 중 -->
                        <div class="mx-2 my-1">
                        충전 중:
                        <strong>{{ stats.chargingCount }}</strong>대
                        </div>
                        <v-divider vertical class="mx-2"></v-divider>
                        <!-- 가동 중 -->
                        <div class="mx-2 my-1">
                        가동 중:
                        <strong>{{ stats.runningCount }}</strong>대
                        </div>
                        <v-divider vertical class="mx-2"></v-divider>

                        <!-- 평균 배터리 -->
                        <div class="mx-2 my-1">
                        평균 배터리:
                        <strong>{{ stats.avgBattery }}%</strong>
                        </div>
                        <v-divider vertical class="mx-2"></v-divider>

                        <!-- 평균 온도 -->
                        <div class="mx-2 my-1">
                        평균 온도:
                        <strong>{{ stats.avgTemperature }}°C</strong>
                        </div>
                    </div>
                </div>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    components: {
    },
    data() {
        return {
            stats: {
                totalRobots : null,
                runningCount: null,
                chargingCount: null,
                avgBattery: null,
                avgTemperature: null
            }
        };
    },
    props: {
        status_ws_data: Object
    },
    watch: {
        status_ws_data: {
            handler(newVal) {
                this.stats = newVal
            }
        }
    }
};
</script>