<template>
    <div class="col s12 m6">
        <div>
            <div class="page-subtitle">
                <h4>{{'Create'|localize}}</h4>
            </div>

            <form @submit.prevent="submitHandler">
                <div class="input-field">
                    <input v-model="title"
                           :class="{invalid: $v.title.$dirty && !$v.title.required}"
                            id="name"
                            type="text"
                    >
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
                    {{'Create'|localize}}
                    <i class="material-icons right">send</i>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import {required, minValue} from 'vuelidate/lib/validators';

    export default {
        name: "CategoryCreate",
        data: () => ({
           title: '',
           limit: 100
        }),
        validations: {
            title: {required},
            limit: {minValue: minValue(100)}
        },
        mounted() {
          window.M.updateTextFields();
        },
        methods: {
            async submitHandler() {
                if(this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }
                try{
                    const category = await this.$store.dispatch('createCategory', {
                        title: this.title,
                        limit: this.limit
                    });
                    this.title = '';
                    this.limit = 100;
                    //сбрасываем стейт формы
                    this.$v.$reset();
                    //сообщаем компоненту редактирования формы
                    //что создана новая форма
                    this.$message('Категория была создана');
                    this.$emit('created', category);
                } catch(e) {
                    console.log(e);
                }

            }
        }
    }
</script>

<style scoped>

</style>