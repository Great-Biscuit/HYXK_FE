<template>
  <div class="wrapper" v-if="comment != null">
    <div class="comment__wrapper">
      <div class="avatar">
        <el-avatar :size="35" :src="comment.user.headerUrl" @click="handleAvatarClick(comment.user.id)" />
      </div>
      <div class="middle">
        <span class="nickname">{{comment.user.nickname}}</span>
        <p class="text" @click="handleCommentClick(2, comment.id, 0, comment.user.id)">{{comment.commentText}}</p>
        <span class="commentTime">{{comment.commentTime}}</span>
      </div>
      <div class="like">
        <span
          :class="{'iconfont': true, 'like__icon': true, 'like__icon--active': comment.hasLike}"
          v-html="icon"
          @click="handleCommentLikeClick(comment.id, comment.hasLike, comment.user.id)"
        >
        </span>
        <span class="like__count">{{comment.likeCount}}</span>
      </div>
    </div>
    <div class="reply__wrapper" v-if="comment.replyVoList != null">
      <div class="reply__item" v-for="(item, index) in comment.replyVoList" :key="item" v-show="tips === '收起' ? true : (index < 2)">
        <div class="reply__avatar">
          <el-avatar :size="30" :src="item?.user.headerUrl" @click="handleAvatarClick(item?.user.id)" />
        </div>
        <div class="reply__middle">
          <span class="user__nickname">{{item?.user.nickname}}</span>
          <p><span class="reply__tip" v-if="item?.target != null">回复 <span class="target__nickname">{{item?.target.nickname}}</span>: </span><span class="text" @click="handleCommentClick(2, item.id, item.user.id, item.user.id)">{{item?.replyText}}</span></p>
          <span class="replyTime">{{item?.replyTime}}</span>
        </div>
        <div class="reply__like">
          <span
            :class="{'iconfont': true, 'like__icon': true, 'like__icon--active': item?.hasLike}"
            v-html="replyIcon[index]"
            @click="handleReplyLikeClick(comment.id, item?.id, index, item?.hasLike, item?.user.id)"
          >
          </span>
          <span class="like__count">{{item?.likeCount}}</span>
        </div>
      </div>
      <span class="expand__tips" v-show="comment.replyVoList?.length > 2" v-html="tips" @click="handleExpandClick"></span>
    </div>
  </div>
</template>

<script>

import { post } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'Comment',
  props: ['comment', 'postId'],
  data () {
    return {
      icon: '',
      replyIcon: [],
      tips: '',
    }
  },
  mounted () {
    this.handleDataInit()
    this.icon = this.$props.comment.hasLike ? '&#xe668;' : '&#xe669;'
  },
  methods: {
    // 初始化数据
    handleDataInit () {
      if (this.$props.comment.replyVoList) {
        this.$props.comment.replyVoList.forEach((item, index) => {
          if (item.hasLike) {
            this.replyIcon[index] = '&#xe668;'
          } else {
            this.replyIcon[index] = '&#xe669;'
          }
        })
      }
    },
    // 处理点赞评论的事件
    handleCommentLikeClick (commentId, liked, entityUserId) {    
      let formData = new FormData()
      formData.append('postId', this.postId)
      formData.append('entityType', 2)
      formData.append('entityId', commentId)
      formData.append('entityUserId', entityUserId)
      post('/post/like/execute', formData)
        .then(response => {
          if (response.code === 200) {
            if (!liked) {
              this.icon = '&#xe668;'
              this.$emit('changeCommentLiked', commentId, null, true, 1)
            } else {
              this.icon = '&#xe669;'
              this.$emit('changeCommentLiked', commentId, null, false, -1)
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
    // 处理点赞回复的事件
    handleReplyLikeClick (contentId, replyId, index, liked, entityUserId) {
      let formData = new FormData()
      formData.append('postId', this.postId)
      formData.append('entityType', 2)
      formData.append('entityId', replyId)
      formData.append('entityUserId', entityUserId)
      post('/post/like/execute', formData)
        .then(response => {
          if (response.code === 200) {
            if (!liked) {
              this.replyIcon[index] = '&#xe668;'
              this.$emit('changeCommentLiked', contentId, replyId, true, 1)
            } else {
              this.replyIcon[index] = '&#xe669;'
              this.$emit('changeCommentLiked', contentId, replyId, false, -1)
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
    // 展开收起回复
    handleExpandClick () {
      if (this.tips === '收起') {
        this.tips = `展开${this.$props.comment.replyVoList?.length}条回复`
      } else {
        this.tips = '收起'
      }
    },
    // 点击头像进入个人主页
    handleAvatarClick (userId) {
      this.$router.push(`/user/${userId}`)
    },
    // 处理评论点击操作
    handleCommentClick (entityType, entityId, targetId, clickedUser) {
      this.$emit('handleCommentClick', entityType, entityId, targetId, clickedUser)
    },
    // 点赞
    toLike (entityType, entityId, entityUserId) {
      let formData = new FormData()
      formData.append('postId', this.postId)
      formData.append('entityType', entityType)
      formData.append('entityId', entityId)
      formData.append('entityUserId', entityUserId)
      post('/post/like/execute', formData)
        .then(response => {
          if (response.code === 200) {
            return true
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
  .wrapper{
    padding-bottom: 5px;
    border-bottom: 1px solid #f1f1f1;
    margin-top: 10px;
  }
  .comment__wrapper{
    display: flex;
  }
  .avatar{
    width: 35px;
    margin-right: 10px;
  }
  :deep(.el-avatar){
    top: 3px;
  }
  .middle{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
  }
  .nickname{
    color: #888;
    font-size: 14px;
  }
  .text{
    margin: 0;
    font-size: 14px;
    color: #000;
  }
  .commentTime{
    line-height: 14px;
    font-size: 12px;
    color: #a9a9a9;
  }
  .like{
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .like__icon{
    height: 22px;
    font-size: 20px;
    color: #444;
  }
  .like__icon--active{
    color: var(--el-color-danger);
  }
  .like__count{
    font-size: 14px;
    color: #444;
  }

  .reply__wrapper{
    margin: 10px 0 0 45px;
    border-radius: 5px;
    background: #f1f1f1;
    text-align: left;
  }

  .reply__item{
    display: flex;
    padding-bottom: 5px;
  }
  .reply__avatar{
    width: 30px;
    margin: 0 5px 0 2px;
  }
  :deep(.el-avatar){
    top: 5px;
  }
  .reply__middle{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
  }
  .user__nickname{
    color: #888;
    font-size: 14px;
  }
  p{
    margin: 0;
  }
  .reply__tip{
    font-size: 14px;
    color: #000;
  }
  .target__nickname{
    color: #79bbff;
    font-size: 14px;
  }
  .text{
    font-size: 14px;
    color: #000;
  }
  .replyTime{
    line-height: 14px;
    font-size: 12px;
    color: #a9a9a9;
  }
  .reply__like{
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .like__icon{
    height: 22px;
    font-size: 20px;
    color: #444;
  }
  .like__icon--active{
    color: var(--el-color-danger);
  }
  .like__count{
    font-size: 14px;
    color: #444;
  }
  .expand__tips{
    position: relative;
    left: 38px;
    font-size: 12px;
    color: #75a297;
  }
</style>