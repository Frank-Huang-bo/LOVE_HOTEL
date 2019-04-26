<template>
    <div>
        <AlertMessage></AlertMessage>
        <div class="bg-light pb-5">
            <div class="container">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><router-link to="/">首頁</router-link></li>
                        <li class="breadcrumb-item active" aria-current="page">{{ text }}</li>
                    </ol>
                </nav>

                <div class="row">
                    <div class="col-md-3">
                        <div class="list-group sticky-top">
                            <!-- v-for="item in categories" :key="item" -->
                            <a href="#" @click.prevent="changeText('全部地區')" :class="{ 'active': text === '全部地區'}" class="list-group-item list-group-item-action"><i class="fas fa-torii-gate mr-2"></i>全部地區</a>
                            <a href="#" @click.prevent="changeText('日本')" :class="{ 'active': text === '日本'}" class="list-group-item list-group-item-action"><i class="fas fa-torii-gate mr-2"></i>日本</a>
                            <a href="#" @click.prevent="changeText('韓國')" :class="{ 'active': text === '韓國'}" class="list-group-item list-group-item-action"><i class="fas fa-torii-gate mr-2"></i>韓國</a>
                            <a href="#" @click.prevent="changeText('菲律賓')" :class="{ 'active': text === '菲律賓'}" class="list-group-item list-group-item-action"><i class="fas fa-torii-gate mr-2"></i>菲律賓</a>
                            <a href="#" @click.prevent="changeText('泰國')" :class="{ 'active': text === '泰國'}" class="list-group-item list-group-item-action"><i class="fas fa-torii-gate mr-2"></i>泰國</a>
                            <a href="#" @click.prevent="changeText('越南')" :class="{ 'active': text === '越南'}" class="list-group-item list-group-item-action"><i class="fas fa-torii-gate mr-2"></i>越南</a>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <!-- card -->
                        <div class="row">
                            <div class="col-md-6 mb-4" v-for="item in filterData" :key="item.id">
                                <div class="card border-0 shadow-sm h-100 animated">
                                    <div style="height: 150px; background-size: cover; background-position: center"
                                    :style="{backgroundImage: `url(${item.imageUrl})`}">
                                    </div>
                                    <div class="card-body">
                                        <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                                        <h5 class="card-title">
                                            <i class="fas fa-paw"></i>
                                            <a href="#" class="h5 text-dark" @click.prevent="getProduct(item.id)">{{ item.title }}</a>
                                        </h5>
                                        <p class="card-text">{{ item.content }}</p>
                                        <div class="text-right align-items-baseline">
                                            <div class="h5 text-secondary" v-if="!item.price">NT$ {{ item.origin_price }}</div>
                                            <del class="h6 text-secondary" v-if="item.price">NT$ {{ item.origin_price }}</del>
                                            <div class="h5" v-if="item.price">NT$ {{ item.price }}</div>
                                        </div>
                                    </div>
                                    <div class="card-footer d-flex bg-dark">
                                        <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                                            <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                                            查看更多
                                        </button>
                                        <button type="button" class="btn btn-outline-primary btn-sm ml-auto" @click="addtoCart(item.id)">
                                            <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                                            加到購物車
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import { mapGetters, mapActions } from 'vuex';

    export default{
        data() {
            return {
                product: {},
                status: {
                    loadingItem: '',
                },
                isLoading: false,
            }
        },
        methods: {
            ...mapActions(['getProducts']),
            getProduct(id){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
                const vm = this;
                vm.status.loadingItem = id;
                this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.$router.push(`/itemdata/${response.data.product.id}`);
                vm.status.loadingItem = '';
                })
            },
            addtoCart(id, qty = 1){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
                const vm = this;
                vm.status.loadingItem = id;
                const cart = {
                    product_id: id,
                    qty
                };
                this.$http.post(api, {data: cart}).then((response) => {
                console.log(response.data)
                vm.status.loadingItem = '';
                vm.$bus.$emit('message:push', '已新增至購物車', 'success');
                })
            },
            changeText(place) {
                this.$store.dispatch('changeText', place);
            }
        },
        computed: {
            filterData() {
                const vm = this;
                if (vm.$store.state.searchText !== '全部地區') {
                    return vm.products.filter((item) => {
                    const data = item.category.includes(vm.$store.state.searchText);
                    return data;
                    });
                }
                return this.products;
            },
            ...mapGetters(['text', 'products']),
        },
        created() {
            this.getProducts();
        }
    }
</script>