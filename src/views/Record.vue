<template>
    <div>
        <div class="page-title">
            <h3>Новая запись</h3>
        </div>

        <Loader v-if="loading" />

        <p class="center"
           v-else-if="!categories.length"
        >Категорий пока нет. <router-link to="/categories">Добавить новую категорию</router-link>
        </p>

        <form class="form" v-else @submit.prevent="submitHandler">
            <div class="input-field" >
                <select ref="select" v-model="currentCategory">
                    <option
                            v-for="c of categories"
                            :key="c.id"
                            :value="c.id"
                    >{{c.title}}</option>
                </select>
                <label>Выберите категорию</label>
            </div>

            <p>
                <label>
                    <input
                            class="with-gap"
                            name="type"
                            type="radio"
                            value="income"
                            v-model="type"
                    />
                    <span>Доход</span>
                </label>
            </p>

            <p>
                <label>
                    <input
                            class="with-gap"
                            name="type"
                            type="radio"
                            value="outcome"
                            v-model="type"
                    />
                    <span>Расход</span>
                </label>
            </p>

            <div class="input-field">
                <input
                        :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
                        id="amount"
                        type="number"
                        v-model.number="amount"
                >
                <label for="amount">Сумма</label>
                <span v-if="$v.amount.$dirty && !$v.amount.minValue"
                      class="helper-text invalid"
                >Минимальная величина - {{$v.amount.$params.minValue.min}} рублей</span>
            </div>

            <div class="input-field">
                <input
                        :class="{invalid: $v.description.$dirty && !$v.description.required}"
                        id="description"
                        type="text"
                        v-model="description"
                >
                <label for="description">Описание</label>
                <span v-if="$v.description.$dirty && !$v.description.required"
                      class="helper-text invalid"
                >Введите описание</span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                Создать
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
    import {required, minValue} from 'vuelidate/lib/validators';
    import {mapGetters} from 'vuex';

    export default {
        name: 'record',
        data: () => ({
            loading: true,
            select: null,
            categories: [],
            currentCategory: null,
            type: 'outcome',
            amount: 1,
            description: ''
        }),
        computed: {
            //оператор расширения
            ...mapGetters(['info']),
            //проверка если есть деньги на счету достаточные для такого расхода
            //то создаем запись
            canCreateRecord() {

                if(this.type === 'income') {
                    return true
                } else {
                    return this.info.bill >= this.amount;
                }
            }
        },
        validations: {
            amount: {minValue: minValue(1)},
            description: {required}
        },
        async mounted() {
            this.categories = await this.$store.dispatch('fetchCategories');
            this.loading = false;
            //инициализация селекта должна происходить после лоада компонента
            //делаем это с таймаутом, т.к. после загрузки происходит отрисовка
            //компонента, которая занимает какое-то время, поэтому вызов
            //инициализации селекта уходит в очередь и точно будет после прорисовки
            setTimeout(() => {
                window.M.updateTextFields();
                this.select = window.M.FormSelect.init(this.$refs.select);
            }, 0);

            //указываем после загрузки currentCategory в селект
            if(this.categories.length) {
                this.currentCategory = this.categories[0].id;
            }

        },
        methods: {
            async submitHandler() {
                if(this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }
                if(this.canCreateRecord) {
                    try {
                        await this.$store.dispatch('createRecord', {
                            categoryId: this.currentCategory,
                            amount: this.amount,
                            description: this.description,
                            type: this.type,
                            date: new Date().toJSON()
                        });
                        const bill = this.type === 'income'
                            ? this.info.bill + this.amount
                            : this.info.bill - this.amount;

                        await this.$store.dispatch('updateInfo', {bill});
                        this.$message('Запись успешно создана');
                        //очистка формы
                        this.$v.$reset();
                        //очистка данных компонента
                        this.amount = 1;
                        this.description = '';
                    } catch(e) {
                        console.log(e);
                    }


                } else {
                    this.$message(`Недостаточно средств на счете (${this.amount - this.info.bill})`);
                }
            }
        },
        beforeDestroy() {
            if(this.select && this.select.destroy) {
                this.select.destroy();
            }
        }
    }
</script>