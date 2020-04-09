<template>
    <Loader v-if="loading"/>
    <div v-else class="app-main-layout">

        <Navbar @click-toggle-sidebar="sidebarIsOpen = !sidebarIsOpen" />

        <!--Используем :key=locale для того чтобы при изменении locale
         наш сайдбар перерисовывался и содержимое меняло язык соответственно-->
        <Sidebar :sidebarIsOpen="sidebarIsOpen" :key="locale"/>

        <main class="app-content" :class="{full: !sidebarIsOpen}">
            <div class="app-page">
                <router-view />
            </div>
        </main>

        <div class="fixed-action-btn">
            <router-link to="/record" v-tooltip="'AddRecord'" class="btn-floating btn-large blue">
                <i class="large material-icons">add</i>
            </router-link>
        </div>
    </div>
</template>

<script>
    import Navbar from '@/components/app/Navbar';
    import Sidebar from '@/components/app/Sidebar';
    import messages from '@/utils/messages'

    export default {
        name: "MainLayout",
        data: () => ({
            sidebarIsOpen: true,
            loading: true
        }),
        computed: {
            error() {
                //получаем ошибку по геттеру vuex со стейтом error
                return this.$store.getters.error;
            },
            locale() {
                return this.$store.getters.info.locale;
            }
        },
        watch: {
            //отслеживаем изменение ошибки
            error(firebaseError) {
                console.log(firebaseError);
                //выводить сообщение ошибки по коду через модуль utils/message.plugin.js
                this.$error(messages[firebaseError.code] || 'Что-то пошло не так');
            }
        },
        //html дерево к моменту mounted готово, можно делать асинхронные запросы
        async mounted() {
            //если нет информации о пользователе (bill и name) (т.к. locale остается)
            if (!this.$store.getters.info.bill || !this.$store.getters.info.name) {
                //асинхронно получаем данные о пользователе
                await this.$store.dispatch('fetchInfo');
            }
            //чтобы к моменту отображения шаблона были все значения установлены
            this.loading = false;

        },
        components: {
            Sidebar, Navbar
        }
    }
</script>

<style scoped>

</style>