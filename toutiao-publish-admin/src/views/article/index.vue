<template>
  <div>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!-- el-radio 把label作为文本和选中之后的value值 -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select placeholder="请选择频道" v-model="channelId">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <!-- button按钮的click事件有一个默认参数，当你没有指定参数的时候，它会默认传递一个没用的数据 -->
          <el-button :disabled="loading" type="primary" @click="loadArticles(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询 {{ total }} 条结果：
      </div>
      <el-table
        size="mini"
        class="list-table"
        :data="articles"
        stripe
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="" label="封面">
          <template slot-scope="scope">
            <!-- 下边这种情况是在运行期间动态改变处理的，而本地图片必须要打包的时候就存在 -->
            <!-- <img class="article-cover" :src="scope.row.cover.images[0] || './error.gif'"> -->
            <!-- <img
              v-if="scope.row.cover.images[0]"
              class="article-cover"
              :src="scope.row.cover.images[0]"
              alt=""
            /> -->
            <!-- <img v-else class="article-cover" src="./error.gif" alt="" /> -->
            <el-image
              lazy
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
            >
              <div slot="placeholder" class="image-slote">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <!-- 获取当前行数据，template声明 slot-scope=“scope” -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
            <!-- <el-tag v-if="scope.row.status === 0">草稿 {{scope.row.status}}</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="info" v-else-if="scope.row.status === 4">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @current-change="onCurrentChange"
        :disabled="loading"
        :current-page.sync="page"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getArticles,
  getArticlesChannels,
  deleteArticles,
} from "@/api/article";
export default {
  data() {
    return {
      articles: [],
      channels: [],
      articleStatus: [
        { text: "草稿", status: 0, type: "info" }, // 0
        { text: "待审核", status: 1, type: "" }, //1
        { text: "审核通过", status: 2, type: "success" }, //2
        { text: "审核失败", status: 3, type: "warning" }, //3
        { text: "已删除", status: 4, type: "danger" }, //4
      ],
      total: 0,
      pageSize: 20,
      status: null, // 查询文章的状态，不传是全部
      channelId: null, // 文章频道id
      rangeDate: null,
      loading: true, // 表格加载中
      // 保存的是当前页面，等于current-page，current-page添加.sync
      page: 1
    };
  },
  methods: {
    onCurrentChange(page) {
      this.loadArticles(page);
    },
    onSubmit() {
      console.log("submit!");
    },
    loadArticles(page = 1) {
      this.loading = true;
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null,
      }).then((res) => {
        this.articles = res.data.data.results;
        this.total = res.data.data.total_count;
        this.loading = false;
      });
    },
    loadArticlesChannels() {
      getArticlesChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    onDeleteArticle(id) {
      this.$confirm("确认删除吗？", "删除提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteArticles(id.toString()).then((res) => {
            this.loadArticles(this.page)
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.loadArticles();
    this.loadArticlesChannels();
  },
};
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 60px;
  background-size: cover;
}
</style>