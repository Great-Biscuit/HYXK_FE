<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-main>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">最新</el-menu-item>
        <el-menu-item index="0">热门</el-menu-item>
      </el-menu>
      <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
        <li v-for="postVo in postList" :key="postVo" class="infinite-list-item">
          <PostIntro :postVo="postVo" />
        </li>
      </ul>
    </el-main>
    <el-footer>
      <Footer/>
    </el-footer>
  </el-container>
</template>

<script>

import Footer from './Footer.vue'
import Header from './Header.vue'
import PostIntro from './PostIntro.vue'
import { post } from '../../utils/axios'
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
      postList : []
    }
  },
  methods: {
    load () {
      let formData = new FormData()
      formData.append('userId', 0)
      formData.append('type', this.activeIndex)
      formData.append('offset', this.count)
      formData.append('limit', 8)
      formData.append('orderMode', 0)
      post('/post-public/queryAll', formData)
        .then(response => {
          if (response.code === 200) {
            // 每次取8条
            this.postList.push(...response.data);
            this.count += response.data.length;
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
    handleSelect (index) {
      // 重置数据
      this.activeIndex = index;
      this.count = 0;
      this.postList = [];
      this.load();
    }
  }
}
</script>

<style scoped>
.el-container {
  background-size: 100% 100%;
	width:100vw;
	height:100vh;
  margin: -8px;
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
  padding: 10px 15px;
}
.infinite-list {
  height: 94%;
  padding: 0;
  list-style: none;
  margin: 1%;
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
</style>