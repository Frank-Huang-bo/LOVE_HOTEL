/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-unresolved */
// 引入第三方套件
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';

// 引入自定義套件
import App from './App.vue';
import router from './router';
import store from './store';
import './bus';
import AlertMessage from '@/components/AlertMessage.vue';
import pagination from '@/components/Pagination.vue';
import currencyFilter from '@/filters/currency';
import dateFilter from '@/filters/date';

Vue.config.productionTip = false;
Vue.use(Vuex);
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);
Vue.use(VeeValidate);
VeeValidate.Validator.localize('zg_TW', zhTWValidate);

// 載入全域元件
Vue.component('Loading', Loading);
Vue.component('AlertMessage', AlertMessage);
Vue.component('pagination', pagination);
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
