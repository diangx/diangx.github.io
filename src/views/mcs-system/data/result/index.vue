<template>
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="filteredItems"
    :items-length="filteredItems.length"
    :loading="loading"
    item-value="code"
  >
    <template v-slot:tfoot>
      <tr>
        <td>
          <v-text-field v-model="code" class="ma-2" density="compact" placeholder="Search" hide-details></v-text-field>
        </td>
      </tr>
    </template>
  </v-data-table>
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
      { title: 'Device', key: 'device', align: 'center' }
    ],
    machineData1: [],
    code: '',
    loading: false,
  }),
  computed: {
    filteredItems() {
      return this.machineData1.filter(item => {
        return !this.code || item.code.toLowerCase().includes(this.code.toLowerCase());
      });
    }
  },
  async mounted() {
    this.loading = true
    try {
      const [response1, response2, response3] = await Promise.all([
        fetch('http://localhost:3000/api/machine1_History'),
        fetch('http://localhost:3000/api/machine2_History'),
        fetch('http://localhost:3000/api/machine3_History')
      ]);
      
      const data1 = await response1.json();
      const data2 = await response2.json();
      const data3 = await response3.json();

      this.loading = false
      
      this.machineData1 = [...data1, ...data2, ...data3].map(item => ({
        ...item,
        device: item.device === 'machine1' ? 'CF AGV' : item.device === 'machine2' ? 'PT AGV' : 'HRF AGV'

      })).sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('데이터를 불러오는 데 실패했습니다:', error);
      this.loading = false
    }
  }
};
</script>
