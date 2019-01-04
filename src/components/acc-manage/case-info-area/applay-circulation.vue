<template>
  <section class="component applay-circulation">
    <el-form label-width="100px" :model="applyModel" :rules="applyRules" ref="apply-from">
      <el-row>
        <el-form-item label="流转去向" prop="pooltype">
          <el-select v-model="applyModel.pooltype" placeholder="请选择" style="float:left" clearable>
            <el-option v-for="{value,label} in turnToSelect" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批链" prop="approval">
          <el-select v-model="applyModel.approval" placeholder="请选择" style="float:left" clearable>
            <el-option v-for="{id,taskName} in flowTask" :key="id" :label="taskName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="流转说明" prop="turnDescribe">
          <el-input type="textarea" v-model="applyModel.turnDescribe"></el-input>
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
import { Emit } from "vue-property-decorator";
import { caseType, followType, sourceType } from "~/config/enum.config";
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
  @accManageModule.State caseId;
  @accManageModule.Mutation updateAssitRecord;
  @accManageModule.State searchModel;

  @Emit("close")
  close() {}
  private submitLoading:Boolean = false;
  get refs() {
    return {
      applyFrom: this.$refs["apply-from"]
    };
  }
  private fromPath: any = "";
  private applyRules: any = {
    pooltype: [
      {
        required: true,
        message: "请选择审批链",
        trigger: "change"
      }
    ],
    approval: [
      {
        required: true,
        message: "请选择审批链",
        trigger: "change"
      }
    ],
    turnDescribe: [
      {
        required: true,
        message: "请输入流转说明",
        trigger: "blur"
      }
    ]
  };

  private applyModel: any = {
    pooltype: "",
    approval: "",
    turnDescribe: ""
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
      if (!valid) return false;
      this.submitLoading = true;
      this.caseRoamService
        .CaseRecordInfoApply({
          caseId: [this.caseId],
          pooltype: this.applyModel.pooltype, //流转去向
          taskId: this.applyModel.approval, //审批链
          turnDescribe: this.applyModel.turnDescribe //流转说明
        })
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("申请成功！");
            this.updateAssitRecord(new Date());
            this.close();
            this.applyModel = {};
          },
          ({ msg }) =>{
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
  /**
   * 获取来自于哪个模块
   */
  getFromPath() {
    let str: any =
      `${localStorage.getItem("fromPath")}` == "/"
        ? "/call-acc/call-case"
        : `${localStorage.getItem("fromPath")}`;
    this.fromPath = str.match(/\/(\S*)\//)[1];
    let type: any = "";
    switch (this.fromPath) {
      case "call-acc": //电话
        type = "854";
        break;
      case "visit-acc": //外访
        type = "854";
        break;
      case "inrushcase-manage": //内崔
        type = "854";
        break;
      case "outsource-manage": //委外
        type = "855";
        break;
      case "special-case-manage": //特殊
        type = "856";
        break;
      case "stop-collection-manage": //停催
        type = "857";
        break;
    }
    return type;
  }
  get turnToSelect() {
    //过滤掉相对应的流转去向选项
    let dict: any = this.$dict
      .getDictData("0258")
      .filter(v => v.value != this.getFromPath());
    return dict;
  }
}
</script>

<style lang="less" scoped>
</style>
