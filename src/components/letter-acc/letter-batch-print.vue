<template>
  <section class="component letter-batch-print">
    <el-col>
      <el-col>
        <div class="remindText">将会打印以下用户的信函:</div>
      </el-col>
      <data-box :data="printDataArr" max-height="500" stripe>
        <template slot="columns">
          <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(3)"></el-table-column>
          <el-table-column label="操作" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <el-button @click="removePrintClick(scope)" type="text" size="small">移出</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <el-col class="selectTempCol">
        <el-col class="tip">
          <div>请选择打印时使用的模板：</div>
        </el-col>
        <el-form ref="form" :model="form" class="selectTemp">
          <el-form-item>
            <el-select v-model="form.resource" clearable>
              <el-option v-for="(val, index) in templateContent" :key="index" :label="val.templateName" :value="val.templateName"></el-option>
            </el-select>
            <el-button @click="previewPrint()">预览</el-button>
          </el-form-item>
          <el-form-item style="text-align:center">
            <el-button @click="printAllClick()">一键打印</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </section>
</template>
<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {    Auth,    Layout,    Dependencies  } from "~/core/decorator";
  import {    State,    Mutation,    namespace  } from "vuex-class";
  import {    Emit  } from "vue-property-decorator";
  import {    TemplateService  } from "~/services/business-service/template.service";
  import {    templateVarType  } from "~/config/enum.config";
  import LetterTempOne from "~/components/templete-manage/letter-template/letter-temp-one.vue";
  import LetterTempTwo from "~/components/templete-manage/letter-template/letter-temp-two.vue";
  import LetterTempThree from "~/components/templete-manage/letter-template/letter-temp-three.vue";
  import DataBox from "~/components/common/data-box.vue";

  const letterAccModule = namespace("letter-acc");

  @Component({
    components: {
      LetterTempOne,
      LetterTempTwo,
      LetterTempThree,
      DataBox
    }
  })
  export default class LetterBatchPrint extends Vue {
    @Dependencies(TemplateService) private templateService: TemplateService;
    @letterAccModule.State printInfo;
    @letterAccModule.State browserType;
    @letterAccModule.Mutation updatePrintInfo
    private printDataArr: any = [];
    private templateContent: any = [];
    private content: any = [];
    private form: any = {
      resource: ''
    }
    @Emit('preview')
    preview(val) {}
    batchDataSend(multipleSelection, templateContent) {
      this.printDataArr = multipleSelection
      this.templateContent = templateContent
    }
    previewPrint() {
      let val = this.templateContent.find(v => v.templateName === this.form.resource).messageContent
      templateVarType.forEach(v => {
        val = val.replace(new RegExp('\\' + v.value, 'g'), '______')
      })
      this.preview(val);
    }
    /**
     * 移除不打印的客户
     */
    removePrintClick(scope) {
      let arr: any = []
      this.printDataArr.map((v, i) => {
        if (i !== scope.$index) {
          arr.push(v)
        }
      })
      this.printDataArr = arr
      // 移出数据之后需要更新store的状态
      this.updatePrintInfo(arr)
    }
    /**
     * 一键打印
     */
    printAllClick() {
      var smodel = this.form.resource
      if (this.printDataArr.length === 0) {
        this.$alert('请选择用户', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      if (!smodel) {
        this.$alert('请选择打印要使用的模板', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.templateChange()
      var nWindow: any = window.open('.')
      nWindow.document.write(this.content)
      nWindow.print()
      nWindow.close()
    }
    templateChange() {
      let contentStr: any = ''
      this.printDataArr.forEach((val, index) => {
        let batchContent = `<div style="width:100%;height:${this.browserType.printPageHeight}">` + this.templateContent
          .find(v => {
            return v.templateName === this.form.resource
          }).messageContent + '</div>'
        templateVarType.forEach(v => {
          let tempValue = v.value.substr(1)
          batchContent = batchContent.replace(new RegExp('\\' + v.value, 'g'), val[tempValue])
        })
        contentStr += batchContent
        this.content = contentStr
      })
    }
  }

</script>
<style>


</style>
