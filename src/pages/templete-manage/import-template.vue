<template>
  <section class="page import-template" style="padding-top:20px;padding-left:10px">
    <!--客户基本信息START-->
    <template>
      <div class="model" v-show="(this.customerOptions.length+this.custOptDefaultSelect.length) !== 0">
        <el-col class="model-name">
          <span class="iconfont icon-kehujibenziliao iconColor"></span>
          <span> 客户基本信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="checkAllCustomerOption" :indeterminate="customerIsIndeterminate" @change="customerOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <!--默认必选项-->
            <el-checkbox class="select-option" :checked='true' disabled v-for="cust in this.custOptDefaultSelect" :key="cust">{{cust}}</el-checkbox>
            <!--可选项-->
            <el-checkbox-group v-model="checkCustomerOptions" @change="customerOptionsChange">
              <el-checkbox class="select-option" v-for="cust in this.customerOptions" :label="cust" :key="cust">{{cust}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--客户基本信息END-->
    <!--客户原始地址信息START-->
    <template>
      <div class="model" v-show="(this.customerOriginAddressOptions.length+this.custOriAddrOptDefaultSelect.length) !== 0">
        <el-col class="model-name">
          <span class="iconfont icon-xiufuxinxi iconColor"></span>
          <span> 客户原始地址信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="checkAllCustomerOriginAddressOption" :indeterminate="customerOriginAddressIsIndeterminate" @change="customerOriginAddressOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <el-checkbox class="select-option" :checked='true' disabled v-for="custOri in this.custOriAddrOptDefaultSelect" :key="custOri">{{custOri}}</el-checkbox>
            <el-checkbox-group v-model="checkCustomerOriginAddressOptions" @change="customerOriginAddressOptionsChange">
              <el-checkbox class="select-option" v-for="custOri in this.customerOriginAddressOptions" :label="custOri" :key="custOri">{{custOri}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--客户原始地址信息END-->
    <!--客户房产资料START-->
    <template>
      <div class="model" v-show="(this.customerAssetOptions.length+this.custAssetOptDefaultSelect.length) !== 0">
        <el-col class="model-name">
          <span class="iconfont icon-danweixinxi iconColor"></span>
          <span>客户房产资料</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="checkAllCustomerAssetOption" :indeterminate="customerAssetIsIndeterminate" @change="customerAssetOptionAllChange">全选</el-checkbox>
          </div>
          <div>
            <span>请选择要配置的房产数目：</span>
            <el-select v-model="assetNum" placeholder="请选择" @change="assetOptChange" clearable>
              <el-option v-for="item in assetsOpt" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="select">
            <el-checkbox class="select-option" :checked='true' disabled v-for="custAsset in this.custAssetOptDefaultSelect" :key="custAsset">{{custAsset}}</el-checkbox>
            <el-checkbox-group v-model="checkCustomerAssetOptions" @change="customerAssetOptionsChange">
              <el-checkbox class="select-option" v-for="custAsset in this.customerAssetOptions" :label="custAsset" :key="custAsset">{{custAsset}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--客户房产资料END-->
    <!--客户车产资料START-->
    <template>
      <div class="model" v-show="(this.carOptions.length+this.carOptDefaultSelect.length) !== 0">
        <el-col class="model-name">
          <span class="iconfont icon-chechan iconColor"></span>
          <span>客户车产资料</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox :indeterminate="carIsIndeterminate" v-model="checkAllCarOption" @change="carOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <el-checkbox class="select-option" :checked='true' disabled v-for="car in this.carOptDefaultSelect" :key="car">{{car}}</el-checkbox>
            <el-checkbox-group v-model="checkCarOptions" @change="carOptionsChange">
              <el-checkbox class="select-option" v-for="car in carOptions" :label="car" :key="car">{{car}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--客户车产资料END-->
    <!--客户职业资料START-->
    <template>
      <div class="model" v-show="(this.jobOptions.length+this.jobOptDefaultSelect.length) !== 0">
        <el-col class="model-name">
          <span class="iconfont icon-kehuzhiyeziliao iconColor"></span>
          <span>客户职业资料</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox :indeterminate="jobIsIndeterminate" v-model="checkAllJobOption" @change="jobOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <el-checkbox class="select-option" :checked='true' disabled v-for="job in this.jobOptDefaultSelect" :key="job">{{job}}</el-checkbox>
            <el-checkbox-group v-model="checkJobOptions" @change="jobOptionsChange">
              <el-checkbox class="select-option" v-for="job in jobOptions" :label="job" :key="job">{{job}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--客户职业资料END-->
    <!--客户联系人信息START-->
    <template>
      <div class="model" v-show="(this.relationOptions.length+this.relationOptDefaultSelect.length) !== 0">
        <el-col class="model-name">
          <span class="iconfont icon-lianxirenxinxi iconColor"></span>
          <span>客户联系人信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox :indeterminate="relationIsIndeterminate" v-model="checkAllRelationOption" @change="relationOptionAllChange">全选</el-checkbox>
          </div>
          <div>
            <span>请选择要配置的联系人数目：</span>
            <el-select v-model="relationNum" placeholder="请选择" @change="relationOptChange" clearable>
              <el-option v-for="item in relationOpt" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="select">
            <el-checkbox class="select-option" :checked='true' disabled v-for="relation in this.relationOptDefaultSelect" :key="relation">{{relation}}</el-checkbox>
            <el-checkbox-group v-model="checkRelationOptions" @change="relationOptionsChange">
              <el-checkbox class="select-option" v-for="relation in relationOptions" :label="relation" :key="relation">{{relation}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--客户联系人信息END-->
    <!--订单基本信息START-->
    <template>
      <div class="model" v-show="this.orderOptions.length !== 0">
        <el-col class="model-name">
          <span class="iconfont icon-dingdanjibenxinxi iconColor"></span>
          <span>订单基本信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox :indeterminate="orderIsIndeterminate" v-model="checkAllOrderOption" @change="orderOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <el-checkbox class="select-option" :checked='true' disabled v-for="order in this.orderOptDefaultSelect" :key="order">{{order}}</el-checkbox>
            <el-checkbox-group v-model="checkOrderOptions" @change="orderOptionsChange" size="small">
              <el-checkbox class="select-option" v-for="order in orderOptions" :label="order" :key="order">{{order}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--订单基本信息END-->
    <!--客户开户信息START-->
    <template>
      <div class="model" v-show="(this.accountOptions.length+this.accountOptDefaultSelect.length) !== 0">
        <el-col class="model-name">
          <span class="iconfont icon-xiufuxinxi iconColor"></span>
          <span>客户开户信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox :indeterminate="accountIsIndeterminate" v-model="checkAllAccountOption" @change="accountOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <el-checkbox class="select-option" :checked='true' disabled v-for="account in this.accountOptDefaultSelect" :key="account">{{account}}</el-checkbox>
            <el-checkbox-group v-model="checkAccountOptions" @change="accountOptionsChange" size="small">
              <el-checkbox class="select-option" v-for="account in accountOptions" :label="account" :key="account">{{account}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--客户开户信息END-->
    <!--按钮区START-->
    <div style="text-align:center">
      <el-button @click="saveClick" v-auth="5506">确定并下载</el-button>
    </div>
    <!--按钮区END-->
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { CommonService } from "~/utils/common.service";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Mutation } from "vuex-class";
import { Prop } from "vue-property-decorator";
import { AccImportExcelDataService } from "~/services/dataimp-service/acc-import-excel-data.service";

@Auth(827)
@Layout("workspace")
@Component({
  components: {}
})
export default class ImportTemplate extends Vue {
  @Dependencies(AccImportExcelDataService) private accImportExcelDataService: AccImportExcelDataService;
  private importModel: any = {}
  /**
   * 客户基本信息相关
   */
  // 客户基本信息选项（必选）
  private custOptDefaultSelect: any = ['客户姓名', '身份证号']
  // 客户基本信息选项（可选）
  private customerOptions: any = ['手机号码', '身份证户籍地址', '家庭住址', '家庭固话', '客户号', '省份', '城市']
  // 检查选中项
  private checkCustomerOptions: any = []
  // 全选样式控制
  private customerIsIndeterminate: any = true
  // 检查全选是否选中
  private checkAllCustomerOption: any = false
  /**
   * 客户职业资料相关
   */
  // 客户职业资料选项（必选）
  private jobOptDefaultSelect: any = []
  // 客户职业资料选项（可选）
  private jobOptions: any = ['工作单位名称', '工作单位地址', '工作单位电话']
  // 检查选中项
  private checkJobOptions: any = []
  // 全选样式控制
  private jobIsIndeterminate: any = true
  // 检查全选是否选中
  private checkAllJobOption: any = false
  // 客户联系人信息相关
  private relationOptDefaultSelect: any = []
  // 客户职业资料选项（可选）
  private relationOptions: any = ['姓名', '手机号码', '住宅电话', '现居地址', '与客户关系', '工作单位', '单位电话']
  // 检查选中项
  private checkRelationOptions: any = []
  // 全选样式控制
  private relationIsIndeterminate: any = true
  // 检查全选是否选中
  private checkAllRelationOption: any = false
  private relationNum: any = ''
  private relationOpt: any = [] // 联系人数目可选值
  /**
   * 订单基本信息相关
   */
  // 订单基本信息选项（必选）
  private orderOptDefaultSelect: any = ['逾期总金额(元)']
  // 订单基本信息（可选）
  private orderOptions: any = ['产品系列', '产品名称', '合同编号', '贷款日期', '合同金额(元)', '剩余本金(元)',
    '剩余利息(元)', '逾期本金(元)', '逾期利息(元)', '逾期罚息(元)', '逾期滞纳金(元)', '还款期数',
    '每期还款日', '每期还款金额(元)', '其他费用(元)', '逾期日期', '逾期期数', '逾期天数', '已还款金额(元)',
    '已还款期数', '最近还款日期', '最近还款金额(元)', '佣金比例(%)', '账龄', '首次还款日期','账户余额','未偿还本金'
  ]
  // 可选项
  private checkOrderOptions: any = []
  // 全选样式控制
  private orderIsIndeterminate: any = true
  // 检查全选是否选中
  private checkAllOrderOption: any = false
  /**
   * 客户开户信息相关
   */
  // 客户开户信息（必选）
  private accountOptDefaultSelect: any = []
  //  客户开户信息（可选）
  private accountOptions: any = ['客户还款卡银行', '客户还款卡号', '账户号']
  // 可选项
  private checkAccountOptions: any = []
  // 全选样式控制
  private accountIsIndeterminate: any = true
  // 检查全选是否选中
  private checkAllAccountOption: any = false
  /**
   * 客户原始地址信息
   */
  // 客户原始地址信息选项（必选）
  private custOriAddrOptDefaultSelect: any = []
  // 客户基本信息选项（可选）
  private customerOriginAddressOptions: any = []
  // 检查选中项
  private checkCustomerOriginAddressOptions: any = []
  // 全选样式控制
  private customerOriginAddressIsIndeterminate: any = true
  // 检查全选是否选中
  private checkAllCustomerOriginAddressOption: any = false
  /**
   * 客户房产资料相关
   */
  // 客户房产资料信息选项（必选）
  private custAssetOptDefaultSelect: any = []
  // 客户房产资料信息选项（可选）
  private customerAssetOptions: any = []
  // 检查选中项
  private checkCustomerAssetOptions: any = []
  // 全选样式控制
  private customerAssetIsIndeterminate: any = true
  // 检查全选是否选中
  private checkAllCustomerAssetOption: any = false
  // 房产数目可选值
  private assetsOpt: any = [{
    value: '1'
  }, {
    value: '2'
  }, {
    value: '3'
  }, {
    value: '4'
  }, {
    value: '5'
  }]
  private assetNum: any = ''
  /**
   * 客户车产资料相关
   */
  // 客户车产资料选项（必选）
  private carOptDefaultSelect: any = ['客户姓名', '身份证号']
  // 客户车产资料选项（可选）
  private carOptions: any = []
  // 检查选中项
  private checkCarOptions: any = []
  // 全选样式控制
  private carIsIndeterminate: any = true
  // 检查全选是否选中
  private checkAllCarOption: any = false
  created() {
    this.importModel = {
      // 客户基本信息
      custInfo: [],
      // 客户原始地址信息
      custOriginAddressInfo: [],
      // 客户联系人信息
      custRelationInfo: [],
      // 客户联系人数量
      custRelationNum: [],
      // 客户房产资料
      custAssetInfo: [],
      // 客户房产数量
      custAssetNum: [],
      // 客户车产资料
      custCarInfo: [],
      // 客户职业资料
      custJobInfo: [],
      // 客户收支状况
      custBalanceInfo: [],
      // 订单详情
      orderInfo: [],
      // 客户开户信息
      accountInfo: []
    }
    this.relationOpt = [{
      value: '1'
    }, {
      value: '2'
    }, {
      value: '3'
    }, {
      value: '4'
    }, {
      value: '5'
    }, {
      value: '6'
    }, {
      value: '7'
    }, {
      value: '8'
    }, {
      value: '9'
    }, {
      value: '10'
    }, {
      value: '11'
    }, {
      value: '12'
    }, {
      value: '13'
    }, {
      value: '14'
    }, {
      value: '15'
    }]
  }
  get dataArr() {
    this.importModel.custInfo = this.custOptDefaultSelect.concat(this.checkCustomerOptions)
    // this.importModel.custOriginAddressInfo = this.custOriAddrOptDefaultSelect.concat(this.checkCustomerOriginAddressOptions)
    // this.importModel.custAssetInfo = this.custAssetOptDefaultSelect.concat(this.checkCustomerAssetOptions)
    // this.importModel.custCarInfo = this.carOptDefaultSelect.concat(this.checkCarOptions)
    this.importModel.custJobInfo = this.jobOptDefaultSelect.concat(this.checkJobOptions)
    // this.importModel.custBalanceInfo = this.balanceOptDefaultSelect.concat(this.checkBalanceOptions)
    this.importModel.orderInfo = this.orderOptDefaultSelect.concat(this.checkOrderOptions)
    this.importModel.accountInfo = this.accountOptDefaultSelect.concat(this.checkAccountOptions)
    this.importModel.custRelationInfo = this.relationOptDefaultSelect.concat(this.checkRelationOptions)
    return this.importModel
  }
  // 客户基本信息相关
  /**
   * 每项选择改变事件（客户基本资料操作）
   */
  customerOptionsChange(value) {
    let checkedCount = value.length
    this.checkAllCustomerOption = checkedCount === this.customerOptions.length
    this.customerIsIndeterminate = checkedCount > 0 && checkedCount < this.customerOptions.length
  }
  /**
   * 全选框改变事件（客户基本资料操作）
   */
  customerOptionAllChange(event) {
    this.checkCustomerOptions = event ? this.customerOptions : []
    this.customerIsIndeterminate = false
  }
  // 客户职业资料相关
  /**
   * 全选框改变事件（客户职业资料操作）
   */
  jobOptionAllChange(event) {
    this.checkJobOptions = event ? this.jobOptions : []
    this.jobIsIndeterminate = false
  }
  /**
   * 每项选择改变事件（客户职业资料操作）
   */
  jobOptionsChange(value) {
    let checkedCount = value.length
    this.checkAllJobOption = checkedCount === this.jobOptions.length
    this.jobIsIndeterminate = checkedCount > 0 && checkedCount < this.jobOptions.length
  }
  // 客户联系人信息相关
  /**
   * 全选框改变事件（客户联系人信息操作）
   */
  relationOptionAllChange(event) {
    this.checkRelationOptions = event ? this.relationOptions : []
    this.relationIsIndeterminate = false
  }
  /**
   * 选择客户联系人数目
   */
  relationOptChange(value) {
    let arr: any = []
    if (value !== '') {
      arr.push(value)
    }
    this.importModel.custRelationNum = arr
  }
  /**
   * 每项选择改变事件（客户联系人信息操作）
   */
  relationOptionsChange(value) {
    let checkedCount = value.length
    this.checkAllRelationOption = checkedCount === this.relationOptions.length
    this.relationIsIndeterminate = checkedCount > 0 && checkedCount < this.relationOptions.length
  }
  // 订单基本信息相关
  /**
   * 全选框改变事件（订单基本信息操作）
   */
  orderOptionAllChange(event) {
    this.checkOrderOptions = event ? this.orderOptions : []
    this.orderIsIndeterminate = false
  }
  /**
   * 每项选择改变事件（订单基本信息操作）
   */
  orderOptionsChange(value) {
    let checkedCount = value.length
    this.checkAllOrderOption = checkedCount === this.orderOptions.length
    this.orderIsIndeterminate = checkedCount > 0 && checkedCount < this.orderOptions.length
  }
  // 客户开户信息相关
  /**
   * 全选框改变事件（客户开户信息操作）
   */
  accountOptionAllChange(event) {
    this.checkAccountOptions = event ? this.accountOptions : []
    this.accountIsIndeterminate = false
  }
  /**
   * 每项选择改变事件（客户开户信息操作）
   */
  accountOptionsChange(value) {
    let checkedCount = value.length
    this.checkAllAccountOption = checkedCount === this.accountOptions.length
    this.accountIsIndeterminate = checkedCount > 0 && checkedCount < this.accountOptions.length
  }
  // 客户原始地址信息相关
  /**
   * 全选框改变事件（客户原始地址信息操作）
   */
  customerOriginAddressOptionAllChange(event) {
    this.checkCustomerOriginAddressOptions = event ? this.customerOriginAddressOptions : []
    this.customerOriginAddressIsIndeterminate = false
  }
  /**
   * 每项选择改变事件（客户原始地址信息操作）
   */
  customerOriginAddressOptionsChange(value) {
    let checkedCount = value.length
    this.checkAllCustomerOriginAddressOption = checkedCount === this.customerOriginAddressOptions.length
    this.customerOriginAddressIsIndeterminate = checkedCount > 0 && checkedCount < this.customerOriginAddressOptions
      .length
  }
  // 客户房产资料相关
  /**
   * 全选框改变事件（客户房产资料操作）
   */
  customerAssetOptionAllChange(event) {
    this.checkCustomerAssetOptions = event ? this.customerAssetOptions : []
    this.customerAssetIsIndeterminate = false
  }
  /**
   * 每项选择改变事件（客户房产资料操作）
   */
  customerAssetOptionsChange(value) {
    let checkedCount = value.length
    this.checkAllCustomerAssetOption = checkedCount === this.customerAssetOptions.length
    this.customerAssetIsIndeterminate = checkedCount > 0 && checkedCount < this.customerAssetOptions.length
  }
  /**
   * 选择房产数目
   */
  assetOptChange(value) {
    let arr: any = []
    if (value !== '') {
      arr.push(value)
    }
    this.importModel.custAssetNum = arr
  }
  //客户车产资料相关
  /**
   * 全选框改变事件（客户车产资料操作）
   */
  carOptionAllChange(event) {
    this.checkCarOptions = event ? this.carOptions : []
    this.carIsIndeterminate = false
  }
  /**
   * 每项选择改变事件（客户车产资料操作）
   */
  carOptionsChange(value) {
    let checkedCount = value.length
    this.checkAllCarOption = checkedCount === this.carOptions.length
    this.carIsIndeterminate = checkedCount > 0 && checkedCount < this.carOptions.length
  }
  /**
   * 点击保存并下载事件
   */
  saveClick() {
    let custInfole = this.dataArr.custInfo.length
    let custOriginAddressInfole = this.dataArr.custOriginAddressInfo.length
    let custRelationInfole = this.dataArr.custRelationInfo.length
    let custAssetInfole = this.dataArr.custAssetInfo.length
    let custCarInfole = this.dataArr.custCarInfo.length
    let custJobInfole = this.dataArr.custJobInfo.length
    let custBalanceInfole = this.dataArr.custBalanceInfo.length
    let orderInfole = this.dataArr.orderInfo.length
    let accountInfole = this.dataArr.accountInfo.length
    if ((custInfole + custOriginAddressInfole + custRelationInfole + custAssetInfole +
      custCarInfole + custJobInfole + custBalanceInfole + orderInfole + accountInfole) === 0) {
      this.$alert('配置项不能为空', '提示', {
        confirmButtonText: '确定'
      })
      return
    } else if (!(custRelationInfole !== 0 && this.dataArr.custRelationNum.length !== 0) &&
      !(custRelationInfole === 0 && this.dataArr.custRelationNum.length === 0)) {
      this.$alert('请选择要配置的客户联系人项或联系人数目', '提示', {
        confirmButtonText: '确定'
      })
      return
    } else if (!(custAssetInfole !== 0 && this.dataArr.custAssetNum.length !== 0) &&
      !(custAssetInfole === 0 && this.dataArr.custAssetNum.length === 0)) {
      this.$alert('请选择要配置的客户房产项或房产数目', '提示', {
        confirmButtonText: '确定'
      })
      return
    }
    this.accImportExcelDataService.createExcelTemplate(this.dataArr).subscribe(data => {
      // data为服务端返回的url
      if (data) {
        CommonService.downloadFile(data, '导入模板')
      } else {
        this.$message({
          type: 'info',
          message: '暂无数据'
        })
      }
    }, ({
        msg
      }) => {
        this.$message({
          type: 'error',
          message: msg
        })
      });
  }
}

</script>
<style lang="less">
.page.import-template{
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
  margin: 3px 0px 3px 5px;
}

.model-col {
  margin-left: 20px;
}

.iconColor {
  color: #01bccb;
  font-size: 18px;
}
.el-checkbox+.el-checkbox{
  
}
}
</style>
