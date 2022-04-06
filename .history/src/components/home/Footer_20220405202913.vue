<template>
  <el-row :gutter="20">
    <el-col :span="8" v-on:click="toHome">
      <i class="iconfont">&#xe6bb;</i>
    </el-col>
    <el-col :span="8">
      <i class="iconfont add-post">&#xe600;</i>
    </el-col>
    <el-col :span="8">
      <i class="iconfont">&#xe607;</i>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'Footer',
  components: {
  },
  data () {
    return {
      
    }
  },
  methods: {
    // 跳到首页
    toHome () {
      this.$router.replace({path: '/Home'})
    },
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  text-align: center;
}
.el-row:last-child {
  margin-bottom: 0;
}
.iconfont {
  font-size: 25px;
}
.add-post {
  background-color: #0073ffab;
  padding: 5px;
  border-radius: 25%;
}
</style>
