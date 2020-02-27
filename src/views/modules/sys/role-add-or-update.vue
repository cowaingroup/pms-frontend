<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">

      <el-row :gutter="20">
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-form-item label="角色名称"  prop="roleName" style="width: 300px">
            <el-input v-model="dataForm.roleName" :disabled= 'upt1' placeholder="角色名称"></el-input>
          </el-form-item>
        </div></el-col>

        <el-col :span="12"><div class="grid-content bg-purple">
          <el-form-item label="角色代码" prop="roleCode" style="width: 300px">
            <el-input v-model="dataForm.roleCode"  :disabled="upt1" placeholder="角色代码"></el-input>
          </el-form-item>
        </div></el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-form-item label="角色类型" prop="roleType">
            <el-select v-model="dataForm.roleType"   :disabled='upt'  placeholder="请选择" style="width: 220px">
              <el-option
                v-for="(item,index) in roleTypes"
                :key="index"
                :label="item.explain"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-form-item label="所属组织" prop="subordinate">
            <el-select v-model="dataForm.subordinate"  :disabled="upt" placeholder="请选择" style="width: 220px">
              <el-option
                v-for="(item,index) in orgTypes"
                :key="index"
                :label="item.explain"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </div></el-col>


      </el-row>
      <div class="tree-select">
      <el-form-item size="mini" label="权限">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          class="el-tree-menu"
          :accordion="true"
          show-checkbox
        :disabled = upt>
        </el-tree>
      </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="aaaa">
      <el-button @click="visible = false" >取消</el-button>
      <el-button type="primary"  v-if="aaaa" :loading="loading"  @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        loading: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        upt: false,
        upt1: false,
        aaaa: false,
        dataForm: {
          id: 0,
          roleName: '',
          roleCode: '',
          subordinate: '',
          roleType: ''
        },
        orgTypes: [],
        roleTypes: [],
        dataRule: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          roleCode: [
            { required: true, message: '角色代码不能为空', trigger: 'blur' }
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id, upt,test,test2) {
        if (upt) {
          if (upt === '1' && test === 1) {
            this.upt = true
            this.upt1 = true
            this.aaaa = false
          } else if (upt === '2' && test === 2) {
            this.upt = false
            this.upt1 = true
            this.aaaa = true
          }else{
            this.upt1 = false
            this.upt = false
            this.aaaa = true
          }
        }
        console.log(this.upt)
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (test === 1) {
            data.forEach(item => {
              item.disabled = true
            })
          }
          this.menuList = treeDataTranslate(data, 'menuId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(() => {
          // 加载select 数据
          this.queryRoleType();
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleName = data.role.roleName
                this.dataForm.roleCode = data.role.roleCode
                this.dataForm.subordinate = data.org[0].explain
                this.dataForm.roleType = data.roleType[0].explain
                var idx = data.role.menuIdList.indexOf(this.tempKey)
                if (idx !== -1) {
                  data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
                }
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
              }
            })
          }
        })
      },
      queryRoleType(){
        this.$http({
          url: this.$http.adornUrl('/pms/role/roleTypeOrSubordinates'),
          method: 'get',
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.roleTypes = data.roleTypes
            this.orgTypes = data.org
          }else {
            this.roleTypes = []
            this.subordinates = []
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roleId': this.dataForm.id || undefined,
                'roleName': this.dataForm.roleName,
                'roleCode': this.dataForm.roleCode,
                'roleTypes': this.dataForm.roleType,
                'orgType': this.dataForm.subordinate,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys())
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.loading = false
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.loading = false
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-tree-menu {
    height: 200px;
    overflow-y: auto;
  }
  span.rightmargin {
    margin-left: 38px
  }

  span.rightmargin1 {
    margin-left: 22px
  }
</style>
