import _ from 'lodash'

export default {
    data() {
        return {
            page: +this.$route.query.page || 1,
            pageSize: 5,
            pageCount: 0,
            allItems: [],
            items: []
        }
    },
    watch: {
        $route(to) {
            if(!to.query.page) {
                this.page = 1;
                this.pageChangeHandler(1);
            }
        }
    },
    methods: {
        setupPagination(allItems) {
            //chunk из массива создаем массив массивов,
            // с указанным кол-вом эл-ов в каждом подмассиве
            this.allItems = _.chunk(allItems, this.pageSize);
            this.pageCount = _.size(this.allItems);
            this.items = this.allItems[this.page - 1] || this.allItems[0];
        },
        pageChangeHandler(page) {
            this.$router.push(`${this.$route.path}?page=${page}`);
            this.items = this.allItems[page - 1] || this.allItems[0];
        }
    }
}