import firebase from "firebase/app";

export default {
    actions: {
        // eslint-disable-next-line no-unused-vars
        async login({dispatch, commit}, {email, password}) {
            // eslint-disable-next-line no-useless-catch
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
            } catch(e) {
                //вызываем mutation vuex для изменения state
                commit('setError', e);
                throw e;
            }
        },
        async register({dispatch, commit}, {email, password, name}) {
            // eslint-disable-next-line no-useless-catch
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                //вызываем action 'getUid'
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/info`).set({
                    bill: 100000,
                    name: name
                });
            } catch(e) {
                //вызываем mutation vuex для изменения state
                commit('setError', e);
                throw e;
            }
        },
        getUid() {
          const user = firebase.auth().currentUser;
          return user ? user.uid : null;
        },
        async logout({commit}) {
            await firebase.auth().signOut();
            //очищаем стейт пользователя после выхода из лк
            commit('clearInfo');
        }
    }
}