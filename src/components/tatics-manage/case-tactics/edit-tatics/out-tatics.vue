<template>
  <section class="component out-tatics">
    <data-form :model="model" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="委外方编码" prop="outCode">
          <el-input v-model="model.outCode"></el-input>
        </el-form-item>
        <el-form-item label="委外方" prop="outName">
          <el-input v-model="model.outName"></el-input>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="dataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="outCode" label="委外方编码" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="outName" label="委外方" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="caseCount" label="案件数量" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="endCount" label="结案数量" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="successRate" label="历史催收成功率" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.successRate | toPercent}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseAmt" label="结案总金额" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.caseAmt | toThousands}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <el-row type="flex" justify="center">
      <el-button @click="close">上一步</el-button>
      <el-button @click="commit">完成</el-button>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { CaseStrategyService } from "~/services/dataimp-service/case-strategy.service";
import { OutsourceService } from "~/services/business-service/outsource.service";
import { PageService } from "~/utils/page.service";
import { Emit } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";

const taticManageModule = namespace('tatic-manage')

@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class OutTatics extends Vue {
  @Dependencies(OutsourceService) private outsourceService: OutsourceService;
  @Dependencies(CaseStrategyService) private caseStrategyService: CaseStrategyService;
  @Dependencies(PageService) private pageService: PageService;
  @taticManageModule.State('tacticsFlag') tacticsFlag
  @taticManageModule.Mutation('updateTacticsFlag') updateTacticsFlag
  @Emit('close')
  close() { }
  @Emit('success')
  success() { }
  private dataSet: any = null;
  private model: any = {
    outCode: '',
    outName: ''
  };
  private selectionList: any = [];
  private addOrModify: any = {};
  private tactics: any = {
    name: '',
    priority: '',
    strategyType: '',
    assignType: '',
    outsource: [],
    strategyJson: []
  };
  /**
   * 提交操作
   */
  commit() {
    if (!this.selectionList.length) {
      this.$message('请选择委外方！')
      return
    }
    let obj: any = {
      name: this.tactics.name,
      assignType: 4,
      strategyType: this.tactics.strategyType,
      strategyJson: JSON.stringify(this.tactics.strategyJson),
      priority: this.tactics.priority,
      outsource: this.selectionList.map(v => v.outId)
    }
    if (!this.addOrModify.flag) {
      obj.id = this.addOrModify.id
    }
    this.caseStrategyService.addCaseStrategy(obj).subscribe(data => {
      this.$message.success('操作成功')
      this.success()
    })
  }
  /**
   * 刷新
   */
  refresh(obj, addOrModify) {
    this.dataSet = null
    this.model.outCode = ''
    this.model.outName = ''
    this.addOrModify = addOrModify
    this.tactics.name = obj.name
    this.tactics.priority = obj.priority
    this.tactics.strategyType = obj.tacticsType
    this.tactics.strategyJson = obj.strategyJson
    this.tactics.outsource = obj.outsource
    this.tactics.assignType = obj.assignType
    this.refreshData()
  }
  refreshData() {
    this.outsourceService.getAllOutSourceInfoByCase(this.model, this.pageService).subscribe(data => {
      this.dataSet = data;
      // if(this.tactics.outsource) {
      //   this.$nextTick(()=>{
      //     this.selectionList = this.dataSet.filter(v => this.tactics.outsource.find(val => val === v.outId))
      //   })
      // }
    }, ({ msg }) => {
      this.$message.error(msg);
    });
  }
  mounted() {
  }
}
</script>

<style lang="less" scoped>
.dialog-footer {
  padding: 20px;
}
</style>
