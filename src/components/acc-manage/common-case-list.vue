<template>
  <section class="component common-case-list">
    <data-box :data="caseDataSet" @onPageChange="refreshData" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名"  :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
          <span>{{scope.row.personalInfo.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo.mobileNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo.idCard}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="overdueAmount" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalId.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前催收员" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
             <span>{{scope.row.currentCollector?scope.row.currentCollector.realName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectionStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionStatus|dictConvert}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State, Action, namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import DataBox from "~/components/common/data-box.vue";

const accManageModule = namespace("acc-manage");

@Component({
  components: {
    DataBox
  }
})
export default class CommonCaseList extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @State companyCode: any;
  @accManageModule.State caseId;

  private caseDataSet: any = null;

  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.caseInfoService
      .queryCaseInfoList(
        {
          id: this.caseId,
          companyCode: this.companyCode
        },
        this.pageService
      )
      .subscribe(
        data => {
          this.caseDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
}
</script>

<style lang="less" scoped>
</style>
