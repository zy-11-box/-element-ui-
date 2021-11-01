<template>
  <el-container class="home-container">
    <el-header class="header">
      <div>
        <img src="../assets/img/heima.png" alt="" />
        <span>电商后台管理项目</span>
      </div>
      <el-button type="info" @click="btnClick" class="esc">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="!collapseBoolean ? 200 + 'px' : 64 + 'px'">
        <!-- 按钮 -->
        <div
          class="menusBtn"
          @click="menusBtnClick"
          :style="{ width: isWidth64 }"
        >
          | | |
        </div>
        <!-- 侧边栏 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#359bff"
          class="menus"
          :unique-opened="true"
          :collapse="collapseBoolean"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="'/' + item.path"
            v-for="item in menusList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group
              v-for="i in item.children"
              :key="i.id"
              class="menusItem"
            >
              <el-menu-item
                :index="'/' + i.path"
                @click="menuItem('/' + i.path)"
                ><i class="el-icon-menu"></i>{{ i.authName }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: [],
      iconList: [
        "iconfont icon-users",
        "iconfont icon-tijikongjian",
        "iconfont icon-shangpin",
        "iconfont icon-danju",
        "iconfont icon-baobiao",
      ],
      collapseBoolean: false,
      activePath: "",
    };
  },

  components: {},

  computed: {
    isWidth64() {
      if (this.collapseBoolean) {
        return 64 + "px";
      } else {
        return 200 + "px";
      }
    },
  },

  methods: {
    btnClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    getMenusMessage() {
      this.$http.get("menus").then((res) => {
        this.menusList = res.data.data;
        //将字体图标push到menusList中
        this.pushMenus();
        // console.log(this.menusList);
        if (res.data.meta.status == 200)
          return this.$message.success(res.data.meta.msg);
        this.$message.error(res.data.meta.msg);
      });
    },
    pushMenus() {
      for (let item in this.menusList) {
        this.menusList[item].icon = this.iconList[item];
      }
    },
    menusBtnClick() {
      this.collapseBoolean = !this.collapseBoolean;
    },
    menuItem(i) {
      window.sessionStorage.setItem("activePath", i);
      this.activePath = i;
    },
  },
  created() {
    this.getMenusMessage();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
};
</script>
<style lang='css' scoped>
.header {
  display: flex;
  justify-content: space-between;
  background-color: #363d40;
}
.header div {
  display: flex;
  align-items: center;
  margin-left: -18px;
  color: #fff;
  font-size: 20px;
}
.header div img {
  margin-right: 8px;
}
.esc {
  margin: 10px 0;
}
.menus {
  height: 100%;
  border: 0;
}
.iconfont {
  margin-right: 5px;
}
.menusBtn {
  background-color: #475166;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
}
.home-container {
  height: 100%;
}
</style>