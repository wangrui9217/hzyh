<template>
  <section class="component inrush-case-info">
    <data-grid :totalSpan="10" labelAlign="right" contentAlign="left">
      <data-grid-item label="案件数量：" :span="2">{{batchInfo.caseNum}}</data-grid-item>
      <data-grid-item label="案件总金额：" :span="2">{{batchInfo.caseAmt | toThousands}}</data-grid-item>
      <data-grid-item label="已催回案件数：" :span="2">{{batchInfo.endCaseNum}}</data-grid-item>
      <data-grid-item label="已催回案件金额：" :span="2">{{batchInfo.endCaseAmt | toThousands}}</data-grid-item>
      <data-grid-item label="剩余委托天数：" :span="2">{{batchInfo.leftDays}}</data-grid-item>
    </data-grid>
    <data-form ref="data-form" class="batch-case-form" :model="caseInfoModel" @onSearch="refreshData">
      <template slot="default-input">
        <el-form-item label="客户姓名" prop="personalName">
          <el-input v-model="caseInfoModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo">
          <el-input v-model="caseInfoModel.mobileNo"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amtRange">
          <number-range v-model="caseInfoModel.amtRange"></number-range>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportfollowRecordClick">导出跟进记录</el-button>
        <el-button @click="dialog.caseAllot = checkSelection()">重新分配</el-button>
        <el-button @click="dialog.recovery = checkSelection()">回收案件</el-button>
        <el-button @click="dialog.verifyVisual = checkSelection()">核销</el-button>
        <el-button @click="withDrawClick">撤销分配</el-button>
      </template>
    </data-form>
    <data-box :data="caseInfoDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column label="身份证号" :min-width="$helper.getColumnWidth(6)" prop="idCard">
        </el-table-column>
        <el-table-column label="逾期金额" prop="overdueAmount" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="deptName" label="催收部门" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.collectorName?scope.row.collectorName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectionStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionStatus| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.payStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="delegationDate" label="委案日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{(scope.row.delegationDate?scope.row.delegationDate: '')|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="closeDate" label="到期日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{(scope.row.closeDate?scope.row.closeDate: '')|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupBack" label="催收反馈"  :min-width="$helper.getColumnWidth(8)" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.followupBack===90">
              <p class="text-left">还款金额: {{ scope.row.promiseAmt===null?scope.row.promiseAmt: '' }}元</p>
              <p class="text-left">还款日期: {{ (scope.row.promiseTime?scope.row.promiseTime : '')|dateFormat}}</p>
              <template slot="reference" class="name-wrapper">
                <el-button type="text" style="color:green">{{scope.row.followupBack | dictConvert}}</el-button>
              </template>
            </el-popover>
            <span v-else>{{scope.row.followupBack | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realPayAmount" label="回款金额" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.realPayAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进记录" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button @click="followObj = scope.row;dialog.followRecord = true" type="text">查看</el-button>
          </template>
          <!--数据列区域-END-->
        </el-table-column>
      </template>
    </data-box>
    <div class="text-left">
      此页面不包含已结案的案件，已结案的案件请在已结案案件菜单查看。
    </div>
    <!--查看跟进记录-->
    <el-dialog :center="true" :visible.sync="dialog.followRecord" append-to-body width="80%">
      <follow-record :caseNumber="followObj.caseNumber"></follow-record>
    </el-dialog>
    <!--核销申请-->
    <el-dialog title="核销申请" :center="true" :visible.sync="dialog.verifyVisual" append-to-body width="30%">
      <verification @close="dialog.verifyVisual=false" @refresh="refreshData"></verification>
    </el-dialog>
    <!--回收案件-->
    <el-dialog title="回收原因" :center="true" :visible.sync="dialog.recovery" @refresh="refreshData" append-to-body width="30%">
      <recovery-case @close="dialog.recovery=false" @refresh="refreshData"></recovery-case>
    </el-dialog>

    <!--选择催收机构或催收员-->
    <el-dialog :title="changeTitle" :center="true" :visible.sync="dialog.caseAllot" append-to-body width="80%" >
      <case-allot ref="case-allot" @parentTitle="parentTitle" @close="dialog.caseAllot = false" @success="refreshData();dialog.caseAllot = false"></case-allot>
    </el-dialog>

  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit, Watch, Prop } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { caseType, caseState } from "~/config/enum.config";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { CaseInfoVerificationService } from "~/services/business-service/case-info-verification.service";
import { CaseReturnService } from "~/services/business-service/case-return.service";
import { ExportFollowupService } from "~/services/report-service/export-followup.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import NumberRange from "~/components/common/number-range.vue";
import Verification from "~/components/inrushcase-manage/inrush-case-info/verification.vue";
import RecoveryCase from "~/components/inrushcase-manage/inrush-case-info/recovery-case.vue";
import CaseAllot from "~/components/case-info/case-allot.vue";

const inrushCaseModule = namespace("inrush-case");

@Component({
  components: {
    DataForm,
    DataBox,
    FollowRecord,
    NumberRange,
    Verification,
    RecoveryCase,
    DataGrid,
    DataGridItem,
    CaseAllot
  }
})
export default class InrushCaseInfo extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(ExportFollowupService)
  private exportFollowupService: ExportFollowupService;
  @Dependencies(CaseInfoVerificationService)
  private caseInfoVerificationService: CaseInfoVerificationService;
  @Dependencies(CaseReturnService) private caseReturnService: CaseReturnService;

  @State userData: any;
  @inrushCaseModule.Mutation updateSelectedCase;
  @inrushCaseModule.Mutation updateSelectedList;

  //获取案件信息包括批次号
  @Prop() batchInfo: any;

  @Emit("refresh")
  refresh() {}

  @Emit("redistribute")
  redistribute() {}

  private caseInfoDataSet = null;
  private changeTitle: any = "请选择催收员";
  private selectionList: any = [];
  private followObj: any = {};
  private applyReasonInfo: any = "";
  private caseRowData: any = {};
  private returnReason: any = "";
  private caseInfoModel: any = {};
  private dialog: any = {};

  private caseIds: string[] = [];

  created() {
    this.dialog = {
      followRecord: false,
      verifyVisual: false,
      reAllocate: false,
      recovery: false,
      caseAllot: false
    };
    this.caseInfoModel = {
      personalName: "",
      mobileNo: "",
      batchNumber: "",
      collectionType: [caseType.call, caseType.visit, caseType.complex].join(
        ","
      ), // '15,16,217',
      collectionStatusList: this.getCollectionStatusList(),
      amtRange: {
        min: "",
        max: ""
      }
    };
  }

  getCollectionStatusList() {
    return [
      caseState.waitCollection,
      caseState.collection,
      caseState.overPaying,
      caseState.earlyPaying,
      caseState.waitForDis,
      caseState.repaid,
      caseState.partRepaid
    ].join(",");
  }

  refreshData() {
    this.caseInfoModel.batchNumber = this.batchInfo.batchNumber;
    this.caseInfoInquiryService
      .getInnerCaseInfoByCondition(this.caseInfoModel, this.pageService)
      .subscribe(
        data => (this.caseInfoDataSet = data),
        err => this.$message.error(err.msg)
      );
  }

  checkSelection() {
    if (this.selectionList.length === 0) {
      this.$message("请选择案件！");
      return false;
    } else {
      this.caseIds = this.selectionList.map(v => v.caseId);
      this.updateSelectedCase(this.caseIds, this.selectionList);
      this.updateSelectedList(this.selectionList);
      return true;
    }
  }
  parentTitle(val) {
    switch (val) {
      case 1:
        this.changeTitle = "请选择催收员";
        break;
      case 0:
        this.changeTitle = "请选择机构";
        break;
      default:
        this.changeTitle = "请选择催收员";
    }
  }
  resetForm() {
    let dataform: any = this.$refs["data-form"];
    dataform.resetForm();
  }
  /**
   * 导出跟进记录
   */
  exportfollowRecordClick() {
    if (this.checkSelection()) {
      let exportModel: any = {
        caseNumberList: this.selectionList.map(v => v.caseNumber),
        type: 0,
        companyCode: this.userData.companyCode,
        batchNumberList: [this.batchInfo.batchNumber]
      };
      this.exportFollowupService
        .exportFollowupRecord(exportModel)
        .subscribe(
          data => this.$message.success("操作成功，请关注任务中心！"),
          err => this.$message.error(err.msg)
        );
    }
  }
  /**
   * 撤销分配
   */
  withDrawClick() {
    if (this.checkSelection()) {
      this.caseInfoService
        .revertCaseInfoDistributeByCaseId(this.caseIds)
        .subscribe(
          data => {
            this.$message.success("撤销成功");
            this.refreshData();
          },
          err => this.$message.error(err.msg)
        );
    }
  }
}
</script>
<style lang="less" scoped>
.batch-case-form {
  margin-top: 30px;
}
</style>
