<template>
  <section class="component repay-plan">
    <data-box :data="repaylpanData" @onPageChange="refreshData" ref="data-box" :height="300">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="periods" label="期数" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="repaymentTime" label="应还时间" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.repaymentTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="custName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="allMoney" label="应还总金额" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            {{scope.row.allMoney|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="remainAllMoney" label="剩余总金额" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            {{scope.row.remainAllMoney|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="shouldCapital" label="应还本金" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            {{scope.row.shouldCapital|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="remainCapital" label="剩余本金" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            {{scope.row.remainCapital|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="shouldAccrual" label="应还利息" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            {{scope.row.shouldAccrual|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="remainAccrual" label="剩余利息" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            {{scope.row.remainAccrual|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="shouldPlatformManageMoney" label="应还月分期服务费" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            {{scope.row.shouldPlatformManageMoney|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="remainManageFee" label="剩余月分期服务费" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            {{scope.row.remainManageFee|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="shouldInterest" label="应还罚息" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            {{scope.row.shouldInterest|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="remainInterest" label="剩余罚息" :min-width="$helper.getColumnWidth(4)" align="right">
          <template slot-scope="scope">
            {{scope.row.remainInterest|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="shouldViolateFee" label="应还逾期违约金" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            {{scope.row.shouldViolateFee|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="overdueViolateMoney" label="剩余逾期违约金" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            {{scope.row.overdueViolateMoney|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="overdueDay" label="逾期天数" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="status" label="状态" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            {{scope.row.status|dictConvert}}
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import { State, Mutation, namespace } from "vuex-class";
import { CustomerRepaymentPlanController } from "~/services/business-service/customer-repayment-plan.service";
import { Layout, Dependencies } from "~/core/decorator";
import { Watch } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataBox
  }
})
export default class RepayPlan extends Vue {
  @Dependencies(CustomerRepaymentPlanController)
  private customerRepaymentPlanController: CustomerRepaymentPlanController;
  @accManageModule.State caseInfo;
  private repaylpanData: any = null;

  @Watch("caseInfo")
  onCaseIdChange() {
    this.refreshData();
  }
  mounted() {
    this.refreshData();
  }
  refreshData() {
    let repaymentData: any = {
      orderNumber: this.caseInfo.orderId
    };
    this.customerRepaymentPlanController
      .getCustomerRepaymentPlan(repaymentData)
      .subscribe(
      data => {
        this.repaylpanData = data;
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
