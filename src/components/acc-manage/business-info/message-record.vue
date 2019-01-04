<template>
  <section class="component message-record">
    <data-form :model="messagerecordModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="发送方式" prop="sendWay">
          <el-select v-model="messagerecordModel.sendWay" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0024')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类别" prop="tempelateType">
          <el-select v-model="messagerecordModel.tempelateType" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0023')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="collapse-input">
      </template>
      <template slot="default-button">
      </template>
    </data-form>

    <data-box :data="messagerecordDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="sendWay" label="发送方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.sendWay | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tempelateCode" label="模板序号"  :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="tempelateType" label="模板类别" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.tempelateType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tempelateName" label="模板名称" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="operatorDate" label="发送时间" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorDate|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="发送对象" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.target | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="targetName" label="发送对象姓名" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="flag" label="是否成功" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.flag">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button type="text" size="small">查看详情</el-button>
            <el-button type="text" size="small" v-if="scope.row.messageType===159">下载语音</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { State, Mutation, namespace } from "vuex-class";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import clone from "clone";
import { Watch } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class MessageRecord extends Vue {
  @accManageModule.State caseId;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  private messagerecordModel: any = {
    applyDate: "",
    assistWay: "",
    approveStatus: ""
  };
  private messagerecordDataSet: any = [];
  private feedOptions: any = [];
  @accManageModule.State isMessage;
  @Watch("isMessage")
  onMessageChange() {
    this.refreshData();
  }
  @Watch("caseId")
  onCaseIdChange() {
    this.refreshData();
  }
  mounted() {
    this.refreshData();
  }
  refreshData() {
    let Model: any = {
      caseId: this.caseId,
      applyDate: this.messagerecordModel.applyDate,
      assistWay: this.messagerecordModel.assistWay,
      approveStatus: this.messagerecordModel.approveStatus
    };
    this.accTelPoolService
      .getAllSendMessageRecord(Model, this.pageService)
      .subscribe(
        data => {
          this.messagerecordDataSet = data;
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
