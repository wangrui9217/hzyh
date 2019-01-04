<template>
  <section class="component export-case">
    <data-form :model="model" @onSearch="refreshData" :page="pageService" @handleResetForm="handleResetForm">
      <template slot="default-input">
        <el-form-item label="委外方" prop="outsName">
          <el-select v-model="model.outsId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,outsName} in outSourceList" :key="index" :label="outsName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委案时间" prop="outTime" v-if="model.type===1">
          <el-date-picker v-model="model.outTime" type="daterange" placeholder="选择时间" :editable="false" range-separator="~">
          </el-date-picker>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportClick">导出案件</el-button>
      </template>
    </data-form>
    <data-box :data="dataSet" @onPageChange="refreshData" :selectionList.sync="selectionList" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.caseInfo.caseNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outTime" label="委案日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.outTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.caseInfo.personalInfo.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.caseInfo?scope.row.caseInfo.personalInfo.mobileNo:''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" :min-width="$helper.getColumnWidth(6)" prop="idCard">
          <template slot-scope="scope">
            <span>{{scope.row.caseInfo.personalInfo.idCard}}</span>
          </template>
        </el-table-column>
        <el-table-column label="逾期金额" prop="overdueAmount" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.caseInfo?scope.row.caseInfo.overdueAmount:"" | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.caseInfo?scope.row.caseInfo.overdueDays:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outsName" label="委外方" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.outsource?scope.row.outsource.outsName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.caseInfo?scope.row.caseInfo.payStatus:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.outStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overOutsourceTime" label="到期日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.overOutsourceTime | dateFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { UserService } from "~/services/business-service/user.service";
import { State } from "vuex-class";
import { ExportOutsourceFollowupService } from "~/services/report-service/export-outsource-followup.service";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class ExportCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;
  @Dependencies(ExportOutsourceFollowupService)
  private exportOutsourceFollowupService: ExportOutsourceFollowupService;
  @State companyCode: any;
  @State outSourceList: any;

  private model: any = {
    companyCode: "",
    outsId: "",
    outTime: [],
    type: "",
    outsIdList: [],
    ourBatchList: []
  };
  private selectionList: any = [];
  private dataSet = null;
  /**
   * 重置
   */
  handleResetForm() {
    this.model.outsName = "";
    this.model.outTime = [];
  }
  /**
   * 导出
   */
  exportClick() {
    let caseNumberList = this.selectionList.map(v => v.caseInfo).map(m => {
      return m.caseNumber;
    });
    this.exportOutsourceFollowupService
      .exportOutsourceFollowupRecord(this.model, 0, [], [], caseNumberList)
      .subscribe(
        data => {
          this.$message.info("操作成功，请关注任务中心！");
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  refresh(obj, selectionList) {
    this.selectionList = [];
    let outsIdList = selectionList.map(v => v.outsId);
    let ourBatchList = [];
    if (obj.type === 1) {
      ourBatchList = selectionList.map(v => v.batchNumber);
    }
    this.model.type = obj.type;
    this.model.ourBatchList = ourBatchList;
    this.model.outsIdList = outsIdList;
    this.refreshData();
  }
  refreshData() {
    this.outsourcePoolService
      .getOutSourceCaseByOutName(this.model, this.pageService)
      .subscribe(
        data => {
          this.dataSet = data;
          console.log(this.dataSet,"dataSet")
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  created() {
    this.model.companyCode = this.companyCode;
  }
}
</script>

<style lang="less" scoped>
</style>
