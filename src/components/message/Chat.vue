<template>
  <div class="chat__box">
    <div class="header">
      <a class="iconfont back__icon" @click.prevent="this.$router.back()">&#xe66a;</a>
      <span>{{targetNickname}}</span>
    </div>
    <div class="msg__box" ref="msgBox">
      <div
        v-for="(item, index) of chatList"
        :key="index"
        class="msg__wrapper"
      >
        <div class="msg" v-if="item.fromId === myUserId" style="float: right;"> <!-- 我发的消息 -->
          <div class="user__wrapper">
            <div class="user__msg">
              <span>{{item.content}}</span>
            </div>
            <div class="user__header">
              <el-avatar :size="30" :src="myHeaderUrl" />
            </div>
          </div>
          <div class="create__time" style="position: relative; right: 50px; text-align: right;">{{item.createTime}}</div>
        </div>
        <div class="msg" v-else> <!-- 对方发的 -->
          <div class="user__wrapper">
            <div class="user__header">
              <el-avatar :size="30" :src="targetHeaderUrl" />
            </div>
            <div class="user__msg">
              <span>{{item.content}}</span>
            </div>
          </div>
          <div class="create__time" style="position: relative; left: 50px; top: 5px;">{{item.createTime}}</div>
        </div>
      </div>
    </div>
    <div class="input__box">
      <div class="input__wrapper">
        <input type="text" ref="sendMsg" v-model="contentText" @input="inputText" @keyup.enter="sendText" />
      </div>
      <el-button :class="{'inputting': isInput}" round @click.prevent="sendText">发送</el-button>
    </div>
  </div>
</template>

<script>
import { post } from '../../utils/axios'
import { ElNotification } from 'element-plus'
import moment from 'moment'

export default {
  name: 'Chat',
  data () {
    return {
      targetNickname: '', // 对方的昵称
      targetHeaderUrl: '', // 对方的头像
      contentText: '', // 发送的消息内容
      myUserId: '', // 自己的id
      myHeaderUrl: '', // 自己的头像
      chatList: [], // 聊天记录
      isInput: false, // 是否正在输入
    }
  },
  mounted () {
    this.getChatList() // 获取消息记录
  },
  methods: {
    // 获取聊天记录
    getChatList () {
      let formData = new FormData()
      formData.append('targetId', this.$route.params.targetId)
      post('/user/message/letter', formData)
        .then(response => {
          console.log('请求了')
          if (response.code === 200) {
            const data = response.data
            this.targetNickname = data.target.nickname
            this.targetHeaderUrl = data.target.headerUrl
            this.myUserId = data.holder.id
            this.myHeaderUrl = data.holder.headerUrl
            // 格式化时间
            data.letterList.map((item) => {
              item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
              return item
            })
            this.chatList = [...response.data.letterList]
            this.$nextTick(() => {
              const scrollHeight = this.$refs.msgBox.scrollHeight // 聊天框整体高度
              const clientHeight = this.$refs.msgBox.clientHeight // 聊天框可视高度
              this.$refs.msgBox.scrollTop = scrollHeight - clientHeight // 滚动到底部
            })
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
    // 判断是否正在输入，修改按钮状态
    inputText () {
      if (this.contentText !== '') {
        this.isInput = true
      } else {
        this.isInput = false
      }
      console.log('输入ing', this.isInput)
    },
    // 发送消息
    sendText () {
      // 没有输入内容或内容为空时，不可发送
      if (!this.isInput || this.contentText === '') {
        return
      }
      let formData = new FormData()
      formData.append('toId', this.$route.params.targetId)
      formData.append('content', this.contentText)
      post('/user/message/send', formData)
        .then(response => {
          if (response.code === 200) {
            const newChat = {
              id: '',
              fromId: this.myUserId,
              headerUrl: this.myHeaderUrl,
              content: this.contentText,
              createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            this.chatList.push(newChat)
            this.$nextTick(() => {
              const scrollHeight = this.$refs.msgBox.scrollHeight // 聊天框整体高度
              const clientHeight = this.$refs.msgBox.clientHeight // 聊天框可视高度
              this.$refs.msgBox.scrollTop = scrollHeight - clientHeight // 滚动到底部
            })
            this.contentText = '' // 重置
            this.$refs.sendMsg.blur() // 设置输入框失焦
            this.isInput = false
            console.log('发送了消息', this.chatList)
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
}
</script>

<style scoped>
  .chat__box{
    width: 100vw;
    height: 100vh;
    margin: -8px;
  }
  .header{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 50px;
    line-height: 50px;
    margin: 0;
    padding: 0;
    text-align: center;
    background: #337ecc;
    font-size: 16px;
  }
  .back__icon{
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    color: #fff;
  }
  .msg__box{
    position: relative;
    top: 50px;
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;
    background: #f1f1f1;
  }
  .msg__wrapper{
    zoom: 1;
  }
  .msg__wrapper::after{
    content: '';
    height: 0;
    display: block;
    clear: both;
  }
  .msg{
    margin-top: 20px;
    max-width: calc(100vw - 50px);
    text-align: left;
  }
  .user__wrapper{
    display: flex;
  }
  .user__header{
    width: 30px;
    height: 30px;
    margin: 0 10px;
  }
  .user__msg{
    padding: 10px;
    font-size: 16px;
    border-radius: 12px;
    background: #fff;
  }
  .create__time{
    font-size: 12px;
  }
  .input__box{
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    height: 50px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    background: #f1f1f1;
  }
  .input__wrapper{
    flex: 1;
    line-height: 30px;
    padding: 0 12px;
    border-radius: 15px;
    background: #fff;
  }
  input{
    width: 100%;
    line-height: 30px;
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
  }
  .inputting{
    border-color: #337ecc !important;
    background-color: #337ecc !important;
  }
  :deep(.el-button){
    height: 30px;
    font-size: 14px;
    color: #fff;
    border-color: #a0cfff;
    background-color: #a0cfff;
  }
  :deep(.el-button:hover) {
    color: #fff;
    border-color: #a0cfff;
    background-color: #a0cfff;
  }
  :deep(.el-button.is-round){
    margin-left: 5px;
    border-radius: 15px;
  }
</style>
