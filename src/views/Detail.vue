<template>
    <Loader v-if="loading" />
    <div v-else-if="record">
        <div>
            <div class="breadcrumb-wrap">
                <router-link to="/history" class="breadcrumb">{{'Sidebar_History'|localize}}</router-link>
                <a class="breadcrumb">
                    {{record.type|localize}}
                </a>
            </div>
            <div class="row">
                <div class="col s12 m6">
                    <div class="card"
                        :class="{'red': record.type === 'outcome',
                                'green': record.type === 'income'}
                    ">
                        <div class="card-content white-text">
                            <p>{{'Description'|localize}}: {{record.description}}</p>
                            <p>{{'Amount'|localize}}: {{record.amount | currency('RUB')}}</p>
                            <p>{{'Category'|localize}}: {{record.categoryName}}</p>

                            <small>{{record.date | date('datetime')}}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p class="center" v-else>Запись не найдена</p>
</template>

<script>
    export default {
        name: 'Detail',
        metaInfo() {
            return {
                title: this.$title('Record')
            }
        },
        data: () => ({
            record: null,
            loading: true
        }),
        async mounted() {
            try {
                const id = this.$route.params.id;
                const record = await this.$store.dispatch('fetchRecordById', id);
                const category = await this.$store.dispatch('fetchCategoryById', record.categoryId);
                this.record = {
                    ...record,
                    categoryName: category.title
                };

                this.loading = false;
            } catch(e) {
                this.$error('Что-то пошло не так');
            }
        }
    }
</script>