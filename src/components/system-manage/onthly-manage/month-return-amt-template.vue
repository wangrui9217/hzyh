<template>
  <section class="page month-return-amt-template">
    <el-form ref="data-form" :model="params" label-width="100px" class="text-left">
      <el-form-item label="上传文件" required>
        <file-upload ref="upload_case_import" :fileList.sync="fileList" :fileNumberLimit="1"></file-upload>
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button @click="close">取消</el-button>
      <el-button @click="submit" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { UserBackcashPlanService } from "../../../services/business-service/user-backcash-plan.service";
import FileUpload from "~/components/common/file-upload.vue";
import { State } from "vuex-class";

// @Auth(856)
@Layout('workspace')
@Component({
  components: {
    FileUpload
  }
})
export default class MonthReturnAmtTemplate extends Vue {
  @Dependencies(UserBackcashPlanService) private userBackcashPlanService: UserBackcashPlanService;
  @State userData: any;

  private fileList: any = []
  private params: any = {
    fileId: '', // 文件id
    companyCode: ''
  };
  private submitLoading: Boolean = false;
  /**
   * 取消
   */
  close() {
    let caseImport: any = this.$refs['upload_case_import']
    caseImport.reset()
    this.$emit('close')
    let dataForm: any = this.$refs['data-form']
    dataForm.resetFields()
  }
  /**
   * 确定
   */
  submit() {
    if (this.fileList.length === 0) {
      this.$message('请上传导入文件')
      return
    }
    // 存储文件ID
    this.params.fileId = this.fileList[0].response.id
    let save: any = this.$refs['data-form']
    save.validate(valid => {
      if (!valid) {
        return
      }
      this.submitLoading = true;
      this.userBackcashPlanService
        .importBackAmtGoalExcel({
          fileId: this.params.fileId,
          companyCode: this.params.companyCode
        })
        .subscribe(data => {
          this.submitLoading = false;
          this.$message.success('导入成功！')
          this.$emit('refresh')
          this.close()
        }, err => {
          this.submitLoading = false;
          console.log("err"+JSON.stringify(err))
            if (err.data && err.data.length) {
              this.$emit('errMsg', err.data)
           } else {
             this.$message({
               type: 'info',
                message: err.msg
              })
            }
        })
    })
  }
}
</script>

<style scoped>

</style>
