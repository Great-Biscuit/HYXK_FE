<template>
  <el-card class="box-card">
    <el-form ref="formRef">
        <h3>登录皓月星空站</h3>
        <el-input type="text" v-model="username" placeholder="请输入用户名" clearable/>
        <br><br>
        <el-input type="password" v-model="password" placeholder="请输入密码" clearable/>
        <br><br>
        <el-switch v-model="rememberMe" active-text="记住我" inactive-text="临时登录" />
        <br><br>
        <el-button type="primary" v-on:click="login" round>登录</el-button>
    </el-form>
  </el-card>
</template>

<style>
.box-card {
  margin: 0 auto;
  display: flex;
  justify-content: center; /*使子项目水平居中*/
  align-items: center; /*使子项目垂直居中*/
  width: 320px;
  height: 250px;
}
</style>


<script>

  import { ElNotification } from 'element-plus'
  import axios from 'axios'

  export default {
    name: 'Login',
    data () {
      return {
        username: '',
        password: '',
        rememberMe: false
      }
    },
    methods: {
      login () {
        var f = new FormData()
        f.append('username',this.username)
        f.append('password', this.password)
        f.append('rememberMe', this.rememberMe)
        axios
          .post('http://localhost:9195/user/login/verify', f)
          .then(successResponse => {
            if (successResponse.data.code === 500) {
              ElNotification({
                title: successResponse.data.code,
                message: successResponse.data.data,
                type: 'error',
              })
            }
            if (successResponse.data.code === 200) {
              this.$router.replace({path: '/HelloWorld'})
            }
          })
          .catch(failResponse => {
              ElNotification({
                title: failResponse.code,
                message: failResponse.data,
                type: 'error',
              })
          })
      }
    }
  }
</script>

