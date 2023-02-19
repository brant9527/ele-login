<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/index">主 页</el-menu-item>
          <el-menu-item index="/users">账号管理</el-menu-item>

          <el-menu-item index="/puppeteer">自动提现</el-menu-item>
          <el-menu-item index="/xlsx">数据导出</el-menu-item>
        </el-menu>
      </el-header>
    </el-container>
    <el-container>
      <el-main>
        <el-card>
          <!-- 不需要缓存的 -->
          <router-view />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "app",

  data() {
    return {
      activeIndex: this.$route.path,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.$router.push(key);
    },
  },
};
</script>

<style>
</style>>
