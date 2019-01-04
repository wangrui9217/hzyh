<template>
  <!-- 委外留案审批 --> 
  <section class="page outsource-leave-case-approval">
    <data-box :data="outApprovalDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作 " :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openApprovalDialog(scope)">审批</el-button>
            <el-button type="text" size="small" @click="openApprovalRecord(scope)">审批记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="leaveCaseType" label="留案类型" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="principalName" label="受托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
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
        <el-table-column prop="leaveCaseExpireTime" sortable='custom' label="留案到期日期" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.leaveCaseExpireTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" sortable='custom' label="申请日期" :min-width="$helper.getColumnWidth(6)" >
          <template slot-scope="scope">
            <span>{{scope.row.applyTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyUser" label="申请人" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
      </template>
    </data-box>
    <el-dialog title="审批" :center="true" :visible.sync="dialog.approval" width="40%" @close="$refs['approval-form'].resetFields()">
      <div class="text-left">
        <el-form ref="approval-form" :model="approvalModel" :rules="approvalRules" label-width="100px">
          <el-form-item label="留案说明">
            <el-input type="textarea" v-model="leaveReason" readonly></el-input>
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
import { LeaveCaseService } from "~/services/business-service/leave-case.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import ShowApprovalRecord from "~/components/approval-manage/show-approval-record.vue";

@Auth(6113)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    ShowApprovalRecord
  }
})
export default class OutsourceLeaveCaseApproval extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(LeaveCaseService) private leaveCaseService: LeaveCaseService;

  private outApprovalModel: any = {
    caseNumber: "",
    personalName: "",
    mobileNo: "",
    idCard: "",
    outsId: "",
    batchNumber: ""
  };
  private approvalRules: any = {
    nodeState: [
      { required: true, message: "请选择审批结果", trigger: "change" }
    ],
    nodeOpinion: [
      { required: true, message: "请输入审批意见", trigger: "blur" }
    ]
  };
  private approvalObj: any = {};
  private approvalModel: any = {
    leaveId: "",
    caseNumber: "",
    nodeState: "",
    nodeOpinion: "",
    approvalId: ""
  };
  private dialog: any = {
    approval: false,
    approvalRecord: false
  };
  private commitLoading: any = false;
  private leaveReason: any = "";
  private outApprovalDataSet: any = null;
  private Rule: any = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  created() {}
  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.leaveCaseService
      .getLeaveCaseInfoAll(this.outApprovalModel, this.pageService)
      .subscribe(
        data => {
          this.outApprovalDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 打开审批窗口
   */
  openApprovalDialog(scope) {
    this.approvalModel.approvalId = scope.row.approvalId;
    this.approvalModel.caseNumber = scope.row.caseNumber;
    this.approvalModel.leaveId = scope.row.leaveId;
    this.leaveReason = scope.row.leaveReason;
    this.dialog.approval = true;
  }
  /**
   * 审批确定
   */
  approvalCommit() {
    this.commitLoading = true;
    let form: any = this.$refs["approval-form"];
    form.validate(valid => {
      if (!valid) {
        return false;
      }
      this.leaveCaseService.saveApprovaLeaveCase(this.approvalModel).subscribe(
        data => {
          this.$message.success("操作成功!");
          this.refreshData();
          this.commitLoading = false;
          this.dialog.approval = false;
        },
        ({ msg }) => {
          this.commitLoading = false;
          this.$message.error(msg);
        }
      );
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
