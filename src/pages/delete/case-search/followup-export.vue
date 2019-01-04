<template>
  <section class="page followup-export">
    <!--数据筛选 -START-->
    <template>
      <div class="model">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 数据筛选</span>
        </el-col>
        <el-form :inline="true" ref="form" :model="params" style="margin-left:20px">
          <el-form-item label="跟进时间" prop="followTime" v-auth="1362">
            <el-date-picker v-model="params.followTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="产品系列" prop="seriesId" v-auth="1363">
            <el-select v-model="params.seriesId" placeholder="请选择" clearable>
              <el-option v-for="{ id, seriesName } in dataType" :key="id" :label="seriesName" :value="seriesName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态" prop="orderStatus" v-auth="1364">
            <el-select v-model="params.orderStatus" placeholder="请选择" clearable>
              <el-option :value="0" label="未结案"></el-option>
              <el-option :value="1" label="已结案"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <!--数据筛选 -END-->
    <!--机构筛选START-->
    <template>
      <div class="model" v-if="allData.basicOptions">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 机构筛选</span>
        </el-col>
          <el-form :inline="true" ref="org-form" :model="params">
            <el-form-item label="机构" prop="name" v-auth="1365">
              <el-input v-model="params.name" readonly placeholder="请选择"></el-input>
            </el-form-item>
            <el-form-item label="当前催收员" prop="realName" v-auth="1366">
              <el-input v-model="params.realName" readonly placeholder="请选择"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialog.choose=true" type="text" style="padding: 0">选择机构或催收员</el-button>
              <el-button @click="params.name = '',params.deptId = '',params.collector = '',params.realName = ''" type="text" style="padding: 0">清空</el-button>
            </el-form-item>
          </el-form>
      </div>
    </template>
    <!--机构筛选END-->

    <!--基本信息START-->
    <template>
      <div class="model" v-if="allData.basicOptions">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 客户基本信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="basicAllOption" @change="basicOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <!--默认必选项-->
            <!--可选项-->
            <!--<el-checkbox class="select-option" :checked='true' disabled v-for="basic in this.basicDefaultSelect" :key="basic">{{basic}}</el-checkbox>-->
            <el-checkbox-group v-model="checkBasicOptions" @change="basicOptionChange">
              <el-checkbox class="select-option" v-for="basic in this.allData.basicOptions" :label="basic" :key="basic">{{basic}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--基本信息END-->

    <!--案件基本信息 -START-->
    <template>
      <div class="model" v-if="allData.caseInfoOptions">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 案件基本信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="caseInfoAllOption" @change="caseInfoOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <!--默认必选项-->
            <!--可选项-->
            <!--<el-checkbox class="select-option" :checked='true' disabled v-for="caseInfo in this.caseInfoDefaultSelect" :key="caseInfo">{{caseInfo}}</el-checkbox>-->
            <el-checkbox-group v-model="checkcaseInfoAllOptions" @change="caseInfoOptionChange">
              <el-checkbox class="select-option" v-for="caseInfo in this.allData.caseInfoOptions" :label="caseInfo" :key="caseInfo">{{caseInfo}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--案件基本信息 -END-->

    <!--开户信息 -START-->
    <template>
      <div class="model" v-if="allData.openAccountOptions">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 开户信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="openAccountAllOption" @change="openAccountOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <!--默认必选项-->
            <!--可选项-->
            <!--<el-checkbox class="select-option" :checked='true' disabled v-for="open in this.openAccountDefaultSelect" :key="open">{{open}}</el-checkbox>-->
            <el-checkbox-group v-model="checkopenAccountAllOptions" @change="openAccountOptionChange">
              <el-checkbox class="select-option" v-for="open in this.allData.openAccountOptions" :label="open" :key="open">{{open}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--开户信息 -END-->

    <!--跟进记录 -START-->
    <template>
      <div class="model" v-if="allData.followAccountOptions">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 跟进记录</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="followAccountAllOption" @change="followAccountOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <!--默认必选项-->
            <!--可选项-->
            <!--<el-checkbox class="select-option" :checked='true' disabled v-for="follow in this.followAccountDefaultSelect" :key="follow">{{follow}}</el-checkbox>-->
            <el-checkbox-group v-model="checkfollowAccountAllOptions" @change="followAccountOptionChange">
              <el-checkbox class="select-option" v-for="follow in this.allData.followAccountOptions" :label="follow" :key="follow">{{follow}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--跟进记录 -END-->


    <!--按钮区START-->
    <div style="text-align: center;margin-bottom:10px">
      <el-button @click="saveClick" v-auth="1367">导出</el-button>
    </div>
    <!--按钮区END-->
    <!--选择机构和催收员-->
    <el-dialog title="选择机构或催收员" :center="true" :visible.sync="dialog.choose" width="80%" @open="$nextTick(()=>$refs['choose-org'].refresh())">
      <choose-org ref="choose-org" @close="dialog.choose = false" @success="chooseSuccess"></choose-org>
    </el-dialog>
  </section>
</template>

<script lang="ts">

  import Vue from "vue";
  import Component from "vue-class-component";
  import {Auth, Layout,Dependencies } from "~/core/decorator";
  import { CommonService } from "~/utils/common.service";
  import { CaseInfoService} from "~/services/business-service/case-info.service";
  import { ProductSeriesService} from "~/services/business-service/product-series.service";
  import { PersonalService} from "~/services/business-service/personal.service";
  import { UserService} from "~/services/business-service/user.service";
  import { State, Action, Getter } from "vuex-class";
  import clone from 'clone'
  import { ExportFollowupService } from "~/services/report-service/export-followup.service";
  import { FilterService } from '~/utils/filter.service'
  import ChooseOrg from "~/components/case-search/choose-org.vue";

  @Auth(1124)
  @Layout('workspace')
  @Component({
    components:{
      ChooseOrg
    }
  })
  export default class FollowupExport extends Vue {
    @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
    @Dependencies(ProductSeriesService) private productSeriesService: ProductSeriesService;
    @Dependencies(ExportFollowupService) private exportFollowupService: ExportFollowupService;
    @Dependencies(UserService) private userService: UserService;
    @Dependencies(PersonalService) private personalService: PersonalService;
    @Getter departmentData;
    @State departmentList: any;


    private allData: any = {
      basicOptions: ['客户姓名', '身份证号', '手机号码'],
      workOptions: ['工作单位名称', '工作单位地址', '工作单位电话'],
      contactOptions: ['姓名', '手机号码', '住宅电话', '现居住地址', '与客户关系', '工作单位', '单位电话'],
      caseInfoOptions: ['产品系列', '合同编号', '贷款日期', '合同金额', '剩余本金(元)', '剩余利息(元)', '逾期总金额(元)', '逾期本金(元)', '逾期利息(元)', '逾期罚息(元)', '还款期数', '每期还款金额(元)', '其他费用(元)', '逾期日期', '逾期天数', '已还款金额(元)', '已还款期数', '最近还款日期', '最近还款金额(元)', '佣金比例(%)'],
      openAccountOptions: ['客户还款卡银行', '客户还款卡号'],
      followAccountOptions: ['跟进时间', '跟进方式', '催收对象', '姓名', '电话/地址', '催收反馈', '跟进记录', '跟进人员']
    }
    private dialog: any = {
      choose: false
    };
    private dataType: any = []
    private options: any = []
    private exportVeidoo: any = 0
    private assetNum: any = ''
    private orgNameList: any = []
    private orgCuponameList: any = []
    private batchDatas: any = []
    // 发送给服务器的对象
    private params: any = {
      name: '', // 机构
      realName: '', // 催收员
      followTime: [],
      deptCodes: [],
      collector: '',
      seriesId: '',
      orderStatus: '',
      deptId: "" // 机构
    }
    private paramsdata: any = {
      orgData: [], // 数据信息
      customerInfo: [],
      customerRelation: [],
      bankItems: [], // 开户信息
      caseItems: [], // 案件基本信息
      connectItems: [], // 联系人信息
      followItems: [], // 跟进记录
      jobItems: [], // 工作信息
      personalItems: [] // 客户基本信息
    }

    private checkBasicOptions: any = [];
    private checkWorkOptions: any = [];
    private checkcontactAllOptions: any = [];
    private checkcaseInfoAllOptions: any = [];
    private checkopenAccountAllOptions: any = [];
    private checkfollowAccountAllOptions: any = [];

    // 全选样式控制
    private basicIsIndeterminate: any = false;
    private customerIsIndeterminate: any = false;
    private workIsIndeterminate: any = false;
    private contactIsIndeterminate: any = false;
    private caseInfoIsIndeterminate: any = false;
    private openAccountIsIndeterminate: any = false;
    private followAccountIsIndeterminate: any = false;

    get basicAllOption() {
      return this.checkBasicOptions.length === 3
    }
    set basicAllOption(v) {
      // this.basicAllOption = v
    }

    get workAllOption() {
      return this.checkWorkOptions.length === 3
    }
    set workAllOption(v) {
      // this.workAllOption = v
    }

    get contactAllOption() {
      return this.checkcontactAllOptions.length === 7
    }
    set contactAllOption(v) {
      // this.contactAllOption = v
    }

    get caseInfoAllOption() {
      return this.checkcaseInfoAllOptions.length === 20
    }
    set caseInfoAllOption(v) {
      // this.contactAllOption = v
    }

    get openAccountAllOption() {
      return this.checkopenAccountAllOptions.length === 2
    }
    set openAccountAllOption(v) {
      // this.contactAllOption = v
    }

    get followAccountAllOption() {
      return this.checkfollowAccountAllOptions.length === 8
    }
    set followAccountAllOption(v) {
      // this.contactAllOption = v
    }

    get dataArr() {
      this.paramsdata.jobItems = this.checkWorkOptions
      this.paramsdata.personalItems = this.checkBasicOptions
      this.paramsdata.bankItems = this.checkopenAccountAllOptions
      this.paramsdata.connectItems = this.checkcontactAllOptions
      this.paramsdata.followItems = this.checkfollowAccountAllOptions
      this.paramsdata.caseItems = this.checkcaseInfoAllOptions
      return this.paramsdata
    }
    mounted() {
      // this.queryAllDepartment()
      /**
       * 获取所有批次号
       */
      this.caseInfoService
        .getAllBatchNumber().subscribe( data => {
        this.batchDatas = data
      },({ msg}) => {
        this.$message.error(msg);
      })
      /**
       * 获取产品类型
       */
      this.productSeriesService
        .getAllProductSeries().subscribe( data => {
        this.dataType = data
      },({ msg}) => {
        this.$message.error(msg);
      })
    }
    /**
     * 选择机构成功
     */
    chooseSuccess(node, row, type) {
      this.dialog.choose = false
      this.params.name = node.name
      this.params.deptId = node.id
      this.params.collector = ''
      this.params.realName = ''
      if(type) {
        this.params.collector = row.id
        this.params.realName = row.realName
      }
    }
    /**
     * 重置Radio
     */
    resetRadio() {
      let form: any = this.$refs.form;
      form.resetFields();
      this.params.name = ''
      this.params.deptId = ''
      this.params.collector = ''
      this.params.realName = ''
      this.checkBasicOptions = [];
      this.checkWorkOptions = [];
      this.checkcontactAllOptions = [];
      this.checkcaseInfoAllOptions = [];
      this.checkopenAccountAllOptions = [];
      this.checkfollowAccountAllOptions = [];
    }
    /**
     * 全选(客户基本信息)
     */
    basicOptionAllChange(event) {
      this.checkBasicOptions = event ? this.allData.basicOptions : []
      this.basicIsIndeterminate = false
    }
    /**
     * 每项选择改变事件(客户基本信息)
     */
    basicOptionChange(value) {
      let basicChecked = value.length
      this.basicAllOption = basicChecked === this.allData.basicOptions.length
      this.basicIsIndeterminate = basicChecked > 0 && basicChecked < this.allData.basicOptions.length
    }

    /**
     * 全选(工作信息)
     */
    workOptionAllChange(event) {
      this.checkWorkOptions = event ? this.allData.workOptions : []
      this.workIsIndeterminate = false
    }
    /**
     * 每项选择改变事件(工作信息)
     */
    workOptionChange(value) {
      let workChecked = value.length
      this.workAllOption = workChecked === this.allData.workOptions.length
      this.workIsIndeterminate = workChecked > 0 && workChecked < this.allData.workOptions.length
    }

    /**
     * 全选(联系人信息)
     */
    contactOptionAllChange(event) {
      this.checkcontactAllOptions = event ? this.allData.contactOptions : []
      this.contactIsIndeterminate = false
    }
    /**
     * 每项选择改变事件(案件基本信息)
     */
    contactOptionChange(value) {
      let contactChecked = value.length
      this.contactAllOption = contactChecked === this.allData.contactOptions.length
      this.contactIsIndeterminate = contactChecked > 0 && contactChecked < this.allData.contactOptions.length
    }

    /**
     * 全选(案件基本信息)
     */
    caseInfoOptionAllChange(event) {
      this.checkcaseInfoAllOptions = event ? this.allData.caseInfoOptions : []
      this.caseInfoIsIndeterminate = false
    }
    /**
     * 每项选择改变事件(案件基本信息)
     */
    caseInfoOptionChange(value) {
      let caseInfoChecked = value.length
      this.caseInfoAllOption = caseInfoChecked === this.allData.caseInfoOptions.length
      this.caseInfoIsIndeterminate = caseInfoChecked > 0 && caseInfoChecked < this.allData.caseInfoOptions.length
    }

    /**
     * 全选(开户信息)
     */
    openAccountOptionAllChange(event) {
      this.checkopenAccountAllOptions = event ? this.allData.openAccountOptions : []
      this.openAccountIsIndeterminate = false
    }
    /**
     * 每项选择改变事件(开户信息)
     */
    openAccountOptionChange(value) {
      let openAccountChecked = value.length
      this.openAccountAllOption = openAccountChecked === this.allData.openAccountOptions.length
      this.openAccountIsIndeterminate = openAccountChecked > 0 && openAccountChecked < this.allData.openAccountOptions
        .length
    }

    /**
     * 全选(跟进记录)
     */
    followAccountOptionAllChange(event) {
      this.checkfollowAccountAllOptions = event ? this.allData.followAccountOptions : []
      this.followAccountIsIndeterminate = false
    }
    /**
     * 每项选择改变事件(跟进记录)
     */
    followAccountOptionChange(value) {
      let followAccountChecked = value.length
      this.followAccountAllOption = followAccountChecked === this.allData.followAccountOptions.length
      this.followAccountIsIndeterminate = followAccountChecked > 0 && followAccountChecked < this.allData.followAccountOptions
        .length
    }
    deactivated () {
      for(let v in this.dialog) {
        this.dialog[v] = false
      }
    }
    /**
     * 导出
     */
    saveClick() {
      this.exportFollowupService
        .exportFollowup({
          deptId: this.params.deptId,
          collector: this.params.collector,
          seriesId: this.params.seriesId,
          minFollTime: FilterService.dateRanageFormat(this.params.followTime).start,
          maxFollTime: FilterService.dateRanageFormat(this.params.followTime).end,
          orderStatus: this.params.orderStatus,
          dataInfo: this.dataArr
        })
        .subscribe( data => {
          this.$message.info('操作成功，请关注任务中心！');
          this.resetRadio()
        },({ msg }) => {
          this.$message.error(msg);
        })
    }
  }
</script>

<style lang="less" scoped>
  .followup-export{
    padding:0 10px 10px 10px;
    .model {
      text-align: left;
      margin-bottom: 20px;
    }

    .select {
      border: 1px solid #EFF2F7;
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
      margin: 3px 0px 3px 5px!important;
    }

    .model-col {
      margin-left: 20px;
    }

    .iconColor {
      color: #01bccb;
      font-size: 18px;
    }
    .page{
      margin-left:10px;
    }
  }
</style>
