import { createRouter, createWebHistory } from "vue-router"

//1. 定义要使用到的路由组件  （一定要使用文件的全名，得包含文件后缀名）
import Home from '../components/home/Home.vue';
import Login from '../components/login/Login.vue';
import Register from '../components/register/Register.vue';
import FindUsername from '../components/login/FindUsername.vue';
import FindPassword from '../components/login/FindPassword.vue';
import PostDetail from '../components/post/PostDetail.vue';
import Search from '../components/search/Search.vue'
import MessageHome from '../components/message/MessageHome.vue';
import Chat from '../components/message/Chat.vue'
import User from '../components/user/UserInfo.vue';
import UpdateUserInfo from '../components/user/UpdateUserInfo.vue';
import EditPost from '../components/post/EditPost.vue';
import UpdatePost from '../components/post/UpdatePost.vue';

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
  { path: "/PostDetail/:id", component: PostDetail},
  { path: "/Search", component: Search},
  { path: "/MessageHome", component: MessageHome},
  { path: "/chat/:targetId", component: Chat},
  { path: "/User/:userId", component: User},
  { path: "/UpdateUserInfo", component: UpdateUserInfo},
  { path: "/EditPost", component: EditPost},
  { path: "/UpdatePost/:postId", component: UpdatePost},
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