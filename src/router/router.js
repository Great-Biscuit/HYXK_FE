import { createRouter, createWebHistory } from "vue-router"

//1. 定义要使用到的路由组件  （一定要使用文件的全名，得包含文件后缀名）
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import FindUsername from '../components/FindUsername.vue';
import FindPassword from '../components/FindPassword.vue';

//2. 路由配置
const routes = [
  //redirect 重定向也是通过 routes 配置来完成，下面就是从 / 重定向到 /index
  {
    path: "/",
    redirect: "/Home",
  },
  { path: "/Login", component: Login},
  { path: "/Register", component: Register},
  { path: "/FindUsername", component: FindUsername},
  { path: "/FindPassword", component: FindPassword},
  { path: "/Home", component: Home},
]

// 3. 创建路由实例
const router = createRouter({
  // （1）采用hash 模式
  //history: createWebHashHistory(),
  // （2）采用 history 模式
  history: createWebHistory(),
  routes, //使用上方定义的路由配置
})

// 4. 导出router
export default router