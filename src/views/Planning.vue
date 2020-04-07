<template>
    <div>
        <div class="page-title">
            <h3>Планирование</h3>
            <h4>{{info.bill | currency('RUB')}}</h4>
        </div>

        <Loader v-if="loading"/>
        <p class="center"
           v-else-if="!categories.length"
        >Категорий пока нет. <router-link to="/categories">Добавить новую категорию</router-link>
        </p>
        <section v-else>
            <div v-for="cat of categories" :key="cat.id">
                <p>
                    <strong>{{cat.title}}</strong>
                    {{cat.spend | currency('RUB')}} из {{cat.limit | currency('RUB')}}
                </p>
                <div class="progress" v-tooltip="cat.tooltip">
                    <div
                            class="determinate"
                            :class="[cat.progressColor]"
                            :style="{width: cat.progressPercent + '%'}"
                    ></div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import currencyFilter from '@/filters/currency.filter';

    export default {
        name: "Planning",
        data: () => ({
           loading: true,
           categories: []
        }),
        computed: {
            ...mapGetters(['info'])
        },
        async mounted() {
            const records = await this.$store.dispatch('fetchRecords');
            const categories = await this.$store.dispatch('fetchCategories');

            //создаем массив по каждой категории
            this.categories = categories.map(cat => {
                const spend = records
                    //фильтруем массив записей по записям только этой категории
                    .filter(r => r.categoryId === cat.id)
                    //фильтруем оставшиеся записи по расходам
                    .filter(r => r.type === 'outcome')
                    //в total суммируем amount каждой записи
                    .reduce((total, record) => {
                        return total += +record.amount;
                    }, 0);

                //перерасход категории в процентах (может быть и больше 100%)
                const percent = 100 * spend / cat.limit;
                //перерасход в процентах для прогресс бара, с максимальным значением 100%
                const progressPercent = percent > 100 ? 100 : percent;
                //цвет прогресс бара
                const progressColor = percent < 60 ? 'green'
                    : percent < 100 ? 'yellow'
                        : 'red';
                const tooltipValue = cat.limit - spend;
                const tooltip = `${tooltipValue < 0 ? 'Превышение на' : 'Осталось'}
                                ${currencyFilter(Math.abs(tooltipValue))}`;

                //возвращаем итоговый переработанный объект категории
                //в нем все поля какие были + 3 новых
                return {
                    ...cat,
                    progressPercent,
                    progressColor,
                    spend,
                    tooltip
                }
            });


            this.loading = false;
        }

    }
</script>