<template>
  <section class="component static-allot">
    <data-box :data="dataSet">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column label="催收板块" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span v-if="scope.row.type">委外</span>
            <span v-else>内催</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="分配案件数" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="amount" label="分配案件金额" align="right" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.amount |　toThousands}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <el-row type="flex" justify="center">
      <el-button @click="close">取消</el-button>
      <el-button @click="commit" :loading="submitLoading">确定</el-button>
    </el-row>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import DataBox from "~/components/common/data-box.vue";
  import { Dependencies } from "~/core/decorator";
  import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
  import { Emit } from "vue-property-decorator";

  @Component({
    components: {
      DataBox
    }
  })
  export default class StaticAllot extends Vue {
    @Dependencies(CaseInfoDistributeService) private caseInfoDistributeService: CaseInfoDistributeService;    
    @Emit('refreshList')
    refreshList(){}
    @Emit('close')
    close(){}
    private manualModel: any = {
      type: 0,
    };
    private dataSet: any = [];
    private submitLoading: Boolean = false;
    refresh(dataSet) {
      this.dataSet = dataSet
    }
    commit() {
      this.submitLoading = true;
      this.caseInfoDistributeService.strategyAllocation(this.dataSet).subscribe(data => {
        this.submitLoading = false;
        this.$message.success('分配成功!')
        this.dataSet = []
        this.refreshList()
        this.close()
      }, ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      })
  }
}
</script>

<style lang="less" scoped>

</style>
