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
              <el-option label="美食笔记" value="1" />
              <el-option label="探店笔记" value="2" />
              <el-option label="全部" value="0" />
            </el-select>
          </template>
        </el-input>
      </div>
      <span :class="{'hasText': hasText, 'search__btn': true}" @click="handleSearchClick">搜索</span>
    </div>
    <div class="main" ref="mainDiv">
      <el-empty description="没有搜索到相关内容" v-if="isEmpty" />
      <div v-else>
        <!--<div class="wrapper">
          <div
            v-for="item in noteList"
            :key="item.note.id"
            class="content__wrapper"
          >
            <contents :notes="item" @changeLiked="changeLiked" />
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  components: {

  },
  data () {
    return {
      searchText: '', // 搜索内容
      type: '全部', // 帖子类型
      hasText: false, // 搜索框内有无内容
      postList: [], // 帖子列表
      isEmpty: false, // 是否没有搜索到相关帖子
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
      console.log('在此处获取帖子列表')
      // 帖子列表为空，设置空状态；否则展示帖子列表
      if (!this.postList.length) {
        this.isEmpty = true
      } else {
        this.isEmpty = false
      }
      this.$refs.mainDiv.scrollTop = 0
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
  .wrapper{
    padding: 0 2px;
    overflow: auto;
    column-count: 2;
    column-gap: 1px;
  }
  .content__wrapper{
    margin-bottom: 2px;
    break-inside: avoid;
  }
  .noMore{
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
</style>
