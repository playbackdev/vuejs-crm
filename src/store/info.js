import firebase from "firebase/app";

export default {
    state: {
        info: {}
    },
    mutations: {
        setInfo(state, info) {
            state.info = info;
        },
        clearInfo(state) {
            state.info = {};
        }
    },
    actions: {
        //получаем даннык о пользователе по id из базы firebase
        async fetchInfo({dispatch, commit}) {
            try {
                const uid = await dispatch('getUid');
                const info = (await firebase.database()
                    .ref(`/users/${uid}/info`)
                    .once('value'))
                    .val();
                commit('setInfo', info);
            } catch(e) {
                commit('serError', e);
                throw e;
            }
        },
        async updateInfo({dispatch, commit, getters}, toUpdate) {
            try {
                const uid = await dispatch('getUid');
                //собираем весь объект info, со всеми полями
                //и обновляем поля из toUpdate
                const updateData = {...getters.info, ...toUpdate};
                //т.к. для изменения нужно передать в бд объект со всеми полями
                //даже если некоторые не менялись
                await firebase.database()
                    .ref(`/users/${uid}/info`)
                    .update(updateData);
                //меняем информацию в хранилище
                commit('setInfo', updateData);
            } catch(e) {
                commit('serError', e);
                throw e;
            }
        }

    },
    getters: {
        info: state => state.info
    }
}