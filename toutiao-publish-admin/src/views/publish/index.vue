<template>
  <div class="publish-contianer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "编辑文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="publishForm"
        :rules="formRules"
        :model="article"
        label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <!-- <el-tiptap
            v-model="article.content"
            :extensions="extensions"
          ></el-tiptap> -->
          <el-tiptap
            v-model="article.content"
            lang="zh"
            height="400"
            :extensions="extensions"
          />
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 需要把子组件上传文件的图片地址放在article.cover.images中 -->
          <!-- 上传封面组件 -->
          <!-- 
            事件处理函数自定义传参以后还要得到原来事件本身的参数，
          则手动指定$event，它代表事件本身的参数 ，
          onUpdateCover(index)，想要接受当前遍历的索引，
          并且达到该事件本身传递的url地址
          -->
          <!-- 
            当给子组件传递的数据既要使用又要修改，这个时候用
            v-model简化数据的绑定，自定义组件的双绑
            v-model="article.cover.images[index]"相当于下两句简写
            给子组件传递了一个名叫value的数据，默认传递的值为value
            默认的事件名为input
            :value="article.cover.images[index]"
            默认监听input事件，当事件input发生改变当前值为事件参数
            @input="article.cover.images[index] = 事件参数 "
            v-model只是简写了而已，本质还是在父子组件间的通讯
           -->
          <template v-if="article.cover.type > 0">

            <upload-cover :key="cover" 
              v-for="(cover, index) in article.cover.type"
              v-model="article.cover.images[index]"
             />

            <!-- <upload-cover :key="cover" 
            :cover-image="article.cover.images[index]"
            v-for="(cover, index) in article.cover.type"
            @update-cover="onUpdateCover(index, $event)"/> -->
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择活动区域">
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import element-tiptap 样式
import "element-tiptap/lib/index.css";
import UploadCover from "./components/upload-cover.vue"
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
} from "element-tiptap";
import {
  getArticlesChannels,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article";
import { uploadImg } from "@/api/images";

export default {
  name: "Publish",
  components: {
    "el-tiptap": ElementTiptap,
    UploadCover,
  },
  data() {
    return {
      article: {
        title: "",
        content: "",
        cover: {
          type: 3,
          images: [],
        },
        channel_id: null,
      },
      channels: [],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline(),
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          // 默认会把本地上传的图片生成base64，字符串和内容存储在一起，
          // 会影响加载速度，必须把内容全都加载完之后才渲染内容，可以自定义图片上传
          uploadRequest(file) {
            // 如果接口要求content-type是multipart/form-data，则请求题必须使用FormData
            const fd = new FormData();
            fd.append("image", file);
            // 第一个return返回的是一个promise对象，因为axios本身就是返回promise对象
            return uploadImg(fd).then((res) => {
              // 这个return是返回最后的结果，外链图片地址
              return res.data.data.url;
            });
          },
        }),
      ],
      formRules: {
        title: [
          { required: true, message: "请输入文章辩题", trigger: "blur" },
          { min: 5, max: 30, message: "长度5-30之间", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入文章内容" },
          {
            validator: (rule, value, callback) => {
              if (value === "<p></p>") {
                callback(new Error("请输入文章内容"));
              } else {
                callback();
              }
            }
          }
        ],
        channel_id: [{ required: true, message: "请选择文章频道" }],
      },
    };
  },
  methods: {
    onPublish(draft) {
      this.$refs.publishForm.validate(valid => {
          if (!valid) return;
          // 如果是修改文章，则执行修改操作，否则执行添加文章
          if (this.$route.query.id) {
            updateArticle(this.$route.query.id, this.article, draft).then(
              (res) => {
                if (draft) {
                  this.$message.success("存入草稿成功");
                } else {
                  this.$message.success("修改成功");
                  this.$router.push("/article");
                }
              }
            );
          } else {
            addArticle(this.article, draft).then((res) => {
              if (draft) {
                this.$message.success("存入草稿成功");
              } else {
                this.$message.success("发布成功");
              }
              this.$router.push("/article");
            });
          }
        });
    },
    loaderChannels() {
      getArticlesChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    // 加载文章内容
    loadeArticle() {
      getArticle(this.$route.query.id).then((res) => {
        this.article = res.data.data;
      });
    },
    // onUpdateCover(index, url) {
    //   this.article.cover.images[index] = url
    // }
  },
  created() {
    this.loaderChannels();

    console.log(this.$route.query);
    // 由于发布和编辑是同一个组件，判断路径中是否有id参数，
    if (this.$route.query.id) {
      this.loadeArticle();
    }
  },
};
</script>

<style lang="less" scoped>
</style>