<template>
  <div class="box">
    <div class="above">
      <div class="head">
        <el-row :gutter="20" class="head-el-row">
          <el-col :span="3" v-on:click="this.$router.back()">
            <i class="iconfont" v-on:click="toHome">&#xe66a;</i>
          </el-col>
          <el-col :span="18"></el-col>
          <el-col :span="3">
            <i class="iconfont" v-on:click="toHome" style="color: #f7c8b2;" v-if="userId === holderUserId">&#xe8b7;</i>
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
            <el-button round class="user-info-button" v-if="userId === holderUserId">
              <span class="white-bolder-font">编辑资料</span>
            </el-button>
            <span v-else>
              <el-button round class="user-info-button">
              <span class="white-bolder-font">私信</span>
            </el-button>
            <el-button round class="user-info-button" v-if="userInfo.hasFollow">
              <span class="white-bolder-font" style="color: #333333b3;">已关注</span>
            </el-button>
            <el-button round class="user-info-button" v-else>
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
      <UserPosts :userId="userId" />
    </div>
    <!-- 显示关注的人 -->
    <el-drawer
    v-model="showFollowee"
    title="👯我关注的人"
    :direction="direction" 
    size="100%" 
    :destroy-on-close="true"
    >
      <el-empty description="还没有关注Ta哟~" v-if="followeeList === null || followeeList.length === 0" />
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
    </el-drawer>
  </div>
</template>

<script>

import { get } from '../../utils/axios'
import { ElNotification } from 'element-plus'
import UserPosts from './UserPosts.vue'

export default {
  name: 'UserInfo',
  components: {
    UserPosts
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
      direction: "ttb"
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
      // TODO: 请求接口加载列表
    },
    showFansFun () {
      this.showFans = true
      // TODO: 请求接口加载列表
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
</style>
