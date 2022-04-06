<template>
  <el-card @click="detail">
    <div class="message">
      <div class="postTitle">
        <span v-if="postVo.post.official==1">官方</span>
        {{postVo.post.title}}
      </div>
      <div class="bottom">
        <div class="author">
          <el-avatar :size="24" :src="postVo.author.headerUrl" />
          <span class="nickname">{{postVo.author.nickname}}</span>
        </div>
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
  </el-card>
</template>

<script>

export default {
  name: 'PostIntro',
  props: [
    'postVo'
  ],
  components: {
    
  },
  data () {
    return {
      
    }
  },
  methods: {
    detail () {
      alert(this.postVo.post.id)
    }
  }
}
</script>

<style scoped>
.el-card {
  width: 100%;
  padding: 5px 10px;
}
.el-card >>> .el-card__body {
  padding: 0;
  height: 100%;
  display: flex;
}
.message{
  /*width: calc(100% - 110px);*/
  width: 100%;
  box-sizing: border-box;
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
.author{
  width: 115px;
  line-height: 22px;
}
.like,.comment{
  width: 50px;
  line-height: 22px;
  box-sizing: border-box;
  padding-left: 5px;
  font-size: 13px !important;
  overflow: hidden;
}
.nickname{
  margin-left: 2px;
  width: 85px;
  display: inline-block;
  font-size: 12px !important;
  white-space: nowrap;  /*限制一行内显示文本*/
  overflow: hidden;     /*隐藏超出的部分*/
  text-overflow: ellipsis;  /*超出的部分用省略号替代*/
}
.postImage {
  height: 110px;
  width: 110px;
  margin-left: 5px;
}
</style>
