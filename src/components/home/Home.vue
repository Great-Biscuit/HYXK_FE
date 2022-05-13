<template>
  <el-container>
    <el-header>
      <Header @openMenu="openMenu" headerName="首页"/>
    </el-header>
    <el-main  v-loading="loading">
      <el-tabs
        v-model="activeIndex"
        class="el-menu-demo"
        @tab-click="handleSelect"
        :stretch="true"
      >
        <el-tab-pane label="热门" name="1"></el-tab-pane>
        <el-tab-pane label="最新" name="0"></el-tab-pane>
        <el-tab-pane label="关注" name="-1" v-if="holderUserId !== null"></el-tab-pane>
      </el-tabs>
      <ul v-if="postList !== null && postList.length !== 0" v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
        <li v-for="postVo in postList" :key="postVo" class="infinite-list-item">
          <PostIntro :postVo="postVo" />
        </li>
      </ul>
      <el-empty v-else description="啥也没有~" />
    </el-main>
    <el-footer>
      <Footer/>
    </el-footer>
  </el-container>
  <el-drawer
    v-model="drawer"
    title="✨皓月星空站"
    :direction="direction" 
    size="75%" 
  >
    <div class="menu-item">
      <span class="menu-item-content" @click="this.$router.push({path: '/Home'})">🔭首页</span>
    </div>
    <div class="menu-item">
      <span class="menu-item-content" @click="this.$router.push({path: '/Announcement'})">📫公告</span>
    </div>
    <div class="menu-item">
      <span class="menu-item-content" @click="this.$router.push({path: '/QA'})">💬问答</span>
    </div>
    <div class="menu-item">
      <span class="menu-item-content" @click="this.$router.push({path: '/ConfessionWall'})">🌱表白墙</span>
    </div>
    <div class="developer-info">
      Developed By <span onclick="javascript:window.open('https://www.greatbiscuit.top/')" class="developer-name">GreatBiscuit</span>
    </div>
  </el-drawer>
</template>

<script>

import Footer from './Footer.vue'
import Header from './Header.vue'
import PostIntro from './PostIntro.vue'
import { get, post } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    PostIntro
  },
  data () {
    return {
      activeIndex : "1",
      count : 0,
      postList : [],
      drawer: false,
      direction: "ltr",
      holderUserId: null,
      userId: 0,
      loading: true
    }
  },
  mounted() {
    this.load()
    this.getHolderUserId()
  },
  methods: {
    load () {
      post('/post-public/queryAllByLimit', {
        userId: this.userId,
        type: 0,
        offset: this.count,
        limit: 10,
        orderMode: this.activeIndex
      })
        .then(response => {
          if (response.code === 200) {
            this.postList.push(...response.data);
            this.count += response.data.length;
            this.loading = false
          } else {
            ElNotification({
              title: "错误: " + response.code,
              message: response.msg,
              type: 'error',
              duration: 2000,
            })
          }
        })
        .catch(() => {
            ElNotification({
              title: "错误",
              message: "发生错误!",
              type: 'error',
              duration: 2000,
            })
        })
    },
    handleSelect () {
      if (this.activeIndex === '-1') {
        if (this.holderUserId === null) {
          ElNotification({
            title: "错误",
            message: "未登录!",
            type: 'error',
            duration: 2000,
          })
          this.$router.push({path: '/Login'})
        } else {
          this.userId = this.holderUserId
        }
      } else {
        this.userId = 0
      }
      // 重置数据
      this.loading = true
      this.count = 0;
      this.postList = [];
      this.load();
    },
    openMenu () {
      this.drawer = true
    },
    getHolderUserId () {
      get('/user/action/getHolderUserId')
        .then(response => {
          if (response.code === 200) {
            this.holderUserId = response.data
          } else {
            ElNotification({
              title: "错误: " + response.code,
              message: "获取当前用户信息出错:" + response.msg,
              type: 'error',
              duration: 2000,
            })
          }
        })
        .catch(() => {
            ElNotification({
              title: "错误",
              message: "发生错误!",
              type: 'error',
              duration: 2000,
            })
        })
    },
  }
}
</script>

<style scoped>
.el-container {
  background-size: 100% 100%;
	width:100vw;
	height:100vh;
  margin: -8px;
  overflow: hidden;
}
.el-header {
  height: 50px;
  padding: 10px 20px;
}
.el-main {
  height: auto;
  padding: 0;
  overflow: hidden;
}
.el-menu-demo {
  height: 5%;
}
.el-footer {
  height: 49px;
  line-height: 49px;
  border-top: 1px solid #a1a1a1;
}
.infinite-list {
  height: 95%;
  padding: 0;
  list-style: none;
  margin-top: 0;
}
.infinite-list .infinite-list-item {
  display: flex;
  height: 120px;
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
.menu-item {
  margin-bottom: 50px;
}
.menu-item-content {
  font-family:黑体;
  font-size: 18px !important;
  font-weight:bolder;
  letter-spacing: 3px;
}
.developer-info {
  text-align: center;
  font-family:"Times New Roman";
  position: relative;
  bottom: -45%;
}
.developer-name {
  font-size: 18px !important;
  font-weight:bolder;
  color: #0095ffc7;
}
</style>