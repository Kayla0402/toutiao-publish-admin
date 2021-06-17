<template>
  <div class="login-container">
    <el-form class="login-form" :model="user" :rules="rules" ref="user">
      <div class="login-header"></div>
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
         <el-checkbox v-model="checked">我已阅读并同意用户协议</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="onLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "LoginIndex",
  data() {
    return {
      user: {},
      rules: {
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
        ],
         code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
        ],
      },
      checked: false
    };
  },
  methods: {
    onLogin() {
     /* h获取表单数据，表单验证，验证通过，提交登陆，成功，失败 */
    }
  },
};
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url(./images/login_bg.jpg);
  background-size: cover;
  .login-header {
    height: 57px;
    background: url(./images/logo_index.png) no-repeat;
    margin-bottom: 30px;
  }
  .login-form {
    min-width: 300px;
    padding: 50px;
    background: #fff;
    .login-btn {
      width: 100%;
    }
  }
}
</style>
