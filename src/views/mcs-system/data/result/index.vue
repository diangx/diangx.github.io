<template>
  <v-container>
    <!-- 전역 로딩 오버레이 -->
    <v-overlay :model-value="loading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="filteredItems"
      :items-length="filteredItems.length"
      :loading="loading || searching"
      item-value="code"
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
  </v-container>
</template>

<script>
export default {
  data: () => ({
    itemsPerPage: 10,
    headers: [
      { title: 'Code', align: 'center', sortable: false, key: 'code' },
      { title: 'Date', key: 'date', align: 'center' },
      { title: 'Distance(m)', key: 'distance', align: 'center' },
      { title: 'Estimated Time(sec)', key: 'est_time', align: 'center' },
      { title: 'Device', key: 'name', align: 'center' },
      { title: 'MAC', key: 'macaddress', align: 'center' }
    ],
    machineData1: [],
    filteredItems: [],
    code: '',
    loading: false,
    searching: false,
    searchTimeout: null
  }),
  watch: {
    code() {
      this.searching = true;
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.filterItems();
        this.searching = false;
      }, 1000); // 입력 후 300ms 동안 추가 입력 없으면 실행
    }
  },
  methods: {
    filterItems() {
      if (!this.code) {
        this.filteredItems = this.machineData1;
      } else {
        this.filteredItems = this.machineData1.filter(item => 
          item.code.toLowerCase().includes(this.code.toLowerCase())
        );
      }
    },
    preventNavigation(event) {
      if (this.loading) {
        event.preventDefault();
        event.returnValue = ''; // 일부 브라우저에서는 필요
      }
    }
  },
  async mounted() {
      this.loading = true;
      window.addEventListener("beforeunload", this.preventNavigation); // 페이지 나가기 방지

      try {
          let response;

          try {
              response = await fetch("https://definitely-handy-cow.ngrok-free.app/api/machines/product_info", {
                  headers: { 'ngrok-skip-browser-warning': '69420' }
              });
          } catch {
              response = await fetch("http://localhost:3000/api/machines/product_info");
          }

          const data1 = await response.json();

          if (data1 && typeof data1 === "object") {
              this.machineData1 = Object.keys(data1).reduce((acc, key) => acc.concat(data1[key]), []);
          } else {
              this.machineData1 = [];
          }

          this.filteredItems = this.machineData1; // 초기값 설정
      } catch {
          this.machineData1 = [];
      } finally {
          this.loading = false;
          window.removeEventListener("beforeunload", this.preventNavigation); // 로딩 끝나면 해제
      }
  }
};
</script>
