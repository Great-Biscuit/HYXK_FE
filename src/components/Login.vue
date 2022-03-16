<template>
  <div class="box">
    <el-card class="box-card">
      <el-form ref="formRef">
          <h3>皓月星空站</h3>
          <el-form-item>
            <el-input type="text" style="--el-input-focus-border-color: #ffffff; " class="login-input" 
            v-model="username" placeholder="请输入用户名" 
            clearable/>
          </el-form-item>
          <el-form-item>
            <el-input type="password" style="--el-input-focus-border-color: #ffffff; " class="login-input" 
            v-model="password" placeholder="请输入密码" 
            show-password/>
          </el-form-item>
          <el-form-item>
            <el-switch v-model="rememberMe" active-text="记住我" inactive-text="临时登录" />
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%;" type="primary" 
            v-on:click="login" auto-insert-space 
            size="default" round>登录</el-button>
          </el-form-item>
      </el-form>
      <div class="login-links" style="text-align: center;">
        <el-link href="javascript:void(0);" v-on:click="passwordFind">忘记密码</el-link>
        <el-divider direction="vertical" />
        <el-link href="javascript:void(0);" v-on:click="usernameFind">忘记用户名</el-link>
        <el-divider direction="vertical" />
        <el-link href="javascript:void(0);" v-on:click="toRegister">免费注册</el-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.box {
	background: url('https://ae01.alicdn.com/kf/H382f069a09044b699eeecdb70b091b08v.jpg') no-repeat;
  background-size: 100% 100%;
	width:100vw;
	height:100vh;
  margin: -8px;
}
.box-card {
  background-color: transparent!important;
  height: 308px!important;
  width: 333px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-input >>> .el-input__inner {
  border-radius: 0px;
  transition: 0ms;
  border-bottom: 1px solid #919192;
  caret-color: #2891fa;
  box-shadow: 0 0 0 0;
}
/* 拥有焦点时输入框变色 */
.login-input >>> .el-input__inner:focus {
  border-bottom: 1px solid #2891fa;
}
.login-links >>> .el-link--inner {
  font-size: 10px;
  color: #999;
  text-align: center;
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
        axios.post('http://localhost:9195/user/login/verify', f)
          .then(response => {
            if (response.data.code === 200) {
              this.$router.replace({path: '/HelloWorld'})
            } else {
              ElNotification({
                title: "错误: " + response.data.code,
                message: response.data.msg,
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
      // 跳到注册界面
      toRegister () {
        this.$router.replace({path: '/Register'})
      },
      // 忘记密码
      passwordFind () {
        this.$router.replace({path: '/FindPassword'})
      },
      // 忘记账号
      usernameFind () {
        this.$router.replace({path: '/FindUsername'})
      }
    }
  }
</script>

