<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table class="table-list" :data="articles" stripe style="width: 100%">
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column prop="address" label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? "正常" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatuschange(scope.row)"
              :disabled="scope.row.disabled"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
        分页 current-page： 当前高亮页码 
        page-sizes: 控制可选的页码大小
        page-size： 当前分页每页多少条
        page-size添加sync会根据每页展示多少条都回调@size-change自动绑定
        current-page添加sync会在@current-change改变时自动把当前页码同步到page变量中
      -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from "@/api/article";
export default {
  name: "Comment",
  data() {
    return {
      articles: [], // 评论列表
      total: 0,
      per_page: 20,
      page: 1,
    };
  },
  methods: {
    handleSizeChange(val) {
      // this.per_page = val;
      this.page = 1;
      this.loadArticles();
    },
    handleCurrentChange(val) {
      // this.page = val;
      this.loadArticles();
    },
    loadArticles() {
      getArticles({
        response_type: "comment",
        per_page: this.per_page,
        page: this.page,
      }).then((res) => {
        const results = res.data.data.results;
        results.forEach((res) => {
          res.disabled = false;
        });
        this.articles = results;
        this.total = res.data.data.total_count;
      });
    },
    // 切换操作事件
    onStatuschange(article) {
      article.disabled = true;
      updateCommentStatus(article.id.toString(), article.comment_status).then(
        (res) => {
          article.disabled = false;
          if(article.comment_status) {
            this.$message.success('开启文章评论状态')
          } else {
            this.$message.success('关闭文章评论状态')
          }
        }
      );
    },
  },
  created() {
    this.loadArticles();
  },
};
</script>

<style lang="less" scoped>
.table-list {
  margin-bottom: 30px;
}
</style>
