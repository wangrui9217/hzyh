<template>
  <section class="component cust-info">
    <el-col class="frame">
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kaihuxinxi"></svg-icon>
        <span>开户信息</span>
      </div>
      <data-grid :labelWidth="110" labelAlign="right"  contentAlign="left">
        <data-grid-item label="账户类型：" :span="3">{{params.accountType}}</data-grid-item>
        <data-grid-item label="开户省份：" :span="3">{{params.province}}</data-grid-item>
        <data-grid-item label="开户城市：" :span="3">{{params.city}}</data-grid-item>
        <data-grid-item label="开户银行：" :span="3">{{params.depositBank}}</data-grid-item>
        <data-grid-item label="开户支行：" :span="6">{{params.depositBankBra}}</data-grid-item>
        <data-grid-item label="银行卡号：" :span="6">{{params.cardNumber}}</data-grid-item>
      </data-grid>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="kehujibenxinxi"></svg-icon>
        <span>客户基本信息</span>
      </div>
      <data-grid :totalSpan="10" :labelWidth="110" labelAlign="right" contentAlign="left">
        <data-grid-item label="姓名：" :span="2">{{params.personalName}}</data-grid-item>
        <data-grid-item label="性别：" :span="2">{{params.sex}}</data-grid-item>
        <data-grid-item label="手机号：" :span="2">{{params.mobileNo}}</data-grid-item>
        <data-grid-item label="微信号：" :span="2">{{params.wechat}}</data-grid-item>
        <data-grid-item label="qq：" :span="2">{{params.qq}}</data-grid-item>
        <data-grid-item label="婚姻状况：" :span="2">{{params.marital}}</data-grid-item>
        <data-grid-item label="教育程度：" :span="2">{{params.education | dictConvert}}</data-grid-item>
        <data-grid-item label="毕业学校：" :span="4">{{params.school}}</data-grid-item>
        <data-grid-item label="电子邮箱：" :span="2">{{params.email}}</data-grid-item>
        <data-grid-item label="客户号：" :span="2">{{params.personalNumber}}</data-grid-item>
        <data-grid-item label="账户号：" :span="2">{{params.accountNumber}}</data-grid-item>
        <data-grid-item label="身份证号：" :span="4">{{params.idCard}}</data-grid-item>
        <data-grid-item label="证件有效期：" :span="2">{{params.idCardValidityPeriod}}</data-grid-item>
        <data-grid-item label="发证机关：" :span="4">{{params.idCardIssuingAuthority}}</data-grid-item>
        <data-grid-item label="身份证地址：" :span="6">{{params.idCardAddress}}</data-grid-item>
        <data-grid-item label="现居住地址：" :span="10">{{params.homeAddress}}</data-grid-item>
        <data-grid-item label="居住地家庭座机：" :span="2">{{params.homePhone}}</data-grid-item>
        <data-grid-item label="本市生活时长：" :span="2">{{params.liveTime}}</data-grid-item>
        <data-grid-item label="现居住生活时长：" :span="2">{{params.localLiveTime}}</data-grid-item>
        <data-grid-item label="居住地电费账号：" :span="2">{{params.electricityName}}</data-grid-item>
        <data-grid-item label="居住地电费密码：" :span="2">{{params.electricityPsw}}</data-grid-item>
        <template>
          <data-grid-item label="本市房产状况：" :span="2"></data-grid-item>
          <data-grid-item label="房产归属：" :span="2"></data-grid-item>
          <data-grid-item label="房产性质：" :span="2"></data-grid-item>
          <data-grid-item label="已购年限：" :span="2"></data-grid-item>
          <data-grid-item label="房贷余额(元)：" :span="2"></data-grid-item>
          <data-grid-item label="房产地址：" :span="10"></data-grid-item>
          <data-grid-item label="中介姓名：" :span="2"></data-grid-item>
          <data-grid-item label="中介手机号：" :span="2"></data-grid-item>
          <data-grid-item label="征信账号：" :span="2"></data-grid-item>
          <data-grid-item label="征信密码：" :span="2"></data-grid-item>
          <data-grid-item label="征信验证码：" :span="2"></data-grid-item>
        </template>
      </data-grid>
      <el-col class="text-left data-grid-title" style="float:none">
        <svg-icon iconName="chechanxinxi"></svg-icon>
        <span>车产信息</span>
      </el-col>
      <data-grid :totalSpan="10 "  :labelWidth="110 " labelAlign="right" contentAlign="left">
        <data-grid-item label="本人名下车产： " :span="2 "></data-grid-item>
        <data-grid-item label="车牌号： " :span="2 "></data-grid-item>
        <data-grid-item label="购车价格(万元)： " :span="2 "></data-grid-item>
        <data-grid-item label="车辆类型： " :span="2 "></data-grid-item>
        <data-grid-item label="二手车(是/否)： " :span="2 "></data-grid-item>
        <data-grid-item label="初次登记时间： " :span="2 "></data-grid-item>
        <data-grid-item label="抵押登记次数： " :span="2 "></data-grid-item>
        <data-grid-item label="车身颜色： " :span="4 "></data-grid-item>
        <data-grid-item label="保险单： " :span="2 "></data-grid-item>
        <data-grid-item label="购买方式： " :span="2 "></data-grid-item>
        <data-grid-item label="车辆贷款方式： " :span="8 "></data-grid-item>
      </data-grid>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="danweixinxi"></svg-icon>
        <span>单位信息</span>
      </div>
      <data-grid  :labelWidth="110" labelAlign="right" contentAlign="left">
        <data-grid-item label="单位名称： " :span="3 ">{{params.companyName}}</data-grid-item>
        <data-grid-item label="部门： " :span="3 ">{{params.department}}</data-grid-item>
        <data-grid-item label="职务： " :span="3 ">{{params.position}}</data-grid-item>
        <data-grid-item label="职级： " :span="3 ">{{params.rank}}</data-grid-item>
        <data-grid-item label="单位性质： " :span="3 ">{{params.nature}}</data-grid-item>
        <data-grid-item label="单位规模： " :span="3 ">{{params.scale}}</data-grid-item>
        <data-grid-item label="何时进入公司： " :span="3 ">{{params.joinTime}}</data-grid-item>
        <data-grid-item label="现单位工作年限： " :span="3 ">{{params.workYear}}</data-grid-item>
        <data-grid-item label="单位固定电话： " :span="3 ">{{params.companyPhone}}</data-grid-item>
        <data-grid-item label="单位地址： " :span="9 ">{{params.companyAddr}}</data-grid-item>
        <data-grid-item label="所属行业： " :span="3 ">{{params.industry}}</data-grid-item>
        <data-grid-item label="单位成立时间： " :span="3 ">{{params.companyCreateTime}}</data-grid-item>
        <data-grid-item label="基本月薪(元)： " :span="3 ">{{params.monthSalary}}</data-grid-item>
        <data-grid-item label="每月发薪日： " :span="3 ">{{params.payDay}}</data-grid-item>
      </data-grid>
      <div type="flex" align="left" class="data-grid-title">
        <svg-icon iconName="shouzhizhuangkuang"></svg-icon>
        <span>收支状况</span>
      </div>
      <data-grid  :labelWidth="110 " labelAlign="right" contentAlign="left">
        <data-grid-item label="年收入(万元)： " :span="3 ">{{params.annualIncome}}</data-grid-item>
        <data-grid-item label="每月工作收入(元)： " :span="3 ">{{params.monthIncome}}</data-grid-item>
        <data-grid-item label="每月其他收入(元)： " :span="3 ">{{params.monthOtherIncome}}</data-grid-item>
        <data-grid-item label="月均支出(元)： " :span="3 ">{{params.monthExpenditure}}</data-grid-item>
        <data-grid-item label="社保账号： " :span="3 ">{{params.socialSecurityAccount}}</data-grid-item>
        <data-grid-item label="社保密码： " :span="3 ">{{params.socialSecurityPassword}}</data-grid-item>
        <data-grid-item label="公积金账号： " :span="3 ">{{params.providentAccount}}</data-grid-item>
        <data-grid-item label="公积金密码： " :span="3 ">{{params.providentPassword}}</data-grid-item>
        <data-grid-item label="供养人数： " :span="3 ">{{params.dependentsNumber}}</data-grid-item>
        <data-grid-item label="收入来源说明： " :span="9 ">{{params.incomeDescription}}</data-grid-item>
      </data-grid>
      <el-col class="text-left data-grid-title" style="float:none">
        <svg-icon iconName="lianxirenxinxi"></svg-icon>
        <span>联系人信息</span>
      </el-col>
      <data-box :data="contacts">
        <template slot="columns">
          <el-table-column prop="relation" label="关系 " :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope ">
              <span>{{scope.row.relation | dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名 " :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="mobile" label="住宅电话" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="workPhone" label="单位电话" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="employer" label="工作单位" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          </el-table-column>
          </template>
      </data-box>
    </el-col>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import { Dependencies } from "~/core/decorator";
import SvgIcon from "~/components/common/svg-icon.vue";
import DataBox from "~/components/common/data-box.vue";
import { Watch, Prop } from "vue-property-decorator";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { DataInfoExcelService } from "../../../services/dataimp-service/data-info-excel.service";

@Component({
  components: {
    SvgIcon,
    DataGrid,
    DataGridItem,
    DataBox
  }
})
export default class CustInfo extends Vue {
  @Dependencies(CaseInfoDistributeService)
  private caseInfoDistributeService: CaseInfoDistributeService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(DataInfoExcelService)
  private dataInfoExcelService: DataInfoExcelService;

  private params: any = {};
  private contacts: any = [];

  refresh(data) {
    this.params = data;
    this.contacts = [];
    this.contacts.push({
      name: data.personalName,
      relation: "本人",
      idCard: data.idCard,
      phone: data.mobileNo,
      work: data.companyName,
      homephone: data.homePhone,
      workphone: data.companyPhone
    });
    for (let i = 1; i < 20; i++) {
      if (
        data["contactUnitPhone" + i] ||
        data["contactHomePhone" + i] ||
        data["contactName" + i] ||
        data["contactPhone" + i] ||
        data["contactCurrAddress" + i] ||
        data["contactRelation" + i] ||
        data["contactWorkUnit" + i]
      ) {
        this.contacts.push({
          name: data["contactName" + i],
          relation: data["contactRelation" + i],
          work: data["contactWorkUnit" + i],
          workphone: data["contactUnitPhone" + i],
          phone: data["contactPhone" + i],
          homephone: data["contactHomePhone" + i],
          companyAddr: data["contactCurrAddress" + i]
        });
      }
    }
  }
}
</script>

<style lang="less" scoped>
.frame {
  padding: 10px;
}
.data-grid-title {
  line-height: 39px;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  color: #00bbca;
}
</style>
