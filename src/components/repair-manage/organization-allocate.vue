<template>
  <el-col>
    <el-col>
      <data-box :data="orgData">
        <template slot="columns">
          <el-table-column prop="org" label="分配机构" align="center" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="caseNumber" label="当前持有案件数" align="center" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="caseNum" label="确认分配案件数" align="center" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        </template>
      </data-box>
    </el-col>
    <el-col class="text-center btns">
      <el-button @click="orgPreSteps">上一步</el-button>
      <el-button @click="orgCancel">取消</el-button>
      <el-button @click="orgConfirm" :loading="submitLoading">确定</el-button>
    </el-col>
  </el-col>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit, Prop } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import DataBox from "~/components/common/data-box.vue";
import { CaseRepairService } from "~/services/business-service/case-repair.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
const caseManageModule = namespace("case-manage");

@Component({
  components: {
    DataBox
  }
})
export default class OriganizationAllocate extends Vue {
  @Dependencies(CaseRepairService) private caseRepairService: CaseRepairService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(CaseInfoDistributeService)
  private caseInfoDistributeService: CaseInfoDistributeService;

  @caseManageModule.State caseAllotOrg;

  private orgData: any = [];
  private multipleSelection: any = [];
  @Prop() type: any;
  @Emit("close")
  close() {}
  @Emit("user")
  user() {}
  @Emit("orgPreStep")
  orgPreStep() {}
  private submitLoading: Boolean = false;

  /**
   * 打开刷新
   */
  refresh(multipleSelection) {
    this.multipleSelection = multipleSelection;
    this.orgData = [];
    let obj: any = {};
    // 查找组织机构的案件数
    this.caseInfoDistributeService
      .getCaseCountOnDept(this.caseAllotOrg[0].department.code)
      .subscribe(data => {
        obj.caseNumber = data;
        obj.org = this.caseAllotOrg[0].department.name;
        obj.caseNum = this.multipleSelection.length;
        this.orgData.push(obj);
      });
  }
  /**
   * 组织机构分配上一步
   */
  orgPreSteps() {
    this.close();
    this.orgPreStep();
  }
  /**
   * 组织机构分配确认
   */
  orgConfirm() {
    let caseIdList: any = this.multipleSelection.map(v => {
      return v.id;
    });
    let caseNumList: any = [];
    caseNumList.push(this.multipleSelection.length);
    this.$emit("caseList", caseIdList);
    this.$emit("caseNumList", caseNumList);
    let depIdList: any = [];
    depIdList.push(this.caseAllotOrg[0].department.id);
    let data: any = {
      caseIdList: caseIdList,
      disType: 0,
      depIdList: depIdList,
      caseNumList: caseNumList
    };
    this.submitLoading = true;
    if (this.type === true) {
      this.caseRepairService.distributeRepairCase(data).subscribe(
        data => {
          this.submitLoading = false;
          this.close();
          this.$emit("refresh");
          this.$message.success("分配成功！");
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    } else {
      this.caseInfoDistributeService.distributeCeaseInfo(data).subscribe(
        data => {
          this.submitLoading = false;
          this.close();
          this.$emit("refresh");
          this.$message.success("分配成功！");
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    }
  }
  /**
   * 组织机构分配取消
   */
  orgCancel() {
    this.close();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btns {
  padding: 20px;
  text-align: center;
}
</style>
