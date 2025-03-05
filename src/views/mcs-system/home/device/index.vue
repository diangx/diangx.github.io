<template>
    <v-container>
        <v-row justify="center" class="mt-4">
            <v-col cols="12" md="8">
                <v-card class="pa-4" elevation="2">
                    <h2 class="mb-4 text-h5">실시간 로봇 위치</h2>

                    <canvas
                        ref="myCanvas"
                        :width="canvasWidth"
                        :height="canvasHeight"
                        style="border: 1px solid #ccc; width: 100%; height: auto;"
                    ></canvas>

                    <v-row justify="center" class="mt-2">
                        <v-col cols="12">
                            <v-card class="pa-2" elevation="2">
                            <v-row align="center" justify="space-around">
                                <v-col cols="4" class="d-flex align-center justify-center">
                                    <v-avatar size="16" color="blue"></v-avatar>
                                    <span class="ml-2">창고</span>
                                </v-col>
                                <v-col cols="4" class="d-flex align-center justify-center">
                                    <v-avatar size="16" color="green"></v-avatar>
                                    <span class="ml-2">충전소</span>
                                </v-col>
                                <v-col cols="4" class="d-flex align-center justify-center">
                                    <v-avatar size="16" color="red"></v-avatar>
                                    <span class="ml-2">로봇</span>
                                </v-col>
                            </v-row>
                            </v-card>
                        </v-col>
                    </v-row>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "RobotLocationsCanvas",

    props: {
        status_data: {
            type: Object,
            default: () => ({})  // **빈 객체로 기본값 설정하여 에러 방지**
        }
    },

    data() {
        return {
            canvasWidth: 600,
            canvasHeight: 400,
            warehouse: { x: 300, y: 200 }, // 창고 위치 (고정)
            chargehouse: { x: 300, y: 350 }, // 창고 위치 (고정)
            robots: {}, // 로봇들의 현재 위치 저장
            animationFrame: null
        };
    },

    mounted() {
        this.initializeRobots();
        this.updatePositions();
    },


    beforeDestroy() {
        cancelAnimationFrame(this.animationFrame);
    },

    watch: {
        // status_data가 변경되면 로봇 목표 위치 업데이트
        status_data: {
            deep: true,
            handler(newData) {
                if (newData && Object.keys(newData).length > 0) { // **newData가 존재하는지 확인 후 실행**
                    this.smoothMove(newData);
                }
            }
        }
    },

    methods: {
        // 초기 로봇 설정 (기본 위치)
        initializeRobots() {
            Object.keys(this.status_data || {}).forEach(key => { // **빈 객체라도 처리 가능하도록 수정**
                this.robots[key] = {
                x: Math.random() * this.canvasWidth,
                y: Math.random() * this.canvasHeight,
                target: this.status_data[key]?.location || { x: 300, y: 200 } // 기본 목표는 창고
                };
            });
        },

        // 부드러운 이동 (Lerp 적용)
        lerp(start, end, t) {
            return start + (end - start) * t;
        },

        // status_data 변경 시, 로봇 목표 위치 갱신
        smoothMove(newData) {
            Object.keys(newData || {}).forEach(key => { // **newData가 null이면 빈 객체로 처리**
                if (!this.robots[key]) {
                    this.robots[key] = { x: 300, y: 200, target: newData[key].location };
                }
                this.robots[key].target = newData[key].location;
            });

            this.updatePositions();
        },

        // 로봇 부드러운 이동 애니메이션
        updatePositions() {
            this.animationFrame = requestAnimationFrame(this.updatePositions);
            let hasMovement = false;
            const speed = 0.1; // 이동 속도 조절

            Object.keys(this.robots).forEach(key => {
                let robot = this.robots[key];
                robot.x = this.lerp(robot.x, robot.target.x, speed);
                robot.y = this.lerp(robot.y, robot.target.y, speed);

                if (Math.abs(robot.x - robot.target.x) > 1 || Math.abs(robot.y - robot.target.y) > 1) {
                    hasMovement = true;
                }
            });

            this.drawCanvas();
            if (!hasMovement) cancelAnimationFrame(this.animationFrame);
        },

        // 캔버스에 로봇과 창고 그리기
        drawCanvas() {
            const canvas = this.$refs.myCanvas;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

            // 창고 위치 (파란색 네모)
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.warehouse.x - 10, this.warehouse.y - 10, 20, 20); // 20x20 크기의 정사각형

            // 충전소 위치 (초록색 네모)
            ctx.fillStyle = 'green';
            ctx.fillRect(this.chargehouse.x - 10, this.chargehouse.y - 10, 20, 20); // 20x20 크기의 정사각형

            // 로봇 위치 (빨간색)
            ctx.fillStyle = 'red';
            Object.values(this.robots).forEach(robot => {
                ctx.beginPath();
                ctx.arc(robot.x, robot.y, 5, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
};
</script>

<style scoped>
    canvas {
        background-color: white;
    }
</style>
