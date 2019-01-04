<template>
  <section class="component applay-visit">
    <el-form :model="applyModel" :rules="applyRules" ref="apply-from">
      <el-row>
        <el-form-item label="外访说明" prop="applyReason">
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
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {}
})
export default class ApplayVisit extends Vue {
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @accManageModule.State caseId;
  @accManageModule.Mutation updateVisitRecord;

  @Emit("close")
  close() {
  }

  private applyRules: any = {
    applyReason: [
      {
        required: true,
        message: "请输入外访说明",
        trigger: "blur"
      }
    ]
  }
  private applyModel: any = {
    applyReason: ""
  }
  private submitLoading: Boolean = false;

  /**
   * 取消
   */
  cancel() {
    this.close();
    this.applyModel = {};
  }

  /**
   * 确定
   */
  confirm() {
    let applyForm: any = this.$refs["apply-from"];
    applyForm.validate(valid => {
      this.submitLoading = true;
      this.accTelPoolService
        .visitApply({
          caseId: this.caseId,
          applyReason: this.applyModel.applyReason
        })
        .subscribe(data => {
          this.$message.success("申请成功！")
          this.submitLoading = false;
          this.close()
          this.updateVisitRecord(new Date())
          this.applyModel.applyReason = ''
        },
        ({ msg }) => {
          this.$message.error(msg);
          this.submitLoading = false;
        })
    })
  }
}
</script>

<style scoped>

</style>
