<template>
    <div>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm h-100">
                    <div style="height: 150px; background-size: cover; background-position: center"
                    :style="{backgroundImage: `url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{ item.title }}</a>
                    </h5>
                    <p class="card-text">{{ item.content }}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                        <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                        <div class="h5" v-if="item.price">特價 <span class="text-danger h2">{{ item.price }}</span> 元</div>
                    </div>
                    </div>
                    <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="product.imageUrl" class="img-fluid" alt="">
                        <blockquote class="blockquote mt-3">
                            <p class="mb-0">{{ product.content }}</p>
                            <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                            <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                            <div class="h4" v-if="product.price">特價 <span class="text-danger h2">{{ product.price }}</span> 元</div>
                        </div>
                        <select name="" class="form-control mt-3" id="" v-model="product.num">
                            <option :value="num" v-for="num in 10" :key="num">
                                {{ num }} {{ product.unit }}
                            </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="mr-3">
                            小計 <strong>{{ product.num * product.price }}</strong> 元
                        </div>
                        <button type="button" class="btn btn-primary" @click="addtoCart(product.id, product.num)">加到購物車</button>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="border mt-5 mb-5 p-4">
            <div class="h4 text-center mt-4">
                購物車
            </div>
            <table v-if="cartProducts.length != 0" class="table mt-5 ml-auto mr-auto" style="width: 600px;">
                <thead>
                    <tr>
                    <th scope="col" width="80" class="text-center"></th>
                    <th scope="col">品名</th>
                    <th scope="col" width="100" class="text-center">數量</th>
                    <th scope="col" width="100" class="text-center">單價</th>
                    <th scope="col" width="100" class="text-center">小計</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cartItem in cartProducts" :key="cartItem.id">
                        <td class="text-center"><button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(cartItem.id)"><i class="far fa-trash-alt"></i></button></td>
                        <td>
                            {{ cartItem.product.title }}
                            <div class="text-success" v-if="cartItem.coupon" style="font-size: 12px;"> 已套用優惠券</div>
                        </td>
                        <td class="text-center">{{ cartItem.qty }}</td>
                        <td class="text-right">{{ cartItem.product.price | currency }}</td>
                        <td class="text-right">{{ cartItem.total | currency }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" class="text-right">總計</td>
                        <td class="text-right">{{ cartTotal | currency }}</td>
                    </tr>
                    <tr v-if="cartFinalPrice !== cartTotal">
                        <td colspan="4" class="text-right text-primary">折扣價</td>
                        <td class="text-right text-primary">{{ cartFinalPrice | currency }}</td>
                    </tr>
                </tfoot>
            </table>
            <div class="text-center h6 mt-4 text-secondary" v-if="cartProducts.length == 0">
                目前尚未選購商品唷！
            </div>
            <div class="ml-auto mr-auto" style="width: 600px;">
                <div v-if="cartProducts.length != 0" class="input-group ml-auto mr-auto">
                    <input  v-model="coupon_code" type="text" class="form-control" placeholder="請輸入優惠碼" aria-label="Recipient's username" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
                    </div>
                </div>
                <p class="text-danger">{{ findCoupon }}</p>
            </div>
        </div>
        <div class="border mt-5 mb-5 p-4">
            <div class="h4 text-center mt-4">
                訂購者基本資料
            </div>
            <div class="my-5 row justify-content-center">
                <form class="col-md-6" @submit.prevent="createOrder">
                    <div class="form-group">
                        <label for="useremail">Email</label>
                        <input type="email" class="form-control" name="email" id="useremail"
                            :class="{'is-invalid': errors.has('email')}"
                            v-model="form.user.email" v-validate="'required|email'" placeholder="請輸入 Email">
                        <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
                    </div>
                
                    <div class="form-group">
                        <label for="username">收件人姓名</label>
                        <input type="text" class="form-control" name="name" id="username"
                            :class="{'is-invalid': errors.has('name')}"
                            v-model="form.user.name" v-validate="'required'" placeholder="請輸入姓名">
                        <span class="text-danger" v-if="errors.has('name')">姓名不能留空。</span>
                    </div>

                    <div class="form-group">
                        <label for="username">收件人電話</label>
                        <input type="tel" class="form-control" name="tel" id="usertel"
                            :class="{'is-invalid': errors.has('tel')}"
                            v-model="form.user.tel" v-validate="'required'" placeholder="請輸入電話">
                        <span class="text-danger" v-if="errors.has('tel')">電話不能留空。</span>
                    </div>
                
                    <div class="form-group">
                        <label for="useraddress">收件人地址</label>
                        <input type="address" class="form-control" name="address" id="useraddress"
                            :class="{'is-invalid': errors.has('address')}"
                            v-model="form.user.address" v-validate="'required'" placeholder="請輸入地址">
                        <span class="text-danger" v-if="errors.has('address')">地址不能留空。</span>
                    </div>
                
                    <div class="form-group">
                    <label for="useraddress">留言</label>
                    <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                    </div>
                    <div class="text-right">
                    <button class="btn btn-primary">送出訂單</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';

    export default{
        data(){
            return{
                products: [],
                product: {},
                cartProducts: [],
                cartTotalPrice: 0,
                cartFinalPrice: 0,
                status: {
                    loadingItem: '',
                },
                coupon_code: '',
                findCoupon: '',
                form: {
                    user: {
                        name: '',
                        email: '',
                        tel: '',
                        address: '',
                    },
                    message: '',
                }
            }
        },
        methods: {
            getProducts(page = 1){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
                const vm = this;
                vm.$store.dispatch('updateLoading', true);
                this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.$store.dispatch('updateLoading', false);
                vm.products = response.data.products;
                })
            },
            getProduct(id){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
                const vm = this;
                vm.status.loadingItem = id;
                this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.product = response.data.product;
                $('#productModal').modal('show');
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
                $('#productModal').modal('hide');
                })
            },
            getCart(id){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
                const vm = this;
                vm.status.loadingItem = id;
                this.$http.get(api).then((response) => {
                    console.log(response.data)
                    vm.cartProducts = response.data.data.carts;
                    vm.cartFinalPrice = response.data.data.final_total;
                    vm.status.loadingItem = '';
                })
            },
            removeCartItem(id){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
                const vm = this;
                vm.$store.dispatch('updateLoading', true);
                this.$http.delete(api).then(() => {
                vm.$store.dispatch('updateLoading', false);
                vm.getCart();
                })
            },
            addCouponCode(){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
                const vm = this;
                const coupon = {
                    code: vm.coupon_code,
                };
                vm.$store.dispatch('updateLoading', true);
                this.$http.post(api, {data: coupon}).then((response) => {
                    console.log(response.data)
                    vm.$store.dispatch('updateLoading', false);
                    vm.getCart();
                    if(!response.data.success){
                        vm.findCoupon = response.data.message;
                    }else{
                        vm.findCoupon = '';
                    }
                })
            },
            createOrder(){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
                const vm = this;
                const order = vm.form;
                vm.$store.dispatch('updateLoading', true);
                 this.$validator.validate().then((result) => {
                    if (result) {
                        this.$http.post(api, {data: order}).then((response) => {
                            console.log('訂單已建立', response.data)
                            vm.$store.dispatch('updateLoading', false);
                            if(response.data.success){
                                vm.$router.push(`/customer_checkout/payment/${response.data.orderId}`)
                            }
                        })
                    }else{
                        console.log('表單不完整');
                    }
                });
            }
        },
        computed: {
            cartTotal(){
                const vm = this;
                vm.cartTotalPrice = 0; // 增減商品前先歸零以便重新計算total price
                for(let i = 0; i<vm.cartProducts.length; i++){
                    vm.cartTotalPrice += vm.cartProducts[i].total;
                }
                return vm.cartTotalPrice;
            }
        },
        created(){
            this.getProducts();
            this.getCart();
        }
    }
</script>