<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
<!-- 图片列表 -->
     <image-list />
    </el-card>
  </div>
</template>

<script>
import ImageList from "@/components/images-list"
export default {
  name: "ImageTem",
  data() {
    return {}
  },
  components: {
    ImageList
  },
  
};
</script>

<style lang="less" scoped>

</style>