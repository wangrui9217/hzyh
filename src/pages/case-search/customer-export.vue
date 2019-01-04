<template>
  <section class="page customer-export">
    <!--数据筛选 -START-->
    <div class="model">   
      <div class="model-name">
        <span class="title-text">导出纬度</span>
      </div>
      <el-radio-group v-model="exportType">
        <el-radio :label="0">案件类型</el-radio>
        <el-radio :label="1">产品类型</el-radio>
        <el-radio :label="2">案件状态</el-radio>
      </el-radio-group>
    </div>
    <div class="model">
      <div v-show="exportType === 0">
        <data-selection title="案件类型" v-model="caseTypeModel.caseType" :defaultOptions="caseTypeOptions"></data-selection>
        <data-selection title="基本信息" v-model="caseTypeModel.baseInfo" :defaultOptions="dataOptionsBase"></data-selection>
      </div>
      <div v-show="exportType === 1">
        <data-selection title="产品类型" v-model="productModel.seriesName" :defaultOptions="productSeriesSelectionData"></data-selection>
        <data-selection title="基本信息" v-model="productModel.baseInfo" :defaultOptions="dataOptionsBase"></data-selection>
      </div>
      <div v-show="exportType===2">
        <data-selection title="案件状态" v-model="statusModel.collectionState" :defaultOptions="collectionStateOptions"></data-selection>
        <data-selection title="基本信息" v-model="statusModel.baseInfo" :defaultOptions="dataOptionsBase"></data-selection>
      </div>
    </div>
    <div style="text-align:center">
      <el-button @click="exportClick" v-auth="5092" :loading="submitLoading">导出</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import DataSelection from "~/components/common/data-selection.vue";
import { UserService } from "~/services/business-service/user.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { PersonalService } from "~/services/business-service/personal.service";
import { CommonService } from "~/utils/common.service";
import { exportSelectionData } from "~/config/enum.config";

@Auth(381)
@Layout("workspace")
@Component({
  components: {
    DataSelection
  }
})
export default class CustomerExport extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(PersonalService) private personalService: PersonalService;
  @Getter departmentData: any;
  @State departmentList: any;
  private orgCuponameList: any = [];
  private productSeriesSelectionData: any = [];
  private batchSelectionData: any = [];
  private collectionStateSelectionData: any = [];
  private submitLoading: Boolean = false;

  // 数据信息
  private dataOptionsBase = exportSelectionData.baseDataOptions;
  // 基本信息
  private basicOptions = exportSelectionData.productBasic;
  // 工作信息
  private workOptions = exportSelectionData.productWork;
  //   联系人信息
  private contactOptions =  exportSelectionData.productContact;
  //   开户信息
  private openAccountOptions =exportSelectionData.productOpenAccount;
  // 案件类型导出类型

  private exportType: number = 0;
  private collectionStateRawOptions:Array<any> = this.$dict.getDictData("0004")
  private caseTypeRawOptions:Array<any> = this.$dict.getDictData("0050")
  private seriesRawData:Array<any> = []
  private caseTypeModel: any = {
    baseInfo: [],
    caseType: []
  };

  private productModel: any = {
    seriesName: [],
    baseInfo: []
  };
  private statusModel: any = {
    collectionState: [],
    baseInfo: []
  };

  get caseTypeOptions() {
    let options:any = this.caseTypeRawOptions.map(v => v.label)
    return options
  }

  get collectionStateOptions() {
    let options:any = ['待分配','待催收','催收中','归C案件','已结清']
    return options
  }

  exportClick() {
    let data: any = {};
    let form: any = {};
    let exportMsg = "请勾选要导出的字段!";
    let validResult = false;
    switch (this.exportType) {
      case 0:
        if (this.caseTypeModel.caseType.length === 0) {
          this.$message("请勾选要导出的案件类型!");
          return
        }
        if (this.caseTypeModel.baseInfo.length === 0) {
          this.$message(exportMsg);
        } else {
          data = this.formatCollectData();
          validResult = true;
        }
        break;
      case 1:
        if (this.productModel.seriesName.length === 0) {
          this.$message("请勾选要导出的产品类型!");
          return
        }
        if (this.productModel.baseInfo.length === 0) {
          this.$message(exportMsg);
        }  else {
          data = this.formatProductData();
          validResult = true;
        }
        break;
      case 2:
        if (this.statusModel.collectionState.length === 0) {
          this.$message("请勾选要导出的案件状态!");
          return
        }
        if (this.statusModel.baseInfo.length === 0) {
          this.$message(exportMsg);
        } else {
          data = this.formatStatusData();
          validResult = true;
        }
        break;
    }
    if (validResult) {
      this.submitLoading = true
      this.personalService
        .personalInfoExport(data)
        .subscribe(
        data => {
          this.$message.success("导出成功,请到任务中心确认"),
          this.submitLoading = false
        },
        err => {
          this.$message.error(err.msg),
          this.submitLoading = false
        });
    }
  }
  /**
   * 格式化产品系列查询数据
   */
  formatProductData() {
    let seriesId:Array<any> = []
    this.productModel.seriesName.forEach(value => {
      this.seriesRawData.forEach(v => {
        if(v.seriesName === value){
          seriesId.push(v.id)
        }
      })
    })
    return {
      dataInfo: {
        baseInfo: this.productModel.baseInfo,
      },
      dataFilter: {
        seriesId: seriesId
      }
    };
  }

  /**
   * 格式化催收员查询数据
   */
  formatCollectData() {
    let caseType:Array<any> = []
    this.caseTypeModel.caseType.forEach(value => {
      this.caseTypeRawOptions.forEach(v => {
        if(v.label === value){
          caseType.push(v.value)
        }
      })
    })
    return {
      dataInfo: {
        baseInfo: this.caseTypeModel.baseInfo
      },
      dataFilter: {
        caseType: caseType
      }
    };
  }

  /**
   * 格式化案件状态查询数据
   */
  formatStatusData() {
    let collectionState:Array<any> = []
    this.statusModel.collectionState.forEach(value => {
      this.collectionStateRawOptions.forEach(v => {
        if(v.label === value){
          collectionState.push(v.value)
        }
      })
    })
    return {
      dataInfo: {
        baseInfo: this.statusModel.baseInfo
      },
      dataFilter: {
        collectionState: collectionState
      }
    };
  }

  mounted() {
    // 查询所有产品系列
    this.productSeriesService
      .getAllProductSeries()
      .subscribe(data => {
        this.seriesRawData = data
        this.productSeriesSelectionData = Array.from(new Set(data.map(v=>v.seriesName)))
      })
    // 查询所有批次
    this.caseInfoService
      .getAllBatchNumber()
      .subscribe(data => (this.batchSelectionData = data));

    // 过滤催收状态选择列表
    let data = this.$dict.getDictData("0004");
    // 排除已委外，已还款,提前结清还款中
    let filterList = [166, 171, 23];
    this.collectionStateSelectionData = data.filter(
      x => filterList.indexOf(x.value) < 0
    );
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
