<template>
  <el-row :gutter="20">
    <el-col :span="3" v-on:click="openMenu">
      <i class="iconfont">&#xe684;</i>
    </el-col>
    <el-col :span="3"></el-col>
    <el-col :span="12" style="font-size : 120%;">{{headerName}}</el-col>
    <el-col :span="3">
      <i class="iconfont" @click.prevent="this.$router.push('/Search')">&#xe65c;</i>
    </el-col>
    <el-col :span="3" v-on:click="toMessageHome">
      <el-badge is-dot :hidden=!hasUnread>
        <i class="iconfont">&#xe630;</i>
      </el-badge>
    </el-col>
  </el-row>
</template>

<script>

import { get } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'Header',
  props: [
    'headerName'
  ],
  components: {
  },
  data () {
    return {
      hasUnread: false
    }
  },
  mounted () {
    this.getUnreadState()
  },
  methods: {
    getUnreadState () {
      get('/user/message/hasUnread')
        .then(response => {
          if (response.code === 200) {
            // 修改消息未读状态的值
            this.hasUnread = response.data
          } else {
            ElNotification({
              title: "错误: " + response.code,
              message: "获取消息状态出现错误:" + response.msg,
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
    toMessageHome () {
      this.$router.push({path: '/MessageHome'})
    },
    openMenu () {
      this.$emit('openMenu')
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
</style>

