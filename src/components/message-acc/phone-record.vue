<template>
  <section class="component phone-record">
    <data-form :model="phoneModle" @onSearch="refreshData" :page="pageService">
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="跟进对象" prop="targetName">
          <el-input v-model="phoneModle.targetName"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="operatorTime">
          <div class="block">
            <el-date-picker v-model="phoneModle.operatorTime" class="daterange-large" type="daterange" placeholder="选择时间" :editable="false" range-separator="~">
            </el-date-picker>
          </div>
        </el-form-item>
      </template>
    </data-form>
    <!--数据列区域-->
    <data-box :data="callRecordDataSet" @onPageChange="refreshData" ref="data-box" :page="pageService">
      <template slot="columns">
        <el-table-column prop="targetName" label="跟进对象" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="operatorTime" label="跟进时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="跟进人员" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column label="录音文件" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="telClick(scope)" type="text" size="small">下载录音</el-button>
            <el-button @click="checkSoundClick(scope)" type="text" size="small">试听录音</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { PageService } from "~/utils/page.service";
import { CommonService } from "~/utils/common.service";
import { State, Action, namespace, Getter } from "vuex-class";
import { FilterService } from "~/utils/filter.service";
import { Emit, Watch } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Component({
  components: {
    DataForm,
    DataBox,
  }
})
export default class PhoneRecord extends Vue {
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(PageService) private pageService: PageService;
  @accManageModule.State caseInfo;

  @Watch("caseInfo")
  onCaseIdChange() {
    this.refreshData();
  }

  private operatorTime: any = { min: "", max: "" }
  private callRecordDataSet = null
  private caseNumber: any;
  private phoneModle: any = {
    operatorTime: [],
    targetName: ''
  }
  // private defaultParams: any = {
  //   caseNumber: this.caseInfo.caseNumber
  // }
  refreshMessage(value) {
    this.caseNumber = value
    this.refreshData()
  }
  refreshData() {
    this.accTelPoolService
      .getPhoneRecord({
        operatorTime: [FilterService.dateRanageFormat(this.phoneModle.operatorTime).start, FilterService.dateRanageFormat(this.phoneModle.operatorTime).end],
        targetName: this.phoneModle.targetName,
        caseNumber: this.caseNumber
      }, this.pageService)
      .subscribe(data => {
        this.callRecordDataSet = data;
      }, ({ msg }) => {
        this.$message.error(msg);
      })
  }
  // 下载录音文件
  telClick(scope) {
    CommonService.downloadFile(scope.row.opUrl, '录音文件')
  }
  // 查看录音文件
  checkSoundClick(scope) {
    location.href = scope.row.opUrl
  }
}
</script>

<style lang="less" scoped>

</style>
