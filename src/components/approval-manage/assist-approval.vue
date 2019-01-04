<template>
  <section class="component assist-approval">
    <div class="text-left">
      <el-form  ref="approval-form" :model="approvalModel" :rules="approvalRules" label-width="100px">
        <el-form-item label="协催说明">
          <el-input type="textarea" v-model="assistobj.applyReason" readonly></el-input>
        </el-form-item>
        <el-form-item label="审批结果" prop="nodeState">
          <el-radio-group  v-model="approvalModel.nodeState">
            <el-radio :label="0">同意</el-radio>
            <!-- <el-radio :label="1">驳回</el-radio> -->
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="nodeOpinion">
          <el-input type="textarea" v-model="approvalModel.nodeOpinion"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="close()">取消</el-button>
        <el-button @click="approvalCommit" :loading="approvalLoading">确定</el-button>
      </el-row>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Watch, Prop, Emit } from "vue-property-decorator"
import { CaseAssistApplyService } from "~/services/business-service/case-assist-apply.service";
import { CaseAssistApplyProcessService } from "~/services/business-service/case-assist-apply-process.service";

@Component({
  components: {
    
  }
})
export default class AssistApproval extends Vue {
  @Dependencies(CaseAssistApplyProcessService) private caseAssistApplyProcessService: CaseAssistApplyProcessService;
  @Dependencies(CaseAssistApplyService)
  private caseAssistApplyService: CaseAssistApplyService;
  @Emit('success')
  success() { };
  @Emit('close')
  close() { };
  private approvalModel: any = {
    assistApplyId: '',
    caseNumber: '',
    nodeState: '',
    nodeOpinion: '',
    approvalId: ''
  };
  private assistobj:any = {}
  private approvalLoading: any = false; 
  private approvalRules: any = {
    nodeState: [
      { required: true, message: "请选择审批结果", trigger: "change" }
    ],
    nodeOpinion: [
      { required: true, message: "请输入审批意见", trigger: "blur" }
    ]
  };
  onCaseIdChange(row) {
    this.assistobj = row
    this.approvalModel.caseNumber = row.caseNumber
    this.approvalModel.assistApplyId = row.assistApplyId
    this.approvalModel.approvalId = row.approvalId
  }

  /**
   * 审批确定
   */
  approvalCommit() {
    let form:any = this.$refs['approval-form']
    form.validate(valid => {
      if(!valid) return false
      this.approvalLoading = true;
      this.caseAssistApplyProcessService.saveCaseAssistApproval(this.approvalModel).subscribe(
      data => {
        this.$message.success("操作成功!");
        this.approvalLoading = false;
        this.success();
        this.close()
      },
      ({ msg }) => {
        this.approvalLoading = false;
        this.$message.error(msg);
      });
    })  
  }
  refresh() {
    let form: any = this.$refs['approval-form']
    form.resetFields()
  }
}
</script>
