<template>
  <div>
    <v-layout class="overflow-visible" style="height: 56px;">
      <v-bottom-navigation v-model="value" color="orange" grow style="bottom: unset;">
        <v-btn :value="1" @click="toggleView(1)">
          <v-icon>mdi-home</v-icon>
          Home
        </v-btn>
        <v-btn :value="2" @click="toggleView(2)">
          <v-icon>mdi-history</v-icon>
          Data
        </v-btn>
        <v-btn :value="3" @click="toggleView(3)">
          <v-icon>mdi-cog</v-icon>
          Upgrade
        </v-btn>
      </v-bottom-navigation>
    </v-layout>

      <div v-if="value === 1">
        <statusData :status_ws_data="status_ws_data" />
        <v-divider/>
        <chartData />
      </div>
  
      <div v-if="value === 2">
        <resultData></resultData>
      </div>
  
      <div v-show="value === 3">
        <upgradePage></upgradePage>
      </div>
  </div>
</template>

<script>
// HOME
import statusData from './home/status/index.vue'
import chartData from './home/chart/index.vue'
// import factoryData from './home/factory/index.vue'

// DATA
import resultData from './data/result/index.vue'

// DATA
import upgradePage from './upgrade/index.vue'

export default {
  components: {
    statusData,
    chartData,
    // factoryData,
    resultData,
    upgradePage
  },
  data() {
    return {
      value: 1,
      status_ws_data: null
    };
  },
  mounted() {
    this.connectWebSocket();
  },
  beforeUnmount() {
    if (window.socket) {
      window.socket.onclose = null; // 재연결 방지
      window.socket.close();
      window.socket = null;
    }
  },
  methods: {
    toggleView(selectedValue) {
      this.value = selectedValue;
    },
    connectWebSocket() {
        if (window.socket && window.socket.readyState === WebSocket.OPEN) {
            return;
        }

        let wsUrl = "wss://definitely-handy-cow.ngrok-free.app";

        try {
            window.socket = new WebSocket(wsUrl);
        } catch {
            wsUrl = "ws://localhost:3000";
            window.socket = new WebSocket(wsUrl);
        }

        window.socket.onopen = () => {};

        window.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.status_ws_data = data.status;
            } catch {}
        };

        window.socket.onclose = () => {
            setTimeout(() => {
                this.connectWebSocket();
            }, 3000);
        };
    }
  }
};
</script>