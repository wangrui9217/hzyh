<template>
  <section class="page call-handled-case">
    <data-form :model="handleModle" @onSearch="refreshData" :page="pageService" :buttonWrap="true" :rules="rules" @handleResetForm="follFeedback">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请号"  prop="caseNumber">
          <el-input v-model="handleModle.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5070">
          <el-input v-model="handleModle.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5071">
          <el-input v-model="handleModle.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input" prop="deptCodes">
        <el-form-item label="身份证号" prop="idCard" v-auth="5077">
          <el-input v-model="handleModle.idCard"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5075">
          <el-input v-model="handleModle.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="机构" v-auth="5072">
          <el-cascader v-model="handleModle.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'code',label:'name'}" change-on-select :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="案件标记" prop="caseMark" v-auth="5037">
          <el-select v-model="handleModle.caseMark" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0028')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5074">
          <el-select v-model="handleModle.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName" v-auth="5073">
          <el-input v-model="handleModle.collectorName"></el-input>
        </el-form-item>
        <el-form-item label="协催方式" prop="assistWay" v-auth="5032">
          <el-select v-model="handleModle.assistWay" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0006')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="inline-box">
          <el-form-item label="逾期金额" prop="caseMoney" v-auth="5080">
            <number-range v-model="handleModle.caseMoney"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="逾期期数" prop="payStatus" v-auth="5076">
          <el-select v-model="handleModle.payStatus" placeholder="请选择" clearable>
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
          <el-form-item label="逾期天数" prop="dayRange" v-auth="5078">
            <number-range v-model="handleModle.dayRange" :isInteger="true"></number-range>
          </el-form-item>
        </div>
        <el-table-column prop="deptName" label="机构" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-form-item label="催收反馈" prop="follFeedbacks" >
          <el-cascader v-model="handleModle.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="流转来源" prop="turnFromPool" >
        <el-select v-model="handleModle.turnFromPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in turnFromPoolOption" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="诉讼阶段" prop="lawsuitResult" >
          <el-select v-model="handleModle.lawsuitResult" placeholder="请选择" clearable disabled>
              <el-option  key="" label="初始" value=""></el-option>
          </el-select>
        </el-form-item> 
         <el-form-item label="反欺诈反馈" prop="antiFraudResult" >
          <el-select v-model="handleModle.antiFraudResult" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0255')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进时间" prop="followupTime" >
          <el-date-picker  class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="handleModle.followupTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker  type="date" class="promise" :editable="false" v-model="handleModle.caseFollowInTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="产品类型" prop="seriesName" >
          <el-select v-model="handleModle.seriesName" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0256')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="personalType" >
          <el-select v-model="handleModle.personalType" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0252')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称"  prop="productName" >
          <el-input v-model="handleModle.productName"></el-input>
        </el-form-item>
        <el-form-item label="省份/城市" prop="cityList">
            <el-cascader v-model="handleModle.cityList" :options="$city.getCityData({ level : 2 })" change-on-select clearable></el-cascader>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="handleDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :sort="sortService" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="caseInstructClick(scope)" v-auth="5081" type="text" v-if="scope.row.collectionStatus===24">结案说明</el-button>
            <el-button @click="repair=scope.row,dialog.FollowRecord=true" type="text" v-auth="5082">跟进明细</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号 " :min-width="$helper.getColumnWidth(5)" sortable='custom'>
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号 " :min-width="$helper.getColumnWidth(4)">
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
        <el-table-column prop="overdueAmount" label="逾期金额(元) " :min-width="$helper.getColumnWidth(5)" sortable='custom' align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数 " :min-width="$helper.getColumnWidth(4)" sortable='custom'>
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
        <el-table-column prop="productName" label="产品名称" sortable='custom' :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="机构" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="collectorName" label="电话催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
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
import { UserService } from "~/services/business-service/user.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import { State, Getter } from "vuex-class";
import clone from "clone";

@Auth(7)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    FollowRecord
  }
})
export default class CallHandledCase extends Vue {
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
  @State departmentList: any;
  @Getter departmentData;
  @State storeList: any;
  @Getter isSupperAdmin: boolean;

  private repair: any = {};
  private caseNumber: any = {};
  private CaseRowData: any = {};
  private selectionList: any = [];
  private dataName: any = [];
  private orgNameList: any = [];
  private accFeedback: any = []; // 催收反馈数据
  private handleDataSet = null;
  private handleModle: any = {
    caseNumber: "",
    collectorName: "", // 催收员
    personalName: "", // 客户姓名
    payStatus: "", // 逾期期数
    orderId: "", // 订单号
    principalId: "", // 委托方
    idCard: "", // 身份证
    companyCode: "", // 公司code
    mobileNo: "", // 手机号
    cupoPhoneX: "",
    overdueDays: ["", ""], // 逾期天数
    deptCodes: [],
    batchNumber: "", // 批次号
    collectionStatus: "", // 状态
    deptCode: "", // 机构
    overdueMinAmt: "", // 最小案件金额
    overdueMaxAmt: "", // 最大案件金额
    overMaxDay: "", // 最大逾期天数
    overMinDay: "", // 最小逾期天数
    realPayMinAmt: "", // 最小还款金额
    realPayMaxAmt: "", // 最大还款金额
    realPayAmount: { min: "", max: "" }, // 还款金额
    dayRange: { min: "", max: "" },
    caseMoney: { min: "", max: "" },
    collectionType: 15,
    collectionStatusList: "24",
    shopDeptId: "",
    caseMark: "", //案件标记
    seriesName: "", //产品类型
    follFeedbacks: "", //催收反馈
    lawsuitResult: "", //诉讼阶段
    antiFraudResult: "", //反欺诈反馈
    followupTime: "", //跟进时间
    caseFollowInTime: "", //案件流入时间
    personalType: "", //客户类型
    productName: "", //产品名称
    assistWay: "", //协催方式
    turnFromPool: "", //流转来源
    turnToPool: "", //流转去向
    turnApprovalStatus: "", //流转状态
    cityList: [] //城市
  };
  private dialog: any = {
    disabled: false,
    phonerecord: false,
    FollowRecord: false
  };
  private rules: any = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
    idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
  };
  private productType: any = {};
  private turnFromPoolOption: any = {}; //流转来源过滤后数据

  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.handleModle.followupBack = this.handleModle.follFeedbacks[
      this.handleModle.follFeedbacks.length - 1
    ];
    if (!this.handleModle.followupBack) {
      this.handleModle.followupBack = "";
    }
  }
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.handleModle.companyCode = this.userData.companyCode;
    }
    return this.handleModle.companyCode;
  }

  set companyCode(value) {
    this.handleModle.companyCode = value;
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
  refreshData() {
    this.caseInfoInquiryService
      .getCaseInfoByCondition(
        this.handleModle,
        this.pageService,
        this.sortService
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
    this.sortService.update("latelyPayDate", "desc");
    this.sortService.update("operatorTime", "desc");
    this.refreshData();
    this.getProductType();
    let turnFrom: any = this.$dict.getDictData("0254");
    this.turnFromPoolOption = turnFrom.filter(
      v => v.value != "825" && v.value != "826"
    );
  }
  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.handleModle.deptCodes.length > 0) {
      this.handleModle.deptCode = this.handleModle.deptCodes[
        this.handleModle.deptCodes.length - 1
      ];
    } else {
      this.handleModle.deptCode = "";
    }
  }
  /**
   * 获取委托方
   */
  getDataList() {
    this.principalService
      .getPrincipalList({
        companyCode: this.handleModle.companyCode
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
   * 结案说明
   */
  caseInstructClick(scope) {
    if (scope.row.endRemark) {
      this.$alert(scope.row.endRemark, "结案说明", {
        confirmButtonText: "确定"
      });
    } else {
      this.$message("该案件没有结案说明！");
    }
  }
  /**
   * 重置
   */
  follFeedback() {
    this.handleModle.caseMoney = "";
    this.handleModle.dayRange = "";
  }
}
</script>

<style lang="less">
</style>
