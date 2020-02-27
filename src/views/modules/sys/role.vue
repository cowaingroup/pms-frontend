<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="currentChangeHandle(1)">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
<!--        <el-button v-if="isAuth('sys:role:delete')" type="success" @click="batchEnabled('','启用')" :disabled="batchEnableds.length <= 0">批量启用</el-button>-->
        <el-button v-if="isAuth('sys:role:delete')" type="success" @click="batchEnabled(batchEnableds)" :disabled="batchEnableds.length <= 0">批量启用</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="batchDisable(batchDisables)" :disabled="batchDisables.length <= 0">批量禁用</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteRoles(batchDeletes)" :disabled="batchDeletes.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"
        :index="this.indexStartNum"
        header-align="center"
        align="center"
        width="80"
        label="序号">
      </el-table-column>

      <el-table-column
        prop="roleCode"
        header-align="center"
        align="center"
        label="角色代码">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleTypes"
        header-align="center"
        align="center"
        label="角色类型">
      </el-table-column>
      <el-table-column
        prop="orgType"
        header-align="center"
        align="center"
        label="所属组织">
      </el-table-column>
      <el-table-column
        prop="countNum"
        header-align="center"
        align="center"
        width="80"
        label="角色人数">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="80"
        label="权限">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:info')" type="text" size="small" @click="showRight(scope.row.roleId)">详情</el-button>
        </template>
      </el-table-column>
      <!--状态-->
      <el-table-column
        prop="status"
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="状态">
        <template slot-scope="scope">
        <div @click="test(scope)">
          {{scope.row.status ===1 ?'启用':'禁用'}}
        </div>
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">

          <el-row :gutter="20">

            <el-col :span="8"><div class="grid-content bg-purple">
              <el-button v-if="isAuth('sys:role:update')" type="primary" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
            </div></el-col>

            <el-col :span="8"><div class="grid-content bg-purple">
              <el-button v-if="isAuth('sys:role:delete')" type="primary" size="small" @click="deleteHandle(scope.row.roleId,scope.row.status === 1 ? '禁用' :'启用')">
                {{scope.row.status===1 ?'禁用':'启用'}}
              </el-button>
            </div></el-col>

            <el-col :span="8"><div class="grid-content bg-purple">
              <el-button v-if="isAuth('sys:role:delete')" type="danger" size="small" @click="deleteRole(scope.row.roleId)">删除</el-button>
            </div></el-col>

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
  </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  export default {
    data () {
      return {
        indexStartNum: 1,
        dataForm: {
          roleName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        batchEnableds: [],
        addOrUpdateVisible: false,
        batchDisables: [],
        batchDeletes: []
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
      console.log('datalist执行了')
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/role/list'),
          // url: this.$http.adornUrl('/pms/pmsrole/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'roleName': this.dataForm.roleName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
            this.indexStartNum = ((this.pageIndex - 1) * this.pageSize) + 1;
          } else {
            this.dataList = []
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
      // 多选
      selectionChangeHandle(val) {
        this.batchEnableds = val
        this.batchDisables = val
        this.batchDeletes = val
      },
      // 详情
      showRight(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, '1', 1, '1')
        })
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          if (id) {
            this.$refs.addOrUpdate.init(id, '2', 2)
          } else {
            this.$refs.addOrUpdate.init(id, '1', 3)
          }

        })
      },
      // 禁用
      deleteHandle(id, dif) {
        var ids = id ? [id] : this.batchEnableds.map(item => {
          return item.roleId
        })
        this.$confirm(`确定进行[${dif === '启用' ? '启用' : '禁用'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
      },
      // 批量启用
      batchEnabled(id) {
        var role = this.batchEnableds.map(item => {
          return item
        })
        this.$confirm(`确定进行批量启用操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/pms/role/batchEnabled'),
            method: 'post',
            data: this.$http.adornData(role, false)
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
      },
      // 批量禁用
      batchDisable(id) {
        console.log('批量禁用的id', id)
        var roles = this.batchDisables.map(item => {
          return item
        })
        console.log('ids', roles)
        this.$confirm(`确定进行批量禁用操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/pms/role/batchDisables'),
            method: 'post',
            data: this.$http.adornData(roles, false)
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
      },
      // 删除用户
      deleteRole (id) {
        this.$confirm('确定删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/pms/role/deleteRole'),
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
      },
      // 删除用户
      deleteRoles (id) {
        var ids = this.batchDeletes.map(item => {
          return item.roleId
        })
        console.log(ids)
        this.$confirm('确定删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/pms/role/deleteRoles'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
