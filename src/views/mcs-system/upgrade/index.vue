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
          <p><strong>ID:</strong> {{ deviceInfo.id }}</p>
          <p><strong>Device:</strong> {{ deviceInfo.name }}</p>
          <p><strong>Battery:</strong> {{ deviceInfo.battery }}</p>
          <p><strong>Current Version:</strong> {{ deviceInfo.version }}</p>
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
import { HTTP_URL } from "@/shared/config";

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
    async fetchDeviceInfo(init) {
        try {
            let response = await fetch(`${HTTP_URL}/api/robots`);

            const devices = await response.json();
            this.deviceInfo = Object.values(devices).find(device => device.macaddr === this.macAddress);

            console.log(this.deviceInfo)

            if(init) {
              return;
            }
            else if (!this.deviceInfo) {
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
            let response = await fetch(`${HTTP_URL}/api/update-firmware`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            this.message = result.message;

            this.fetchDeviceInfo(this.macAddress)
        } catch {
            this.message = "Error updating firmware.";
        }
        
        this.snackbar = true;
    }
  }
};
</script>
