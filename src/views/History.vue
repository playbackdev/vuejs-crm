<template>
    <div>
        <div class="page-title">
            <h3>{{'History_PageTitle'|localize}}</h3>
        </div>


        <Loader v-if="loading" />
        <p class="center" v-else-if="!records.length">
            {{'NoRecordsMessage'|localize}}
            <router-link to="/record">{{'AddRecord'|localize}}</router-link>
        </p>
        <section v-else>
            <div class="history-chart">
                <canvas ref="canvas"></canvas>
            </div>
            <HistoryTable :records="items" :page="page" :pageSize="pageSize"/>
            <Paginate class="center"
                      v-model="page"
                      :page-count="pageCount"
                      :click-handler="pageChangeHandler"
                      :prev-text="'Prev'|localize"
                      :next-text="'Next'|localize"
                      :container-class="'pagination'"
                      :page-class="'waves-effect'"
            />
        </section>


    </div>
</template>

<script>
    import HistoryTable from "@/components/HistoryTable";
    import paginationMixin from '@/mixins/pagination.mixin';
    import {Pie} from 'vue-chartjs'

    export default {
        name: 'History',
        extends: Pie,
        mixins: [paginationMixin],
        data: () => ({
            loading: true,
            records: []
        }),
        metaInfo() {
            return {
                title: this.$title('Sidebar_History')
            }
        },
        methods: {
            async setup() {
                this.records = await this.$store.dispatch('fetchRecords');
                const categories = await this.$store.dispatch('fetchCategories');
                //формируем нужный массив объектов и передаем в функцию миксина
                this.setupPagination(this.records.map(record => {
                    return {
                        ...record,
                        categoryName: categories
                            .find(c => c.id === record.categoryId)
                            .title,
                        typeClass: record.type === 'income' ? 'green' : 'red',
                        typeText: record.type,
                    }
                }));

                this.renderChart({
                    labels: categories.map(c => c.title),
                    datasets: [{
                        label: 'Расходы по категориям',
                        data: categories.map(c => {
                            return this.records.reduce((total, r) => {
                                if(r.categoryId == c.id && r.type === 'outcome') {
                                    total += +r.amount;
                                }
                                return total;
                            }, 0)
                        }),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                });
            }
        },
        async mounted() {

            this.setup();

            this.loading = false;

        },
        components: {
            HistoryTable
        }
    }
</script>