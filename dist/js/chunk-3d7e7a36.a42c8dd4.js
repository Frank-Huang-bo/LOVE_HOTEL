(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3d7e7a36"],{"888c":function(t,s,e){},a55b:function(t,s,e){"use strict";e.r(s);var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",[e("div",{staticClass:"container border",staticStyle:{"max-width":"500px","margin-top":"20vh"}},[e("form",{staticClass:"form-signin",on:{click:function(s){return s.preventDefault(),t.signin(s)}}},[t._m(0),e("label",{staticClass:"sr-only",attrs:{for:"inputEmail"}},[t._v("Email address")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.user.username,expression:"user.username"}],staticClass:"form-control",attrs:{type:"email",id:"inputEmail",placeholder:"Email address",required:"",autofocus:""},domProps:{value:t.user.username},on:{input:function(s){s.target.composing||t.$set(t.user,"username",s.target.value)}}}),e("label",{staticClass:"sr-only",attrs:{for:"inputPassword"}},[t._v("Password")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.user.password,expression:"user.password"}],staticClass:"form-control",attrs:{type:"password",id:"inputPassword",placeholder:"Password",required:""},domProps:{value:t.user.password},on:{input:function(s){s.target.composing||t.$set(t.user,"password",s.target.value)}}}),t._m(1),e("button",{staticClass:"btn btn-lg btn-primary btn-block",attrs:{type:"submit"}},[t._v("登入")]),e("div",{staticClass:"text-right mt-3"},[e("router-link",{attrs:{to:"/"}},[t._v("返回首頁")])],1),e("p",{staticClass:"mt-5 mb-3 text-muted"},[t._v("© 2019")])])])])},n=[function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"d-flex justify-content-center login-font-size mt-5"},[e("i",{staticClass:"fas fa-hand-spock fa-1x mr-2"}),e("h1",{staticClass:"mb-3 font-weight-normal"},[t._v("admin sign in")])])},function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"checkbox mb-3"},[e("label",[e("input",{attrs:{type:"checkbox",value:"remember-me"}}),t._v(" Remember me\n        ")])])}],r={name:"login",data:function(){return{user:{username:"",password:""}}},methods:{signin:function(){var t="".concat("https://vue-course-api.hexschool.io","/admin/signin"),s=this;this.$http.post(t,s.user).then(function(t){console.log(t.data,s),t.data.success&&s.$router.push("/admin/products")})}}},i=r,o=(e("ddd6"),e("2877")),u=Object(o["a"])(i,a,n,!1,null,"2373aaa1",null);u.options.__file="Login.vue";s["default"]=u.exports},ddd6:function(t,s,e){"use strict";var a=e("888c"),n=e.n(a);n.a}}]);
//# sourceMappingURL=chunk-3d7e7a36.a42c8dd4.js.map