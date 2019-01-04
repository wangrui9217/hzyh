<template>
  <section class="component user-allocate">
    <el-row class="user-allocate-top">
      <el-col :span="14">
        <span class="title">{{`当前已选择 ${selectedCaseCount} 个案件`}}</span>
        <el-checkbox class="gongzhai" v-model="isDebt" @change="avgChange">共债案件优先分配给同一催收员</el-checkbox>
      </el-col>
      <el-col :span="10">
        <el-radio-group v-model="allocateModel.isNumAvg" @change="avgChange">
          <el-radio :label="2">按金额平均分配</el-radio>
          <el-radio :label="1">按数量平均分配</el-radio>
          <el-radio :label="3">综合分配</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row>
      <data-box :data="cupor">
        <template slot="columns">
          <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="userRealName" label="当前催收员" :min-width="$helper.getColumnWidth(2)"></el-table-column>
          <el-table-column prop="caseCurrentCount" label="当前案件数" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column prop="accountBalance" label="当前案件总账户余额" align="center" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <span>{{scope.row.accountBalance | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="确认分配案件数" :min-width="$helper.getColumnWidth(4)" v-if="!isAvg">
            <template slot-scope="scope">
              <div type="flex" justify="center">
                <el-input :min="0" size="small" type="number" :max="selectedCaseCount" class="batch" v-model="scope.row.caseDistributeCount" @blur="handleInputChange(scope)">
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="caseTotalCount" label="案件总数量" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <template v-if="isAvg">
            <el-table-column label="确认分配案件数" prop="caseDistributeCount" :min-width="$helper.getColumnWidth(4)">
            </el-table-column>
            <el-table-column label="案件总账户余额" align="center" :min-width="$helper.getColumnWidth(4)">
              <template slot-scope="scope">
                <span>{{accountAll/cupor.length+scope.row.accountBalance | toThousands}}</span>
              </template>
            </el-table-column>
          </template>
        </template>
      </data-box>
      <el-col class="btns">
        <el-button @click="onPreStep">上一步</el-button>
        <el-button @click="onClose">取消</el-button>
        <el-button @click="userConfirm" :loading="submitLoading">确定</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit, Prop } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import DataBox from "~/components/common/data-box.vue";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { CaseRepairService } from "~/services/business-service/case-repair.service";
const inrushCaseModule = namespace("inrush-case");

@Component({
  components: {
    DataBox
  }
})
export default class UserAllocate extends Vue {
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(CaseRepairService) private caseRepairService: CaseRepairService;

  @inrushCaseModule.State caseAllotUser;
  @inrushCaseModule.State selectedCase;
  @inrushCaseModule.State selectedList;

  private cupor: any = [];
  private allocated: any = "";
  private allocateModel: any = {};
  private submitLoading: Boolean = false;
  private accountAll: any = "";

  @Emit("preStep")
  onPreStep() {}
  @Emit("close")
  onClose() {}
  @Emit("success")
  onSuccess() {
    this.$message.success("分配成功！");
    this.avgChange();
  }

  get isAvg() {
    if (this.allocateModel.isNumAvg) {
      return this.allocateModel.isNumAvg !== 0;
    } else {
      return false;
    }
  }

  get isDebt() {
    return this.allocateModel.isDebt === 1;
  }

  set isDebt(value) {
    this.allocateModel.isDebt = value ? 1 : 0;
  }

  get selectedCaseCount() {
    return this.selectedCase.length;
  }

  created() {
    this.initBaseData();
    let arr: any = this.selectedList.map(v => v.accountBalance);
    this.accountAll = eval(arr.join("+"));
    console.log(this.accountAll, "accountAll");
  }
  /**
   * 初始化基础数据
   */
  initBaseData() {
    this.allocateModel = {
      caseIdList: this.selectedCase,
      caseNumList: [],
      userIdList: this.caseAllotUser,
      disType: 1,
      isPlan: 0,
      isDebt: 0,
      isNumAvg: 0
    };
  }

  /**
   * 确认分配案件数验证
   */
  handleInputChange(scope) {
    let item = this.cupor[scope.$index].caseDistributeCount;
    if (
      String(item).includes(".") ||
      String(item).includes("+") ||
      String(item).includes("-")
    ) {
      item = 0;
    }
    if (item < 0 || item === "") {
      item = 0;
    }
    let max =
      this.selectedCase.length - this.allocated > 0
        ? this.selectedCase.length - this.allocated
        : 0;
    if (item > max) {
      this.$alert(
        `当前选择的案件数是${
          this.selectedCase.length
        }个，您分配的案件数已经超过了，请重新输入或者重选案件！`,
        "提示",
        {
          confirmButtonText: "确定",
          type: "warning"
        }
      );
      this.cupor[scope.$index].caseDistributeCount = 0;
      this.updateAllocated();
      return;
    }
    this.cupor[scope.$index].caseDistributeCount = item;
    this.updateAllocated();
  }
  /**
   * 更新allocated
   */
  updateAllocated() {
    let sum = 0;
    for (let v = 0; v < this.cupor.length; v++) {
      sum =
        sum +
        (isNaN(parseInt(this.cupor[v].caseDistributeCount))
          ? 0
          : parseInt(this.cupor[v].caseDistributeCount));
    }
    this.allocated = sum;
  }
  /**
   * 确认分配给用户
   */
  userConfirm() {
    let caseNumList = this.cupor.map(v => v.caseDistributeCount);
    if (
      caseNumList.reduce((a, b) => {
        return a + b;
      }) <= 0
    ) {
      this.$message.error("案件分配数不正确！");
      return false;
    }
    this.allocateModel.caseNumList = caseNumList;
    this.confirmAllocate();
  }
  /**
   * 确认分配给用户操作
   */
  confirmAllocate() {
    this.submitLoading = true;
    if (this.$route.name === "inrush-undistributed-case") {
      this.caseInfoService.distributeCaseInfo(this.allocateModel).subscribe(
        data => {
          this.submitLoading = false;
          this.onSuccess();
        },
        err => {
          this.$message.error(err.msg);
          this.submitLoading = false;
        }
      );
    } else {
      this.caseInfoService
        .distributeCeaseInfoAgain(this.allocateModel)
        .subscribe(
          data => {
            this.submitLoading = false;
            this.onSuccess();
          },
          err => {
            this.$message.error(err.msg);
            this.submitLoading = false;
          }
        );
    }
  }
  /**
   * 分配方式改变
   */
  avgChange() {
    this.caseInfoService
      .distributePreview(this.allocateModel)
      .subscribe(
        data => (this.cupor = data.list),
        err => this.$message.error(err.msg)
      );
  }
  /**
   * 刷新数据请求
   */
  refreshData() {
    this.initBaseData();
    this.avgChange();
  }
}
</script>

<style lang="less">
.component.user-allocate {
  .user-allocate-top {
    line-height: 50px;
    height: 50px;
    background-color: #f5f5f5;
    .title {
      padding-left: 10px;
      font-weight: bold;
    }
    .gongzhai {
      padding-left: 20px;
    }
  }

  .btns {
    text-align: center;
    margin-top: 30px;
  }
  input.el-input__inner {
    text-align: center !important;
  }
}
</style>
