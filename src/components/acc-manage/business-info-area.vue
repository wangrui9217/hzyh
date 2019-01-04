<template>
  <section class="component business-info-area">
    <el-row>
      <el-col style="width:45%;">
        <el-card class="card_content">
            <div slot="header" class="row between-span middle-span">
              <div>添加催记</div>
            </div>
            <add-call-record @refreshRecord="$refs['follow-record'].refreshData()"></add-call-record>
        </el-card>
      </el-col>
      <el-col style="width:54%;margin-left:0.5%;">
        <el-card class="card_content right_content">
          <el-tabs v-model="currentBusinessTabName">
            <el-tab-pane label="跟进记录" name="follow-record">
              <follow-record ref="follow-record"></follow-record>
            </el-tab-pane>
            <el-tab-pane label="协催记录" name="assist-record">
              <assist-record></assist-record>
            </el-tab-pane>
            <el-tab-pane label="流转记录" name="circulation-record">
              <circulation-record></circulation-record>
            </el-tab-pane>
            <el-tab-pane label="短信记录" name="message-record">
              <message-record></message-record>
            </el-tab-pane>
            <el-tab-pane label="电话记录" name="phone-record">
              <phone-record ref="phone-record"></phone-record>
            </el-tab-pane>
            <el-tab-pane label="案件批注" name="case-note">
              <case-note></case-note>
            </el-tab-pane>
            <!-- <el-tab-pane label="案件还款" name="case-repay"> 锦程项目无此需求
              <case-repay></case-repay>
            </el-tab-pane> -->
            <el-tab-pane label="扣款记录" name="debit-record">
              <debit-record></debit-record>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
     
    </el-row>
   

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { State, Mutation, namespace } from "vuex-class";
import AddCallRecord from "~/components/acc-manage/business-info/add-call-record.vue";
import FollowRecord from "~/components/acc-manage/business-info/follow-record.vue";
import AssistRecord from "~/components/acc-manage/business-info/assist-record.vue";
import CirculationRecord from "~/components/acc-manage/business-info/circulation-record.vue";
import MessageRecord from "~/components/acc-manage/business-info/message-record.vue";
import PhoneRecord from "~/components/acc-manage/business-info/phone-record.vue";
import CaseNote from "~/components/acc-manage/business-info/case-note.vue";
import VisitRecord from "~/components/acc-manage/business-info/visit-record.vue";
// import CaseRepay from "~/components/acc-manage/business-info/case-repay.vue";
import DebitRecord from "~/components/acc-manage/business-info/debit-record.vue";

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    AddCallRecord,
    FollowRecord,
    AssistRecord,
    CirculationRecord,
    MessageRecord,
    PhoneRecord,
    CaseNote,
    VisitRecord,
    // CaseRepay,
    DebitRecord
  }
})
export default class BusinessInfoArea extends Vue {
  @accManageModule.State("currentBusinessTabName") _currentBusinessTabName;
  @accManageModule.Mutation updateCurrentBusinessTabName;
  @accManageModule.State caseType;
  get currentBusinessTabName() {
    return this._currentBusinessTabName;
  }

  set currentBusinessTabName(value) {
    this.updateCurrentBusinessTabName(value);
  }
}
</script>

<style lang="less" scoped>
.component.business-info-area{
  margin-top: 20px;
  .card_content {
    height: 500px;
  }
  .right_content {
    overflow-y: auto;
  }
}

</style>
