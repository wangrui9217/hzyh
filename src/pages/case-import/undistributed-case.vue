<template>
  <section class="page undistributed-case">
    <data-form :model="importModel" @onSearch="refreshData" :page="pageService" :rules="undistributedRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5406">
          <el-input v-model="importModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5407">
          <el-input v-model="importModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="省份/城市" prop="cityList" v-auth="5408">
          <el-cascader v-model="importModel.cityList" :options="$city.getCityData({ level : 2 })" change-on-select clearable></el-cascader>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5409">
          <el-select v-model="importModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期天数" prop="dayRange" v-auth="5410">
          <number-range v-model="importModel.dayRange" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amountRange" v-auth="5411">
          <number-range v-model="importModel.amountRange"></number-range>
        </el-form-item>
        <el-form-item label="佣金比例" prop="rateRange" v-auth="5412">
          <number-range v-model="importModel.rateRange"></number-range>
        </el-form-item>
        <el-form-item label="案件手数" prop="handNumber" v-auth="5413">
          <number-range v-model="importModel.handNumber"></number-range>
        </el-form-item>
        <el-form-item label="逾期期数" prop="payStatus" v-auth="5414">
          <el-select v-model="importModel.payStatus" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="manualDistruibute" v-auth="5415" :disabled="!disabled">手动分案</el-button>
        <el-button @click="smartAllocatClick" v-auth="5416" :disabled="!disabled">策略分配</el-button>
        <el-button @click="exportClick" :disabled="!disabled">案件导出</el-button>
      </template>
    </data-form>

    <data-box :data="importDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="caseDetail =scope.row;dialog.detail = true">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName?scope.row.principalName: ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="申请城市" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.areaAreaName?scope.row.areaAreaName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personalInfoName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfoName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personalInfoMobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfoMobileNo| encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overduePeriods" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.payStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueAmount|toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handNumber" label="案件手数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="commissionRate" label="佣金比例(%)" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="delegationDate" label="委案日期" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.delegationDate|dateFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--案件分配弹框-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.manual" width="500px" @open="$nextTick(()=>$refs['manual-distrubute'].refresh(selectionList))">
      <manual-distrubute ref="manual-distrubute" @close="dialog.manual=false" @refreshList="refreshData" :selectionList="selectionList"></manual-distrubute>
    </el-dialog>
    <!--策略分案结果-->
    <el-dialog title="策略分案结果" :center="true" :visible.sync="dialog.static" width="60%" @open="$nextTick(()=>$refs['static-allot'].refresh(staticAllotArr))">
      <static-allot ref="static-allot" @close="dialog.static=false" @refreshList="refreshData"></static-allot>
    </el-dialog>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen @open="refreshCaseDetail">
      <el-card>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="客户信息" name="cust-info">
            <cust-info ref="cust-info"></cust-info>
          </el-tab-pane>
          <el-tab-pane label="还款信息" name="pay-info">
            <pay-info  ref="pay-info"></pay-info>
          </el-tab-pane>
          <el-tab-pane label="附件信息" name="attach-info">
            <attach-info  ref="attach-info"></attach-info>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-dialog>
    <!-- 策略分配 -->
    <el-dialog title="策略分配" :center="true" :visible.sync="dialog.strategy" width="500px">
      <strategy-allocation @refreshList="refreshData" @close="dialog.strategy=false"></strategy-allocation>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import NumberRange from "~/components/common/number-range.vue";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import StrategyAllocation from "~/components/case-import/undistributed-case/strategy-allocation.vue";
import { PageService } from "~/utils/page.service";
import { CaseDistributeService } from "~/services/report-service/case-distribute.service";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
import { CaseInfoExceptionService } from "~/services/business-service/case-info-exception.service";
import { ReportService } from "~/services/report-service/report.service.ts";
import { AccRepaymentRemindService } from "~/services/datasync-service/acc-repayment-remind.service";
import StaticAllot from "~/components/case-import/undistributed-case/static-allot.vue";
import ManualDistrubute from "~/components/case-import/undistributed-case/manual-distrubute.vue";
import { State, Getter, Mutation, namespace } from "vuex-class";
import { CaseInfoService } from "../../services/business-service/case-info.service";
import CustInfo from "~/components/case-import/introduction-case/cust-info.vue";
import PayInfo from "~/components/case-import/introduction-case/pay-info.vue";
import AttachInfo from "~/components/case-import/introduction-case/attach-info.vue";

const accManageModule = namespace("acc-manage");

@Auth(426)
@Layout('workspace')
@Component({
  components: {
    StaticAllot,
    ManualDistrubute,
    DataForm,
    DataBox,
    NumberRange,
    CustInfo,
    PayInfo,
    AttachInfo,
    StrategyAllocation
  }
})
export default class UndistributedCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseDistributeService) private caseDistributeService: CaseDistributeService;
  @Dependencies(CaseInfoDistributeService) private caseInfoDistributeService: CaseInfoDistributeService;
  @Dependencies(CaseInfoExceptionService) private caseInfoExceptionService: CaseInfoExceptionService;
  @Dependencies(AccRepaymentRemindService) private accRepaymentRemindService: AccRepaymentRemindService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(ReportService) private reportService: ReportService;
  @State companyList: any;
  @State storeList: any;
  @State userData: any;
  @State principalList: any;
  @Getter isSupperAdmin: boolean;
  @accManageModule.Mutation updateCaseInfo
  private activeName = "cust-info";
  private importModel: any = {
    companyCode: '',
    personalName: '',
    mobileNo: '',
    cityList: [],
    batchNumber: '',
    principalId: '',
    dayRange: {
      min: "",
      max: ""
    },
    amountRange: {
      min: "",
      max: ""
    },
    rateRange: {
      min: "",
      max: ""
    },
    handNumber: {
      min: "",
      max: ""
    },
    payStatus: ''
  };
  private dialog: any = {
    manual: false,
    static: false,
    detail: false,
    strategy: false
  };
  // 表单验证规则
  private undistributedRule = {
    mobileNo: [{
      validator: this.$validator.phoneNumber,
      trigger: "blur"
    }]
  };
  private importDataSet:any = [];
  private importObj: any = {};
  private selectionList: Array<any> = [];
  private staticAllotArr: any = [];
  private caseDetail: any = {}
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.importModel.companyCode = this.userData.companyCode
    }
    return this.importModel.companyCode
  }

  set companyCode(value) {
    this.importModel.companyCode = value
  }

  get disabled() {
    return this.importDataSet.length > 0;
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }

  /**
   * 手动分案
   */
  manualDistruibute() {
    if (this.selectionList.length === 0) {
      this.$message('请选择要分配的案件')
    } else {
      if (this.isSupperAdmin && !this.importModel.companyCode) {
        this.$message.error('请选择公司！')
        return
      }
      this.caseInfoExceptionService.checkExceptionCase({
        companyCode: this.importModel.companyCode
      }).subscribe(data => {
        this.dialog.manual = true
      }, err => { 
        this.$message({
          type: 'info',
          message: err.msg
        })
      })
    }
  }
  exportClick() {
    this.$confirm(`是否导出所有待分配案件？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$message.success('后台操作执行中,请关注任务中心!')
      this.caseInfoDistributeService.caseInfoDistributedExport().subscribe(
        data => {
          this.refreshData()
        },
        err => this.$message.error(err.msg)
      )
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '取消导出'
      })
    })
  }
  /**
   * 策略分案
   */
  smartAllocatClick() {
    this.dialog.strategy = true
  }
  /**
   * 案件评分
   */
  scoringClick() {
    if (this.selectionList.length === 0) {
      this.$message('请选择要评分的案件')
      return
    }
    let ids = this.selectionList.map(v => {
      return v.id
    })
    this.$confirm('您确定要进行案件评分吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.caseInfoDistributeService.importCaseScore(ids).subscribe(data => {
        this.$message.success('评分成功！')
        this.refreshData()
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    }).catch(() => {
      this.$message('取消评分!')
    })
  }
  refreshData() {
    this.caseDistributeService.findCaseInfoDistribute(this.importModel, this.pageService).subscribe(data => {
      this.importDataSet = data;
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  /**
   * 刷新案件详情
   */
  refreshCaseDetail() {
    this.$nextTick(() => {
      let payInform: any = this.$refs["pay-info"];
      payInform.refresh({});
      let attachInform: any = this.$refs["attach-info"];
      attachInform.refresh([]);
      let custInform: any = this.$refs["cust-info"];
      custInform.refresh({});
      this.caseInfoService
        .findUpload(this.caseDetail.caseNumber)
        .subscribe(
          data => {
            if (data) {
              let att: any = this.$refs["attach-info"];
              att.refresh(data);
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      this.reportService
        .getCaseInfoDistributedDetails(this.caseDetail.id)
        .subscribe(
          data => {
            if (data) {
              let pay: any = this.$refs["pay-info"];
              pay.refresh(data);
              let cust: any = this.$refs["cust-info"];
              cust.refresh(data);
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    });
  }
}

</script>

<style lang="less">
</style>
