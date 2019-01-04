<template>
  <section class="page introduction-case">
    <data-form :model="introductionModel" @onSearch="refreshData" :rules="introductionRule" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="introductionModel.companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5379">
          <el-input v-model="introductionModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5380">
          <el-input v-model="introductionModel.mobileNo"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="批次号" prop="batchNumber" v-auth="5381">
          <el-input v-model="introductionModel.batchNumber"></el-input>
        </el-form-item>
        <div class="inline-box">
          <el-form-item label="逾期天数" prop="overDueDays" v-auth="5382">
            <number-range v-model="introductionModel.overDueDays" :isInteger="true"></number-range>
          </el-form-item>
        </div>
        <div class="inline-box">
          <el-form-item label="逾期金额" prop="overdueAmount" v-auth="5383">
            <number-range v-model="introductionModel.overdueAmount"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="委托方" prop="prinName" v-auth="5384">
          <el-select v-model="introductionModel.prinName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" prop="color" v-auth="5385">
          <el-select v-model="introductionModel.color" placeholder="请选择" clearable>
            <el-option label="无色" :value="0"></el-option>
            <el-option label="黄色" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <!--按钮区域-->
        <el-button @click="importClick" v-auth="5386">案件导入</el-button>
        <el-button :disabled="!isImported" @click="fileImportClick" v-auth="5387">附件导入</el-button>
        <el-button :disabled="!isImported" @click="checkCaseFile" v-auth="5388">案件确认</el-button>
        <el-button :disabled="!isImported" @click="dialog.deleteImport = true,deleteImport.batchNumber='',deleteImport.companyCode=''" v-auth="5389">案件删除</el-button>
        <el-button :disabled="!isImported" @click="dialog.chooseBatchNumber = true,deleteImport.batchNumber='',deleteImport.companyCode='',deleteImport.flag='error'" v-auth="5390">导出错误报告</el-button>
        <el-popover placement="bottom" v-model="dialog.visible">
          <div style="text-align: center;">
            <el-button type="text"  @click="dialog.visible=false,downloadOrdinaryTemplate()">普通案件模板</el-button>
            <!-- <el-button type="text" @click="dialog.visible=false,downloadStopAndSpecialTemplate()">特殊/停催案件模板</el-button> -->
          </div>
          <el-button slot="reference" type="text" v-auth="5391">下载模板</el-button>
        </el-popover>
      </template>
    </data-form>
    <data-box :rowClass="rowClass" :data="introductionDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns" class="haha">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" @click="openCaseDetail(scope)">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="prinName" label="委托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="caseStatus" label="案件状态" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="paymentStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overDueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="productSeriesName" label="产品类型" sortable='custom' :min-width="$helper.getColumnWidth(4)" >
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" sortable='custom' :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount " label="逾期金额(元)" :min-width="$helper.getColumnWidth(6)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount |toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorTime" label="导入日期" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button type="text" @click="importCaseFile(scope.row)" v-auth="5392">导入附件</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>

    <!--案件导入弹出框-->
    <el-dialog title="案件导入" width="600px" :visible.sync="dialog.caseExcelImport" @open="importOpen" @close="importClose" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <CaseExcelImport ref="case-excel-import" @close="dialog.caseExcelImport = false" @errMsg="errMsgShow" @errSeriousMsg="excelSeriousError" @success="importSucc"></CaseExcelImport>
    </el-dialog>
    <!--对应文件-->
    <el-dialog title="附件导入" :visible.sync="dialog.multipleFileImport" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <case-file-import ref="case-file-upload" :selected="selectedItem" @close="dialog.multipleFileImport = false"></case-file-import>
    </el-dialog>

    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen @open="refreshCaseDetail">
      <el-card>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="客户信息" name="cust-info">
            <cust-info ref="cust-info"></cust-info>
          </el-tab-pane>
          <el-tab-pane label="还款信息" name="pay-info">
            <pay-info  ref="pay-info"></pay-info>
          </el-tab-pane>
          <el-tab-pane label="附件信息" name="attach-info">
            <attach-info  ref="attach-info"></attach-info>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-dialog>

    <!--附件导入弹出框-->
    <el-dialog title="附件导入"  :visible.sync="dialog.fileImport" @open="openFileImport" width="60%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <case-file-import @close="dialog.fileImport = false"></case-file-import>
    </el-dialog>
    <!--选择案件批次-->
    <el-dialog title="选择案件批次" :visible.sync="dialog.chooseBatchNumber" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" class="text-left" :model="deleteImport" style="margin-bottom:20px">
        <el-form-item label="公司名称" prop="companyCode" style="width:350px;margin:auto" v-show="isSupperAdmin">
          <el-select placeholder="请选择" v-model="deleteImport.companyCode" @change="changeCompanyCode">
            <el-option v-for="item in companyName" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" style="width:350px;margin:auto">
          <el-select placeholder="请选择" v-model="deleteImport.batchNumber">
            <el-option v-for="item in batchList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="dialog.chooseBatchNumber = false">取消</el-button>
        <el-button @click="chooseBatchNumberConfirm(deleteImport.batchNumber, deleteImport.companyCode)">确定</el-button>
      </div>
    </el-dialog>
    <!--案件确认-->
    <el-dialog title="案件确认" :visible.sync="dialog.caseSubmit" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @close="refreshData()">
      <div style="padding-bottom:20px;">
        <el-form label-width="0" class="text-left">
          <el-form-item class="text-center">
            是否确认提交案件
          </el-form-item>
          <el-form-item v-if="checkResult&&checkResult.length>0">
            <data-box :data="checkResult" :max-height="400">
              <template slot="columns">
                <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(3)">
                  <template slot-scope="scope">
                    <span>{{scope.row.caseNumber}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(3)">
                </el-table-column>
                <el-table-column prop="msg" label="备注" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip="">
                </el-table-column>
              </template>
            </data-box>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button @click="dialog.caseSubmit = false">取消</el-button>
          <el-button @click="caseSubmit" :loading="submitLoading">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!--案件删除弹出框-->
    <el-dialog title="案件删除" :visible.sync="dialog.deleteImport" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" class="text-left">
        <el-form-item label="公司名称" prop="companyCode" style="width:350px;margin:auto" v-show="isSupperAdmin">
          <el-select placeholder="请选择" v-model="deleteImport.companyCode" @change="changeCompanyCode">
            <el-option v-for="item in companyName" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次号" prop="cupoBatch" style="width:350px;margin:auto">
          <el-select placeholder="请选择" v-model="deleteImport.batchNumber">
            <el-option v-for="item in batchList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0" class="text-center">
          <span>确定要删除此批次案件吗?</span>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" style="margin-top:10px">
        <el-button @click="dialog.deleteImport = false">取消</el-button>
        <el-button @click="deleteCase" :loading="submitLoading">确定</el-button>
      </el-row>  
    </el-dialog>
    <!--EXCEL错误弹出框-->
    <el-dialog title="错误提示" :visible.sync="dialog.errMsgOpen" @open="excelErrorMessageOpen" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <excel-error-message ref="excelErrorMessage" @close="dialog.errMsgOpen=false"></excel-error-message>
    </el-dialog>

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Action, namespace, Getter } from "vuex-class";
import NumberRange from "~/components/common/number-range.vue";
import CaseExcelImport from "~/components/case-import/introduction-case/case-ecxel-import.vue";
import { PageService } from "~/utils/page.service";
import { DataInfoExcelService } from "~/services/dataimp-service/data-info-excel.service";
import CustInfo from "~/components/case-import/introduction-case/cust-info.vue";
import PayInfo from "~/components/case-import/introduction-case/pay-info.vue";
import AttachInfo from "~/components/case-import/introduction-case/attach-info.vue";
import CaseFileImport from "~/components/case-import/introduction-case/case-file-import.vue";
import ExcelErrorMessage from "~/components/case-import/introduction-case/excel-error-message.vue";
import { CommonService } from "~/utils/common.service";

const caseManageModule = namespace("case-manage");
@Auth(399)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    CaseExcelImport,
    CaseFileImport,
    ExcelErrorMessage,
    CustInfo,
    PayInfo,
    AttachInfo
  }
})
export default class IntroductionCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(DataInfoExcelService)
  private dataInfoExcelService: DataInfoExcelService;
  @State companyList: any;
  @State companyName: any;
  @State userData: any;
  @State principalList: any;
  @Getter isSupperAdmin: boolean;
  @caseManageModule.State batchList;
  @caseManageModule.State importSuccess;
  @caseManageModule.Action getBatchList;
  @Watch("importSuccess")
  onImportSuccess() {
    this.refreshData();
  }
  private dialog: any = {
    caseExcelImport: false,
    multipleFileImport: false,
    detail: false,
    fileImport: false,
    chooseBatchNumber: false,
    caseSubmit: false,
    deleteImport: false,
    errMsgOpen: false,
    visible: false
  };
  private rowClass: any = scope => {
    if (scope.row.color === 2) {
      return "error-row";
    }
    return "";
  };
  private selectedItem: any = {};
  private caseDetail: any = "";
  private introductionModel: any = {
    custName: "",
    caseAmt: "",
    overDueDays: ["", ""], // 逾期天数
    overdueAmount: ["", ""], // 案件金额
    batchNumber: "",
    prinName: "",
    cupoName: "",
    cupoStatus: "",
    cupoGettime: "",
    companyCode: "",
    personalName: "",
    mobileNo: "",
    color: "",
    dayRange: "",
    caseMoney: "",
    caseMark: ""
  };
  private deleteImport: any = {
    batchNumber: "",
    id: "",
    companyCode: "",
    flag: "" // 错误信息error,案件确认confirm
  };
  private introductionDataSet = null;
  private introductionRule = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  private companyCode: any = "";
  private checkResult: any = [];
  private activeName = "cust-info";
  private submitLoading: Boolean = false;
  get isImported() {
    return this.batchList.length > 0;
  }
  mounted() {
    if (!this.isSupperAdmin) {
      this.introductionModel.companyCode = this.userData.companyCode;
    }
    this.refreshData();
  }
  actived() {
    this.refreshData();
  }
  importSucc() {
    setTimeout(() => {
      this.refreshData();
    }, 1000);
  }
  refreshData() {
    this.dataInfoExcelService
      .getDataInfoExcelList(this.introductionModel, this.pageService)
      .subscribe(
        data => {
          this.introductionDataSet = data;
          this.getBatchList(this.introductionModel.companyCode);
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  importClick() {
    this.dialog.caseExcelImport = true;
  }
  importOpen() {
    document.documentElement.style.overflow = "hidden";
    this.$nextTick(() => {
      let excelImport: any = this.$refs["case-excel-import"];
      excelImport.getDataList();
    });
  }
  importClose() {
    this.refreshData();
    document.documentElement.style.overflow = "auto";
  }
  /**
   * 错误信息弹出
   */
  errMsgShow(batchNumber, companyCode) {
    this.deleteImport.batchNumber = batchNumber;
    if (!this.deleteImport.batchNumber) {
      this.$message("请选择批次号");
      return;
    }
    this.dialog.chooseBatchNumber = false;
    if (companyCode) {
      this.deleteImport.companyCode = companyCode;
    }
    this.dialog.errMsgOpen = true;
  }
  /**
   * 打开严重错误信息弹框
   */
  excelSeriousError() {}
  /**
   * 导入附件
   */
  importCaseFile(data) {
    this.selectedItem = data;
    this.dialog.multipleFileImport = true;
  }
  openCaseDetail(scope) {
    this.caseDetail = scope.row;
    this.dialog.detail = true;
  }
  fileImportClick() {
    if (this.isSupperAdmin) {
      if (this.introductionModel.companyCode === "") {
        this.$message({
          type: "info",
          message: "请输入公司名称"
        });
        return false;
      } else {
        this.dialog.fileImport = true;
      }
    } else {
      this.dialog.fileImport = true;
    }
  }
  openFileImport() {
    if (this.introductionModel.companyCode) {
      this.getBatchList(this.introductionModel.companyCode);
    } else {
      this.getBatchList(this.userData.companyCode);
    }
  }
  /**
   * 案件确认
   */
  checkCaseFile() {
    this.dialog.chooseBatchNumber = true;
    this.deleteImport.batchNumber = "";
    this.deleteImport.companyCode = "";
    this.deleteImport.flag = "confirm";
  }
  changeCompanyCode() {
    if (this.deleteImport.companyCode) {
      this.getBatchList(this.deleteImport.companyCode);
    } else {
      this.getBatchList(this.userData.companyCode);
    }
  }
  /**
   * 选择批次号确认
   */
  chooseBatchNumberConfirm(batchNumber, companyCode) {
    if (!this.deleteImport.batchNumber) {
      this.$message("请选择批次号！");
    } else {
      if (this.deleteImport.flag === "error") {
        this.errMsgShow(batchNumber, companyCode);
      } else if (this.deleteImport.flag === "confirm") {
        this.caseConfirm(batchNumber, companyCode);
      }
    }
  }
  /**
   * 案件确认选择批次号确认
   */
  caseConfirm(batchNumber, companyCode) {
    this.dialog.chooseBatchNumber = false;
    this.dialog.caseSubmit = true;
    if (this.introductionModel.companyCode) {
      this.companyCode = this.introductionModel.companyCode;
    } else {
      this.companyCode = this.userData.code;
    }
    this.dataInfoExcelService
      .checkCasesFile({
        companyCode: this.companyCode,
        batchNumber: this.deleteImport.batchNumber
      })
      .subscribe(
        data => {
          this.checkResult = data;
          this.refreshData();
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   *案件确认
   */
  caseSubmit() {
    this.submitLoading = true;
    this.dataInfoExcelService
      .casesConfirmByBatchNum({
        companyCode: this.deleteImport.companyCode,
        batchNumber: this.deleteImport.batchNumber
      })
      .subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("导入成功");
          this.dialog.caseSubmit = false;
          setTimeout(() => {
            this.refreshData();
          }, 1000);
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
  }
  deleteCase() {
    if (this.deleteImport.batchNumber === "") {
      this.$message("请选择要删除的案件批次号！");
    } else {
      this.submitLoading = true;
      this.dataInfoExcelService
        .deleteCasesByBatchNum(this.deleteImport)
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("案件删除成功");
            this.refreshData();
            this.dialog.deleteImport = false;
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
          }
        );
    }
  }
  excelErrorMessageOpen() {
    this.$nextTick(() => {
      let excel: any = this.$refs["excelErrorMessage"];
      excel.refresh(this.batchList[0], this.deleteImport.companyCode);
    });
  }
  /**
   * 下载普通案件模板
   */
  downloadOrdinaryTemplate() {
    this.dataInfoExcelService.loadTemplate().subscribe(
      data => {
        CommonService.downloadFile(data, "普通案件模板");
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /*
   * 下载特殊/停催模板案件模板
   */
  downloadStopAndSpecialTemplate() {
    this.dataInfoExcelService.specialAndStopLoadTemplate().subscribe(
      data => {
        CommonService.downloadFile(data, "特殊/停催案件模板");
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 下载特殊/停催案件模板
   */
  downloadTemplate() {
    this.dataInfoExcelService.loadTemplate().subscribe(
      data => {
        CommonService.downloadFile(data, "案件导入模板");
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }

  /**
   * 刷新案件详情
   */
  refreshCaseDetail() {
    this.$nextTick(() => {
      let payInform: any = this.$refs["pay-info"];
      payInform.refresh({});
      let attachInform: any = this.$refs["attach-info"];
      attachInform.refresh([]);
      let custInform: any = this.$refs["cust-info"];
      custInform.refresh({});
      this.dataInfoExcelService
        .findUpload({ caseNumber: this.caseDetail.caseNumber })
        .subscribe(
          data => {
            if (data) {
              let att: any = this.$refs["attach-info"];
              att.refresh(data);
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      this.dataInfoExcelService
        .getDataInfoExcelDetails({ id: this.caseDetail.id })
        .subscribe(
          data => {
            if (data) {
              let pay: any = this.$refs["pay-info"];
              pay.refresh(data);
              let cust: any = this.$refs["cust-info"];
              cust.refresh(data);
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    });
  }
}
</script>

<style lang="less">
.page.introduction-case {
  .data-box {
    .error-row > td {
      color: #ff9813 !important;
      span {
        color: #ff9813 !important;
      }
    }
  }
}
</style>
