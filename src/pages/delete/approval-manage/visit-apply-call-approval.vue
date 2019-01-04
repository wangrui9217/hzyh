<template>
  <section class="page visit-apply-call-approval">
    <data-form :model="assistModel" @onSearch="refreshData" :page="pageService" :rules="assistRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="1522">
          <el-input v-model="assistModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="personalPhone" v-auth="1523">
          <el-input v-model="assistModel.personalPhone" :maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amtRange" v-auth="1524">
          <number-range v-model="assistModel.amtRange"></number-range>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="assistDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="dialog.detail=true,assistObj=scope.row">{{scope.row.caseNumber}}</el-button>
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
        <el-table-column prop="approveStatus" label="审批状态" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.approveStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approvePhoneResult" label="电催审批结果" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.approvePhoneResult | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveOutResult" label="外访审批结果" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.approveOutResult | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate" label="申请日期" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.applyDate|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.approveStatus!==32" @click="assistObj=scope.row,dialog.check=true" type="text" size="small" v-auth="1526">查看</el-button>
            <el-button @click="assistObj=scope.row,dialog.approval=true" type="text" size="small" v-if="scope.row.approveStatus===32" v-auth="1525">审批</el-button>
            <el-button @click="assistObj=scope.row,dialog.record=true" type="text" size="small" v-auth="1527">跟进记录</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--协催审批-->
    <el-dialog title="审批" :center="true" :visible.sync="dialog.approval" width="60%" @close="$refs['approval-form'].resetFields()">
      <div class="text-left">
        <el-form ref="approval-form" :model="approvalModel" :rules="approvalRules" label-width="100px">
          <el-form-item label="申请说明" prop="applyReason">
            <el-input type="textarea" v-model="assistObj.applyReason" readonly></el-input>
          </el-form-item>
          <el-form-item label="审批结果" prop="approveResult">
            <el-radio-group v-model="approvalModel.approveResult">
              <el-radio label="37">同意</el-radio>
              <el-radio label="36">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审批意见" prop="approveMemo">
            <el-input type="textarea" v-model="approvalModel.approveMemo"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-button @click="dialog.approval=false">取消</el-button>
          <el-button @click="approvalCommit" :loading="submitLoading">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!--查看-->
    <el-dialog title="查看" :center="true" :visible.sync="dialog.check" width="60%">
      <div class="text-left">
        <el-form :model="assistObj" label-width="100px">
          <el-form-item label="申请说明">
            <el-input type="textarea" v-model="assistObj.applyReason" readonly></el-input>
          </el-form-item>
          <el-form-item label="审批结果">
            <el-radio-group v-model="assistObj.approvePhoneResult" disabled>
              <el-radio :label="37">同意</el-radio>
              <el-radio :label="36">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审批意见">
            <el-input type="textarea" v-model="assistObj.approvePhoneMemo" readonly></el-input>
          </el-form-item>
        </el-form>
      </div>
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
import { CaseOutboundApplyService } from "~/services/business-service/case-outbound-apply.service";
import { State, Getter } from "vuex-class";
import NumberRange from "~/components/common/number-range.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";

@Auth(1119)
@Layout("workspace")
@Component({
  components: {
    FollowRecord,
    DataForm,
    DataBox,
    NumberRange,
    CaseDetail
  }
})
export default class VisitApplyCallApproval extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseOutboundApplyService)
  private caseOutboundApplyService: CaseOutboundApplyService;
  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  private assistModel: any = {
    type: 0,
    applyRealName: "",
    companyCode: "",
    personalName: "",
    personalPhone: "",
    batchNumber: "",
    amtRange: { min: "", max: "" },
    principalId: ""
  };
  private assistRule = {
    personalPhone: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  private approvalModel: any = {
    approveMemo: "",
    approveResult: ""
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
  private assistObj: any = {};
  private dialog: any = {
    detail: false,
    approval: false,
    record: false,
    check: false
  };
  private submitLoading: Boolean = false;
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
  /**
   * 审批确定
   */
  approvalCommit() {
    let form: any = this.$refs["approval-form"];
    form.validate(valid => {
      if (!valid) {
        return false;
      }
      this.submitLoading = true;
      this.approvalModel.id = this.assistObj.id;
      this.caseOutboundApplyService
        .visitApplyTelApprove(this.approvalModel)
        .subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("操作成功!");
          this.refreshData();
          this.dialog.approval = false;
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
        );
    });
  }
  refreshData() {
    this.caseOutboundApplyService
      .findAllPassedApply(this.assistModel, this.pageService, {
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
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }
}
</script>

<style lang="less">

</style>
