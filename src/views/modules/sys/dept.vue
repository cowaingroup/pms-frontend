<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="工号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="currentChangeHandle(1)">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">+ 新建</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;" >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="工号">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="80"
        label="姓名">
      </el-table-column>

      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="所属组织">
      </el-table-column>

<!--      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>-->
      <el-table-column
        prop="dept"
        header-align="center"
        align="center"
        width="100"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="roleShow"
        header-align="center"
        align="center"
        width="180"
        label="对应角色" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        width="180"
        label="手机号"  :show-overflow-tooltip='true'>
      </el-table-column>

      <el-table-column
        prop=""
        header-align="center"
        align="center"
        width="0"
        label=""  :show-overflow-tooltip='true'>
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="primary" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="primary" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
           <el-button v-if="isAuth('sys:user:settingPrems')" type="danger" size="small" @click="settingPrems(scope.row.userId)">设置权限</el-button><br>
          <el-button v-if="isAuth('sys:user:settingDisable')" type="danger" size="small" @click="settingDisable(scope.row.userId)">标记禁用</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <upload ref="upload" :loadUrl="loadUrl" @getDataList="getDataList"/>
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  import {exportExcel} from '@/utils/exportExcel'
  import Upload from '@/components/upload'

  export default {
    data () {
      return {
        loadUrl:'/sys/user/uploadExcel',
        dataForm: {
          userName: '',
          key:''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      Upload
    },
    activated () {
      this.getDataList()
    },
    methods: {
     
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      }
     
     
    }
  }
</script>
