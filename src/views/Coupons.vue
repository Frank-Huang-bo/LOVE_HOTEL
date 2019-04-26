<template>
    <div>
        <div class="text-right mt-4">
            <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th scope="col">名稱</th>
                    <th scope="col" width="160">折扣百分比</th>
                    <th scope="col" width="160">到期日</th>
                    <th scope="col" width="160">是否啟用</th>
                    <th scope="col" width="160">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in coupons" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.percent }}%</td>
                    <td>{{ item.date }}</td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td class="d-flex">
                        <button class="btn btn-outline-primary btn-sm mr-1" @click="openModal(false, item)">編輯</button>
                        <button class="btn btn-outline-danger btn-sm" @click="delModal(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <pagination :page-data="pagination" @changePage="getCoupons" class="d-flex justify-content-center mb-4"></pagination>
        <!-- Modal -->
        <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">新增優惠券</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="title">名稱</label>
                        <input type="text" class="form-control mt-1" id="title"
                        v-model="tempCoupon.title"
                        placeholder="請輸入優惠券名稱">
                    </div>
                    <div class="form-group">
                        <label for="code">優惠碼</label>
                        <input v-model="tempCoupon.code" type="text" class="form-control mt-1" id="code"
                        placeholder="請輸入優惠碼">
                    </div>
                    <label for="percent">優惠百分比</label>
                    <div class="input-group mb-3">
                        <input v-model="tempCoupon.percent" id="percent" type="text" class="form-control mt-1" placeholder="請輸入百分比" aria-label="Username" aria-describedby="basic-addon1">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">%</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="date">到期日</label>
                        <input v-model="tempCoupon.date" type="date" class="form-control mt-1" id="date">
                    </div>


                    <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"
                            v-model="tempCoupon.is_enabled"
                            :true-value="1"
                            :false-value="0"
                            id="is_enabled">
                            <label class="form-check-label" for="is_enabled">
                            是否啟用
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span>刪除優惠券</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> (刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
                    </div>
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
                coupons: [],
                tempCoupon: {},
                pagination: {},
                isNew: false,
            }
        },
        methods: {
            getCoupons(page = 1){
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;
                const vm = this;
                vm.$store.dispatch('updateLoading', true);
                this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.$store.dispatch('updateLoading', false);
                vm.coupons = response.data.coupons;
                vm.pagination = response.data.pagination;
                })
            },
            openModal(isNew, item){
                if(isNew){
                    this.tempCoupon = {};
                    this.isNew = true;
                }else{
                    this.tempCoupon = {...item};
                    this.isNew = false;
                }
                $('#couponModal').modal('show');
            },
            updateCoupon(){
                let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;
                let httpMethods = 'post';
                const vm = this;
                if(!vm.isNew){
                    api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
                    httpMethods = 'put';
                }
                this.$http[httpMethods](api, { data: vm.tempCoupon }).then((response) => {
                console.log(response.data)
                if(response.data.success){
                    $('#couponModal').modal('hide');
                    vm.getCoupons();
                }else{
                    $('#couponModal').modal('hide');
                    vm.getCoupons();
                    console.log('新增失敗');
                }
                // vm.products = response.data.products;
                })
            },
            delModal(item){
                this.tempCoupon = {...item};
                $('#delCouponModal').modal('show');
            },
            deleteCoupon(){
                const vm = this;
                const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
                this.$http.delete(api).then((response) => {
                    console.log(response.data)
                    if(response.data.success){
                        $('#delCouponModal').modal('hide');
                        vm.getCoupons();
                    }else{
                        $('#delCouponModal').modal('hide');
                        vm.getCoupons();
                        console.log('刪除失敗');
                    }
                })
            },
        },
        created(){
            this.getCoupons();
        }
    }
</script>
