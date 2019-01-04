<template>
  <!--上传修复附件-->
  <div>
    <el-form ref="data-form" :model="params" label-width="80px" class="text-left">
      <el-form-item label="上传附件">
        <file-upload ref="upload_case_import" :fileList.sync="fileList" multiple></file-upload>
      </el-form-item>
      <el-form-item label="修复说明" prop="repairMemo" :rules="{required: true, message: '内容不能为空', trigger: 'blur'}">
        <el-input type="textarea" class="textarea" v-model="params.repairMemo" :maxlength="500"></el-input>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button @click="closes">取消</el-button>
    <el-button @click="submit" :loading="submitLoading">确定</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State } from "vuex-class";
import { Emit, Watch, Prop } from "vue-property-decorator";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import FileUpload from "~/components/common/file-upload.vue";
import { CaseRepairService } from "~/services/business-service/case-repair.service";

@Component({
  components: {
    FileUpload,
    DataBox,
    DataForm
  }
})
export default class UploadAttachments extends Vue {
  @Prop() repairId: any;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseRepairService) private caseRepairService: CaseRepairService;
  private params: any = {
    fileIds: "", // 文件id
    repairMemo: "" // 修复说明
  };
  private outSourceList: any = [];
  private fileList: any = [];
  private submitLoading: Boolean = false;
  @Emit("close")
  close() {}
  /**
   * 确定
   */
  submit() {
    // 获取上传文件
    let file = this.fileList.map(v => v.response);
    // 查看是否上传完成
    if (file.length === 0) {
      this.$message("请上传导入文件");
      return;
    }
    if (this.params.repairMemo === "") {
      this.$message("请输入修复说明");
      return;
    }
    // 存储文件ID
    this.params.fileIds = file.map(v => v.id);
    let vaildForm: any = this.$refs["data-form"];
    vaildForm.validate(valid => {
      if (!valid) {
        return;
      }
      this.submitLoading = true;
      // 发送导入请求
      this.caseRepairService
        .toRepair({
          fileIds: this.params.fileIds,
          id: this.repairId,
          repairMemo: this.params.repairMemo
        })
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("附件上传成功！");
            this.$emit("refresh");
            this.closes();
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
          }
        );
    });
  }
  closes() {
    let upload: any = this.$refs["upload_case_import"];
    upload.reset();
    this.$emit("close");
    let dataForm: any = this.$refs["data-form"];
    dataForm.resetFields();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btns {
  text-align: center;
}
.textarea {
  width: 80%;
}
</style>
