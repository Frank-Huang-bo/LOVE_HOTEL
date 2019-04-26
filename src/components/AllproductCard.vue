<template>
    <div>
        <AlertMessage></AlertMessage>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm h-100 animated">
                    <div style="height: 150px; background-size: cover; background-position: center"
                    :style="{backgroundImage: `url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                        <h5 class="card-title">
                            <i class="fas fa-grin-hearts"></i>
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
</template>

<script>
import $ from 'jquery';
import { mapGetters, mapActions } from 'vuex';

    export default{
        data(){
            return{
                // products: [],
                product: {},
                status: {
                    loadingItem: '',
                },
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
                vm.getCart();
                vm.$bus.$emit('message:push', '加到購物車囉！', 'success');
                })
            },
            getCart(id){
                this.$store.dispatch('getCart', id);
            },
        },
        computed: {
            ...mapGetters(['products']),
        },
        created(){
            this.getProducts();
        }
    }
</script>