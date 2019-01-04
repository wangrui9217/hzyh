<template>
  <section class="page case-file-import">
    <el-form label-width="100px" class="text-left" :model="params">
      <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
        <el-select placeholder="请选择" v-model="params.companyCode" @change="changeCompanyCode">
          <el-option v-for="item in companyName" :label="item.code" :value="item.code" :key="item.chinaName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!selected" label="批次号" prop="batchNum">
        <el-select placeholder="请选择" v-model="params.batchNum">
          <el-option v-for="item in batchList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件">
        <file-upload :fileList.sync="fileList" :disabled="!params.batchNum&&!selected" ref="upload_file"></file-upload>
      </el-form-item>
      <el-form-item label-width="0" v-if="!selected">
        <span style="color:red;font-size:14px;">（重要提示：如果需要导入多个文件，需要使用压缩包形式上传。目前只支持上传ZIP格式的压缩包文件，压缩包命名不限 ，但是压缩包中每个文件夹的命名请按照“客户姓名_身份证号”格式，文件夹内不要再包含压缩文件，否则无法在线浏览。）</span>
      </el-form-item>
      <el-form-item label-width="0" v-else>
        <span style="color:red;">（重要提示：支持上传多个文件，如上传压缩包文件则无法在线浏览必须下载才能查看。）</span>
      </el-form-item>
    </el-form>
    <div style="text-align: center">
    <el-button @click="close">取消</el-button>
    <el-button @click="submit" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Action, namespace, Getter } from "vuex-class";
import { FileUploadService } from "../../../services/file-service/file-upload.service";
import FileUpload from "~/components/common/file-upload.vue";
import { Prop } from "vue-property-decorator";
import { DataInfoExcelService } from "~/services/dataimp-service/data-info-excel.service";
const accManageModule = namespace("case-manage");

@Layout("workspace")
@Component({
  components: {
    FileUpload
  }
})
export default class IntroductionCase extends Vue {
  @Dependencies(FileUploadService) private fileUploadService: FileUploadService;
  @Dependencies(DataInfoExcelService)
  private dataInfoExcelService: DataInfoExcelService;
  @Getter isSupperAdmin: boolean;
  @accManageModule.State batchList;
  @accManageModule.Action getBatchList;
  @State companyName;
  @State userData: any;
  @Prop() selected: any;
  private params: any = {
    batchNum: "",
    companyCode: "",
    uploadFile: ""
  };
  private fileList: any = [];
  private submitLoading: Boolean = false;
  mounted() {
    this.getBatchList(this.userData.companyCode);
    this.params.companyCode = this.userData.companyCode;
    // this.addMessageListener({
    //   type: 'Progress',
    //   callback: (() => {
    //     let self = this
    //     return (data) => {
    //       self.loading.state = (data.current < data.total)
    //       self.loading.text = `正在解压附件:${data.current}/${data.total}`
    //       if (!self.loading.state) {
    //         self.$emit('success')
    //         self.$message('附件导入完成')
    //         self.close()
    //       }
    //     }
    //   })()
    // })
  }
  changeCompanyCode() {
    this.getBatchList(this.params.companyCode);
  }
  close() {
    let uploadfile: any = this.$refs["upload_file"];
    uploadfile.reset();
    this.$emit("close");
    this.params.batchNum = "";
    this.params.companyCode = "";
  }
  submit() {
    if (!this.fileList || this.fileList.length < 1) {
      this.$message("请上传导入文件");
      return;
    }
    this.submitLoading = true;
    if (this.selected) {
      this.uploadFile(this.fileList);
    } else {
      // 获取文件ID
      this.params.uploadFile = this.fileList[0].response.id;
      this.fileUploadService.unZipCaseFile(this.params).subscribe(
        data => {
          this.submitLoading = false;
          this.$message("附件导入成功");
          this.close();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    }
  }
  uploadFile(fileList) {
    this.dataInfoExcelService
      .uploadCaseFileSingle({
        batchNumber: this.selected.batchNumber,
        caseNum: this.selected.caseNumber,
        caseId: this.selected.id,
        fileIdList: fileList.map(x => x.response.id),
        companyCode: this.selected.companyCode
      })
      .subscribe(
        data => {
          this.$message("附件导入成功");
          this.$emit("success");
          this.close();
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
}
</script>

<style scoped>
</style>
