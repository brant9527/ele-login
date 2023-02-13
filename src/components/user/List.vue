<template>
  <div>
    <el-input
      type="textarea"
      :autosize="{ minRows: 20, maxRows: 100 }"
      placeholder="请输入账号密码，格式：账号+密码（输入完成后回车另起一行）"
      v-model="userList"
    >
    </el-input>
    <el-button @click="save" class="btn" type="primary" >保存</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: "",
    };
  },
  created() {
    this.userList = window.localStorage.getItem("userList");
  },
  methods: {
    save() {
      window.localStorage.setItem("userList", this.userList);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
  },
};
</script>
<style lang="scss" scoped>
.btn{
  margin: 10px auto;
  display: block;
}
</style>