<template>
  <section class="page app-msg-push">
    <div class="page">
      <el-form :model="BatchpushParams" ref="pushform" label-width="90px" class="demo-ruleForm">
        <el-form-item label="消息标题" prop="title" align="left">
          <el-input v-model="BatchpushParams.title" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-col :span="18">
            <el-input type="textarea" v-model="BatchpushParams.content" :rows="3" :maxlength="500"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px" style="text-align: center">
          <el-button @click="cancel">取消</el-button>
          <el-button @click="BatchpushCommit" :loading="submitLoading">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { Watch, Prop } from "vue-property-decorator";
import { AppMsgService } from "../../../services/reminder-service/app-msg.service";
// @Auth(856)
@Layout("workspace")
@Component({
  components: {}
})
export default class AppMsgPush extends Vue {
  @Dependencies(AppMsgService) private appMsgService: AppMsgService;
  @Prop() currItem: any;

  private BatchpushParams: any = {
    title: "",
    content: "",
    userId: [],
    appmsgNoRead: 1,
    userNames: []
  };
  private submitLoading: Boolean = false;
  /**
   * 取消
   */
  cancel() {
    //   关闭新增角色dialog
    this.$emit("close");
    // 重置form表单
    let pushform: any = this.$refs["pushform"];
    pushform.resetFields();
  }
  /**
   * 确定
   */
  BatchpushCommit() {
    let pushform: any = this.$refs["pushform"];
    pushform.validate(valid => {
      if (!valid) return false;
      this.submitLoading = true;
      this.BatchpushParams.userId = this.currItem.id;
      this.BatchpushParams.userNames = this.currItem.userName;
      this.appMsgService.saveAppmsg(this.BatchpushParams).subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("推送成功!");
          this.$emit("close");
          this.$emit("resetSuccess");
          let pushform: any = this.$refs["pushform"];
          pushform.resetFields();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    });
  }
}
</script>

<style scoped>
</style>

