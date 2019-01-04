<template>
  <section class="component message-batch-send">
    <el-col>
      <div class="choose-title">短信将会发送给以下用户的手机号:</div>
    </el-col>
    <data-box :data="dataSet">
      <template slot="columns">
      <!--数据列区域-->
      <el-table-column prop="custName" label="客户姓名" align="center" :min-width="$helper.getColumnWidth(3)">
      </el-table-column>
      <el-table-column prop="relation" label="关系" align="center"  :min-width="$helper.getColumnWidth(3)">
        <template slot-scope="scope">
          <el-col type="text" size="small" v-for="(v,i) in scope.row.relation" :key="i" class="item">{{v| dictConvert}}</el-col>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" colSpan="3" :min-width="$helper.getColumnWidth(4)">
        <template slot-scope="scope">
          <el-col type="text" size="small" v-for="(v,i) in scope.row.phone" :key="i" class="item">{{v}}</el-col>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" :min-width="$helper.getColumnWidth(2)">
        <template slot-scope="scope">
          <el-col type="text" size="small" v-for="(v,i) in scope.row.status" :key="i" class="item">{{v| dictConvert}}</el-col>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" :min-width="$helper.getColumnWidth(4)">
        <template slot-scope="scope">
          <el-row v-for="(v,i) in scope.row.phone" class="item" :key="i">
            <el-button @click="addPhone(scope,i)" type="text" size="small">新增手机号</el-button>
            <el-button @click="unhangClick(scope,i)" type="text" size="small">移出</el-button>
          </el-row>
        </template>
      </el-table-column>
      </template>
    </data-box>
    <el-col>
      <div class="choose-title">请选择短信模板:</div>
    </el-col>
    <el-form label-width="120px">
      <el-form-item label="短信模板类别:">
        <el-select v-model="templateClass" @change="templateClassChange">
          <el-option v-for="{value, label} in $dict.getDictData('0023')" :key="value" :label="label" :value="value">
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
        <el-col :span="18">
          <el-input type="textarea" v-model="templateContent" :autosize="{ minRows: 4}" readonly></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <el-col class="btns" align="center">
      <el-button @click="preStep">上一步</el-button>
      <el-button @click="massMsg" :loading="submitLoading">一键群发</el-button>
    </el-col>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import DataForm from "~/components/common/data-form.vue";
  import DataBox from "~/components/common/data-box.vue";
  import { Dependencies } from "~/core/decorator";
  import { CaseIntelligentCollectionService } from "~/services/business-service/case-intelligent-collection.service";
  import { TemplateService } from "~/services/business-service/template.service";
  import { SmsMessageService } from "~/services/business-service/sms-message.service";
  import { Emit } from "vue-property-decorator";

  @Component({
    components: {
      DataForm,
      DataBox
    }
  })
  export default class MessageBatchSend extends Vue {
    @Dependencies(CaseIntelligentCollectionService) private caseIntelligentCollectionService: CaseIntelligentCollectionService;
    @Dependencies(TemplateService) private templateService: TemplateService;
    @Dependencies(SmsMessageService) private smsMessageService: SmsMessageService;
    @Emit('preStep')
    preStep(){}    
    @Emit('addPhone')
    addPhone(scope, i){}    
    @Emit('success')
    success(){}
    @Emit('errMessage')
    errMessage(data){}

    private model: any = {
      userName: '',
      realName: '',
      id: ''
    };
    private dataSet: any = [];
    private selectionList: any = [];
    private checkList: any = [];
    private templateArr: any = [];
    private selected: any = '';
    private templateClass: any = '';
    private templateVal: any = '';
    private templateContent: any = '';
    private submitLoading: Boolean = false;
    refresh(selectionList: any, selected, checkList){
      this.templateArr = []
      this.templateClass = ''
      this.templateVal = ''
      this.templateContent = ''
      this.selectionList = selectionList
      this.checkList = checkList
      this.selected = selected
      this.updateSendData()
    }
    /**
     * 更新发送数据
     */
    updateSendData() {
      this.caseIntelligentCollectionService.handleBatchSend(this.selectionList.map(v=> v.caseId), this.selected, this.checkList).subscribe(data => {
        this.dataSet = data
        for (let i = 0; i < this.selectionList.length; i++) {
          this.dataSet[i].cupoId = this.selectionList[i].cupoId
        }
      }, ({ msg }) => {
        this.$message.error(msg);
      })
    }
    /**
     * 新增手机号更新列表
     */
    addSendData(phoneModel){
      this.dataSet[phoneModel.index].concatIds.push(phoneModel.id)
      this.dataSet[phoneModel.index].nameList.push(phoneModel.name)
      this.dataSet[phoneModel.index].relation.push(phoneModel.relation)
      this.dataSet[phoneModel.index].phone.push(phoneModel.phone)
      this.dataSet[phoneModel.index].status.push(phoneModel.status)
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
     * 模板类别切换
     */
    templateClassChange() {
      this.templateArr = []
      this.templateVal = ''
      this.templateContent = ''
      //  跟进模板类别获取短信模板名称
      this.templateService.getTemplatesByCondition('101').subscribe(data => {
        let TemplateData: any = data.content.filter(v =>
          v.templateType === Number(this.templateClass)
        )
        if (TemplateData) {
          this.templateArr = TemplateData.filter(v => v.templateStyle == 101)
          let defaultTem = this.templateArr.find(m => m.isDefault === true)
          if (defaultTem) {
            this.templateVal = defaultTem.id
            this.templateContent = defaultTem.messageContent
          }
        }
      }, ({ msg }) => {
        this.$message.error(msg);
      })
      TemplateService
    }
    /**
     * 一键群发
     */
    massMsg() {
      if (this.templateVal === '') {
        this.$alert('请选择短信模板', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.submitLoading = true;
      let capaPersonals: any = this.dataSet.map(({ nameList, concatIds, custId, caseNumber, phone }) => {
        let personalPhone = phone
        let personalName = nameList
        let contId = concatIds
        return {
          caseNumber: caseNumber,
          concatPhones: personalPhone,
          concatNames: personalName,
          concatIds: contId,
          personalId: custId
        }
      })
      if(this.dataSet.length<1){
        this.$message.error("联系人为空，无法发送短信");
        return false;
      }
      this.smsMessageService.sendCapaMessageSingle(capaPersonals, 109, this.templateVal).subscribe(data => {
        if (data.length === 0) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.submitLoading = false;

        } else {
          this.errMessage(data)
          this.submitLoading = false;
        }
        this.success()
      }, ({ msg }) => {
        this.$message.error(msg);
        this.submitLoading = false;
      })
    }
    /**
     * 移出
     */
    unhangClick(scope, index) {
      if (this.dataSet[scope.$index].phone.length === 1) {
        let data: any = []
        this.dataSet.map((v, i) => {
          if (i !== scope.$index) {
            data.push(v)
          }
        })
        this.dataSet = data
        return
      }
      let newData = this.dataSet.map((v, i) => {
        if (i === scope.$index) {
          let relation: any = []
          let phone: any = []
          let status: any = []
          let concatIds: any = []
          let nameList: any = []
          v.relation.map((rv, ri) => {
            if (ri !== index) {
              relation.push(rv)
            }
          })
          v.phone.map((pv, pi) => {
            if (pi !== index) {
              phone.push(pv)
            }
          })
          v.status.map((v, i) => {
            if (i !== index) {
              status.push(v)
            }
          })
          v.concatIds.map((m, q) => {
            if (q !== index) {
              concatIds.push(m)
            }
          })
          v.nameList.map((n, u) => {
            if (u !== index) {
              nameList.push(n)
            }
          })
          return {
            'custId': v.custId,
            'concatIds': concatIds,
            'custName': v.custName,
            'relation': relation,
            'phone': phone,
            'status': status,
            'caseNumber': v.caseNumber,
            'nameList': nameList
          }
        }
        return v
      })
      this.dataSet = newData
    }
  }

</script>

<style lang="less" scoped>
  .choose-title {
    margin: 30px 0 30px;
    color: rgb(31, 45, 61);
    text-align: left;
  }

  .btns {
    margin-bottom: 30px;
    margin-top: 20px;
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
    height: 33px;
    border-bottom: 1px solid rgb(223, 230, 236);
    line-height: 33px;
    text-align: center;
  }

  .item:last-child {
    border: 0px;
  }
</style>
