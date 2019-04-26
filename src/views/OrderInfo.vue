<template>
    <div>
        <loading :active.sync="isLoading"></loading>

        <div class="form-row text-center">
            <div class="col-12 col-sm">
                <div class="alert alert-success alert-rounded" role="alert">
                    1. 輸入訂單資料
                </div>
            </div>
            <div class="col-12 col-sm">
                <div class="alert alert-light alert-rounded" role="alert">
                    2. 付款
                </div>
            </div>
            <div class="col-12 col-sm">
                <div class="alert alert-light alert-rounded" role="alert">
                    3. 完成
                </div>
            </div>
        </div>

        <div class="row justify-content-center mt-5">
            <div class="col-md-8">
                <div class="card mt-5 mb-4 border-0">
                    <div class="card-header">
                        <h4 class="h4 mb-0 text-center">訂單資訊</h4>
                    </div>
                </div>
                <table v-if="cartProducts.length != 0" class="table mt-5 ml-auto mr-auto">
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
                            <div class="text-success mt-1" v-if="cartItem.coupon" style="font-size: 12px;"> 已套用優惠券</div>
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
            <div class="ml-auto mr-auto">
                <div v-if="cartProducts.length != 0" class="input-group ml-auto mr-auto">
                    <input  v-model="coupon_code" type="text" class="form-control" placeholder="請輸入優惠碼" aria-label="Recipient's username" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
                    </div>
                </div>
                <p class="text-danger">{{ findCoupon }}</p>
            </div>

                <div class="card mt-5 mb-4 border-0">
                    <div class="card-header">
                        <h4 class="h4 mb-0 text-center">訂購人資訊</h4>
                    </div>
                </div>
                <div class="my-5 justify-content-center">
                    <form @submit.prevent="createOrder">
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
                            <label for="usertel">收件人電話</label>
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
                        <label for="usercontent">留言</label>
                        <textarea name="" id="usercontent" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                        </div>
                        <div class="text-right">
                        <button class="btn btn-secondary">送出訂單</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';

    export default{
        data(){
            return{
                cartProducts: [],
                cartTotalPrice: 0,
                cartFinalPrice: 0,
                isLoading: false,
                status: {
                    loadingItem: '',
                },
                coupon_code: '',
                findCoupon: '',
                order: {
                    user: {},
                },
                orderId: '',
                isLoading: false,
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
            getCart(id){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
                const vm = this;
                vm.status.loadingItem = id;
                this.$http.get(api).then((response) => {
                    // console.log(response.data)
                    vm.cartProducts = response.data.data.carts;
                    vm.cartFinalPrice = response.data.data.final_total;
                    vm.status.loadingItem = '';
                    console.log(vm.cartProducts)
                    // vm.getCart();
                })
            },
            removeCartItem(id){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
                const vm = this;
                vm.isLoading = true;
                this.$http.delete(api).then(() => {
                vm.isLoading = false;
                vm.getCart();
                })
            },
            addCouponCode(){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
                const vm = this;
                const coupon = {
                    code: vm.coupon_code,
                };
                vm.isLoading = true;
                this.$http.post(api, {data: coupon}).then((response) => {
                    console.log(response.data)
                    vm.isLoading = false;
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
                // vm.isLoading = true;
                 this.$validator.validate().then((result) => {
                    if (result) {
                        this.$http.post(api, {data: order}).then((response) => {
                            console.log('訂單已建立', response.data)
                            vm.isLoading = false;
                            if(response.data.success){
                                vm.$router.push(`/customer_checkout/payment/${response.data.orderId}`)
                            }
                        })
                    }else{
                        console.log('表單不完整');
                    }
                });
            },
            getOrder(){
                const vm = this;
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order/${vm.orderId}`;
                vm.isLoading = true;
                this.$http.get(api).then((response) => {
                    console.log(response)
                    vm.order = response.data.order;
                    vm.isLoading = false;
                })
            },
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
            this.orderId = this.$route.params.orderId;
            console.log(this.orderId)
            this.getCart();
            this.getOrder();
        }
    }
</script>