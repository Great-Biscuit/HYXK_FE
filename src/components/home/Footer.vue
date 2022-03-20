<template>
  <el-row :gutter="20" :justify="center" :align="middle">
    <el-col :span="8"><el-icon><home-filled /></el-icon></el-col>
    <el-col :span="8"><el-icon><promotion /></el-icon></el-col>
    <el-col :span="8"><el-icon><user-filled /></el-icon></el-col>
  </el-row>
</template>

<script>

import { Promotion, UserFilled, HomeFilled } from '@element-plus/icons-vue'

export default {
  name: 'Footer',
  components: {
    Promotion,
    UserFilled,
    HomeFilled
  },
  data () {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
</style>
