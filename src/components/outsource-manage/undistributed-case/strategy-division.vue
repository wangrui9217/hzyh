<template>
  <section class="component strategy-division">
    <data-box ref="databox" :data="strategicDataSet">
      <template slot="columns">
        <el-table-column label="委外方编码" prop="outCode" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="outName" label="委外方名称" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="collectionCount" label="当前案件数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="collectionAmt" label="当前案件总金额" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionAmt| toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseDistributeCount" label="分配案件数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="caseDistributeMoneyCount" label="分配案件金额" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.caseDistributeMoneyCount| toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseTotalCount" label="总案件数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="caseMoneyTotalCount" label="总案件金额" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.caseMoneyTotalCount| toThousands}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {  Dependencies} from "~/core/decorator";
import {  Prop} from "vue-property-decorator";
import DataBox from "~/components/common/data-box.vue";

@Component({
  components: {
    DataBox
  }
})
export default class StrategyDivision extends Vue {
  @Prop() strategicDataSet: any;


}

</script>
