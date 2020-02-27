<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="70%"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-row>

        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="dataForm.name" :disabled="dataForm.id" placeholder="请输入"></el-input>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="dataForm.userName" :disabled="dataForm.id" placeholder="请输入"></el-input>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="性别" prop="sex">
            <el-radio v-model="dataForm.sex" :disabled="dataForm.id" label="1">男</el-radio>
            <el-radio v-model="dataForm.sex" :disabled="dataForm.id" label="2">女</el-radio>
            </el-form-item>
          </div></el-col>
        </el-row>

        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="所属组织" prop="org" :required="isHaveTo">
              <el-select v-model="dataForm.org" placeholder="请选择">
                <el-option
                  v-for="item in orgs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light">
            <el-form-item label="所在部门" prop="dept" :required="isHaveTo">
              <el-select v-model="dataForm.dept" placeholder="请选择">
                <el-option
                  v-for="item in depts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="职位" prop="position" :required="isHaveTo">
              <el-select v-model="dataForm.position" placeholder="请选择">
                <el-option
                  v-for="item in positions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div></el-col>
        </el-row>

        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="dataForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="dataForm.email" placeholder="请输入"></el-input>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="工作时长" prop="workTime">
              <el-input v-model="dataForm.workTime" placeholder="请输入"></el-input>
            </el-form-item>
          </div></el-col>
        </el-row>

        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="每日成本" prop="perCost">
              <el-input v-model="dataForm.perCost" placeholder="请输入"></el-input>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light">
            <el-form-item label="入职时间" prop="chkTime">
              <el-date-picker
                v-model="dataForm.chkTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="成本变更时间" prop="costChgTime">
              <el-date-picker
              v-model="dataForm.costChgTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
            </el-form-item>
          </div></el-col>
        </el-row>

        <!--汇报日志-->
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="汇报日志" prop="report">
              <el-radio v-model="dataForm.report" label="1">是</el-radio>
              <el-radio v-model="dataForm.report" label="2">否</el-radio>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light">
            <el-form-item label="绩效考核" prop="effect">
              <el-radio v-model="dataForm.effect" label="1">是</el-radio>
              <el-radio v-model="dataForm.effect" label="2">否</el-radio>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="推送信息" prop="sendMsg">
              <el-radio v-model="dataForm.sendMsg" label="1">是</el-radio>
              <el-radio v-model="dataForm.sendMsg" label="2">否</el-radio>
            </el-form-item>
          </div></el-col>
        </el-row>

        <!--密码-->
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item label="初始密码" prop="initPwd">
              <el-input placeholder="123456" value="123456" v-model="dataForm.initPwd" type="password"></el-input>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-light">
            <el-form-item label="确认密码" prop="confimPwd">
              <el-input placeholder="请输入" v-model="dataForm.confimPwd" type="password"></el-input>
            </el-form-item>
          </div></el-col>
        </el-row>

      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      //验证手机号
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      }
      //验证邮箱
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请正确填写邮箱'));
        } else {
          if (value !== '') {
            var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!reg.test(value)){
              callback(new Error('请输入有效的邮箱'));
            }
          }
          callback();
        }
      };
      return {
        visible: false,
        loading: false,
        input: '',
        roleList: [],
        dataForm: {
          id: 0,
          name: '',
          userName: '',
          sex: '',
          org: '',
          dept: '',
          phone: '',
          email: '',
          workTime: '',
          perCost: '',
          chkTime: '',
          costChgTime: '',
          report: '',
          effect: '',
          sendMsg: '',
          initPwd: '',
          confimPwd: ''
        },
        orgs: [{
          value: '选项1',
          label: '事业部'
        },{
            value: '选项2',
            label: '业务部'
          }],
        depts: [],
        positions: [],
        dataRule: {
          sex: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '用户姓名不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true,validator: validatePassword, trigger: 'blur' }
          ],
          phone: [
            {required: true, validator: checkPhone, trigger: 'blur' }
          ],
          email: [
            {required: true, validator: validateEmail, trigger: 'blur' }
          ],
          chkTime: [
            { required: true, message: '入职时间不能为空', trigger: 'blur' }
          ],
          org: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          dept: [
            { required: true, message: '请选择部门', trigger: 'blur' }
          ],
          position: [
            { required: true, message: '请选择职位', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      isHaveTo: function() {
        return this.dataForm.org !== `1`;
      }
    },
    methods: {
      setPassword(){
        this.dataForm.password=this.dataForm.jobNum;
        this.dataForm.userName=this.dataForm.jobNum;
      },
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/pms/pmsuser/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username
                this.dataForm.name = data.user.name
                this.dataForm.email = data.user.email
                this.dataForm.sex = data.user.sex
                this.dataForm.org = data.user.org
                this.dataForm.dept = data.user.dept
                this.dataForm.phone = data.user.phone
                this.dataForm.workTime = data.user.workTime
                this.dataForm.perCost = data.user.perCost
                this.dataForm.chkTime = data.user.chkTime
                this.dataForm.costChgTime = data.user.costChgTime
                this.dataForm.report = data.user.report
                this.dataForm.effect = data.user.effect
                this.dataForm.sendMsg = data.user.sendMsg
                this.dataForm.initPwd = data.user.initPwd
                this.dataForm.confimPwd = data.user.confimPwd
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'name': this.dataForm.name || undefined,
                'username': this.dataForm.userName,
                'sex': this.dataForm.sex,
                'org': this.dataForm.org,
                'email': this.dataForm.email,
                'pphone': this.dataForm.phone,
                'dept': this.dataForm.dept,
                'workTime': this.dataForm.workTime,
                'perCost': this.dataForm.perCost,
                'chkTime': this.dataForm.chkTime,
                'costChgTime': this.dataForm.costChgTime,
                'report' : this.dataForm.report,
                'effect' : this.dataForm.effect,
                'sendMsg' : this.dataForm.sendMsg,
                'initPwd' : this.dataForm.initPwd,
                'confimPwd' : this.dataForm.confimPwd,
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
