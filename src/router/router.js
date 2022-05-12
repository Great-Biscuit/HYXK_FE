import { createRouter, createWebHistory } from "vue-router"

//1. 定义要使用到的路由组件  （一定要使用文件的全名，得包含文件后缀名）
import Home from '../components/home/Home.vue';
import Announcement from '../components/home/Announcement.vue';
import QA from '../components/home/QA.vue';
import ConfessionWall from '../components/home/ConfessionWall.vue';
import Login from '../components/login/Login.vue';
import Register from '../components/register/Register.vue';
import FindUsername from '../components/login/FindUsername.vue';
import FindPassword from '../components/login/FindPassword.vue';
import PostDetail from '../components/post/PostDetail.vue';
import Search from '../components/search/Search.vue'
import MessageHome from '../components/message/MessageHome.vue';
import LikeNotice from '../components/message/LikeNotice.vue'
import CollectNotice from '../components/message/CollectNotice.vue'
import CommentNotice from '../components/message/CommentNotice.vue'
import FollowNotice from '../components/message/FollowNotice.vue'
import Chat from '../components/message/Chat.vue'
import User from '../components/user/UserInfo.vue';
import UpdateUserInfo from '../components/user/UpdateUserInfo.vue';
import EditPost from '../components/post/EditPost.vue';
import UpdatePost from '../components/post/UpdatePost.vue';
import AdminHome from '../components/admin/AdminHome.vue';

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
  { path: "/Announcement", component: Announcement},
  { path: "/QA", component: QA},
  { path: "/ConfessionWall", component: ConfessionWall},
  { path: "/PostDetail/:id", component: PostDetail},
  { path: "/Search", component: Search},
  { path: "/MessageHome", component: MessageHome},
  { path: "/LikeNotice", component: LikeNotice},
  { path: "/CollectNotice", component: CollectNotice},
  { path: "/CommentNotice", component: CommentNotice},
  { path: "/FollowNotice", component: FollowNotice},
  { path: "/chat/:targetId", component: Chat},
  { path: "/User/:userId", component: User},
  { path: "/UpdateUserInfo", component: UpdateUserInfo},
  { path: "/EditPost", component: EditPost},
  { path: "/UpdatePost/:postId", component: UpdatePost},
  { path: "/AdminHome", component: AdminHome},
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