<template>
  <section class="component account-info">
    <data-grid :labelWidth="100" labelAlign="left" v-for="BankInfo of personalBankInfos" :key="BankInfo.id" row-key="caseInfo.id" contentAlign="left" :totalSpan="10">
      <data-grid-item label="绑定开户行" :span="2" :min-width="$helper.getColumnWidth(2)">{{BankInfo.depositBank}}</data-grid-item>
      <data-grid-item label="绑定卡号" :span="4" :min-width="$helper.getColumnWidth(2)">{{BankInfo.cardNumber}}</data-grid-item>
      <data-grid-item label="结算通道" :span="2" :min-width="$helper.getColumnWidth(2)">{{Number(personalInfo.clearingChannel) | dictConvert}}</data-grid-item>
      <data-grid-item label="电子账户" :span="2" :min-width="$helper.getColumnWidth(2)">{{personalInfo.bankAccount}}</data-grid-item>
      <data-grid-item label="逾期总金额" :span="2" :min-width="$helper.getColumnWidth(2)">{{caseInfo.overdueAmount|toThousands}}</data-grid-item>
      <data-grid-item label="最近一次还款日期" :span="2" :min-width="$helper.getColumnWidth(2)">{{caseInfo.latelyPayDate | dateFormat}}</data-grid-item>
      <!--<data-grid-item label="每期应还本息" :span="2" :min-width="$helper.getColumnWidth(2)">{{caseInfo.perPayAmount}}</data-grid-item>-->
      <data-grid-item label="罚息总额" :span="2" :min-width="$helper.getColumnWidth(2)">{{caseInfo.overdueFine|toThousands}}</data-grid-item>
      <data-grid-item label="逾期应还本息总额" :span="2" :min-width="$helper.getColumnWidth(2)">{{caseInfo.overdueCapital + caseInfo.overdueInterest|toThousands}}</data-grid-item>
      <data-grid-item label="剩余本金" :span="2" :min-width="$helper.getColumnWidth(2)">{{caseInfo.leftCapital|toThousands}}</data-grid-item>
    </data-grid>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Mutation, namespace } from "vuex-class";
import { Layout, Dependencies } from "~/core/decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { Watch } from "vue-property-decorator";

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataGrid,
    DataGridItem
  }
})
export default class AccountInfo extends Vue {
  @accManageModule.State caseInfo;
  get personalInfo(): any {
    return this.caseInfo.personalInfo || {};
  }

  get personalBankInfos(): any {
    return this.personalInfo.personalBankInfos || [];
  }
}
</script>

<style lang="less" scoped>

</style>
