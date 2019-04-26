import Vue from 'vue';

Vue.prototype.$bus = new Vue(); // 將event bus 直接掛在原型Vue下
