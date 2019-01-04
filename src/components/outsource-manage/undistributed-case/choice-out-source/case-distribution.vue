<template>
  <section class="component case-distribution text-center">
    <el-col class="el-alert el-alert--info" style="margin-bottom:20px">
      <el-row class="el-alert__content" type="flex" align="top">
        <el-col :span="14" style="color:#fff">
          <el-row type="flex" align="top">
            <span class="el-alert__title">当前已选择{{multipleSelection.length}}个案件</span>
          </el-row>
        </el-col>
        <el-col :span="10" style="color:#fff;font-size:8px">
          <el-radio-group v-model="isNumAvg" @change="avgChange">
            <el-radio :label="2" style="color:#fff;font-size:10px">按金额平均分配</el-radio>
            <el-radio :label="1" style="color:#fff;font-size:10px">按数量平均分配</el-radio>
            <el-radio :label="3" style="color:#fff;font-size:10px">综合分配</el-radio>
          </el-radio-group>
          <a class="iconfont icon-guanyu1" style="color:#bce6fc;margin-left:15px"></a>
        </el-col>
      </el-row>
    </el-col>
    <data-box :data="cupor" height="400">
      <template slot="columns">
        <el-table-column prop="outCode" label="委外方编码" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.outCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outName" label="委外方" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.outName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectionCount" label="当前案件数" :min-width="$helper.getColumnWidth(3)"></el-table-column>
        <el-table-column prop="accountBalance" label="当前案件总账户余额" align="center" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.accountBalance | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="确认分配案件数" :min-width="$helper.getColumnWidth(4)" v-if="!isNumAvg">
          <template slot-scope="scope">
              <el-input :min="0" size="small" type="number" :maxlength="2" class="batch" v-model="scope.row.caseDistributeCount" :max="inputMax(scope)" @blur="handleInputChange(scope)">
              </el-input>
          </template>
        </el-table-column>
        <template v-if="isNumAvg">
          <el-table-column label="确认分配案件数" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <span>{{scope.row.caseDistributeCount}}</span>
            </template>
          </el-table-column>
         <el-table-column prop="caseTotalCount" label="案件总数量" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column label="案件总账户余额" align="center" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <span>{{accountAll/cupor.length+scope.row.accountBalance | toThousands}}</span>
            </template>
          </el-table-column>
        </template>
      </template>
    </data-box>
    <div style="margin-top:20px">
      <el-button @click="preStep">上一步</el-button>
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Prop, Emit } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import DataBox from "~/components/common/data-box.vue";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
const outsourceManageModule = namespace("outsource-manage");

@Component({
  components: {
    DataBox
  }
})
export default class CaseDistribution extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;
  @outsourceManageModule.State selectedList;

  @Emit("close")
  close() {}
  @Emit("preStep")
  preStep() {}
  @Emit("success")
  success() {}

  @Prop() multipleSelection: any;

  private cupor: Array<any> = [];
  private selectionList: any = [];
  private isDebt: any = "";
  private isNumAvg: any = false;
  private distributionCount: any = [];
  private TableData: any = [];
  private allocated: any = "";
  private submitLoading: Boolean = false;
  private accountAll: any = "";

  created() {
    let arr: any = this.selectedList.map(v => v.accountBalance);
    this.accountAll = eval(arr.join("+"));
    console.log(this.selectedList);
  }
  mounted() {}
  refreshData(selectedOutSource) {
    this.isNumAvg = false;
    this.selectionList = selectedOutSource.map(v => v.outId);
    let previewModel: any = {
      outId: this.selectionList,
      outCaseIds: this.multipleSelection.map(v => v.caseId)
    };
    this.getTableData(previewModel);
  }
  getTableData(previewModel) {
    this.outsourcePoolService
      .outsourceDistributePreview(previewModel)
      .subscribe(
        data => {
          this.cupor = data.outList;
          this.TableData = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 取消
   */
  cancel() {
    this.close();
  }
  /**
   * 确定
   */
  confirm() {
    this.distributionCount = this.cupor.map(v => {
      return v.caseDistributeCount;
    });
    for (let j = 0; j < this.distributionCount.length; j++) {
      if (this.distributionCount[j] === "") {
        this.distributionCount[j] = "0";
      }
    }
    let distributeModel: any = {
      outId: this.TableData.outsourceIds,
      outCaseIds: this.TableData.caseIds,
      isNumAvg: Number(this.isNumAvg),
      isDebt: Number(this.isDebt),
      distributionCount: this.distributionCount
    };
    this.submitLoading = true;
    this.outsourcePoolService
      .outsourceDistributeCeaseInfo(distributeModel)
      .subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("分配成功");
          this.success();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
  }
  /**
   * 按数量平均分配change
   */
  avgChange() {
    if (this.isNumAvg) {
      this.isDebt = 0;
      this.cupor = [];
      let previewModel: any = {
        outId: this.selectionList,
        outCaseIds: this.multipleSelection.map(v => v.caseId),
        isNumAvg: Number(this.isNumAvg)
      };
      this.getTableData(previewModel);
    }
  }
  /**
   * 输入框最大值
   */
  inputMax(scope) {
    let max = this.multipleSelection.length;
    return max;
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
      this.multipleSelection.length - this.allocated > 0
        ? this.multipleSelection.length - this.allocated
        : 0;
    if (item > max) {
      this.$alert(
        `当前选择的案件数是${
          this.multipleSelection.length
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
}
</script>
<style>
.text-center {
  text-align: center;
}

.inrushUserAllocate .el-checkbox__label {
  font-size: 12px;
  color: #fff;
}

.inrushUserAllocate .batch .el-input__inner {
  width: 80px;
}

.btns {
  padding: 20px;
}

.text-center {
  text-align: center;
}
</style>
<style>
.case-distribution .el-alert {
  width: 100%;
  padding: 8px 16px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  color: #fff;
  opacity: 1;
  display: table;
  transition: opacity 0.2s;
}

.case-distribution .el-alert--info {
  background-color: #50bfff;
}

.case-distribution .el-checkbox__label {
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 12px;
}

.case-distribution .el-radio__label {
  font-size: 12px;
  padding-left: 10px;
}
.component.case-distribution.text-center {
  .el-input--small .el-input__inner {
    text-align: center;
  }
}
</style>
