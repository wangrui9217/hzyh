//已结清
<template>
  <section class="page visit-handled">
    <data-form :model="callModle" @onSearch="refreshData" :page="pageService" :buttonWrap="true" :rules="rules" @handleResetForm="follFeedback">
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请号"  prop="caseNumber">
          <el-input v-model="callModle.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5182">
          <el-input v-model="callModle.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5183">
          <el-input v-model="callModle.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="案件状态" prop="collectionStatus" v-auth="5184">
          <el-select v-model="callModle.collectionStatus" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in caseStatus" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="idCard" label="身份证号" v-auth="5193">
          <el-input v-model="callModle.idCard"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5186">
          <el-input v-model="callModle.batchNumber"></el-input>
        </el-form-item>
         <el-form-item label="机构" prop="deptCodes" v-auth="5188">
          <el-cascader v-model="callModle.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'code',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="案件标记" prop="caseMark" v-auth="5143">
          <el-select v-model="callModle.caseMark" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0028')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="委托方" prop="principalId" v-auth="5185">
          <el-select v-model="callModle.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName" v-auth="5189">
          <el-input v-model="callModle.collectorName"></el-input>
        </el-form-item>
         <el-form-item label="产品类型" prop="seriesName" >
          <el-select v-model="callModle.seriesName" placeholder="请选择" clearable>
            <el-option v-for="{id,seriesName} in productType" :key="id" :label="seriesName" :value="seriesName"></el-option>
          </el-select>
        </el-form-item>
        <div class="inline-box">
          <el-form-item label="逾期金额" prop="caseMoney" v-auth="5194">
            <number-range v-model="callModle.caseMoney"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="逾期期数" prop="payStatus" v-auth="5192">
          <el-select v-model="callModle.payStatus" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <div class="inline-box">
          <el-form-item label="逾期天数" prop="dayRange" v-auth="5195">
            <number-range v-model="callModle.dayRange" :isInteger="true"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="催收反馈" prop="follFeedbacks" v-auth="5187">
          <el-cascader v-model="callModle.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>

         <el-form-item label="流转来源" prop="turnFromPool" >
        <el-select v-model="callModle.turnFromPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in turnFromPoolOption" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诉讼阶段" prop="lawsuitResult" >
          <el-select v-model="callModle.lawsuitResult" placeholder="请选择" clearable disabled>
            <el-option  key="" label="初始" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反欺诈反馈" prop="antiFraudResult" >
          <el-select v-model="callModle.antiFraudResult" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0255')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进时间" prop="followupTime" >
          <el-date-picker class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="callModle.followupTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker  type="date" class="promise" :editable="false" v-model="callModle.caseFollowInTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="客户类型" prop="personalType" >
          <el-select v-model="callModle.personalType" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0252')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称"  prop="productName" >
          <el-input v-model="callModle.productName"></el-input>
        </el-form-item>
      </template>
    </data-form>

    <data-box :data="callAccDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :sort="sortService" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="hangClick(scope)" type="text" v-if="scope.row.handUpFlag === 52" v-auth="5196">挂起</el-button>
            <el-button @click="unhangClick(scope)" type="text" v-if="scope.row.handUpFlag === 53" v-auth="5197">取消挂起</el-button>
            <el-button @click="repair=scope.row,dialog.FollowRecord=true" type="text" v-auth="5198">跟进明细</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" sortable='custom' :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.caseNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)" sortable='custom'>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" sortable='custom' :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" sortable='custom' :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(4)" sortable='custom'>
        </el-table-column>
         <el-table-column prop="personalType" label="客户类型" sortable='custom' :min-width="$helper.getColumnWidth(4)">
           <template slot-scope="scope">
            <span>{{scope.row.personalType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" label="产品类型" sortable='custom' :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" sortable='custom' :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalId===null?"":scope.row.principalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="turnFromPool" label="流转来源" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.turnFromPool | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column label="流转去向" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.turnToPool | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="流转状态" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.turnApprovalStatus | dictConvert}}</span>
          </template>
        </el-table-column>
         <el-table-column prop="caseFollowInTime" sortable='custom' label="案件流入时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.caseFollowInTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupTime" sortable='custom' label="跟进时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.followupTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupBack" label="催收反馈" :min-width="$helper.getColumnWidth(8)"  show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.followupBack===90">
              <p class="text-left">还款金额: {{ scope.row.promiseAmt | toThousands }}元</p>
              <p class="text-left">还款日期: {{ scope.row.promiseTime | dateFormat}}</p>
              <template slot="reference" class="name-wrapper">
                <el-button type="text" style="color:green">{{scope.row.followupBack | dictConvert}}</el-button>
              </template>
            </el-popover>
            <span v-else>{{scope.row.followupBack | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="leaveCaseFlag" label="留案标识" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.leaveCaseFlag=='0'">非留案</span>
            <span v-if="scope.row.leaveCaseFlag=='1'">留案</span>
          </template>
        </el-table-column>
        <el-table-column prop="lawsuitResult" label="诉讼阶段" :min-width="$helper.getColumnWidth(3)">
           <template slot-scope="scope">
            <span>{{scope.row.lawsuitResult | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="antiFraudResult" label="反欺诈结果" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.antiFraudResult | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="closeDate" label="到期日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
              <span v-if="scope.row.leaveCaseFlag=='1'">{{scope.row.closeDate | dateFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>

    <!--查看案件明细的案件跟进记录-->
    <el-dialog :title="repair.caseNumber+'案件跟进明细'" width="90%" :visible.sync="dialog.FollowRecord" :center="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <FollowRecord :caseNumber="repair.caseNumber"></FollowRecord>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { SortService } from "~/utils/sort.service";
import { PrincipalService } from "~/services/business-service/principal.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { AccVisitPoolService } from "~/services/business-service/acc-visit-pool.service";
import { CaseAssistService } from "~/services/business-service/case-assist.service";
import { UserService } from "~/services/business-service/user.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import MassDistribution from "~/components/assist-acc/mass-distribution.vue";
import { State, Getter } from "vuex-class";
import clone from "clone";

@Auth(187)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    FollowRecord,
    MassDistribution
  }
})
export default class VisitHandledCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(PrincipalService) private principalService: PrincipalService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(AccVisitPoolService)
  private accVisitPoolService: AccVisitPoolService;
  @Dependencies(CaseAssistService) private caseAssistService: CaseAssistService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @State principalList: any;
  @State userData: any;
  @State companyList: any;
  @Getter departmentData;
  @State departmentList: any;
  @State storeList: any;
  @Getter isSupperAdmin: boolean;

  private selectionList: any = [];
  private callAccDataSet = null;
  private accFeedback: any = []; // 催收反馈数据
  private orgNameList: any = [];
  private dataName: any = []; //委托方
  private typeId: any = 69;
  private caseNumber: any = {};
  private CaseRowData: any = {};
  private repair: any = {};
  private caseMark: any = "";
  private cupor: any = [];
  private todayPer: any = null;
  private confirmData: any = {};
  private caseCallNumber: any = {};
  private orgCuponameList: any = [];
  private dialog: any = {};
  private rules: any = {};
  private callModle: any = {};
  private productType: any = {}; //产品类型
  private caseStatus = []; // 案件状态
  private turnFromPoolOption: any = {}; //流转来源过滤后数据

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.callModle.companyCode = this.userData.companyCode;
    }
    return this.callModle.companyCode;
  }

  set companyCode(value) {
    this.callModle.companyCode = value;
  }

  created() {
    this.dialog = {
      disabled: false,
      FollowRecord: false
    };
    this.rules = {
      mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
      idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
    };
    this.callModle = {
      caseNumber:"",
      personalName: "", // 客户姓名
      mobileNo: "", // 手机号
      mobileNoX: "",
      caseMoney: { min: "", max: "" },
      dayRange: { min: "", max: "" },
      realPayMinAmt: "", // 最小还款金额
      realPayMaxAmt: "", // 最大还款金额
      realPayAmount: { min: "", max: "" }, // 还款金额
      orderId: "", // 订单号
      collectionStatus: "", // 状态
      principalId: "", // 委托方
      batchNumber: "", // 批次号
      idCard: "", // 身份证
      collectorName: "", // 催收员
      deptCode: "", // 机构
      assistFlag: "", // 是否协催
      assistWay: "", // 协催方式
      caseMark: "", // 案件标记
      companyCode: "", // 公司code
      followupBack: "", // 催收反馈
      overdueDays: [], // 逾期天数
      cupoName: "",
      deptCodes: [],
      follFeedbacks: [],
      payStatus: "", // 逾期期数
      parentAreaId: "",
      areaId: "",
      collectionType: 16,
      collectionStatusList: "24", // 已结案
      shopDeptId: "",
      turnFromPool: "", //流转来源
      lawsuitResult: "", // 诉讼阶段
      antiFraudResult: "", //反欺诈反馈
      followupTime: "", //跟进时间
      caseFollowInTime: "", //案件流入时间
      personalType: "", //客户类型
      cityList: [], //城市
      productName: "" //产品名称
    };
  }

  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  mounted() {
    this.sortService.update("latelyPayDate", "desc");
    this.sortService.update("operatorTime", "desc");
    // 催收反馈下拉框选项
    let valid = clone(this.$dict.getDictData("0019"));
    valid.forEach(v => {
      if (v.value === 88) {
        v.children = this.$dict.getDictData("0020");
      }
      if (v.value === 89) {
        v.children = this.$dict.getDictData("0021");
      }
      if (v.value === 835) {
        v.children = this.$dict.getDictData("0257");
      }
    });
    this.accFeedback = valid;
    this.refreshData();
    this.getProductType();
    let acc: any = this.$dict.getDictData("0004");
    this.caseStatus = acc.filter(v => v.value != "25");
    let turnFrom: any = this.$dict.getDictData("0254");
    this.turnFromPoolOption = turnFrom.filter(
      v => v.value != "825" && v.value != "826"
    );
  }
  /**
   * 获取产品类型
   */
  getProductType() {
    this.productSeriesService.getAllProductSeries().subscribe(
      data => {
        this.productType = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 重置
   */
  follFeedback() {
    this.callModle.followupBack = "";
    this.callModle.caseMoney = "";
    this.callModle.dayRange = "";
  }
  refreshData() {
    this.caseInfoInquiryService
      .getCaseInfoByCondition(
        this.callModle,
        this.pageService,
        this.sortService
      )
      .subscribe(
        data => {
          this.callAccDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 获取委托方
   */
  getDataList() {
    this.principalService
      .getPrincipalList({
        companyCode: this.callModle.companyCode
      })
      .subscribe(
        data => {
          this.dataName = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.callModle.followupBack = this.callModle.follFeedbacks[
      this.callModle.follFeedbacks.length - 1
    ];
    if (!this.callModle.followupBack) {
      this.callModle.followupBack = "";
    }
  }
  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.callModle.deptCodes.length > 0) {
      this.callModle.deptCode = this.callModle.deptCodes[
        this.callModle.deptCodes.length - 1
      ];
    } else {
      this.callModle.deptCode = "";
    }
  }

  /**
   * 获取批量分配信息
   */
  distributionData(data) {
    this.confirmData = data;
  }
  /**
   * 确定分配接口调用
   */
  confirmSend() {
    let sendData: any = {
      batchInfoModelList: this.confirmData.cupoUserCountList,
      assistIds: this.confirmData.amount,
      caseIds: this.confirmData.assistIds
    };
    this.accVisitPoolService.batchVisitCase(sendData).subscribe(
      data => {
        this.refreshData();
        this.dialog.disabled = false;
        this.$message({
          type: "success",
          message: `成功分配${this.confirmData.allocated}个案件！`
        });
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }

  /**
   * 留案
   */
  leaveCaseClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要留案的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.$confirm("您确定留案吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = this.selectionList.slice(0, this.selectionList.length);
          let amount = arr.map(v => {
            return v.caseId;
          });
          this.accVisitPoolService
            .leaveVisitCase({
              caseIds: amount,
              type: 0,
              companyCode: this.callModle.companyCode
            })
            .subscribe(
              data => {
                this.refreshData();
                this.$message.success(
                  `留案申请成功,剩余可留案数${data.caseNum}个!`
                );
              },
              ({ msg }) => {
                this.$message.error(msg);
              }
            );
        })
        .catch(() => {
          this.$message("已取消操作");
        });
    }
  }
  /**
   * 取消留案
   */
  cancleleaveCase() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要取消留案的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.$confirm("您确定取消留案吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = this.selectionList.slice(0, this.selectionList.length);
          let amount = arr.map(v => {
            return v.caseId;
          });
          this.accTelPoolService
            .cancelLeaveCase({
              caseIds: amount,
              type: 0,
              companyCode: this.callModle.companyCode
            })
            .subscribe(
              data => {
                this.refreshData();
                this.$message.success(
                  `操作成功,剩余可留案数${data.caseNum}个!`
                );
              },
              ({ msg }) => {
                this.$message.error(msg);
              }
            );
        })
        .catch(() => {
          this.$message("已取消操作");
        });
    }
  }
  /**
   * 挂起
   */
  hangClick(scope) {
    this.$confirm(
      "该客户被挂起后，就一直停留在此逾期阶段。您确定要挂起吗？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        this.accVisitPoolService
          .handUp({
            id: scope.row.caseId,
            cupoPause: 1
          })
          .subscribe(
            data => {
              this.$message.success("案件挂起成功!");
              this.refreshData();
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
      })
      .catch(() => {
        this.$message("已取消操作");
      });
  }
  /**
   * 取消挂起
   */
  unhangClick(scope) {
    this.$confirm("您确定要取消挂起吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.accVisitPoolService
          .handUp({
            id: scope.row.caseId,
            cupoPause: 2
          })
          .subscribe(
            data => {
              this.$message.success("案件挂起成功!");
              this.refreshData();
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
      })
      .catch(() => {
        this.$message("已取消操作");
      });
  }
}
</script>

<style lang="less">
</style>
