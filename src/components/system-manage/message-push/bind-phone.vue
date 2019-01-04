<template>
  <section class="component bind-phone">
    <el-form :model="form" ref="bind-from">
      <el-form-item label="坐席号" label-width="90px" prop="callerId" :rules="[
            { required: true, message: '请输入正确的坐席号', trigger: 'blur', pattern: /^[0-9-()（）]{7,18}$/ }
          ]">
        <el-col :span="12">
          <el-input v-model="form.callerId"></el-input>
        </el-col>
        <span>(拨#00查询)</span>
      </el-form-item>
      <el-form-item label="主叫号码" prop="callerNum" :rules="[
            {message:'请输入正确的主叫号码',trigger: 'blur', pattern: /^[0-9-()（）]{7,18}$/ }
          ]" label-width="90px">
        <el-col :span="12">
          <el-input v-model="form.callerNum"></el-input>
        </el-col>
      </el-form-item>
    </el-form>

    <!--操作按钮-->
    <div class="row center-span" style="padding:10px 0;">
      <el-button @click="close">取消</el-button>
      <el-button @click="submitClick" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { SmaService } from "~/services/common-service/sma.service";
import { State, Mutation, Action, namespace } from "vuex-class";
import { Watch, Prop, Emit } from "vue-property-decorator";

const accManageModule = namespace("acc-manage");
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class BindPhone extends Vue {
  @Dependencies(SmaService) private smaService: SmaService;
  @accManageModule.Mutation updateCallerInfo;
  @accManageModule.State callerInfo;
  @accManageModule.State taskId;
  @accManageModule.State caller;

  @accManageModule.Mutation updateTaskId;
  @accManageModule.Mutation updateCaller;

  // @Watch("taskId")
  // @Watch("caller")
  // onCaseIdChange() {
  //   this.form.callerId = this.taskId
  //   this.form.callerNum = this.caller
  // }
  private form: any = {
    callerId: "",
    callerNum: ""
  };
  private submitLoading: Boolean = false;
  //
  mounted() {
    this.form.callerId = this.taskId;
    this.form.callerNum = this.caller;
  }
  /**
   * 确定绑定
   */
  submitClick() {
    let bindfrom: any = this.$refs["bind-from"];
    bindfrom.validate(valid => {
      if (!valid) {
        return;
      }
      this.submitLoading = true;
      this.smaService
        .bindTaskDataByCallerId({
          callerId: this.form.callerId,
          caller: this.form.callerNum
        })
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("绑定成功");
            this.smaService.validateTaskIdInEmpId().subscribe(
              data => {
                this.updateTaskId(data.taskId);
                if (data.caller === null) {
                  data.caller === "";
                }
                this.updateCaller(data.caller);
              },
              ({ msg }) => {
                this.$message.error(msg);
              }
            );
            this.$emit("closetwo");
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
          }
        );
    });
  }

  close() {
    this.$emit("closetwo");
    // 重置form表单
    // let bindForm: any = this.$refs['bind-from']
    // bindForm.resetFields()
  }
}
</script>

<style scoped>
</style>
