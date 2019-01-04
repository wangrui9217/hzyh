<template>
  <section class="page dashboard admin">
    <el-row class="card-container">
      <!-- <el-col :span="12">
        <case-repay-chart></case-repay-chart>
      </el-col>
      <el-col :span="12">
        <case-group-chart></case-group-chart>
      </el-col>
      <el-col :span="12">
        <case-record-chart></case-record-chart>
      </el-col> -->
      <el-col :span="12">
        <inner-rank-list></inner-rank-list>
      </el-col>
      <el-col :span="12">
        <outer-rank-list></outer-rank-list>
      </el-col>
      <el-col :span="12">
        <case-city-chart></case-city-chart>
      </el-col>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth,Layout, Dependencies } from "~/core/decorator";
import CaseRepayChart from "~/components/dashboard/admin/case-repay-chart.vue";
import CaseGroupChart from "~/components/dashboard/admin/case-group-chart.vue";
import CaseRecordChart from "~/components/dashboard/admin/case-record-chart.vue";
import CaseCityChart from "~/components/dashboard/admin/case-city-chart.vue";
import InnerRankList from "~/components/dashboard/admin/inner-rank-list.vue";
import OuterRankList from "~/components/dashboard/admin/outer-rank-list.vue";

@Auth(-1)
@Layout("workspace")
@Component({
  components: {
    CaseRepayChart,
    CaseGroupChart,
    CaseRecordChart,
    CaseCityChart,
    InnerRankList,
    OuterRankList
  }
})
export default class Admin extends Vue {}
</script>

<style lang="less" scoped>
.page.dashboard.admin {
  .card-container {
    & > * {
      padding: 10px;
    }
  }
}
</style>

<style lang="less">
.page.dashboard.admin {
  .card-container {
    .card-header {
      height: 23px;
      &>*:nth-child(1){
        font-size: 18px;
      }
      &>*:nth-child(2) {
        font-size: 14px;
      }
    }
  }
}
</style>
