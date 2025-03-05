<template>
  <div class="d-flex flex-column align-center">
    
    <!-- MAC 주소 검색 입력 필드 -->
    <div class="d-flex align-center mb-4" style="width: 95%; max-width: 500px;">
      <v-text-field
        v-model="searchMac"
        label="🔍 MAC 주소 검색"
        placeholder="MAC 주소 입력..."
        variant="outlined"
        clearable
        class="flex-grow-1 mr-2"
        style="height: 44px; border-radius: 8px;"
      ></v-text-field>

      <v-btn
        color="primary"
        variant="flat"
        style="min-width: 100px; height: 44px;"
        @click="searchByMac"
      >
        <v-icon left>mdi-magnify</v-icon> 찾기
      </v-btn>
    </div>

    <!-- 카드 그룹 -->
    <v-slide-group
      v-model="model"
      class="pa-2"
      selected-class="bg-secondary"
      show-arrows
      style="max-width: 100%;"
    >
      <v-slide-group-item
        v-for="item in device_data"
        :key="item.macaddr"
        v-slot="{ isSelected, toggle, selectedClass }"
        :value="item.macaddr"
      >
        <v-card
          :class="['ma-1', selectedClass, 'position-relative']"
          color="orange-lighten-5"
          :width="$vuetify.display.smAndDown ? 100 : 150"
          :height="$vuetify.display.smAndDown ? 180 : 220"
          @click="selectItem(item)"
        >
          <!-- 카드 내용 -->
          <div class="d-flex flex-column fill-height align-center justify-center text-center">
            <v-img
              :src="getImage(item.name)"
              :width="$vuetify.display.smAndDown ? 60 : 80"
              :height="$vuetify.display.smAndDown ? 60 : 80"
              class="rounded-circle mb-2"
            ></v-img>

            <div :class="$vuetify.display.smAndDown ? 'text-body-2' : 'text-body-1'">
              {{ item.name }}
            </div>
            <div :class="$vuetify.display.smAndDown ? 'text-caption' : 'text-body-2'"
                 class="text-grey-darken-2">
              {{ item.macaddr }}
            </div>
          </div>

          <!-- 선택된 경우 중앙 아이콘 -->
          <v-scale-transition>
            <v-icon
              v-if="isSelected"
              class="position-absolute"
              style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
              color="white"
              icon="mdi-check-circle-outline"
              size="48"
            ></v-icon>
          </v-scale-transition>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>

    <!-- 선택된 아이템 정보 표시 -->
    <v-expand-transition>
      <v-sheet v-if="selectedItem" class="pa-4" width="100%">
        <v-container fluid>
          <v-row justify="center">
            <v-col cols="12" md="5">
              <v-table dense>
                <tbody>
                  <tr><td class="font-weight-bold">이름</td><td>{{ selectedItem.id }}</td></tr>
                  <tr><td class="font-weight-bold">모델명</td><td>{{ selectedItem.name }}</td></tr>
                  <tr><td class="font-weight-bold">버전</td><td>{{ selectedItem.version }}</td></tr>
                  <tr><td class="font-weight-bold">MAC 주소</td><td>{{ selectedItem.macaddr }}</td></tr>
                </tbody>
              </v-table>
            </v-col>

            <!-- 두 번째 테이블 (배터리 및 기타 정보) -->
            <v-col cols="12" md="5">
              <v-table dense>
                <tbody>
                  <tr>
                    <td class="font-weight-bold">배터리 상태</td>
                    <td>
                      <v-progress-linear
                        :model-value="selectedItem.battery"
                        :color="selectedItem.battery > 50 ? 'green' : 'red'"
                        height="20"
                        rounded
                      >
                        <template v-slot:default>
                          <strong>{{ selectedItem.battery }}%</strong>
                        </template>
                      </v-progress-linear>
                    </td>
                  </tr>
                  <tr><td class="font-weight-bold">온도</td><td>{{ selectedItem.temperature }} °C</td></tr>
                  <tr>
                    <td class="font-weight-bold">현재 위치</td>
                    <td>({{ selectedItem?.location?.x ?? 'N/A' }}, {{ selectedItem?.location?.y ?? 'N/A' }})</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">이전 위치</td>
                    <td>({{ selectedItem?.previousLocation?.x ?? 'N/A' }}, {{ selectedItem?.previousLocation?.y ?? 'N/A' }})</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">픽업 위치</td>
                    <td>({{ selectedItem?.currentPickupLocation?.x ?? 'N/A' }}, {{ selectedItem?.currentPickupLocation?.y ?? 'N/A' }})</td>
                  </tr>
                  <tr><td class="font-weight-bold">충전 중</td><td>{{ selectedItem.charging ? '예' : '아니오' }}</td></tr>
                  <tr><td class="font-weight-bold">제품 운반 중</td><td>{{ selectedItem.carryingProduct ? '예' : '아니오' }}</td></tr>
                  <tr><td class="font-weight-bold">픽업 당시 배터리</td><td>{{ selectedItem.batteryAtPickup }}%</td></tr>
                  <tr><td class="font-weight-bold">픽업 시작 시간</td><td>{{ new Date(selectedItem.pickupStartTime).toLocaleString() }}</td></tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: null,        // 선택된 아이템의 macaddr을 저장
      selectedItem: null, // 선택된 아이템 정보 저장
      searchMac: "",      // 검색 입력 값
      device_data: {},    // 기존 배열에서 객체로 변경 (초기 상태)
    };
  },

  props: {
    status_data: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    selectItem(item) {
      this.model = item.macaddr;
      this.selectedItem = item;
    },

    searchByMac() {
      if (!this.searchMac.trim()) {
        alert("MAC 주소를 입력하세요!");
        return;
      }

      const deviceArray = Object.values(this.device_data);
      const foundItem = deviceArray.find(device => device.macaddr === this.searchMac.trim());

      if (foundItem) {
        this.selectItem(foundItem);
      } else {
        alert("해당 MAC 주소를 가진 로봇이 없습니다.");
      }
    },
    getImage(name) {
      if (name === "Counter-Balance Forklift Type AGV") {
        return this.$images.AGV_01;
      } else if (name === "Pallet Truck Type AGV") {
        return this.$images.AGV_02;
      } else if (name === "High-mast Reach Forklift Type AGV") {
        return this.$images.AGV_03;
      }
      return this.$images.AGV_01;
    }
  },


  watch: {
    status_data: {
      deep: true,
      handler(newData) {
        if (newData && Object.keys(newData).length > 0) {
          this.device_data = newData;  // 새로운 데이터 저장

          const deviceArray = Object.values(this.device_data);

          // 현재 선택된 macaddr에 해당하는 아이템 찾기
          const updatedItem = deviceArray.find(device => device.macaddr === this.model);
          if (updatedItem) {
            this.selectedItem = updatedItem;
          } else {
            this.selectedItem = null;
          }
        }
      }
    }
  }
};
</script>
