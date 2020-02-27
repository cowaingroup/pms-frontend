<template>
  <div class="yu-jing">
    <div class="title">
      <span class="yu-jing-list">信息推送列表</span>
      <el-button
        type="primary"
        :style="{'float':'right','marginBottom':'20px','marginRight':'20px'}"
        @click="tianChuZuJian"
      >新建消息规则</el-button>
    </div>
    <transition enter-active-class="animated slideInDown" leave-active-class="animated fadeOut">
      <div class="tan-kuang" v-if="zuJianVisible"></div>
    </transition>
    <el-table
      :data="tableData"
      border
      :style="{'width': '100%'}"
      v-loading="dataListLoading"
    >
      <el-table-column
        type="index"
        :index="this.indexStartNum"
        header-align="center"
        align="center"
        fixed prop="xuhao"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column fixed prop="msgType"  align="center" label="消息类型" width="220">

      </el-table-column>
      <el-table-column prop="pushModes"  align="center" label="推送方式" width="200">

      </el-table-column>
      <el-table-column prop="pushTimes" align="center"  label="推送时间(触发)" width="200">

      </el-table-column>
      <el-table-column prop="pushWays"  align="center" label="推送途径" width="240">

      </el-table-column>
      <el-table-column prop="pushRanges"  align="center" label="推送范围" width="240">

      </el-table-column>
      <el-table-column header-align="center" align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="tianChuZuJian(scope.row)" type="primary" size="small">规则修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <Setting ref="test" @refreshDataList="getDataList" />
  </div>
</template>


<script>
  import Setting from '@/views/modules/sys/info/test';
  export default {
    name: 'aaaa',
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
        labelPosition: '',
        formLabelAlign: [],
        tableData: [],
        dataListLoading: false,
        indexStartNum: 1,
        pageSize: 10,
        totalPage: 0,
        pageIndex: 1
      };
    },
    activated () {
      this.getDataList()
      console.log('datalist执行了')
    },
    methods: {
      // 获取数据列表
      getDataList() {
        console.log('页面加载事件')
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/pms/msg/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableData = data.page.list
            this.totalPage = data.page.totalCount
            this.indexStartNum = ((this.pageIndex - 1) * this.pageSize) + 1;
          } else {
            this.tableData = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },

      tianChuZuJian(row) {
        this.zuJianVisible = !this.zuJianVisible;
        if (row.id) {
          // 修改
          console.log('row.id = ',row.id);
          this.$refs.test.init(row,1);
        } else {
          // 新增
          console.log('id = ',row.id);
          this.$refs.test.init(row,2);
        }
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
