<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            v-model="addInput"
            placeholder="请输入内容"
            class="input"
            clearable
            @clear="clearInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="addBtn"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table :data="goodsTableData" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170px">
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <template scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeBtn(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单绑定数据
      addInput: "",
      //商品表格数据
      goodsTableData: [],
      //商品总数
      total: 0,
      //表格参数请求对象
      goodsTableParams: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //分页的当前页
      currentPage: 1,
      //分页的每页几条数据
      pageSize: 10,
    };
  },

  components: {},

  computed: {},

  methods: {
    async getTableData() {
      const { data: res } = await this.$http.get("goods", {
        params: this.goodsTableParams,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取表格数据失败");
      this.$message.success("获取表格数据成功");
      console.log(res);
      this.total = res.data.total;
      this.goodsTableData = res.data.goods;
    },
    //分页的点击切换每页几条
    handleSizeChange(newValue) {
      this.goodsTableParams.pagesize = newValue;
      this.getTableData();
    },
    //分页的点击切换第几页
    handleCurrentChange(newValue) {
      this.goodsTableParams.pagenum = newValue;
      this.getTableData();
    },
    //添加属性按钮
    async addBtn() {
      this.goodsTableParams.query = this.addInput;
      const { data: res } = await this.$http.get(`goods`, {
        params: this.goodsTableParams,
      });
      if (res.meta.status !== 200) return this.$message.error("搜索商品失败");
      this.getTableData();
    },
    //搜索按钮清除时触发
    clearInput() {
      this.goodsTableParams.query = "";
      this.getTableData();
    },
    //删除按钮触发
    removeBtn(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `goods/${row.goods_id}`
          );
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.$message.success("删除成功");
          this.getTableData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //添加商品按钮点击
    addGood() {
      this.$router.push("goods/add");
    },
  },
  created() {
    this.getTableData();
  },
};
</script>
<style lang='css' scoped>
.input {
  width: 400px;
}
</style>