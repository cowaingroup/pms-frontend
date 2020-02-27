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
          <el-form-item label="预警规则名称" style="width: 350px" prop="ruleName">
            <el-input v-model="dataForm.ruleName" :disabled="upt" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="预警类型" prop="alarmType">
            <el-select v-model="dataForm.alarmType" :disabled="upt" placeholder="请选择">
              <el-option
                v-for="item in alarmCategorys"
                :key="item.id"
                :label="item.explain"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="priority">
            <el-select v-model="dataForm.priority" :disabled="upt1" placeholder="请选择">
              <el-option
                v-for="item in prioritys"
                :key="item.id"
                :label="item.explain"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预警时间" style="width: 350px" prop="day">
            <el-select v-model="dataForm.day" :disabled="upt1" placeholder="请选择">
              <el-option
                v-for="item in days"
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
          <el-form-item label="升级上报时间" style="width: 350px" prop="upgradeDay">
            <el-select v-model="dataForm.upgradeDay" :disabled="upt1" placeholder="请选择">
              <el-option
                v-for="item in upgradeDays"
                :key="item.id"
                :label="item.explain"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item label="消息类型" style="width: 350px" prop="msgType">
            <el-select v-model="dataForm.msgType" :disabled="upt1" placeholder="请选择">
              <el-option
                v-for="item in msgTypes"
                :key="item.id"
                :label="item.msgType"
                :value="item.id"
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
      yuJingGuiZe: "预警规则新增",
      visible: false,
      loading: false,
      dataForm: {
        id: 0,
        ruleName: '',
        // alarmCategory: '',
        day: '',
        upgradeDay: '',
        priority: '',
        alarmType: '',
        msgType: ''
      },
      prioritys: [],
      alarmTypes: [],
      msgTypes: [],
      upgradeDays: [],
      days: [],
      alarmCategorys: [],
      upt: false,
      upt1: false,
      dataRule: {
        alarmCategory: [
          { required: true, message: "预警类型不能为空", trigger: "blur" }
        ],
        ruleName: [
          { required: true, message: "预警规则名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted: function() {
    // this.getDataList();
  },
  methods: {
    init(row,upt) {
      console.log(row,upt);
      if (upt === 1) {
        this.dataForm.id = row.id;
        this.dataForm.ruleName = row.ruleName;
        this.dataForm.alarmType = row.alarmTypes;
        this.dataForm.day = row.days;
        this.dataForm.upgradeDay = row.upgradeDays;
        this.dataForm.priority = row.prioritys;
        this.dataForm.msgType = row.msgTypes;
        this.visible = true;
        this.upt1 = false;
        this.upt = true;
        console.log('执行修改')
      } else {
        console.log('执行新增')
        this.dataForm = {};
        this.yuJingGuiZe = "预警规则新增";
        this.visible = true;
        this.upt1 = false;
        this.upt = false;
      }
      this.queryPriority();
      // 清空表格数据
      // this.$refs['dataForm'].resetFields();
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http({
            url: this.$http.adornUrl(
              `/pms/alarm/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              ruleName: this.dataForm.ruleName,
              alarmTypes: this.dataForm.alarmType,
              days: this.dataForm.day,
              upgradeDays: this.dataForm.upgradeDay,
              msgTypes: this.dataForm.msgType,
              prioritys: this.dataForm.priority
            })
          }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    // this.$refs['dataForm'].resetFields();
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
        url: this.$http.adornUrl('pms/alarm/queryAlarmPar'),
        method: 'get',
      }).then(({data})=>{
        if (data && data.code === 0) {
          this.prioritys = data.prioritys
          this.alarmTypes = data.alarmTypes
          this.msgTypes = data.msgTypes
          this.upgradeDays = data.upgradeDays
          this.days = data.days
          this.alarmCategorys = data.alarmCategorys
        }else {
          this.prioritys = []
          this.alarmTypes = []
          this.msgTypes = []
          this.upgradeDays = []
          this.days = []
          this.alarmCategorys = []
        }
      })
    },
  }
};
</script>
