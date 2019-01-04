<template>
  <section class="component tatics-preview">
    <div style="margin-bottom:15px" class="text-left">
      <span>策略名称：{{name}}</span>
    </div>
    <div class="text-left font-red">
      策略预览最多展示五十条结果。
    </div>
    <data-box :data="dataSet" @onPageChange="refreshData" :maxHeight="'auto'">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.phone | encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="city" label="申请城市" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overduePeriods" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            {{scope.row.overdueAmount|toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="commissionRate" label="佣金比例(%)" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="score" label="案件评分" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="delegationDate" label="委案日期" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="closeDate" label="到期日期" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="seriesName" label="产品系列" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="payStatus" label="还款状态" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="contractAmount" label="合同金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            {{scope.row.contractAmount|toThousands}}
          </template>
        </el-table-column>
      </template>
    </data-box>
    <div style="margin: 10px;text-align:center">
      <el-button @click="close">返回</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import NumberRange from "~/components/common/number-range.vue";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
import { StrateDataManualService } from "~/services/report-service/strate-data-manual.service";
import { Emit } from "vue-property-decorator";

@Component({
  components: {
    NumberRange,
    DataForm,
    DataBox
  }
})
export default class TaticsPreview extends Vue {
  @Dependencies(CaseInfoDistributeService) private caseInfoDistributeService: CaseInfoDistributeService;
  @Dependencies(StrateDataManualService) private strateDataManualService: StrateDataManualService;
  @Emit('close')
  close() { }
  private model: any = {
    personalName: '',
    phone: '',
    idCard: '',
    batchNumber: '',
    amtRange: { min: '', max: '' },
    jsonString: '',
    type: ''
  };
  private dataSet = null;
  private name = '';
  refresh(obj) {
    this.dataSet = null
    this.name = obj.name
    this.model.name = obj.name
    this.model.priority = obj.priority
    this.model.jsonString = JSON.stringify(obj.strategyJson)
    this.model.type = obj.tacticsType
    this.model.seriesIds = obj.seriesIds
    this.model.productIds = obj.productIds
    this.model.stripMark = obj.stripMark
    this.model.shops = obj.shops
    this.refreshData()
  }
  refreshData() {
    this.caseInfoDistributeService.previewResult(this.model).subscribe(data => {
      this.dataSet = data.content
    }, ({ msg }) => {
      this.$message.error(msg);
    })
  }
}

</script>

<style lang="less" scoped>
.font-red {
  color: #ff5722;
}
</style>
