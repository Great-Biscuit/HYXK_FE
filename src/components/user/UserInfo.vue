<template>
  <div class="box">
    <div class="above">
      <div class="head">
        <el-row :gutter="20" class="head-el-row">
          <el-col :span="3" v-on:click="this.$router.back()">
            <i class="iconfont">&#xe66a;</i>
          </el-col>
          <el-col :span="18"></el-col>
          <el-col :span="3">
            <i class="iconfont" v-on:click="openActionBox" style="color: #a1c0ff;" v-if="userId === holderUserId">&#xe8b7;</i>
          </el-col>
        </el-row>
      </div>
      <div class="user-info" v-if="userInfo !== null">
        <el-row>
          <el-col :span="8">
            <el-avatar :size="65" :src="userInfo.user.headerUrl" />
          </el-col>
          <el-col :span="5"></el-col>
          <el-col :span="11" style="text-align: center;">
            <!-- 如果是用户本人就显示[编辑资料], 否则显示[关注 私信] -->
            <el-button round class="user-info-button" v-if="userId === holderUserId" @click="this.$router.push('/UpdateUserInfo')">
              <span class="white-bolder-font">编辑资料</span>
            </el-button>
            <span v-else>
              <el-button round class="user-info-button">
              <span class="white-bolder-font" @click="this.$router.push(`/chat/${userId}`)">私信</span>
            </el-button>
            <el-button round class="user-info-button" v-if="userInfo.hasFollow" @click="unFollowUser(null)">
              <span class="white-bolder-font" style="color: #333333b3;">已关注</span>
            </el-button>
            <el-button round class="user-info-button" v-else @click="followUser(null)">
              <span class="white-bolder-font">关注</span>
            </el-button>
            </span>
          </el-col>
        </el-row>
        <el-row style="margin: 8px 0px;">
          <el-col :span="16">
            <span class="white-bolder-font" style="font-size: 20px;padding-right: 5px;">{{ userInfo.user.nickname }}</span>
            <!-- 0-未知 1-男 2-女 -->
            <span class="iconfont white-bolder-font" v-if="userInfo.user.gender === 0" style="padding: 3px;border-radius: 50%;background-color: #7a7a7a;">&#xe65e;</span>
            <span class="iconfont white-bolder-font" v-else-if="userInfo.user.gender === 1" style="padding: 3px;border-radius: 50%;background-color: #00a9ff;">&#xe68d;</span>
            <span class="iconfont white-bolder-font" v-else style="padding: 3px;border-radius: 50%;background-color: #fb9b9b;">&#xe68b;</span>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <div style="margin: 8px 0px;">
          <span class="white-bolder-font">{{ userInfo.user.signature }}</span>
        </div>
        <!-- 显示被赞数量 关注数 粉丝数 -->
        <el-row class="user-number">
          <el-col :span="6">
            <span class="white-bolder-font" style="font-size: 20px;padding-right: 5px;">{{ userInfo.beLikedCount }}</span>
            <span class="white-bolder-font">获赞</span>
          </el-col>
          <el-col :span="6" v-on:click="showFollowFun">
            <span class="white-bolder-font" style="font-size: 20px;padding-right: 5px;">{{ userInfo.followCount }}</span>
            <span class="white-bolder-font">关注</span>
          </el-col>
          <el-col :span="6" v-on:click="showFansFun">
            <span class="white-bolder-font" style="font-size: 20px;padding-right: 5px;">{{ userInfo.fansCount }}</span>
            <span class="white-bolder-font">粉丝</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="under">
      <el-tabs v-model="activeName" class="demo-tabs" :stretch="true">
        <el-tab-pane label="发布" name="userPosts"></el-tab-pane>
        <el-tab-pane label="收藏" name="collectPosts"></el-tab-pane>
      </el-tabs>
      <div class="postsBox" v-if="userId !== null">
        <UserPosts :userId="userId" v-if="activeName === 'userPosts'" />
        <CollectPosts :userId="userId" v-else />
      </div>
    </div>
    <!-- 显示关注的人 -->
    <el-drawer
    v-model="showFollowee"
    title="👯关注的人"
    :direction="direction" 
    size="100%" 
    :destroy-on-close="true"
    >
      <el-empty description="还没有关注Ta哟~" v-if="followeeList === null || followeeList.length === 0" />
      <div v-else class="fansOrFollowList">
        <el-scrollbar>
          <div v-for="followeeVo in followeeList" :key="followeeVo" class="fansOrFollowItem">
            <el-row style="align-items: center;">
              <el-col :span="4">
                <el-avatar :size="50" :src="followeeVo.user.headerUrl" style="margin: 3px;" />
              </el-col>
              <el-col :span="14" class="fansOrFollowNickname">
                <span class="nickname">{{ followeeVo.user.nickname }}</span>
                <!-- 0-未知 1-男 2-女 -->
                <span class="iconfont white-bolder-font" v-if="followeeVo.user.gender === 0" style="position: relative;top: -5px;margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #7a7a7a;">&#xe65e;</span>
                <span class="iconfont white-bolder-font" v-else-if="followeeVo.user.gender === 1" style="position: relative;top: -5px;margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #00a9ff;">&#xe68d;</span>
                <span class="iconfont white-bolder-font" v-else style="position: relative;top: -5px;margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #fb9b9b;">&#xe68b;</span>
              </el-col>
              <!-- 如果是当前用户自己, 就不显示任何内容 -->
              <el-col :span="6" style="text-align: center;" v-if="holderUserId !== followeeVo.user.id">
                <el-button round class="follow__button" v-if="followeeVo.hasFollowed">
                  <span @click="unFollowUser(followeeVo)">已关注</span>
                </el-button>
                <el-button type="primary" round class="follow__button" v-else>
                  <span @click="followUser(followeeVo)">关注</span>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-scrollbar>
      </div>
    </el-drawer>
    <!-- 显示粉丝 -->
    <el-drawer
    v-model="showFans"
    title="👯粉丝"
    :direction="direction" 
    size="100%" 
    :destroy-on-close="true"
    >
      <el-empty description="还没有粉丝哟~" v-if="fansList === null || fansList.length === 0" />
      <div v-else class="fansOrFollowList">
        <el-scrollbar>
          <div v-for="fansVo in fansList" :key="fansVo" class="fansOrFollowItem">
            <el-row style="align-items: center;">
              <el-col :span="4">
                <el-avatar :size="50" :src="fansVo.user.headerUrl" style="margin: 3px;" />
              </el-col>
              <el-col :span="14" class="fansOrFollowNickname">
                <span class="nickname">{{ fansVo.user.nickname }}</span>
                <!-- 0-未知 1-男 2-女 -->
                <span class="iconfont white-bolder-font" v-if="fansVo.user.gender === 0" style="position: relative;top: -5px;margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #7a7a7a;">&#xe65e;</span>
                <span class="iconfont white-bolder-font" v-else-if="fansVo.user.gender === 1" style="position: relative;top: -5px;margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #00a9ff;">&#xe68d;</span>
                <span class="iconfont white-bolder-font" v-else style="position: relative;top: -5px;margin-left: 3px;padding: 3px;border-radius: 50%;background-color: #fb9b9b;">&#xe68b;</span>
              </el-col>
              <!-- 如果是当前用户自己, 就不显示任何内容 -->
              <el-col :span="6" style="text-align: center;" v-if="holderUserId !== fansVo.user.id">
                <el-button round class="follow__button" v-if="fansVo.hasFollowed">
                  <span @click="unFollowUser(fansVo)">已关注</span>
                </el-button>
                <el-button type="primary" round class="follow__button" v-else>
                  <span @click="followUser(fansVo)">关注</span>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-scrollbar>
      </div>
    </el-drawer>
    <el-drawer
    v-model="drawer"
    :direction="actionBoxDirection" 
    size="150px" 
    :with-header="false"
    >
      <div class="actionBox">
        <div class="actionBoxItem" style="color: #73767a;" @click="toUpdatePassword">修改密码</div>
        <el-divider />
        <div class="actionBoxItem" style="color: red;" @click="logout">退出登录</div>
      </div>
    </el-drawer>
  </div>
</template>

<script>

import { get, post } from '../../utils/axios'
import { ElNotification } from 'element-plus'
import UserPosts from './UserPosts.vue'
import CollectPosts from './CollectPosts.vue'

export default {
  name: 'UserInfo',
  components: {
    UserPosts,
    CollectPosts
  },
  data () {
    return {
      userId: null,
      userInfo: null,
      holderUserId: null,
      showFollowee: false,
      followeeList: null,
      showFans: false,
      fansList: null,
      direction: "ttb",
      drawer: false,
      actionBoxDirection: "btt",
      activeName: 'userPosts',
    }
  },
  mounted () {
    this.userId = this.$route.params.userId
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      get('/user/action/getUserInfo/' + this.userId)
        .then(response => {
          if (response.code === 200) {
            console.log(response)
            this.userInfo = response.data
            this.holderUserId = response.msg
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
    showFollowFun () {
      this.showFollowee = true

      let formData = new FormData()
      formData.append('userId', this.userId)
      formData.append('offset', 0)
      formData.append('limit', 1000000) //查询1000000个
      post('/user/follow/followList', formData)
        .then(response => {
          if (response.code === 200) {
            this.followeeList = response.data;
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
    showFansFun () {
      this.showFans = true
      
      let formData = new FormData()
      formData.append('userId', this.userId)
      formData.append('offset', 0)
      formData.append('limit', 1000000) //查询1000000个
      post('/user/follow/fansList', formData)
        .then(response => {
          if (response.code === 200) {
            this.fansList = response.data;
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
    openActionBox () {
      // 打开操作框
      this.drawer = true
    },
    toUpdatePassword () {
      // 关闭操作框
      this.drawer = false
      console.log("修改密码")
    },
    logout () {
      post('/user/login/loginOut')
        .then(response => {
          if (response.code === 200) {
            ElNotification({
              title: "成功",
              message: "退出登录",
              type: 'success',
              duration: 2000,
            })
            // replace到首页
            this.$router.replace({path: '/Home'})
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
    // 取消关注
    unFollowUser (entityVo) {
      if (entityVo === null) {
        // 为空则为对当前用户页显示的用户的操作
        let formData = new FormData()
        formData.append('entityType', 3)
        formData.append('entityId', this.userId)
        post('/user/follow/unfollow', formData)
        .then(response => {
          if (response.code === 200) {
            this.userInfo.hasFollow = false
            this.userInfo.fansCount--
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
        // 不为空则为对关注或粉丝列表中的用户的操作
        let formData = new FormData()
        formData.append('entityType', 3)
        formData.append('entityId', entityVo.user.id)
        post('/user/follow/unfollow', formData)
        .then(response => {
          if (response.code === 200) {
            entityVo.hasFollowed = false
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
    // 关注
    followUser (entityVo) {
      if (entityVo === null) {
        // 为空则为对当前用户页显示的用户的操作
        let formData = new FormData()
        formData.append('entityType', 3)
        formData.append('entityId', this.userId)
        formData.append('entityUserId', this.holderUserId)
        post('/user/follow/toFollow', formData)
        .then(response => {
          if (response.code === 200) {
            this.userInfo.hasFollow = true
            this.userInfo.fansCount++
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
        // 不为空则为对关注或粉丝列表中的用户的操作
        let formData = new FormData()
        formData.append('entityType', 3)
        formData.append('entityId', entityVo.user.id)
        formData.append('entityUserId', this.holderUserId)
        post('/user/follow/toFollow', formData)
        .then(response => {
          if (response.code === 200) {
            entityVo.hasFollowed = true
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
}
</script>

<style scoped>
.box {
	width:100vw;
	height:100vh;
  margin: -8px;
}
.above {
  height: 35%;
  background: url('https://ae01.alicdn.com/kf/H1e0faa96b30446e4a43e4e59d1444628o.jpg') no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.under {
  height: 65%;
}
.head {
  height: 15%;
}
.head-el-row {
  text-align: center;
  padding: 10px 15px;
  margin: 0!important;
}
.iconfont {
  font-size: 25px;
}
.user-info {
  padding: 10px;
  padding-top: 30px;
}
.user-info-button {
  margin-top: 20px;
  padding: 15px!important;
  background: #626262cf;
}
:deep(.el-button:hover){
  color: white;
  background-color: #626262cf;
}
.white-bolder-font {
  font-family:黑体;
  font-size: 16px;
  font-weight:bolder;
  color: white;
  white-space: nowrap;  /*限制一行内显示文本*/
  overflow: hidden;     /*隐藏超出的部分*/
  text-overflow: ellipsis;  /*超出的部分用省略号替代*/
  width: 100%;
}
.user-number {
  position: absolute;
  bottom: 9px;
  width: 90%;
}
.fansOrFollowList {
  height: 100%;
  width: 100%;
}
:deep(.el-drawer__body) {
  padding: 0;
}
.fansOrFollowNickname {
  font-family:黑体;
  font-size: 20px;
  font-weight:bolder;
  width: 100%;
}
.nickname{
  display: inline-block;
  max-width: 89%;
  white-space: nowrap;  /*限制一行内显示文本*/
  overflow: hidden;     /*隐藏超出的部分*/
  text-overflow: ellipsis;  /*超出的部分用省略号替代*/
}
.fansOrFollowItem {
  height: 60px;
}
.actionBox {
  text-align: center;
}
.actionBoxItem {
  font-family:黑体;
  font-size: 20px;
  font-weight:bolder;
  margin: 25px;
}
.demo-tabs {
  height: 40px;
}
.postsBox {
  height: calc(100% - 40px);
}
:deep(.el-tabs__item.is-active) {
  color: #dca445;
}
:deep(.el-tabs__active-bar) {
  background-color: #dca445;
}
.follow__button{
  width: 65px;
  height: 32px;
  font-family:黑体;
  font-size: 16px;
  font-weight:bolder;
}
</style>
