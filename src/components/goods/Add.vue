<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- Alert -->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="active"
        finish-status="success"
        :space="200"
        align-center
        class="steps"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="baseForm"
        :rules="baserules"
        ref="baseForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <!-- 标签页 -->
        <el-tabs
          v-model="activeName"
          tab-position="left"
          @tab-click="handleClick"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="baseForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="baseForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="baseForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="baseForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="goodsCateValue"
                :options="goodsCateoptions"
                :props="goodsCateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, i) in cateData"
              :key="i"
            >
              <el-checkbox
                border
                checked
                v-for="(vals, index) in item.attr_vals"
                :key="index"
                >{{ vals }}</el-checkbox
              >
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, i) in goodsPropData"
              :key="i"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              list-type="picture"
              :headers="headerObj"
              :on-preview="uploadPreview"
              :on-success="upoladSuccess"
              :on-remove="uploadRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="baseForm.goods_introduce"> </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="elButton" @click="btnClick">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <el-dialog title="图片预览" :visible.sync="imgVisible" width="50%">
        <img :src="imgURL" alt="" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //控制步骤条选择哪一个
      active: 0,
      //标签条的数据绑定
      activeName: 0,
      //基本信息的表单数据
      baseForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属分类
        goods_cat: [],
        //图片的上传
        pics: [],
        //介绍
        goods_introduce: "",
        //商品的参数（数组）
        attrs: [],
      },
      //基本信息的验证规则
      baserules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
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
      //商品参数数据
      cateData: [],
      //商品属性数据
      goodsPropData: [],
      //上传路径
      uploadUrl: "https://lianghj.top:8888/api/private/v1/upload",
      //上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //图片预览是否可打开
      imgVisible: false,
      //图片预览中图片的URL
      imgURL: "",
    };
  },

  components: {},

  computed: {},

  methods: {
    //切换标签页时触发
    handleClick() {
      this.active = this.activeName - 0;
      //获取商品参数信息
      if (this.activeName == 1) {
        this.getParamsData("many");
      }
      //获取商品属性信息
      if (this.activeName == 2) {
        this.getParamsData("only");
      }
    },
    //获得分类数据
    async getCateData() {
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败");
      this.$message.success("获取分类数据成功");
      this.goodsCateoptions = res.data;
    },
    //点击级联选择器触发
    handleChange() {
      //判断级联是否选择三级分类
      if (this.goodsCateValue.length !== 3) {
        this.goodsCateValue = [];
      }
      //级联已选择三级
      this.baseForm.goods_cat = this.goodsCateValue;
    },
    //离开标签页触发
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.goodsCateValue.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      } else if (oldActiveName == 0 && this.baseForm.goods_name == "") {
        this.$message.error("请先填写商品名称！");
        return false;
      }
    },
    //获取参数/属性数据
    async getParamsData(isMany) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: isMany } }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取商品参数失败");
      if (isMany == "many") {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length
            ? item.attr_vals.split(" ")
            : [];
        });
        this.cateData = res.data;
      } else {
        this.goodsPropData = res.data;
      }
    },
    //上传图片成功后点击调用
    uploadPreview(file) {
      this.imgURL = file.response.data.url;
      this.imgVisible = true;
    },
    //上传图片成功后调用
    upoladSuccess(file) {
      const picPath = { pic: file.data.tmp_path };
      this.baseForm.pics.push(picPath);
    },
    //上传图片的删除图片触发
    uploadRemove(file) {
      const path = file.response.data.tmp_path;
      const i = this.baseForm.pics.findIndex((x) => x.pic === path);
      this.baseForm.pics.splice(i, 1);
    },
    //添加商品按钮
    btnClick() {
      this.$refs.baseForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填完表单在提交");
        } else {
          //将商品的属性加到form表单中
          this.cateData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            this.baseForm.attrs.push(newInfo);
          });
          //将商品的参数加到form表单中
          this.goodsPropData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            this.baseForm.attrs.push(newInfo);
          });
          //深拷贝原来的form表单，
          //请求数据中attr_cat为字符串，
          //而级联绑定数据为数据冲突
          const newForm = this.cloneForm(this.baseForm);
          newForm.goods_cat = newForm.goods_cat.join(",");
          //发送添加商品的网络请求
          const { data: res } = await this.$http.post("goods", newForm);
          console.log(res);
          if (res.meta.status !== 201)
            return this.$message.error("添加商品失败");
          this.$message.success("添加商品成功");
          this.$router.push("/goods");
        }
      });
    },
    //深拷贝form表单
    cloneForm(oldForm) {
      const newForm = JSON.parse(JSON.stringify(oldForm));
      return newForm;
    },
  },
  computed: {
    cateId() {
      return this.goodsCateValue[this.goodsCateValue.length - 1];
    },
  },
  created() {
    this.getCateData();
  },
};
</script>
<style lang='css' scoped>
.el-steps {
  margin: 15px 0;
}
.el-form {
  height: 100%;
}
.el-checkbox {
  margin: 0px 10px 10px 10px !important;
}
.elButton {
  margin: 15px 0;
}
</style>