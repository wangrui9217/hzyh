
<template>
    <section class="component set-export-items">
        <!--数据筛选 -START-->
        <div class="model">
            <data-selection title="客户基本信息" v-model="setUpdateModel.personalItems" :defaultOptions="basicOptions"></data-selection>
            <data-selection title="工作信息" v-model="setUpdateModel.jobItems" :defaultOptions="workOptions"></data-selection>
            <data-selection title="联系人信息" v-model="setUpdateModel.connectItems" :defaultOptions="contactOption"></data-selection>
            <data-selection title="案件基本信息" v-model="setUpdateModel.caseItems" :defaultOptions="caseInfoOption"></data-selection>
            <data-selection title="开户信息" v-model="setUpdateModel.bankItems" :defaultOptions="openAccountOption"></data-selection>
            <data-selection title="跟进记录" v-model="setUpdateModel.followItems" :defaultOptions="followAccountOption"></data-selection>
        </div>
        <!--数据筛选 -end-->
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
import {  Layout,  Dependencies} from "~/core/decorator";
import {  Watch,  Prop,  Emit} from "vue-property-decorator";
import DataSelection from "~/components/common/data-selection.vue";
import {  ExportItemsService} from "~/services/business-service/export-items.service";
import { exportItemsUpData } from "~/config/enum.config";

@Component({
  components: {
    DataSelection
  }
})
export default class SetExportItems extends Vue {
  @Dependencies(ExportItemsService) private exportItemsService: ExportItemsService;

  private setUpdateModel: any = {
    personalItems: [], // 客户基本信息
    jobItems: [], // 工作信息
    connectItems: [], // 联系人信息
    caseItems: [], // 案件基本信息
    bankItems: [], // 开户信息
    followItems: [] // 跟进记录
  };

   // 基本信息
  private basicOptions = exportItemsUpData.productBasic;
  // 工作信息
  private workOptions = exportItemsUpData.productWork;
  //联系人信息
  private contactOption = exportItemsUpData.productContact; 
  //   案件基本信息
  private caseInfoOption = exportItemsUpData.baseDataOptions;
  //   开户信息
  private openAccountOption = exportItemsUpData.productOpenAccount;
  //跟进信息
  private followAccountOption = exportItemsUpData.followMessage;
  private category: any = '';
  private submitLoading: Boolean = false;

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
    let paramData: any = Object.assign(this.setUpdateModel,{category: this.category})
    this.exportItemsService.saveExportItems(paramData).subscribe(
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
  checkExportItems(category){
    this.exportItemsService.getExportItems(category).subscribe(
      data => {this.setUpdateModel = data,this.category = category},
      err => this.$message.error(err.msg)
      )
  }
  /**
     * 查询更新项
     */
  refreshData() {
    this.exportItemsService.getExportItems(this.category).subscribe(
      data => this.setUpdateModel = data,
      err => this.$message.error(err.msg)
      )
  }
}

</script>
<style scoped lang="less">
.set-export-items {
  .model {
    text-align: left;
    margin-bottom: 20px;
  }

  .select {
    border: 1px solid #eff2f7;
    margin: 10px 0px 0px 0px;
  }

  .model-name {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .select-option {
    font-size: 12px;
    width: 180px;
    margin: 3px 0px 3px 5px !important;
  }

  .model-col {
    margin-left: 20px;
  }

  .iconColor {
    color: #01bccb;
    font-size: 18px;
  }
}
</style>
