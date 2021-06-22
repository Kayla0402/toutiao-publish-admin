<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="auto">
      <app-aside class="aside-menu" :is-collapse="isCollapse"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse,
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>xxxxxxx有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!--
              组件默认是不识别原生事件的，除非内部做了处理
              https://cn.vuejs.org/v2/guide/components-custom-events.html#%E5%B0%86%E5%8E%9F%E7%94%9F%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A%E5%88%B0%E7%BB%84%E4%BB%B6
             -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
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
import { getUserProfile } from "@/api/user";
import globalBus from "@/utils/globalBus";

export default {
  name: "LayoutIndex",
  components: {
    AppAside,
  },
  data() {
    return {
      user: {},
      isCollapse: false,
    };
  },
  methods: {
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    onLogout() {
      this.$confirm("退出登陆, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 把用户的登录状态清除
          window.localStorage.removeItem("user");
          // 跳转到登录页面
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
  created() {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile();

    // 只有当事件发布以后，才会调用该事件总线
    globalBus.$on("update-user", (data) => {
      /**
       * 不能直接赋值给this.user = data；
       * 会导致当前的this.user的指向发生改变，
       * 造成修改个人基本信息时顶部用户名也会跟着改变，
       * 引用类型赋值是指针的赋值  
       * 对象之间赋值的是引用，会导致值之间的相互影响。
       */
      this.user.name = data.name;
      this.user.photo = data.photo;
    });
  },
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
.main {
  background: #e9eef3;
}
.aside-menu {
  height: 100%;
}
</style>