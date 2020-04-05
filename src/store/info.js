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
                console.log(e);
            }


        }
    },
    getters: {
        info: state => state.info
    }
}