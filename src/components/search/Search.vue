<template>
  <div class="box">
    <div class="search__wrapper">
      <div class="back">
        <a class="iconfont back__icon" @click.prevent="this.$router.back()">&#xe66a;</a>
      </div>
      <div class="search__input">
        <el-input
          v-model="searchText"
          placeholder="搜索帖子"
          class="input-with-select"
          @input="inputText"
          @keyup.enter="handleSearchClick"
        >
          <template #prepend>
            <el-select v-model="type">
              <el-option label="全部" value="全部" />
              <el-option label="文章" value="文章" />
              <el-option label="公告" value="公告" />
              <el-option label="问答" value="问答" />
              <el-option label="表白墙" value="表白墙" />
            </el-select>
          </template>
        </el-input>
      </div>
      <span :class="{'hasText': hasText, 'search__btn': true}" @click="handleSearchClick">搜索</span>
    </div>
    <div class="main">
      <el-empty description="没有搜索到相关内容" v-if="isEmpty" />
      <div v-else>
        <ul v-if="postList !== null && postList.length !== 0" v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
          <li v-for="postVo in postList" :key="postVo" class="infinite-list-item">
            <PostIntro :postVo="postVo" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PostIntro from '../home/PostIntro.vue'
import { post } from '../../utils/axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'Search',
  components: {
    PostIntro
  },
  data () {
    return {
      searchText: '', // 搜索内容
      type: '全部', // 帖子类型
      hasText: false, // 搜索框内有无内容
      postList: [], // 帖子列表
      isEmpty: false, // 是否没有搜索到相关帖子
      current: 0,
    }
  },
  methods: {
    // 正在输入（用来处理搜索按钮颜色显示的逻辑）
    inputText () {
      if (this.searchText !== '') {
        this.hasText = true
      } else {
        this.hasText = false
      }
    },
    // 点击进行搜索
    handleSearchClick () {
      // 没有输入内容或内容为空时，不可搜索
      if (this.searchText === '') {
        return
      }
      // 获取帖子列表
      this.postList = []
      this.current = 0
      this.load()
    },
    load () {
      console.log('请求了')
      let formData = new FormData()
      formData.append('keyword', this.searchText)
      formData.append('current', this.current)
      formData.append('limit', 20)
      let postType = null
      if (this.type === '全部') {
        postType = null
      } else if (this.type === '文章') {
        postType = 0
      } else if (this.type === '公告') {
        postType = 1
      } else if (this.type === '问答') {
        postType = 2
      } else if (this.type === '表白墙') {
        postType = 3
      }
      formData.append('type', postType)
      post('/post/search/execute', formData)
        .then(response => {
          if (response.code === 200) {
            this.current++
            this.postList.push(...response.data);
            // 帖子列表为空，设置空状态；否则展示帖子列表
            if (!this.postList.length) {
              this.isEmpty = true
            } else {
              this.isEmpty = false
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
  }
}
</script>

<style scoped>
  .box {
    width: 100vw;
    height: 100vh;
    margin: -8px;
  }
  .search__wrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    padding: 0 12px;
    z-index: 2;
    background: #fff;
    border-top: 1px solid #f1f1f1;
    display: flex;
    align-items: center;
  }
  .back{
    width: 30px;
    height: 100%;
  }
  .back__icon{
    width: 40px;
    height: 50px;
    color: #000;
  }
  .search__input{
    width: 262px;
    line-height: 30px;
    border-radius: 15px;
    border: 1px solid #337ecc;
    padding: 0 10px;
  }
  :deep(.el-input-group__prepend){
    box-shadow: none;
    background-color: #fff;
    padding: 0 30px 0 20px;
  }
  :deep(.el-select){
    width: 70px !important;
  }
  :deep(.el-input-group--prepend>.el-input__inner){
    box-shadow: none;
    font-size: 14px;
    height: 32px;
    padding: 0;
    line-height: 32px;
  }
  :deep(.el-input__inner:hover){
    box-shadow: none;
  }
  :deep(.el-input--small.el-input--suffix .el-input__inner) {
    padding: 0;
    font-size: 14px;
  }
  :deep(.el-input--small .el-input__suffix){
    right: 0;
  }
  .hasText{
    border-color: #337ecc !important;
    background-color: #337ecc !important;
  }
  .search__btn{
    display: inline-block;
    width: 50px;
    height: 32px;
    line-height: 32px;
    margin-left: 10px;
    border-radius: 15px;
    text-align: center;
    font-size: 14px;
    background: #a0cfff;
    color: #fff;
  }
  :deep(.el-input-group--prepend .el-input__inner){
    box-shadow: none !important;
  }
  :deep(.el-input-group--prepend .el-input-group__prepend .el-select .el-input.is-focus .el-input__inner:focus){
    box-shadow: none !important;
  }
  :deep(.el-input-group--prepend .el-input-group__prepend .el-select .el-input.is-focus .el-input__inner){
    box-shadow: none !important;
  }
  :deep(.el-input-group--prepend .el-input-group__prepend .el-select:hover .el-input__inner){
    box-shadow: none !important;
  }
  :deep(.el-input-group--prepend .el-input-group__prepend .el-select .el-input .el-input__inner:focus){
    box-shadow: none !important;
  }
  
  .el-select-dropdown__item{
    padding: 0 20px;
  }
  .el-select-dropdown__item.selected{
    color: #337ecc;
  }
  .main{
    position: relative;
    top: 50px;
    height: calc(100vh - 50px);
    overflow: auto;
    background: #f1f1f1;
  }
  .noMore{
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .infinite-list {
    height: calc(100vh - 50px);
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
