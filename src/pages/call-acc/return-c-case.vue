// 归C案件
<template>
  <section class="page return-c-case">
    <data-form :model="callModle" @onSearch="refreshData" :page="pageService" :buttonWrap="true" :rules="rules" @handleResetForm="follFeedback">
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请号"  prop="caseNumber">
          <el-input v-model="callModle.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" >
          <el-input v-model="callModle.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" >
          <el-input v-model="callModle.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item prop="idCard" label="身份证号" >
          <el-input v-model="callModle.idCard"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" >
          <el-input v-model="callModle.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptCodes" >
          <el-cascader v-model="callModle.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'code',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="案件标记" prop="caseMark" >
          <el-select v-model="callModle.caseMark" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0028')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" >
          <el-select v-model="callModle.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="当前催收员" prop="collectorName" >
          <el-input v-model="callModle.collectorName"></el-input>
        </el-form-item>
        <el-form-item label="协催方式" prop="assistWay" >
          <el-select v-model="callModle.assistWay" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0006')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
         <div class="inline-box">
          <el-form-item label="逾期金额" prop="caseMoney" >
            <number-range v-model="callModle.caseMoney"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="逾期期数" prop="payStatus" >
          <el-select v-model="callModle.payStatus" placeholder="请选择" clearable>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <div class="inline-box">
          <el-form-item label="逾期天数" prop="dayRange" >
            <number-range v-model="callModle.dayRange" :isInteger="true"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="催收反馈" prop="follFeedbacks" >
          <el-cascader v-model="callModle.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-table-column prop="deptName" label="机构" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
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
          <el-date-picker  class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="callModle.followupTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker  type="date" class="promise" :editable="false" v-model="callModle.caseFollowInTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
         <el-form-item label="产品类型" prop="seriesName" >
          <el-select v-model="callModle.seriesName" placeholder="请选择" clearable>
            <el-option v-for="{id,seriesName} in productType" :key="id" :label="seriesName" :value="seriesName"></el-option>
          </el-select>
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
      <template slot="default-button">
        <!--按钮区域-->
      </template>
      <template slot="append">
      </template>
    </data-form>

    <data-box :rowClass="rowClass" :data="callAccDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :sort="sortService" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="phoneRecord(scope)" type="text" >电话录音</el-button>
            <el-button @click="repair=scope.row,dialog.FollowRecord=true" type="text" >跟进明细</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" sortable='custom' :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>申请号: {{ scope.row.caseNumber }}</p>
              <span slot="reference" class="name-wrapper">
                 <el-button type="text" @click="openAccCenter({caseId:scope.row.caseId,searchModel:callModle})">{{scope.row.caseNumber}}</el-button>
              </span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)" sortable='custom'>
        </el-table-column>
        <el-table-column prop="cityName" label="地区" sortable='custom' :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
           <template slot-scope="scope">
            <span>{{ scope.row.areaName?scope.row.areaName:""}}</span>
            <span>{{ scope.row.cityName?scope.row.cityName:""}}</span>
          </template>
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
        <el-table-column prop="batchNumber" label="批次号" sortable='custom' :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="personalType" label="客户类型" sortable='custom' :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" label="产品类型" sortable='custom' :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" sortable='custom' :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="机构" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="流转来源" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
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
        <el-table-column prop="assistWay" label="协催方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.assistWay | dictConvert}}</span>
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
      </template>
    </data-box>
    <el-dialog title="电话录音" :visible.sync="dialog.phonerecord" @open="phoneRecordOpen" align="center">
      <PhoneRecord ref="phoneRecord"></PhoneRecord>
    </el-dialog>
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
import { PrincipalService } from "~/services/business-service/principal.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { DepartmentService } from "~/services/business-service/department.service";
import { UserService } from "~/services/business-service/user.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import { SortService } from "~/utils/sort.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import PhoneRecord from "~/components/message-acc/phone-record.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import { State, Action, namespace, Getter } from "vuex-class";
import MassDistribution from "~/components/assist-acc/mass-distribution.vue";
import clone from "clone";

const accManageModule = namespace("acc-manage");

@Auth(8)
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
export default class ReturnCCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(PrincipalService) private principalService: PrincipalService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(DepartmentService) private departmentService: DepartmentService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
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
  private dialog: any = {
    phonerecord: false,
    FollowRecord: false
  };
  private rules: any = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
    idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
  };
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
  private callModle: any = {
    caseNumber:"",
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
    follFeedbacks: [],
    payStatus: "", // 逾期期数
    employeeRealName: "", // 业务经理
    deptName: "", // 门店
    collectionType: 15,
    collectionStatusList: "800",
    shopDeptId: "",
    realPayMinAmt: "", // 最小还款金额
    realPayMaxAmt: "", // 最大还款金额
    realPayAmount: { min: "", max: "" }, // 还款金额
    lawsuitResult: "", //诉讼阶段
    antiFraudResult: "", //反欺诈反馈
    followupTime: "", //跟进时间
    caseFollowInTime: "", //案件流入时间
    seriesName: "", //产品类型
    cityList: [], //城市
    personalType: "", //客户类型
    turnFromPool: "", //流转来源
    turnToPool: "", //流转去向
    turnApprovalStatus: "", //流转状态
    productName: "" //产品名称
  };
  private productType: any = {};
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
   * 重置
   */
  follFeedback() {
    this.callModle.followupBack = "";
    this.callModle.caseMoney = "";
    this.callModle.dayRange = "";
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
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
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
   * 颜色标记
   */
  ColorChange() {
    if (this.caseMark) {
      if (this.selectionList.length === 0) {
        this.$alert("请选择要标记的案件", "提示", {
          confirmButtonText: "确定"
        });
        this.caseMark = "";
      } else {
        let arr = this.selectionList.slice(0, this.selectionList.length);
        let amount = arr.map(v => {
          return v.caseId;
        });
        this.accTelPoolService
          .telCaseMarkColor({
            caseIds: amount,
            colorNum: this.caseMark
          })
          .subscribe(
            data => {
              this.caseMark = "";
              this.refreshData();
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
      }
    }
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
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  /**
   * 获取催收专员案件数(批量分配)
   */
  loadData() {
    this.$nextTick(() => {
      let refresh: any = this.$refs["refresh"];
      refresh.refreshData();
    });
  }
  /**
   * 电话录音
   */
  phoneRecord(scope) {
    this.dialog.phonerecord = true;
    this.caseNumber = scope.row.caseNumber;
  }
  /**
   * 电话录音打开
   */
  phoneRecordOpen() {
    this.$nextTick(() => {
      let phoneRecord: any = this.$refs["phoneRecord"];
      phoneRecord.refreshMessage(this.caseNumber);
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
