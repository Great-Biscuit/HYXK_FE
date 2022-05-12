<template>
  <div class="box">
    <div class="head">
      <el-row :gutter="20" class="head-el-row">
        <el-col :span="3" v-on:click="toHome">
          <i class="iconfont">&#xe6bb;</i>
        </el-col>
        <el-col :span="18" style="font-size: 16px;font-weight:bolder;">消息</el-col>
        <el-col :span="3">
        </el-col>
      </el-row>
      <el-divider style="margin: 0;" />
    </div>
    <div class="notice" v-if="messageData != null">
      <el-row :gutter="20" class="notice-el-row">
        <el-col :span="6">
          <!-- 点赞 -->
          <el-badge :value="messageData.noticeUnreadCount.like" :max="99" class="badge-item" :hidden="messageData.noticeUnreadCount.like===0">
            <i class="iconfont notice-icon" style="color: red;" @click="this.$router.push('/LikeNotice')">&#xe71a;</i>
          </el-badge>
          <br/>
          <span style="font-size: 12px;font-weight:bolder;color: #787777;">点赞</span>
        </el-col>
        <el-col :span="6">
          <!-- 评论 -->
          <el-badge :value="messageData.noticeUnreadCount.comment" :max="99" class="badge-item" :hidden="messageData.noticeUnreadCount.comment===0">
            <i class="iconfont notice-icon" style="color: #007a80c9;" @click="this.$router.push('/CommentNotice')">&#xe8c5;</i>
          </el-badge>
          <br/>
          <span style="font-size: 12px;font-weight:bolder;color: #787777;" >评论</span>
        </el-col>
        <el-col :span="6">
          <!-- 收藏 -->
          <el-badge :value="messageData.noticeUnreadCount.collect" :max="99" class="badge-item" :hidden="messageData.noticeUnreadCount.collect===0">
            <i class="iconfont notice-icon" style="color: #ff9c00;" @click="this.$router.push('/CollectNotice')">&#xe64b;</i>
          </el-badge>
          <br/>
          <span style="font-size: 12px;font-weight:bolder;color: #787777;">收藏</span>
        </el-col>
        <el-col :span="6">
          <!-- 关注 -->
          <el-badge :value="messageData.noticeUnreadCount.follow" :max="99" class="badge-item" :hidden="messageData.noticeUnreadCount.follow===0">
            <i class="iconfont notice-icon" style="color: #00c7ff;" @click="this.$router.push('/FollowNotice')">&#xe608;</i>
          </el-badge>
          <br/>
          <span style="font-size: 12px;font-weight:bolder;color: #787777;">关注</span>
        </el-col>
      </el-row>
    </div>
    <div style="width: 100%;height: 1%;background-color: #a5a5a524;"></div>
    <div class="letter__bar">聊天列表</div>
    <div class="letter" v-if="messageData != null">
      <el-empty description="没有私信哟~" v-if="messageData.conversationList === null || messageData.conversationList.length === 0" />
      <el-scrollbar v-else>
        <div v-for="conversationVo in messageData.conversationList" :key="conversationVo" class="letter-item" @click="toChat(conversationVo.targetUser.id)">
          <span class="letter-avater">
            <el-avatar :size="38" :src="conversationVo.targetUser.headerUrl" />
          </span>
          <div class="letter-item-right">
            <div>
              <span class="letter-target">{{ conversationVo.targetUser.nickname }}</span>
              <span class="letter-time">{{ conversationVo.lastLetter.createTime }}</span>
            </div>
            <div>
              <span class="letter-content">{{ conversationVo.lastLetter.content }}</span>
              <span class="letter-unread-count"><el-badge :value="conversationVo.unreadCount" :max="99" :hidden="conversationVo.unreadCount===0" /></span>
            </div>
            <el-divider style="margin-bottom: 0px;margin-top: 5px;" />
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>

import { post } from '../../utils/axios'
import { ElNotification } from 'element-plus'
import moment from 'moment'

export default {
  name: 'MessageHome',
  components: {
  },
  data () {
    return {
      messageData: null
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    toHome () {
      this.$router.push({path: '/Home'})
    },
    initData () {
      post('/user/message/home')
        .then(response => {
          if (response.code === 200) {
            const data = response.data
            console.log('列表', data)
            // 格式化时间
            data.conversationList = data.conversationList.map((conversation) => {
              const currentTime = moment()
              const isCurrentDay = currentTime.get('date') === moment(conversation.lastLetter.createTime).get('date') // 日期是否为今天
              const isCurrentMonth = currentTime.get('month') === moment(conversation.lastLetter.createTime).get('month') // 日期是否为本月
              const isCurrentYear = currentTime.get('year') === moment(conversation.lastLetter.createTime).get('year') // 日期是否为今年
              if (isCurrentDay && isCurrentMonth && isCurrentYear) { // 今天内的私信，显示时间
                conversation.lastLetter.createTime = moment(conversation.lastLetter.createTime).format('HH:mm')
              } else if (isCurrentYear) { // 今年内，显示具体月日
                conversation.lastLetter.createTime = moment(conversation.lastLetter.createTime).format('MM-DD')
              } else { // 不是本年，显示年月日
                conversation.lastLetter.createTime = moment(conversation.lastLetter.createTime).format('YY-MM-DD')
              }
              console.log('格式化')
              return conversation
            })
            this.messageData = data
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
    toChat (targetId) {
      this.$router.push(`/chat/${targetId}`)
    }
  }
}
</script>

<style scoped>
* {
  font-family:黑体;
}
.box {
	width:100vw;
	height:100vh;
  margin: -8px;
}
.head {
  height: 5%;
}
.head-el-row {
  text-align: center;
  padding: 10px 15px;
  margin: 0!important;
}
.iconfont {
  font-size: 25px;
}
.notice {
  height: 10%;
}
.notice-el-row {
  text-align: center;
  padding: 6% 6px;
  margin: 0!important;
}
.notice-icon {
  font-size: 30px;
}
.letter__bar{
  width: 100%;
  height: 25px;
  line-height: 25px;
  padding-left: 5px;
  font-size: 13px;
  font-weight: bolder;
  border-bottom: 1px solid #f1f1f1;
}
.letter {
  height: calc(84% - 25px);
}
.el-scrollbar {
  height: 100%;
}
.letter-avater {
  width: 12%;
  position: relative;
  top: 3px;
  left: 3px;
}
.letter-item {
  display: flex;
  height: 60px;
}
.letter-target {
  padding-top: 2px;
  width: 85%;
  display: inline-block;
  font-size: 16px !important;
  font-weight:bolder;
  white-space: nowrap;  /*限制一行内显示文本*/
  overflow: hidden;     /*隐藏超出的部分*/
  text-overflow: ellipsis;  /*超出的部分用省略号替代*/
}
.letter-time {
  width: 15%;
  display: inline-block;
  font-size: 11px !important;
  font-weight:bolder;
  color: #81838591;
}
.letter-content {
  width: 90%;
  display: inline-block;
  font-size: 13px !important;
  font-weight:bolder;
  color: #81838591;
  white-space: nowrap;  /*限制一行内显示文本*/
  overflow: hidden;     /*隐藏超出的部分*/
  text-overflow: ellipsis;  /*超出的部分用省略号替代*/
  margin-top: 2px;
}
.letter-unread-count {
  width: 10%;
  display: inline-block;
  position: relative;
}
.letter-unread-count >>> .el-badge__content {
  position: absolute;
  right: -30px;
  top: -11px;
}
.letter-item-right {
  width: 88%;
  box-sizing: border-box;
}
</style>
