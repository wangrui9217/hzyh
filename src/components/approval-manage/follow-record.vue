<template>
  <section class="component follow-record">
    <div class="text-center case-flow-follow" style="padding:0 5px;overflow-y:auto;width:100%;height:85px" v-if="caseTransfer.length > 0">
      <el-steps :space="195" :active="caseTransfer.length-1" process-status="success" style="display:block">
        <el-step v-for="item in caseTransfer" :key="item.index" :title="titleAndName(item)" :description="item.operatorTime | dateTimeFormat" style="float: left;width:195px"></el-step>
      </el-steps>
    </div>
    <data-form :model="model" @onSearch="refreshData" :page="pageService" @handleResetForm="handleResetForm">
      <template slot="default-input">
        <el-form-item label="跟进日期" prop="operatorTime">
          <el-date-picker v-model="model.operatorTime" type="daterange" :editable="false" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="催收反馈" prop="collectionFeedback">
          <el-cascader v-model="model.collectionFeedbacks" :options="feedOptions" @change="feedbackChange" change-on-select :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="催记来源" prop="type">
          <el-select v-model="model.type" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0016')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <!--<el-button @click="exportFollowClick">导出跟进记录</el-button>-->
      </template>
    </data-form>
    <data-box :data="dataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="operatorTime" label="跟进时间" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.operatorTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="催记来源" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.type | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="催收对象" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.target | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="targetName" label="姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="resultType" label="反馈类型" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.resultType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectionFeedback" label="催收反馈" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionFeedback | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outFollowupBack" label="委外催收反馈" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="contactPhone" label="电话" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
         <el-table-column prop="detail" label="地址" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="content" label="跟进内容" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="followPerson" label="跟进人员" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button @click="checkCallFileHandle(scope.row.opUrl)" type="text">播放录音</el-button>
            <el-button @click="loadCallFileHandle(scope.row.opUrl)" type="text">下载录音</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { PersonalService } from "~/services/business-service/personal.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
import { FilterService } from "~/utils/filter.service";

import { Watch, Prop } from "vue-property-decorator";
import { CommonService } from "~/utils/common.service";
import clone from "clone";
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class FollowRecord extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(PersonalService) private personalService: PersonalService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;
  @Prop() caseNumber: any;
  @Prop({
    type: Boolean,
    default: false
  })
  @Prop()
  out: any;

  private model: any = {
    type: "",
    collectionFeedback: "",
    collectionFeedbacks: [],
    operatorTime: []
  };
  private dataSet = null;
  private caseTransfer: any = [];
  private feedOptions: any = [];
  @Watch("caseNumber")
  getRecord() {
    this.model = {
      type: "",
      collectionFeedback: "",
      collectionFeedbacks: [],
      operatorTime: [],
      caseNumber: this.caseNumber
    };
    this.caseTransfer = [];
    this.refreshData();
    if (this.out) return false;
    this.personalService.getCaseTurnRecord(this.caseNumber).subscribe(
      data => {
        this.caseTransfer = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 流转记录title
   */
  titleAndName(item) {
    let receiveDeptName: any = item.receiveDeptName;
    let deptName: any = Number(item.receiveDeptName);
    if (isNaN(deptName))
      return `${item.receiveUserRealName}(${receiveDeptName})`;
    let newItem: any = FilterService.dictConvert(deptName);
    return `${item.receiveUserRealName}(${newItem})`;
  }

  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.model.collectionFeedback = this.model.collectionFeedbacks[
      this.model.collectionFeedbacks.length - 1
    ];
    if (!this.model.collectionFeedback) {
      this.model.collectionFeedback = "";
    }
  }
  /**
   * 下载录音
   */
  loadCallFileHandle(url) {
    if (url === null) {
      this.$message.info("该案件没有录音文件！");
    } else {
      CommonService.downloadFile(url, "录音文件");
    }
  }
  /**
   * 播放录音
   */
  checkCallFileHandle(url) {
    if (url === null) {
      this.$message.info("该案件没有录音文件！");
    } else {
      location.href = url;
    }
  }
  /**
   * 导出跟进记录
   */
  exportFollowClick() {
    this.caseInfoService.exportFollowRecord(this.caseNumber).subscribe(
      data => {
        this.$message.info("操作成功！");
        CommonService.downloadFile(data, "跟进记录");
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 重置
   */
  handleResetForm() {
    this.model.dateRange = [];
    this.model.collectionFeedbacks = [];
  }
  refreshData() {
    this.dataSet = null;
    if (this.out) {
      this.outsourcePoolService
        .getOutSourceCaseFollowRecord(this.model, this.pageService, {
          followTime: "desc"
        })
        .subscribe(
          data => {
            this.dataSet = data;
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    } else {
      this.accTelPoolService
        .getFollowupRecord(
          this.model.caseNumber,
          this.model,
          this.pageService,
          { operatorTime: "desc" }
        )
        .subscribe(
          data => {
            this.dataSet = data;
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    }
  }
  mounted() {
    // 催收反馈下拉框选项
    let valid = clone(this.$dict.getDictData("0019"));
    valid.forEach(v => {
      if (v.value === 88) {
        v.children = this.$dict.getDictData("0020");
      }
      if (v.value === 89) {
        v.children = this.$dict.getDictData("0021");
      }
      if (v.value === 835) {
        v.children = this.$dict.getDictData("0257");
      }
    });
    this.feedOptions = valid;
    this.getRecord();
  }
}
</script>

<style lang="less" scoped>
</style>
