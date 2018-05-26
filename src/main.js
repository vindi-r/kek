// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import VueCookies from 'vue-cookies'

Vue.use(BootstrapVue)
Vue.use(VueCookies)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    authState: 0,
    authRole: 0,
    authName: 0,
    authId: 0,
    token: 0
  },
  mutations: {
      authUser (state, res){
        var user = res.data.user;
        store.authRole = user.role;
        store.authState = 1;
        store.authName = user.username;
        store.token = res.data.token;
        window.localStorage.setItem('token', store.token);
      },
      refreshAuth(state, token){
        store.authState = 1;
        store.token = token;
      }
  }
});

const ajax = axios.create({
  baseURL: process.env.API_HOST,
  headers: {'content-type': 'application/json'},
  withCredentials: true
});

ajax.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers = {Authorization: store.token, 'content-type': 'application/json'};
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


router.beforeResolve((to, from, next) => {
  let token = window.localStorage.getItem('token');
  if(!token){
    if(to.name === 'Login'){
      if(store.authState === 1){
        next('/');
      }
    }else{
      if(store.authState !== 1){
        next('/pages/login');
      }
    }
  }else{
    store.commit('refreshAuth', token);
  }
  next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  mounted(){
    // TODO here need to check cookie, or token on server and get userData
    let token = window.localStorage.getItem('token');
    if(token){

    }
  },
  template: '<App/>',
  data(){
    return{
      ajax
    };
  },
  methods:{
  },
  components: {
    App
  }
})
