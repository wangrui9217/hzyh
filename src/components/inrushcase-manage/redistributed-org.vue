<template>
  <section class="component redistributed-org">
    <el-col>
      <data-box :data="orgData">
        <template slot="columns">
          <el-table-column prop="org" label="分配机构" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="caseNumber" label="当前持有案件数" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="caseNum" label="确认分配案件数" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        </template>
      </data-box>
    </el-col>
    <el-col class="btns" style="text-align:center;margin-top:20px">
      <el-button @click="orgPreStep">上一步</el-button>
      <el-button @click="orgCancel">取消</el-button>
      <el-button @click="orgConfirm" :loading="submitLoading">确定</el-button>
    </el-col>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import DataBox from "~/components/common/data-box.vue";
import { Emit, Prop } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";

const accManageModule = namespace("inrush-case");

@Component({
  components: {
    DataBox
  }
})
export default class RedistributedUser extends Vue {
  @Dependencies(CaseInfoDistributeService)
  private caseInfoDistributeService: CaseInfoDistributeService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;

  @accManageModule.State("caseAllotOrg") caseAllotOrg;

  @Prop() typeId: any;
  private orgData: any = [];
  private selectionList: Array<any> = [];
  private isDebt: any = "";
  private isNumAvg: any = "";
  private allocated: any = "";
  private caseIds: any = [];
  private userIdList: any = [];
  private submitLoading: Boolean = false;

  @Emit("preStep")
  preStep() {}
  @Emit("cancel")
  cancel() {}
  @Emit("success")
  success() {}

  refreshData(multipleSelection) {
    this.orgData = [];
    this.selectionList = multipleSelection;
    let obj: any = {};
    let deptCode = this.caseAllotOrg.code;
    this.caseInfoDistributeService.getCaseCountOnDept(deptCode).subscribe(
      data => {
        obj.caseNumber = data;
        obj.org = this.caseAllotOrg.name;
        obj.caseNum = this.selectionList.length;
        this.orgData.push(obj);
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  mounted() {}
  orgPreStep() {
    this.preStep();
  }
  orgCancel() {
    this.cancel();
  }
  orgConfirm() {
    let caseIdList = this.selectionList.map(v => {
      return v.caseId || v.id;
    });
    let caseNumList: any = [];
    caseNumList.push(this.selectionList.length);
    let depIdList: any = [];
    depIdList.push(this.caseAllotOrg.id);
    let distributeModel: any = {
      caseIdList: caseIdList,
      disType: 0,
      depIdList: depIdList,
      caseNumList: caseNumList
    };
    this.submitLoading = true;
    if (this.typeId === 80) {
      this.accTelPoolService
        .distributeTurnCeaseAgain(distributeModel)
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("分配成功！");
            this.success();
          },
          err => {
            this.submitLoading = false;
            this.$message.error(err.msg);
          }
        );
    } else {
      this.caseInfoService.distributeCeaseInfoAgain(distributeModel).subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("分配成功！");
          this.success();
        },
        err => {
          this.submitLoading = false;
          this.$message.error(err.msg);
        }
      );
    }
  }
}
</script>