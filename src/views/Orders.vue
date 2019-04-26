<template>
    <div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th scope="col" width="160">購買時間</th>
                    <th scope="col" width="200">Email</th>
                    <th scope="col">購買商品</th>
                    <th scope="col" width="160" class="text-center">應付金額</th>
                    <th scope="col" width="160">是否付款</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in orders" :key="item.id">
                    <td>{{ item.create_at | date }}</td>
                    <td>{{ item.user.email }}</td>
                    <td>
                        <ul v-for="product in item.products" :key="product.id">
                            <li class="mb-2">{{product.product.title}} : {{ product.qty }}{{ product.product.unit }}</li>
                        </ul>
                    </td>
                    <td class="text-right">{{ item.total | currency }}</td>
                    <td>
                        <span v-if="item.is_paid" class="text-success">已付款</span>
                        <span v-else>未付款</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <pagination :page-data="pagination" @changePage="getOrders" class="d-flex justify-content-center mb-4"></pagination>
    </div>
</template>

<script>
import $ from 'jquery';
    export default{
        data(){
            return{
                orders: [],
                tempOrder: {},
                pagination: {},
            }
        },
        methods: {
            getOrders(page = 1){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${page}`;
                const vm = this;
                vm.$store.dispatch('updateLoading', true);
                this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.$store.dispatch('updateLoading', false);
                vm.orders = response.data.orders;
                vm.pagination = response.data.pagination;
                })
            },
        },
        created(){
            this.getOrders();
        }
    }
</script>