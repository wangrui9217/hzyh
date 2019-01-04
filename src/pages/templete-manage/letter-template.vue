<template>
  <section class="page letter-temp">
    <div style="margin-left:20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="信函模板一" name="lt-first">
          <p style="height:100px"></p>
          <letter-temp-one ref="letter-one"></letter-temp-one>
          <div style="text-align:center">
            <el-button type="primary" :style="{width:printButtonWidth}" @click="printTempOne" v-auth="5500">打印</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="信函模板二" name="lt-second">
          <p></p>
          <letter-temp-two ref="letter-two"></letter-temp-two>
          <div style="text-align:center">
            <el-button type="primary" :style="{width:printButtonWidth}" @click="printTempTwo" v-auth="5500">打印</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="信函模板三" name="lt-third">
          <p style="height:60px"></p>
          <letter-temp-three ref="letter-three"></letter-temp-three>
          <div style="text-align:center">
            <el-button type="primary" :style="{width:printButtonWidth}" @click="printTempThree" v-auth="5500">打印</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LetterTempOne from '~/components/templete-manage/letter-template/letter-temp-one.vue'
import LetterTempTwo from '~/components/templete-manage/letter-template/letter-temp-two.vue'
import LetterTempThree from '~/components/templete-manage/letter-template/letter-temp-three.vue'
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Mutation, namespace } from "vuex-class";
import { CommonService } from "~/utils/common.service";
const templateManageModule = namespace("template-manage");

@Auth(820)
@Layout('workspace')
@Component({
  components: {
    LetterTempOne,
    LetterTempTwo,
    LetterTempThree
  }
})
export default class LetterTemplate extends Vue {
  private activeName: any = 'lt-first' // 默认所在tab页
  private printButtonWidth: any = '100px' // 打印按钮的宽度
  @templateManageModule.State templateManage;
  printTempOne() {
    let nWindow: any = window.open('')
    this.$nextTick(() => {
      let letterOne: any = this.$refs['letter-one'];
      var docStr: any = letterOne.$el.innerHTML;
      nWindow.document.write(docStr)
      nWindow.print()
      nWindow.close()
    })
  }
  printTempTwo() {
    let nWindow: any = window.open('')
    this.$nextTick(() => {
      let letterTwo: any = this.$refs['letter-two'];
      var content: any = letterTwo.$el.innerHTML;
      nWindow.document.write(content)
      if (nWindow) {
        nWindow.print()
        nWindow.close()
      }
    })
  }
  printTempThree() {
    let nWindow: any = window.open('')
    this.$nextTick(() => {
      let letterThree: any = this.$refs['letter-three'];
      var docStr: any = letterThree.$el.innerHTML;
      nWindow.document.write(docStr)
      if (nWindow) {
        nWindow.print()
        nWindow.close()
      }
    })
  }
  handleClick() { }
  mounted() {
    this.$nextTick(() => {
      let letterOne: any = this.$refs['letter-one'];
      let letterTwo: any = this.$refs['letter-two'];
      let letterThree: any = this.$refs['letter-three'];
      letterOne.ltShowTemp();
      letterTwo.l2showTemp();
      letterThree.lt3ShowTemp();
    })
  }
}

</script>

<style lang="less">

</style>
