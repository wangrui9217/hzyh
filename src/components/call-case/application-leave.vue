<template>
  <section class="component application-leave">
    <el-form>
    </el-form>
    <el-form :model="circulationModel" label-width="80px" :rules="circulationRules" ref="circulation-from">
      <el-form-item label="审批链" prop="taskId">
        <el-select v-model="circulationModel.taskId" placeholder="请选择" clearable>
          <el-option v-for="{id,taskName} in flowTask" :key="id" :label="taskName" :value="id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="留案时间" prop="leftDate">
        <el-date-picker type="date" :editable="false" v-model="circulationModel.leftDate" placeholder="选择日期时间" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="留案说明" prop="leaveReason">
        <el-input type="textarea" v-model="circulationModel.leaveReason"></el-input>
      </el-form-item>
    </el-form>
    <div class="row center-span">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="confirm" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { LeaveCaseService } from "~/services/business-service/leave-case.service";
import { ProcessInfoService } from "~/services/business-service/process-info.service";
import { Dependencies } from "~/core/decorator";
import { Emit, Watch, Prop } from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class ApplicationLeave extends Vue {
  @Dependencies(LeaveCaseService) private leaveCaseService: LeaveCaseService;
  @Dependencies(ProcessInfoService) private processInfoService: ProcessInfoService;
  @Prop({
    required: true
  }) caseIdList;
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
    leftDate: [
      {
        required: true,
        message: "请选择留案时间",
        trigger: "blur"
      }
    ],
    taskId: [
      {
        required: true,
        message: "请选择审批链",
        trigger: "blur"
      }
    ],
    leaveReason: [
      {
        required: true,
        message: "请输入留案说明",
        trigger: "blur"
      }
    ]
  };

  private circulationModel: any = {
    taskId: "",
    leftDate: "",
    leaveReason: "",
    caseIdList: []
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
    this.circulationModel.caseIdList = this.caseIdList
    applyForm.validate(valid => {
      if(!valid) return false;
      this.submitLoading = true;
      this.leaveCaseService.leaveCaseApply(this.circulationModel).subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("操作成功！");
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
}
</script>

<style lang="less">

</style>