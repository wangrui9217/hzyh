<template>
  <section class="component phone-record">
    <data-form :model="phonerecordModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="跟进对象" prop="targetName">
          <el-input v-model="phonerecordModel.targetName"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="operatorTime">
          <el-date-picker v-model="phonerecordModel.operatorTime" type="daterange" :editable="false">
          </el-date-picker>
        </el-form-item>
      </template>
      <template slot="collapse-input">
      </template>
      <template slot="default-button">
      </template>
    </data-form>

    <data-box :data="phonerecordDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="targetName" label="跟进对象" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.approveStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorTime" label="跟进时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="跟进人员" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column label="录音文件" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <el-button type="text" @click="telClick(scope)">下载录音</el-button>
            <el-button type="text" @click="checkSoundClick(scope)">试听录音</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  Layout,
  Dependencies
} from "~/core/decorator";
import {
  PageService
} from "~/utils/page.service";
import {
  State,
  Mutation,
  namespace
} from "vuex-class";
import {
  AccTelPoolService
} from "~/services/business-service/acc-tel-pool.service";
import { CommonService } from "~/utils/common.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import clone from "clone"
import { Watch } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class PhoneRecord extends Vue {
  @accManageModule.State caseInfo;
  @accManageModule.State currentBusinessTabName;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Watch("caseInfo")

  @Watch("currentBusinessTabName")
  onCaseIdChange() {
    this.$nextTick(() => {
      this.refreshData();
    })
  }
  private phonerecordModel: any = {
    targetName: '',
    operatorTime: []
  };
  private phonerecordDataSet: any = [];
  private feedOptions: any = [];


  // mounted() {
  //   this.refreshData()
  // }
  // 下载录音文件
  telClick(scope) {
    CommonService.downloadFile(scope.row.opUrl, '录音文件')
  }
  // 查看录音文件
  checkSoundClick(scope) {
    location.href = scope.row.opUrl
  }
  refreshData() {
    let Model: any = {
      caseNumber: this.caseInfo.caseNumber,
      targetName: this.phonerecordModel.targetName,
      operatorTime: this.phonerecordModel.operatorTime
    }
    this.accTelPoolService
      .getPhoneRecord(Model, this.pageService)
      .subscribe(
      data => {
        this.phonerecordDataSet = data;
      },
      ({
            msg
          }) => {
        this.$message.error(msg);
      }
      );
  }
}

</script>

<style lang="less" scoped>

</style>
