<template>
  <section class="component mass-distribution">
    <div>
      <div class="el-alert el-alert--info" style="margin-bottom:20px;background-color: #50bfff;">
        <div class="el-alert__content el-alert el-alert--info" style=" display: table-cell;
        padding: 0 8px;background-color: #50bfff;text-align:center;">
          <span class="el-alert__title">当前已选择{{selectionList.length}}个案件，今日人均案件{{todayPer}}个。 已分配案件{{allocated}}个，还剩余{{selectionList.length-allocated}}个案件待分配。
          </span>
        </div>
      </div>
      <data-box :data="dataSet" height="400" min-width="500">
        <template slot="columns">
          <el-table-column prop="realName" label="催收专员" align="center" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.collectionUser.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="所属机构" align="center" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.collectionUser.department?scope.row.collectionUser.department.name:''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="caseCount" label="当前持有案件数" align="center" :min-width="$helper.getColumnWidth(5)"></el-table-column>
           <el-table-column prop="allAccountBalance" label="当前持有案件总账户余额" :min-width="$helper.getColumnWidth(8)">
            <template slot-scope="scope">
              <span>{{scope.row.allAccountBalance | toThousands }}</span>
            </template>
          </el-table-column>
          <el-table-column label="可分配案件数" align="center" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <span>{{(Math.ceil(todayPer-scope.row.caseCount) <0 ) ? 0:Math.ceil(todayPer-scope.row.caseCount)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="确认分配案件数" align="center" :min-width="$helper.getColumnWidth(5)" prop="distributionCount">
            <template slot-scope="scope">
              <el-input :min="0" size="small" type="number" :maxlength="2" class="batch" v-model="scope.row.distributionCount" :max="inputMax(scope)" @focus="inputFocus(scope)" @blur="batchInputChange(scope)">
              </el-input>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <el-col class="dialog-footer" align="center" style="margin-top:30px">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button @click="allConfirm" :loading="submitLoading">确定</el-button>
      </el-col>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import DataBox from "~/components/common/data-box.vue";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { PersonalService } from "~/services/business-service/personal.service";
import { CaseAssistService } from "~/services/business-service/case-assist.service";
import { AccVisitPoolService } from "~/services/business-service/acc-visit-pool.service";
import { Watch, Prop } from "vue-property-decorator";
import { CommonService } from "~/utils/common.service";
import clone from "clone";
import { Emit } from "vue-property-decorator";
@Component({
  components: {
    DataBox
  }
})
export default class FollowRecord extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccVisitPoolService)
  private accVisitPoolService: AccVisitPoolService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(PersonalService) private personalService: PersonalService;
  @Dependencies(CaseAssistService) private caseAssistService: CaseAssistService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Prop() selectionList: any;
  @Prop() collectionType: any;
  @Emit("close")
  close() {
    this.dataSet = [];
  }

  private todayPer: any = "";
  private model: any = {
    type: "",
    collectionFeedback: "",
    collectionFeedbacks: [],
    operatorTime: []
  };
  private typeVisit: any;
  private dataSet: any = [];
  private currentRow: any = {};
  private caseTransfer: any = [];
  private feedOptions: any = [];
  private submitLoading: Boolean = false;
  private allocated = 0;
  @Watch("dataSet")
  @Watch("selectionList")
  @Watch("todayPer")
  /**
   * 更新allocated
   */
  updateAllocated() {
    let sum = 0;
    for (let v = 0; v < this.dataSet.length; v++) {
      sum =
        sum +
        (isNaN(parseInt(this.dataSet[v].distributionCount))
          ? 0
          : parseInt(this.dataSet[v].distributionCount));
    }
    this.allocated = sum;
  }
  /**
   * 输入框最大值
   */
  inputMax(scope) {
    let max = this.selectionList.length;
    return max;
  }
  /**
   * 批量分配输 入获取焦点
   */
  inputFocus(scope) {
    this.dataSet[scope.$index].distributionCount = 0;
    this.updateAllocated();
  }
  /**
   * 批量分配输入改变
   */
  batchInputChange(scope) {
    let item = this.dataSet[scope.$index].distributionCount;
    if (item < 0 || item === "") {
      item = 0;
    }
    let max =
      this.selectionList.length - this.allocated > 0
        ? this.selectionList.length - this.allocated
        : 0;
    if (item > max) {
      this.$alert(
        `当前选择的案件数是${
          this.selectionList.length
        }个，您分配的案件数已经超过了，请重新输入或者重选案件！`,
        "提示",
        {
          confirmButtonText: "确定",
          type: "warning"
        }
      );
      this.dataSet[scope.$index].distributionCount = 0;
      this.updateAllocated();
      return;
    }
    this.dataSet[scope.$index].distributionCount = item;
    this.updateAllocated();
  }
  redistributionData() {}
  /**
   * 确定
   */
  allConfirm() {
    let flag = false;
    this.dataSet.forEach(v => {
      if (
        v.distributionCount &&
        v.distributionCount > this.todayPer - v.caseCount
      ) {
        flag = true;
      }
    });
    if (flag) {
      this.$confirm(
        "您分配的案件数已超过了催收员可分配案件数，确定分配吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.updateAllocated();
          this.confirmSend();
        })
        .catch(() => {
          this.dataSet.map(v => {
            if (
              v.distributionCount &&
              v.distributionCount > this.todayPer - v.caseCount
            ) {
              v.distributionCount = 0;
            }
            return v;
          });
          this.updateAllocated();
        });
    } else {
      this.confirmSend();
    }
  }
  /**
   * 批量分配调用接口
   */
  confirmSend() {
    this.dataSet.forEach(v => {
      if (v.distributionCount === null) {
        v.distributionCount = 0;
      }
      return v;
    });
    let cupoUserCountList = this.dataSet;
    let arr = this.selectionList.slice(0, this.allocated);
    let amount = arr.map(v => {
      return v.caseId;
    });
    let assistIds = arr.map(m => {
      return m.assistId;
    });
    let confirmData: any = {
      batchInfoModelList: cupoUserCountList,
      caseIds: amount,
      assistIds: assistIds,
      allocated: this.allocated
    };
    if (this.collectionType === "xc") {
      let xcConfirmData: any = {
        batchInfoModelList: cupoUserCountList,
        assistIds: assistIds,
        averageNum: this.allocated
      };
      this.submitLoading = true;
      this.caseAssistService.batchCaseAssist(xcConfirmData).subscribe(
        data => {
          this.submitLoading = false;
          this.close();
          this.$emit("refresh");
          this.$message({
            type: "success",
            message: `成功分配${confirmData.allocated}个案件！`
          });
        },
        ({ msg }) => {
          this.$message.error(msg);
          this.submitLoading = false;
        }
      );
    } else if (this.typeVisit === 1) {
      this.accVisitPoolService.batchVisitCase(confirmData).subscribe(
        data => {
          this.submitLoading = false;
          this.close();
          this.$emit("refresh");
          this.$message({
            type: "success",
            message: `成功分配${confirmData.allocated}个案件！`
          });
        },
        ({ msg }) => {
          this.$message.error(msg);
          this.submitLoading = false;
        }
      );
    } else {
      this.accTelPoolService.batchTelCase(confirmData).subscribe(
        data => {
          this.submitLoading = false;
          this.close();
          this.$emit("refresh");
          this.$message({
            type: "success",
            message: `成功分配${confirmData.allocated}个案件！`
          });
        },
        ({ msg }) => {
          this.$message.error(msg);
          this.submitLoading = false;
        }
      );
    }
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.model.collectionFeedback = this.model.collectionFeedbacks[
      this.model.collectionFeedbacks.length - 1
    ];
    if (!this.model.collectionFeedback) {
      this.model.collectionFeedback = "";
    }
  }
  refresh(val) {
    this.typeVisit = val;
    this.dataSet = [];
    this.todayPer = null;
    this.caseAssistService.getBatchInfo().subscribe(
      data => {
        this.todayPer = data.averageNum;
        data.batchInfoModelList.forEach((value, index, arr) => {
          if (
            arr[index].collectionUser.department.type != "1" &&
            arr[index].collectionUser.department.type != "196"
          ) {
            this.dataSet.push(arr[index]);
          }
        });
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  refreshData(val?) {
    this.typeVisit = val || "";
    this.dataSet = [];
    this.todayPer = null;
    let modelType = { modelType: val };
    this.accTelPoolService.getBatchInfo(modelType).subscribe(
      data => {
        this.todayPer = data.averageNum;
        this.dataSet = data.batchInfoModelList;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  // mounted() {
  //   this.refreshData()
  // }
}
</script>

<style lang="less" scoped>
.el-alert__title {
  color: #ffffff;
}
</style>
