<template>
  <section class="component update-case">
    <data-box :data="updateDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" align="center" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" align="center" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo?scope.row.personalInfo.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo.mobileNo| encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" align="center" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo?scope.row.personalInfo.idCard:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
      </template>
    </data-box>
    <el-col align="center">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button @click="updateClick" :loading="submitLoading">确定</el-button>
    </el-col>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
// import { State } from "vuex-class";
import { Prop, Emit } from "vue-property-decorator";
// import { PrincipalService } from "~/services/business-service/principal.service";
import DataBox from "~/components/common/data-box.vue";
import { CaseInfoExceptionService } from "~/services/business-service/case-info-exception.service";
@Component({
  components: {
    DataBox
  }
})
export default class UpdateCase extends Vue {
  @Dependencies(CaseInfoExceptionService)
  private caseInfoExceptionService: CaseInfoExceptionService;
  @Emit("close")
  close() {}
  @Emit("success")
  success() {}
  private updateDataSet = null;
  private selectionList: Array<any> = [];
  private errId: any = "";
  private submitLoading: Boolean = false;

  refreshData(id) {
    this.errId = id;
    this.caseInfoExceptionService.findAllRepeatCaseInfo(id).subscribe(
      data => {
        this.updateDataSet = data.content;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  updateClick() {
    if (this.selectionList.length === 0) {
      this.$message("请选择异常案件!");
      return;
    }
    let ids = this.selectionList.map(v => v.id);
    this.submitLoading = true;
    this.caseInfoExceptionService
      .updateExceptionCase({
        caseInfoExceptionId: this.errId,
        caseInfoIds: ids
      })
      .subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("更新成功!");
          this.success();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
  }
}
</script>
