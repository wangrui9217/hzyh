<template>
  <section class="page visit-in-the-collection">
    <data-form :model="returnCModle" @onSearch="refreshData" :page="pageService" :buttonWrap="true" :rules="rules" @handleResetForm="follFeedback">
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请号"  prop="caseNumber">
          <el-input v-model="returnCModle.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5140">
          <el-input v-model="returnCModle.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5141">
          <el-input v-model="returnCModle.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item prop="idCard" label="身份证号" v-auth="5152">
          <el-input v-model="returnCModle.idCard"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5145">
          <el-input v-model="returnCModle.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptCodes" v-auth="5149">
          <el-cascader v-model="returnCModle.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'code',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="案件标记" prop="caseMark" v-auth="5143">
          <el-select v-model="returnCModle.caseMark" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0028')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="委托方" prop="principalId" v-auth="5144">
          <el-select v-model="returnCModle.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName" v-auth="5150">
          <el-input v-model="returnCModle.collectorName"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="seriesName" >
          <el-select v-model="returnCModle.seriesName" placeholder="请选择" clearable>
            <el-option v-for="{id,seriesName} in productType" :key="id" :label="seriesName" :value="seriesName"></el-option>
          </el-select>
        </el-form-item>
        <div class="inline-box">
          <el-form-item label="逾期金额" prop="caseMoney" v-auth="5153">
            <number-range v-model="returnCModle.caseMoney"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="逾期期数" prop="payStatus" v-auth="5151">
          <el-select v-model="returnCModle.payStatus" placeholder="请选择" clearable>
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
          <el-form-item label="逾期天数" prop="dayRange" v-auth="5154">
            <number-range v-model="returnCModle.dayRange" :isInteger="true"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="催收反馈" prop="follFeedbacks" v-auth="5148">
          <el-cascader v-model="returnCModle.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-table-column prop="deptName" label="机构" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-form-item label="流转来源" prop="turnFromPool" >
        <el-select v-model="returnCModle.turnFromPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in turnFromPoolOption" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="诉讼阶段" prop="lawsuitResult" >
          <el-select v-model="returnCModle.lawsuitResult" placeholder="请选择" clearable disabled>
            <el-option  key="" label="初始" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反欺诈反馈" prop="antiFraudResult" >
          <el-select v-model="returnCModle.antiFraudResult" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0255')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进时间" prop="followupTime" >
          <el-date-picker  class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="returnCModle.followupTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker  type="date" class="promise" :editable="false" v-model="returnCModle.caseFollowInTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="客户类型" prop="personalType" >
          <el-select v-model="returnCModle.personalType" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0252')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称"  prop="productName" >
          <el-input v-model="returnCModle.productName"></el-input>
        </el-form-item>
      </template>
      <template slot="default-button">
        <!--按钮区域-->
      </template>
      <template slot="append">
      </template>
    </data-form>

    <data-box :tableRowClassName="tableRowClassName" :rowClass="rowClass" :data="callAccDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :sort="sortService" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="hangClick(scope)" type="text" v-if="scope.row.handUpFlag === 52" v-auth="5159">挂起</el-button>
            <el-button @click="unhangClick(scope)" type="text" v-if="scope.row.handUpFlag === 53" v-auth="5160">取消挂起</el-button>
            <el-button @click="repair=scope.row,dialog.FollowRecord=true" type="text" v-auth="5161">跟进明细</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" sortable='custom' :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>申请号: {{ scope.row.caseNumber }}</p>
              <span slot="reference" class="name-wrapper">
                  <el-button type="text" @click="openAccCenter({caseId:scope.row.caseId, searchModel:returnCModle})">{{scope.row.caseNumber}}</el-button>
              </span>
            </el-popover>
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
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column  label="流转来源" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.turnFromPool | dictConvert}}</span>
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
        <el-table-column prop="followupBack" label="催收反馈" :min-width="$helper.getColumnWidth(8)" show-overflow-tooltip>
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
    <!--批量分配-->
    <el-dialog title="批量分配" :visible.sync="dialog.disabled" @open="loadData" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <MassDistribution :selectionList="selectionList" @close="dialog.disabled=false" @refresh="refreshData" ref="refresh" :typeId="typeId"></MassDistribution>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { PrincipalService } from "~/services/business-service/principal.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { DepartmentService } from "~/services/business-service/department.service";
import { UserService } from "~/services/business-service/user.service";
import { AccVisitPoolService } from "~/services/business-service/acc-visit-pool.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import { SortService } from "~/utils/sort.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import PhoneRecord from "~/components/message-acc/phone-record.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import MassDistribution from "~/components/assist-acc/mass-distribution.vue";
import { State, Action, namespace, Getter } from "vuex-class";
import clone from "clone";

const accManageModule = namespace("acc-manage");

@Auth(189)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    PhoneRecord,
    FollowRecord,
    MassDistribution
  }
})
export default class VisitInTheCollection extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(PrincipalService) private principalService: PrincipalService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(DepartmentService) private departmentService: DepartmentService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(AccVisitPoolService)
  private accVisitPoolService: AccVisitPoolService;
  @State principalList: any;
  @State userData: any;
  @State companyList: any;
  @Getter departmentData;
  @State departmentList: any;
  @accManageModule.Action openAccCenter;
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
  private orgCuponameList: any = [];

  private dialog: any = {};
  private rowClass: any = scope => {
    if (scope.row.caseMark === 126) {
      return "white-row";
    }
    if (scope.row.caseMark === 127) {
      return "red-row";
    }
    if (scope.row.caseMark === 128) {
      return "blue-row";
    }
    if (scope.row.caseMark === 129) {
      return "green-row";
    }
  };
  private rules = {};
  private returnCModle: any = {};
  private productType: any = {}; //产品类型
  private turnFromPoolOption: any = {}; //流转来源过滤后数据

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.returnCModle.companyCode = this.userData.companyCode;
    }
    return this.returnCModle.companyCode;
  }

  set companyCode(value) {
    this.returnCModle.companyCode = value;
  }

  created() {
    this.dialog = {
      disabled: false,
      phonerecord: false,
      FollowRecord: false
    };
    this.rules = {
      mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
      idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
    };
    this.returnCModle = {
      caseNumber: "",
      personalName: "", // 客户姓名
      mobileNo: "", // 手机号
      mobileNoX: "",
      caseMoney: {
        min: "",
        max: ""
      },
      dayRange: {
        min: "",
        max: ""
      },
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
      follFeedbacks: [], //催收反馈
      payStatus: "", // 逾期期数
      employeeRealName: "", // 业务经理
      deptName: "", // 门店
      overDuePayStatus: "M1+",
      collectionType: 16,
      collectionStatusList: "800",
      shopDeptId: "",
      realPayMinAmt: "", // 最小还款金额
      realPayMaxAmt: "", // 最大还款金额
      realPayAmount: { min: "", max: "" }, // 还款金额
      seriesName: "", //产品类型
      turnFromPool: "", //流转来源
      lawsuitResult: "", // 诉讼阶段
      antiFraudResult: "", //反欺诈反馈
      followupTime: "", //跟进时间
      caseFollowInTime: "", //案件流入时间
      personalType: "", //客户类型
      productName: "", //产品名称
      cityList: [] //城市
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
    this.getProductType();
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
    this.returnCModle.followupBack = "";
    this.returnCModle.caseMoney = "";
    this.returnCModle.dayRange = "";
  }
  tableRowClassName(scope, index) {
    if (scope.caseMark === 126) {
      return "white-row";
    }
    if (scope.caseMark === 127) {
      return "red-row";
    }
    if (scope.caseMark === 128) {
      return "blue-row";
    }
    if (scope.caseMark === 129) {
      return "green-row";
    }
  }

  refreshData() {
    this.caseInfoInquiryService
      .getCaseInfoByCondition(
        this.returnCModle,
        this.pageService,
        this.sortService
      )
      .subscribe(
        data => (this.callAccDataSet = data),
        err => this.$message.error(err.msg)
      );
  }
  /**
   * 获取委托方
   */
  getDataList() {
    this.principalService
      .getPrincipalList({ companyCode: this.returnCModle.companyCode })
      .subscribe(
        data => (this.dataName = data),
        err => this.$message.error(err.msg)
      );
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.returnCModle.followupBack = this.returnCModle.follFeedbacks[
      this.returnCModle.follFeedbacks.length - 1
    ];
    if (!this.returnCModle.followupBack) {
      this.returnCModle.followupBack = "";
    }
  }
  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.returnCModle.deptCodes.length > 0) {
      this.returnCModle.deptCode = this.returnCModle.deptCodes[
        this.returnCModle.deptCodes.length - 1
      ];
    } else {
      this.returnCModle.deptCode = "";
    }
  }
  /**
   * 获取催收专员案件数(批量分配)
   */
  loadData() {
    this.$nextTick(() => {
      let typeVisit = 1;
      let refreshVisit: any = this.$refs["refresh"];
      refreshVisit.refresh(typeVisit);
    });
  }
  /**
   * 批量分配
   */
  batchClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要分配的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      let arr = this.selectionList.slice(0, this.selectionList.length);
      let amount = arr.map(v => {
        return v.caseId;
      });
      this.accTelPoolService
        .checkCaseAssist({
          list: amount
        })
        .subscribe(
          data => {
            if (data.length !== 0) {
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
                  this.dialog.disabled = true;
                })
                .catch(() => {
                  this.$message.success("取消分配!");
                });
            } else {
              this.dialog.disabled = true;
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    }
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
          this.accTelPoolService
            .leaveTelCase({
              caseIds: amount,
              type: 0,
              companyCode: this.returnCModle.companyCode
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
          this.accVisitPoolService
            .cancelLeaveCase({
              caseIds: amount
              // type: 0,
              // companyCode: this.returnCModle.companyCode
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
   * 提前流转
   */
  async applyFlowClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要流转的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      let data: any = await this.$prompt("请输入申请原因：", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).catch(() => {});

      let amount = this.selectionList.map(v => v.caseId);

      this.accTelPoolService
        .telAdvanceCirculation({
          caseIds: amount,
          type: 0,
          reason: data.value
        })
        .subscribe(
          data => {
            this.refreshData();
            this.$message.success("申请提前流转成功！");
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
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
<style>
.red-row > td {
  background: #f8d0d1 !important;
}

.green-row > td {
  background: #d0edd8 !important;
}

.blue-row > td {
  background: #cedfee !important;
}

.white-row > td {
  background: #ffffff !important;
}
</style>
