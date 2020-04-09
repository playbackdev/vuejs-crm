<template>
    <div class="col s12 m6">
        <div>
            <div class="page-subtitle">
                <h4>{{'EditCategory'|localize}}</h4>
            </div>

            <form @submit.prevent="submitHandler">
                <div class="input-field" >
                    <select ref="select" v-model="current">
                        <option
                                v-for="c of categories"
                                :key="c.id"
                                :value="c.id"
                        >{{c.title}}</option>
                    </select>
                    <label>{{'ChooseCategory'|localize}}</label>
                </div>

                <div class="input-field">
                    <input v-model="title"
                           :class="{invalid: $v.title.$dirty && !$v.title.required}"
                           type="text" id="name">
                    <label for="name">{{'CategoryName'|localize}}</label>
                    <span v-if="$v.title.$dirty && !$v.title.required"
                          class="helper-text invalid"
                    >{{'Validate_EnterCatName'|localize}}</span>
                </div>

                <div class="input-field">
                    <input v-model.number="limit"
                           :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
                            id="limit"
                            type="number"
                    >
                    <label for="limit">{{'Limit'|localize}}</label>
                    <span v-if="$v.limit.$dirty && !$v.limit.minValue"
                          class="helper-text invalid"
                    >{{'Validate_MinValue'|localize}} - {{$v.limit.$params.minValue.min}}</span>
                </div>

                <button class="btn waves-effect waves-light" type="submit">
                    {{'Update'|localize}}
                    <i class="material-icons right">send</i>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import {required, minValue} from 'vuelidate/lib/validators';

    export default {
        name: "CategoryEdit",
        props: {
            categories: {
                type: Array,
                required: true
            }
        },
        data: () => ({
            select: null,
            title: '',
            limit: 100,
            current: null
        }),
        validations: {
            title: {required},
            limit: {minValue: minValue(100)}
        },
        watch: {
            current(catId) {
                const {title, limit} = this.categories.find(c => c.id === catId);
                this.title = title;
                this.limit = limit;
            }
        },
        created() {
            const {id, title, limit} = this.categories[0];
            this.current = id;
            this.title = title;
            this.limit = limit;
        },
        mounted() {
            window.M.updateTextFields();
            this.select = window.M.FormSelect.init(this.$refs.select);
        },
        methods: {
            async submitHandler() {
                if(this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }
                try {
                    const categoryData = {
                        id: this.current,
                        title: this.title,
                        limit: this.limit
                    };
                    await this.$store.dispatch('updateCategory', categoryData);
                    this.$message('Категория успешно обновлена');
                    this.$emit('updated', categoryData);
                } catch(e) {
                    console.log(e);
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

<style scoped>

</style>