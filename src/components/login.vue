<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/logo.png" alt="" />
      </div>
      <el-form
        ref="form"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="login_row">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { debounce } from "../util/debounce.js";
export default {
  data() {
    return {
      abc: debounce(this.success, 2000),
      bcd: debounce(this.error, 2000),
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  components: {},

  computed: {},

  methods: {
    error() {
      this.$message.error("登录失败");
    },
    success() {
      this.$message.success("登录成功");
    },
    reset() {
      this.$refs.form.resetFields();
    },
    login() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        const { data } = await this.$http.post("login", this.loginForm);
        if (data.meta.status == 400) return this.bcd();
        this.abc();
        window.sessionStorage.setItem("token", data.data.token);
        setTimeout(() => {
          this.$router.push("/home");
        }, 2000);
      });
    },
  },
  created() {},
};
</script>
<style lang='css' scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_row {
  float: right;
  margin-bottom: 20px;
}
</style>