<template>
  <div class="home-box">
    <el-container>
      <el-header class="home-header">Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.home-box {
  background-size: 100% 100%;
	width:100vw;
	height:100vh;
  margin: -8px;
}
.home-header {
  background-color: #303133;
}
</style>