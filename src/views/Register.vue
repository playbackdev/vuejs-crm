<template>
    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">Регистрация</span>
            <div class="input-field">
                <input v-model.trim="email"
                       :class="{invalid: ($v.email.$dirty && !$v.email.required) ||
                                        ($v.email.$dirty && !$v.email.email)}"
                       id="email"
                       type="text"
                >
                <label for="email">Email</label>
                <small class="helper-text invalid"
                       v-if="$v.email.$dirty && !$v.email.required"
                >Введите Email</small>
                <small class="helper-text invalid"
                       v-else-if="$v.email.$dirty && !$v.email.email"
                >Введите корректный Email</small>
            </div>
            <div class="input-field">
                <input v-model.trim="password"
                       :class="{invalid: ($v.password.$dirty && !$v.password.required) ||
                                        ($v.password.$dirty && !$v.password.minLength)}"
                       id="password"
                       type="password"
                >
                <label for="password">Пароль</label>
                <small class="helper-text invalid"
                       v-if="$v.password.$dirty && !$v.password.required"
                >Введите пароль</small>
                <small class="helper-text invalid"
                       v-else-if="$v.password.$dirty && !$v.password.minLength"
                >Пароль должен быть длиннее {{$v.password.$params.minLength.min}} символов</small>
            </div>
            <div class="input-field">
                <input v-model.trim="name"
                       :class="{invalid: $v.name.$dirty && !$v.name.required}"
                        id="name"
                        type="text"
                >
                <label for="name">Имя</label>
                <small class="helper-text invalid"
                       v-if="$v.name.$dirty && !$v.name.required"
                >Поле имя не должно быть пустым</small>
            </div>
            <p>
                <label>
                    <input type="checkbox" v-model="agreeRules" />
                    <span>С правилами согласен</span>
                </label>
            </p>
        </div>
        <div class="card-action">
            <div>
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    Зарегистрироваться
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                Уже есть аккаунт?
                <router-link to="/login">Войти!</router-link>
            </p>
        </div>
    </form>
</template>

<script>
    import {email, required, minLength} from 'vuelidate/lib/validators'

    export default {
        name: "Register",
        data: () => ({
            email: '',
            password: '',
            name: '',
            agreeRules: false
        }),
        validations: {
            email: { email, required },
            password: { required, minLength: minLength(6) },
            name: { required },
            agreeRules: { checked: v => v }
        },
        methods: {
            async submitHandler() {
                if(this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }
                const formData = {
                    email: this.email,
                    password: this.password,
                    name: this.name
                };

                //вызываем action 'register' модуля vuex - auth
                await this.$store.dispatch('register', formData);
                this.$router.push('/');
            }
        }
    }
</script>