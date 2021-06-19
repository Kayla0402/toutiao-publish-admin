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
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onLogin"
          :loading="isloading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/user";
export default {
  name: "LoginIndex",
  data() {
    return {
      user: {
        // mobile: Number(13911111111),
        // code: Number(246810),
        // agree: false
      },
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            pattern: /^\d{6}$/,
            message: "请输入正确的验证码",
            trigger: "blur",
          },
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请同意用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      },
      isloading: false,
    };
  },
  methods: {
    login() {
      this.isloading = !this.isloading;
      /* 获取表单数据; 表单验证; 验证通过，提交登陆; 成功，失败 */
      login(this.user)
        .then((res) => {
          this.$message.success("登陆成功");
          this.isloading = !this.isloading;
          window.localStorage.setItem('user', JSON.stringify(res.data.data))
          this.$router.push("/");
        })
        .catch((err) => {
          this.$message.error("登陆失败");
          this.isloading = !this.isloading;
        });
    },
    onLogin() {
      this.$refs.user.validate((valid, err) => {
        if (!valid) {
          return;
        }
        this.login();
      });
    },
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
