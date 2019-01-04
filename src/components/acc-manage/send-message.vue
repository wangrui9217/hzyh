<template>
  <section class="component send-message">
    <el-col>
      <el-col>
        <div class="title">短信将会发送给以下用户的手机号:</div>
      </el-col>
      <data-box :data="sendData" @onPageChange="refreshData" ref="data-box">
        <template slot="columns">
          <el-table-column prop="relation" label="关系" align="center" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <!--<span>{{scope.row.relation | $dict.getDictData('0015')}}</span>-->
              <span>{{scope.row.relation|dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center" colSpan="3" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="phoneStatus" label="电话状态" align="center" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.phoneStatus|dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <el-button @click="unhangClick(scope)" type="text">移出</el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
      <el-col>
        <div class="title">请选择短信模板:</div>
      </el-col>
      <el-col class="tab-box">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="短信模板" name="template" class="tab-pane">
            <div class="tab-pane">
              <el-form label-width="120px">
                <el-form-item label="短信模板类别:">
                  <el-select v-model="templateClass" @change="templateClassChange">
                    <el-option v-for="{value,label} in this.$dict.getDictData('0023')" :key="value" :label="label" :value="value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="短信模板名称:">
                  <el-select v-model="templateVal" @change="templateValChange">
                    <el-option v-for="{id,templateName} in templateArr" :key="id" :label="templateName" :value="id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="短信内容:">
                  <el-input type="textarea" v-model="templateContent" :autosize="{minRows: 6,maxRows: 6}" readonly></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <div class="btns">
        <el-button @click="massMsg">一键发送</el-button>
      </div>
    </el-col>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import { State, Mutation, namespace } from "vuex-class";
import { Layout, Dependencies } from "~/core/decorator";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { CaseRepairService } from "~/services/business-service/case-repair.service";
import { CommonService } from "~/utils/common.service";
import { TemplateService } from "~/services/business-service/template.service";
import { SmsMessageService } from "~/services/business-service/sms-message.service";
import { Watch, Emit } from "vue-property-decorator";
import SvgIcon from "~/components/common/svg-icon.vue";
const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataBox,
    SvgIcon
  }
})
export default class SendMessage extends Vue {
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(CaseRepairService) private caseRepairService: CaseRepairService;
  @Dependencies(TemplateService) private templateService: TemplateService;
  @Dependencies(SmsMessageService) private smsMessageService: SmsMessageService;
  @accManageModule.State caseInfo;
  @accManageModule.State caseId;
  @accManageModule.State typeId;
  @accManageModule.Mutation updateIsMessage;
  @State companyCode: any;

  @Emit('close')
  close() { }

  private sendData: any = []
  private templateClass: any = '' // 模板类型
  private templateArr: any = [] // 显示的模板名称数组
  private templateVal: any = '' // 模板值
  private templateContent: any = '' // 模板内容
  private custTemplateContent: any = '' // 自定义模板内容
  private activeName: any = 'template' // 选项卡的值
  private sendObjdata: any = [] // 发送对象数据
  private changePhoneIndex: any = ''
  private changePhoneNum: any = {}
  mounted() {
  }
  refreshData(val) {
    this.templateClass = ''
    this.templateVal = ''
    this.templateArr = []
    this.templateContent = ''
    this.sendData = []
    this.sendData.push(val)
    if (!this.sendData) {
      let getPhoneData: any = {
        personalId: this.caseInfo.personalInfo ? this.caseInfo.personalInfo.id : "",
        idCard: this.caseInfo.personalInfo ? this.caseInfo.personalInfo.idCard : ""
      }
      this.accTelPoolService.getTelPersonalContact(getPhoneData).subscribe(
        data => {
          this.sendData = data.content;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      )
    }

  }
  /**
   * 移出
   */
  unhangClick(scope) {
    let arr: Array<any> = []
    this.sendData.map((v, i) => {
      if (i !== scope.$index) {
        arr.push(v)
      }
    })
    this.sendData = arr
  }
  /**
   * 选项卡切换
   */
  handleClick(tab, event) {
    this.templateClass = ''
    this.templateVal = ''
    this.templateArr = []
    this.templateContent = ''
  }
  /**
   * 模板类别切换
   */
  templateClassChange() {
    this.templateArr = []
    this.templateVal = ''
    this.templateContent = ''
     let module: any = {
      templateStyle: "101",
      templateType: this.templateClass,
      templateName: this.templateContent,
      companyCode: this.companyCode
    };
    this.templateService
      .getTemplatesByCondition(module).subscribe(data => {
        let TemplateData = data.content.filter(v =>
          v.templateType === Number(this.templateClass)
        )
        if (TemplateData) {
          this.templateArr = TemplateData
          let defaultTem = TemplateData.find(m => m.isDefault === true)
          if (defaultTem) {
            this.templateVal = defaultTem.id
            this.templateContent = defaultTem.messageContent
          }
        }
      }, ({ msg }) => {
        this.$message.error(msg)
      })
  }
  /**
   * 模板名变化
   */
  templateValChange() {
    this.templateArr.map(v => {
      if (v.id === this.templateVal) {
        this.templateContent = v.messageContent
      }
    })
  }
  /**
   * 发送
   */
  massMsg() {
    if (this.sendData[0].phone === null) {
      this.$alert('联系电话不能为空', '提示', {
        confirmButtonText: '确定'
      })
      return false
    }
    if (this.templateVal === '') {
      this.$alert('请选择短信模板', '提示', {
        confirmButtonText: '确定'
      })
      return false
    }
    let personalParamsList = this.sendData.map(v => {
      return {
        personalPhone: v.phone,
        personalName: v.name,
        contId: v.id
      }
    })
    this.smsMessageService
      .sendMessageSingle({
        tesmId: this.templateVal,
        personalParamsList: personalParamsList,
        personalId: this.caseInfo.personalInfo.id,
        caseNumber: this.caseInfo.caseNumber,
        sendType: 109
      })
      .subscribe(data => {
        if (data.length === 0) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
        } else {
          this.$emit('errMessage', data)
        }
        // 刷新发送信息记录列表
        this.updateIsMessage()
        // 关闭dialog
        this.close()
      }, ({ msg }) => {
        this.$message.error(msg)
      })
  }
}
</script>

<style scoped>
.title {
  margin: 20px 0 20px;
  font-size: 0.875rem;
  color: rgb(31, 45, 61);
  text-align: left;
}

.btns {
  margin-bottom: 20px;
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

.item {
  height: 48px;
  border-bottom: 1px solid rgb(223, 230, 236);
  line-height: 48px;
  text-align: center;
}

.item:last-child {
  border: 0px;
}

.dialog-footer {
  padding-top: 10px;
  padding-bottom: 20px;
}
</style>
