<template>
  <section class="page call-assist-application">
    <data-form :model="assistModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="申请号"  prop="caseNumber">
          <el-input v-model="assistModel.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName">
          <el-input v-model="assistModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="applyRealName">
          <el-input v-model="assistModel.applyRealName"></el-input>
        </el-form-item>
        <el-form-item label="申请日期" prop="applyDate">
          <el-date-picker v-model="assistModel.applyDate" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="assistDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button @click="openRefresh(scope)" type="text" size="small">审批</el-button>
            <el-button type="text" size="small" @click="openApprovalRecord(scope)">审批记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="dialog.detail=true,assistObj=scope.row">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="personalPhone" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalPhone | encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="assistWay" label="协催方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.assistWay | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyRealName" label="申请人" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="applyInvalidTime" label="审批失效时间" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.applyInvalidTime|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate" label="申请日期" sortable='custom' :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.applyDate|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        
      </template>
    </data-box>
    <!--协催审批-->
    <el-dialog title="协催审批" :center="true" :visible.sync="dialog.approval" width="40%" @close="$refs['approval-form'].refresh()">
      <assist-approval @close="dialog.approval=false" @success="refreshData" ref="approval-form"></assist-approval>
    </el-dialog>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="assistObj.caseId"></case-detail>
    </el-dialog>
    <!--查看审批记录-->
    <el-dialog title="审批历史记录" :center="true" :visible.sync="dialog.approvalRecord" @open="getApprovalRecord">
      <show-approval-record ref="ShowApprovalRecord"></show-approval-record>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { SortService } from "~/utils/sort.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { CaseAssistApplyProcessService } from "~/services/business-service/case-assist-apply-process.service";
import { State, Getter } from "vuex-class";
import NumberRange from "~/components/common/number-range.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import AssistApproval from "~/components/approval-manage/assist-approval.vue";
import ShowApprovalRecord from "~/components/approval-manage/show-approval-record.vue";

@Auth(726)
@Layout("workspace")
@Component({
  components: {
    FollowRecord,
    DataForm,
    DataBox,
    NumberRange,
    CaseDetail,
    AssistApproval,
    ShowApprovalRecord
  }
})
export default class CallAssistApplication extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseAssistApplyProcessService)
  private caseAssistApplyProcessService: CaseAssistApplyProcessService;
  @Dependencies(SortService) private sortService: SortService;

  @State userData: any;
  @State companyList: any;
  @State principalList: any;
  @Getter isSupperAdmin: boolean;
  /**
   * 委托方过滤
   */
  getPrincipalList() {
    return this.principalList.filter(
      x => x.companyCode === this.assistModel.companyCode
    );
  }
  private dataName: any = []; //委托方
  private approvalObj: any = {};
  private assistModel: any = {
    caseNumber:"",
    personalName:"",
    applyRealName:"",
    applyDate:[]
  };
  private assistRule = {
    personalPhone: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  private approvalModel: any = {
    approveMemo: "",
    approveResult: ""
  };
  private approvalRules: any = {
    approveResult: {
      required: true,
      message: "请选择审批结果",
      trigger: "change"
    },
    approveMemo: { required: true, message: "请输入审批意见", trigger: "blur" }
  };
  private assistDataSet = null;
  private approvalData: any = {};
  private assistObj: any = {};
  private dialog: any = {
    detail: false,
    approval: false,
    record: false,
    check: false,
    approvalRecord: false
  };
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.assistModel.companyCode = this.userData.companyCode;
    }
    return this.assistModel.companyCode;
  }

  set companyCode(value) {
    this.assistModel.companyCode = value;
  }
  refreshData() {
    this.caseAssistApplyProcessService
      .getAssistApplyApproval(this.assistModel, this.pageService, {
        applyDate: "desc"
      })
      .subscribe(
        data => {
          this.assistDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  openRefresh(scope) {
    this.dialog.approval = true;
    this.$nextTick(() => {
      let approval: any = this.$refs["approval-form"];
      approval.onCaseIdChange(scope.row);
    });
  }
  /**
   * 打开审批历史记录窗口
   */
  openApprovalRecord(scope) {
    this.approvalObj = scope.row;
    this.dialog.approvalRecord = true;
  }
  /**
   * 获取审批历史记录
   */
  getApprovalRecord() {
    this.$nextTick(() => {
      let showApprovalRecord: any = this.$refs["ShowApprovalRecord"];
      showApprovalRecord.refreshData(this.approvalObj);
    });
  }
}
</script>

<style lang="less">
</style>
