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
          v-for="image in images"
          :key="image.id"
          class="image-item"
        >
          <el-image
            style="height: 100px"
            :src="image.url"
            fit="cover"
          ></el-image>
          <div class="image-action">
            <!-- 收藏，取消收藏时，按钮图标禁止点击，
            不用使用i标签，不好处理
            :loading="isLoading" 这样绑定loading，
            则每个图片对象的loading状态都是一样的
             -->
            <el-button
              :icon="
                image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'
              "
              circle
              size="small"
              @click="onCollect(image)"
              :loading="image.loading"
            ></el-button>
            <!-- <i :class="{
              'el-icon-star-on': image.is_collected,
              'el-icon-star-off': !image.is_collected,
              }"
              @click="onCollect(image)"></i> -->
            <!-- <i class="el-icon-delete" @click="onCollect(image)"></i> -->
            <el-button
              icon="el-icon-delete"
              circle
              size="small"
              @click="onDelete(image)"
              :loading="image.delLoading"
            ></el-button>
          </div>
        </el-col>
      </el-row>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="page"
        @current-change="currentChange"
        :page-size="per_page"
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
import { getImages, collectImages, deleteImages } from "@/api/images";
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
      // isLoading: true， 图片收藏的loading，这样添加每个image的loading状态都是一样的
    };
  },
  components: {},
  methods: {
    loaderImages() {
      getImages({
        collect: this.collect,
        page: this.page,
        per_page: this.per_page,
      }).then((res) => {
        const results = res.data.data.results;
        results.forEach((img) => {
          /* img对象本来是没有loading属性的，
          我们在这里添加loading属性是来控制每个收藏按钮的loading
          状态，不然所有的loading都是一样的 */
          img.loading = false;
          img.delLoading = false;
        });
        this.images = results;
        this.total = res.data.data.total_count;
        // this.isLoading = false
      });
    },
    onCollectChange() {
      this.page = 1;
      this.loaderImages();
    },
    updateSuccess() {
      this.dialogVisible = false;
      this.loaderImages();
    },
    currentChange(page) {
      this.page = page;
      this.loaderImages();
    },
    // 收藏图片
    onCollect(img) {
      img.loading = true;
      // this.isLoading = true
      collectImages(img.id, !img.is_collected).then((res) => {
        img.is_collected = !img.is_collected;
        // this.isLoading = false
        img.loading = false;
      });
    },
    // 删除图片
    onDelete(img) {
      img.delLoading = true;
      deleteImages(img.id).then((res) => {
        this.page = 1;
        this.loaderImages();
        this.delLoading = false;
      });
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

.image-action {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: #fff;
  height: 40px;
  background-color: rgba(204, 204, 204, 0.5);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
  i {
    font-size: 25px;
  }
}
.image-item {
  position: relative;
}
</style>