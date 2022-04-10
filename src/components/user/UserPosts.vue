<template>
  <div class="post-list-box" v-if="postList!==null">
    <el-scrollbar height="100%">
      <div v-for="postVo in postList" :key="postVo" style="text-align:center;">
        <div class="card" v-on:click="postDetail(postVo.post.id)">
          <div class="message">
            <div class="postTitle">
              {{postVo.post.title}}
            </div>
            <div class="bottom">
              <div class="like">
                <span class="iconfont like__icon">&#xe71b;</span>
                <span class="like__count">{{postVo.likeCount / 10000 >= 1 ? ((postVo.likeCount / 10000).toFixed(1) + '万') : postVo.likeCount}}</span>
              </div>
              <div class="comment">
                <span class="iconfont comment__icon">&#xe741;</span>
                <span class="comment__count">{{postVo.post.comments / 10000 >= 1 ? ((postVo.post.comments / 10000).toFixed(1) + '万') : postVo.post.comments}}</span>
              </div>
            </div>
          </div>
          <img
            v-if="postVo.post.headImg"
            :src="postVo.post.headImg"
            class="postImage"
          />
        </div>
        <hr/>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>

import { get } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'UserPosts',
  props: [
    'userId'
  ],
  components: {
  },
  data () {
    return {
      postList: null
    }
  },
  mounted () {
    this.getPosts()
  },
  methods: {
    getPosts () {
      let formData = new FormData()
      formData.append('userId', this.userId)
      formData.append('type', -1) // 查询所有类型的帖子
      formData.append('offset', 0)
      formData.append('limit', 100) // 最多查询100条
      formData.append('orderMode', 2) //按时间查询
      get('/post-public/queryAllByLimit', formData)
        .then(response => {
          if (response.code === 200) {
            this.postList = response.data
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
    postDetail (postId) {
      this.$router.push({path: '/PostDetail/' + postId})
    }
  }
}
</script>

<style scoped>
.post-list-box {
  height: 100%;
  width: 100%;
}
.card {
  padding: 5px 10px;
  display: flex;
}
.message{
  /*width: calc(100% - 110px);*/
  width: 100%;
  box-sizing: border-box;
  text-align: left;
}
.postTitle{
  height: 68px;
  font-size: 24px;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow:hidden;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
}
.bottom{
  display: flex;
  height: 22px;
}
.like,.comment{
  width: 80px;
  line-height: 22px;
  box-sizing: border-box;
  padding-left: 5px;
  font-size: 13px !important;
  overflow: hidden;
}
.postImage {
  height: 110px;
  width: 110px;
  margin-left: 5px;
}
</style>
