<template>
  <div class="home">
    <el-container style="height: 100%;position: relative;">
      <!-- 侧边栏 -->
      <el-aside width="auto" style="background-color: #545c64">
        <el-row class="pic">
          <p>
            <img src="../assets/favicon.png">
          </p>
          <span v-show="!isCollapse">教学管理系统</span>
        </el-row>
        <el-menu
          :default-active="activeindex"
          class="el-menu-vertical-demo"
          router
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <el-menu-item :class="isCollapse?'':'el_item'" index="/home" @click="addTab('首页')">
            <i class="el-icon-s-home" style="color:#fff !important;"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu v-for="(value,index) in asideTion" :key="index" :index="''+(index+1)">
            <template slot="title">
              <i :class="value.class"></i>
              <span slot="title">{{ value.aside }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(value,index) in value.option"
                :key="index"
                @click="addTab(value.name,value.path)"
                class="menu_a"
                :index="value.path"
              >{{ value.name }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-container>
        <!-- tab标签页导航 -->
        <el-header>
          <!-- 展开/收起按钮 -->
          <el-tooltip
            class="tooltip"
            effect="dark"
            :content="isCollapse?'展开':'收起'"
            placement="right"
          >
            <el-button
              @click="isCollapse=!isCollapse"
              :icon="isCollapse?'el-icon-arrow-right':'el-icon-arrow-left'"
              style="color:#fff;border: 0;border-radius:0%;"
            />
          </el-tooltip>
          <!-- tab标签页 -->
          <el-row class="tab-position">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              @tab-click="clickTab"
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="(item,index) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                :closable="index>0"
              ></el-tab-pane>
            </el-tabs>
          </el-row>
          <span @click="logout">退出</span>
          <!-- 用户头像 -->
          <el-avatar :size="50" :src="circleUrl" style="margin-left: 15px"></el-avatar>
        </el-header>
        <el-main style="text-align:left;">
          <!-- 路由视图 keep-alive会缓存用户视图位置-->
              <router-view/>
        </el-main>
      </el-container>
    </el-container>
</div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      activeindex: "/home",
      isCollapse: false, 
      isCopath:"",
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      asideTion: [
        {
          aside: "基础数据",//一级数组
          class: "el-icon-menu", //定义icon样式
          option: [//二级数组
            {name: "班级管理",path: "/ClassManage"},
            {name: "学生管理",path: "/StudentManage"},
            {name: "老师管理",path: "/TeacherManage"},
            {name: "修改密码",path: "/ModifyPassword"}
          ]
        },
        {
          aside: "在线测试",
          class: "el-icon-s-claim",
          option: [
            {name: "老师出卷", path: "/MakeTestPaper"},
            {name: "试卷管理",path: "/TestPaperManage"},
            {name: "安排测试",path: "/TestResult"},
            {name: "批阅试卷",path: "/TestSetter"},
            {name: "测试成绩",path: "/ViewTestPaper"},
            {name: "安排测试",path: "/TestResult"},
            {name: "批阅试卷",path: "/TestSetter"},
            {name: "测试成绩",path: "/ViewTestPaper"}
          ]
        }
      ],
      editableTabsValue: "1", //标签页位置
      editableTabs: [
        {
          title: "首页",
          name: "1", 
          path: "/home"
        }
      ],
      tabIndex: 1 //用于添加头部导航,1代表一个标签页如:'首页'
    };
  },
  // 钩子函数创建时
  beforeCreate() {
    let _this = this;
    var token=sessionStorage.getItem("token")
    if(!token){
      _this.$router.replace("/login")
    }
  },
  created() {
    let _this = this;
    var getTabList = JSON.parse(sessionStorage.getItem("editableTabs"));
    var getTabName = sessionStorage.getItem("TabName");
    if (getTabList && getTabName) {//如果存在sessionStorage数据,改变其结果
      _this.editableTabs = getTabList;
      _this.editableTabsValue = getTabName;
      console.log(_this.editableTabsValue)
      _this.tabIndex = getTabList[getTabList.length - 1].name;
      let index = _this.editableTabs.findIndex(item => item.name == getTabName);
      _this.activeindex = getTabList[index].path;
    }
  },
  methods: {
    /**
     * 侧边栏点击添加到头部导航标签页
     * name 侧边栏标题
     * path 侧边栏路由
     */
    addTab(name, path) {
      let _this = this;
      function checkAdult(ediTabTittle) {
        //点击时查询传入name的下标
        return ediTabTittle.title == name; //editableTabs中的title与传入name相等返回查询下标 ，没有返回-1
      }
      let asideindex = _this.editableTabs.findIndex(checkAdult); //使用findIndex方法 返回符合测试条件的第一个数组元素索引
      let newTabName = ""; // 定义变量表示tab标签页位置
      if (asideindex == -1) {
        //如果查询结果为 -1 证明tab标签页不存在 可以添加tab标签页
        newTabName = ++_this.tabIndex + "";
        _this.editableTabs.push({
          title: name,
          name: newTabName,
          path: path
        });
      } else {
        newTabName = _this.editableTabs[asideindex].name; //使用editableTabs数组中name指定tab标签页位置
      }
      _this.routerViem(newTabName);
    },
    /**
     * tab标签页点击,侧边栏路由对应
     * @param {String} targetPane tab标签页name
     */
    clickTab(targetPane) {
      let _this = this;
      _this.routerViem(targetPane.name);
    },
    /**
     * 头部导航标签页点击删除
     * targetName 现在删除的tab标签页位置
     */
    removeTab(targetName) {
      let _this = this;
      let tabs = _this.editableTabs; //得到editableTabs数组信息
      let activeName = _this.editableTabsValue; //得到现在tab标签页默认位置
      if (activeName === targetName) {//判断删除的位置与现在tab标签页默认位置是否相等
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      _this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      _this.routerViem(activeName);
    },
    /**
     * 视图对应跳转
     */
    routerViem(name) {
      let _this = this;
      _this.editableTabsValue = name; //点击后tab标签页默认位置对应改变
      let index = _this.editableTabs.findIndex(item => item.name == name);
      _this.activeindex = _this.editableTabs[index].path;
      _this.$router.replace(_this.activeindex);
      sessionStorage.setItem(
        "editableTabs",
        JSON.stringify(_this.editableTabs)
      );
      sessionStorage.setItem("TabName", name);
    },
    logout(){
      sessionStorage.removeItem("token")
      this.$router.push({
					path: '/login'
			});
    }
  }
};
</script>

<style lang="scss" scoped>
a{
  text-decoration: none !important;
  color: #000;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.home {
  height: 100%;
  .pic {
    background: #FFEB3A;
    display: flex;
    justify-content: center;
    position: relative;
    height: 60px;
    line-height: 60px;
    color: #079787;
    p {
      width: 60px;
      height: 60px;
      display: inline-block;
      margin-top:10px;
    }
    img {
      width:40px;
      box-shadow: #008080 0px 0px 10px 4px;
      border-radius:50%; 
      max-width: 100%;
    }
  }
  /deep/ .el-menu {
    border-right: 0;
  }
  .home /deep/ .menu_a {
    &.is-active {
      position: relative !important;
      color: #E0CF39 !important;
      background: rgba($color: #000000, $alpha: 0.4) !important;
      &::after {
        color: #E0CF39 !important;
        content: "";
        position: absolute !important;
        top: 12px !important;
        right: 0 !important;
        width: 0 !important;
        height: 0 !important;
        border: 13px solid transparent !important;
        border-right: 13px solid #fff !important;
      }
    }
  }
}
.home /deep/ .menu_a {
    &.is-active {
      position: relative !important;
      color: #E0CF39 !important;
      background: rgba($color: #000000, $alpha: 0.4) !important;
      &::after {
        color: #E0CF39 !important;
        content: "";
        position: absolute !important;
        top: 12px !important;
        right: 0 !important;
        width: 0 !important;
        height: 0 !important;
        border: 13px solid transparent !important;
        border-right: 13px solid #fff !important;
      }
    }
  }
// 导航栏
.el-header {
  background-color: #fff;
  border-bottom: #E4E7ED 1px solid;
  color: #000;
  font-size: 12px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  i {
    color: #000;
  }
  .tooltip {
    width: 20px;
    height: 60px;
    background: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 12px 0;
  }
}
.el-header .tooltip[data-v-fae5bece] {
  width: 30px;
}

// tab标签页
/deep/ .tab-position {
  flex: 1;
  margin: 19px 20px 0;
  overflow: hidden;
  .el-tabs__item {
    color:#4A4A4A;
    &.is-active {
      color: #409eff;
      border-bottom: 3px solid #409eff !important;
    }
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: 0;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    color: #000;
  }
  
}
.el-icon-menu,.el-icon-s-claim,el-icon-s-home{
  color: #fff !important;
}
.el-menu-item.is-active{
  color: #fff !important;
}
// 侧边栏
.el-aside {
  /deep/ .el_item {
    margin-left: -29px;
  }
}
.el-aside::-webkit-scrollbar{
   display:none;
}
</style>
