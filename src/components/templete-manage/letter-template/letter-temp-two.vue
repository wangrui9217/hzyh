<template>
  <section class="component letter-temp-two">
    <!--信函打印展示-->
    <div class="m2_template2" :style="{color:'black',width:'700px',margin:'0 auto',height:'920px' }" v-for="val in PrintInfo" >
      <p class="m2_header" :style="{fontSize:'22px',paddingBottom:'10px',fontWeight:'bold',color:'black',margin:'-7px auto 0px auto',opacity:op,textAlign:'center'}">逾 期 还 款 催 收 函</p>
      <table class="m2_tm2" :style="{width:'700px',border:'1px',fontSize:'16px',borderCollapse:'collapse'}">
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">申请号</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}">{{val.caseNumber}}</td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">逾期天数</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}">{{val.overdueDays}} {{someSymbol.daySymbol}}</td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">债务人</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}">{{val.personalName}}</td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">应还金额</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}">
            {{someSymbol.moneySymbol}} {{val.overdueAmount | toThousands}} {{someSymbol.yuanSymbol}}
          </td>
        </tr>
        <tr class="m2_t3" :style="{height:'650px',verticalAlign:'text-top'}">
          <td colspan="2" :style="{border: m2_td,height:m2_h}">
            <div>
              <p class="m2_care" :style="{textAlign:'left',paddingLeft:'60px',paddingTop:'40px',opacity:op}">注意事项:</p>
              <p class="m2_careContent" :style="{textAlign:'left',paddingLeft:'80px',paddingTop:'10px',paddingRight:'20px',opacity:op}">
                <span> 1. &nbsp;请在收到此通知单后立即无条件按照合同约定时间履行所承担的还款责任，清偿所欠本金、利息和罚息。</span></br>
                </br>
                <span> 2. &nbsp;如不能按期支付，我公司将寻求法律途径催收解决，届时可能对您/贵公司造成不良影响；</span></br>
                </br>
              </p>
              <p class="m2_seal" :style="{textAlign:'right',paddingRight:'154px',paddingTop:'120px',opacity:op,paddingBottom:'20px'}">（公章）</p>
              <p class="m2_date" :style="{textAlign:'right',paddingRight:'120px'}">
                <span :style="{display: 'inline-block',width:'40px',textAlign: 'center'}">{{ymdDate.year?ymdDate.year:''}}</span>
                <span :style="{opacity:op}">年</span>
                <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}">{{ymdDate.month?ymdDate.month:''}}</span>
                <span :style="{opacity:op}">月</span>
                <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}">{{ymdDate.day?ymdDate.day:''}}</span>
                <span :style="{opacity:op}">日</span>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <!--展示模板-->
    <div class="m2_template2" :style="{color:'black',width:'700px',margin:'0 auto',height:'950px',display:model }">
      <p class="m2_header" :style="{fontSize:'22px',paddingBottom:'10px',fontWeight:'bold',color:'black',margin:'-7px auto 0px auto',opacity:op,textAlign:'center'}">逾 期 还 款 催 收 函</p>
      <table class="m2_tm2" :style="{width:'700px',border:'1px',fontSize:'16px',borderCollapse:'collapse'}">
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">申请号</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}"></td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">逾期天数</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}"></td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">债务人</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}"></td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">应还金额</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}"></td>
        </tr>
        <tr class="m2_t3" :style="{height:'650px',verticalAlign:'text-top'}">
          <td colspan="2" :style="{border: m2_td,height:m2_h}">
            <div>

              <p class="m2_care" :style="{textAlign:'left',paddingLeft:'60px',paddingTop:'40px'}">注意事项:</p>
              <p class="m2_careContent" :style="{textAlign:'left',paddingLeft:'80px',paddingTop:'10px',paddingRight:'20px'}">
                <span> 1. &nbsp;请在收到此通知单后立即无条件按照合同约定时间履行所承担的还款责任，清偿所欠本金、利息和罚息。</span></br>
                </br>
                <span> 2. &nbsp;如不能按期支付，我公司将寻求法律途径催收解决，届时可能对您/贵公司造成不良影响；</span></br>
                </br>
              </p>
              <p class="m2_seal" :style="{textAlign:'right',paddingRight:'154px',paddingTop:'120px',opacity:op,paddingBottom:'20px'}">（公章）</p>
              <p class="m2_date" :style="{textAlign:'right',paddingRight:'120px'}">
                <span :style="{display: 'inline-block',width:'40px',textAlign: 'center'}"></span>
                <span>年</span>
                <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}"></span>
                <span>月</span>
                <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}"></span>
                <span>日</span>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <!--批量打印展示-->
    <div class="m2_template2" :style="{color:'black',width:'700px',margin:'0 auto',height:browserType.printPageHeight }" v-for="val in printDataArr" >
      <p class="m2_header" :style="{fontSize:'22px',paddingBottom:'10px',fontWeight:'bold',color:'black',margin:'-7px auto 0px auto',opacity:op,textAlign:'center'}">逾 期 还 款 催 收 函</p>
      <table class="m2_tm2" :style="{width:'700px',border:'1px',fontSize:'16px',borderCollapse:'collapse'}">
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">申请号</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}">{{val.caseNumber}}</td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">逾期天数</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}">{{val.overdueDays}} {{someSymbol.daySymbol}}</td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">债务人</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}">{{val.personalName}}</td>
        </tr>
        <tr>
          <td class="m2_t1" :style="{border: m2_td,height:m2_h,opacity:op,width:m2_w,padding:m2_dis,textAlignLast:m2_align}">应还金额</td>
          <td class="m2_t2" :style="{border: m2_td,height:m2_h,textAlign:m2_cen}">
            {{someSymbol.moneySymbol}} {{val.overdueAmount | toThousands}} {{someSymbol.yuanSymbol}}
          </td>
        </tr>
        <tr class="m2_t3" :style="{height:'650px',verticalAlign:'text-top'}">
          <td colspan="2" :style="{border: m2_td,height:m2_h}">
            <div>
              <p class="m2_care" :style="{textAlign:'left',paddingLeft:'60px',paddingTop:'40px',opacity:op}">注意事项:</p>
              <p class="m2_careContent" :style="{textAlign:'left',paddingLeft:'80px',paddingTop:'10px',paddingRight:'20px',opacity:op}">
                <span> 1. &nbsp;请在收到此通知单后立即无条件按照合同约定时间履行所承担的还款/担保责任，清偿所欠本金、利息和罚息。</span></br>
                </br>
                <span> 2. &nbsp;如不能按期支付，我公司将寻求法律途径催收解决，届时可能对您造成不良影响；</span></br>
                </br>
              </p>
              <p class="m2_seal" :style="{textAlign:'right',paddingRight:'154px',paddingTop:'120px',opacity:op,paddingBottom:'20px'}">（公章）</p>
              <p class="m2_date" :style="{textAlign:'right',paddingRight:'120px'}">
                <span :style="{display: 'inline-block',width:'40px',textAlign: 'center'}">{{ymdDate.year?ymdDate.year:''}}</span>
                <span :style="{opacity:op}">年</span>
                <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}">{{ymdDate.month?ymdDate.month:''}}</span>
                <span :style="{opacity:op}">月</span>
                <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}">{{ymdDate.day?ymdDate.day:''}}</span>
                <span :style="{opacity:op}">日</span>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </section>
</template>
<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {
    Auth,
    Layout,
    Dependencies
  } from "~/core/decorator";
  import {
    Prop
  } from "vue-property-decorator";
  import { namespace } from "vuex-class";
  const letterAccModule = namespace("letter-acc");

  @Component({
    components: {}
  })
  export default class LetterTempTwo extends Vue {
    @Prop() printDataArr;
    @Prop() PrintInfo;
    
    @letterAccModule.State someSymbol;
    @letterAccModule.State ymdDate;
    // 设置table中td的样式
    private m2_td: any = '1px solid black'
    private m2_h: any = '50px'
    // 设置模板中是否显示
    private op: any = '1.0'
    // 设置第一列的样式
    private m2_w: any = '200px'
    private m2_dis: any = '0px 10px'
    // 两端对齐
    private m2_align: any = 'justify'
    // 第二列文字居中
    private m2_cen: any = 'center'
    // 展示模板的div默认不显示
    private model: any = 'none'
    /**
     * 打印数据时的样式
     */
    l2_changeStyle() {
      this.m2_td = '0px';
      this.op = '0.0';
    }
    /**
     * 当需要预览模板时，使模板显示
     */
    l2showTemp() {
      this.model = ''
    }
  }

</script>
<style>


</style>
