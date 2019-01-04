<template>
  <section class="page inrush-undistributed-case">
    <data-form :model="undistributedModel" @onSearch="refreshData" :rules="inrushRule">
      <template slot="default-input">
        <el-form-item label="申请号" prop="caseNumber">
          <el-input v-model="undistributedModel.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName">
          <el-input v-model="undistributedModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo">
          <el-input v-model="undistributedModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="undistributedModel.idCard"></el-input>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName">
          <el-input v-model="undistributedModel.collectorName"></el-input>
        </el-form-item>
        <el-form-item label="上一个催收员" prop="lastCollectorName">
          <el-input v-model="undistributedModel.lastCollectorName"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="overdueAmount">
          <number-range v-model="undistributedModel.overdueAmount"></number-range>
        </el-form-item>
        <el-form-item label="逾期期数" prop="payStatus">
          <el-select v-model="undistributedModel.payStatus" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overDays">
          <number-range v-model="undistributedModel.overDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="催收反馈" prop="follFeedbacks">
            <el-cascader v-model="undistributedModel.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="流转来源" prop="turnFromPool">
          <el-select v-model="undistributedModel.turnFromPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} of $dict.getDictData('0254')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诉讼阶段" prop="lawsuitResult">
          <el-select v-model="undistributedModel.lawsuitResult" placeholder="请选择" clearable>
            <el-option v-for="{value,label} of $dict.getDictData('0251')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反欺诈反馈" prop="antiFraudResult">
          <el-select v-model="undistributedModel.antiFraudResult" placeholder="请选择" clearable>
            <el-option v-for="{value,label} of $dict.getDictData('0255')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="seriesName">
          <el-select v-model="undistributedModel.seriesName" placeholder="请选择" clearable>
            <el-option v-for="{seriesName,id,index} in seriesNameList" :key="index" :label="seriesName" :value="seriesName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省份" prop="parentAreaId">
          <el-select v-model="undistributedModel.parentAreaId" clearable>
            <el-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="areaId">
          <el-select v-model="undistributedModel.areaId" clearable>
            <el-option v-for="{value,label} in this.undistributedModel['parentAreaId'] ? this.$city.getCityData({ level: 1, id: this.undistributedModel['parentAreaId'] }) : []" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="跟进时间" prop="followDate">
          <el-date-picker class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="undistributedModel.followDate" placeholder="请选择日期" clearable>
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker type="date" :editable="false" v-model="undistributedModel.caseFollowInTime" placeholder="请选择日期" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="undistributedModel.productName"></el-input>
        </el-form-item>
        <el-form-item label="客户类型" prop="personalType">
          <el-select v-model="undistributedModel.personalType" clearable>
            <el-option v-for="{value,label} of $dict.getDictData('0252')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="caseAllotClick">手动分案</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :selectionList.sync="selectionList" :data="undistributedDataSet" @onPageChange="refreshData" :sort="sortService">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="detailObj = scope.row;dialog.detail = true" type="text">案件详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)"></el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column prop="mobileNo" label="手机号 " :min-width="$helper.getColumnWidth(4)">
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
        <el-table-column prop="overdueDays" label="逾期天数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="seriesName" label="产品类型" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="personalType" label="客户类型" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.personalType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName?scope.row.principalName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastCollectorName" label="上一个催收员" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="collectionStatus" label="案件状态" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
              <span>{{scope.row.collectionStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="turnFromPool" label="流转来源" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
              <span>{{scope.row.turnFromPool | dictConvert}}</span>
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
        <el-table-column prop="leaveCaseFlag" label="留案标识 " :min-width="$helper.getColumnWidth(3)">
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
        <el-table-column prop="antiFraudResult" label="反欺诈结果" :min-width="$helper.getColumnWidth(4)">
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
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="detailObj.caseId" :caseNumber="detailObj.caseNumber"></case-detail>
    </el-dialog>
    <!--选择催收机构或催收员-->
    <el-dialog title="请选择催收员" :center="true" :visible.sync="dialog.caseAllot" width="80%">
      <case-allot :modelType="[1,2]" ref="case-allot" @close="dialog.caseAllot = false" @success="batchSuccess()"></case-allot>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Mutation, Getter, namespace } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { SortService } from "~/utils/sort.service";
import { Watch } from "vue-property-decorator";
import { CaseInfoReportService } from "~/services/report-service/case-info-report.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import CaseAllot from "~/components/case-info/case-allot.vue";
import NumberRange from "~/components/common/number-range.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import clone from "clone";

const inrushCaseModule = namespace("inrush-case");

@Auth(462)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    CaseAllot,
    NumberRange,
    CaseDetail
  }
})
export default class InrushUndistributedCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(CaseInfoReportService)
  private caseInfoReportService: CaseInfoReportService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;

  @State userData: any;
  @State principalList: any;
  @State seriesNameList;
  @Getter departmentData;
  @inrushCaseModule.Mutation updateSelectedCase;
  @inrushCaseModule.Mutation updateSelectedList;
  @inrushCaseModule.Mutation updateWaitCollectCase;
  @Watch("undistributedModel.deptCodes")
  deptCodesChange() {
    this.getcupoName();
  }
  @Watch("undistributedModel.follFeedbacks")
  follFeedbacksChange() {
    this.feedbackChange();
  }
  private undistributedModel: any = {};
  private accFeedback: any = []; // 催收反馈数据
  private undistributedDataSet: Array<any> = [];
  private selectionList: any = [];
  private dialog: any = {};
  private detailObj: any = {};
  private caseStatus = []; // 案件状态
  // 表单验证规则
  private inrushRule = {};
  created() {
    this.undistributedModel = {
      caseNumber: "", // 申请号
      personalName: "", // 客户姓名
      mobileNo: "", // 客户手机号
      idCard: "", // 身份证号
      collectionStatusList: "25",
      batchNumber: "",
      collectorName: "", // 当前催收员
      lastCollectorName: "", // 上一个催收员
      overdueAmount: {
        // 案件金额
        min: "",
        max: ""
      },
      payStatus: "", // 逾期期数
      overDays: {
        // 逾期天数
        min: "",
        max: ""
      },
      followupBack: "", // 催收反馈
      follFeedbacks: [], // 催收反馈数据
      turnFromPool: "", // 流转来源
      lawsuitResult: "", // 诉讼阶段
      antiFraudResult: "", // 反欺诈状态(反馈)
      seriesName: "", // 产品类型
      parentAreaId: "", // 省份ID
      areaId: "", // 城市ID
      followDate: "", // 跟进时间
      caseFollowInTime: "", // 案件流入时间
      productName: "", // 产品名称
      personalType: "", // 客户类型
      deptCodes: [],
      deptCode: "",
      collectionStatus: ""
    };
    this.dialog = {
      detail: false,
      caseAllot: false
    };

    this.inrushRule = {
      mobileNo: { validator: this.$validator.phoneNumber, trigger: "blur" },
      idCard: { validator: this.$validator.idCard, trigger: "blur" }
    };
    let acc: any = this.$dict.getDictData("0004");
    this.caseStatus = acc.filter(v => v.value != "25");
  }

  mounted() {
    this.undistributedModel.companyCode = this.userData.companyCode;
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
  }
  batchSuccess() {
    this.refreshData();
    this.dialog.caseAllot = false;
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.undistributedModel.followupBack = this.undistributedModel.follFeedbacks[
      this.undistributedModel.follFeedbacks.length - 1
    ];
    if (!this.undistributedModel.followupBack) {
      this.undistributedModel.followupBack = "";
    }
  }
  refreshData() {
    this.caseInfoInquiryService
      .getInnerWaitCollectCase(
        this.undistributedModel,
        this.pageService,
        this.sortService
      )
      .subscribe(
        data => {
          (this.undistributedDataSet = data), this.updateWaitCollectCase(data);
        },
        err => this.$message.error(err.msg)
      );
  }
  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.undistributedModel.deptCodes.length > 0) {
      this.undistributedModel.deptCode = this.undistributedModel.deptCodes[
        this.undistributedModel.deptCodes.length - 1
      ];
    } else {
      this.undistributedModel.deptCode = "";
    }
  }
  /**
   * 手动分案
   */
  caseAllotClick() {
    if (this.selectionList.length === 0) {
      this.$message("请选择分案的案件!");
      return;
    }
    //选案获取案件id
    let caseIds: string[] = this.selectionList.map(v => v.caseId);
    //提交id
    this.updateSelectedCase(caseIds);
    this.updateSelectedList(this.selectionList);
    this.dialog.caseAllot = true;
  }
}
</script>

<style lang="less">
</style>
