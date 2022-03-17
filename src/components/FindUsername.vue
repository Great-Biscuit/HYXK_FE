<template>
  <div class="box">
    <el-card class="box-card">
      <h3>找回账号</h3>
      <el-form 
        ref="findUsernameForm" 
        :model="findUsernameForm"
        status-icon
        :rules="rules"
      >
        <el-form-item>
          <span style="color: #999; font-size: 9px;">
            注: 请在下方输入框中填写账号所绑定的邮箱, 账号将会以邮件的形式发送至该邮箱, 请注意查收!
          </span>
        </el-form-item>
        <el-form-item prop="email">
          <el-input type="text" style="--el-input-focus-border-color: #ffffff; " class="find-username-input" 
          v-model="findUsernameForm.email" placeholder="请输入邮箱" 
          />
        </el-form-item>

        <el-form-item>
          <el-button style="width: 100%;" type="primary" 
          v-on:click="sendEmail" auto-insert-space 
          size="default" round>发送邮件</el-button>
        </el-form-item>

        <el-form-item>
          <div class="tips">
            <span>获得账号, </span><el-link href="javascript:void(0);" v-on:click="toLogin" type="primary">去登录></el-link>
        </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

  import { ElNotification } from 'element-plus'
  import { post } from '../utils/axios'

  export default {
    name: 'FindUsername',
    data () {
      // 邮箱格式
      let emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      const validateEmail = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入邮箱!'));
        } else {
          // 验证邮箱合法性
          if (!emailReg.test(value)) {
            callback(new Error('请输入有效邮箱!'));
          }
          callback();
        }
      }
      return {
        findUsernameForm: {
          email: ''
        },
        rules: {
          email: [
            {  message: '请输入邮箱', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      sendEmail () {
        let formData = new FormData()
        formData.append('email', this.findUsernameForm.email)
        post('/user/login/findUsername', formData)
          .then(response => {
            if (response.code === 200) {
              ElNotification({
                title: "成功发送",
                message: "成功发送邮件, 请注意查收!",
                type: 'success',
                duration: 2000,
              })
              this.$router.replace({path: '/Login'})
            } else {
              ElNotification({
                title: "错误: " + response.code,
                message: response.msg,
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
      toLogin () {
        this.$router.replace({path: '/Login'})
      }
    }
  }
</script>

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
  height: 300px!important;
  width: 333px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.find-username-input >>> .el-input__inner {
  border-radius: 0px;
  transition: 0ms;
  border-bottom: 1px solid #919192;
  caret-color: #2891fa;
  box-shadow: 0 0 0 0;
}
/* 拥有焦点时输入框变色 */
.find-username-input >>> .el-input__inner:focus {
  border-bottom: 1px solid #2891fa;
}
.tips {
  width: 100%;
  font-size: 14px;
  color: #999;
  letter-spacing: .4px;
  line-height: 30px;
  text-align: center;
}
</style>