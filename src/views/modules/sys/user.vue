<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="工号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="currentChangeHandle(1)">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        type="jobNum"
        header-align="center"
        align="center"
        width="120"
        label="工号">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        width="120"
        label="姓名">
      </el-table-column>

      <el-table-column
        prop="org"
        header-align="center"
        align="center"
        width="150"
        label="所属组织">
      </el-table-column>

      <el-table-column
        prop="dept"
        header-align="center"
        align="center"
        width="150"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="jobs"
        header-align="center"
        align="center"
        width="120"
        label="职位">
      </el-table-column>
      <el-table-column
        prop="roleShow"
        header-align="center"
        align="center"
        width="200"
        label="对应角色" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        width="170"
        label="手机号"  :show-overflow-tooltip='true'>
      </el-table-column>

      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="状态"  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{scope.row.status === 1? '启用':'禁用'}}
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="170"
        label="操作">
        <template slot-scope="scope">
            <el-row :gutter="5">
              <el-col :span="12"><div class="grid-content bg-purple" style="margin: 1px">
                <el-button v-if="isAuth('sys:user:update')" type="success" size="mini" @click="addOrUpdateHandle(scope.row.userId)">编辑</el-button>
              </div></el-col>
              <el-col :span="12"><div class="grid-content bg-purple" >
                <el-button v-if="isAuth('sys:user:delete')" type="danger" size="mini" @click="deleteHandle(scope.row.userId)">删除</el-button>
              </div></el-col>
            </el-row>
    <!--  </el-row>-->
          <el-row :gutter="5">
            <el-col :span="12">
              <el-button v-if="isAuth('sys:user:settingPrems')" type="primary" size="mini" @click="settingPrems(scope.row.userId)">权限</el-button>
            </el-col>
            <el-col :span="12">
              <el-button v-if="isAuth('sys:user:settingDisable')" type="warning" size="mini" @click="state(scope.row.userId)">
<!--              <el-button v-if="isAuth('pms:pmsuser:updateState')" type="warning" size="mini" @click="state(scope.row.userId)">-->
                {{scope.row.status===1 ?'禁用':'启用'}}
              </el-button>
              </el-col>
          </el-row>

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
    <setting ref="settingPrems"></setting>
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  import {exportExcel} from '@/utils/exportExcel'
  import Upload from '@/components/upload'
  import settingPrems from './settingPrems'

  export default {
    data () {
      return {
        loadUrl:'/sys/user/uploadExcel',
        dataForm: {
          jobNum: '',
          userName: '',
          key: '',
          status: '',
          phone: '',
          dept: '',
          org: '',
          jobs: '',
          roleShow: ''
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
      Upload,
      settingPrems
    },
    activated () {
      this.getDataList()
    },
    methods: {

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/pms/pmsuser/list'),
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
      },
       deleteHandle (id) {
         var userIds = id ? [id] : this.dataListSelections.map(item => {
           return item.userId
         })
         this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
           this.$http({
             url: this.$http.adornUrl('/sys/user/delete'),
             method: 'post',
             data: this.$http.adornData(userIds, false)
           }).then(({data}) => {
             if (data && data.code === 0) {
               this.$message({
                 message: '操作成功',
                 type: 'success',
                 duration: 1500,
                 onClose: () => {
                   this.getDataList()
                 }
               })
             } else {
               this.$message.error(data.msg)
               this.getDataList()
             }
           })
         }).catch(() => {})
       },
      //设置权限
     settingPrems(){
        console.log("设置权限")
       this.$nextTick(() => {
       })
     },
     //标记禁用的函数
      state(id){
        console.log('id = ',id);
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定进行[${id ? '启用' : '禁用'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/pms/pmsuser/updateState'),
            method: 'post',
            data: this.$http.adornData(id, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {

        })
     }
    }
  }
</script>
