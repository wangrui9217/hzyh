<template>
  <section class="component check-case-info">
    <data-form :model="model" @onSearch="refreshData" :page="pageService" :rules="checkRules" @handleResetForm="handleResetForm">
      <template slot="default-input">
        <el-form-item label="客户姓名">
          <el-input v-model="model.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo">
          <el-input v-model="model.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amtRange">
          <number-range v-model="model.amtRange"></number-range>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="RebackCaseClick">回收案件</el-button>
        <el-button @click="leaveCaseApply">申请留案</el-button>

        <!-- <el-button @click="revocationCaseClick">撤销案件</el-button>
        <el-button @click="endCaseClick">结案</el-button> -->
        <!--<el-button @click="verificationmanagement">核销</el-button>-->
        <!-- <el-button @click="exportFollowClick">导出跟进记录</el-button> -->
      </template>
    </data-form>
    <data-box :data="dataSet" @onPageChange="refreshData" :selectionList.sync="selectionList" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="detailObj = scope.row;dialog.detail = true" type="text">案件详情</el-button>
            <el-button @click="detailObj = scope.row;dialog.followRecord = true" type="text">跟进记录</el-button>
          </template>
        </el-table-column>
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column label="身份证号" :min-width="$helper.getColumnWidth(6)" prop="idCard">
        </el-table-column>
        <el-table-column prop="areaName" label="地区" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="逾期金额" prop="contractAmt" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.contractAmt| toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overduePeriods" label="逾期期数" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="outBatch" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="collectionStatus" label="催收状态" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" label="产品类型" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column label="当前催收员" prop="collectorName"  :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column label="受托方" prop="outsName" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column label="留案标识" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.leaveCaseFlag=='0'">非留案</span>
            <span v-if="scope.row.leaveCaseFlag=='1'">留案</span>
          </template>
        </el-table-column>
        <el-table-column prop="delegationDate" label="委案日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.delegationDate|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overOutsourceTime" label="到期日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.overOutsourceTime|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupTime" label="跟进时间" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.followupTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <div class="text-left" style="margin-left:10px">
      此页面不包含已结案的案件，已结案的案件请在已结案案件菜单查看。
    </div>
    <!--案件跟进明细-->
    <el-dialog :title="checkObj.caseNumber?checkObj.caseNumber+'案件跟进明细':'案件跟进明细'" :center="true" :visible.sync="dialog.record" append-to-body width="90%">
      <follow-record :caseNumber="checkObj.caseNumber" out></follow-record>
    </el-dialog>
    <!--操作记录-->
    <el-dialog title="操作记录" :center="true" :visible.sync="dialog.handle" append-to-body width="80%" @open="$nextTick(()=>{ handleRefreshData() })">
      <data-box :data="handleDataSet" @onPageChange="handleRefreshData" :page="handelPageService">
        <template slot="columns">
          <el-table-column label="操作人 " prop="operator" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="operateTime" label="操作时间" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.operateTime | dateTimeFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="backAmt" label="金额 " align="right" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.backAmt | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operationType" label="操作状态" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.operationType | dictConvert}}</span>
            </template>
          </el-table-column>
        </template>
      </data-box>
    </el-dialog>
    <!--回收原因-->
    <el-dialog title="回收原因" :center="true" :visible.sync="dialog.reback" append-to-body>
      <section class="component return-reason">
        <el-input type="textarea" :rows="2" v-model="returnReason"></el-input>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-button @click="dialog.reback = false">取消</el-button>
          <el-button @click="rebackCommit" :loading="submitLoading">确定</el-button>
        </el-row>
      </section>
    </el-dialog>
    <!--核销申请-->
    <el-dialog title="核销申请" :center="true" :visible.sync="dialog.applyReason" append-to-body width="80%">
      <section class="component apply-reason">
        <span style="float:left;">申请理由：</span>
        <el-input type="textarea" :rows="2" v-model="applicationReason"></el-input>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-button @click="dialog.applyReason = false">取消</el-button>
          <el-button @click="applyReasonCommit" :loading="submitLoading">确定</el-button>
        </el-row>
      </section>
    </el-dialog>
    <!--核销管理-->
    <el-dialog title="核销管理" :center="true" :visible.sync="dialog.verifyManage" append-to-body width="80%">
      <section class="component verify-manage">
        <span style="float:left;">核销说明：</span>
        <el-input type="textarea" :rows="2" v-model="verifyRemark"></el-input>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-button @click="dialog.verifyManage = false">取消</el-button>
          <el-button @click="verifyManageCommit" :loading="submitLoading">确定</el-button>
        </el-row>
      </section>
    </el-dialog>
    <!--回款-->
    <el-dialog title="请输入已还款金额" :center="true" :visible.sync="dialog.backAmt" append-to-body width="50%">
      <section class="component verify-manage">
        <!--客户信息数据-->
        <data-grid :labelWidth="75" labelAlign="center" contentAlign="left">
          <data-grid-item label="申请号:" :span="6">{{checkObj.caseNumber}}</data-grid-item>
          <data-grid-item label="客户姓名:" :span="6">{{checkObj.personalName}}</data-grid-item>
        </data-grid>
        <!--逾期还款数据-->
        <data-grid class="data-grid" :labelWidth="100" labelAlign="center" contentAlign="left" style="margin-top:20px">
          <data-grid-item label="已还款金额(元):" :span="12">
            <el-input v-model="repayAmount" placeholder="请输入已还款金额" type="number" :min="0" :max="1000000000" @blur="checkMax" style="width: 150px"></el-input>
          </data-grid-item>
        </data-grid>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-button @click="dialog.backAmt = false">取消</el-button>
          <el-button @click="backAmtCommit" :loading="submitLoading">确定</el-button>
        </el-row>
      </section>
    </el-dialog>
    <!-- 申请留案 -->
    <el-dialog title="案件申请留案" width="40%" :visible.sync="dialog.leave" :center="true" :close-on-click-modal="false" :close-on-press-escape="false" @close="$refs['application-leave'].reset()" append-to-body>
      <application-leave :caseIdList="caseIdList" @close="dialog.leave=false;refreshData" ref="application-leave"></application-leave>
    </el-dialog>
    <!-- 案件详情 -->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen append-to-body>
      <case-detail :caseId="detailObj.caseId" :caseNumber="detailObj.caseNumber"></case-detail>
    </el-dialog>
    <!-- 跟进记录 -->
    <el-dialog :title="detailObj.caseNumber+'案件跟进明细'" :center="true" :visible.sync="dialog.followRecord" append-to-body width="90%">
      <follow-record :caseNumber="detailObj.caseNumber"></follow-record>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { State } from "vuex-class";
import { ExportOutsourceFollowupService } from "~/services/report-service/export-outsource-followup.service";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
import { OutbackSourceService } from "~/services/business-service/outback-source.service";
import { CaseInfoVerificationService } from "~/services/business-service/case-info-verification.service";
import ApplicationLeave from "~/components/call-case/application-leave.vue";
import { Emit } from "vue-property-decorator";
import NumberRange from "~/components/common/number-range.vue";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
@Component({
  components: {
    DataGrid,
    DataGridItem,
    NumberRange,
    FollowRecord,
    DataForm,
    DataBox,
    ApplicationLeave,
    CaseDetail
  }
})
export default class CheckCaseInfo extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(PageService) private handelPageService: PageService;
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;
  @Dependencies(OutbackSourceService)
  private outbackSourceService: OutbackSourceService;
  @Dependencies(ExportOutsourceFollowupService)
  private exportOutsourceFollowupService: ExportOutsourceFollowupService;
  @Dependencies(CaseInfoVerificationService)
  private caseInfoVerificationService: CaseInfoVerificationService;
  @State userData: any;
  @Emit("refreshList")
  refreshList() {}
  @Emit("close")
  close() {}
  private model: any = {
    personalName: "",
    mobileNo: "",
    amtRange: { min: "", max: "" },
    outsId: "",
    batchNumber: ""
  };
  private checkRules: any = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  private dialog: any = {
    reback: false,
    applyReason: false,
    verifyManage: false,
    record: false,
    backAmt: false,
    handle: false,
    leave: false,
    detail: false,
    followRecord: false
  };
  private detailObj: any = {};
  private repayAmount: any = ""; // 已还款金额
  private returnReason: any = ""; // 回收原因
  private applicationReason: any = ""; // 核销申请
  private verifyRemark: any = ""; // 核销说明
  private selectionList: any = [];
  private caseIdList: any = [];
  private dataSet = [];
  private handleDataSet = null;
  private checkObj: any = {};
  private outList: any = {};
  private submitLoading: Boolean = false;

  /**
   * 手动重置
   */
  handleResetForm() {
    this.model.personalName = "";
    this.model.mobileNo = "";
  }
  /**
   * 操作记录列表
   */
  handleRefreshData() {
    let obj = {
      companyCode: this.checkObj.companyCode,
      outcaseId: this.checkObj.id
    };
    this.outbackSourceService
      .getOutbackFollowupRecord(
        Object.assign(this.model, obj),
        this.handelPageService,
        {
          operateTime: "desc"
        }
      )
      .subscribe(
        data => {
          this.handleDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 回款确定
   */
  backAmtCommit() {
    if (this.repayAmount < 1000000000 && this.repayAmount > 0) {
      let obj = {
        companyCode: this.checkObj.companyCode,
        operationType: 204,
        backAmt: this.repayAmount,
        outId: this.checkObj ? this.checkObj.outsId : "",
        outcaseId: this.checkObj.id
      };
      this.submitLoading = true;
      this.outbackSourceService.createOutBackAmt(obj).subscribe(
        data => {
          this.submitLoading = false;
          this.$message("操作成功！");
          this.refreshData();
          this.close();
          this.dialog.backAmt = false;
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    } else {
      this.$message("请输入正确的金额(只能输入数字，小数点后只能保留两位)");
      this.repayAmount = "";
    }
  }
  checkMax() {
    if (this.repayAmount < 1000000000 && this.repayAmount > 0) {
      this.repayAmount = this.repayAmount;
    } else {
      this.repayAmount = "";
    }
  }
  /**
   * 核销申请确定
   */
  applyReasonCommit() {
    if (!this.applicationReason) {
      this.$message("请输入申请理由");
      return;
    }
    this.submitLoading = true;
    this.caseInfoVerificationService
      .saveCaseInfoVerification({
        ids: this.selectionList.map(v => v.id),
        applicationReason: this.applicationReason
      })
      .subscribe(
        val => {
          this.submitLoading = false;
          this.$message("操作成功！");
          this.dialog.applyReason = false;
          this.refreshData();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
  }
  /**
   * 核销管理确定
   */
  verifyManageCommit() {
    if (!this.verifyRemark) {
      this.$message("请输入核销说明");
      return;
    }
    this.submitLoading = true;
    this.caseInfoVerificationService
      .saveCaseInfoVerification({
        ids: this.selectionList.map(v => v.id),
        state: this.verifyRemark
      })
      .subscribe(
        val => {
          this.submitLoading = false;
          this.$message("操作成功！");
          this.dialog.verifyManage = false;
          this.refreshData();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
  }
  // /**
  //  * 核销管理
  //  */
  // verificationmanagement() {
  //   if(!this.selectionList.length) {
  //     this.$message('请选择进行核销管理的案件')
  //     return false
  //   }
  //   this.caseInfoVerificationService.getSysparm().subscribe(val => {
  //     if (val === 1) {
  //       // 申请理由输入框
  //       this.applicationReason = ''
  //       this.dialog.applyReason = true
  //     }
  //     if (JSON.stringify(val) === '{}' || val === 0) {
  //       // 核销说明输入框
  //       this.verifyRemark = ''
  //       this.dialog.verifyManage = true
  //     }
  //   },({ msg }) => {
  //     this.$message.error(msg);
  //   })
  // }
  /**
   * 回收案件确定
   */
  rebackCommit() {
    this.submitLoading = true;
    this.outsourcePoolService
      .returnOutsourceCase(this.selectionList.map(v => v.id), this.returnReason)
      .subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("回收成功！");
          this.dialog.reback = false;
          this.refreshData();
          this.close();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
  }
  /**
   * 回收案件
   */
  RebackCaseClick() {
    if (!this.selectionList.length) {
      this.$message.info("请选择要回收的案件！");
      return false;
    }
    this.dialog.reback = true;
    this.returnReason = "";
  }
  /**
   * 回退205 修复206
   */
  handleClick(scope, type) {
    this.$confirm("您确定要执行该操作吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let obj = {
          outcaseId: scope.row.id,
          companyCode: scope.row.companyCode,
          operationType: type,
          outId: scope.row.outsId
        };
        this.outbackSourceService.createOutBackAmt(obj).subscribe(
          data => {
            this.$message.success("操作成功！");
            this.refreshData();
            this.close();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      })
      .catch(() => {
        this.$message.info("已取消操作");
      });
  }
  /**
   * 结案
   */
  endCaseClick() {
    if (!this.selectionList.length) {
      this.$message.info("请选择要结案的案件!");
      return false;
    }
    this.$confirm("您确定要结案吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.outsourcePoolService
        .closeOutsourcePool(this.selectionList.map(v => v.id))
        .subscribe(
          data => {
            this.$message.success("结案成功！");
            this.refreshData();
            this.close();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    });
  }
  /**
   * 撤销案件
   */
  revocationCaseClick() {
    if (!this.selectionList.length) {
      this.$message.info("请选择要撤销的案件!");
      return false;
    }
    this.$confirm("您确定要撤销案件吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.outsourcePoolService
        .recallOutCase(this.selectionList.map(v => v.id))
        .subscribe(
          data => {
            this.$message.success("操作成功！");
            this.refreshData();
            this.refreshList();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    });
  }
  /**
   * 导出
   */
  exportClick() {
    let caseNumberList = this.selectionList.map(v => v.caseInfo).map(m => {
      return m.caseNumber;
    });
    this.exportOutsourceFollowupService
      .exportOutsourceFollowupRecord(this.model, 0, [], [], caseNumberList)
      .subscribe(
        data => {
          this.$message.info("开始导出");
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  refresh(obj) {
    this.selectionList = [];
    this.model = {
      personalName: "",
      mobileNo: "",
      amtRange: { min: "", max: "" },
      outsId: obj.outsId,
      batchNumber: obj.batchNumber || "",
      outsName: obj.outsName
    };
    this.refreshData();
  }
  refreshData() {
    this.dataSet = [];
    this.outsourcePoolService
      .getOutSourceCaseByBatchnum(this.model, this.pageService)
      .subscribe(
        data => {
          this.dataSet = data;
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
  mounted() {
    this.model.companyCode = this.userData.companyCode;
  }
  /**
   * 委外留案申请
   */
  leaveCaseApply() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要留案的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.caseIdList = this.selectionList.map(v => v.caseId);
      this.dialog.leave = true;
    }
  }
}
</script>

<style lang="less" scoped>
</style>
