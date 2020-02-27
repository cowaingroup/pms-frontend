<template>
  <div>
    <el-dialog
      title="导入"
      :close-on-click-modal="false"
      width="600px"
      :visible.sync="visible">
      <el-upload class="upload-demo" ref="upload"
                 :action=this.uploadUrl
                 name="excelFile"
                 :on-preview="handlePreview"
                 :headers="importHeaders"
                 multiple
                 :limit="1"
                 :on-remove="handleRemove" :on-error="uploadFalse" :file-list="fileList"
                 :on-success="uploadSuccess" :auto-upload="false" :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" type="primary">选取文件</el-button>
        <a :href="fileUrl" style="color: #0066cc; margin-left: 20px;">模板下载</a>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx/xlsm文件，且不超过2M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitUpload()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default {
    name: "index",
    props: {
      loadUrl: {
        type: String
      }
    },
    data() {
      return {
        fileUrl:'',
        visible: false,
        loading: false,
        uploadUrl: this.$http.adornUrl(this.loadUrl),
        importHeaders: {
          token: Vue.cookie.get('token')
        },
        fileList: []
      }
    },

    methods: {
    getUrl(type){
      this.$http({
        url: this.$http.adornUrl('/wms/filedownload/queryUrl'),
        method: 'post',
        params: {type:type}
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.fileUrl = data.url
        } else {
          this.fileUrl=''
        }
      })
      },
      uploadVisible() {
        this.visible = !this.visible
      },
      uploadSuccess(response, file, fileList) {
        if (response.code == 0) {
          this.$message({message: '文件导入成功', type: 'success'})
          this.$refs.upload.clearFiles()
          this.$emit('getDataList')
          this.loading = false
          this.visible = false
        } else {
          this.$message({message: response.msg, type: 'error'})
          this.$refs.upload.clearFiles()
          this.loading = false
        }
      },
      uploadFalse(response, file, fileList) {
        this.$message({message: '文件导入失败', type: 'error'})
        this.loading = false
      },
      // 上传前对文件的大小的判断
      beforeAvatarUpload(file) {
        this.loading = true
        const extension = file.name.split(".")[1] === "xls";
        const extension2 = file.name.split(".")[1] === "xlsx";
        const extension3 = file.name.split(".")[1] === "xlsm";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!extension && !extension2&& !extension3) {
          this.$message({message: '上传模板只能是 xls、xlsx、xlsm格式!', type: 'warning'})
          this.loading = false
        }
        if (!isLt2M) {
          this.$message({message: '上传模板大小不能超过 2MB!', type: 'warning'})
          this.loading = false
        }
        return extension || extension2 ||(extension3 && isLt2M);
      },
      submitUpload() {
        //触发组件的action
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        if (file.response.status) {
          this.$message({message: '此文件导入成功', type: 'success'})
        } else {
          this.$message({message: '此文件导入失败', type: 'error'})
        }
      }
    }
  }
</script>

<style scoped>

</style>
