<template>
  <section class="component org-allocate">
    <el-row class="org-allocate-top">
      <el-col :span="14">
        <span class="title">{{`当前已选择 ${selectedCaseCount} 个案件`}}</span>
        <el-checkbox class="gongzhai" v-model="isDebt" @change="avgChange">共债案件优先分配给同一催收员</el-checkbox>
      </el-col>
    </el-row>
    <el-row>
      <data-box :data="orgData" height="400">
        <template slot="columns">
          <el-table-column prop="departmentName" label="机构名称" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="caseCurrentCount" label="当前案件数" :min-width="$helper.getColumnWidth(4)"></el-table-column>
          <el-table-column prop="accountBalance" label="当前案件总账户余额" align="right" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              {{ scope.row.accountBalance | toThousands}}
            </template>
          </el-table-column>
          <el-table-column label="确认分配案件数" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <el-input :min="0" size="small" type="number" :max="selectedCaseCount" class="batch" v-model="scope.row.caseDistributeCount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="caseTotalCount" label="案件总数量" :min-width="$helper.getColumnWidth(3)"></el-table-column>
        </template>
      </data-box>
      <el-col style="text-align:center">
        <el-button @click="onPreStep">上一步</el-button>
        <el-button @click="onClose">取消</el-button>
        <el-button @click="confirmAllocate" :loading="submitLoading">确定</el-button>
      </el-col>
    </el-row>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit, Prop } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { CaseRepairService } from "~/services/business-service/case-repair.service";
import { Array } from "core-js/library/web/timers";
const inrushCaseModule = namespace("inrush-case");
@Component({
  components: {
    DataBox
  }
})
export default class OrgAllocate extends Vue {
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(CaseRepairService) private caseRepairService: CaseRepairService;
  @inrushCaseModule.State caseAllotOrg;
  @inrushCaseModule.State selectedCase;

  @Emit("preStep")
  onPreStep() {}
  @Emit("close")
  onClose() {}
  @Emit("success")
  onSuccess() {
    this.$message.success("分配成功！");
  }

  private orgData: Array<any> = [];
  private allocateModel: any = {};
  private submitLoading: Boolean = false;

  get selectedCaseCount() {
    return this.selectedCase.length;
  }

  get isDebt() {
    return this.allocateModel.isDebt === 1;
  }

  set isDebt(value) {
    this.allocateModel.isDebt = value ? 1 : 0;
  }

  created() {
    this.initBaseData();
  }

  /**
   * 初始化基础数据
   */
  initBaseData() {
    this.allocateModel = {
      caseIdList: this.selectedCase,
      caseNumList: [],
      depIdList: [this.caseAllotOrg.id],
      disType: 0,
      isPlan: 0,
      isDebt: 0,
      isNumAvg: 0
    };
  }

  confirmAllocate() {
    let caseNumList = this.orgData.map(v => v.caseDistributeCount);
    if (
      caseNumList.reduce((a, b) => {
        return a + b;
      }) <= 0
    ) {
      this.$message.error("案件分配数不正确！");
      return false;
    }
    this.submitLoading = true;
    this.allocateModel.caseNumList = caseNumList;
    if (this.$route.name === "inrush-undistributed-case") {
      this.caseInfoService.distributeCaseInfo(this.allocateModel).subscribe(
        data => {
          this.submitLoading = false;
          this.onSuccess();
        },
        err => {
          this.submitLoading = false;
          this.$message.error(err.msg);
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
            this.submitLoading = false;
            this.$message.error(err.msg);
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
        data => (this.orgData = data.list),
        err => this.$message.error(err.msg)
      );
  }

  refreshData() {
    this.initBaseData();
    this.caseInfoService
      .distributePreview(this.allocateModel)
      .subscribe(
        data => (this.orgData = data.list),
        err => this.$message.error(err.msg)
      );
  }
}
</script>

<style lang="less" scoped >
.org-allocate-top {
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
</style>
