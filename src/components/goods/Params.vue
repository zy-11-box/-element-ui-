<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
      >
      </el-alert>
      <el-row class="row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="goodsCateValue"
            :options="goodsCateoptions"
            :props="goodsCateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeParamsName" @tab-click="handleParamsClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="first">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addBtn"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template scope="scope">
                <el-tag
                  class="el-tag"
                  :key="index"
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="tagClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputParamsVisible"
                  v-model="scope.row.inputParamsValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addBtn"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template scope="scope">
                <el-tag
                  class="el-tag"
                  :key="index"
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="tagClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputParamsVisible"
                  v-model="scope.row.inputParamsValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性对话框 -->
    <el-dialog
      :title="'添加' + activeTitle"
      :visible.sync="dialogParamsVisible"
      width="50%"
      @close="addFormClose"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="activeName == 'many' ? '动态参数' : '静态属性'"
          prop="name"
        >
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数/属性对话框 -->
    <el-dialog
      :title="'修改' + activeTitle"
      :visible.sync="dialogEditVisible"
      width="50%"
      @close="editFormClose"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="activeName == 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //级联的选择数据
      goodsCateValue: [],
      //级联的配置
      goodsCateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //级联的数据
      goodsCateoptions: [],
      //标签页的选择数据
      activeParamsName: "first",
      //动态参数表格数据
      manyTableData: [],
      //静态属性表格数据
      onlyTableData: [],
      //是否打开参数/属性对话框
      dialogParamsVisible: false,
      //添加参数/属性表单数据
      addForm: {
        name: "",
      },
      //添加参数/属性表单验证规则
      addRules: {
        name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
      },
      //修改参数/属性对话框是否打开
      dialogEditVisible: false,
      //修改参数/属性的数据
      editForm: {
        attr_name: "",
      },
      //修改参数/属性的验证规则
      editRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      //将修改参数/属性的id分别保存起来
      paramsId: "",
      //由于每一行都有展开行，共用一个inputParamsVisible，和inputParamsValue会发生联动效果
      // //展开行中的input是否显示
      // inputParamsVisible: false,
      // //展开行中的input的数据绑定
      // inputParamsValue: "",
    };
  },

  components: {},

  computed: {},

  methods: {
    //获取商品分类数据
    async getGoodsCata() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      this.$message.success("获取商品分类数据成功");
      this.goodsCateoptions = res.data;
    },
    //选择级联时触发
    handleChange() {
      if (this.goodsCateValue.length !== 3) {
        this.goodsCateValue = [];
        this.manyTableData = [];
        this.onlyTableData = [];
      }
      //获取表格中的数据
      this.getTableData();
    },
    //标签页的点击触发
    handleParamsClick() {
      this.getTableData();
    },
    //获取表格中的数据
    async getTableData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputParamsVisible = false;
        item.inputParamsValue = "";
      });
      if (this.activeName == "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //添加参数/属性触发
    addBtn() {
      this.dialogParamsVisible = true;
    },
    //添加参数/属性表单的确定按钮
    async addFormTrue() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        { attr_name: this.addForm.name, attr_sel: this.activeName }
      );
      if (res.meta.status !== 201) return this.$message.error("添加数据失败");
      this.$message.success("添加数据成功");
      this.getTableData();
      this.dialogParamsVisible = false;
    },
    //监听添加参数/属性表单的关闭事件
    addFormClose() {
      this.$refs.addRuleForm.resetFields();
    },
    //删除参数/属性按钮
    removeParams(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${row.attr_id}`
          );
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.getTableData();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //编辑参数/属性按钮
    async editParams(row) {
      //将原来的参数/属性显示出来
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${row.attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("编辑失败");
      this.paramsId = res.data.attr_id;
      this.editForm.attr_name = res.data.attr_name;
      this.dialogEditVisible = true;
    },
    //修改参数/属性的确定按钮
    editFormTrue() {
      this.$refs.editRuleForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.paramsId}`,
            { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
          );
          if (res.meta.status !== 200)
            return this.$message.error("修改参数失败");
          this.$message.success("修改参数成功");
          this.getTableData();
          this.dialogEditVisible = false;
        } else {
          this.$message.error("验证失败");
        }
      });
    },
    //修改参数/属性的关闭事件
    editFormClose() {
      this.$refs.editRuleForm.resetFields();
    },
    //展开行的input回车或失去焦点触发
    handleInputConfirm(row) {
      //判断表单中的数据是否全为空
      if (row.inputParamsValue.trim().length == 0) {
        row.inputParamsValue = "";
        row.inputParamsVisible = false;
        return;
      }
      //不为空
      row.attr_vals.push(row.inputParamsValue.trim());
      row.inputParamsValue = "";
      row.inputParamsVisible = false;
      this.saveAttrVals(row);
    },
    //对attr_vals的操作保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("更新数据失败");
      this.$message.success("更新数据成功");
    },
    //展开行的按钮点击触发
    showInput(row) {
      row.inputParamsVisible = true;
    },
    //点击tag关闭触发
    tagClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
  },
  computed: {
    isDisabled() {
      return this.goodsCateValue.length === 0 ? true : false;
    },
    //计算属性记录分类ID
    cateId() {
      return this.goodsCateValue[this.goodsCateValue.length - 1];
    },
    //记录当前tab栏的值
    activeName() {
      if (this.activeParamsName == "first") return "many";
      return "only";
    },
    activeTitle() {
      if (this.activeParamsName == "first") return "参数";
      return "属性";
    },
  },
  created() {
    this.getGoodsCata();
  },
};
</script>
<style lang='css' scoped>
.row {
  margin-top: 15px;
}
.el-tag {
  margin: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>