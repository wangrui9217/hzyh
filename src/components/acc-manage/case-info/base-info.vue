<template>
  <section class="component base-info">
    <data-grid :labelWidth="90" labelAlign="left" :key="caseInfo.id" row-key="caseInfo.id" contentAlign="left" :totalSpan="30">
      <data-grid-item label="姓名" :span="6">{{personalInfo.name}}</data-grid-item>
      <data-grid-item label="年龄" :span="6">{{personalInfo.age}}</data-grid-item>
      <data-grid-item label="手机号" :span="6">{{personalInfo.mobileNo}}</data-grid-item>
      <!-- <data-grid-item label="门店" :span="8">{{department.name}}</data-grid-item> -->
      <data-grid-item label="身份证号" :span="6">{{personalInfo.idCard}}</data-grid-item>
      <data-grid-item label="借款期数" :span="6">{{caseInfo.periods}}</data-grid-item>
      <data-grid-item label="贷款日期" :span="6">{{caseInfo.loanDate | dateFormat}}</data-grid-item>
      <data-grid-item label="逾期阶段" :span="6">{{caseInfo.payStatus}}</data-grid-item>
      <data-grid-item label="逾期天数(天)" :span="6">{{caseInfo.overdueDays}}</data-grid-item>
      <data-grid-item label="应还日期(日)" :span="6">{{caseInfo.perDueDate}}</data-grid-item>
      <data-grid-item label="已还期数" :span="6">{{caseInfo.hasPayPeriods}}</data-grid-item>
      <data-grid-item label="合同金额" :span="6">{{caseInfo.contractAmount | toThousands}}</data-grid-item>
      <!-- <data-grid-item label="授信金额" :span="8">{{caseInfo.creditAmount | toThousands}}</data-grid-item> -->
      <data-grid-item label="逾期罚息" :span="6">{{caseInfo.overdueFine | toThousands}}</data-grid-item>
      <data-grid-item label="产品名称" :span="6">{{caseInfo.product.productName}}</data-grid-item>
      <data-grid-item label="产品系列" :span="6">{{(caseInfo.product.productSeries||{}).seriesName}}</data-grid-item>
      <data-grid-item label="逾期应还总额" :span="6">{{caseInfo.overdueAmount | toThousands}}</data-grid-item>
    </data-grid>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  Layout,
  Dependencies
} from "~/core/decorator";
import {
  State,
  Mutation,
  namespace
} from "vuex-class";
import {
  Watch,
  Prop,
  Emit
} from "vue-property-decorator";

import {
  DataGrid,
  DataGridItem
} from "@zct1989/vue-component";

const accManageModule = namespace("acc-manage");

@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class BaseInfo extends Vue {
  @accManageModule.State caseInfo;

  get personalInfo(): any {
    return this.caseInfo.personalInfo || {};
  }

  get payInfo(): any {
    return this.caseInfo.payInfo || {};
  }

  get department(): any {
    return this.caseInfo.department || {};
  }
}

</script>

<style lang="less" scoped>

</style>
