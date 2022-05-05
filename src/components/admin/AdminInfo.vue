<template>
  <div class="admin-info-box">
    <div class="admin-info-title">皓月星空站</div>
    <div class="admin-info-content">
      发现问题请联系作者
      <el-link href="https://www.greatbiscuit.top/" type="primary">GreatBiscuit</el-link> ,
      或向项目
      <el-link href="https://github.com/Great-Biscuit/HYXK_FE" type="primary">前端</el-link> 、
      <el-link href="https://github.com/Great-Biscuit/HYXK_BE" type="primary">后端</el-link>
      代码仓库提交Issues
      <br/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AdminInfo',
  components: {
  },
  data () {
    return {
      
    }
  },
  mounted () {
    
  },
  methods: {
    
  }
}
</script>

<style scoped>
.admin-info-box {
	width:100%;
	height:100%;
  background: url('http://images.hyxk.xyz/HYXK.jpg') no-repeat;
  background-size: 100% 100%;
}
.admin-info-title {
  text-align: center;
  font-size: 60px;
  font-family: Times, "Times New Roman", Georgia, serif;
  font-weight:bolder;
  color: #dca445;
  padding: 30px;
}
.admin-info-content {
  font-size: 15px;
  font-family: Times, "Times New Roman", Georgia, serif;
  font-weight:bolder;
  position:absolute;
  bottom:20px;
}
</style>
