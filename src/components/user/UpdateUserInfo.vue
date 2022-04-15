<template>
  <div class="box" v-if="user!==null">
    <div class="header">
      <el-row :gutter="20" class="head-el-row">
          <el-col :span="3" v-on:click="this.$router.back()">
            <i class="iconfont">&#xe66a;</i>
          </el-col>
          <el-col :span="15"></el-col>
          <el-col :span="6">
            <el-button type="primary" round size="default" @click="updateUserInfo">保存</el-button>
          </el-col>
        </el-row>
    </div>
    <div class="avatar">
      <div style="padding-top: 10%;text-align: center;">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="user.headerUrl" :src="user.headerUrl" class="avatar-img" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
    </div>
    <div class="other">
      <el-form
        label-position="top"
        label-width="100px"
        size="large"
        :model="user"
        style="max-width: 460px"
      >
        <el-form-item label="昵称">
          <el-input v-model="user.nickname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="user.gender">
            <el-radio :label="0">
              <span class="iconfont white-bolder-font" style="margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #7a7a7a;">&#xe65e;</span>
            </el-radio>
            <el-radio :label="1">
              <span class="iconfont white-bolder-font" style="margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #00a9ff;">&#xe68d;</span>
            </el-radio>
            <el-radio :label="2">
              <span class="iconfont white-bolder-font" style="margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #fb9b9b;">&#xe68b;</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input
            v-model="user.signature"
            :autosize="{ minRows: 2, maxRows: 3 }"
            type="textarea"
            placeholder="请输入个性签名"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { Plus } from '@element-plus/icons-vue'
import { post } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'UpdateUserInfo',
  components: {
    Plus
  },
  data () {
    return {
      user: null
    }
  },
  mounted () {
    this.getHolderInfo()
  },
  methods: {
    getHolderInfo () {
      post('/user/action/getHolderInfo')
        .then(response => {
          if (response.code === 200) {
            this.user = response.data
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
    updateUserInfo () {
      // 修改用户信息
      post('/user/action/updateInfo', this.user)
        .then(response => {
          if (response.code === 200) {
            ElNotification({
              title: "成功",
              message: "修改用户信息成功",
              type: 'success',
              duration: 2000,
            })
            // 跳回用户详情页
            this.$router.back()
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
    }
  }
}
</script>

<style scoped>
.box {
	width: 100vw;
	height: 100vh;
  margin: -8px;
}
.header {
  height: 10%;
}
.avatar {
  height: 30%;
}
.other {
  height: 60%;
  padding: 0 25px;
}
.iconfont {
  font-size: 25px;
}
.white-bolder-font {
  font-family:黑体;
  font-size: 16px;
  font-weight:bolder;
  color: white;
}
.head-el-row {
  text-align: center;
  padding: 10px 15px;
  margin: 0!important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar-img {
  height: 125px;
  width: 125px;
  border-radius: 50%;
}
.el-form-item {
  margin-bottom: 50px;
}
:deep(.el-form-item__label) {
  font-family:黑体;
  font-size: 18px;
  font-weight:bolder;
}
</style>
