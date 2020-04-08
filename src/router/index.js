import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {layout: 'empty'},
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {layout: 'empty'},
    component: () => import('../views/Register.vue')
  },
  {
    path: '/',
    name: 'home',
    meta: {layout: 'main', authRequired: true},
    component: () => import('../views/Home.vue')
  },
  {
    path: '/categories',
    name: 'categories',
    meta: {layout: 'main', authRequired: true},
    component: () => import('../views/Categories.vue')
  },
  {
    path: '/detail/:id',
    name: 'detail',
    meta: {layout: 'main', authRequired: true},
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/history',
    name: 'history',
    meta: {layout: 'main', authRequired: true},
    component: () => import('../views/History.vue')
  },
  {
    path: '/planning',
    name: 'planning',
    meta: {layout: 'main', authRequired: true},
    component: () => import('../views/Planning.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {layout: 'main', authRequired: true},
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/record',
    name: 'record',
    meta: {layout: 'main', authRequired: true},
    component: () => import('../views/Record.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
//этот метод будет вызываться перед каждой сменой роута
//тут мы будет делать проверку авторизации для роута
router.beforeEach((to, from, next) => {
  //получаем юзера, если он авторизован
  const currentUser = firebase.auth().currentUser;
  //matched возвращает массив роутов, т.к. роуты могут быть вложены
  //поэтому один адрес может вернуть несоклько роутов
  //some возвращает true если хотя бы для одного из роутов будет true
  const requireAuth = to.matched.some(record => record.meta.authRequired);

  //Если роут требует авторизации, а юзер не авторизован
  if(requireAuth && !currentUser) {
    //то редиректим его на страницу логина с сообщением об авторизации
    next('/login?message=login');
  } else {
    //если все хорошо, пропускаем роут дальше
    next();
  }

});

export default router
