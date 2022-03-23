<template>
  <el-row :gutter="20">
    <el-col :span="3">
      <i class="iconfont">&#xe684;</i>
    </el-col>
    <el-col :span="3"></el-col>
    <el-col :span="12" style="font-size : 120%;">主页</el-col>
    <el-col :span="3">
      <i class="iconfont">&#xe65c;</i>
    </el-col>
    <el-col :span="3">
      <i class="iconfont">&#xe630;</i>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'Header',
  components: {
  },
  data () {
    return {
      
    }
  },
  methods: {
    
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
</style>

