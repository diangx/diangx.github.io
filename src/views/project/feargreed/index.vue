<template>
    <b-container fluid>
        <b-row class="justify-content-center">
            <b-col cols="12" md="6" class="text-center p-4">
                <h4 class="mb-4">{{ "Crypto Fear & Greed Index" }}</h4>
                    <b-progress :max="max" height="1.75rem" animated class="mb-2">
                        <b-progress-bar variant="info"    :value="values[0]" />
                        <b-progress-bar variant="success" :value="values[1]" />
                        <b-progress-bar variant="warning" :value="values[2]" />
                        <b-progress-bar variant="danger"  :value="values[3]" />
                    </b-progress>
                <p class="h3 fw-bold mb-0"> Now: {{ totalPercent }}% </p>
            </b-col>
        </b-row>

        <div class="text-center p-4 mx-auto w-100 w-md-50">
            <b-table
                :items="items"
                :fields="fields"
                responsive
                stacked="sm"
            />
        </div>
    </b-container>
</template>

<script>
export default {
    name: 'FngProgressWithTitle',
    data() {
        return {
            max: 100,
            values: [25, 25, 25, 10],
            items: [
                {
                    heading1: 'table cell',
                    heading2: 'table cell',
                    heading3: 'table cell',
                    heading4: 'table cell',
                    heading5: 'table cell',
                    heading6: 'table cell',
                    heading7: 'table cell',
                    heading8: 'table cell',
                    heading9: 'table cell',
                    heading10: 'table cell'
                }
            ],
            fields: [
                { key: 'heading1', label: '1일전' },
                { key: 'heading2', label: '2일전' },
                { key: 'heading3', label: '3일전' },
                { key: 'heading4', label: '4일전' },
                { key: 'heading5', label: '5일전' },
                { key: 'heading6', label: '6일전' },
                { key: 'heading7', label: '7일전' },
                { key: 'heading8', label: '8일전' },
                { key: 'heading9', label: '9일전' },
                { key: 'heading10', label: '10일전' }
            ]
        }
    },
    computed: {
        totalPercent() {
            return this.values.reduce((sum, v) => sum + v, 0)
        }
    }
}
</script>
