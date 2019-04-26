import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
      children: [
        {
          path: '/',
          name: 'Allproduct',
          component: () => import('./views/Allproduct.vue'),
        },
        {
          path: '/categories',
          name: 'Categories',
          component: () => import('./views/Categories.vue'),
        },
        {
          path: 'itemdata/:itemId',
          name: 'Itemdata',
          component: () => import('./views/Itemdata.vue'),
        },
      ]
    },
    {
      path: '/customer_checkout',
      name: 'CustomerCheckout',
      component: () => import('./views/CustomerCheckout.vue'),
      children: [
        {
          path: '',
          name: 'OrderInfo',
          component: () => import('./views/OrderInfo.vue'),
        },
        {
          path: 'payment/:orderId',
          name: 'Payment',
          component: () => import('./views/Payment.vue'),
        },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: () => import('./components/Dashboard.vue'),
      children: [
        {
          path: 'products',
          name: 'Products',
          component: () => import('./views/Products.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('./views/Orders.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: () => import('./views/Coupons.vue'),
          meta: { requiresAuth: true },
        },
      ]
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('./components/Dashboard.vue'),
      children: [
        {
          path: 'customer_orders',
          name: 'CustomerOrders',
          component: () => import('./views/CustomerOrders.vue'),
        },
      ]
    }
  ],
});
