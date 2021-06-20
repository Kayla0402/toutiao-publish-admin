<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
        <!-- el-radio-button的click事件默认执行两次 -->
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
        <!-- <el-radio-button label="收藏" @click.native="loaderImages(true)"></el-radio-button> -->
      </el-radio-group>

      <el-button
        style="float: right"
        size="mini"
        type="success"
        @click="dialogVisible = true"
        >上传素材</el-button
      >

      <el-row :gutter="10" class="img-box">
        <el-col
          :md="6"
          :lg="4"
          :sm="6"
          :xs="12"
          class="img-item"
          v-for="image in images"
          :key="image.id"
        >
          <el-image
            style="height: 100px"
            :src="image.url"
            fit="cover"
          ></el-image>
          <div class="select-btn">
            <i class="el-icon-star-on"></i>
            <i class="el-icon-delete"></i>
          </div>
        </el-col>
      </el-row>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="page"
        @current-change="currentChange"
      ></el-pagination>
    </el-card>
    
    <el-dialog
      title="上传素材"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <!-- upload组件本身就支持请求提交上传操作，说白了你使用它不用自己去发请求，
      他会自己发请求。 请求方法：默认post，请求路径action 
      -->
      <!-- show-file-list = "false" -->
      <el-upload
        v-if="dialogVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        :headers="uploadHeaders"
        name="image"
        :on-success="updateSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages } from "@/api/images";
export default {
  name: "ImageTem",
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      collect: false,
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      images: [],
      dialogVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      total: 0,
      page: 1,
      per_page: 10,
    };
  },
  components: {},
  methods: {
    loaderImages(collect = false) {
      getImages({
        collect,
        page: this.page,
        per_page: this.per_page,
      }).then((res) => {
        this.images = res.data.data.results;
        this.total = res.data.data.total_count;
      });
    },
    onCollectChange(value) {
      this.page = 1;
      this.loaderImages(value);
    },
    updateSuccess() {
      this.dialogVisible = false;
      this.loaderImages(false);
    },
    currentChange(page) {
      this.page = page;
      this.loaderImages();
    },
  },
  created() {
    this.loaderImages();
  },
};
</script>

<style lang="less" scoped>
.img-box {
  margin-top: 20px;
}
.img-item {
  margin: 0 20px 20px;
  position: relative;
}
.select-btn {
  position: relative;
  bottom: 0;
  top: -35px;
  // width: 180px;
  height: 30px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  font-size: 21px;
  justify-content: space-around;
  align-items: center;
  i {
    cursor: pointer;
  }
}

.selected-div {
  position: relative;
}

.selected {
  // background: url("./selected.png") no-repeat;
  background-size: cover;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>