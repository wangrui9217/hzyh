<template>
  <!-- 停催案件管理-待分配案件 --> 
  <section class="page stop-in-the-collection">
    <data-form :model="searchModel" @onSearch="refreshData" :page="pageService" :rules="searchRule">
      <template slot="default-input">
         <el-form-item label="申请号" prop="caseNumber">
          <el-input v-model="searchModel.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName">
          <el-input v-model="searchModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo">
          <el-input v-model="searchModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="searchModel.idCard" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptCodes">
          <el-cascader v-model="searchModel.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'code',label:'name'}" change-on-select :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="产品类型" prop="seriesName">
          <el-select v-model="searchModel.seriesName" placeholder="请选择" clearable>
            <el-option v-for="{seriesName,id,index} in seriesNameList" :key="index" :label="seriesName" :value="seriesName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName">
          <el-input v-model="searchModel.collectorName"></el-input>
        </el-form-item>
        <el-form-item label="上一个催收员" prop="lastCollectorName">
          <el-input v-model="searchModel.lastCollectorName"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amtRange">
          <number-range v-model="searchModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="逾期期数" prop="payStatus">
          <el-select v-model="searchModel.payStatus" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays">
          <number-range v-model="searchModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="催收反馈" prop="follFeedbacks">
          <el-cascader v-model="searchModel.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="流转来源" prop="turnFromPool">
          <el-select v-model="searchModel.turnFromPool" placeholder="请选择" clearable>
            <el-option v-for="{value, label} in $dict.getDictData('0254')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诉讼阶段" prop="lawsuitResult">
          <el-select v-model="searchModel.lawsuitResult" placeholder="请选择" clearable>
            <el-option v-for="{value,label} of $dict.getDictData('0251')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反欺诈反馈" prop="antiFraudResult">
          <el-select v-model="searchModel.antiFraudResult" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0255')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进时间" prop="followupTime">
          <el-date-picker class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="searchModel.followupTime" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker  type="date" class="promise" :editable="false" v-model="searchModel.caseFollowInTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="流转去向" prop="turnToPool">
          <el-select v-model="searchModel.turnToPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0258')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流转状态" prop="turnApprovalStatus">
          <el-select v-model="searchModel.turnApprovalStatus" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0048')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="personalType">
          <el-select v-model="searchModel.personalType" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0252')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="searchModel.productName"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="parentAreaId">
          <el-select v-model="searchModel.parentAreaId" clearable>
            <el-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="areaId">
          <el-select v-model="searchModel.areaId" clearable>
            <el-option v-for="{value,label} in this.searchModel['parentAreaId'] ? this.$city.getCityData({ level: 1, id: this.searchModel['parentAreaId'] }) : []" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="redistribution">重新分配</el-button>
        <el-button @click="circulationClick">申请流转</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :selectionList.sync="selectionList" :data="dataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="detailObj = scope.row;dialog.detail = true" type="text">案件详情</el-button>
            <el-button @click="detailObj = scope.row;dialog.followRecord = true" type="text">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>申请号: {{ scope.row.caseNumber }}</p>
              <span slot="reference" class="name-wrapper">
                 <el-button type="text" @click="openAccCenter({caseId:scope.row.caseId, searchModel:searchModel,caseRepairId:scope.row.caseRepairId})">{{scope.row.caseNumber}}</el-button>
              </span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column prop="mobileNo" label="手机号 " :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="cityName" label="地区" :min-width="$helper.getColumnWidth(3)">
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
        <el-table-column prop="overdueAmount" label="逾期金额(元) " align="right" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">{{scope.row.overdueAmount|toThousands}}</template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="personalType" label="客户类型" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.personalType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" label="产品类型" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="lastCollectorName" label="上一个催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="deptName" label="机构" :min-width="$helper.getColumnWidth(4)"> </el-table-column>
        <el-table-column prop="turnFromPool" label="流转来源" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.turnFromPool| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFollowInTime" label="案件流入时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{ scope.row.caseFollowInTime| dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupTime" label="跟进时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{ scope.row.followupTime| dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupBack" label="催收反馈" show-overflow-tooltip	 :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <span>{{scope.row.followupBack|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="turnToPool" label="流转去向 " :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.turnToPool| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="turnApprovalStatus" label="流转审核状态" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{ scope.row.turnApprovalStatus| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lawsuitResult" label="诉讼阶段" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.lawsuitResult| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="antiFraudResult" label="反欺诈结果" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.antiFraudResult| dictConvert}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!-- 申请流转 -->
    <el-dialog title="案件申请流转" width="40%" :visible.sync="dialog.circulation" :center="true" :close-on-click-modal="false" :close-on-press-escape="false" @close="$refs['application-circulation'].reset()">
      <application-circulation :selectFilter="857" :caseNumber="circulationCaseId" @close="dialog.circulation=false;refreshData();" ref="application-circulation"></application-circulation>
    </el-dialog>
    <!-- 案件详情 -->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="detailObj.caseId" :caseNumber="detailObj.caseNumber"></case-detail>
    </el-dialog>
    <!-- 跟进记录 -->
    <el-dialog :title="detailObj.caseNumber+'案件跟进明细'" :center="true" :visible.sync="dialog.followRecord" append-to-body width="90%">
      <follow-record :caseNumber="detailObj.caseNumber"></follow-record>
    </el-dialog>
    <!--选择催收机构或催收员-->
    <el-dialog :title="changeTitle" :center="true" :visible.sync="dialog.caseAllot" append-to-body width="80%" >
      <case-allot :modelType="[506]" ref="case-allot" @parentTitle="parentTitle" @close="dialog.caseAllot = false" @success="refreshData();dialog.caseAllot = false"></case-allot>
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
import NumberRange from "~/components/common/number-range.vue";
import { State, Getter, namespace } from "vuex-class";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import ApplicationCirculation from "~/components/call-case/application-circulation.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import CaseAllot from "~/components/case-info/case-allot.vue";
import { Watch } from "vue-property-decorator";
import clone from "clone";
const accManageModule = namespace("acc-manage");
const inrushCaseModule = namespace("inrush-case");
const stopCaseModule = namespace("stop-case");

@Auth(1302)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    CaseDetail,
    ApplicationCirculation,
    FollowRecord,
    CaseAllot
  }
})
export default class StopInTheCollection extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;

  @Getter departmentData;
  @State seriesNameList;
  @accManageModule.Action openAccCenter;
  @inrushCaseModule.Mutation updateSelectedCase;
  @inrushCaseModule.Mutation updateSelectedList;
  @stopCaseModule.State stopCaseList;
  @Watch("searchModel.deptCodes")
  deptCodesChange() {
    this.getcupoName();
  }
  @Watch("searchModel.follFeedbacks")
  follFeedbacksChange() {
    this.feedbackChange();
  }
  @Watch("stopCaseList")
  refresh() {
    this.refreshData();
  }
  private searchModel: any = {
    caseNumber: "",
    personalName: "",
    mobileNo: "",
    idCard: "",
    batchNumber: "",
    deptCodes: [],
    deptCode: "",
    seriesName: "",
    turnFromPool: "",
    turnToPool: "",
    turnApprovalStatus: "",
    collectorName: "",
    lastCollectorName: "",
    amtRange: {
      min: "",
      max: ""
    },
    payStatus: "",
    overdueDays: {
      min: "",
      max: ""
    },
    follFeedbacks: [],
    followupBack: "",
    sourceType: "",
    lawsuitResult: "",
    antiFraudResult: "",
    followupTime: [],
    caseFollowInTime: "",
    personalType: "",
    productName: "",
    parentAreaId: "",
    areaId: "",
    casePoolType: "802",
    collectionStatusList: "20,21",
    collectionType: "859"
  };
  private changeTitle: any = "请选择催收员";
  private detailObj: any = {};
  private searchRule: any = {};
  private dataSet: any = null;
  private productType: any = null;
  private selectionList: any = [];
  private accFeedback: any = []; // 催收反馈数据
  private dialog: any = {
    circulation: false, //申请流转
    detail: false, //案件详情
    caseAllot: false, //重新分配
    followRecord: false //跟进记录
  };
  private circulationCaseId: any = []; // 申请流转案件ID
  created() {
    this.getFeedback();
  }
  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.caseInfoInquiryService
      .getCaseByPoolTypeAndCondition(
        this.searchModel,
        this.pageService,
        this.sortService
      )
      .subscribe(
        data => (this.dataSet = data),
        err => this.$message.error(err.msg)
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
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.searchModel.deptCodes.length > 0) {
      this.searchModel.deptCode = this.searchModel.deptCodes[
        this.searchModel.deptCodes.length - 1
      ];
    } else {
      this.searchModel.deptCode = "";
    }
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.searchModel.followupBack = this.searchModel.follFeedbacks[
      this.searchModel.follFeedbacks.length - 1
    ];
    if (!this.searchModel.followupBack) {
      this.searchModel.followupBack = "";
    }
  }
  /**
   * 获取催收反馈下拉菜单
   */
  getFeedback() {
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
  }
  /**
   * 重新分配
   */
  redistribution() {
    this.dialog.caseAllot = this.checkSelection();
  }
  checkSelection() {
    if (this.selectionList.length === 0) {
      this.$message("请选择案件！");
      return false;
    } else {
      let caseIds: any = this.selectionList.map(v => v.caseId);
      this.updateSelectedCase(caseIds,this.selectionList);
      this.updateSelectedList(this.selectionList);
      return true;
    }
  }
  parentTitle(val) {
    switch (val) {
      case 1:
        this.changeTitle = "请选择催收员";
        break;
      case 0:
        this.changeTitle = "请选择机构";
        break;
      default:
        this.changeTitle = "请选择催收员";
    }
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
