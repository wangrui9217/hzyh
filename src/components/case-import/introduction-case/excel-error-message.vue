<template>
  <section class="page excel-error-message">
    <data-box ref="databox" :data="excelDataSet" hiddenForm>
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.caseAmount | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="errorMsg" label="错误内容" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.errorMsg" placement="top-start" style="padding:0px" v-if="scope.row.errorMsg.length>45">
              <span>{{scope.row.errorMsg | ellipsis(45)}}</span>
            </el-tooltip>
            <span v-else>{{scope.row.errorMsg}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <div style="text-align: center">
      <el-button @click="close">关闭</el-button>
      <el-button @click="exportErrorExcel">导出错误报表</el-button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { DataInfoExcelService } from "~/services/dataimp-service/data-info-excel.service";
import { CommonService } from "~/utils/common.service";

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class ExcelErrorMessage extends Vue {
  @Dependencies(DataInfoExcelService)
  private dataInfoExcelService: DataInfoExcelService;
  private params: any = {
    batchNumber: "",
    companyCode: ""
  };
  private excelDataSet: any = [];
  exportErrorExcel() {
    this.dataInfoExcelService
      .exportError({ batchNumber: this.params.batchNumber })
      .subscribe(
        data => {
          CommonService.downloadFile(data, "导出错误报告");
          this.$message.success("操作成功");
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  close() {
    this.$emit("close");
  }
  refresh(batchNumber, companyCode) {
    this.params.batchNumber = batchNumber;
    this.params.companyCode = "";
    if (companyCode) {
      this.params.companyCode = companyCode;
    }
    this.dataInfoExcelService.findError(this.params).subscribe(
      data => {
        this.excelDataSet = data.content;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
}
</script>
<style lang="less" scoped>
</style>

