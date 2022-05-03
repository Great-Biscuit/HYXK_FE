<template>
  <div class="box">
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="3" v-on:click="this.$router.back()">
          <i class="iconfont">&#xe66a;</i>
        </el-col>
        <el-col :span="18">帖子详情</el-col>
        <el-col :span="3">
          <i class="iconfont" @click="openActionBox">&#xe612;</i>
        </el-col>
      </el-row>
    </div>
    <el-scrollbar>
      <div class="post-info" v-if="postInfo != null">
        <h2 style="margin: 10px;">{{ postInfo.post.title }}</h2>
        <div class="author">
          <el-avatar :size="39" :src="postInfo.author.headerUrl" />
          <span class="nickname">{{postInfo.author.nickname}}</span>
        </div>
        <el-divider style="margin: 0;"></el-divider>
        <div class="content" v-html="postInfo.post.htmlContent"></div>
        <el-divider style="margin: 0;"></el-divider>
        <div>
          <el-row :gutter="20">
            <el-col :span="6" v-on:click="toLike(1, postInfo.post.id, postInfo.author.id)">
              <i class="iconfont" v-if="!postInfo.hasLike">&#xe669;</i>
              <i class="iconfont" v-if="postInfo.hasLike" style="color:red;">&#xe668;</i>
              {{ postInfo.likeCount }}
            </el-col>
            <el-col :span="3"><el-divider direction="vertical" /></el-col>
            <el-col :span="6" v-on:click="toComment">
              <i class="iconfont">&#xe741;</i>
              {{ postInfo.post.comments }}
            </el-col>
            <el-col :span="3"><el-divider direction="vertical" /></el-col>
            <el-col :span="6" v-on:click="toCollect(1, postInfo.post.id, postInfo.author.id)">
              <i class="iconfont" v-if="!postInfo.hasCollect">&#xe64c;</i>
              <i class="iconfont" v-if="postInfo.hasCollect" style="color:#ff9c00;">&#xe64b;</i>
              {{ postInfo.collectCount }}
            </el-col>
          </el-row>
        </div>
        <el-divider style="margin: 0;"></el-divider>
        <div class="comment" v-if="postInfo.commentVoList != null">
          <ul>
            <li v-for="commentVo in postInfo.commentVoList" :key="commentVo" class="comment-li">
              <div>
                <span class="comment-user">{{ commentVo.user.nickname }}</span>:
                {{ commentVo.commentText }}
              </div>
              <div v-if="commentVo.replyVoList != null">
                <ul>
                  <li v-for="replyVo in commentVo.replyVoList" :key="replyVo"  class="reply-li">
                    <div>
                      <span class="comment-user">{{ replyVo.user.nickname }}</span>
                      <span v-if="replyVo.target != null">
                        回复
                        <span class="comment-user">{{ replyVo.target?.nickname }}</span>
                      </span>:
                      {{ replyVo.replyText }}
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-scrollbar>
    <el-drawer
    v-model="drawer"
    :direction="direction" 
    size="10%" 
    :with-header="false"
    >
      <el-row>
        <el-col :span="11" @click="toUpdatePost">
          <span style="color: #337ecc;">编辑</span>
        </el-col>
        <el-col :span="2">
          <el-divider direction="vertical" />
        </el-col>
        <el-col :span="11" @click="deletePost">
          <span style="color: red;">删除</span>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>

import { get, post } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'PostDetail',
  components: {
  },
  data () {
    return {
      postId: null,
      postInfo: null,
      drawer: false,
      direction: "btt"
    }
  },
  mounted () {
    this.postId = this.$route.params.id
    this.initData()
  },
  methods: {
    initData () {
      get('/post/action/detail/' + this.postId)
        .then(response => {
          if (response.code === 200) {
            this.postInfo = response.data
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
    toLike (entityType, entityId, entityUserId) {
      if (entityType === 1) {
        if (this.postInfo.hasLike) {
          // 已点赞, 现在是取消
          this.postInfo.likeCount--
        } else {
          // 进行点赞
          this.postInfo.likeCount++
        }
        this.postInfo.hasLike = !this.postInfo.hasLike
      }
      console.log(entityType)
      console.log(entityId)
      console.log(entityUserId)
    },
    toComment () {
      
    },
    toCollect (entityType, entityId, entityUserId) {
      if (this.postInfo.hasCollect) {
        // 已收藏, 现在是取消收藏
        this.postInfo.collectCount--
      } else {
        // 收藏
        this.postInfo.collectCount++
      }
      this.postInfo.hasCollect = !this.postInfo.hasCollect
      console.log(entityType)
      console.log(entityId)
      console.log(entityUserId)
    },
    openActionBox () {
      // 打开操作框
      this.drawer = true
    },
    deletePost () {
      // 删除帖子
      let formData = new FormData()
      formData.append('postId', this.postId)
      post('/post/action/deletePost', formData)
        .then(response => {
          if (response.code === 200) {
            // 删除成功, 返回上一页
            ElNotification({
              title: "成功",
              message: "成功删除帖子!",
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
    },
    toUpdatePost () {
      // 去编辑帖子
      this.$router.push({path: '/UpdatePost/' + this.postId})
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
.head {
  height: 5%;
  padding: 0px 15px;
}
.el-scrollbar {
  height: 95%;
}
.el-row {
  text-align: center;
  padding: 10px 0;
  margin: 0!important;
}
.el-row:last-child {
  margin-bottom: 0;
}
.iconfont {
  font-size: 25px;
}
.author{
  width: 92%;
  height: 39px;
  margin: 4%;
}
.nickname{
  margin-left: 8px;
  width: 50%;
  display: inline-block;
  font-size: 20px !important;
  white-space: nowrap;  /*限制一行内显示文本*/
  overflow: hidden;     /*隐藏超出的部分*/
  text-overflow: ellipsis;  /*超出的部分用省略号替代*/
}
.content {
  width: 96%;
  margin: 2%;
}
ul {
  padding-inline-start: 20px;
  margin-inline-end: 10px;
}
li {
  list-style: none;
}
.comment-user {
  color: #0044ff;
}
.comment-li {
  margin-top: 15px;
}
.reply-li {
  margin-top: 5px;
}
</style>
