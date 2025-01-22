<template>
    <v-data-table
        :headers="market.headers"
        :items="this.market.data"
        :items-per-page="0"
    >
        <template v-slot:bottom></template>
    </v-data-table>
</template>

<script>
import { getMarketByCurrency, getMarketTicker } from '@/shared/function'

export default {
    data () {
        return {
            market : {
                headers: [ // align key sortable title
                    { key: 'market', title: 'market' },
                    { key: 'trade_price', title: 'trade_price'}
                ],
                data : []
            },

            UPBIT_KRW_MARKET_NAME_ARRAY : [],
            marketUpdateInterval: null
        }
    },
    mounted() {
        // this.fetchData_market()
    },
    methods: {
        fetchData_market() {
            getMarketByCurrency('KRW').then(marketData => {
                const marketName = marketData.map(element => element.market).join(',')

                this.UPBIT_KRW_MARKET_NAME_ARRAY = marketName

                return getMarketTicker(this.UPBIT_KRW_MARKET_NAME_ARRAY);
            }).then(tickerData => {
                this.market.data = tickerData
            }).catch();
        }
    }
}
</script>