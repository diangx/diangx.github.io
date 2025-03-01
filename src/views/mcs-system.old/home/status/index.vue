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
                <v-card class="mx-auto" link @click="openDialog(item.name)">
                    <v-card-item :title="item.name">
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
                                <!-- <v-icon icon="mdi-battery" size="30"></v-icon> -->
                                {{ item.avgEffect }}
                            </v-col>

                            <v-col class="text-right" cols="5">
                                <v-card outlined>
                                    <v-img :src="item.img"></v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <div class="d-flex py-3 justify-space-between">
                        <v-list-item density="compact" prepend-icon="mdi-temperature-celsius">
                            <v-list-item-subtitle>{{ item.avgTemperature }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item density="compact" prepend-icon="mdi-run-fast">
                            <v-list-item-subtitle>{{ item.avgLoad }} % </v-list-item-subtitle>
                        </v-list-item>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        
        <DialogDetails 
            :isOpen="isDialogOpen" 
            :title="dialogTitle" 
            @update:isOpen="isDialogOpen = $event" 
        />
    </v-container>
</template>

<script>
import DialogDetails from "./dialog.vue"; // 다이얼로그 컴포넌트 불러오기

export default {
  components: {
    DialogDetails
  },
  data() {
    return {
        loading: true,
        machineData: null,
        socket: null,
        isDialogOpen: false,
        dialogTitle: "" // 다이얼로그 제목을 저장하는 변수
    };
  },
    beforeUnmount() {
        if (this.socket) {
            this.socket.close();
        }
    },
    props: {
        status_ws_data: Object // WebSocket 데이터를 부모에서 받아옴
    },
    watch: {
        status_ws_data: {
            handler(newVal) {

            if (newVal && newVal.response) {
                this.machineData = newVal.response.map(machine => {
                const totalScore = parseFloat(machine.avgEffect) + parseFloat(machine.avgTemperature) + parseFloat(machine.avgLoad);

                let status = "easy";
                if (totalScore >= 200) {
                    status = "easy";
                } else if (totalScore >= 150) {
                    status = "normal";
                } else if (totalScore >= 100) {
                    status = "hard";
                }

                let imgSrc = null;
                if (machine.name === "Counter-Balance Forklift Type AGV") {
                    imgSrc = this.$images.AGV_01;
                } else if (machine.name === "Pallet Truck Type AGV") {
                    imgSrc = this.$images.AGV_02;
                } else if (machine.name === "High-mast Reach Forklift Type AGV") {
                    imgSrc = this.$images.AGV_03;
                }

                return {
                    ...machine,
                    img: imgSrc,
                    status: status
                };
                });

                this.loading = false;
            }
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        toggleExpand(index) {
            this.expanded[index] = !this.expanded[index];
        },
        openDialog(title) {
            this.dialogTitle = title;  // 다이얼로그 제목 설정
            this.isDialogOpen = true;  // 다이얼로그 열기
        }
    },
};
</script>

<style scoped>
.container {
  margin-top: 20px;
}
</style>
