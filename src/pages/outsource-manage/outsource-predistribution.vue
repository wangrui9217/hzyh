<template>
  <!-- 委外案件-委外预分配 -->
  <section class="page outsource-predistribution">
    <data-box :data="summaryDataSet" class="summary">
      <template slot="columns">
        <el-table-column prop="outName" label="受托方名称">
        </el-table-column>
        <el-table-column prop="outNumber" label="案件总数">
        </el-table-column>
        <el-table-column label="地区及案件数量">
          <template slot-scope="scope">
            <el-popover placement="left" trigger="click">
              <outsource-area-report :outId="scope.row.outId"></outsource-area-report>
              <el-button type="text" slot="reference">查看详情</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <data-form :model="searchModel" @onSearch="refreshData" :page="pageService" :rules="Rule">
      <template slot="default-input">
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
        <el-form-item label="逾期天数" prop="overdueDays" >
          <number-range v-model="searchModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amtRange" >
          <number-range v-model="searchModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="逾期期数" prop="overduePeriods">
          <el-select v-model="searchModel.overduePeriods" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请号" prop="caseNumber">
          <el-input v-model="searchModel.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName">
          <el-input v-model="searchModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo">
          <el-input v-model="searchModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="seriesName">
          <el-select v-model="searchModel.seriesName" placeholder="请选择" clearable>
            <el-option v-for="{seriesName,id,index} in seriesNameList" :key="index" :label="seriesName" :value="seriesName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受托方" prop="outsId">
          <el-select v-model="searchModel.outsId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,outsName} in outSourceList" :key="index" :label="outsName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="distributionClick">确定分案</el-button>
      </template>
    </data-form>
    <data-box :data="DataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="detailObj = scope.row;dialog.detail = true" type="text">案件详情</el-button>
            <el-button @click="detailObj = scope.row;dialog.followRecord = true" type="text">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(8)">
        </el-table-column>
        <el-table-column prop="personalName"  label="客户姓名"  :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="cityName" label="地区" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.areaName?scope.row.areaName:""}}</span>
            <span>{{ scope.row.cityName?scope.row.cityName:""}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outName" label="受托方" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overduePeriods" label="逾期期数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="seriesName" label="产品类型" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
      </template>
    </data-box>
    <!-- 案件详情 -->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="detailObj.caseId" :caseNumber="detailObj.caseNumber"></case-detail>
    </el-dialog>
    <!-- 跟进记录 -->
    <el-dialog :title="detailObj.caseNumber+'案件跟进明细'" :center="true" :visible.sync="dialog.followRecord" append-to-body width="90%">
      <follow-record :caseNumber="detailObj.caseNumber"></follow-record>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { State, Getter } from "vuex-class";
import NumberRange from "~/components/common/number-range.vue";
import { CaseInfoHistoryService } from "~/services/business-service/case-info-history.service";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import SetExportItems from "~/components/outsource-manage/case-in-collection/set-export-items.vue";
import { QueryOutsourcePoolService } from "~/services/report-service/query-outsource-pool.service";
import { ExportOutsourceFollowupService } from "~/services/report-service/export-outsource-followup.service";
import { DistributionService } from "~/services/report-service/distribution.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import OutsourceAreaReport from "~/components/outsource-manage/outsource-predistribution/outsource-area-report.vue";

@Auth(6116)
@Layout("workspace")
@Component({
  components: {
    SetExportItems,
    FollowRecord,
    DataGrid,
    DataGridItem,
    DataForm,
    DataBox,
    NumberRange,
    CaseDetail,
    OutsourceAreaReport
  }
})
export default class OutsourcePredistribution extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoHistoryService)
  private caseInfoHistoryService: CaseInfoHistoryService;
  @Dependencies(QueryOutsourcePoolService)
  private queryOutsourcePoolService: QueryOutsourcePoolService;
  @Dependencies(ExportOutsourceFollowupService)
  private exportOutsourceFollowupService: ExportOutsourceFollowupService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(DistributionService)
  private distributionService: DistributionService;

  @State companyList: any;
  @State userData: any;
  @State principalList: any;
  @State seriesNameList;
  @Getter departmentData;
  @Getter isSupperAdmin: boolean;
  @State outSourceList: any;
  private searchModel: any = {
    caseNumber: "",
    personalName: "",
    deptCodes: [],
    deptCode: "",
    seriesName: "",
    overduePeriods: "",
    mobileNo: "",
    outsId: "",
    parentAreaId: "",
    areaId: "",
    amtRange: {
      min: "",
      max: ""
    },
    overdueDays: {
      min: "",
      max: ""
    },
    idCard: ""
  };
  private summaryDataSet: any = [];
  private detailObj: any = {};
  private accFeedback: any = []; // 催收反馈数据
  // 表单验证规则
  private Rule = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  private DataSet = null;
  private selectionList: any = [];
  private closedObj: any = {};
  private dialog: any = {
    record: false,
    set: false
  };
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
    this.searchModel.collectionFeedback = this.searchModel.collectionFeedbacks[
      this.searchModel.collectionFeedbacks.length - 1
    ];
    if (!this.searchModel.collectionFeedback) {
      this.searchModel.collectionFeedback = "";
    }
  }
  refreshData() {
    this.distributionService
      .queryOutSoutPoolCase(this.searchModel, this.pageService)
      .subscribe(
        data => {
          this.DataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
    this.getSummaryDataSet();
  }
  mounted() {
    this.refreshData();
  }
  /**
   * 获取委外预分案汇总数据
   */
  getSummaryDataSet() {
    this.distributionService
      .getOutSourceCaseInfo()
      .subscribe(
        data => (this.summaryDataSet = data),
        err => this.$message.error(err.msg)
      );
  }
  /**
   * 确定分案
   */
  distributionClick() {
    if (this.selectionList.length == 0) {
      this.$confirm("未选择案件,是否要对案件进行全部分配?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.distributionService.savePredistributionOutSource().subscribe(
          data => {
            this.$message.success("分配成功!");
            this.refreshData();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      });
    } else {
      this.$confirm(
        `你选择了${this.selectionList.length}条案件,是否要进行分配?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.distributionService
          .savePredistributionOutSource(this.selectionList.map(v => v.caseId))
          .subscribe(
            data => {
              this.$message.success("分配成功!");
              this.refreshData();
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
      });
    }
  }
}
</script>

<style lang="less">
.page.outsource-predistribution {
  .summary {
    margin: -20px 0px 10px 0px !important;
  }
}
</style>
