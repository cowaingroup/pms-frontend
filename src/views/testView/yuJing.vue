<template>
  <div class="yu-jing">
    <div class="title">
      <span class="yu-jing-list">预警列表</span>
      <el-button
        type="primary"
        :style="{'float':'right','marginBottom':'20px','marginRight':'20px'}"
        @click="tianChuZuJian"
      >新建预警规则</el-button>
    </div>
    <transition enter-active-class="animated slideInDown" leave-active-class="animated fadeOut">
      <div class="tan-kuang" v-if="zuJianVisible"></div>
    </transition>
    <el-table :data="tableData" border :style="{'width': '100%'}">
      <el-table-column header-align="center" fixed prop="xuhao" label="序号" width="80"></el-table-column>
      <el-table-column fixed prop="mingCheng" label="预警规则名称" width="180"></el-table-column>
      <el-table-column prop="youXianJi" label="优先级" width="180"></el-table-column>
      <el-table-column prop="yuJingLeiXing" label="预警类型" width="180"></el-table-column>
      <el-table-column prop="yuJingTianShu" label="预警天数" width="180"></el-table-column>
      <el-table-column prop="shengJiYuJingTianShu" label="升级预警天数" width="200"></el-table-column>
      <el-table-column prop="xiaoXiLeiXing" :render-header="customFieldColumn" width="220">
        <template slot-scope="scope" slot="header">
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          >
            <span slot="reference">hover 激活</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="tianChuZuJian(scope.row)" type="primary " size="small">规则修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Setting ref="setting" />
  </div>
</template>


<script>
import Setting from "@/views/modules/sys/warn/setting";
export default {
  name: "yu-jing",
  components: {
    Setting
  },
  init() {
    console.log(6666666);
  },
  created() {
    console.log(8777777777);
  },
  data() {
    return {
      zuJianVisible: false,
      labelPosition: "",
      formLabelAlign: [],
      tableData: [
        {
          xuHao: "1",
          mingCheng: "名称1",
          youXianJi: "高",
          yuJingLeiXing: "人工",
          yuJingTianShu: "10",
          shengJiYuJingTianShu: "15",
          xiaoXiLeiXing: "推送"
        },
        {
          xuHao: "2",
          mingCheng: "名称2",
          youXianJi: "低",
          yuJingLeiXing: "人工",
          yuJingTianShu: "4",
          shengJiYuJingTianShu: "6",
          xiaoXiLeiXing: "推送"
        },
        {
          xuHao: "3",
          mingCheng: "名称3",
          youXianJi: "中",
          yuJingLeiXing: "ai",
          yuJingTianShu: "22",
          shengJiYuJingTianShu: "45",
          xiaoXiLeiXing: "推送"
        },
        {
          xuHao: "4",
          mingCheng: "名称4",
          youXianJi: "高",
          yuJingLeiXing: "人工",
          yuJingTianShu: "120",
          shengJiYuJingTianShu: "151",
          xiaoXiLeiXing: "推送"
        }
      ]
    };
  },
  methods: {
    tianChuZuJian(row) {
      this.zuJianVisible = !this.zuJianVisible;
      this.$nextTick(() => {
        this.$refs.setting.init(row);
      });
    },
    // 自定义表头
    customFieldColumn(h, { column, $index }) {
      return h("span", {}, [
        h("span", {}, ""),
        // h('el-popover', { props: { placement: 'top', width: '200',trigger: 'hover', content: '点击数字折扣，修改折扣，点击空白处，修改完成；修改过程中，右侧出现绿色按钮功能为统一多件商品为该折扣。' }},
        [
          // h('i', { slot: 'reference',class:'font-normal'},[
          h("div", { class: "xiao-xi-lei-xing" }, "消息类型（推送）"),
          h("div", { class: "red-star" }, "注：信息推送功能下")
          // ])
        ]
        // )
      ]);
    }
  },
  computed: {}
};
</script>

<style scope>
.yu-jing {
  border: 10px solid white;
  position: relative;
  top: 15px;
}
.yu-jing .el-table th div {
  line-height: 13px;
}
.title {
  font-size: 25px;
}
.tan-kuang {
  position: absolute;
  width: 200px;
  height: 200px;
  line-height: 200px;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  /*margin-top: -100px;*/
  text-align: center;
}
.newYuJing {
  right: 100%;
}
.yu-jing-list {
  margin-left: 20px;
}
.xiao-xi-lei-xing {
  line-height: 0;
}
.red-star {
  color: red;
  line-height: 0;
}
</style>
