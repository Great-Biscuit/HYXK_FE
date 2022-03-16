<template>
  <div class="box">
    <el-card class="box-card">
      <h3>找回密码</h3>
      <el-form 
        ref="findPasswordForm" 
        :model="findPasswordForm"
        status-icon
        :rules="rules"
      >
        <el-form-item>
          <span style="color: #999; font-size: 9px;">
            注: 请在下方输入框中填写账号所绑定的邮箱!
          </span>
        </el-form-item>

        <el-form-item prop="email">
          <el-input type="text" style="--el-input-focus-border-color: #ffffff; " class="find-password-input" 
          v-model="findPasswordForm.email" placeholder="请输入邮箱" 
          />
        </el-form-item>

        <el-form-item prop="code">
          <el-input type="text" style="--el-input-focus-border-color: #ffffff; width: 70% " class="find-password-input" 
          v-model="findPasswordForm.code" placeholder="请输入验证码" 
          />
          <el-button style="width: 30%" 
          type="primary" plain 
          :disabled="disabled=!show"
          v-on:click="sendCode"
          >
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{count}} s</span>
          </el-button>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="findPasswordForm.password" 
          type="password" autocomplete="off" 
          style="--el-input-focus-border-color: #ffffff; " class="find-password-input" 
          placeholder="请输入密码" />
        </el-form-item>

        <el-form-item prop="checkPassword">
          <el-input
            v-model="findPasswordForm.checkPassword"
            type="password"
            autocomplete="off" 
            placeholder="请再次输入密码"
            style="--el-input-focus-border-color: #ffffff; " class="find-password-input" 
          />
        </el-form-item>

        <el-form-item>
          <el-button style="width: 100%;" type="primary" 
          v-on:click="findPassword" auto-insert-space 
          size="default" round>重置密码</el-button>
        </el-form-item>

        <el-form-item>
          <div class="tips">
            <span>无需重置密码, </span><el-link href="javascript:void(0);" v-on:click="toLogin" type="primary">去登录></el-link>
        </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

  import { ElNotification } from 'element-plus'
  import axios from 'axios'

  export default {
    name: 'FindPassword',
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
      };

      // 验证码格式
      let codeReg = /^\d{6}$/;
      const validateCode = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入验证码!'));
        } else {
          // 验证验证码格式
          if (!codeReg.test(value)) {
            callback(new Error('请输入有效验证码!'));
          }
          callback();
        }
      };

      // 包括字母，数字，不许有空格，8位以上
      let passReg = /^(?=\S*[a-z])(?=\S*\d)\S{6,}$/;
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码!'));
        } else {
          // 密码强度检验
          if (!passReg.test(value)) {
            callback(new Error('密码需包括字母、数字, 不允许有空格!'));
          }
          if (this.checkPassword !== '') {
            this.$refs.findPasswordForm.validateField('checkPassword');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码!'));
          } else if (value !== this.findPasswordForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
      };
      return {
        show: true,  // 初始启用按钮
        count: '',   // 初始化次数
        timer: null,
        findPasswordForm: {
          email: '',
          code: '',
          password: '',
          checkPassword: '',
        },
        rules: {
          email: [
            {  message: '请输入邮箱', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          code: [
            { message: '请输入验证码', trigger: 'blur' },
            { min: 6, max: 6, message: '长度为 6 个字符', trigger: 'blur' },
            { validator: validateCode, trigger: 'blur' }
          ],
          password: [
            { message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPassword:[
            { message: '请确认密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      sendCode () {
        const TIME_COUNT = 60; //更改倒计时时间
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);  // 清除定时器
              this.timer = null;
            }
          }, 1000)
        }

        let formData = new FormData()
        formData.append('email', this.findPasswordForm.email)
        axios.post('http://localhost:9195/user/login/getVerificationCode', formData)
          .then(response => {
            if (response.data.code === 200) {
              ElNotification({
                title: "成功发送",
                message: "成功发送验证码, 请注意查收!",
                type: 'success',
                duration: 2000,
              })
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
                message: "发生错误!请重试!",
                type: 'error',
                duration: 2000,
              })
          })
      },
      findPassword () {
        let formData = new FormData()
        formData.append('email', this.findPasswordForm.email)
        formData.append('code', this.findPasswordForm.code)
        formData.append('password', this.findPasswordForm.password)
        axios.post('http://localhost:9195/user/login/findPassword', formData)
          .then(response => {
            if (response.data.code === 200) {
              ElNotification({
                title: "成功",
                message: "成功修改密码!",
                type: 'success',
                duration: 2000,
              })
              this.$router.replace({path: '/Login'})
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
  height: 400px!important;
  width: 333px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.find-password-input >>> .el-input__inner {
  border-radius: 0px;
  transition: 0ms;
  border-bottom: 1px solid #919192;
  caret-color: #2891fa;
  box-shadow: 0 0 0 0;
}
/* 拥有焦点时输入框变色 */
.find-password-input >>> .el-input__inner:focus {
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