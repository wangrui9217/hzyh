<template>
  <section class="page assist-application">
    <data-form :model="assistModel" @onSearch="refreshData" :page="pageService" :rules="assistRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName"  v-auth="5279">
          <el-input v-model="assistModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="personalPhone" v-auth="5280">
          <el-input v-model="assistModel.personalPhone" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="逾期金额" prop="amtRange" v-auth="5281">
          <number-range v-model="assistModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="申请人" prop="applyRealName" v-auth="5282">
          <el-input v-model="assistModel.applyRealName"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5283">
          <el-select v-model="assistModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in getPrincipalList()" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="assistDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
         <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.approveStatus!==34" @click="openRefresh(scope)" type="text" size="small">查看</el-button>
            <el-button @click="openRefresh(scope)" type="text" size="small" v-if="scope.row.approveStatus===34" v-auth="5284">审批</el-button>
            <el-button @click="assistObj=scope.row,dialog.record=true" type="text" size="small" v-auth="5285">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="assistObj=scope.row;dialog.detail=true">{{scope.row.caseNumber}}</el-button>
          </template>
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
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="assistWay" label="协催方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.assistWay | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyRealName" label="申请人" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approveOutResult" label="外访审批结果" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.approveOutResult | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyInvalidTime" label="审批失效时间" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.applyInvalidTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate" label="申请日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.applyDate|dateFormat}}</span>
          </template>
        </el-table-column>
       
      </template>
    </data-box>
    <!--协催审批-->
    <el-dialog :title="assistObj.approveStatus===34?'协催审批':'查看'" :center="true" :visible.sync="dialog.approval" width="40%" @close="$refs['approval-form'].refresh()">
      <assist-approval @close="dialog.approval=false" @success="refreshData" :assistobj="approvalData" ref="approval-form"></assist-approval>
    </el-dialog>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="assistObj.caseId"></case-detail>
    </el-dialog>
    <!--案件跟进明细-->
    <el-dialog :title="assistObj.caseNumber+'案件跟进明细'" :center="true" :visible.sync="dialog.record" width="90%">
      <follow-record :caseNumber="assistObj.caseNumber"></follow-record>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { CaseAssistApplyService } from "~/services/business-service/case-assist-apply.service";
import { State, Getter } from "vuex-class";
import NumberRange from "~/components/common/number-range.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import AssistApproval from "~/components/approval-manage/assist-approval.vue";

@Auth(734)
@Layout("workspace")
@Component({
  components: {
    FollowRecord,
    DataForm,
    AssistApproval,
    DataBox,
    NumberRange,
    CaseDetail
  }
})
export default class AssistApplication extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseAssistApplyService)
  private caseAssistApplyService: CaseAssistApplyService;
  @State userData: any;
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
  @State companyList: any;
  private assistModel: any = {
    applyRealName: "",
    companyCode: "",
    personalName: "",
    personalPhone: "",
    batchNumber: "",
    amtRange: { min: "", max: "" },
    principalId: ""
  };
  private approvalModel: any = {
    approveMemo: "",
    approveResult: ""
  };
  // 表单验证规则
  private assistRule = {
    personalPhone: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  private approvalRules: any = {
    approveResult: [
      { required: true, message: "请选择审批结果", trigger: "change" }
    ],
    approveMemo: [
      { required: true, message: "请输入审批意见", trigger: "blur" }
    ]
  };
  private assistDataSet = null;
  private assistTitle: any = '';
  private assistObj: any = {};
  private approvalData: any = {};
  private dialog: any = {
    detail: false,
    approval: false,
    record: false,
    check: false
  };
  /**
  * 考虑到非管理员不显示公司选择控件
  * get 操作的时候强制设置非管理员所在公司码
 */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.assistModel.companyCode = this.userData.companyCode
    }
    return this.assistModel.companyCode
  }

  set companyCode(value) {
    this.assistModel.companyCode = value
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  refreshData() {
    this.caseAssistApplyService
      .findAllTelPassedApply(this.assistModel, this.pageService, {
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
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }
  openRefresh(scope) {
    this.approvalData = scope.row
    this.dialog.approval = true
  }

}
</script>

<style lang="less">

</style>
