<template>
  <section class="page acc-flow-approval">
    <data-form :model="assistModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5286">
          <el-input v-model="assistModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="审批结果" prop="approveState" v-auth="5287">
          <el-select v-model="assistModel.approveState" placeholder="请选择" clearable>
            <el-option v-for="{value, label} in $dict.getDictData('0047')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="assistDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button @click="assistObj=scope.row,dialog.approval=true" type="text" size="small" v-if="scope.row.approveResult===213" v-auth="5288">审批</el-button>
            <el-button @click="assistObj=scope.row,dialog.record=true" type="text" size="small" v-auth="5289">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="assistObj=scope.row;dialog.detail=true">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期总金额" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="overduePeriods" label="逾期期数" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="applayRealName" label="申请人" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="申请时间" sortable='custom' :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.applayDate|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveRealName" label="审批人" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approveDatetime" sortable='custom' label="审批时间" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.approveDatetime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveResult" label="审批结果" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.approveResult | dictConvert}}</span>
          </template>
        </el-table-column>
        
      </template>
    </data-box>
    <!--电催流转审批-->
    <el-dialog title="电催流转审批" :center="true" :visible.sync="dialog.approval" width="40%" @close="$refs['approval-form'].resetFields()">
      <section class="component approval-acc-flow-application">
        <el-form ref="approval-form" :model="approvalModel" :rules="approvalRules" label-width="100px">
          <el-form-item label="申请原因" prop="reason">
            <el-input type="textarea" v-model="assistObj.applayReason" readonly></el-input>
          </el-form-item>
          <el-form-item label="审批结果" prop="result">
            <el-radio-group v-model="approvalModel.result">
              <el-radio :label="0">同意</el-radio>
              <el-radio :label="1">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-button @click="dialog.approval=false">取消</el-button>
          <el-button @click="approvalCommit" :loading="approvalCommitLoading">确定</el-button>
        </el-row>
      </section>
    </el-dialog>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="assistObj.caseId" ></case-detail>
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
import { SortService } from "~/utils/sort.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";

@Auth(742)
@Layout("workspace")
@Component({
  components: {
    FollowRecord,
    DataForm,
    DataBox,
    CaseDetail
  }
})
export default class AccFlowApproval extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;

  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  private assistModel: any = {
    companyCode: "",
    personalName: "",
    approveState: ""
  };
  private approvalCommitLoading: boolean = false;
  private approvalModel: any = {
    applayReason: "",
    result: 0 // 既然是审批，默认就选中同意吧
  };
  private approvalRules: any = {
    result: [{ required: true, message: "请选择审批结果", trigger: "change" }]
  };
  private assistDataSet = null;
  private assistObj: any = {};
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
      this.assistModel.companyCode = this.userData.companyCode;
    }
    return this.assistModel.companyCode;
  }

  set companyCode(value) {
    this.assistModel.companyCode = value;
  }

  /**
   * 审批
   */
  approvalCommit() {
    this.approvalCommitLoading = true;
    let form: any = this.$refs["approval-form"];
    form.validate(valid => {
      if (!valid) {
        return false;
      }
      let fun = () => {
        const paramModel: any = {
          approveId: this.assistObj.id,
          result: this.approvalModel.result,
          type: 0
        };
        this.accTelPoolService.approvalTelCirculation(paramModel).subscribe(
          data => {
            this.$message.success("审批成功！");
            this.approvalCommitLoading = false;
            this.refreshData();
            this.dialog.approval = false;
          },
          ({ msg }) => {
            this.$message.error(msg);
            this.approvalCommitLoading = false;
          }
        );
      };
      this.accTelPoolService
        .checkCaseAssist({ list: [this.assistObj.caseId] })
        .subscribe(
          data => {
            if (data.length) {
              this.$confirm(
                "所选案件存在协催申请或协催案件， 是否继续分配？",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  fun();
                  this.approvalCommitLoading = false;
                })
                .catch(() => {
                  this.$message.info("取消分配!");
                  this.approvalCommitLoading = false;
                });
            } else {
              fun();
              this.approvalCommitLoading = false;
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
            this.approvalCommitLoading = false;
          }
        );
    });
  }
  refreshData() {
    this.accTelPoolService
      .getTelPendingCase(this.assistModel, this.pageService, {
        approveResult: "asc",
        applayDate: "desc",
        approveDatetime: "desc"
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
}
</script>

<style lang="less">
</style>
