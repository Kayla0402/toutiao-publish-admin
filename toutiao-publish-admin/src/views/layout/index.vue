<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="200px">
      <app-aside class="aside-menu"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
        <i class="el-icon-s-fold"></i>
          xxxxxxx有限公司
          </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./components/aside.vue";
export default {
  name: "LayoutIndex",
  components: {
    AppAside,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background: #d3dce6;
}
.header {
  background: #b3c0d1;
}
.main {
  background: #e9eef3;
}
.aside-menu {
  height: 100%;
}
</style>