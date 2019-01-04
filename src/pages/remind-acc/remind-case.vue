<template>
  <section class="page remind-case">
    <data-form :model="incollectionModel" @onSearch="refreshData" :rules="inrushRule">
      <template slot="default-input">
        <el-form-item label="客户姓名" prop="personalName" v-auth="1393">
          <el-input v-model="incollectionModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="1394">
          <el-input v-model="incollectionModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
        <!--<el-form-item label="订单号" prop="orderId" v-auth="1395">-->
        <!--<el-input v-model="incollectionModel.orderId"></el-input>-->
        <!--</el-form-item>-->
      </template>
      <template slot="collapse-input">
        <!--<el-form-item label="委案日期" prop="delegationDate" v-auth="1396">-->
        <!--<el-date-picker class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="incollectionModel.delegationDate"-->
        <!--placeholder="请选择日期" clearable>-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="到期日期" prop="closeDate">-->
        <!--<el-date-picker class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="incollectionModel.closeDate"-->
        <!--placeholder="请选择日期" clearable>-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="逾期金额" prop="amtRange" v-auth="1397">
          <number-range v-model="incollectionModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="门店" prop="shopDeptId" v-auth="1398">
          <el-select v-model="incollectionModel.shopDeptId" placeholder="请选择" clearable>
            <el-option v-for="{name,id} in storeList" :key="id" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays" v-auth="1386">
          <number-range v-model="incollectionModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="reAllocateClick" v-auth="1399">重新分配</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :selectionList.sync="selectionList" :data="incollectionDataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" @click="followObj=scope.row;dialog.detail=true">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column label="逾期金额" prop="overdueAmt" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueAmt|toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="busDeptName" label="催收部门" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="compId" label="门店" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="shopDeptName" label="业务部门" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="telCollector" label="电话催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="telLeaveCaseFlag" label="电催留案标识" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.leaveCaseFlag=='0'">非留案</span>
            <span v-if="scope.row.leaveCaseFlag=='1'">留案</span>
          </template>
        </el-table-column>
        <el-table-column prop="telFollowupBack" label="电催催收反馈" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.telFollowupBack===90">
              <p class="text-left">还款金额: {{ scope.row.telPromiseAmt}}元</p>
              <p class="text-left">还款日期: {{ (scope.row.telPromiseTime?scope.row.telPromiseTime : '')|dateFormat}}</p>
              <template slot="reference" class="name-wrapper">
                <el-button type="text" style="color:green">{{scope.row.telFollowupBack | dictConvert}}</el-button>
              </template>
            </el-popover>
            <span v-else>{{scope.row.telFollowupBack | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outBoundCollector" label="外访催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="outLeaveCaseFlag" label="外访留案标识" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.leaveCaseFlag=='0'">非留案</span>
            <span v-if="scope.row.leaveCaseFlag=='1'">留案</span>
          </template>
        </el-table-column>
        <el-table-column prop="outFollowupBack" label="外访催收反馈" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.outFollowupBack===90">
              <p class="text-left">还款金额: {{ scope.row.outPromiseAmt}}元</p>
              <p class="text-left">还款日期: {{ (scope.row.outPromiseTime?scope.row.outPromiseTime : '')|dateFormat}}</p>
              <template slot="reference" class="name-wrapper">
                <el-button type="text" style="color:green">{{scope.row.outFollowupBack | dictConvert}}</el-button>
              </template>
            </el-popover>
            <span v-else>{{scope.row.outFollowupBack | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进记录" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button @click=" followObj = scope.row;dialog.followRecord = true" type="text" v-auth="1400">查看</el-button>
          </template>
          <!--数据列区域-END-->
        </el-table-column>
      </template>
    </data-box>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="followObj.caseId"></case-detail>
    </el-dialog>
    <!--查看案件明细-->
    <el-dialog :center="true" :visible.sync="dialog.checkCaseInfo" @open="checkinfoOpen" width="80%">
      <div style="font-weight:bold;font-size:16px;margin-bottom:20px;text-align:center">{{CaseRowData.batchNumber}}批次案件明细</div>
      <div class="text-left">案件数量：
        <span style="margin-right:30px">{{CaseRowData.caseNum}}</span>案件总金额：
        <span style="margin-right:30px">{{CaseRowData.caseAmt}}</span>已催回案件数：
        <span style="margin-right:30px">{{CaseRowData.endCaseNum}}</span>已催回案件金额：
        <span style="margin-right:30px">{{CaseRowData.endCaseAmt}}</span>剩余委托天数：
        <span>{{CaseRowData.leftDays}}</span>天
      </div>
      <inrush-case-info ref="check-case-info" @refresh="refreshData()"></inrush-case-info>
    </el-dialog>
    <!--设置导出项-->
    <el-dialog title="设置导出项" :visible.sync="dialog.setExportItems" width="50%" :center="true">
      <set-export-items ref="set-export-items" :allData="allData" :category="category" @close="dialog.setExportItems=false" :exportVeidoo="exportVeidoo"></set-export-items>
    </el-dialog>
    <el-dialog title="选择催收员" :center="true" :visible.sync="dialog.reAllocate" width="80%">
      <inrush-redistribute @user="dialog.userReallocate=true" @org="dialog.orgReallocate=true" @close="dialog.reAllocate=false"></inrush-redistribute>
    </el-dialog>
    <!--分配给用户-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.userReallocate" width="80%" @open="userOpen">
      <redistributed-user @preStep="dialog.userReallocate=false" @cancel="dialog.userReallocate=false" @success="dialog.userReallocate=false;dialog.reAllocate=false;refreshData()" ref="user-allocate"></redistributed-user>
    </el-dialog>
    <!--分配给机构-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.orgReallocate" width="80%" @open="orgOpen">
      <redistributed-org @preStep="dialog.orgReallocate=false" @cancel="dialog.orgReallocate=false" @success="dialog.orgReallocate=false;dialog.reAllocate=false;refreshData()" ref="org-allocate"></redistributed-org>
    </el-dialog>
    <!--查看跟进记录-->
    <el-dialog :center="true" :title="followObj.caseNumber+'案件跟进明细'" :visible.sync="dialog.followRecord" append-to-body width="90%">
      <follow-record :caseNumber="followObj.caseNumber"></follow-record>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {  Auth,  Layout,  Dependencies} from "~/core/decorator";
import {  State} from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import {  PageService} from "~/utils/page.service";
import {  CaseInfoReportService} from "~/services/report-service/case-info-report.service";
import {  CaseInfoInquiryService} from "~/services/report-service/case-info-inquiry.service";
import {  CaseInfoService} from "~/services/business-service/case-info.service";
import {  ExportFollowupService} from "~/services/report-service/export-followup.service";
import {  CaseReturnService} from "~/services/business-service/case-return.service";
import {  CaseInfoVerificationService} from "~/services/business-service/case-info-verification.service";
import {  CaseInfoJudicialService} from "~/services/business-service/case-info-judicial.service";
import InrushCaseInfo from "~/components/inrushcase-manage/inrush-case-info.vue";
import SetExportItems from "~/components/inrushcase-manage/set-export-items.vue";
import InrushRedistribute from "~/components/inrushcase-manage/inrush-redistribute.vue";
import RedistributedUser from "~/components/inrushcase-manage/redistributed-user.vue";
import RedistributedOrg from "~/components/inrushcase-manage/redistributed-org.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import NumberRange from "~/components/common/number-range.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";

@Auth(1116)
@Layout('workspace')
@Component({
  components: {
    CaseDetail,
    DataForm,
    DataBox,
    InrushCaseInfo,
    SetExportItems,
    InrushRedistribute,
    RedistributedUser,
    RedistributedOrg,
    FollowRecord,
    NumberRange
  }
})
export default class RemindCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoReportService) private caseInfoReportService: CaseInfoReportService;
  @Dependencies(CaseInfoInquiryService) private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(ExportFollowupService) private exportFollowupService: ExportFollowupService;
  @Dependencies(CaseReturnService) private caseReturnService: CaseReturnService;
  @Dependencies(CaseInfoVerificationService) private caseInfoVerificationService: CaseInfoVerificationService;
  @Dependencies(CaseInfoJudicialService) private caseInfoJudicialService: CaseInfoJudicialService;

  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @State storeList: any;

  private incollectionModel: any = {};
  private incollectionDataSet: Array<any> = [];
  private selectionList: any = [];
  private multipleSelection: any = [];
  private dialog: any = {};
  private CaseRowData: any = {};
  private allData: any;
  private category: any = '';
  private exportVeidoo: any = 4;
  private followObj: any = {};
  private returnReason: any = '';
  private applyReasonInfo: any = '';
  private judicialInfo: any = '';
  private outsourceCloseDate: any = '';
  // 表单验证规则
  private inrushRule = {
    mobileNo: [{
      validator: this.$validator.phoneNumber,
      trigger: "blur"
    }]
  };
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false
    }
  }
  created() {
    this.dialog = {
      checkCaseInfo: false,
      setExportItems: false,
      userReallocate: false,
      orgReallocate: false,
      reAllocate: false,
      followRecord: false,
      detail: false
    }
    this.allData = {
      basicOptions: ['客户姓名', '身份证号', '省份', '城市', '手机号码', '身份证户籍地址', '家庭住址', '固定电话'],
      workOptions: ['工作单位名称', '工作单位地址', '工作单位电话'],
      contactOptions: ['姓名', '手机号码', '住宅电话', '现居住地址', '与客户关系', '工作单位', '单位电话'],
      caseInfoOptions: ['产品系列', '合同编号', '贷款日期', '合同金额', '剩余本金(元)', '剩余利息(元)', '逾期总金额(元)', '逾期本金(元)', '逾期利息(元)',
        '逾期罚息(元)', '还款期数', '每期还款金额(元)', '其他费用(元)', '逾期日期', '逾期天数',
        '已还款金额(元)', '已还款期数', '最近还款日期', '最近还款金额(元)', '佣金比例(%)'
      ],
      openAccountOptions: ['客户还款卡银行', '客户还款卡号'],
      followAccountOptions: ['跟进时间', '跟进方式', '催收对象', '姓名', '电话/地址', '催收反馈', '跟进记录', '跟进人员']
    }
    this.incollectionModel = {
      personalName: '',
      principalId: '',
      mobileNo: '',
      leftDueDays: '', //即将到期天数
      orderId: '',
      delegationDate: '',
      closeDate: '',
      amtRange: {
        min: "",
        max: ""
      },
      overdueDays: { min: "", max: "" },
      overDuePayStatus: 'M0',
      shopDeptId: ''
    }
  }
  activated() { }
  mounted() {
    this.refreshData()
  }
  refreshData() {
    this.caseInfoInquiryService.getInnerCaseInfoByCondition(this.incollectionModel, this.pageService).subscribe(
      data => {
        this.incollectionDataSet = data;
      }, ({
          msg
        }) => {
        this.$message({
          type: 'error',
          message: msg
        })
      });
  }
  /**
   * 导出跟进记录
   */
  exportfollowRecordClick() {
    let caseNumberList = this.selectionList.map(v => {
      return v.caseNumber
    })
    let exportModel: any = {
      caseNumberList: caseNumberList,
      type: 0,
      companyCode: this.userData.companyCode
    }
    this.exportFollowupService.exportFollowupRecord(exportModel).subscribe(data => {
      this.$message({
        type: 'info',
        message: '开始导出'
      })
    }, ({
        msg
      }) => {
        this.$message({
          type: 'error',
          message: msg
        })
      });
  }
  /**
   * 查看案件明细
   */
  checkCaseInfoClick(row) {
    this.dialog.checkCaseInfo = true;
    this.CaseRowData = row;
  }
  /**
   * 打开案件明细
   */
  checkinfoOpen() {
    this.$nextTick(() => {
      let checkCaseInfo: any = this.$refs['check-case-info'];
      checkCaseInfo.refreshData(this.CaseRowData)
    })
  }
  /**
   * 设置导出项
   */
  setExportItemsClick() {
    this.dialog.setExportItems = true;
    this.category = 1
    this.$nextTick(() => {
      let setExportItems: any = this.$refs['set-export-items'];
      setExportItems.checkExportItems()
    })
  }
  /**
   * 重新分配
   */
  reAllocateClick() {
    if (this.selectionList.length === 0) {
      this.$message({
        type: 'info',
        message: '请选择案件！'
      })
      return;
    }
    this.dialog.reAllocate = true
    // this.redistribute(this.selectionList)
  }
  /**
   * 分配给催收员open
   */
  userOpen() {
    this.$nextTick(() => {
      let userAllocate: any = this.$refs['user-allocate'];
      userAllocate.refreshData(this.selectionList)
    })
  }
  /**
   * 分配给机构
   */
  orgOpen() {
    this.$nextTick(() => {
      let orgAllocate: any = this.$refs['org-allocate'];
      orgAllocate.refreshData(this.selectionList)
    })
  }
}

</script>

<style lang="less" scoped>
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.btns {
  margin-top: 20px;
}
</style>
