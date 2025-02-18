<template>
  <v-dialog v-model="dialogModel" max-width="auto">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <!-- 로딩 오버레이 -->
        <v-overlay :model-value="loading" class="d-flex align-center justify-center">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <!-- 데이터 테이블 -->
        <v-data-table
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="filteredItems"
          :items-length="filteredItems.length"
          :loading="loading"
          item-value="macaddr"
        >
          <template v-slot:tfoot>
            <tr>
              <td>
                <v-text-field 
                  v-model="code" 
                  class="ma-2" 
                  density="compact" 
                  placeholder="Search"
                  hide-details
                ></v-text-field>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    title: String // 다이얼로그의 타이틀 (이걸 기준으로 데이터 필터링)
  },
  data() {
    return {
      dialogModel: this.isOpen,
      itemsPerPage: 10,
      headers: [
        { title: 'MAC Address', key: 'macaddr', align: 'center' },
        { title: 'Version', key: 'version', align: 'center' },
        { title: 'Status', key: 'status', align: 'center' },
        { title: 'IP Address', key: 'ipaddr', align: 'center' },
        { title: 'Battery (%)', key: 'battery', align: 'center' },
        { title: 'Temperature (°C)', key: 'temperature', align: 'center' },
        { title: 'Effect (%)', key: 'effect', align: 'center' },
        { title: 'Load', key: 'load', align: 'center' }
      ],
      machineData1: [], // 전체 API 데이터 저장
      filteredItems: [], // title과 일치하는 name을 가진 데이터만 저장
      code: '',
      loading: false
    };
  },
  computed: {
    dialogModel: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("update:isOpen", value);
      }
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.fetchData(); // 다이얼로그가 열릴 때 데이터 가져오기
      }
    },
    title(newTitle) {
      this.filterData(newTitle); // title 변경될 때마다 필터링 실행
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.machineData1 = [];
      this.filteredItems = [];

      try {
        const response = await fetch("http://localhost:3000/api/machines/device_info");
        const data1 = await response.json();

        if (data1 && typeof data1 === "object") {
          this.machineData1 = Object.values(data1); // 객체를 배열로 변환하여 저장
        } else {
          this.machineData1 = [];
        }

        this.filterData(this.title); // 데이터를 받은 후 필터링 실행
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
      } finally {
        this.loading = false;
      }
    },
    filterData(title) {
      if (!title || !this.machineData1.length) {
        this.filteredItems = [];
        return;
      }

      this.filteredItems = this.machineData1.filter(item => item.name === title);
    },
    closeDialog() {
      this.$emit("update:isOpen", false);
    }
  }
};
</script>
