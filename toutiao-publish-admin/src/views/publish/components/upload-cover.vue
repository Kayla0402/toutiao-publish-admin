<template>
  <div class="upload-cover">
    <div class="cover-wrap" @click="dialogVisible = true">
      <img :src="value" class="cover-image" ref="cover-image" />
    </div>
    <!-- 弹出层 -->
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :append-to-body="true"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <image-list
            ref="imageList"
            :isShowAdd="false"
            isShowSelected
            :isShowAction="false"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input id="file" type="file" @change="onFileChange" ref="uploadInp" />

          <img :src="uploadImage" width="100" alt="" />
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImg } from "@/api/images";
import ImageList from "@/components/images-list";

export default {
  name: "Upload",
  // props: ['cover-image'],
  props: ["value"],
  components: {
    ImageList,
  },
  data() {
    return {
      dialogVisible: false,
      activeName: "first",
      uploadImage: "",
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    onFileChange() {
      const file = this.$refs.uploadInp;
      // console.log(file.files[0])
      this.uploadImage = window.URL.createObjectURL(file.files[0]);
      // this.$refs.uploadInp.value = ""
    },
    onCoverConfirm() {
      // 选择文件之后在确定上传
      if (this.activeName === "second") {
        const file = this.$refs.uploadInp.files[0];
        console.log(file);
        if (!file) {
          this.$message("请选择文件");
          return; // 不加return得用else嵌套
        }
        const fd = new FormData();
        fd.append("image", this.$refs.uploadInp.files[0]);
        uploadImg(fd).then((res) => {
          this.dialogVisible = false;
          this.$message.success("上传成功");
          // this.$refs['cover-image'].src = res.data.data.url
          // 将图片地址发送给父组件
          // this.$emit('update-cover', res.data.data.url)
          this.$emit("input", res.data.data.url);
        });
      } else if (this.activeName === "first") {
        // 父组件直接访问子组件中的数据
        const imageList = this.$refs["imageList"];
        const selected = imageList.selected;
        if (selected === null) {
          this.$message("请选择图片");
          return;
        }
        this.dialogVisible = false;
        this.$emit("input", imageList.images[selected].url);
      }
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-image {
    height: 120px;
    max-width: 100%;
  }
}
</style>