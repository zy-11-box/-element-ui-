<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格 -->
      <treeTable
        :data="treeTableData"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
        tree-type
        :columns="treeTableColumns"
        class="treeTable"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: #90ee90"
            v-if="scope.row.cat_deleted == false"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editCate(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeCate(scope.row)"
            >删除</el-button
          >
        </template>
      </treeTable>
      <!-- 添加分类弹窗 -->
      <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%"
        @close="setDialogClosed"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="ruleForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级类别:">
            <el-cascader
              v-model="selectedKeys"
              :options="options"
              :props="cascaderProps"
              @change="handleChange"
              expandTrigger="hover"
              change-on-select
              clearable
              class="cascader"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="trueDialogVisible">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="treeTableParams.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="treeTableParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 修改 -->
      <el-dialog title="修改分类" :visible.sync="isEditVisible" width="50%">
        <el-form
          :model="editCateForm"
          ref="editCateRef"
          :rules="editCateRules"
          label-width="70px"
          @close="editCateClose"
        >
          <el-form-item label="分类名" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateTrue">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除 -->
      <el-dialog title="删除分类" :visible.sync="isRemoveVisible" width="50%">
        <el-form
          :model="removeCateForm"
          ref="removeCateRef"
          :rules="removeCateRules"
          label-width="70px"
          disabled
        >
          <el-form-item label="分类名" prop="cat_name">
            <el-input v-model="removeCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isRemoveVisible = false">取 消</el-button>
          <el-button type="primary" @click="removeCateTrue">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //treeTable的数据
      treeTableData: [],
      //treeTable的参数
      treeTableParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //总数
      total: 0,
      //treeTable的columns配置
      treeTableColumns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          prop: "cat_pid",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          prop: "cat_pid",
          type: "template",
          template: "opt",
        },
      ],
      //添加分类是否弹出
      dialogVisible: false,
      //添加分类表单数据
      ruleForm: {
        //分类名称
        cat_name: "",
        //分类父 ID
        cat_pid: 0,
        //分类层级
        cat_level: 0,
      },
      //分类名称的验证规则
      rules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
      //级联选择器的数据
      options: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择器的选择的值
      selectedKeys: [],
      //是否打开编辑分类
      isEditVisible: false,
      //编辑分类数据
      editCateForm: {
        cat_name: "",
        cat_id: 0,
      },
      //编辑分类表单验证规则
      editCateRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      //删除分类数据
      removeCateForm: {
        cat_name: "",
        cat_id: 0,
      },
      //是否打开删除
      isRemoveVisible: false,
      //删除分类表单验证规则
      removeCateRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
    };
  },

  components: {},

  computed: {},

  methods: {
    async getTreeTableData() {
      const { data: res } = await this.$http.get("categories", {
        params: this.treeTableParams,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品参数数据失败");
      this.treeTableData = res.data.result;
      this.total = res.data.total;
    },
    //点击添加分类触发
    async addCate() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级类别数据失败");
      this.options = res.data;
      this.dialogVisible = true;
    },
    //关闭添加分类触发
    setDialogClosed() {
      this.$refs.ruleForm.resetFields();
      this.selectedKeys = [];
      this.ruleForm.cat_level = 0;
      this.ruleForm.cat_pid = 0;
      this.ruleForm.cat_name = "";
    },
    //级联选择器选择时触发
    handleChange() {
      if (this.selectedKeys.length) {
        this.ruleForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.ruleForm.cat_level = this.selectedKeys.length;
      } else {
        this.ruleForm.cat_pid = 0;
        this.ruleForm.cat_level = 0;
      }
    },
    //添加分类的确定按钮
    trueDialogVisible() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            "categories",
            this.ruleForm
          );
          this.$message.success("添加表单成功");
          this.dialogVisible = false;
        } else {
          this.$message.error("表单验证失败");
          return false;
        }
      });
    },
    //分页的几条每页
    handleSizeChange(newValue) {
      this.treeTableParams.pagesize = newValue;
      this.getTreeTableData();
    },
    //分页的点击当前页
    handleCurrentChange(newValue) {
      this.treeTableParams.pagenum = newValue;
      this.getTreeTableData();
    },
    //编辑分类功能
    editCate(cateData) {
      this.isEditVisible = true;
      this.editCateForm.cat_name = cateData.cat_name;
      this.editCateForm.cat_id = cateData.cat_id;
    },
    //确定修改分类
    editCateTrue() {
      this.$refs.editCateRef.validate(async (boolean) => {
        if (boolean) {
          const { data: res } = await this.$http.put(
            `categories/${this.editCateForm.cat_id}`,
            { cat_name: this.editCateForm.cat_name }
          );
          if (res.meta.status !== 200)
            return this.$message.error("修改分类失败");
          this.getTreeTableData();
          this.isEditVisible = false;
          this.$message.success("修改分类成功");
        } else return this.$message.error("验证表单失败");
      });
    },
    //监听编辑分类的关闭
    editCateClose() {
      this.$refs.editCateRef.resetFields();
    },
    //删除分类按钮
    removeCate(cateData) {
      this.removeCateForm.cat_name = cateData.cat_name;
      this.removeCateForm.cat_id = cateData.cat_id;
      this.isRemoveVisible = true;
    },
    //确定删除分类
    async removeCateTrue() {
      const { data: res } = await this.$http.delete(
        `categories/${this.removeCateForm.cat_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除分类失败");
      this.getTreeTableData();
      this.isRemoveVisible = false;
      this.$message.success("删除分类成功");
    },
  },
  created() {
    this.getTreeTableData();
  },
};
</script>
<style lang='css' scoped>
.treeTable {
  margin: 15px 0;
}
.cascader {
  width: 100%;
}
</style>