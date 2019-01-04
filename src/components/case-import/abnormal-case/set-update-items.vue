<template>
  <section class="page customer-export">
    <!--数据筛选 -START-->

    <div class="model">
      <data-selection title="客户基本信息" v-model="setUpdateModel.personalItems" :defaultOptions="basicOptions"></data-selection>
      <data-selection title="工作信息" v-model="setUpdateModel.jobItems" :defaultOptions="workOptions"></data-selection>
      <data-selection title="案件基本信息" v-model="setUpdateModel.caseItems" :defaultOptions="contactOptions"></data-selection>
      <data-selection title="开户信息" v-model="setUpdateModel.bankItems" :defaultOptions="openAccountOptions"></data-selection>
    </div>
    <!--按钮区START-->
    <div style="text-align:center">
      <el-button @click="cancelClick">取消</el-button>
      <el-button @click="saveClick" :loading="submitLoading">确定</el-button>
    </div>
    <!--按钮区END-->
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { Getter, State } from "vuex-class";
import DataSelection from "~/components/common/data-selection.vue";
import { UserService } from "~/services/business-service/user.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { PersonalService } from "~/services/business-service/personal.service";
import { CommonService } from "~/utils/common.service";
import { selectionUpData } from "~/config/enum.config";
import { Watch, Prop, Emit } from "vue-property-decorator";
import { ExportItemsService } from "~/services/business-service/export-items.service";

@Auth(381)
@Layout("workspace")
// 可选项数据


@Component({
  components: {
    DataSelection
  }
})
export default class CustomerExport extends Vue {
  @Dependencies(ExportItemsService) private exportItemsService: ExportItemsService;
  @State userData: any;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;

  private setUpdateModel: any = {
    jobItems: [], // this.checkWorkOptions
    personalItems: [], // this.checkBasicOptions
    bankItems: [], // this.checkopenAccountAllOptions
    caseItems: [], // this.checkcaseInfoAllOptions
    connectItems: [],
    followItems: []
  };
  private submitLoading: Boolean = false;
  // 基本信息
  private basicOptions = selectionUpData.productBasic;
  // 工作信息
  private workOptions = selectionUpData.productWork;
  //   案件基本信息
  private contactOptions = selectionUpData.baseDataOptions;
  //   开户信息
  private openAccountOptions = selectionUpData.productOpenAccount;

  /**
       * 确定
       */
  saveClick() {
    let len: number = 0
    let key: any = null
    for (key in this.setUpdateModel) {
      let item:any = this.setUpdateModel[key]
      len +=  item ? item.length : 0
    }
    if (len === 0) {
      this.$message('请至少选择一个要更新得选项')
      return;
    }
    this.submitLoading = true;
    this.exportItemsService.saveUpdateItems(this.setUpdateModel).subscribe(
      data => {
        this.submitLoading = false;
        this.$message.success('设置成功')
        this.close()
      }, err => {
        this.submitLoading = false;
        this.$message.error(err.msg)
      }
    )
  }

  @Emit('close')
  close() { }
  /**
   * 取消
   */
  cancelClick() {
    this.close()
  }
  /**
     * 查询更新项
     */
  refreshData(companyCode) {
    this.exportItemsService.getUpdateItems(companyCode).subscribe(
      data => this.setUpdateModel = data,
      msg => this.$message.error(msg)
      )

  }
}
</script>

<style lang="less" scoped>
.model {
  text-align: left;
  margin-left: 10px;
  margin-bottom: 20px;
  @boxhigh: 16px;
  .model-name {
    font-size: 14px;
    float: left;
    margin-right: 30px;
    margin-bottom: 10px;
    height: @boxhigh;
    .title-text {
      line-height: @boxhigh;
      height: @boxhigh;
      font-weight: bold;
    }
  }
}
</style>
