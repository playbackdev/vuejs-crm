<template>
    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">{{'Register'|localize}}</span>
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
            <div class="input-field">
                <input v-model.trim="name"
                       :class="{invalid: $v.name.$dirty && !$v.name.required}"
                        id="name"
                        type="text"
                >
                <label for="name">{{'Name'|localize}}</label>
                <small class="helper-text invalid"
                       v-if="$v.name.$dirty && !$v.name.required"
                >{{'EmptyName'|localize}}</small>
            </div>
            <p>
                <label>
                    <input type="checkbox" v-model="agreeRules" />
                    <span>{{'AgreeRules'|localize}}</span>
                </label>
            </p>
        </div>
        <div class="card-action">
            <div>
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    {{'toRegister'|localize}}
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                {{'HaveAccount'|localize}}
                <router-link to="/login">{{'Login'|localize}}</router-link>
            </p>
        </div>
    </form>
</template>

<script>
    import {email, required, minLength} from 'vuelidate/lib/validators'

    export default {
        name: "Register",
        metaInfo() {
            return {
                title: this.$title('Register')
            }
        },
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