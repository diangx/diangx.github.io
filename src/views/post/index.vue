<template>
    <div 
        class="d-flex justify-content-center align-items-start pt-4" 
        style="min-height: 100vh;"
    >
        <div class="row w-100 justify-content-center no-gutters">
            <div class="col-12 col-md-7">
                <b-card no-body class="overflow-hidden w-100">
                    <b-row no-gutters>
                        <b-col cols="12" md="4">
                            <b-card-img
                                :src="macFilterSrc"
                                alt="MAC Filter"
                                class="rounded-5"
                            />
                        </b-col>
                        
                        <b-col cols="12" md="8">
                            <b-card-body title="WIRELESS MAC-FILTERING DEBUG">
                                <b-card-text>
                                    This is a wider card with supporting text as a natural lead-in to additional content.
                                    This content is a little bit longer.
                                </b-card-text>
                            </b-card-body>
                        </b-col>
                    </b-row>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
import macFilter from '@/assets/img/mac_filter.png'

export default {
    data() {
        return {
            macFilterSrc: macFilter
        }
    }
}
</script>
