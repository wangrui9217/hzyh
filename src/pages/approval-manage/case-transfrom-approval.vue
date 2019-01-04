<template>
  <!-- 案件流转审批 -->
  <section class="page case-transfrom-approval">
    <data-box :data="caseTransDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作 " :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openApprovalDialog(scope)">审批</el-button>
            <el-button type="text" size="small" @click="openApprovalRecord(scope)">审批记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="principalName" label="受托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="personalMobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalMobileNo | encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personalIdCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="sourceType" label="流转来源" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.sourceType|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goalType" label="流转去向" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.goalType|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期总金额(元)" align="right" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overduePeriods" label="逾期期数" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="followupBack" label="催收反馈" show-overflow-tooltip	 :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.followupBack===90">
              <p class="text-left">还款金额: {{ scope.row.promiseAmt | toThousands }}元</p>
              <p class="text-left">还款日期: {{ scope.row.promiseTime | dateFormat}}</p>
              <template slot="reference" class="name-wrapper">
                <el-button type="text" style="color:green">{{scope.row.followupBack|dictConvert}}</el-button>
              </template>
            </el-popover>
            <span v-else>{{scope.row.followupBack|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="turnApprovalStatus" label="审核结果" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
           <template slot-scope="scope">
            <span>{{scope.row.turnApprovalStatus|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime"  sortable='custom' label="申请日期" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.applyTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyUser" label="申请人" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
      </template>
    </data-box>
    <el-dialog title="案件流转审批" :center="true" :visible.sync="dialog.approval" width="40%" @close="$refs['approval-form'].resetFields()">
      <div class="text-left">
        <el-form ref="approval-form" :model="approvalModel" :rules="approvalRules" label-width="100px">
          <el-form-item label="流转说明" prop="turnDescribe">
            <el-input type="textarea" v-model="approvalModel.turnDescribe" readonly></el-input>
          </el-form-item>
          <el-form-item label="审批结果" prop="nodeState">
            <el-radio-group v-model="approvalModel.nodeState">
              <el-radio label="0">同意</el-radio>
              <el-radio label="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审批意见" prop="nodeOpinion">
            <el-input type="textarea" v-model="approvalModel.nodeOpinion"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-button @click="dialog.approval=false">取消</el-button>
          <el-button @click="approvalCommit" :loading="commitLoading">确定</el-button>
        </el-row>
      </div>
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
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import { CaseRoamService } from "~/services/business-service/case-roam.service";
import ShowApprovalRecord from "~/components/approval-manage/show-approval-record.vue";

@Auth(6114)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    FollowRecord,
    ShowApprovalRecord
  }
})
export default class CaseTransfromApproval extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseRoamService) private caseRoamService: CaseRoamService;

  private caseTransModel: any = {
    caseNumber: "",
    personalName: "",
    mobileNo: "",
    idCard: "",
    outsId: "",
    batchNumber: "",
    sourceType: "",
    goalType: ""
  };
  private commitLoading: any = false;
  private caseTransDataSet: any = null;
  private approvalObj: any = {};
  private Rule: any = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  /**
   * 审批参数
   */
  private approvalModel: any = {
    approvalId: "",
    caseRecordApplyId: "",
    turnDescribe: "",
    caseNumber: "",
    nodeState: "",
    nodeOpinion: ""
  };
  private approvalRules: any = {
    nodeState: [
      { required: true, message: "请选择审批结果", trigger: "change" }
    ],
    nodeOpinion: [
      { required: true, message: "请输入审批意见", trigger: "blur" }
    ]
  };
  private dialog: any = {
    approval: false,
    approvalRecord: false
  };

  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.caseRoamService
      .getCaseRecordApplyInfo(this.caseTransModel, this.pageService)
      .subscribe(
        data => {
          this.caseTransDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 打开审批历史记录窗口
   */
  openApprovalRecord(scope) {
    this.approvalObj = scope.row;
    this.dialog.approvalRecord = true;
  }
  /**
   * 打开审批窗口
   */
  openApprovalDialog(scope) {
    this.approvalModel.approvalId =  scope.row.approvalId;
    this.approvalModel.turnDescribe = scope.row.turnDescribe;
    this.approvalModel.caseNumber = scope.row.caseNumber;
    this.approvalModel.caseRecordApplyId = scope.row.caseRecordApplyId;
    this.dialog.approval = true;
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
  /**
   * 审批确定
   */
  approvalCommit() {
    let form: any = this.$refs["approval-form"];
    form.validate(valid => {
      if (!valid) {
        return false;
      }
      this.commitLoading = true;
      this.caseRoamService
        .ApprovalCaseRecordApply(this.approvalModel)
        .subscribe(
          data => {
            this.$message.success("操作成功!");
            this.commitLoading = false;
            this.refreshData();
            this.dialog.approval = false;
          },
          ({ msg }) => {
            this.$message.error(msg);
            this.commitLoading = false;
          }
        );
    });
  }
}
</script>

<style lang="less">
</style>
