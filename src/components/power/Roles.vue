<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesData" style="width: 100%" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="['bottom', index === 0 ? 'top' : '', 'elRow']"
            >
              <!-- 渲染第一层 -->
              <el-col :span="5">
                <el-tag closable @close="tagClose1(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="index2 !== item1.children.length - 1 ? 'bottom1' : ''"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="tagClose1(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="tagClose1(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="400">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="400">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="assignRole(scope.row)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        :props="treeProps"
        ref="treeRightsList"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changRightsList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesData: [],
      dialogVisible: false,
      //权限列表（tree）
      rightsList: [],
      //tree以什么为节点和显示什么
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      //用一个值保存roleId
      roleId: "",
    };
  },

  components: {},

  computed: {},

  methods: {
    async getRolesData() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("获取信息失败");
      this.rolesData = res.data;
    },
    tagClose1(role, id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          const { data: res } = await this.$http.delete(
            "roles/" + role.id + "/rights/" + id
          );
          if (res.meta.status !== 200)
            return this.$message.error("删除权限失败");
          // this.getRolesData(); 这样将会重新刷新页面
          role.children = res.data;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async assignRole(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.rightsList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.dialogVisible = true;
    },
    //创建递归函数选出所有第三层权限Id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    async changRightsList() {
      const keys = [
        ...this.$refs.treeRightsList.getCheckedKeys(),
        ...this.$refs.treeRightsList.getHalfCheckedKeys(),
      ];
      const keysStr = keys.join(",");
      // console.log(keysStr);
      const { data: res } = await this.$http.post(
        "roles/" + this.roleId + "/rights",
        { rids: keysStr }
      );
      if (res.meta.status !== 200) return this.$message.error("更新数据失败");
      this.$message.success("更新数据成功");
      this.getRolesData();
      this.dialogVisible = false;
    },
    //监听tree的关闭事件：然后将defKeys清空
    setRightDialogClosed() {
      this.defKeys = [];
    },
  },
  created() {
    this.getRolesData();
  },
};
</script>
<style lang='css' scoped>
.elRow {
  margin: 0 30px;
}
.el-tag {
  margin: 7px;
}
.el-row {
  display: flex;
  align-items: center;
}
.top {
  border-top: 1px solid #eee;
}
.bottom1 {
  border-bottom: 1px solid #eee;
}
.bottom {
  border-bottom: 1px solid #eee;
}
</style>