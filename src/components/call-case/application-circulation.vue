<template>
  <section class="compontent application-circulation">
    <el-form :model="circulationModel" label-width="80px" :rules="circulationRules" ref="circulation-from" label-position="right">
      <el-row>
        <el-form-item label="流转去向" prop="pooltype">
          <el-select v-model="circulationModel.pooltype" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in turnToSselect" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批链" prop="approval">
          <el-select v-model="circulationModel.approval" placeholder="请选择" clearable>
            <el-option v-for="{id,taskName} in flowTask" :key="id" :label="taskName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流转说明" prop="explain">
          <el-input type="textarea" v-model="circulationModel.explain"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
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
import { CaseRoamService } from "~/services/business-service/case-roam.service";
import { ProcessInfoService } from "~/services/business-service/process-info.service";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit, Watch, Prop } from "vue-property-decorator";

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataBox
  }
})
export default class ApplayAssist extends Vue {
  @Dependencies(CaseRoamService) private caseRoamService: CaseRoamService;
  @Dependencies(ProcessInfoService)
  private processInfoService: ProcessInfoService;
  // @accManageModule.State caseId;
  @accManageModule.Mutation updateAssitRecord;
  @Prop({
    required: true
  }) selectFilter;
  @Emit("close")
  close() {}
  @Prop() caseNumber;
  private submitLoading: Boolean = false;
  get refs() {
    return {
      applyFrom: this.$refs["circulation-from"]
    };
  }
  private circulationRules: any = {
    pooltype: [
      {
        required: true,
        message: "请选择流转去向",
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
    explain: [
      {
        required: true,
        message: "请输入流转说明",
        trigger: "blur"
      }
    ]
  };

  private circulationModel: any = {
    pooltype: "",
    approval: "",
    explain: ""
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
    this.circulationModel = {};
  }
  /**
   * 重置
   */
  reset() {
    let form: any = this.$refs["circulation-from"];
    form.resetFields();
  }
  /**
   * 确定
   */
  confirm() {
    let applyForm: any = this.$refs["circulation-from"];
    applyForm.validate(valid => {
      if(!valid) return false 
      this.submitLoading = true;
      this.caseRoamService
        .CaseRecordInfoApply({
          caseId: this.caseNumber,
          pooltype: this.circulationModel.pooltype,
          taskId: this.circulationModel.approval,
          turnDescribe: this.circulationModel.explain
        })
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("申请成功！");
            this.updateAssitRecord(new Date());
            this.close();
            this.circulationModel = {};
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
            this.close();
            this.circulationModel = {};
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
  get turnToSselect() {
    //过滤掉相对应的流转去向选项
    let data: any = this.$dict.getDictData("0258").filter(v => v.value != this.selectFilter);
    return data
  }
}
</script>

<style lang="less" scoped>
</style>