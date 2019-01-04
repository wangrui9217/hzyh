<template>
  <section class="component case-list">
    <div style="line-height:30px;font-size:20px;margin-left:10px;margin-bottom:20px">案件列表</div>
    <data-form :model="callModle" @onSearch="refreshData" :page="pageService" hiddenReset>
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="催收反馈" prop="follFeedbacks">
          <el-cascader v-model="callModle.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName">
          <el-input v-model="callModle.personalName"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
      </template>
    </data-form>

    <data-box :height="550" :data="callAccDataSet" width="380px" @onPageChange="refreshData" :sort="sortService" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.collectionStatus  === caseState.repaid" @click="getCaseInfoByCaseId(scope.row.caseId)">{{scope.row.personalName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupBack" label="催收反馈" show-overflow-tooltip	 :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <span>{{scope.row.followupBack|dictConvert}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Action, namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { SortService } from "~/utils/sort.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import clone from "clone";
import {  followType, caseType, caseState } from "~/config/enum.config";
import { Watch } from "vue-property-decorator";

const accManageModule = namespace("acc-manage");

@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class CaseList extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @State userData: any;
  @State companyList: any;
  @accManageModule.Action getCaseInfoByCaseId;
  @accManageModule.State status;
  @accManageModule.State searchModel; // 催收执行也数据来源 的查询条件
  @accManageModule.State refreshState;

  @Watch('refreshState') 
  refresh(){
    this.refreshData()
  }


  // 引用的枚举资源
  private caseType = caseType;
  private caseState = caseState;
  private followType = followType;
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
  private SearchModel: any = {};

  private dialog: any = {
    disabled: false,
    phonerecord: false,
    FollowRecord: false
  };

  // 当前页面查询条件
  private callModle: any = {
    personalName: "", // 客户姓名
    follFeedbacks: [],
    followupBack: "", // 催收反馈
    amountRange: {
      min: "",
      max: ""
    },
    overdueDays: {
      min: "",
      max: ""
    },
    amtRange: {
      min: "",
      max: ""
    },
    caseMoney: { min: "", max: "" },
    realPayAmount: { min: "", max: "" }, // 还款金额

  };
  mounted() {
    this.pageService.layout = "total,  prev, pager, next";
    this.pageService.pageSize = 20;
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
    this.SearchModel = Object.assign(this.callModle, this.searchModel);
    this.accFeedback = valid;
    this.refreshData();
  }

  refreshData() {
    let tmpSearchModel = Object.assign(this.SearchModel, this.callModle);
    if (this.searchModel.collectionType == this.caseType.assist) {
      this.caseInfoInquiryService
        .getCaseAssistByCondition(
          tmpSearchModel,
          this.pageService,
          this.sortService
        )
        .subscribe(
          data => {
            this.callAccDataSet = data;
          },
          err => this.$message.error(err.msg)
        );
    } else if (this.searchModel.collectionType == this.caseType.special || this.searchModel.collectionType == this.caseType.stop) {
      this.caseInfoInquiryService
        .getCaseByPoolTypeAndCondition(
          tmpSearchModel,
          this.pageService,
          this.sortService
        )
        .subscribe(
          data => (this.callAccDataSet = data),
          err => this.$message.error(err.msg)
        );
    } else {
      this.caseInfoInquiryService
        .getCaseInfoByCondition(
          tmpSearchModel,
          this.pageService,
          this.sortService
        )
        .subscribe(
          data => (this.callAccDataSet = data),
          err => this.$message.error(err.msg)
        );
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
}
</script>

<style lang="less" scoped>
@width: 400px;
.component.case-list {
  padding: 20px 0;
  overflow: hidden;
  widows: @width;
  max-width: @width;
}
</style>
