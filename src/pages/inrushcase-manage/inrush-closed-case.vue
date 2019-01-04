<template>
  <section class="page inrush-closed-case">
    <data-form :model="searchModel" @onSearch="refreshData" :rules="Rule">
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
          <el-input v-model="searchModel.idCard"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber">
          <el-input v-model="searchModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptCodes">
          <el-cascader v-model="searchModel.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'code',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
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
        <el-form-item label="协催方式" prop="assistWay">
          <el-select v-model="searchModel.assistWay" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0006')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期金额" prop="overdueAmount">
          <number-range v-model="searchModel.overdueAmount"></number-range>
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
        <el-form-item label="逾期天数" prop="overDays">
          <number-range v-model="searchModel.overDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="催收反馈" prop="followupBacks">
            <el-cascader v-model="searchModel.followupBacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="流转来源" prop="turnFromPool">
          <el-select v-model="searchModel.turnFromPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} of $dict.getDictData('0254')" :key="value" :label="label" :value="value">
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
            <el-option v-for="{value,label} of $dict.getDictData('0255')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进时间" prop="followDate">
          <el-date-picker class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="searchModel.followDate" placeholder="请选择日期" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker type="date" :editable="false" v-model="searchModel.caseFollowInTime" placeholder="请选择日期" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户类型" prop="personalType">
          <el-select v-model="searchModel.personalType" clearable>
            <el-option v-for="{value,label} of $dict.getDictData('0252')" :key="value" :label="label" :value="value"></el-option>
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
        <!-- <el-button @click="exportfollowRecordClick">导出跟进记录</el-button> -->
        <el-button @click="setExportItemsClick" type="text">设置导出项</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :selectionList.sync="selectionList" :data="DataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="detailObj = scope.row;dialog.detail = true" type="text">案件详情</el-button>
            <el-button @click="detailObj = scope.row;dialog.followRecord = true" type="text">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
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
        <el-table-column prop="overdueAmount" label="逾期金额(元) " align="right" :min-width="$helper.getColumnWidth(4)">
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
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName?scope.row.principalName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="turnFromPool" label="流转来源" :min-width="$helper.getColumnWidth(4)">
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
        </el-table-column>
        <el-table-column prop="antiFraudResult" label="反欺诈结果" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="closeDate" label="到期日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
              <span v-if="scope.row.leaveCaseFlag=='1'">{{scope.row.closeDate | dateFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--设置导出项-->
    <el-dialog title="设置导出项" :visible.sync="dialog.setExportItems" width="50%" :center="true">
      <set-export-items ref="set-export-items" :category="category" @close="dialog.setExportItems=false"></set-export-items>
    </el-dialog>
    <!-- 跟进记录 -->
    <el-dialog :title="detailObj.caseNumber+'案件跟进明细'" :center="true" :visible.sync="dialog.followRecord" append-to-body width="90%">
      <follow-record :caseNumber="detailObj.caseNumber"></follow-record>
    </el-dialog>
    <!-- 案件详情 -->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="detailObj.caseId" :caseNumber="detailObj.caseNumber"></case-detail>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { SortService } from "~/utils/sort.service";
import { ExportFollowupService } from "~/services/report-service/export-followup.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import SetExportItems from "~/components/inrushcase-manage/set-export-items.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import NumberRange from "~/components/common/number-range.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import { Watch } from "vue-property-decorator";
import clone from "clone";

@Auth(461)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    SetExportItems,
    FollowRecord,
    NumberRange,
    CaseDetail
  }
})
export default class InrushClosedCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(ExportFollowupService)
  private exportFollowupService: ExportFollowupService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @State userData: any;
  @State seriesNameList;
  @Getter departmentData;
  @Watch("searchModel.deptCodes")
  deptCodesChange() {
    this.getcupoName();
  }
  @Watch("searchModel.follFeedbacks")
  follFeedbacksChange() {
    this.feedbackChange();
  }

  private selectionList: any = [];
  private DataSet: Array<any> = [];
  private category: any = "";
  private detailObj: any = {};
  private dialog: any = {
    setExportItems: false,
    followRecord: false,
    detail: false
  };
  private followObj: any = {};
  private accFeedback: any = []; // 催收反馈数据
  private searchModel: any = {
    caseNumber: "", // 申请号
    personalName: "", // 客户姓名
    mobileNo: "", // 客户手机号
    idCard: "", // 身份证号
    batchNumber: "",
    deptCodes: [],
    deptCode: "", // 机构
    seriesName: "",
    collectionStatusList: "24", // 案件状态
    collectorName: "", // 当前催收员
    assistWay: "",
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
    followupBacks: [], // 催收反馈数据
    turnFromPool: "", // 流转来源
    lawsuitResult: "", // 诉讼阶段
    antiFraudResult: "", // 反欺诈状态(反馈)
    parentAreaId: "", // 省份ID
    areaId: "", // 城市ID
    followDate: "", // 跟进时间
    caseFollowInTime: "", // 案件流入时间
    productName: "", // 产品名称
    personalType: "" // 客户类型
  };
  // 表单验证规则
  private Rule = {
    mobileNo: [
      {
        validator: this.$validator.phoneNumber,
        trigger: "blur"
      }
    ]
  };
  mounted() {
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
  refreshData() {
    this.caseInfoInquiryService
      .getInnerWaitCollectCase(
        this.searchModel,
        this.pageService,
        this.sortService
      )
      .subscribe(
        data => (this.DataSet = data),
        err => this.$message.error(err.msg)
      );
  }
  /**
   * 设置导出项
   */
  setExportItemsClick() {
    this.dialog.setExportItems = true;
    this.$nextTick(() => {
      let setExportItems: any = this.$refs["set-export-items"];
      setExportItems.checkExportItems(6);
    });
  }
  /**
   * 导出跟进记录
   */
  exportfollowRecordClick() {
    let batchList = this.selectionList.map(v => {
      return v.batchNumber;
    });
    let exportModel: any = {
      batchNumberList: batchList,
      type: 1,
      companyCode: this.userData.companyCode
    };
    this.exportFollowupService.exportFollowupRecord(exportModel).subscribe(
      data => {
        this.$message.success("操作成功，请关注任务中心！");
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
}
</script>

<style lang="less">
</style>
