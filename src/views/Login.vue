<template>
    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">{{'Login'|localize}}</span>
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
                >{{'EnterEmail'|localize}}</small>
                <small class="helper-text invalid"
                       v-else-if="$v.email.$dirty && !$v.email.email"
                >{{'EnterCorrectEmail'|localize}}</small>
            </div>
            <div class="input-field">
                <input v-model.trim="password"
                       :class="{invalid: ($v.password.$dirty && !$v.password.required) ||
                                        ($v.password.$dirty && !$v.password.minLength)}"
                        id="password"
                        type="password"
                >
                <label for="password">{{'Password'|localize}}</label>
                <small class="helper-text invalid"
                       v-if="$v.password.$dirty && !$v.password.required"
                >{{'EnterPassword'|localize}}</small>
                <small class="helper-text invalid"
                       v-else-if="$v.password.$dirty && !$v.password.minLength"
                >{{'PasswordLengthMustBe'|localize}} {{$v.password.$params.minLength.min}}
                    {{'Symbols'|localize}}</small>
            </div>
        </div>
        <div class="card-action">
            <div>
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    {{'Login'|localize}}
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                {{'DontHaveAccount'|localize}}
                <router-link to="/register">{{'toRegister'|localize}}</router-link>
            </p>
            <p class="center">
                {{'UseTestUser'|localize}}
                <ul>
                    <li>Login: test@test.ru</li>
                    <li>Password: test123</li>
                </ul>
            </p>
        </div>
    </form>
</template>

<script>
    import {email, required, minLength} from 'vuelidate/lib/validators'
    import localizeFilter from "../filters/localize.filter";

    import messages from '@/utils/messages'
    export default {
        name: "Login",
        metaInfo() {
            return {
                title: this.$title('Login')
            }
        },
        data: () => ({
            email: '',
            password: ''
        }),
        validations: {
            email: {
                email,
                required
            },
            password: {
                required,
                minLength: minLength(6)
            }
        },
        mounted() {
            if(messages[this.$route.query.message]) {
                this.$message(localizeFilter(messages[this.$route.query.message]));
            }
        },
        methods: {
            async submitHandler() {
                if(this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }
                const formData = {
                    email: this.email,
                    password: this.password
                };

                //вызываем action 'login' vuex модуля auth
                await this.$store.dispatch('login', formData);
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>

</style>