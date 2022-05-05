<template>
  <!-- 普通用户不让看 -->
  <el-container class="box" v-if="holder != null && holder.type != 0">
    <el-header class="admin-header">
      <span>皓月星空站后台管理系统</span>
    </el-header>
    <el-container>
      <el-aside width="200px" class="admin-aside">
        <!-- 当前管理员信息 -->
        <div class="holder-info">
          <br/>
          <el-avatar :size="80" :src="holder.headerUrl" />
          <br/><br/>
          <span style="font-family:黑体;font-size: 20px;">{{holder.nickname}}</span>
          <el-divider />
        </div>
        <div>
          <el-menu
            :default-active="activeIndex"
            @select="handleSelect"
          >
            <el-menu-item index="1" class="menu-item">
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="2" class="menu-item">
              <span>系统状态</span>
            </el-menu-item>
            <el-menu-item index="3" class="menu-item">
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="4" class="menu-item">
              <span>帖子管理</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main class="admin-main">
        <AdminInfo v-if="activeIndex === '1'" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import { post } from '../../utils/axios'
import { ElNotification } from 'element-plus'
import AdminInfo from './AdminInfo'

export default {
  name: 'AdminHome',
  components: {
    AdminInfo
  },
  data () {
    return {
      holder: null,
      activeIndex: '1',
    }
  },
  mounted () {
    this.getHolderInfo()
  },
  methods: {
    // 获取当前用户信息
    getHolderInfo () {
      post('/user/action/getHolderInfo')
        .then(response => {
          if (response.code === 200) {
            this.holder = response.data
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
      this.activeIndex = index
    },
  }
}
</script>

<style scoped>
.box {
	width:100vw;
	height:100vh;
  margin: -8px;
}
.admin-header {
  background: url('http://images.hyxk.xyz/HYXK.jpg') no-repeat;
  background-size: 100% 100%;
  font-size: 39px;
  font-family:黑体;
  font-weight:bolder;
  padding: 5px 50px;
}
.admin-aside {
  border-style: solid;
  border-width: 1px;
}
.admin-main {
  border-top-style: solid;
  border-width: 1px;
}
.holder-info {
  text-align: center;
}
.menu-item {
  font-weight:bolder;
  font-family:黑体;
  font-size: 20px;
  margin-bottom: 26px;
}
</style>
