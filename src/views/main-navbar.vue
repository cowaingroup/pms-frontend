<template>
  <div class="nav">
    <div>
      <!-- 面包屑 -->
      <div class="el-row site-navbar" :class="'site-navbar--' + navbarLayoutType">
        <div class="el-col el-col-21">
          <div class="el-row navbar">
            <div class="el-col el-col-6 logo">
              <img src="src/assets/img/cowain.png" width="150px" style="padding-left: 10px;" />
              <span>PMS项目管理系统</span>
            </div>
            <div class="el-col el-col-3 reset_text_center" :class="{reset_blue_minor:index==0}">
              <span @click="getChildMenu(0)">
                <icon-svg name="myjob" class="site-sidebar__menu-icon"></icon-svg>
                <span>项目主流程</span>
              </span>
            </div>
            <div class="el-col el-col-3 reset_text_center reset_top_70" :class="{reset_blue_minor:index==1}">
              <span @click="getChildMenu(1)">
                <icon-svg name="cangku" class="site-sidebar__menu-icon"></icon-svg>
                <span>项目管理</span>
              </span>
            </div>
         <!--   <div class="el-col el-col-3 reset_text_center reset_top_70" :class="{reset_blue_minor:index==2}">
              <span @click="getChildMenu(2)">
                <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>
                <span>基础资料</span>
              </span>
            </div> -->
            <div class="el-col el-col-3 reset_text_center reset_top_70" :class="{reset_blue_minor:index==3}">
              <span @click="getChildMenu(3)">
                <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>
                <span>文档管理</span>
              </span>
            </div>
             <div class="el-col el-col-3 reset_text_center reset_top_70" :class="{reset_blue_minor:index==4}">
              <span @click="getChildMenu(4)">
                <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>
                <span>系统管理</span>
              </span>
            </div>
          </div>
        </div>

         <div class="el-col el-col-3">
          <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
            <el-menu-item class="site-navbar__avatar  reset_Sigin_bj" index="3">
              <el-dropdown :show-timeout="0" placement="bottom">
                <span class="el-dropdown-link">
                  <img src="~@/assets/img/avatar.png" :alt="userName" />
                  <font style="color: whitesmoke">{{ userName }}</font>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
                  <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-menu-item>
          </el-menu>
        </div>


        <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
      </div>
    </div>
    <div>
   </div>
  </div>

  <!--  <nav class="site-navbar" :class="'site-navbar&#45;&#45;' + navbarLayoutType">
      <el-row>
        <el-col :span="20">
          <span>我的工作</span>
        </el-col>
        <el-col>
          <el-menu
            class="site-navbar__menu site-navbar__menu&#45;&#45;right"
            mode="horizontal">
            <el-menu-item class="site-navbar__avatar" index="3">
              <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName"><font style="color: whitesmoke"> {{ userName }}</font>
            </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
                  <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    &lt;!&ndash;</div>&ndash;&gt;
    &lt;!&ndash; 弹窗, 修改密码 &ndash;&gt;
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>-->
</template>

<style>
/**
    -moz-background-size: 100% 100%;
   background-size:100% 100%;
  background-size: cover;
      */

.site-navbar {
  /*background-image: url(~@/assets/img/title.png);*/
  background-repeat: no-repeat;
  background-size: 15%;
  background-position-x: 20px;
  background-position-y: 10px;
  -moz-background-size: 100% 100%;
  height: 70px;
  max-height: 100px;
}

.site-sidebar--dark,
.site-sidebar--dark-popper {
  background-image: url(~@/assets/img/menu_bg.png);
  background-repeat: no-repeat;
  /*background-size: 100% 100%;*/
}
</style>

<script>
import UpdatePassword from "./main-navbar-update-password";
import { getWarehouseList } from '@/api/modules/other'
export default {
  data() {
    return {
      wareHouseList:'',
      ownerInfoList:'',
      updatePassowrdVisible: false,
      index:0,
      form: {
        warehouse: "",
        vector: ""
      },
      menuNumber: 0,
      nowRoute: ""
    };
  },
  components: {
    UpdatePassword
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType;
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
      set(val) {
        this.$store.commit("common/updateSidebarFold", val);
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      }
    }
  },
  watch: {
    $route: {
      handler: function(val) {
        this.nowRoute = val.path;
      },
      deep: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.getChildMenu(0);
      this.getWarehouseList()
    });
    this.nowRoute = this.$route.path;
  },
  methods: {
    // 获取子菜单
    getChildMenu(val) {
      this.menuNumber = val;
       this.index=val;
      this.$bus.$emit("menuData", val);
      this.$bus.$emit("clooseTabs");
    },
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    // 获取仓库地址列表
    getWarehouseList() {
      getWarehouseList().then(data => {
          this.wareHouseList=data.wareHouseList
          this.ownerInfoList=data.ownerInfoList
      })
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/logout"),
            method: "post",
            data: this.$http.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$cookie.delete("token");
              this.$router.push({ name: "login" }, () => {
                location.reload(); // 刷新页面, 清空整站临时存储数据
              });
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
.nav {
  /*position: relative;*/
  .city {
    position: fixed;
    right: 15px;
    top: 77px;
    z-index: 1000;
    background-color: #fff;
    .el-row {
      margin-bottom: 0;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
.site-navbar .navbar {
  height: 70px;
  line-height: 70px;
  color: #fff;
  font-size: 18px;
  .logo {
    min-width: 330px;
    margin-right: 20px;
  }
  .site-sidebar__menu-icon {
    font-size: 18px;
    vertical-align: middle;
    margin-bottom: 4px;
  }
  span {
    cursor: pointer;
  }
}
</style>
