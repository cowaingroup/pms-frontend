<template>
  <div style="display: inline;width: 100%">
    <div style="width: 290px;margin: 5px;">
      <el-form :model="dataForm" label-position="left" label-width="100px">
        <el-form-item label="基础设置"></el-form-item>
      <el-form-item label="目标打印机">
        <el-input label="打印机名称" v-model="dataForm.name"></el-input>
      </el-form-item>
      <el-form-item label="纸张尺寸">
        <el-select v-model="dataForm.paperType" placeholder="纸张尺寸">
          <el-option v-for="item in dataForm.paperList" :key="item.id" :value="item.type" :label="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="布局">
        <el-select v-model="dataForm.direction" placeholder="横向/纵向">
          <el-option v-for="item in dataForm.directionList" :key="item.id" :value="item.direction" :label="item.direction"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="份数">
        <el-input label="打印机名称" v-model="dataForm.count"></el-input>
      </el-form-item>
      </el-form>
      <hr>
    </div>
    <el-collapse v-model="dataForm.activeNames" style="width: 290px">
      <el-collapse-item title="更多设置" name="1">
        <div style="width: 290px;height: 220px;margin-right: 10px;">
          <el-form :model="dataForm" label-position="left" label-width="100px">
            <el-form-item label="每个表页数">
              <el-input label="工作表页数" v-model="dataForm.paperCount"></el-input>
            </el-form-item>
            <el-form-item label="边距">
              <el-select v-model="dataForm.pangding" placeholder="边距">
                <el-option v-for="item in dataForm.pangdingList" :key="item.id" :value="item.type" :label="item.type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="缩放">
              <el-select v-model="dataForm.scalingType" placeholder="缩放">
                <el-option v-for="item in dataForm.pangdingList" :key="item.id" :value="item.type" :label="item.type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" style="width: 180px">
              <el-input label="" v-model="dataForm.scaling"></el-input>
            </el-form-item>
          </el-form>
          <hr>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div>
      <el-button type="primary" @click="submitSet()">确定</el-button>
      <el-button type="primary" @click="testPrinter()">测试打印</el-button>
    </div>
  </div>
</template>

<script>
  import {requestParam} from '../../../api/requestParam'
    export default {
      data(){
        return{
        dataForm:{
          id: 0,
          name: '',
          paperType: '',
          direction: '',
          remark: '',
          count:1,
          directionList:[{id:1,direction:"横向"},{id:2,direction:"纵向"}],
          paperList:[{id:1,type:"A4"},{id:2,type:"单据"}],
          activeNames:'',
          paperCount:1,
          pangding:'',
          pangdingList:[{id:1,type:"默认"},{id:2,type:"无"},{id:3,type:"自定义"}],
          scaling:100,
          scalingType:''
         }
        }
      },
        name: "printer-config",
      mounted:function(){
          this.getPrinterParamter();
      },
      methods:{
        submitSet()
        {
            var params = {
              'id': this.dataForm.id ,
              'name': this.dataForm.name,
              'paperType': this.dataForm.paperType,
              'direction': this.dataForm.direction,
              'remark': this.dataForm.remark
          }
          this.$http({
            url:this.$http.adornUrl('/wms/printer/update'),
            method:'post',
            data:requestParam(params)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
            }
          })
        },
        testPrinter() {
          this.$http({
            url: this.$http.adornUrl('/wms/printer/test'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
            }
          })
        },
        getPrinterParamter() {
          this.$http({
            url: this.$http.adornUrl('/wms/printer/getPrinterParam'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.data.name
              this.dataForm.direction = data.data.direction
              this.dataForm.paperType = data.data.paperType
            } else {
              }
          })
        },
      }
    }
</script>

<style scoped>

</style>
