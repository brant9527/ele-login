<template>
  <div class="full">
    <div class="login-wrap">
      <el-card class="card-padding">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="50px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model.number="ruleForm.username" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="checked">记住账号密码</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    var checkusername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      setTimeout(() => {
        callback();
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };

    return {
      ruleForm: {
        password: "",
        username: "",
      },
      rules: {
        username: [{ validator: checkusername, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
      checked: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios
            .post(
              "http://175.24.45.181:30001/aliexpress-zyb/system/login",
              this.ruleForm
            )
            .then((data) => {
              console.log(data);
              window.localStorage.setItem("username", this.ruleForm.username);
              window.localStorage.setItem("password", this.ruleForm.password);
              if ((data.code = "000000")) {
                this.$msg("登录成功");
                this.$router.push('/home');

              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  watch: {
    checked(newValue, oldValue) {
      window.localStorage.setItem("checked", newValue);
      if (newValue) {
        window.localStorage.setItem("username", this.ruleForm.username);
        window.localStorage.setItem("password", this.ruleForm.password);
      }
    },
  },
  created() {
    const isRem = Boolean(window.localStorage.getItem("checked"));
    this.checked = isRem;
    if (isRem) {
      this.ruleForm.username = window.localStorage.getItem("username");
      this.ruleForm.password = window.localStorage.getItem("password");
    }
  },
};
</script>

<style lang="scss" scoped>
.full {
  width: 100vw;
  height: 100vh;
}
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.card-padding {
  padding: 40px;
}
</style>
