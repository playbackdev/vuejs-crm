<template>
    <div>
        <div class="page-title">
            <h3>Категории</h3>
        </div>
        <section>
            <Loader v-if="loading" />
            <div class="row" v-else>

                <CategoryCreate
                        @created="addNewCategory"
                />

                <!--ЛАФЙХАК: При изменении ключа перерисовывается весь компонент.
                это нужно для того, чтобы перерисовать поле селект в форме
                изменения категории, т. к.  при изменении наименования категории
                в поле селекта не перерисовывается название-->
                <CategoryEdit
                        v-if="categories.length"
                    :categories="categories"
                    :key="categories.length + updateCount"
                    @updated="updateCategories"
                />
                <p v-else class="center">Категорий пока нет</p>

            </div>
        </section>
    </div>
</template>

<script>
    import CategoryCreate from '@/components/CategoryCreate';
    import CategoryEdit from '@/components/CategoryEdit';
    import Loader from '@/components/app/Loader';

    export default {
        name: "Categories",
        data: () => ({
            categories: [],
            loading: true,
            updateCount: 0
        }),
        async mounted() {
            this.categories = await this.$store.dispatch('fetchCategories');
            this.loading = false;
            console.log(this.categories);
        },
        methods: {
            addNewCategory(category) {
              this.categories.push(category);
            },
            updateCategories(category) {
              const idx = this.categories.findIndex(c => c.id === category.id);
              this.categories[idx].title = category.title;
              this.categories[idx].limit = category.limit;
              this.updateCount ++;
            }
        },
        components: {
            CategoryCreate, CategoryEdit, Loader
        }
    }
</script>

<style scoped>

</style>