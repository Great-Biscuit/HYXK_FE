<template>
  <el-container>
    <el-header>
      Header
    </el-header>
    <el-main>
      <div>
        最新 热门
      </div>
      <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
        <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
      </ul>
    </el-main>
    <el-footer>
      <Footer/>
    </el-footer>
  </el-container>
</template>

<script>

import Footer from './Footer.vue'

export default {
  name: 'Home',
  components: {
    Footer
  },
  data () {
    
  },
  methods: {
    load () {
      this.count += 2;
    }
  }
}
</script>

<style scoped>
.el-container {
  background-size: 100% 100%;
	width:100vw;
	height:100vh;
  margin: -8px;
}
.el-header {
  height: 6%;
  background-color: #d9ecff;
}
.el-main {
  height: 88%;
}
.el-footer {
  height: 6%;
}
.infinite-list {
  height: 90%;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>