<template>
  <div class="common-layout">
    <el-container style="align-items: center;">
      <el-header style="height: 180px">
        <br/><br/><br/>
        <h1>🎉 欢迎注册皓月星空站!</h1>
      </el-header>
      <el-main>
        <el-form
          ref="registerForm"
          :model="registerForm"
          status-icon
          :rules="rules"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="账号" prop="username">
            <el-input type="text" 
            v-model="registerForm.username" 
            placeholder="以字母开头, 由字母、数字、下划线组成" 
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" autocomplete="off" 
            placeholder="由字母及数字组成" />
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPassword">
            <el-input
              v-model="registerForm.checkPassword"
              type="password"
              autocomplete="off" 
              placeholder="请再次输入密码"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input type="text" 
            v-model="registerForm.email" 
            placeholder="邮箱用于激活账号" 
            />
          </el-form-item>
          <br/>

          <el-form-item>
            <el-button style="width: 100%;" type="primary" 
            size="default" v-on:click="register" 
            round auto-insert-space>注册</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer>
        <div class="tips">
            <span>已有账号, </span><el-link href="javascript:void(0);" v-on:click="toLogin" type="primary">去登录></el-link>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  background: url('https://ae01.alicdn.com/kf/H382f069a09044b699eeecdb70b091b08v.jpg') no-repeat;
  background-size: 100% 100%;
	width:100vw;
	height:100vh;
  margin: -8px;
}
.el-main {
  width: 333px;
  align-items: center;
}
.el-input >>> .el-input__inner {
  background-color: transparent;
}
.tips {
  font-size: 14px;
  color: #999;
  letter-spacing: .4px;
  line-height: 30px;
  text-align: center;
}
</style>


<script>

import { ElNotification } from 'element-plus'
import { post } from '../../utils/axios'

export default {
  name: 'Register',
  data () {
    let usernameReg = /^[a-zA-z]\w{3,15}$/;
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号!'));
      } else {
        // 验证账号合法性
        if (!usernameReg.test(value)) {
          callback(new Error('请输入合法账号!'));
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
          this.$refs.registerForm.validateField('checkPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码!'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };

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

    return {
      registerForm: {
        username: '',
        password: '',
        checkPassword: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword:[
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur', required: true }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    register () {
      let formData = new FormData()
      formData.append('username', this.registerForm.username)
      formData.append('password', this.registerForm.password)
      formData.append('email', this.registerForm.email)
      post('/user/register/toRegister', formData)
        .then(response => {
          if (response.code === 200) {
            ElNotification({
              title: "成功注册",
              message: "请查看邮件并激活账号!",
              type: 'success',
              duration: 3000,
            })
            this.$router.push({path: '/Login'})
          } else {
            ElNotification({
              title: "错误:" + response.code,
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
      this.$router.push({path: '/Login'})
    }
  }
}
</script>

