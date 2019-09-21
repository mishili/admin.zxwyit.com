import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios"
import VueAxios from "vue-axios";


Vue.config.productionTip = false;
axios.defaults.baseURL = "http://192.168.1.188:/api";
Vue.use(VueAxios, axios);
Vue.use(ElementUI);


axios.interceptors.request.use(
  function (config) {
    // 拦截每次请求,携带token
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 对返回的状态进行判断，比如token是否过期
axios.interceptors.response.use((res) => {
  // 对响应正确做处理
  return res
}, function(error) {
  // 对响应错误做点什么 token 已过期
  //获取状态码
  const {status} = error.response;
  console.log(status)
  if(status === 401) {
    failureToken();
  }
  // 重定向到登录页面
  return Promise.reject(error) 
})

// token失效提示
function failureToken(){
  // userName用户存在
  if(sessionStorage.getItem('userName')){
    Message.error("身份过期,请重新登录,3秒后自动跳转");
    //重新登录，三秒后跳转
    setTimeout(function() {
      router.push('/')
    }, 3000);
    return
  }else{
    router.push('/')
  }
}

var url=""
var bool=true
router.beforeEach((to, from, next) => {
	if (sessionStorage.getItem("userName") || to.fullPath == "/login") {
		if(to.fullPath=='/login'){
			url=from.fullPath
			bool=true
		}
		// console.log(url+"--cccc")
		if(bool&&from.fullPath=='/login'&&url!='/'){
			bool=false
			next(url)
		}else{
			next()
		}
	} else {
		next({
			path: "/login"
		})
	}
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
