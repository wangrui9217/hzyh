<template>
  <el-col>
    <el-col class="el-alert el-alert--info" style="margin-bottom:20px">
      <el-col class="el-alert__content">
        <span class="el-alert__title">当前已选择{{multipleSelection.length}}个案件，已分配案件{{allocated}}个，还剩余{{multipleSelection.length-allocated}}个案件待分配。</span>
      </el-col>
    </el-col>
    <data-box :data="cupor">
      <template slot="columns">
        <el-table-column prop="userName" label="用户名" align="center" :min-width="$helper.getColumnWidth(3)"></el-table-column>
        <el-table-column prop="collector" label="当前催收员" align="center" :min-width="$helper.getColumnWidth(3)"></el-table-column>
        <el-table-column prop="caseCount" label="当前持有案件数" align="center" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column label="确认分配案件数" align="center" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-input :min="0" size="small" type="number" :maxlength="2" class="batch" v-model="scope.row.distributionCount" :max="inputMax(scope)" @focus="inputFocus(scope)" @blur="batchInputChange(scope)">
            </el-input>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <el-col class="text-center btns">
      <el-button @click="userPreSteps">上一步</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-button @click="userConfirm" :loading="submitLoading">确定</el-button>
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
import { CaseRepairService } from "~/services/business-service/case-repair.service";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
const caseManageModule = namespace("case-manage");

@Component({
  components: {
    DataBox
  }
})
export default class OriganizationAllocate extends Vue {
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(CaseRepairService) private caseRepairService: CaseRepairService;
  @Dependencies(CaseInfoDistributeService)
  private caseInfoDistributeService: CaseInfoDistributeService;
  @Emit("close")
  close() {}
  @Emit("userPreStep")
  userPreStep() {}
  @Emit("success")
  success() {}
  private cupor: any = [];
  private allocated: any = 0;
  private multipleSelection: any = [];
  @Prop() caseDataId: any;
  @Prop() caseDataNum: any;
  @Prop() UserNameData: any;
  @Prop() type: any;
  @caseManageModule.State caseAllotUser;
  private submitLoading: Boolean = false;

  refresh(multipleSelection) {
    this.cupor = [];
    this.updateAllocated();
    this.multipleSelection = multipleSelection;
    // 查找用户的案件数
    let userIds: any = this.caseAllotUser.map(v => {
      return v.id;
    });
    this.caseInfoDistributeService.getUserInfoByUserId(userIds).subscribe(
      data => {
        if (data) {
          data = data.map(x => {
            x.distributionCount = 0;
            return x;
          });
          this.cupor = data;
        } else {
          this.cupor = [];
        }
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 批量分配输入获取焦点
   */
  inputFocus(scope) {
    this.cupor[scope.$index].distributionCount = 0;
    this.updateAllocated();
  }
  /**
   * 输入框输入改变
   */
  batchInputChange(scope) {
    let item = this.cupor[scope.$index].distributionCount;
    if (item.includes(".") || item.includes("+") || item.includes("-")) {
      item = 0;
    }
    if (item < 0) {
      item = 0;
    } else {
      let max: any = this.inputMax(scope);
      if (item > max) {
        item = max;
      }
    }
    this.cupor[scope.$index].distributionCount = item;
    this.updateAllocated();
  }
  /**
   * 更新allocated
   */
  updateAllocated() {
    let sum: any = 0;
    for (let v: any = 0; v < this.cupor.length; v++) {
      sum =
        sum +
        (isNaN(parseInt(this.cupor[v].distributionCount))
          ? 0
          : parseInt(this.cupor[v].distributionCount));
    }
    this.allocated = sum;
  }
  /**
   * 输入框最大值
   */
  inputMax(scope) {
    let max: any =
      this.multipleSelection.length - this.allocated > 0
        ? this.multipleSelection.length - this.allocated
        : 0;
    return max;
  }
  /**
   * 用户分配上一步
   */
  userPreSteps() {
    this.close();
    this.userPreStep();
  }
  /**
   * 用户分配确认
   */
  userConfirm() {
    let caseIdList: any = this.multipleSelection.map(v => {
      return v.id;
    });
    let caseNumList: any = this.cupor.map(v => {
      return v.distributionCount;
    });
    for (let j = 0; j < caseNumList.length; j++) {
      if (caseNumList[j] === "") {
        caseNumList[j] = "0";
      }
    }
    let userNameList: any = this.cupor.map(v => {
      return v.userName;
    });
    let userIdList: any = this.cupor.map(v => {
      return v.userId;
    });
    let result: any = 0;
    for (let i = 0; i < caseNumList.length; i++) {
      result = result + caseNumList[i];
    }
    this.$emit("caseList", caseIdList);
    this.$emit("caseNumList", caseNumList);
    this.$emit("userNameList", userNameList);
    if (result <= 0) {
      this.$message("请确认分配案件数！");
      return;
    }
    let data: any = {
      caseIdList: caseIdList,
      caseNumList: caseNumList,
      userIdList: userIdList,
      disType: 1,
      isPlan: 0
      // accReceivePoolModels: this.deptdata
    };
    this.submitLoading = true;
    // 分配
   this.caseRepairService.distributeRepairCase(data).subscribe(
        data => {
          this.submitLoading = false;
          this.$emit("close");
          this.$emit("refresh");
          this.$message.success("分配成功！");
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    }
  /**
   * 关闭
   */
  cancel() {
    this.close();
    this.success();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.btns {
  padding: 20px;
  text-align: center;
}
</style>
