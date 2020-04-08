import firebase from 'firebase/app'
export default {
    actions: {
        async fetchCategories({commit, dispatch}) {
            try {
                const uid = await dispatch('getUid');
                const categories = (await firebase.database()
                        .ref(`/users/${uid}/categories`)
                        //once возвращает объект с функцией val
                        .once('value'))
                    //возвращаем массив категорий либо пустой объект
                    .val() || {};
                //firebase возвращает уникальный id записи
                return Object.keys(categories).map(key => ({
                        title: categories[key].title,
                        limit: categories[key].limit,
                        id: key
                }));
            } catch(e) {
                commit('setError', e);
                throw e;
            }

        },
        async fetchCategoryById({commit, dispatch}, id) {
            try {
                const uid = await dispatch('getUid');
                const category = (await firebase.database()
                    .ref(`/users/${uid}/categories`)
                    //возвращаем из всего массива одну категорию по id
                    .child(id)
                    //once возвращает объект с функцией val
                    .once('value'))
                //возвращаем массив категорий либо пустой объект
                    .val() || {};
                //firebase возвращает уникальный id записи
                return {
                    ...category,
                    id: id
                };
            } catch(e) {
                commit('setError', e);
                throw e;
            }

        },
        async createCategory({commit, dispatch}, {title, limit}) {
            try {
                const uid = await dispatch('getUid');
                const category = await firebase.database()
                    .ref(`/users/${uid}/categories`)
                    .push({title, limit});
                //firebase возвращает уникальный id записи
                return {title, limit, id: category.key}
            } catch(e) {
                commit('setError', e);
                throw e;
            }

        },
        async updateCategory({commit, dispatch}, {id, title, limit}) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database()
                    .ref(`/users/${uid}/categories`)
                    //находим по id и обновляем title и limit
                    .child(id).update({title, limit});
            } catch(e) {
                commit('setError', e);
                throw e;
            }
        }
    }
}