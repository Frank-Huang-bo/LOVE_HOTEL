<template>
    <div>
        <AlertMessage></AlertMessage>
        <div @click="openCart">
            <img src="@/assets/img/shopping-cart.png" class="cart-position" alt="">
            <span class="badge badge-danger cart-number-position">{{ cartProductsLength }}</span>
        </div>
        <!-- Modal -->
        <div class="modal fade bd-example-modal-lg" id="cartModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">購物車</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-5">
                            <table v-if="cartProductsLength != 0" class="table mt-5 ml-auto mr-auto">
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
                                </tfoot>
                            </table>
                            <div class="text-center h6 mt-4 text-secondary" v-if="cartProductsLength == 0">
                                目前尚未選購商品唷！
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="movetoPayment">結帳去</button>
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
                cartTotalPrice: 0,
                cartFinalPrice: 0,
               
            }
        },
        methods: {
            openCart(){
                $('#cartModal').modal('show');
            },
            ...mapActions(['getCart']),
            removeCartItem(id){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
                const vm = this;
                vm.$store.dispatch('updateLoading', true);
                this.$http.delete(api).then((response) => {
                console.log(response)
                vm.$store.dispatch('updateLoading', false);
                vm.getCart();
                vm.$bus.$emit('message:push', '從購物車移除囉！', 'warning');
                })
            },
            movetoPayment(){
                if(this.cartProductsLength !== 0){
                    this.$router.push('/customer_checkout');
                    $('#cartModal').modal('hide');         
                }else{
                    alert('您還沒選購商品唷！')
                }
                     
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
            },
            ...mapGetters(['cartProductsLength', 'cartProducts']),
        },
        created(){
            this.getCart();
        }
    }
</script>