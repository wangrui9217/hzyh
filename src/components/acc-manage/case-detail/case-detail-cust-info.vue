<template>
  <section class="component case-detail-cust-info">
    <el-col class="frame">
      <div>
        <div type="flex" align="left" class="data-grid-title">
          <svg-icon iconName="kaihuxinxi"></svg-icon>
          <span>客户来源</span>
        </div>
        <data-grid  :labelWidth="150"  contentAlign="left">
          <data-grid-item label="客户来源：" :span="3" min-width="80px">{{Number(personalBaseInfo.personalSource) | dictConvert}}</data-grid-item>
          <data-grid-item label="其他来源：" :span="3" min-width="80px">{{personalBaseInfo.otherSource}}</data-grid-item>
          <data-grid-item label="推荐人：" :span="3" min-width="80px">{{personalBaseInfo.referrer}}</data-grid-item>
          <data-grid-item label="推荐支行：" :span="3" min-width="80px">{{personalBaseInfo.introductionBank}}</data-grid-item>
        </data-grid>
      </div>

      <div>
        <div type="flex" align="left" class="data-grid-title">
          <svg-icon iconName="kaihuxinxi"></svg-icon>
          <span>开户信息</span>
        </div>
        <data-grid :labelWidth="150" contentAlign="left">
          <data-grid-item label="约定还款扣款账户姓名：" :span="3" min-width="50px">{{personalBaseInfo.name}}</data-grid-item>
          <data-grid-item label="约定还款扣款账号：" :span="3" min-width="80px">{{personalBank.cardNumber}}</data-grid-item>
          <data-grid-item label="开户行名称：" :span="6" min-width="80px">{{personalBank.depositBank}}</data-grid-item>
        </data-grid>
      </div>

      <div>
        <div type="flex" align="left" class="data-grid-title">
          <svg-icon iconName="kehujibenxinxi"></svg-icon>
          <span>客户基本信息</span>
        </div>
        <data-grid :totalSpan="10" :labelWidth="150" contentAlign="left">
          <data-grid-item label="申请号" :span="2">{{personalBaseInfo.caseNumber}}</data-grid-item>
          <data-grid-item label="姓名" :span="2">{{personalBaseInfo.name}}</data-grid-item>
          <data-grid-item label="性别" :span="2">{{personalBaseInfo.sex | dictConvert}}</data-grid-item>
          <data-grid-item label="手机号" :span="2">{{personalBaseInfo.mobileNo}}</data-grid-item>
          <data-grid-item label="年龄" :span="2">{{personalBaseInfo.age}}</data-grid-item>
          <data-grid-item label="电子邮件" :span="2">{{personalBaseInfo.email}}</data-grid-item>
          <data-grid-item label="学历" :span="2">{{personalBaseInfo.education | dictConvert}}</data-grid-item>
          <data-grid-item label="婚姻状态" :span="2">{{personalBaseInfo.marital | dictConvert}}</data-grid-item>
          <data-grid-item label="子女人数" :span="2">{{personalBaseInfo.childrenNumber}}</data-grid-item>
          <data-grid-item label="国籍" :span="2">{{personalBaseInfo.nationality}}</data-grid-item>
          <data-grid-item label="证件类型" :span="2">{{personalBaseInfo.certificatesType | dictConvert}}</data-grid-item>
          <data-grid-item label="证件号码" :span="2">{{personalBaseInfo.certificatesNumber}}</data-grid-item>
          <data-grid-item label="发证机关所在地" :span="2">{{personalBaseInfo.idCardIssuingAuthority}}</data-grid-item>
          <data-grid-item label="身份证到期日期" :span="2">{{personalBaseInfo.idCardExpirydate | dateFormat}}</data-grid-item>
          <data-grid-item label="居住房屋所有权" :span="2">{{personalBaseInfo.homeOwnership}}</data-grid-item>
          <data-grid-item label="身份证地址" :span="2">{{personalBaseInfo.idCardAddress}}</data-grid-item>
          <data-grid-item label="家庭地址" :span="2">{{personalBaseInfo.localHomeAddress}}</data-grid-item>
          <data-grid-item label="家庭座机" :span="2">{{personalBaseInfo.localPhoneNo}}</data-grid-item>
          <data-grid-item label="现居住迁入时间" :span="4">{{personalBaseInfo.liveMoveTime | dateFormat}}</data-grid-item>
        </data-grid>
      </div>

      <div>
        <el-col class="text-left data-grid-title" style="float:none">
          <svg-icon iconName="fangchanxinxi"></svg-icon>
          <span>房产信息</span>
        </el-col>
        <data-box :data="personalPropertyModel" hiddenIndex>
          <template slot="columns">
            <el-table-column prop="housePurchasePrice" label="房屋购置价" :min-width="$helper.getColumnWidth(3)"></el-table-column>
            <el-table-column prop="houseAssAmt" label="房屋评估价" :min-width="$helper.getColumnWidth(3)"></el-table-column>
            <el-table-column prop="firstPayment" label="首付金额" :min-width="$helper.getColumnWidth(3)"></el-table-column>
            <el-table-column prop="over" label="房贷余额" :min-width="$helper.getColumnWidth(3)"></el-table-column>
            <el-table-column prop="totalPeriods" label="房贷总期数" :min-width="$helper.getColumnWidth(3)"></el-table-column>
            <el-table-column prop="repaymentPeriods" label="房贷已还款期数" :min-width="$helper.getColumnWidth(3)"></el-table-column>
            <el-table-column prop="monthPaymentAmount" label="房贷月均还款额" :min-width="$helper.getColumnWidth(3)"></el-table-column>
            <el-table-column prop="address" label="房产地址" :min-width="$helper.getColumnWidth(8)"></el-table-column>
          </template>
        </data-box>
      </div>

      <div>
        <el-col class="text-left data-grid-title" style="float:none">
          <svg-icon iconName="fangchanxinxi"></svg-icon>
          <span>其他房产信息</span>
        </el-col>
        <data-grid :totalSpan="10" iconClass="icon" :labelWidth="150" contentAlign="left">
          <data-grid-item label="其他房产地址1" :span="10">{{otherPersonalPropertyModel[0]}}</data-grid-item>
          <data-grid-item label="其他房产地址2" :span="10">{{otherPersonalPropertyModel[1]}}</data-grid-item>
          <data-grid-item label="其他房产地址3" :span="10">{{otherPersonalPropertyModel[2]}}</data-grid-item>
          <data-grid-item label="其他房产地址4" :span="10">{{otherPersonalPropertyModel[3]}}</data-grid-item>
        </data-grid>
      </div>
      
      <div>
        <el-col class="text-left data-grid-title" style="float:none">
          <svg-icon iconName="chechanxinxi"></svg-icon>
          <span>车产信息</span>
        </el-col>
        <data-grid :totalSpan="10" iconClass="icon" :labelWidth="150" contentAlign="left">
          <data-grid-item label="车牌号" :span="5">{{personalCar.no}}</data-grid-item>
          <data-grid-item label="驾照号码" :span="5">{{personalCar.driverNumber}}</data-grid-item>
        </data-grid>
      </div>

      <div>
        <el-col class="text-left data-grid-title" style="float:none">
          <svg-icon iconName="danweixinxi"></svg-icon>
          <span>单位信息</span>
        </el-col>
        <data-grid iconClass="icon" :labelWidth="150" contentAlign="left">
          <data-grid-item label="单位名称" :span="4">{{personalJob.companyName}}</data-grid-item>
          <data-grid-item label="工作部门" :span="2">{{personalJob.department}}</data-grid-item>
          <data-grid-item label="岗位" :span="2">{{personalJob.rank}}</data-grid-item>
          <data-grid-item label="在公司职务" :span="2">{{personalJob.position}}</data-grid-item>
          <data-grid-item label="在该公司服务时间(月)" :span="2">{{personalJob.workMother}}</data-grid-item>
          <data-grid-item label="单位性质" :span="4">{{Number(personalJob.nature) | dictConvert}}</data-grid-item>
          <data-grid-item label="行业类别" :span="2">{{personalJob.industry}}</data-grid-item>
          <data-grid-item label="公司电话" :span="2">{{personalJob.phone}}</data-grid-item>
          <data-grid-item label="单位地址" :span="6">{{personalJob.address}}</data-grid-item>
        </data-grid>
      </div>

      <div>
        <el-col class="text-left data-grid-title" style="float:none">
          <svg-icon iconName="shouzhizhuangkuang"></svg-icon>
          <span>收支状况</span>
        </el-col>
        <data-grid :labelWidth="120" contentAlign="left">
          <data-grid-item label="月均薪资(税后)" :span="3">{{personalIncomeExp.monthIncome}}</data-grid-item>
          <data-grid-item label="公积金缴存单位" :span="3">{{personalIncomeExp.fundCompMame}}</data-grid-item>
          <data-grid-item label="缴存期数" :span="3">{{personalIncomeExp.fundCount}}</data-grid-item>
          <data-grid-item label="公积金个人缴存额度：" :span="3">{{personalIncomeExp.fundAmt}}</data-grid-item>
          <data-grid-item label="个人社保月均缴存额度" :span="3">{{personalIncomeExp.socialSecurityAmt}}</data-grid-item>
          <data-grid-item label="社保缴存比例" :span="3">{{personalIncomeExp.socialSecurityRato}}</data-grid-item>
          <data-grid-item label="月固定补贴" :span="3">{{personalIncomeExp.subsidyMonth}}</data-grid-item>
          <data-grid-item label="年收入" :span="3">{{personalIncomeExp.annualIncome}}</data-grid-item>
          <data-grid-item label="家庭月收入" :span="3">{{personalIncomeExp.familyIncome}}</data-grid-item>
          <data-grid-item label="每月租房/房贷费用" :span="3">{{personalIncomeExp.hosingLoan}}</data-grid-item>
          <data-grid-item label="收入认定类型" :span="6">{{personalIncomeExp.incomeType | dictConvert}}</data-grid-item>
        </data-grid>
      </div>

      <el-col class="text-left data-grid-title" style="float:none">
        <svg-icon iconName="lianxirenxinxi"></svg-icon>
        <span>联系人信息</span>
      </el-col>
      <data-box :data="personalContacts">
        <template slot="columns">
          <el-table-column prop="relation" label="关系" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.relation | dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
          </el-table-column>
          <el-table-column prop="address" label="住宅地址" :min-width="$helper.getColumnWidth(6)">
          </el-table-column>
          <el-table-column prop="mobile" label="住宅电话" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="employer" label="工作单位" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="workPhone" label="单位电话" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
        </template>
      </data-box>
    </el-col>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { DataGrid, DataGridItem } from "@zct1989/vue-component";
import SvgIcon from "~/components/common/svg-icon.vue";
import DataBox from "~/components/common/data-box.vue";

@Component({
  components: {
    DataGrid,
    DataGridItem,
    SvgIcon,
    DataBox
  }
})
export default class CaseDetailCustInfo extends Vue {
  @Prop({
    required: true
  })
  caseDetail: any;

  // 客户银行信息
  get personalBankInfos() {
    return this.personalBaseInfo.personalBankInfos || [];
  }

  //客户基本信息
  get personalBaseInfo() {
    return this.caseDetail || {};
  }

  // 客户房产信息
  get personalPropertyModel() {
    let personalPropertyModel:Array<any> = []
    personalPropertyModel.push(this.personalBaseInfo.personalPropertyModel)
    return personalPropertyModel || [];
  }

  // 其他房产信息
  get otherPersonalPropertyModel() {
    let addressList:Array<any> = this.personalBaseInfo.personalPropertyModel.addressList
    for(let i = 0; i < 4; i++){
      if(!addressList[i]) addressList[i] = ''
    }
    let address:any = {}
    Object.assign(address,addressList)
    console.log(address,'address')
    return address
  }

  // personalBank
  get personalBank() {
    return this.personalBaseInfo.personalBank || {};
  }

  // 客户车辆信息
  get personalCar() {
    return this.personalBaseInfo.personalCar || [];
  }

  // 客户工作信息
  get personalJob() {
    return this.personalBaseInfo.personalJob || [];
  }

  // 收支状况
  get personalIncomeExp() {
    return this.personalBaseInfo.personalIncomeExp || [];
  }

  // 联系人信息
  get personalContacts() {
    return this.personalBaseInfo.personalContactList || [];
  }

  get defaultAccountNumber() {
    let accountNumber = "";
    if (this.personalBankInfos.length > 0) {
      accountNumber = this.personalBankInfos[0].accountNumber;
    }
    return accountNumber;
  }
}
</script>
<style lang="less">
.component.case-detail-cust-info {
  .table {
    padding:0!important;
  }
}
</style>

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
