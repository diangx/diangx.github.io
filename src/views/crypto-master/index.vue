<template>
    <v-layout ref="app" class="rounded rounded-md">
        <v-app-bar 
            color="grey-lighten-2" 
            name="app-bar">
            <!-- <v-btn class="mx-auto" @click="print('app-bar')">Get data</v-btn> -->
            <headerData @account-updated="handleSubUpdate" class="w-100" ></headerData>
        </v-app-bar>

        <v-main 
            class="d-flex align-center justify-center" 
            style="w-auto">
                Main Content
        </v-main>

        <v-navigation-drawer
            color="grey-darken-2"
            location="end"
            name="drawer"
            permanent
            class="w-25"
        >
            <div class="d-flex justify-center align-center fill-height">
                <subInfo ref="subInfoRef" class="overflow-auto fill-height w-100"></subInfo>
            </div>
        </v-navigation-drawer>

        <v-footer
        name="footer"
        app
        >
        <v-btn
            class="mx-auto"
            variant="text"
            @click="print('footer')"
        >
            Get data
        </v-btn>
        </v-footer>
    </v-layout>
</template>

<script>
// HEADER
import headerData from './head/index.vue'

// MAIN

// SUB
import subInfo from './sub/index.vue'

export default {
	components: {
        subInfo,
        headerData
	},
    methods: {
        print (key) {
            alert(JSON.stringify(this.$refs.app.getLayoutItem(key), null, 2))
        },
        handleSubUpdate() {
            console.log("HEADER KEY INIT & SUB UPDATE")
            this.$refs.subInfoRef.fetchData_sub()
        },
    },
}
</script>