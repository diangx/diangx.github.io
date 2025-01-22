<template>
    <v-data-table
        :headers="myaccount.headers"
        :items="this.myaccount.data"
        :items-per-page="0"
    >
        <template v-slot:bottom></template>
    </v-data-table>
</template>

<script>
import { getAccount } from '@/shared/function'

export default {
    data () {
        return {
            myaccount : {
                headers: [
                    { key: 'currency' },
                    { key: 'balance', title: 'balance' },
                    { key: 'avg_buy_price', title: 'avg_buy_price' }
                ],
                data : []
            }
        }
    },
    mounted() {
        // this.fetchData_getAccount()
    },
    methods: {
        fetchData_getAccount(){
            getAccount().then((resp)=>{
                // if(process.env.NODE_ENV == 'development') console.log(resp)
                this.myaccount.data = resp
            }).catch();
        }
    }
}
</script>