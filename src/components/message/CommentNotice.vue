<template>
  <div class="wrapper">
    <div class="header">
      <div class="back">
        <span class="iconfont back__icon" @click="handleBackClick">&#xe66a;</span>
      </div>
      <span class="title">收到的评论和回复</span>
    </div>
    <div class="content__wrapper" v-loading="loading">
      <el-empty description="还没有任何通知哟~" v-if="isEmpty" />
      <div v-for="item in commentNoticeList" :key="item.id" class="notice__item" @click="handleNoticeClick(item.postId)">
        <span class="notice__avatar">
          <el-badge is-dot :hidden="item.isUnread === false">
            <el-avatar :size="40" :src="item.from.headerUrl" />
          </el-badge>
        </span>
        <div class="notice__wrapper">
          <div class="notice__middle">
            <div>
              <span class="notice__nickname">{{ item.from.nickname }}</span>
              <span class="notice__type" v-if="item.type === 'comment'">评论了你：</span>
              <span class="notice__type" v-else>回复了你：</span>
            </div>
            <span class="notice__content">{{ item.content }}</span>
            <span class="notice__time">{{item.time}}</span>
          </div>
          <div class="notice__right" v-if="item.targetEntity.headerImg && item.targetEntity.comment">
            <el-image style="width: 55px; height: 55px" :src="item.targetEntity.headerImg" fit="cover" v-if="item.targetEntity.headerImg"></el-image>
            <span class="notice__target" v-else>{{item.targetEntity.comment}}</span>
          </div>
        </div>
      </div>
      <span class="noMore" v-if="commentNoticeList.length">没有更多啦~</span>
    </div>
  </div>
</template>

<script>
import { post } from '../../utils/axios'
import { ElNotification } from 'element-plus'
import moment from 'moment'

export default {
  name: 'CommentNotice',
  data () {
    return {
      commentNoticeList: [], // 评论通知列表
      loading: true, // 加载中
      isEmpty: false // 有无通知
    }
  },
  mounted () {
    this.getCommentNoticeList()
  },
  methods: {
    handleBackClick() {
      this.$router.back()
    },
    // 获取评论通知列表
    getCommentNoticeList() {
      const formData = new FormData()
      formData.append('type', 'comment')

      post('/user/message/getNoticeList', formData)
        .then(response => {
          if (response.code === 200 && response.data) {
            let list = response.data
            if (!list.length) {
              this.isEmpty = true
            }
            list = list.map(item => {
              const currentTime = moment()
              const isCurrentDay = currentTime.get('date') === moment(item.time).get('date') // 日期是否为今天
              const isCurrentMonth = currentTime.get('month') === moment(item.time).get('month') // 日期是否为本月
              const isCurrentYear = currentTime.get('year') === moment(item.time).get('year') // 日期是否为今年
              if (isCurrentDay && isCurrentMonth && isCurrentYear) { // 今天内的通知，显示时间
                item.time = moment(item.time).format('HH:mm')
              } else if (isCurrentYear) { // 今年内，显示具体月日
                item.time = moment(item.time).format('MM-DD')
              } else { // 不是本年，显示年月日
                item.time = moment(item.time).format('YY-MM-DD')
              }
              return item
            })
            console.log('格式化时间后的评论列表', list)
            this.commentNoticeList = [...list]
            this.loading = false // 关闭加载
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
    // 点击通知进入对应帖子
    handleNoticeClick(postId) {
      this.$router.push(`/PostDetail/${postId}`)
    }
  }
}
</script>

<style scoped>
  .wrapper{
    width: 100vw;
    height: 100vh;
    margin: -8px;
  }
  .header{
    width: 100%;
    height: 49px;
    line-height: 49px;
    margin: 0;
    padding: 0;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid #f1f1f1;
    background: #fff;
  }
  .back{
    position: absolute;
    width: 50px;
    height: 49px;
  }
  .back__icon{
    top: 0;
    color: #000;
  }
  .title{
    font-size: 16px;
    background: #fff;
    color: #000;
  }
  .content__wrapper{
    height: calc(100vh - 50px);
    text-align: center;
    overflow: auto;
  }
  .el-empty{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .notice__item{
    display: flex;
    padding-top: 10px;
  }

  .notice__avatar{
    margin: 0 15px;
  }
  :deep(sup){
    right: 50px;
  }
  .notice__wrapper{
    flex: 1;
    display: flex;
    margin-right: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #f1f1f1;
    overflow: hidden;
  }
  .notice__middle{
    flex: 1;
    text-align: left;
    overflow: hidden;
  }
  .notice__nickname{
    font-size: 14px;
    color: #000;
    margin-right: 3px;
  }
  .notice__type{
    font-size: 14px;
    color: #a9a9a9;
  }
  .tips__icon{
    display: block;
    font-size: 14px;
    color: #a9a9a9;
  }
  .notice__content{
    margin: 2px 0;
    font-size: 12px;
    color: #a9a9a9;
    display: inline-block;
    max-width: 100%;
    
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow:hidden;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
  }
  .notice__time{
    font-size: 12px;
    color: #a9a9a9;
  }
  .notice__right{
    width: 55px;
    height: 55px;
    margin-left: 10px;
    font-size: 13px;
    color: #a9a9a9;
    background: #f1f1f1;
    
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    overflow:hidden;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
  }
  .noMore{
    display: inline-block;
    margin: 15px 0;
    font-size: 12px;
    color: rgba(0,0,0,0.4);
  }
</style>
