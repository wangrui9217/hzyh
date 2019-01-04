<template>
  <section class="component case-info-area">
    <el-card>
      <el-tabs v-model="currentCaseTabName">
        <el-tab-pane label="基本信息" name="base-info">
          <base-info></base-info>
        </el-tab-pane>
        <el-tab-pane label="账户信息" name="account-info">
          <account-info></account-info>
        </el-tab-pane>
      </el-tabs>
      <div class="row business-button-container">
        <el-button @click="applyAssistClick" v-if="isApplay">申请协催</el-button>
        <el-button @click="repayClick">还款</el-button>
        <el-button @click="updateCurrentDisplayAreaName('contact-info-area')">通讯录</el-button>
        <el-button @click="dialog.casedetailsdialog = true">案件详情</el-button>
      </div>
    </el-card>
    <el-dialog title="申请协催" :visible.sync="dialog.disabled" @close="$refs['applay-assist'].reset()">
      <applay-assist @close="dialog.disabled=false" ref="applay-assist"></applay-assist>
    </el-dialog>
    <el-dialog title="申请外访" :visible.sync="dialog.visited">
      <applay-visit @close="dialog.visited=false"></applay-visit>
    </el-dialog>
    <el-dialog title="案件详情" :visible.sync="dialog.casedetailsdialog" width="100%" fullscreen>
      <case-detail :caseId="caseId" :needRequest="false"></case-detail>
    </el-dialog>
    <el-dialog title="逾期还款" :visible.sync="dialog.repaydialog" width="60%">
      <over-pay @close="dialog.repaydialog=false"></over-pay>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { State, Mutation, namespace } from "vuex-class";
import BaseInfo from "~/components/acc-manage/case-info/base-info.vue";
import AccountInfo from "~/components/acc-manage/case-info/account-info.vue";
import RepayPlan from "~/components/acc-manage/case-info/repay-plan.vue";
import ImageData from "~/components/acc-manage/case-info/image-data.vue";
import ApplayAssist from "~/components/acc-manage/case-info-area/applay-assist.vue";
import OverPay from "~/components/acc-manage/case-info-area/over-pay.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import ApplayVisit from "~/components/acc-manage/case-info-area/applay-visit.vue";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    BaseInfo,
    AccountInfo,
    RepayPlan,
    ImageData,
    ApplayAssist,
    CaseDetail,
    OverPay,
    ApplayVisit
    // ReductCalculation
  }
})
export default class CaseInfoArea extends Vue {
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @accManageModule.State("currentCaseTabName") _currentCaseTabName;
  @accManageModule.State caseId;
  @accManageModule.State caseType;
  @accManageModule.State caseInfo;
  @accManageModule.Mutation updateCurrentDisplayAreaName;
  @accManageModule.Mutation updateCurrentCaseTabName;

  private dialog: any = {
    disabled: false,
    casedetailsdialog: false,
    repaydialog: false,
    visited: false,
    reduct: false
  };
  /**
   * 申请协催是否显示
   */
  private isApplay: boolean = false;
  private isApplayPage: Array<any> = [
    "call-case",
    "wait-collection",
    "in-the-collection",
    "return-c-case",
    "repayment-review"
  ];
  mounted() {
    this.isApplayPage.forEach((value, index, array) => {
      if (this.$store.state.workspace.currentTab === `/call-acc/${value}`) {
        this.isApplay = true;
        return;
      }
    });
  }

 
  get currentCaseTabName() {
    return this._currentCaseTabName;
  }

  set currentCaseTabName(value) {
    this.updateCurrentCaseTabName(value);
  }
  /**
   * 申请协催
   */
  applyAssistClick() {
    this.dialog.disabled = true;
  }
  /**
   * 还款
   */
  repayClick() {
    this.dialog.repaydialog = true;
  }
}
</script>

<style lang="less" scoped>
.component.case-info-area {
  position: relative;
  .business-button-container {
    position: absolute;
    top: 11px;
    right: 10px;
  }
}
</style>
