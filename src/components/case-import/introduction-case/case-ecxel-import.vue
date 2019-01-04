<template>
  <section class="page case-excel-import" v-loading:body="importLoading">
    <el-form ref="data-form" :model="importModel" label-width="100px" class="text-left" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
            <el-select  v-model="importModel.companyCode" @change="checkCompany">
              <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="委托方" prop="id">
            <el-select placeholder="请选择" v-model="importModel.id">
              <el-option v-for="{id,name} in principalList" :key="id" :label="name" :value="id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模板名称" prop="templateId" v-show="templateShow">
            <el-select placeholder="请选择" v-model="importModel.templateId">
              <el-option v-for="{id,templateName} in templateNameList" :key="id" :label="templateName" :value="id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上传文件">
        <file-upload ref="upload_case_import" :fileList.sync="fileList" :fileNumberLimit="1" :AllowExtension="['xlsx','xls']"></file-upload>
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
import { State, Getter, Action, namespace } from "vuex-class";
import { Watch } from "vue-property-decorator";
import FileUpload from "~/components/common/file-upload.vue";
import { PrincipalService } from "../../../services/business-service/principal.service";
import { AccImportExcelDataService } from "../../../services/dataimp-service/acc-import-excel-data.service";
import { DataInfoExcelService } from "../../../services/dataimp-service/data-info-excel.service";
import { PageService } from "~/utils/page.service";
import { FilterService } from '~/utils/filter.service';

const accManageModule = namespace("acc-manage");

// @Auth(414)
@Layout("workspace")
@Component({
  components: {
    FileUpload
  }
})
export default class CaseExcelImport extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(PrincipalService) private principalService: PrincipalService;
  @Dependencies(AccImportExcelDataService)
  private accImportExcelDataService: AccImportExcelDataService;
  @Dependencies(DataInfoExcelService)
  private dataInfoExcelService: DataInfoExcelService;
  @State userData: any;
  @State companyCode: any;
  @Getter isSupperAdmin: boolean;
  @State companyList: any;
  @State principalList: any;
  @accManageModule.Action getBatchList;
  @Watch('importModel.id')
  getTemplate() {
    this.getTemplateName()
  }
  private submitLoading: Boolean = false;
  private importModel: any = {
    id: "", // 委托方ID
    delegationDate: "", // 委案日期
    closeDate: "", // 结案日期
    fileId: "", // 文件id
    templateId: "",
    memo: "", // 备注
    companyCode: "",
    principalId: "",
    principalName: "",
    recoverWay: 1
  };
  private importLoading: any = false;
  private rules: any = {
    delegationDate: [
      { required: true, message: "请选择委案日期", trigger: "blur" }
    ],
    closeDate: [{ required: true, message: "请选择到期日期", trigger: "blur" }]
  };
  private dataName: any = [];
  private templateNameList: any = [];
  private fileList: any = [];
  mounted() {
    this.getDataList();
    this.caseDataChange();
    this.importModel.companyCode = this.companyCode
  }
  close() {
    let upload: any = this.$refs["upload_case_import"];
    upload.reset();
    this.$emit("close");
    let dataform: any = this.$refs["data-form"];
    dataform.resetFields();
  }
  checkCompany() {
    if (this.isSupperAdmin) {
      if (this.importModel.companyCode === "") {
        this.$message("请输入公司名称");
        return false;
      } else {
        this.getDataList();
      }
    } else {
      this.getDataList();
    }
  }
  /**
   * 获取委托方
   */
  getDataList() {
    this.principalService
      .getPrincipalList(
        this.userData.companyCode || this.importModel.companyCode
      )
      .subscribe(
        data => {
          this.dataName = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 通过委托方获取模板名
   */
  getTemplateName() {
    this.importModel.templateId = "";
    if (this.importModel.id === "") {
      return;
    }
    let currentArr = this.principalList.find(v => v.id === this.importModel.id);
    this.importModel.principalId = currentArr.code;
    this.importModel.principalName = currentArr.name;
    this.accImportExcelDataService
      .getExcelTempleByPrincipalName({
        principalName: this.importModel.principalName
      })
      .subscribe(
        data => {
          this.templateNameList = data.map(v => {
            return {
              templateName: v.templateName,
              id: v.id
            };
          });
        },
        err => {
          this.$message.error(err.msg);
        }
      );
  }
  get templateShow() {
    if (this.templateNameList.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  submit() {
    if (this.fileList.length === 0) {
      this.$message("请上传导入文件");
      return;
    }
    if (!this.importModel.id) {
      this.$message("请选择委托方");
      return;
    }
    this.importLoading = true;
    // 存储文件ID
    this.importModel.fileId = this.fileList[0].response.id;
    let dataForm: any = this.$refs["data-form"];
    dataForm.validate(valid => {
      if (!valid) {
        return;
      }
      this.submitLoading = true;
      this.importLoading = true;
      this.$message.success("案件正在导入,导入结果请关注消息列表");
      this.dataInfoExcelService.importExcelData(this.importModel).subscribe(
        data => {
          this.submitLoading = false;
          if (data.rowErrorList && data.rowErrorList.length) {
            this.$message("案件导入失败");
            this.$emit("errSeriousMsg", data);
            return;
          }
          this.importLoading = false;
          this.submitLoading = false;
          this.$emit("success");
          this.close();
        },
        err => {
          this.submitLoading = false;
          this.$message.error(err.msg);
          this.importLoading = false;
        }
      );
    });
  }
  caseDataChange() {
      let delegationDate = new Date();
      let closeDate:any = new Date(delegationDate.setMonth(delegationDate.getMonth() + 3));
      this.importModel.delegationDate = FilterService.dateFormat(new Date())
      this.importModel.closeDate = FilterService.dateFormat(closeDate)
  }
}
</script>

<style scoped>
.group {
  margin-bottom: 0px !important;
  margin-top: 5px;
}
</style>
