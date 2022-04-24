<template>
  <div class="box" v-if="user !== null && post !== null">
    <div class="above">
      <el-row class="head">
        <el-col :span="3" v-on:click="this.$router.back()">
            <i class="iconfont">&#xe66a;</i>
          </el-col>
          <el-col :span="18">编辑帖子</el-col>
          <el-col :span="3">
            <el-button type="info" @click="updatePost" round>保存</el-button>
          </el-col>
      </el-row>
      <el-row class="main-message">
        <el-col :span="16">
          <div>
            <el-input v-model="post.title" placeholder="标题" style="margin-bottom: 10px;" />
            <el-select v-if="user.type === 0" v-model="post.type" class="m-2" placeholder="类型选择" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-else v-model="post.type" class="m-2" placeholder="类型选择" style="width: 100%;">
              <el-option
                v-for="item in optionsAdmin"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="text-align: center;height: 100%;">
            <el-upload
              class="header-imag-uploader"
              action="https://upload-z2.qiniup.com"
              :data="uploadToken"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="post.headImg" :src="post.headImg" class="header-img" />
              <el-icon v-else class="header-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="under">
      <v-md-editor v-model="post.markdownContent" height="100%"
      left-toolbar="undo redo | bold italic table"
      right-toolbar="image link emoji "
      :disabled-menus="[]"
      @upload-image="handleUploadImage"
      ></v-md-editor>
    </div>
  </div>
</template>

<script>

import { Plus } from '@element-plus/icons-vue'
import { get, post } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'UpdatePost',
  components: {
    Plus
  },
  data () {
    return {
      user: null,
      post: {
        title: null,
        markdownContent: '',
        headImg: null,
        type: null
      },
      optionsAdmin: [
        {
          value: 0,
          label: '文章',
        },
        {
          value: 1,
          label: '公告',
          disabled: false
        },
        {
          value: 2,
          label: '问答',
        },
        {
          value: 3,
          label: '表白墙',
        },
      ],
      options: [
        {
          value: 0,
          label: '文章',
        },
        {
          value: 2,
          label: '问答',
        },
        {
          value: 3,
          label: '表白墙',
        },
      ],
      uploadToken: {
        token: null
      },
    }
  },
  mounted () {
    this.getPostInfo(this.$route.params.postId)
    this.getHolderInfo()
    this.getUploadImageToken()
  },
  methods: {
    // 获取当前帖子信息
    getPostInfo (postId) {
      post('/post/action/getPostForUpdate/' + postId)
        .then(response => {
          if (response.code === 200) {
            this.post = response.data
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
    // 获取上传图片凭证
    getUploadImageToken () {
      get("/post/action/getUploadImageToken")
      .then(response => {
          if (response.code === 200) {
            this.uploadToken.token = response.data
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
    // 获取当前用户信息
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
    // 上传头图前先处理类型
    beforeAvatarUpload (rawFile) {
      if (rawFile.type !== 'image/jpeg') {
        ElNotification({
              title: "错误",
              message: "仅支持jpg格式图片",
              type: 'error',
              duration: 2000,
            })
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElNotification({
              title: "错误",
              message: "图片大小不能超过2M",
              type: 'error',
              duration: 2000,
            })
        return false
      }
      return true
    },
    // 上传头图后修改路径
    handleAvatarSuccess (res) {
      this.post.headImg = 'http://images.hyxk.xyz/' + res.key
    },
    // 文章中的图片
    handleUploadImage(event, insertImage, files) {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      let formData = new FormData()
      formData.append('token', this.uploadToken.token)
      formData.append('file', files[0])
      post('https://upload-z2.qiniup.com/', formData)
        .then(response => {
          if (response !== null) {
            insertImage({
              url: 'http://images.hyxk.xyz/' + response.key,
              desc: '图片',
              width: 'auto',
              height: 'auto',
            });
          } else {
            ElNotification({
              title: "错误:",
              message: response,
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
    updatePost () {
      // 发布文章
      let formData = new FormData()
      formData.append('id', this.post.id)
      formData.append('title', this.post.title)
      formData.append('markdownContent', this.post.markdownContent)
      formData.append('headImg', this.post.headImg)
      formData.append('type', this.post.type)
      post('/post/action/updatePost', formData)
        .then(response => {
          if (response.code === 200) {
            ElNotification({
              title: "成功修改",
              message: "系统处理可能需要一些时间, 请稍后...",
              type: 'success',
              duration: 2000,
            })
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
	width:100vw;
	height:100vh;
  margin: -8px;
}
.above {
  height: 15%;
}
.under {
  height: 85%;
}
.head {
  height: 40%;
  text-align: center;
  padding: 5px 15px;
  margin: 0!important;
}
.main-message {
  height: 60%;
  padding: 0 10px;
}
.header-imag-uploader {
  height: 100%;
}
.header-img {
  width: 60px;
  height: 60px;
  display: block;
}
.header-imag-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.header-imag-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.header-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  text-align: center;
}
</style>
