<template>
  <section class="component letter-temp-one">
    <!--用来批量打印操作包含数据的模板-->
    <div :style="{width:'700px',margin:'0 auto',fontSize:'16px',color:'black',height:browserType.printPageHeight}" v-for="val in this.printDataArr">
      <div :style="{textAlign:'center',fontSize:'22px',fontWeight:'bold',margin:'-10px auto 40px auto', opacity: printDataNoShow,paddingTop:'10px'}">逾期还款催收函</div>
      <div>
        <p :style="{textAlign: 'left',textIndent: '2em'}">
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '120px'}">{{val.personalName}}</span>
          <span :style="{opacity: printDataNoShow}">先生/女士:</span>
        </p>
        <p :style="{textIndent: '2em',textAlign: 'justify',lineHeight: '32px'}">
          <span :style="{opacity: printDataNoShow}">你申请号为</span>
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '190px'}">{{val.caseNumber}}</span>
          <span :style="{opacity: printDataNoShow}">的借款合同本期应还款额</span>
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '150px'}">{{someSymbol.moneySymbol}}{{val.overdueAmount | toThousands}}{{someSymbol.yuanSymbol}}</span>
          <span :style="{opacity: printDataNoShow}">，已还款额</span>
          <span :style="{display: 'inline-block',textSlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '150px'}">{{someSymbol.moneySymbol}}{{val.realPayAmount | toThousands}}{{someSymbol.yuanSymbol}}</span>
          <span :style="{opacity: printDataNoShow}">，现已逾期</span>
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '100px'}">{{val.overdueDays}}{{someSymbol.daySymbol}}</span>
          <span :style="{opacity: printDataNoShow}">。请你务必积极筹措资金，按照合约约定，进行本息还款。</span>
        </p>
        <p :style="{textAlign: 'right',paddingRight: '80px'}">
          <span :style="{display: 'inline-block',width:'40px',textAlign: 'center'}">{{ymdDate.year}}</span>
          <span :style="{opacity: printDataNoShow}">年</span>
          <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}">{{ymdDate.month}}</span>
          <span :style="{opacity: printDataNoShow}">月</span>
          <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}">{{ymdDate.day}}</span>
          <span :style="{opacity: printDataNoShow}">日</span>
        </p>
      </div>
    </div>
    <!--用来单条数据打印操作包含数据的模板-->
    <div :style="{width:'700px',margin:'0 auto',fontSize:'16px',color:'black',height:'400px'}" v-for="val in this.PrintInfo">
      <div :style="{textAlign:'center',fontSize:'22px',fontWeight:'bold',margin:'-10px auto 40px auto', opacity: printDataNoShow}">逾期还款催收函</div>
      <div>
        <p :style="{textAlign: 'left',textIndent: '2em'}">
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '120px'}">{{val.personalName}}</span>
          <span :style="{opacity: printDataNoShow}">先生/女士:</span>
        </p>
        <p :style="{textIndent: '2em',textAlign: 'justify',lineHeight: '32px'}">
          <span :style="{opacity: printDataNoShow}">你申请号为</span>
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '190px'}">{{val.caseNumber}}</span>
          <span :style="{opacity: printDataNoShow}">的借款合同本期应还款额</span>
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '150px'}">{{someSymbol.moneySymbol}}{{val.overdueAmount | toThousands}}{{someSymbol.yuanSymbol}}</span>
          <span :style="{opacity: printDataNoShow}">，已还款额</span>
          <span :style="{display: 'inline-block',textSlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '150px'}">{{someSymbol.moneySymbol}}{{val.realPayAmount | toThousands}}{{someSymbol.yuanSymbol}}</span>
          <span :style="{opacity: printDataNoShow}">，现已逾期</span>
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '100px'}">{{val.overdueDays}}{{someSymbol.daySymbol}}</span>
          <span :style="{opacity: printDataNoShow}">。请你务必积极筹措资金，按照合约约定，进行本息还款。</span>
        </p>
        <p :style="{textAlign: 'left',textIndent: '2em',opacity: printDataNoShow}">特此通知</p>
        <p :style="{paddingTop: '20px',textAlign: 'right',paddingRight: '16%',paddingBottom: '20px',opacity: printDataNoShow}">（公章）</p>
        <p :style="{textAlign: 'right',paddingRight: '80px'}">
          <span :style="{display: 'inline-block',width:'40px',textAlign: 'center'}">{{ymdDate.year}}</span>
          <span :style="{opacity: printDataNoShow}">年</span>
          <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}">{{ymdDate.month}}</span>
          <span :style="{opacity: printDataNoShow}">月</span>
          <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}">{{ymdDate.day}}</span>
          <span :style="{opacity: printDataNoShow}">日</span>
        </p>
      </div>
    </div>
    <!--用来展示模板-->
    <div :style="{width:'700px',margin:'0 auto',fontSize:'16px',color:'black',height:'450px',display:sd}">
      <div :style="{textAlign:'center',fontSize:'22px',fontWeight:'bold',margin:'-10px auto 40px auto', opacity: printDataNoShow}">逾期还款催收函</div>
      <div>
        <p :style="{textAlign: 'left',textIndent: '2em'}">
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '120px'}"></span>
          <span :style="{opacity: printDataNoShow}">先生/女士:</span>
        </p>
        <p :style="{textIndent: '2em',textAlign: 'justify',lineHeight: '32px'}">
          <span :style="{opacity: printDataNoShow}">你申请号为</span>
          <span :style="{display: 'inline-block',textAlign: 'center',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '180px'}"></span>
          <span :style="{opacity: printDataNoShow}">的借款合同本期应还款额</span>
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '150px'}"></span>
          <span :style="{opacity: printDataNoShow}">，已还款额</span>
          <span :style="{display: 'inline-block',textSlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '150px'}"></span>
          <span :style="{opacity: printDataNoShow}">，现已逾期</span>
          <span :style="{display: 'inline-block',textAlign: 'left',lineHeight: '16px',borderWidth: noShowUnline,borderBottomStyle: 'solid',minWidth: '100px'}"></span>
          <span :style="{opacity: printDataNoShow}">。请你务必积极筹措资金，按照合约约定，进行本息还款。</span>
        </p>
        <p :style="{textAlign: 'left',textIndent: '2em'}">特此通知</p>
        <p :style="{paddingTop: '20px',textAlign: 'right',paddingRight: '16%',paddingBottom: '20px'}">（公章）</p>
        <!-- <p :style="{textAlign: 'right',padding: '20px 110px 0px 0px',opacity: printDataNoShow}">
          特此通知sss
        </p> -->
        <p :style="{textAlign: 'right',paddingRight: '80px',opacity: printDataNoShow}">
          <span :style="{display: 'inline-block',width:'40px',textAlign: 'center'}"></span>
          <span>年</span>
          <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}"></span>
          <span>月</span>
          <span :style="{display: 'inline-block',width:'30px',textAlign: 'center'}"></span>
          <span>日</span>
        </p>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import { CommonService } from "~/utils/common.service";
  import { Auth, Layout, Dependencies } from "~/core/decorator";
  import { State, Mutation, namespace } from "vuex-class";
  import { Prop } from "vue-property-decorator";
  const letterAccModule = namespace("letter-acc");

  @Component({
    components: {}
  })
  export default class LetterTempOne extends Vue {
    @Prop() printDataArr;
    @Prop() PrintInfo;
    @letterAccModule.State browserType;
    @letterAccModule.State someSymbol;
    @letterAccModule.State ymdDate;
    private sd:any = 'none' // 展示模板的div默认不显示
    private printDataNoShow: any = '1.0' // 默认显示
    private noShowUnline: any = '1px' // 默认显示元素下边框
    mounted() {
    }
    activated () {
    }
    /**
      * 信函模板tab页激活时使使展示模板的div显示
     */
    ltShowTemp() {
      this.sd = 'block'
    }
  }

</script>
<style>


</style>
