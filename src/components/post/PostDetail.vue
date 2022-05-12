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
          <el-avatar :size="39" :src="postInfo.author.headerUrl" @click="this.$router.push(`/User/${postInfo.author.id}`)" />
          <span class="nickname">{{postInfo.author.nickname}}</span>
          <span class="time">{{postInfo.post.createTime}}</span>
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
            <el-col :span="6" v-on:click="handleCommentClick(1, postInfo.post.id, 0, null)">
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
        <div class="comments" v-if="postInfo.commentVoList != null">
          <!-- 评论列表 -->
          <div v-for="item in postInfo.commentVoList" :key="item.id">
            <comment :comment="item" :postId="postId" @changeCommentLiked="changeCommentLiked" @handleCommentClick="handleCommentClick"/>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 帖子操作 -->
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
    <!-- 评论操作 -->
    <el-drawer
    v-model="commentActionDrawer"
    :direction="direction" 
    size="10%" 
    :with-header="false"
    >
      <el-row>
        <el-col :span="11" @click="openCommentBox">
          <span style="color: #337ecc;">评论</span>
        </el-col>
        <el-col :span="2">
          <el-divider direction="vertical" />
        </el-col>
        <el-col :span="11" @click="deleteComment">
          <span style="color: red;">删除</span>
        </el-col>
      </el-row>
    </el-drawer>
    <!-- 评论发布处 -->
    <el-drawer
    v-model="commentDrawer"
    :direction="direction" 
    size="72px" 
    :with-header="false"
    >
      <el-row class="comment-el-row">
        <el-col :span="18">
          <el-input size="default" v-model="comment.content" placeholder="说点什么吧~" />
        </el-col>
        <el-col :span="6">
          <el-button size="default" type="primary" round plain @click="sendComment">发送</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>

import { get, post } from '../../utils/axios'
import { ElNotification } from 'element-plus'
import Comment from '../post/Comment.vue'
import moment from 'moment'

export default {
  name: 'PostDetail',
  components: {
    Comment
  },
  data () {
    return {
      holderId: null,
      postId: null,
      postInfo: null,
      drawer: false,
      direction: "btt",
      comment: {
        entityType: null, 
        entityId: null, 
        targetId: null,
        content: ''
      },
      commentActionDrawer: false,
      commentDrawer: false,
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
            this.holderId = response.msg
            const detail = response.data

            const currentTime = moment()
            // 格式化评论、回复的时间
            detail.commentVoList.map((comment) => {
              if (currentTime.valueOf() - moment(comment.commentTime).valueOf() < 129600000) { // 36小时内，显示xx秒/分钟/小时/天前
                comment.commentTime = moment(comment.commentTime).fromNow()
              } else if (currentTime.get('year') === moment(comment.commentTime).get('year')) { // 超过36小时，显示月日
                comment.commentTime = moment(comment.commentTime).format('MM-DD')
              } else { // 超过一年，显示年月日
                comment.commentTime = moment(comment.commentTime).format('YYYY-MM-DD')
              }
              comment.replyVoList.map((item) => {
                if (currentTime.valueOf() - moment(item.replyTime).valueOf() < 129600000) { // 36小时内
                  item.replyTime = moment(item.replyTime).fromNow()
                } else if (currentTime.get('year') === moment(item.replyTime).get('year')) { // 超过36小时，显示月日
                  item.replyTime = moment(item.replyTime).format('MM-DD')
                } else { // 超过一年，显示年月日
                  item.replyTime = moment(item.replyTime).format('YYYY-MM-DD')
                }
                return item
              })
              return comment
            })
            // 格式化笔记时间
            console.log(moment(detail.post.createTime).format('YY-MM-DD HH:mm:ss'))
            if (currentTime.valueOf() - moment(detail.post.createTime).valueOf() < 129600000) { // 36小时内，显示xx秒/分钟/小时/天前
              detail.post.createTime = moment(detail.post.createTime).fromNow()
            } else if (currentTime.get('year') === moment(detail.post.createTime).get('year')) { // 超过36小时，显示月日
              detail.post.createTime = moment(detail.post.createTime).format('MM-DD')
            } else { // 超过一年，显示年月日
              detail.post.createTime = moment(detail.post.createTime).format('YYYY-MM-DD')
            }

            this.postInfo = detail
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
      let formData = new FormData()
      formData.append('postId', this.postId)
      formData.append('entityType', entityType)
      formData.append('entityId', entityId)
      formData.append('entityUserId', entityUserId)
      post('/post/like/execute', formData)
        .then(response => {
          if (response.code === 200) {
            // 对帖子点赞则修改页面显示
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
    toCollect (entityType, entityId, entityUserId) {
      let formData = new FormData()
      formData.append('entityType', entityType)
      formData.append('entityId', entityId)
      if (this.postInfo.hasCollect) {
        // 已收藏, 现在是取消收藏
        post('/post/follow/unfollow', formData)
        .then(response => {
          if (response.code === 200) {
            this.postInfo.collectCount--
            this.postInfo.hasCollect = !this.postInfo.hasCollect
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
      } else {
        formData.append('entityUserId', entityUserId)
        // 收藏
        post('/post/follow/toFollow', formData)
        .then(response => {
          if (response.code === 200) {
            this.postInfo.collectCount++
            this.postInfo.hasCollect = !this.postInfo.hasCollect
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
    },
    // 对评论或回复点赞取消
    changeCommentLiked (contentId, replyId, liked, count) {
      this.postInfo.commentVoList = this.postInfo.commentVoList.map((comment) => {
        if (comment.id === contentId) {
          if (replyId) { // 如果传入了回复id，表示在对回复进行点赞取消操作
            comment.replyVoList = comment.replyVoList.map((item) => {
              if (item.id === replyId) {
                item.hasLike = liked
                item.likeCount += count
              }
              return item
            })
          } else { // 对评论进行点赞取消操作
            comment.hasLike = liked
            comment.likeCount += count
          }
        }
        return comment
      })
    },
    // 打开操作框
    openActionBox () {
      this.drawer = true
    },
    // 删除帖子
    deletePost () {
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
    },
    // 处理评论点击操作
    handleCommentClick (entityType, entityId, targetId, clickedUser) {
      this.comment.content = ''
      this.comment.entityType = entityType
      this.comment.entityId = entityId
      this.comment.targetId = targetId
      if (this.holderId === clickedUser) {
        // 如果当前用户点击自己发出的评论, 就可能是要删除评论
        this.commentActionDrawer = true
      } else {
        this.commentDrawer = true
      }
    },
    // 发送评论
    sendComment () {
      if (this.comment.content === '') {
        return
      }
      let formData = new FormData()
      formData.append('entityType', this.comment.entityType)
      formData.append('entityId', this.comment.entityId)
      formData.append('targetId', this.comment.targetId)
      formData.append('content', this.comment.content)
      post('/post/comment/addComment', formData)
        .then(response => {
          if (response.code === 200) {
            ElNotification({
              title: "成功",
              message: "成功发布评论!",
              type: 'success',
              duration: 2000,
            })
            // 刷新页面
            this.$router.go(0)
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
    // 打开评论发布处
    openCommentBox () {
      this.commentActionDrawer = false
      this.commentDrawer = true
    },
    deleteComment () {
      let formData = new FormData()
      formData.append('commentId', this.comment.entityId)
      post('/post/comment/deleteComment', formData)
        .then(response => {
          if (response.code === 200) {
            ElNotification({
              title: "成功",
              message: "成功删除评论!",
              type: 'success',
              duration: 2000,
            })
            // 刷新页面
            this.$router.go(0)
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
  position: relative;
  width: 92%;
  height: 39px;
  line-height: 39px;
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
.time{
  position: absolute;
  right: 0;
  margin-left: 20px;
  font-size: 12px;
  color: #a1a1a1;
}
.content {
  width: 96%;
  margin: 2%;
}
.comments {
  padding: 20px;
}
.comment-el-row {
  padding: 0;
}
:deep(.el-input__inner) {
  border-radius: 16px;
  box-shadow: none;
  background: #f1f1f1;
}
:deep(.el-input__inner:focus) {
  box-shadow: none;
}
:deep(.el-button:focus, .el-button:hover, el-button:active){
  color: var(--el-button-text-color);
  border-color: var(--el-button-border-color);
  background-color: var(--el-button-bg-color);
}
</style>
