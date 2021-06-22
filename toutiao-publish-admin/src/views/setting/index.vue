<template>
  <div class="setting-contianer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="编号"> {{ user.id }} </el-form-item>
            <el-form-item label="手机"> {{ user.mobile }} </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="updateLoadingProfile"
                @click="onSubmit"
                >保存设置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <!-- <el-avatar shape="square" :size="100" fit="cover" :src="user.photo"></el-avatar> -->
          <!-- <p @click="$refs.file.click()">点击修改头像</p>
          <input type="file" hidden ref="file"> -->
          <label for="file">
            <el-avatar
              shape="square"
              :size="100"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            type="file"
            id="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :append-to-body="true"
      @opened="onDialogOpen"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img ref="previewImg" class="preview-image" :src="previewImg" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onUpdatePhoto"
          :loading="updatePhotoLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from "@/api/user";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import globalBus from "@/utils/globalBus";

/**
 * this.$refs.previewImg
 */
export default {
  name: "Setting",
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      user: {},
      dialogVisible: false,
      previewImg: "", // 预览的图片
      cropper: null, // 裁剪器
      updateLoadingProfile: false, // 更新用户基本信息的loading状态
      updatePhotoLoading: false, // 更新用户头像是确认按钮的loading状态
    };
  },
  methods: {
    // 用户更新信息保存
    onSubmit() {
      // 表单验证
      this.updateLoadingProfile = true;
      updateUserProfile(this.user).then((res) => {
        this.$message.success("修改成功！");
        this.updateLoadingProfile = true;
        // 事件总线，通知顶部用户信息要修改
        globalBus.$emit("update-user", this.user);
      });
    },
    loadUser() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    onFileChange() {
      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true;
      // 预览用户选择的图片
      const file = this.$refs.file;
      const blobData = window.URL.createObjectURL(file.files[0]);
      this.previewImg = blobData;

      // 只有当图片不同时才会触发，相同的图片不会触发该事件
      this.$refs.file.value = "";
    },
    // 裁剪器完全打开回调
    onDialogOpen() {
      // 图片裁剪器必须基于img 进行初始化，
      // 注意 img 必须是可见状态才能完成初始化
      // 对话框中初始化裁剪器，要等对话框完全打开之后在初始化裁剪器
      const image = this.$refs.previewImg;

      /**
       * 第一次初始化之后，如果预览的图片发生了变化，裁剪器不会更新。
       * 如果需要预览图片发生变化需要更新裁剪器
       * 方法一： 裁剪器.replace()方法
        if(this.cropper) {
          this.cropper.replace(this.previewImg)
          return
        }
       * 方法二： 销毁裁剪器，重新初始化 监听弹框关闭
       this.cropper.destroy()
       */

      this.cropper = new Cropper(image, {
        aspectRatio: 1 / 1, // 宽高比
        viewMode: 1, // 是否可以裁剪到图片之外
        dragMode: "none", // 移动画布
        // cropBoxMovable: false, // 裁剪区域移动
        cropBoxResizable: false, // 裁剪区域缩放
        // background: false, // 背景空白区
        // movable: true,
        /**
         * 移动裁剪器的时候会触发crop方法
         */
        crop(event) {
          // console.log(event.detail.x);
          // console.log(event.detail.y);
          // console.log(event.detail.height);
          // console.log(event.detail.width);
        },
      });
    },
    // 裁剪器弹框完全关闭回调
    onDialogClosed() {
      /**
       * 由于实例化Cropper是在弹框完全打开之后的回调onDialogOpen
       * 中创建的，然而在弹框完全关闭的回调，此方法中无法获取Cropper
       * 实例，所以把Cropper这个实例初始化在data中。
       */
      this.cropper.destroy();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 更新头像
    onUpdatePhoto() {
      /**
       * 获取裁剪的图片对象
       * 请求更新头像
       * 关闭对话框
       * 更新视图展示
       */
      this.updatePhotoLoading = true;
      this.cropper.getCroppedCanvas().toBlob((file) => {
        const fd = new FormData();
        fd.append("photo", file);
        updateUserPhoto(fd).then((res) => {
          this.dialogVisible = false;
          this.$message.success("头像修改成功");

          // 服务端返回的图片直接展示有点慢，在线地址，还需要发请求，在展示
          // 页面中引入的外链都需要发请求，多了一次请求。
          // this.user.photo = res.data.data.photo;
          this.user.photo = window.URL.createObjectURL(file);

          // 事件总线，通知顶部用户信息要修改
          globalBus.$emit("update-user", this.user);

          this.updatePhotoLoading = false;
        });
      });
    },
  },
  created() {
    this.loadUser();
  },
};
</script>

<style lang="less" scope>
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>