<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="userParams.query"
            clearable
            @clear="clearBtn"
            @keydown.native="searchChange"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchBtn"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="180"
        ></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @input="SwitchChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" porp="id">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editBtn(scope.row.id)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="removeUserInfo(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                circle
                @click="assginRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户弹出层 -->
    <el-dialog title="添加用户" :visible.sync="isVisible" width="50%">
      <el-form
        :model="addUserForm"
        ref="addUserRef"
        :rules="addUserRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹出层 -->
    <el-dialog title="修改用户" :visible.sync="isEditVisible" width="50%">
      <el-form
        :model="editUserForm"
        ref="editUserRef"
        :rules="editUserRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEditUserBtn(editUserForm.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色弹出层 -->
    <el-dialog title="提示" :visible.sync="assginDialogVisible" width="50%">
      <p>当前的用户：{{ roleUserName }}</p>
      <p>当前的角色：{{ roleName }}</p>
      <p>
        分配新角色：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assginRoleTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      usersList: [],
      userParams: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      total: 10,
      //搜索用户的内容
      searchValue: "",
      //添加用户弹出是否打开
      isVisible: false,
      //添加用户中的数据
      addUserForm: {},
      //添加用户的验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //修改用户的弹出层是否打开
      isEditVisible: false,
      //修改用户的数据
      editUserForm: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      //修改用户的规则
      editUserRules: {
        email: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //分配角色是否打开
      assginDialogVisible: false,
      //分配角色的姓名和角色
      roleUserName: "",
      roleName: "",
      roleId: "",
      //角色列表
      roleList: [],
      //选择器中默认显示
      selectedRoleId: "",
    };
  },

  components: {},

  computed: {},

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.userParams,
      });
      this.usersList = res.data.users;
      this.total = res.data.total;
      console.log(this.usersList);
    },
    handleSizeChange(newValue) {
      this.userParams.pagesize = newValue;
      this.getUserList();
    },
    handleCurrentChange(newValue) {
      this.userParams.pagenum = newValue;
      this.getUserList();
    },
    //状态switch改变时触发事件
    async SwitchChange(user) {
      const { data: res } = await this.$http.put(
        "users/" + user.id + "/state/" + user.mg_state
      );
      if (res.meta.status !== 200) return this.$message.error("更新数据失败");
      return this.$message.success("更新数据成功");
    },
    //搜索用户按钮触发
    searchBtn() {
      this.getUserList();
    },
    //搜索用户框改变触发
    searchChange(e) {
      if (e.key === "Enter") this.clearBtn();
    },
    //搜索用户按钮清除键触发
    clearBtn() {
      this.getUserList();
    },
    //添加用户触发
    addUser() {
      this.isVisible = true;
    },
    //添加用户的确定按钮
    addUserBtn() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            "users",
            this.addUserForm
          );
          if (res.meta.status === 201) {
            this.isVisible = false;
            this.getUserList();
            this.addUserForm = {};
            return this.$message.success("添加用户成功");
          }
          return this.$message.error("添加用户失败");
        }
      });
    },
    //修改用户
    async editBtn(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("修改用户失败");
      this.editUserForm.id = res.data.id;
      this.editUserForm.username = res.data.username;
      this.editUserForm.email = res.data.email;
      this.editUserForm.mobile = res.data.mobile;
      this.isEditVisible = true;
    },
    //修改用户的确定按钮
    async editEditUserBtn(id) {
      const editUserForm2 = this.editUserForm;
      delete editUserForm2.username;
      const { data: res } = await this.$http.put("users/" + id, editUserForm2);
      if (res.meta.status !== 200) return this.$message.error("修改用户失败");
      this.isEditVisible = false;
      this.$message.success("更新数据成功");
      this.getUserList();
    },
    //删除用户信息
    removeUserInfo(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + id);
          if (res.meta.status !== 200)
            return this.$message.error("删除用户失败");
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //分配角色
    async assginRole(role) {
      // console.log(role);
      this.roleId = role.id;
      this.roleUserName = role.username;
      this.roleName = role.role_name;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("获取角色失败");
      this.roleList = res.data;
      this.assginDialogVisible = true;
    },
    //确定分配按钮
    async assginRoleTrue() {
      const { data: res } = await this.$http.put(
        "users/" + this.roleId + "/role",
        { rid: this.selectedRoleId }
      );
      if (res.meta.status !== 200) {
        this.selectedRoleId = "";
        this.assginDialogVisible = false;
        return this.$message.error("修改角色失败");
      }
      this.$message.success("修改角色成功");
      this.selectedRoleId = res.data.rid;
      this.getUserList();
      this.assginDialogVisible = false;
    },
  },
  created() {
    this.getUserList();
  },
};
</script>
<style lang='css' scoped>
</style>