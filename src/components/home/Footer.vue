<template>
  <el-row :gutter="20">
    <el-col :span="8" v-on:click="toHome">
      <i class="iconfont">&#xe6bb;</i>
    </el-col>
    <el-col :span="8" v-on:click="toAddPost">
      <i class="iconfont add-post">&#xe600;</i>
    </el-col>
    <el-col :span="8" v-on:click="toUserPage">
      <i class="iconfont">&#xe607;</i>
    </el-col>
  </el-row>
</template>

<script>

import { get } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'Footer',
  components: {
  },
  methods: {
    // 跳到首页
    toHome () {
      this.$router.push({path: '/Home'})
    },
    // 当前用户登录就跳到用户页, 否则跳到登录页
    toUserPage () {
      get('/user/action/getHolderUserId')
        .then(response => {
          if (response.code === 200) {
            if(response.data === null || response.data === 0) {
              this.$router.push({path: '/Login'})
            } else {
              this.$router.push({path: '/User/' + response.data})
            }
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
    // 跳转到发布帖子页面
    toAddPost () {
      this.$router.push({path: '/EditPost'})
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  text-align: center;
}
.el-row:last-child {
  margin-bottom: 0;
}
.iconfont {
  font-size: 25px;
}
.add-post {
  background-color: #006affa1;
  padding: 5px;
  border-radius: 25%;
}
</style>
