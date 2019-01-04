<template>
  <section class="component reduct-calculation">
    <data-grid :labelWidth="100" labelAlign="left"  contentAlign="left" :totalSpan="10">
      <data-grid-item label="剩余应支付本金" :span="2">{{ reductData.surplusCapital | toThousands}}</data-grid-item>
      <data-grid-item label="借款金额" :span="2">{{ reductData.shouldCapital | toThousands}}</data-grid-item>
      <data-grid-item label="已还本金" :span="2">{{ reductData.alreadyRepaidCapital | toThousands}}</data-grid-item>
      <data-grid-item label="剩余应支付利息小计" :span="2">{{ reductData.surplusInterest | toThousands}}</data-grid-item>
      <data-grid-item label="当期应支付未支付利息" :span="2">{{ reductData.currentInterest | toThousands}}</data-grid-item>
      <data-grid-item label="往期应支付未支付利息" :span="2">{{ reductData.pastInterest | toThousands}}</data-grid-item>
      <data-grid-item label="剩余应支付逾期违约费用小计" :span="2">{{ reductData.surplusPenaltyMoney | toThousands}}</data-grid-item>
      <data-grid-item label="当期应支付未支付罚息" :span="2">{{ reductData.currentOverdueInterest | toThousands}}</data-grid-item>
      <data-grid-item label="当期应支付未支付逾期还款合同违约金" :span="2">{{ reductData.currentContractPenalty | toThousands}}</data-grid-item>
      <data-grid-item label="往期应支付未支付罚息" :span="2">{{ reductData.pastOverdueInterest | toThousands}}</data-grid-item>
      <data-grid-item label="往期应支付未支付逾期还款合同违约金" :span="2">{{ reductData.pastContractPenalty | toThousands}}</data-grid-item>
      <data-grid-item label="应支付提前还款违约金小计" :span="2">{{ reductData.advancePenaltyTotal | toThousands}}</data-grid-item>
      <data-grid-item label="提前还款违约金（公司）" :span="2">{{ reductData.advancePenaltyCompany | toThousands}}</data-grid-item>
      <data-grid-item label="提前还款违约金（投资人）" :span="2">{{ reductData.advancePenaltyInvestor | toThousands}}</data-grid-item>
      <data-grid-item label="剩余应支付分期服务费小计" :span="2">{{ reductData.surplusPlmanageMoney | toThousands}}</data-grid-item>
      <data-grid-item label="当期应支付分期服务费（不足期按足期计算）" :span="2">{{ reductData.currentPlmanageMoney | toThousands}}</data-grid-item>
      <data-grid-item label="往期应支付未支付分期服务费" :span="2">{{ reductData.pastPlmanageMoney | toThousands}}</data-grid-item>
      <data-grid-item label="退回服务费小计" :span="2">{{ reductData.returnServiceMoney | toThousands}}</data-grid-item>
      <data-grid-item label="信息咨询退回服务费" :span="2">{{ reductData.returnServiceMoneya | toThousands}}</data-grid-item>
      <data-grid-item label="财富投资退回服务费" :span="2">{{ reductData.returnServiceMoneyc | toThousands}}</data-grid-item>
      <data-grid-item label="信用公司退回服务费" :span="2">{{ reductData.returnServiceMoneyb | toThousands}}</data-grid-item>
      <data-grid-item label="投资管理退回服务费" :span="2">{{ reductData.returnServiceMoneyd | toThousands}}</data-grid-item>
      <data-grid-item label="提前收回应还总额" :span="2" >{{ reductData.countMomey | toThousands }}</data-grid-item>
      <data-grid-item label="减免总金额" :span="4" style="color:red">{{ reductData.totalCost | toThousands}}</data-grid-item>
    </data-grid>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Layout, Dependencies } from "~/core/decorator";
  import { DataGrid, DataGridItem } from "@zct1989/vue-component";
  import { FreeMoneyResultService} from "../../../services/business-service/free-money-result.service";
  import { Watch ,Prop} from "vue-property-decorator";
  @Layout("workspace")
  @Component({
    components: {
      DataGrid,
      DataGridItem
    }
  })
  export default class ReductCalculation extends Vue {
    @Dependencies(FreeMoneyResultService) private freeMoneyResultService: FreeMoneyResultService;
    @Prop() reductData :any
  }
</script>

<style scoped>

</style>
