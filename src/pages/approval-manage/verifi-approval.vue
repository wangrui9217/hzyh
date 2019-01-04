<template>
  <section class="page verifi-approval">
    <data-form :model="verifiModel" @onSearch="refreshData" :page="pageService" :rules="verifiRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5261">
          <el-input v-model="verifiModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5262">
          <el-input v-model="verifiModel.mobileNo"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="身份证号" prop="idCard"  v-auth="5263">
          <el-input v-model="verifiModel.idCard" class="large"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber"  v-auth="5264">
          <el-input v-model="verifiModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="overdueAmount"  v-auth="5265">
          <number-range v-model="verifiModel.overdueAmount"></number-range>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays" v-auth="5266">
          <number-range v-model="verifiModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate" v-auth="5267">
          <el-date-picker v-model="verifiModel.applicationDate" class="daterange-large" type="daterange" placeholder="选择日期" :editable="false" range-separator="~">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="委托方" prop="principalName" v-auth="5268">
          <el-select v-model="verifiModel.principalName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态" prop="approvalStatus" v-auth="5269">
          <el-select v-model="verifiModel.approvalStatus" placeholder="请选择" clearable>
            <el-option label="待审批" value="222"></el-option>
            <el-option label="审核拒绝" value="221"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </data-form>
    <data-box @onPageChange="refreshData" :data="verifiDataSet" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作 " :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="repairObj = scope.row,dialog.approvalClick = true" type="text" v-show="scope.row.approvalStatus === 220||scope.row.approvalStatus===222" v-auth="5270">审批</el-button>
            <el-button @click="repairObj = scope.row,dialog.FollowRecord = true" type="text" v-auth="5271">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" @click="repairObj=scope.row;dialog.detail = true">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicationDate" sortable='custom' label="申请日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.applicationDate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalStatus" label="审批状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.approvalStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        
      </template>
    </data-box>
    <!--弹出框-->
    <el-dialog title="核销案件审批" :visible.sync="dialog.approvalClick" width="70%" @close="refreshData()" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <veri-case-approval :casePayApplyId="repairObj.id" ref="approvalDialog" @refresh="dialog.approvalClick=false"></veri-case-approval>
    </el-dialog>
    <!--查看案件明细的案件跟进记录-->
    <el-dialog :title="repairObj.caseNumber+'案件跟进明细'" width="90%" :visible.sync="dialog.FollowRecord" :center="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <FollowRecord :caseNumber="repairObj.caseNumber"></FollowRecord>
    </el-dialog>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="repairObj.caseId" ></case-detail>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { CaseInfoVerificationService } from "~/services/business-service/case-info-verification.service";
import { State, Getter } from "vuex-class";
import NumberRange from "~/components/common/number-range.vue";
import VeriCaseApproval from "~/components/approval-manage/verifi-approval/veri-case-approval.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";

@Auth(711)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    VeriCaseApproval,
    FollowRecord,
    CaseDetail
  }
})
export default class VerifiApproval extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoVerificationService)
  private caseInfoVerificationService: CaseInfoVerificationService;
  @Getter isSupperAdmin: boolean;
  @State principalList: any;
  @State userData: any;
  @State companyList: any;

  private verifiDataSet = null;
  private verifiRule = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
    idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
  };
  private verifiModel: any = {
    idCard: "", // 身份证号
    batchNumber: "", // 批次号
    overdueAmount: { min: "", max: "" }, // 案件金额
    overdueDays: { min: "", max: "" }, // 逾期天数
    // commissionRate: ['', ''], // 佣金比例
    applicationDate: "", // 申请日期
    approvalStatus: "", // 审批状态
    prinId: "",
    personalName: "",
    payType: "",
    approveResult: "",
    orapOrdernum: "",
    applyDerateAmt: ["", ""],
    deapId: "",
    mobileNo: "", // 手机号
    mobileNoX: "",
    orapPayStatus: "",
    orapDelay: "",
    orapApplyDate: "",
    orapEmpName: "",
    userId: "",
    orapName: "",
    companyCode: "",
    principalName: "" // 委托方
  };
  private repairObj: any = {};
  private dialog: any = {
    approvalClick: false,
    FollowRecord: false,
    detail: false
  };
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.verifiModel.companyCode = this.userData.companyCode;
    }
    return this.verifiModel.companyCode;
  }

  set companyCode(value) {
    this.verifiModel.companyCode = value;
  }

  refreshData() {
    this.caseInfoVerificationService
      .getCaseInfoVerificationApproval(this.verifiModel, this.pageService, {
        applicationDate: "desc"
      })
      .subscribe(
        data => {
          this.verifiDataSet = data;
        },
        err => {
          this.$message.error(err.msg);
        }
      );
  }
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
}
</script>

<style lang="less">
</style>
