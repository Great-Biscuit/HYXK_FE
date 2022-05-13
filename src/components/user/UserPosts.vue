<template>
  <div class="post-list-box" v-if="postList!==null" v-loading="loading">
    <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
      <li v-for="postVo in postList" :key="postVo" class="infinite-list-item">
        <PostIntroForUserInfo :postVo="postVo" />
      </li>
    </ul>
  </div>
</template>

<script>

import { post } from '../../utils/axios'
import { ElNotification } from 'element-plus'
import PostIntroForUserInfo from './PostIntroForUserInfo.vue'

export default {
  name: 'UserPosts',
  props: [
    'userId'
  ],
  components: {
    PostIntroForUserInfo
  },
  data () {
    return {
      count : 0,
      postList: [],
      loading: true
    }
  },
  methods: {
    load () {
      post('/post-public/queryAllByLimit', {
        userId: this.userId,
        type: -1,
        offset: this.count,
        limit: 10,
        orderMode: 2
      })
        .then(response => {
          if (response.code === 200) {
            // 每次取8条
            this.postList.push(...response.data);
            this.count += response.data.length;
            this.loading = false
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
.post-list-box {
  height: 100%;
  width: 100%;
}
.infinite-list {
  height: 100%;
  padding: 0;
  list-style: none;
  margin: 0;
}
.infinite-list .infinite-list-item {
  display: flex;
  height: 120px;
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
