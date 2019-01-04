<template>
  <section class="component choice-out-source text-center">
    <data-box ref="databox" :data="outSourceDataSet" :page="pageService" :selectionList.sync="selectionList"  @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column prop="outCode" label="受托方编码" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="outName" label="受托方" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="caseCount" label="案件数量" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="endCount" label="结案数量" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column label="历史催收成功率" :min-width="$helper.getColumnWidth(4)" prop="successRate">
          <template slot-scope="scope">
            <span>{{scope.row.successRate | toPercent}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endAmt" label="结案总金额" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.endAmt | toThousands}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <div style="margin-top:20px">
      <el-button @click="nextStp">下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
    <el-dialog append-to-body title="案件分配" :visible.sync="dialog.caseDistribution" width="90%" @open="TheCaseDistributionOpen" :close-on-click-modal="false" :close-on-press-escape="false">
      <case-distribution ref="case-distribution" :multipleSelection="selectedOutSource" @success="successFresh" @close="dialog.caseDistribution=false;" @preStep="dialog.caseDistribution=false"></case-distribution>
    </el-dialog>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import CaseDistribution from "~/components/outsource-manage/undistributed-case/choice-out-source/case-distribution.vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Prop, Emit } from "vue-property-decorator";
import { State } from "vuex-class";
import { PageService } from "~/utils/page.service";
import DataBox from "~/components/common/data-box.vue";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";

@Component({
  components: {
    DataBox,
    CaseDistribution
  }
})
export default class ChoiceOutSource extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(OutsourcePoolService) private outsourcePoolService: OutsourcePoolService;

  @Emit('close')
  close() {}
  @Emit('success')
  success() {}
  private outSourceDataSet: Array<any> = [];
  private outSourceModel: any = {};
  private selectionList: any = [];
  private selectedOutSource: any = [];
  private dialog: any = {
    caseDistribution: false
  };
  created() {

  }
  mounted() {

  }
  /**
   * 获取案件分配数据
   */
  TheCaseDistributionOpen() {
    this.$nextTick(() => {
      let caseDistribution = <any>this.$refs['case-distribution'];
      caseDistribution.refreshData(this.selectionList);
    })
  }
  refreshData(val) {
    let databox: any = this.$refs["databox"];
    databox.clearSelection()
    this.selectedOutSource = val
    this.outsourcePoolService.getOutDistributeInfo(this.outSourceModel, this.pageService).subscribe(data => {
      this.outSourceDataSet = data;
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      })
  }
  /**
   * 下一步
   */
  nextStp() {
    if (this.selectionList.length === 0) {
      this.$message('请选择受托方！')
      return;
    }
    this.dialog.caseDistribution = true
  }
  successFresh() {
    this.dialog.caseDistribution = false
    this.success()
    this.close()
  }
  /**
   * 取消
   */
  cancel() {
    this.close()
  }
  selectEmpty() {
    this.selectionList = []
  }
}

</script>
<style>
.text-center {
  text-align: center;
}
</style>
