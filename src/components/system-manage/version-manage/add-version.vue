<template>
  <section class="component add-version">
    <el-form :model="addParams" ref="add-form" label-width="100px"  :rules="rules">
      <el-col>
        <el-form-item label="版本号:" prop="mobileVersion" align="left">
          <el-input v-model="addParams.mobileVersion" :maxlength="20" placeholder="用两个小数点隔开的三个数字"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="选择操作系统:" align="left" prop="os">
          <el-radio-group v-model="addParams.os" @change="$refs['file-upload']?$refs['file-upload'].reset():addParams.url='';fileUploadDiabled = false;">
            <el-radio label="iPhone OS"></el-radio>
            <el-radio label="Android"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="是否静默安装:" prop="silentInstall" >
          <el-radio-group v-model="addParams.silentInstall">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="更新类型:" prop="type">
          <el-radio-group v-model="addParams.type" @change="$refs['file-upload']?$refs['file-upload'].reset():addParams.url=''">
            <el-radio :label="1">应用更新</el-radio>
            <el-radio :label="0">整包更新</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="this.addParams.type===1">
        <el-form-item prop="url">
          <FileUpload :fileList.sync="fileList" :disabled="fileUploadDiabled" :fileNumberLimit="1" ref="file-upload" :AllowExtension="addParams.os===''?['apk','ipa','pxl','deb']:addParams.os==='Android'?['apk']:['ipa','pxl','deb']" @onUploadSuccess="onUploadSuccess" align="left"></FileUpload>
        </el-form-item>
      </el-col>
      <el-col v-else style="display:block;margin-bottom: 20px">
        <el-form-item prop="url" >
          <el-input type="textarea"  placeholder="请输入url" v-model="addParams.url" ></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-button @click="confirmPublish">确认发布</el-button>
    <el-button @click="cancel">取消</el-button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { CompanyService } from "~/services/business-service/company.service";
import { Emit, Prop } from "vue-property-decorator";
import { AppVersionService } from "~/services/common-service/app-version.service";
import FileUpload from "~/components/common/file-upload.vue";

@Component({
  components: {
    FileUpload
  }
})
export default class AddVersion extends Vue {
  @Dependencies(AppVersionService) private appVersionService: AppVersionService;
  @Emit("refreshList")
  refreshList() {}
  @Prop() companyCode: any;

  private fileList: any = [];
  private addParams: any = {
    mobileVersion: "",
    os: "",
    silentInstall: 0,
    type: 0,
    url: "",
    companyCode: ""
  };
  private fileUploadDiabled: any = false;
  private rules: any = {
    mobileVersion: [
      { required: true, message: "请输入版本号", trigger: "blur" },
      {
        message: "请输入正确版本号",
        pattern: /^\d{1,2}(\.\d{1,2}){1,2}$/,
        trigger: "blur"
      }
    ],
    os: [
      { required: true, message: "请至少选择一种操作系统", trigger: "change" }
    ]
  };
   /**
   * 传入companyCode
   */
  created() {
    this.addParams.companyCode = this.companyCode;
  }
  onUploadSuccess() {
    this.fileUploadDiabled = true;
  }
  onBeforeRemove() {}
  /**
   * 重置
   */
  reset() {
    let fileUpload: any = this.$refs["file-upload"];
    fileUpload && fileUpload.reset();
    let form: any = this.$refs["add-form"];
    form.resetFields();
  }
  /**
   * 确认发布
   */
  confirmPublish() {
    let addForm: any = this.$refs["add-form"];
    addForm.validate(valid => {
      if (!valid) return false;
      //获取上传文件
      let fileUpload: any = this.$refs["file-upload"];
      if (fileUpload) {
        // 查看是否上传完成
        if (this.fileList.length === 0) {
          this.$message("请上传导入文件");
          return;
        }
        this.addParams.url = this.fileList[0].response
          ? this.fileList[0].response.url
          : "";
        this.addParams.size = this.fileList[0].response
          ? this.fileList[0].response.size
          : "";
      }
      if (this.addParams.type===0 && this.addParams.url === "") {
        this.$message("请输入url");
        return;
      }
      // 提交保存
      this.appVersionService.createAppVersion(this.addParams).subscribe(
        data => {
          this.$message.success("新增成功!");
          this.fileUploadDiabled = false;
          this.$emit("close");
          this.refreshList();
          this.addParams.url = "";
        },
        ({ msg }) => {
          this.fileUploadDiabled = false;
          this.$message.error(msg);
        }
      );
    });
  }
  /**
   * 取消
   */
  cancel() {
    if (this.$refs["file-upload"]) {
      // this.$refs['file-upload'].reset()
      //   关闭新增版本dialog
      this.$emit("close");
      // 重置form表单
      // this.$refs['addform'].resetFields()
    } else {
      //   关闭新增版本dialog
      this.$emit("close");
      this.fileUploadDiabled = false;
      // 重置form表单
      let addForm: any = this.$refs["add-form"];
      addForm.resetFields();
      // 重置url输入框
      this.addParams.url = "";
      this.fileUploadDiabled = false;
    }
  }
}
</script>

<style lang="less">
.component.add-version{
  .el-form-item__content{
    text-align: left!important;
  }
}
</style>

