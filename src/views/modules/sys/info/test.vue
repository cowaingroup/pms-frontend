<template>
  <el-dialog :title="yuJingGuiZe" :close-on-click-modal="false" :visible.sync="visible">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="消息类型" style="width: 350px" prop="msgType">
            <el-input v-model="dataForm.msgType" :disabled="upt" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="推送方式" prop="pushMode">
            <el-select v-model="dataForm.pushMode" :disabled="upt" placeholder="请选择">
              <el-option
                v-for="item in pushModes"
                :key="item.id"
                :label="item.explain"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推送时间(触发)" prop="pushTime">
            <el-select v-model="dataForm.pushTime" :disabled="upt" placeholder="请选择">
              <el-option
                v-for="item in pushTimes"
                :key="item.id"
                :label="item.explain"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推送途径" style="width: 350px" prop="pushWay">
            <el-select v-model="dataForm.pushWay" :disabled="upt" placeholder="请选择">
              <el-option
                v-for="item in pushWays"
                :key="item.id"
                :label="item.explain"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="推送范围" style="width: 350px" prop="pushRange">
            <el-select v-model="dataForm.pushRange" :disabled="upt1" placeholder="请选择">
              <el-option
                v-for="item in pushRanges"
                :key="item.id"
                :label="item.explain"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

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
    name: "setting",
    data() {
      return {
        yuJingGuiZe: "消息规则新增",
        visible: false,
        loading: false,
        dataForm: {
          id: 0,
          ruleName: '',
          pushMode: '',
          pushWay: '',
          pushRange: '',
          pushTime: '',
          msgType: ''
        },
        pushModes: [],
        pushWays: [],
        pushRanges: [],
        pushTimes: [],
        msgTypes: [],
        upt: false,
        upt1: false,
        dataRule: {
          // alarmCategory: [
          //   { required: true, message: "预警类型不能为空", trigger: "blur" }
          // ],
          ruleName: [
            { required: true, message: "预警规则名称不能为空", trigger: "blur" }
          ]
        }
      };
    },
    mounted: function() {
    },
    methods: {
      init(row,upt) {
        console.log('row == ',row)
        if (upt === 1) {
          this.dataForm.id = row.id;
          this.dataForm.pushMode = row.pushModes;
          this.dataForm.pushRange = row.pushRanges;
          this.dataForm.pushTime = row.pushTimes;
          this.dataForm.pushWay = row.pushWays;
          this.dataForm.msgType = row.msgType;
          this.visible = true;
          this.upt1 = false;
          this.upt = true;
          console.log('执行修改')
        } else {
          console.log('执行新增')
          this.dataForm = {};
          this.yuJingGuiZe = '消息规则新增';
          this.visible = true;
          this.upt1 = false;
          this.upt = false;
        }
        this.queryPriority();
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            this.loading = true;
            this.$http({
              url: this.$http.adornUrl(
                `/pms/msg/${!this.dataForm.id ? "save" : "update"}`
              ),
              method: "post",
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                pushModes: this.dataForm.pushMode,
                pushRanges: this.dataForm.pushRange,
                pushTimes: this.dataForm.pushTime,
                pushWays: this.dataForm.pushWay,
                msgType: this.dataForm.msgType
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit('refreshDataList');
                    this.loading = false;
                  }
                });
              } else {
                this.$message.error(data.msg);
                this.loading = false;
              }
            })
              .catch(() => {
                this.loading = false;
              });
          }
        });
      },
      // 查询优先级
      queryPriority () {
        this.$http({
          url: this.$http.adornUrl('pms/msg/queryMsg') ,
          method: 'get',
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.pushModes = data.pushModes
            this.pushRanges = data.pushRanges
            this.pushTimes = data.pushTimes
            this.pushWays = data.pushWays
            this.msgTypes = data.msgTypes
          }else {
            this.pushModes = []
            this.alarmTypes = []
            this.pushRanges = []
            this.pushTimes = []
            this.msgTypes = []
          }
        })
      },
    }
  };
</script>
