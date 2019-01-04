<template>
  <section class="component letter-print">
    <div>
    <el-tabs v-model="templateDefault" type="border-card">
      <el-tab-pane :label="val.templateName" v-for="(val,index) in templateContent" :key="index" :name="'lt'+index">
        <div v-html="val.messageContent" :style="{width: '210mm',margin:'0 auto'}"></div>
        <div style="text-align:center">
          <el-button @click="printClick(val.messageContent)">打印</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="信函模板一" name="lt-first">
        <p style="height:100px"></p>
        <letter-temp-one ref="letter-one" :PrintInfo="printInfo"></letter-temp-one>
        <div style="text-align:center">
          <el-button :style="{width:printButtonWidth}" @click="printTempOne">打印</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="信函模板二" name="lt-second">
        <p></p>
        <letter-temp-two ref="letter-two" :PrintInfo="printInfo"></letter-temp-two>
        <div style="text-align:center">
          <el-button :style="{width:printButtonWidth}" @click="printTempTwo">打印</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="信函模板三" name="lt-third">
        <p style="height:60px"></p>
        <letter-temp-three ref="letter-three" :PrintInfo="printInfo"></letter-temp-three>
        <div style="text-align:center">
          <el-button :style="{width:printButtonWidth}" @click="printTempThree">打印</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { templateVarType } from "~/config/enum.config";
import { State, Mutation, namespace } from "vuex-class";
import LetterTempOne from "~/components/templete-manage/letter-template/letter-temp-one.vue";
import LetterTempTwo from "~/components/templete-manage/letter-template/letter-temp-two.vue";
import LetterTempThree from "~/components/templete-manage/letter-template/letter-temp-three.vue";
import clone from "clone";

const letterAccModule = namespace("letter-acc");
@Component({
  components: {
    LetterTempOne,
    LetterTempTwo,
    LetterTempThree
  }
})
export default class LetterPrint extends Vue {
  @letterAccModule.State printInfo;
  private templateContent: any = [];
  private tmpDefault: any = "lt-first";
  private printButtonWidth: any = "100px"; // 打印按钮的宽度
  /**
   * 信函模板打印单击事件
   */
  printClick(messageContent) {
    var newWindow: any = window.open("");
    newWindow.document.write(messageContent);
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
  }
  get templateDefault() {
    if (this.templateContent.length > 0) {
      return "lt0";
    }
    return "lt-first";
  }
  set templateDefault(value) {
    this.tmpDefault = value;
  }
  printTempOne() {
    let nWindow: any = window.open("");
    this.$nextTick(() => {
      let letterOne: any = this.$refs["letter-one"];
      var docStr: any = letterOne.$el.innerHTML;
      nWindow.document.write(docStr);
      nWindow.print();
      nWindow.close();
    });
  }
  printTempTwo() {
    let nWindow: any = window.open("");
    this.$nextTick(() => {
      let letterTwo: any = this.$refs["letter-two"];
      var content: any = letterTwo.$el.innerHTML;
      nWindow.document.write(content);
      if (nWindow) {
        nWindow.print();
        nWindow.close();
      }
    });
  }
  printTempThree() {
    let nWindow: any = window.open("");
    this.$nextTick(() => {
      let letterThree: any = this.$refs["letter-three"];
      var docStr: any = letterThree.$el.innerHTML;
      nWindow.document.write(docStr);
      if (nWindow) {
        nWindow.print();
        nWindow.close();
      }
    });
  }
  refreshTemplate(templateContent) {
    this.templateContent = clone(templateContent);
    this.templateContent.forEach(val => {
      templateVarType.forEach(v => {
        let tempValue = v.value.substr(1);
        let newStr: any =
          this.printInfo[0][tempValue] === null
            ? 0
            : this.printInfo[0][tempValue] === undefined
              ? 0
              : this.printInfo[0][tempValue];
        val.messageContent = val.messageContent.replace(
          new RegExp("\\" + v.value, "g"),
          newStr
        );
      });
    });
  }
}
</script>
<style lang="less">
.letter-print {
  .line_content {
    width: 120px;
    height: 0;
    border-bottom: 1px solid rgb(220, 223, 230);
  }
}
</style>
