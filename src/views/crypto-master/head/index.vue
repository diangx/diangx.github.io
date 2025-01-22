<template>
  <div>
    <v-row align="center" justify="center">
        <v-col cols="2">
            <v-text-field
                v-model="env.accessKey"
                label="Access Key"
            ></v-text-field>
        </v-col>
        <v-col cols="2">
            <v-text-field
                v-model="env.secretKey"
                label="Secret Key"
            ></v-text-field>
        </v-col>
        <!-- <v-col cols="4">
            <v-text-field
                v-model="serverUrl"
                label="Server URL"
            ></v-text-field>
        </v-col> -->
        <v-col cols="2">
            <v-btn block @click="submitKeys">Submit</v-btn>
        </v-col>
    </v-row>
  </div>
</template>

<script>

export default {
    data() {
        return {
            env : {
                accessKey: process.env.UPBIT_OPEN_API_ACCESS_KEY || '',
                secretKey: process.env.UPBIT_OPEN_API_SECRET_KEY || '',
                serverUrl: process.env.UPBIT_OPEN_API_SERVER_URL || '',
            },

            apiResponse: null
        };
    },
    methods: {
        submitKeys() {
            localStorage.setItem("env", JSON.stringify(this.env));
            this.$emit('account-updated');
        },
    },
};
</script>