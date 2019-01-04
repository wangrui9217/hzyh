<template>
  <section class="component verification">
    <el-form :model="verifyModel" ref="form">
      <el-form-item label="申请理由:" :rules="{ required: true, messsage: '请输入核销理由', trigger: 'blur' }">
        <el-input type="textarea" v-model="verifyModel.applyReasonInfo" resize="none"></el-input>
      </el-form-item>
      <el-form-item scope="scope" label-width="0px" align="center">
        <el-button @click="close">取消</el-button>
        <el-button @click="submit" :loading="submitLoading">确定</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Emit, Prop } from "vue-property-decorator";
import {State,namespace} from "vuex-class";
import { CaseInfoVerificationService } from "~/services/business-service/case-info-verification.service";

const inrushCaseModule = namespace('inrush-case');

@Component({
  components:{}
})
export default class Verification extends Vue {
  @Dependencies(CaseInfoVerificationService) private caseInfoVerificationService: CaseInfoVerificationService;

  @inrushCaseModule.State('selectedCase') caseIds;

  private verifyModel: any = {
    applyReasonInfo: ''
  };
  private submitLoading: Boolean = false;
  @Emit("refresh") //刷新数据
  refresh() {}
  @Emit("close") //关闭核销弹框
  close() {
    this.verifyModel.applyReasonInfo = ''
  }

  /**
   * 核销申请确定
   */
  submit() {
    if( this.verifyModel.applyReasonInfo === ''){
      this.$message('请输入申请理由')
      return
    }
    let applyModel: any = {
      ids: this.caseIds,
      applicationReason: this.verifyModel.applyReasonInfo
    };
    this.submitLoading = true;
    this.caseInfoVerificationService
      .saveCaseInfoVerification(applyModel)
      .subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("申请成功");
          this.close();
          this.refresh();
        },
        error => {
          this.submitLoading = false;
          this.$message.error(error.msg)
        }
    );
  }
}
</script>
<style>

</style>
