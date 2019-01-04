<template>
  <section class="component set-export-items">
    <!--设置纬度 -START-->
    <template>
      <div class="model" v-if="type">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 设置导出项纬度</span>
        </el-col>
        <el-radio-group v-model="exportVeidoo" @change="setRadio">
          <el-radio :label="4">案件导出项</el-radio>
          <el-radio :label="2">案件跟进记录导出项</el-radio>
        </el-radio-group>
      </div>
    </template>
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

    <!--工作信息START-->
    <template>
      <div class="model" v-if="allData.workOptions">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 工作信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="workAllOption" @change="workOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <!--默认必选项-->
            <!--可选项-->
            <!--<el-checkbox class="select-option" :checked='true' disabled v-for="work in this.workDefaultSelect" :key="work">{{work}}</el-checkbox>-->
            <el-checkbox-group v-model="checkWorkOptions" @change="workOptionChange">
              <el-checkbox class="select-option" v-for="work in this.allData.workOptions" :label="work" :key="work">{{work}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--工作信息END-->

    <!--联系人信息 -START-->
    <template>
      <div class="model" v-if="allData.contactOptions">
        <el-col class="model-name">
          <span class="iconfont iconColor"></span>
          <span> 联系人信息</span>
        </el-col>
        <div class="model-col">
          <div class="select-all">
            <el-checkbox v-model="contactAllOption" @change="contactOptionAllChange">全选</el-checkbox>
          </div>
          <div class="select">
            <!--默认必选项-->
            <!--可选项-->
            <!--<el-checkbox class="select-option" :checked='true' disabled v-for="contact in this.contactDefaultSelect" :key="contact">{{contact}}</el-checkbox>-->
            <el-checkbox-group v-model="checkcontactAllOptions" @change="contactOptionChange">
              <el-checkbox class="select-option" v-for="contact in this.allData.contactOptions" :label="contact" :key="contact">{{contact}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </template>
    <!--联系人信息 -END-->

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
      <div class="model" v-if="exportVeidoo===2">
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
import { Layout, Dependencies } from "~/core/decorator";
import { Watch, Prop, Emit } from "vue-property-decorator";

import { ExportItemsService } from "~/services/business-service/export-items.service";
@Component({
  components: {}
})
export default class SetExportItems extends Vue {
  @Dependencies(ExportItemsService)
  private exportItemsService: ExportItemsService;
  // 选中值
  private checkBasicOptions: any = [];
  private checkWorkOptions: any = [];
  private checkcontactAllOptions: any = [];
  private checkcaseInfoAllOptions: any = [];
  private checkopenAccountAllOptions: any = [];
  private checkfollowAccountAllOptions: any = [];
  private submitLoading: Boolean = false;

  // private exportVeidoo: any = '';
  private paramsdata: any = {
    bankItems: [], // 开户信息
    caseItems: [], // 案件基本信息
    connectItems: [], // 联系人信息
    followItems: [], // 跟进记录
    jobItems: [], // 工作信息
    personalItems: [], // 客户基本信息
    category: ""
  };
  // 可选项数据
  @Prop() allData: any;
  @Prop() category: any;
  // 设置导出项参数
  @Prop() type: any; // 是否设置导出项纬度
  @Prop() exportVeidoo: any;

  @Emit("close")
  close() {}

  // 全选样式控制
  private basicIsIndeterminate: any = false;
  private customerIsIndeterminate: any = false;
  private workIsIndeterminate: any = false;
  private contactIsIndeterminate: any = false;
  private caseInfoIsIndeterminate: any = false;
  private openAccountIsIndeterminate: any = false;
  private followAccountIsIndeterminate: any = false;

  get basicAllOption() {
    return this.checkBasicOptions.length === this.allData.basicOptions.length;
  }
  set basicAllOption(v) {
    // this.basicAllOption = v
  }

  get workAllOption() {
    return this.checkWorkOptions.length === this.allData.workOptions.length;
  }
  set workAllOption(v) {
    // this.workAllOption = v
  }

  get contactAllOption() {
    return (
      this.checkcontactAllOptions.length === this.allData.contactOptions.length
    );
  }
  set contactAllOption(v) {
    // this.contactAllOption = v
  }

  get caseInfoAllOption() {
    return (
      this.checkcaseInfoAllOptions.length ===
      this.allData.caseInfoOptions.length
    );
  }
  set caseInfoAllOption(v) {
    // this.contactAllOption = v
  }

  get openAccountAllOption() {
    return (
      this.checkopenAccountAllOptions.length ===
      this.allData.openAccountOptions.length
    );
  }
  set openAccountAllOption(v) {
    // this.contactAllOption = v
  }

  get followAccountAllOption() {
    return (
      this.checkfollowAccountAllOptions.length ===
      this.allData.followAccountOptions.length
    );
  }
  set followAccountAllOption(v) {
    // this.contactAllOption = v
  }

  get dataArr() {
    this.paramsdata.jobItems = this.checkWorkOptions;
    this.paramsdata.personalItems = this.checkBasicOptions;
    this.paramsdata.bankItems = this.checkopenAccountAllOptions;
    this.paramsdata.connectItems = this.checkcontactAllOptions;
    this.paramsdata.followItems = this.checkfollowAccountAllOptions;
    this.paramsdata.caseItems = this.checkcaseInfoAllOptions;
    this.paramsdata.category = this.exportVeidoo;
    return this.paramsdata;
  }
  /**
   * 全选(客户基本信息)
   */
  basicOptionAllChange(event) {
    this.checkBasicOptions = event ? this.allData.basicOptions : [];
    this.basicIsIndeterminate = false;
  }
  /**
   * 每项选择改变事件(客户基本信息)
   */
  basicOptionChange(value) {
    let basicChecked = value.length;
    this.basicAllOption = basicChecked === this.allData.basicOptions.length;
    this.basicIsIndeterminate =
      basicChecked > 0 && basicChecked < this.allData.basicOptions.length;
  }

  /**
   * 全选(工作信息)
   */
  workOptionAllChange(event) {
    this.checkWorkOptions = event ? this.allData.workOptions : [];
    this.workIsIndeterminate = false;
  }
  /**
   * 每项选择改变事件(工作信息)
   */
  workOptionChange(value) {
    let workChecked = value.length;
    this.workAllOption = workChecked === this.allData.workOptions.length;
    this.workIsIndeterminate =
      workChecked > 0 && workChecked < this.allData.workOptions.length;
  }

  /**
   * 全选(联系人信息)
   */
  contactOptionAllChange(event) {
    this.checkcontactAllOptions = event ? this.allData.contactOptions : [];
    this.contactIsIndeterminate = false;
  }
  /**
   * 每项选择改变事件(案件基本信息)
   */
  contactOptionChange(value) {
    let contactChecked = value.length;
    this.contactAllOption =
      contactChecked === this.allData.contactOptions.length;
    this.contactIsIndeterminate =
      contactChecked > 0 && contactChecked < this.allData.contactOptions.length;
  }

  /**
   * 全选(案件基本信息)
   */
  caseInfoOptionAllChange(event) {
    this.checkcaseInfoAllOptions = event ? this.allData.caseInfoOptions : [];
    this.caseInfoIsIndeterminate = false;
  }
  /**
   * 每项选择改变事件(案件基本信息)
   */
  caseInfoOptionChange(value) {
    let caseInfoChecked = value.length;
    this.caseInfoAllOption =
      caseInfoChecked === this.allData.caseInfoOptions.length;
    this.caseInfoIsIndeterminate =
      caseInfoChecked > 0 &&
      caseInfoChecked < this.allData.caseInfoOptions.length;
  }

  /**
   * 全选(开户信息)
   */
  openAccountOptionAllChange(event) {
    this.checkopenAccountAllOptions = event
      ? this.allData.openAccountOptions
      : [];
    this.openAccountIsIndeterminate = false;
  }
  /**
   * 每项选择改变事件(开户信息)
   */
  openAccountOptionChange(value) {
    let openAccountChecked = value.length;
    this.openAccountAllOption =
      openAccountChecked === this.allData.openAccountOptions.length;
    this.openAccountIsIndeterminate =
      openAccountChecked > 0 &&
      openAccountChecked < this.allData.openAccountOptions.length;
  }

  /**
   * 全选(跟进记录)
   */
  followAccountOptionAllChange(event) {
    this.checkfollowAccountAllOptions = event
      ? this.allData.followAccountOptions
      : [];
    this.followAccountIsIndeterminate = false;
  }
  /**
   * 每项选择改变事件(跟进记录)
   */
  followAccountOptionChange(value) {
    let followAccountChecked = value.length;
    this.followAccountAllOption =
      followAccountChecked === this.allData.followAccountOptions.length;
    this.followAccountIsIndeterminate =
      followAccountChecked > 0 &&
      followAccountChecked < this.allData.followAccountOptions.length;
  }
  /**
   * 确定
   */
  saveClick() {
    this.submitLoading = true;
    this.exportItemsService.saveOutsourceExportItems(this.dataArr).subscribe(
      data => {
        this.submitLoading = false;
        this.$message.success("设置成功!");
        this.close();
      },
      ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      }
    );
  }
  /**
   * 取消
   */
  cancelClick() {
    this.close();
  }
  /**
   * 查询导出项
   */
  checkExportItems() {
    this.exportItemsService
      .getOutsourceExportItems(this.exportVeidoo)
      .subscribe(
        data => {
          this.checkBasicOptions = data.personalItems; // 客户基本信息
          this.checkcontactAllOptions = data.connectItems; // 联系人信息
          this.checkWorkOptions = data.jobItems; // 工作信息
          this.checkcaseInfoAllOptions = data.caseItems; // 案件基本信息
          this.checkopenAccountAllOptions = data.bankItems; // 开户信息
          this.checkfollowAccountAllOptions = data.followItems; // 跟进记录
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 设置导出项纬度
   */
  setRadio() {
    this.checkExportItems();
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
