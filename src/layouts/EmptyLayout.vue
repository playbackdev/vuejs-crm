<template>
    <div class="grey darken-1 empty-layout">
        <router-view />
    </div>
</template>

<script>
    import messages from '@/utils/messages'
    import localizeFilter from "../filters/localize.filter";

    export default {
        name: "EmptyLayout",
        computed: {
            error() {
                //получаем ошибку по геттеру vuex со стейтом error
                return this.$store.getters.error;
            }
        },
        watch: {
            //отслеживаем изменение ошибки
            error(firebaseError) {
                console.log(firebaseError);
                //выводить сообщение ошибки по коду через модуль utils/message.plugin.js
                this.$error(messages[firebaseError.code] ? localizeFilter(messages[firebaseError.code]) :
                localizeFilter('SmthGoesWrong'));
            }
        }
    }
</script>

<style scoped>

</style>