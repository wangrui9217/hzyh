// 待催收
<template>
  <section class="page wait-collection">
    <!--输入区域-->
    <data-form :model="waitModle" @onSearch="refreshData" :page="pageService" :buttonWrap="true" :rules="waitRule" @handleResetForm="follFeedback">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请号"  prop="caseNumber">
          <el-input v-model="waitModle.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5023">
          <el-input v-model="waitModle.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5024">
          <el-input v-model="waitModle.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="身份证号" prop="idCard" v-auth="5031">
          <el-input v-model="waitModle.idCard"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5027">
          <el-input v-model="waitModle.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptCodes" v-auth="5028">
          <el-cascader v-model="waitModle.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'code',label:'name'}" change-on-select :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="案件标记" prop="caseMark" v-auth="5025">
          <el-select v-model="waitModle.caseMark" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0028')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5026">
          <el-select v-model="waitModle.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName" v-auth="5029">
          <el-input v-model="waitModle.collectorName"></el-input>
        </el-form-item>
        <el-form-item label="协催方式" prop="assistWay" v-auth="5032">
          <el-select v-model="waitModle.assistWay" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0006')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="inline-box">
          <el-form-item label="逾期金额" prop="caseMoney" v-auth="5033">
            <number-range v-model="waitModle.caseMoney"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="逾期期数" prop="payStatus" v-auth="5030">
          <el-select v-model="waitModle.payStatus" placeholder="请选择" clearable>
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
          <el-form-item label="逾期天数" prop="dayRange" v-auth="6000">
            <number-range v-model="waitModle.dayRange" :isInteger="true"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="催收反馈" prop="follFeedbacks" >
          <el-cascader v-model="waitModle.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="产品类型" prop="seriesName" >
          <el-select v-model="waitModle.seriesName" placeholder="请选择" clearable>
            <el-option v-for="{id,seriesName} in productType" :key="id" :label="seriesName" :value="seriesName"></el-option>
          </el-select>
        </el-form-item>
        <el-table-column prop="deptName" label="机构" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker  type="date" class="promise" :editable="false" v-model="waitModle.caseFollowInTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
         <el-form-item label="流转去向" prop="turnToPool" >
          <el-select v-model="waitModle.turnToPool" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0258')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流转状态" prop="turnApprovalStatus" >
          <el-select v-model="waitModle.turnApprovalStatus" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0048')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诉讼阶段" prop="lawsuitResult" >
          <el-select v-model="waitModle.lawsuitResult" placeholder="请选择" clearable disabled>
            <el-option  key="" label="初始" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反欺诈反馈" prop="antiFraudResult" >
          <el-select v-model="waitModle.antiFraudResult" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0255')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="personalType" >
          <el-select v-model="waitModle.personalType" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0252')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称"  prop="productName" >
          <el-input v-model="waitModle.productName"></el-input>
        </el-form-item>
        <el-form-item label="省份/城市" prop="cityList">
            <el-cascader v-model="waitModle.cityList" :options="$city.getCityData({ level : 2 })" change-on-select clearable></el-cascader>
        </el-form-item>
      </template>
      <template slot="default-button">
        <!--按钮区域-->
        <el-button @click="batchClick" v-auth="6001">批量分配</el-button>
        <!-- <el-button @click="leaveCaseClick" v-auth="6002">留案</el-button> -->
        <!-- <el-button @click="cancleleaveCase" v-auth="6003">取消留案</el-button> -->
        <!-- <el-button @click="applyFlowClick" v-auth="6004">提前流转</el-button> -->
        <el-button @click="circulationClick" v-auth="6004">申请流转</el-button>

      </template>
      <template slot="append">
        <el-radio-group v-model="caseMark" @change="ColorChange" style="margin-top:3px">
          <el-radio :label="126">无色</el-radio>
          <el-radio :label="127">红色</el-radio>
          <el-radio :label="128">蓝色</el-radio>
          <el-radio :label="129">绿色</el-radio>
        </el-radio-group>
      </template>
    </data-form>

    <data-box :data="waitDataSet" :rowClass="rowClass" :selectionList.sync="selectionList" @onPageChange="refreshData" :sort="sortService" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="phoneRecord(scope)" type="text" v-auth="6005">电话录音</el-button>
            <el-button @click="repair=scope.row,dialog.FollowRecord=true" type="text" v-auth="6006">跟进明细</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" sortable='custom' :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>申请号: {{ scope.row.caseNumber }}</p>
              <span slot="reference" class="name-wrapper">
                <el-button type="text" @click="openAccCenter({caseId:scope.row.caseId,searchModel:waitModle})">{{scope.row.caseNumber}}</el-button>
              </span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
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
        <el-table-column prop="batchNumber" label="批次号" sortable='custom' :min-width="$helper.getColumnWidth(4)">
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
            <span>{{scope.row.principalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="机构" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
         <el-table-column prop="turnToPool" label="流转去向" :min-width="$helper.getColumnWidth(4)">
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
    <el-dialog title="电话录音" :visible.sync="dialog.phonerecord" @open="phoneRecordOpen" :center="true">
      <PhoneRecord ref="phonerecord" :caseCallNumber="caseCallNumber"></PhoneRecord>
    </el-dialog>
    <!--查看案件明细的案件跟进记录-->
    <el-dialog :title="repair.caseNumber+'案件跟进明细'" width="90%" :visible.sync="dialog.FollowRecord" :center="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <FollowRecord :caseNumber="repair.caseNumber"></FollowRecord>
    </el-dialog>
    <el-dialog title="批量分配" :visible.sync="dialog.disabled" @open="loadData" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <MassDistribution :selectionList="selectionList"  @close="dialog.disabled=false" @refresh="refreshData" ref="refresh" :typeId="typeId"></MassDistribution>
    </el-dialog>
     <!-- 申请流转 -->
    <el-dialog title="案件申请流转" width="40%" :visible.sync="dialog.circulation" :center="true" :close-on-click-modal="false" :close-on-press-escape="false" @close="$refs['application-circulation'].reset()">
      <application-circulation :selectFilter="854" :caseNumber="circulationCaseId" @close="dialog.circulation=false;refreshData()" ref="application-circulation"></application-circulation>
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
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import { UserService } from "~/services/business-service/user.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import PhoneRecord from "~/components/message-acc/phone-record.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import MassDistribution from "~/components/assist-acc/mass-distribution.vue";
import ApplicationCirculation from "~/components/call-case/application-circulation.vue";

import { State, Action, namespace, Getter } from "vuex-class";
import clone from "clone";

const accManageModule = namespace("acc-manage");

@Auth(3)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    PhoneRecord,
    FollowRecord,
    MassDistribution,
    ApplicationCirculation
  }
})
export default class WaitCollection extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(PrincipalService) private principalService: PrincipalService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(UserService) private userService: UserService;
  @State principalList: any;
  @State userData: any;
  @State companyList: any;
  @Getter departmentData;
  @State departmentList: any;
  @accManageModule.Action openAccCenter;
  @State storeList: any;
  @Getter isSupperAdmin: boolean;

  private repair: any = {};
  private selectionList: any = [];
  private caseMark: any = "";
  private dataName: any = [];
  private orgCuponameList: any = [];
  private waitDataSet = null;
  private typeId: any = 69;
  private caseNumber: any = {};
  private CaseRowData: any = {};
  private orgNameList: any = [];
  private cupor: any = [];
  private todayPer: any = null;
  private confirmData: any = {};
  private caseCallNumber: any = {};
  private accFeedback: any = []; // 催收反馈数据
  private productType: any = {};

  private waitModle: any = {
    caseNumber: "",
    personalName: "", // 客户姓名
    mobileNo: "", // 手机号
    mobileNoX: "",
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
    followupBack: "",
    cupoAmtMin: "",
    cupoAmtMax: "",
    overdueMinAmt: "",
    overdueMaxAmt: "",
    overMinDay: "",
    overMaxDay: "",
    cupoName: "",
    deptCodes: [],
    follFeedbacks: [],
    payStatus: "", // 逾期期数
    caseMoney: { min: "", max: "" },
    dayRange: { min: "", max: "" },
    collectionType: 15,
    collectionStatusList: "20",
    shopDeptId: "",
    realPayMinAmt: "", // 最小还款金额
    realPayMaxAmt: "", // 最大还款金额
    realPayAmount: { min: "", max: "" }, // 还款金额
    seriesName: "", //产品类型
    caseFollowInTime: "", //案件流入时间
    lawsuitResult: "", // 诉讼阶段
    antiFraudResult: "", //反欺诈反馈
    personalType: "", //客户类型
    productName: "", //产品名称
    turnToPool: "", //流转去向
    turnApprovalStatus: "", //流转状态
    cityList: [] //城市
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
  private dialog: any = {
    disabled: false,
    phonerecord: false,
    FollowRecord: false,
    circulation: false //申请流转
  };
  // 电催表单验证规则
  private waitRule = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
    idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
  };
  private circulationCaseId: any = []; // 申请流转案件ID

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
  }
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.waitModle.companyCode = this.userData.companyCode;
    }
    return this.waitModle.companyCode;
  }

  set companyCode(value) {
    this.waitModle.companyCode = value;
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
        this.waitModle,
        this.pageService,
        this.sortService
      )
      .subscribe(
        data => {
          this.waitDataSet = data;
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
    this.waitModle.collectionFeedback = this.waitModle.collectionFeedbacks[
      this.waitModle.collectionFeedbacks.length - 1
    ];
    if (!this.waitModle.collectionFeedback) {
      this.waitModle.collectionFeedback = "";
    }
  }
  /**
   * 获取委托方
   */
  getDataList() {
    this.principalService
      .getPrincipalList({
        companyCode: this.waitModle.companyCode
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
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }

  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.waitModle.deptCodes.length > 0) {
      this.waitModle.deptCode = this.waitModle.deptCodes[
        this.waitModle.deptCodes.length - 1
      ];
    } else {
      this.waitModle.deptCode = "";
    }
  }
  /**
   * 获取批量分配信息
   */
  distributionData(data) {
    this.confirmData = data;
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
              let caseNumber: any = data.map(v => v.replace(/[^0-9]/gi, ""));
              this.$message.info(
                `所选案件(申请号为(${caseNumber})存在协催申请或协催案件，请重新选择案件`
              );
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
              companyCode: this.waitModle.companyCode
            })
            .subscribe(
              data => {
                this.refreshData();
                this.$message({
                  type: "success",
                  message: `留案申请成功,剩余可留案数${data.caseNum}个!`
                });
              },
              ({ msg }) => {
                this.$message.error(msg);
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
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
              companyCode: this.waitModle.companyCode
            })
            .subscribe(
              data => {
                this.refreshData();
                this.$message({
                  type: "success",
                  message: `操作成功,剩余可留案数${data.caseNum}个!`
                });
              },
              ({ msg }) => {
                this.$message.error(msg);
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
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
   * 获取催收专员案件数(批量分配)
   */
  loadData() {
    this.$nextTick(() => {
      let refresh: any = this.$refs["refresh"];
      refresh.refreshData([1]);
    });
  }
  /**
   * 电话录音
   */
  phoneRecord(scope) {
    this.dialog.phonerecord = true;
    this.caseCallNumber = scope.row.caseNumber;
  }
  /**
   * 电话录音打开
   */
  phoneRecordOpen() {
    this.$nextTick(() => {
      let phoneRecord: any = this.$refs["phoneRecord"];
      phoneRecord.refreshMessage(this.caseCallNumber);
    });
  }
  /**
   * 重置
   */
  follFeedback() {
    this.waitModle.caseMoney = "";
    this.waitModle.dayRange = "";
  }
  /**
   * 申请流转
   */
  circulationClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要申请的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.dialog.circulation = true;
      let arr = this.selectionList.slice(0, this.selectionList.length);
      this.circulationCaseId = arr.map(v => {
        return v.caseId;
      });
    }
  }
}
</script>

<style lang="less">
</style>
