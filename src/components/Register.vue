<template>
  <el-card class="box-card">
    <el-form ref="formRef">
        用户名:<el-input type="text" v-model="username" placeholder="请输入用户名" clearable/>
        <br><br>
        密  码:<el-input type="password" v-model="password" placeholder="请输入密码" clearable/>
        <br><br>
        邮  箱:<el-input type="text" v-model="username" placeholder="请输入邮箱" clearable/>
        <br><br>
        <el-button type="primary" v-on:click="login" round>登录</el-button>
    </el-form>
  </el-card>
</template>

<style>
.box-card {
  margin:0 auto;
  display: flex;
  justify-content: center; /*使子项目水平居中*/
  align-items: center; /*使子项目垂直居中*/
  width: 320px;
  height: 250px;
}
</style>


<script>

  export default {
    name: 'Login',
    data () {
      return {
        username: '',
        password: '',
        Email: ''
      }
    },
  }
</script>

