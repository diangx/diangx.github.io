<template>
    <v-card
        title="Nutrition"
        flat
    >
        <template v-slot:text>
            <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
            ></v-text-field>
        </template>

        <v-tabs v-model="tab">
            <v-tab value="one">Item One</v-tab>
            <v-tab value="two">Item Two</v-tab>
        </v-tabs>

        <market v-show="tab == 'one'"
            :search="search"
            ref="marketComponent"
        ></market>

        <account v-show="tab == 'two'"
            :search="search"
            ref="accountComponent"
        >
        </account>

    </v-card>
</template>

<script>
import market from './market/index.vue'
import account from './account/index.vue'

export default {
	components: {
        account,
        market
	},
    data () {
        return {
            search: '',
            tab: 'two',
        }
    },
    methods: {
        fetchData_sub(){
            this.$refs.marketComponent.fetchData_market();
            this.$refs.accountComponent.fetchData_getAccount();
        }
    }
}
</script>