<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Firmware Update</v-card-title>
      <v-card-text>
        <v-text-field 
          v-model="macAddress" 
          label="Enter MAC Address" 
          placeholder="e.g., 7f:95:c9:6f:5e:10" 
        ></v-text-field>

        <v-btn color="primary" class="mt-3" :disabled="!macAddress" @click="fetchDeviceInfo">
          Get Device Info
        </v-btn>

        <v-alert v-if="deviceInfo" type="info" class="mt-4">
          <p><strong>Device:</strong> {{ deviceInfo.name }}</p>
          <p><strong>Current Version:</strong> {{ deviceInfo.version }}</p>
          <p><strong>Status:</strong> {{ deviceInfo.status }}</p>
          <p><strong>IP Address:</strong> {{ deviceInfo.ipaddr }}</p>
        </v-alert>

        <v-file-input
          v-if="deviceInfo"
          label="Select Firmware File"
          accept=".img"
          class="mt-4"
          @change="handleFileUpload"
        ></v-file-input>

        <v-btn 
          v-if="deviceInfo" 
          color="success" 
          class="mt-3" 
          :disabled="!selectedFile" 
          @click="uploadFirmware"
        >
          Upgrade Firmware
        </v-btn>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ message }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      macAddress: "",
      deviceInfo: null,
      selectedFile: null,
      snackbar: false,
      message: ""
    };
  },
  methods: {
    async fetchDeviceInfo() {
        try {
            let response;

            try {
                response = await fetch("https://definitely-handy-cow.ngrok-free.app/api/machines/device_info", {
                    headers: { 'ngrok-skip-browser-warning': '69420' }
                });
            } catch {
                response = await fetch("http://localhost:3000/api/machines/device_info");
            }

            const devices = await response.json();
            this.deviceInfo = Object.values(devices).find(device => device.macaddr === this.macAddress);

            if (!this.deviceInfo) {
                this.message = "MAC Address not found.";
                this.deviceInfo = null;
            } else {
                this.message = `Device Found: ${this.deviceInfo.name}`;
            }
        } catch {
            this.message = "Error fetching device info.";
        }

        this.snackbar = true;
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFirmware() {
        if (!this.selectedFile || !this.macAddress) {
            this.message = "Please enter a MAC Address and select a file.";
            this.snackbar = true;
            return;
        }

        const payload = {
            macAddress: this.macAddress,
            fileName: this.selectedFile.name  // **파일명만 보냄**
        };

        try {
            let response;

            try {
                response = await fetch("https://definitely-handy-cow.ngrok-free.app/api/update-firmware", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
            } catch {
                response = await fetch("http://localhost:3000/api/update-firmware", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
            }

            const result = await response.json();
            this.message = result.message;
        } catch {
            this.message = "Error updating firmware.";
        }
        
        this.snackbar = true;
    }
  }
};
</script>
