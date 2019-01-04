<template>
  <el-col>
    <el-col>
      <data-box :selectionList.sync="selectionList" :data="deptdata">
        <template slot="columns">
          <el-table-column prop="cupoCaseNumNew" label="申请号" align="center" :min-width="$helper.getColumnWidth(5)"></el-table-column>
          <el-table-column prop="deptNameOld" label="机构" align="center" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="cupoUserNameOld" label="当前催收员" align="center" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="disCaseType" label="分配类型" align="center" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <span>{{scope.row.disCaseType | $dict.getDictData('0048')}}</span>
            </template>
          </el-table-column>
        </template>
      </data-box>
    </el-col>
    <el-col class="text-center btns">
      <el-button @click="orgConfirm">智能分配</el-button>
      <el-button @click="originalDistribution">原始分配</el-button>
      <el-button @click="cancle">重选案件</el-button>
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
import { CaseInfoService } from "~/services/business-service/case-info.service";
@Component({
  components: {
    DataBox
  }
})
export default class UserConfirm extends Vue {
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  // getDepartCases: servers.CaseManage.get_depart_cases, // 获取机构持有案件数
  // distributeCeaseInfo: servers.CaseManage.distribute_cease_info // 案件分配
  // 机构
  private deptdata: any = [];
  private multipleSelection: any = [];
  @Prop() caseDataId: any;
  @Prop() caseDataNum: any;
  @Prop() UserNameData: any;
  @Emit("close")
  close() { }
  refresh(orgData) {
    this.deptdata = orgData;
  }
  /**
   * 确认
   */
  orgConfirm() {
    // 分配
    this.caseInfoService
      .distributeCaseInfo({
        caseIdList: this.caseDataId,
        caseNumList: this.caseDataNum,
        userNameList: this.UserNameData,
        disType: 1,
        isPlan: 0,
        accReceivePoolModels: this.deptdata
      })
      .subscribe(
      data => {
        this.close();
        this.$emit("refresh");
        this.$message.success("分配成功！")
      }, ({ msg }) => {
        this.$message.error(msg);
      }
      );
  }
  /**
   * 原分配
   */
  originalDistribution() {
    // 分配
    this.caseInfoService
      .distributeCaseInfo({
        caseIdList: this.caseDataId,
        caseNumList: this.caseDataNum,
        userNameList: this.UserNameData,
        disType: 1,
        isPlan: 1
      })
      .subscribe(
      data => {
        this.close();
        this.$emit("refresh");
        this.$message.success("分配成功！")
      }, ({ msg }) => {
        this.$message.error(msg);
      }
      )
  }
  cancle() {
    this.close();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btns {
  padding: 20px;
}
</style>
