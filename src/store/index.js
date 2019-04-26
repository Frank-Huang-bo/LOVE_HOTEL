/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false,
    products: [],
    // categories: [],
    searchText: '',
    cartProducts: [],
    status: {
      loadingItem: '',
    },
  },
  actions: {
    updateLoading(context, status) {
      context.commit('LOADING', status);
    },
    getProducts(context) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      context.commit('LOADING', true);
      axios.get(api).then((response) => {
        context.commit('PRODUCTS', response.data.products);
        // context.commit('CATEGORIES', response.data.products);
        context.commit('LOADING', false);
        console.log('取得遠端', response.data);
      });
    },
    changeText(context, place) {
      context.commit('SEARCHTEXT', place);
    },
    getCart(context, id) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      context.commit('LOADINGITEM', id);
      axios.get(api).then((response) => {
        // console.log(response.data)
        context.commit('CARTPRODUCTS', response.data.data.carts);
        context.commit('CARTFINALPRICE', response.data.data.final_total);
        context.commit('LOADINGITEM', '');
      });
    },
  },
  mutations: {
    LOADING(state, status) {
      state.isLoading = status;
    },
    PRODUCTS(state, payload) {
      state.products = payload;
    },
    // CATEGORIES(state, payload) {
    //     const categories = new Set();
    //     payload.forEach((item) => {
    //         categories.add(item.category);
    //     });
    //     state.categories = Array.from(categories);
    // }
    SEARCHTEXT(state, payload) {
      state.searchText = payload;
    },
    CARTPRODUCTS(state, payload) {
      state.cartProducts = payload;
    },
    CARTFINALPRICE(state, payload) {
      state.cartFinalPrice = payload;
    },
    LOADINGITEM(state, payload) {
      state.status.loadingItem = payload;
    },
  },
  getters: {
    text(state) {
      return state.searchText;
    },
    products(state) {
      return state.products;
    },
    // categories(state) {
    //     return state.categories;
    // }
    cartProducts(state) {
      return state.cartProducts;
    },
    cartProductsLength(state) {
      return state.cartProducts.length;
    },
  },
});
