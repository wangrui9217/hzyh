<template>
  <section class="component applay-assist">
    <el-form label-width="100px" :model="applyModel" :rules="applyRules" ref="apply-from">
      <el-row>
        <el-form-item label="协催方式" prop="assistWay">
          <el-select v-model="applyModel.assistWay" placeholder="请选择" style="float:left" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0006')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批链" prop="approval">
          <el-select v-model="applyModel.approval" placeholder="请选择" style="float:left" clearable>
            <el-option v-for="{id,taskName} in flowTask" :key="id" :label="taskName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>

        <el-form-item label="协催说明" prop="applyReason">
          <el-col :span="19">
            <el-input type="textarea" v-model="applyModel.applyReason"></el-input>
          </el-col>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="row center-span" style="10px 0">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="confirm" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Mutation, namespace } from "vuex-class";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";

import { CaseAssistApplyProcessService } from "~/services/business-service/case-assist-apply-process.service";
import { ProcessInfoService } from "~/services/business-service/process-info.service";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataBox
  }
})
export default class ApplayAssist extends Vue {
  @Dependencies(CaseAssistApplyProcessService)
  private caseAssistApplyProcessService: CaseAssistApplyProcessService;
  @Dependencies(ProcessInfoService)
  private processInfoService: ProcessInfoService;
  @accManageModule.State caseId;
  @accManageModule.Mutation updateAssitRecord;
  @Emit("close")
  close() {}
  private submitLoading: Boolean = false;

  get refs() {
    return {
      applyFrom: this.$refs["apply-from"]
    };
  }
  private applyRules: any = {
    assistWay: [
      {
        required: true,
        message: "请输入协催方式",
        trigger: "blur"
      }
    ],
    approval: [
      {
        required: true,
        message: "请选择审批链",
        trigger: "blur"
      }
    ],
    applyReason: [
      {
        required: true,
        message: "请输入协催说明",
        trigger: "blur"
      }
    ]
  };

  private applyModel: any = {
    applyReason: "",
    approval: "",
    assistWay: ""
  };
  private flowTask: any = {};
  created() {
    this.getFlowTask();
  }
  /**
   * 取消
   */
  cancel() {
    this.close();
    this.applyModel = {};
  }
  /**
   * 重置
   */
  reset() {
    let form: any = this.$refs["apply-from"];
    form.resetFields();
  }
  /**
   * 确定
   */
  confirm() {
    let applyForm: any = this.$refs["apply-from"];
    applyForm.validate(valid => {
      if(!valid) return false;
      this.submitLoading = true;
      this.caseAssistApplyProcessService
        .applyCaseAssistDerate({
          caseId: this.caseId,
          applyReason: this.applyModel.applyReason,
          assistWay: this.applyModel.assistWay,
          taskId: this.applyModel.approval
        })
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("申请成功！");
            this.updateAssitRecord(new Date());
            this.close();
            this.applyModel = {};
          },
          ({ msg }) => {
            this.$message.error(msg);
            this.submitLoading = false;
          }
        );
    });
  }
  /**
   * 获取审批链
   *
   */
  getFlowTask() {
    this.processInfoService.getFlowTaskAll().subscribe(d => {
      this.flowTask = d;
    });
  }
}
</script>

<style lang="less" scoped>
</style>
