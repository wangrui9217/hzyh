<template>
  <section class="component send-email">
    <div>邮件将会发送给以下用户的电子邮箱:</div>
    <data-box :data="emailDataSet" @onSearch="refreshData">
      <template slot="columns">
        <el-table-column prop="name" label="客户姓名" align="center" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="mail" label="电子邮件" align="center" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)" align="center">
          <template slot-scope="scope">
            <!--<el-button @click="emailChange(scope)" type="text" size="small">新增邮箱</el-button>-->
            <el-button @click="unhangClick(scope)" type="text" size="small">移出</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <div>请选择邮件模板:</div>
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="邮件模板" name="template">
        <el-form label-width="120px">
          <el-form-item label="邮件模板类别:">
            <el-select v-model="templateClass" @change="templateClassChange">
              <el-option v-for="{value,label} in $dict.getDictData('0023')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮件模板名称:">
            <el-select v-model="templateVal" @change="templateValChange">
              <el-option v-for="{id,templateName} in templateArr" :key="id" :label="templateName" :value="id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮件内容:">
            <el-col :span="18">
              <el-input type="textarea" v-model="templateContent" :autosize="{ minRows: 4}" readonly></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="btns">
      <el-button @click="massMsg">一键群发</el-button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  Layout,
  Dependencies
} from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import {
  CaseIntelligentCollectionService
} from "~/services/business-service/case-intelligent-collection.service";
import {
  TemplateService
} from "~/services/business-service/template.service";
import {
  MailMessageService
} from "~/services/business-service/mail-message.service";
@Component({
  components: {
    DataBox
  }
})
export default class SendEmail extends Vue {
  @Dependencies(CaseIntelligentCollectionService) private caseIntelligentCollectionService:
    CaseIntelligentCollectionService;
  @Dependencies(MailMessageService) private mailMessageService: MailMessageService;
  @Dependencies(TemplateService) private templateService: TemplateService;
  private emailDataSet: any = [];
  private templateVal: any = '';
  private templateContent: any = '';
  private activeName: any = '';
  private templateClass: any = '';
  private templateValId: any = '';
  private templateArr: Array<any> = [];
  private refreshId: Array<any> = [];
  private htmlFromEditor: any = '';
  created() {
    this.activeName = 'template';
  }
  refreshData(val) {
    let emailBatchSendList = val.id;
    this.refreshId = emailBatchSendList
    this.emailDataSet = []
    this.emailDataSet.push(val)
  }
  /**
   * 修改邮箱后更新发送对象数据
   */
  updateSendData() {
    this.caseIntelligentCollectionService.handleEmailSend(this.refreshId).subscribe(data => {
      this.emailDataSet = data;
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      });
  }
  /**
   * 模板类别切换
   */
  templateClassChange() {
    this.templateArr = []
    this.templateVal = ''
    this.templateContent = ''
    this.templateService.getTemplatesByCondition(this.templateClass).subscribe(data => {
      let TemplateData: any = data.content.filter(v =>
        v.templateType === Number(this.templateClass)
      )
      if (TemplateData) {
        this.templateArr = TemplateData.filter(v => v.templateStyle == 103)
        let defaultTem = this.templateArr.find(m => m.isDefault === true)
        if (defaultTem) {
          this.templateVal = defaultTem.id
          this.templateContent = defaultTem.messageContent
        }
      }
      this.templateValChange()
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      });
  }
  /**
   * 模板名变化
   */
  templateValChange() {
    this.templateArr.map(v => {
      if (v.id === this.templateVal) {
        this.templateContent = v.messageContent
        this.templateValId = v.id
      }
    })
  }
  /**
   * 一键群发
   */
  massMsg() {
    let mereContent = ''
    let tesmId = ''
    if (this.templateVal === '') {
      this.$alert('请选择邮件模板', '提示', {
        confirmButtonText: '确定'
      })
      return false
    }
    mereContent = this.templateContent
    let sendData: any = {
      emailSendParamList: this.emailDataSet,
      mereContent: mereContent,
      tesmId: this.templateValId,
      mereStyle: 109
    }
    this.mailMessageService.sendMail(sendData).subscribe(
      data => {this.$message.success('操作成功'), 
              this.$emit("close")},
      err =>  this.$message.error(err.msg)
    )
  }
  /**
   * 新增邮箱
   */
  emailChange(scope) {
    this.$emit('emailChange', scope)
  }
  /**
   * 移出
   */
  unhangClick(scope) {
    let arr: any = []
    this.emailDataSet.map((v, i) => {
      if (i !== scope.$index) {
        arr.push(v)
      }
    })
    this.emailDataSet = arr
  }
}

</script>
<style scoped>
/*.header {
    margin: 30px 0 30px;
    font-size: 0.875rem;
    color: rgb(31, 45, 61);
    text-align: left;
  }*/

.btns {
  margin-bottom: 30px;
  margin-top: 20px;
  text-align: center;
}

.tab-pane {
  min-height: 250px;
}

.redcolor {
  color: #ff5722;
  font-size: 0.875rem;
}

.red-font {
  color: #ff5722;
  font-size: 0.875rem;
  text-align: left;
  margin: 10px 0 20px;
}

.tab-box {
  text-align: left;
}
</style>
