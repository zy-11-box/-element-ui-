<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            v-model="searchInput"
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
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderTableData" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="250px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="200px">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="200px">
          <template scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay == 0" width="200px"
              >未付款</el-tag
            >
            <el-tag type="success" v-else width="200px">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="200px">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200px">
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderData.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="orderData.pagesize"
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
      //请求订单数据对象
      orderData: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //搜素表单
      searchInput: "",
      //订单表格数据
      orderTableData: [],
      //商品总数
      total: 0,
    };
  },

  components: {},

  computed: {},

  methods: {
    //获得订单数据
    async getOrderData() {
      const { data: res } = await this.$http.get("orders", {
        params: this.orderData,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单数据失败");
      this.$message.success("获取订单数据成功");
      this.orderTableData = res.data.goods;
      this.total = res.data.total;
    },
    //点击清除触发
    clearInput() {},
    //点击按钮搜索
    addBtn() {
      this.orderData.query = this.searchInput;
      this.getOrderData();
    },
    //点击切换每页几条
    handleSizeChange(newValue) {
      this.orderData.pagesize = newValue;
      this.getOrderData();
    },
    //点击第几页
    handleCurrentChange(newValue) {
      this.orderData.pagenum = newValue;
      this.getOrderData();
    },
  },
  mounted() {
    this.getOrderData();
  },
};
</script>
<style lang='css' scoped>
</style>