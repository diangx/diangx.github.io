<template>
  <v-container>
    <!-- 검색 필드 -->
    <v-text-field 
      v-model="search"
      class="ma-2"
      density="compact"
      placeholder="Search Code"
      hide-details
      append-inner-icon="mdi-magnify"
      clearable
      @update:modelValue="fetchData"
    ></v-text-field>

    <!-- 데이터 테이블 -->
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="machineData"
      :items-length="totalItems"
      :loading="loading"
      v-model:sort-by="sortBy"
      item-value="code"
      @update:sort-by="fetchData"
    >
      <!-- 로딩 표시 -->
      <template v-slot:loading>
        <v-progress-circular indeterminate></v-progress-circular>
      </template>

      <!-- 데이터가 없을 때 -->
      <template v-slot:no-data>
        <v-alert type="warning">No data found.</v-alert>
      </template>
    </v-data-table>

    <!-- 페이지네이션 -->
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="10"
      @update:modelValue="fetchData"
      class="mt-4"
    ></v-pagination>
  </v-container>
</template>

<script>
import { HTTP_URL } from "@/shared/config";

export default {
  data: () => ({
    itemsPerPage: 25, // 페이지당 항목 수
    currentPage: 1, // 현재 페이지
    totalPages: 1, // 총 페이지 수
    totalItems: 0, // 전체 데이터 개수
    search: "", // 검색어
    loading: false, // 로딩 상태
    sortBy: [{ key: "date", order: "desc" }], // 초기 정렬 기준
    headers: [
      { title: "Code", align: "center", key: "code", sortable: false },
      { title: "Date", key: "date", align: "center", sortable: false },
      { title: "Distance(m)", key: "distance", align: "center", sortable: false },
      { title: "Estimated Time(sec)", key: "est_time", align: "center", sortable: false },
      { title: "Energy Used", key: "energy_used", align: "center", sortable: false },
      { title: "Device", key: "name", align: "center", sortable: false },
      { title: "MAC", key: "macaddr", align: "center", sortable: false }
    ],
    machineData: [],
  }),
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        let url = `${HTTP_URL}/api/warehouse?page=${this.currentPage}&limit=${this.itemsPerPage}`;
        
        if (this.search) {
          url += `&search=${encodeURIComponent(this.search)}`;
        }

        const response = await fetch(url, {
          headers: { "ngrok-skip-browser-warning": "69420" },
        });

        const respdata = await response.json();
        this.machineData = respdata.data || [];
        this.totalPages = respdata.totalPages;
        this.totalItems = respdata.totalItems;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.machineData = [];
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    await this.fetchData();
  },
};
</script>
