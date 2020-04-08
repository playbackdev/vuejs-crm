import firebase from 'firebase/app'

export default {
    actions: {
        async createRecord({dispatch, commit}, record) {
            try {
                const uid = await dispatch('getUid');
                return await firebase.database()
                    .ref(`/users/${uid}/records`)
                    .push(record);

            } catch(e) {
                commit('setError', e);
                throw e;
            }
        },
        async fetchRecords({dispatch, commit}) {
            try {
                const uid = await dispatch('getUid');
                const records = (await firebase.database()
                    .ref(`/users/${uid}/records`)
                    //once возвращает объект с функцией val
                    .once('value'))
                //возвращаем массив категорий либо пустой объект
                    .val() || {};

                //Возвращаем массив объектов с записями, но немного с другой структурой
                //нежели в firebase
                return Object.keys(records).map(key => ({
                   ...records[key],
                    id: key
                }));
            } catch(e) {
                commit('setError', e);
                throw e;
            }

        },
        async fetchRecordById({dispatch, commit}, id) {
            try {
                const uid = await dispatch('getUid');
                const record = (await firebase.database()
                    .ref(`/users/${uid}/records`)
                    //получаем из всего массива нужный элемент по id
                    .child(id)
                    //once возвращает объект с функцией val
                    .once('value'))
                //возвращаем массив категорий либо пустой объект
                    .val() || {};

                return {
                    ...record,
                    id: id
                };
            } catch(e) {
                commit('setError', e);
                throw e;
            }

        }
    }
}