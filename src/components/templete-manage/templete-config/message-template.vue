<template>
  <section class="component message-template">
    <el-form :model="messageModel" :rules="rules" ref="message-form" label-width="120px" class="text-left">
      <el-row>
        <el-form-item prop="isDefault" label="设为默认模板">
          <el-checkbox v-model="messageModel.isDefault" :disabled="defaultFlag"></el-checkbox>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板编号:" prop="templateCode">
              <el-input v-model="messageModel.templateCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="短信模板类别:" prop="templateType">
              <el-select v-model="messageModel.templateType" placeholder="请选择" style="float:left" :disabled="defaultFlag">
                <el-option v-for="{value,label} in $dict.getDictData('0023')" :key="value" :label="label" :value="value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="短信模板名称:" prop="templateName">
              <el-input v-model="messageModel.templateName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="templateStatus">
              <el-select v-model.number="messageModel.templateStatus" style="float:left" :disabled="defaultFlag">
                <el-option :value="0" label="启用"></el-option>
                <el-option :value="1" label="停用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="模板参数说明" class="readme">
            客户姓名：${cust_name} 还款日期：${date} 逾期天数：${day} 还款金额：${money}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="短信内容: " prop="messageContent">
            <el-input type="textarea" v-model="messageModel.messageContent" :autosize="{ minRows: 3}" :maxlength="500"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item style="text-align:left;font-size:5px;" class="readme">
            提示：短信内容不超过500个字符，其中包括标点符合或空格等！
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:center">
      <el-button v-if="!isModify" @click="submitClick('add')">保存</el-button>
      <el-button v-else @click="submitClick('update')">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </section>
</template>
<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {
    Dependencies
  } from "~/core/decorator";
  import {
    Emit
  } from "vue-property-decorator";
  import {
    TemplateService
  } from "~/services/business-service/template.service";

  @Component({
    components: {}
  })
  export default class MessageTemplete extends Vue {
    @Dependencies(TemplateService) private templateService: TemplateService;
    @Emit("close")
    close() {
      let messageFrom: any = this.$refs['message-form'];
      messageFrom.resetFields()
      this.messageModel.isDefault = false;
    }
    @Emit("success")
    success() {}
    private messageModel: any = {};
    private defaultFlag: any = false;
    private isModify: any = false;
    private rules: any = {};
    created() {
      this.messageModel = {
        templateCode: '', // 模版编号
        isDefault: false, // 是否默认模版
        templateType: '', // 模版类别
        templateName: '', // 模版名称
        templateStatus: 0, // 模版状态
        messageContent: '', // 模版内容
        templateStyle: '101'
      }
      this.rules = {
        templateType: [{
          type: 'number',
          required: true,
          message: '请选择模板类别',
          trigger: 'change'
        }],
        messageContent: [{
          required: true,
          message: '请输入模板内容',
          trigger: 'blur'
        }, {
          min: 0,
          max: 1000,
          message: '不超过1000个字符',
          trigger: 'blur'
        }],
        templateCode: [{
          required: true,
          message: '请输入模板编号',
          trigger: 'blur'
        }, {
          message: '模板编号只能包含数字和字母',
          trigger: 'blur',
          pattern: /^([A-Za-z0-9]+)$/
        }, {
          max: 40,
          message: '模板编号不超过40位',
          trigger: 'blur'
        }],
        templateName: [{
          required: true,
          message: '请输入模板名称',
          trigger: 'blur'
        }, {
          message: '模板名称只能是汉字或字母',
          trigger: 'blur',
          pattern: /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/
        }, {
          min: 2,
          max: 10,
          message: '长度在 2 到 10 个字符',
          trigger: 'blur'
        }]
      }
    }
    mounted() {

    }
    /**
     * 提交新建模板按钮
     */
    submitClick(type) {
      this.templateService.getTemplateByNameOrCode(this.messageModel).subscribe(data => {
        let messageFrom: any = this.$refs['message-form'];
        messageFrom.validate(valid => {
          if (!valid) {
            return
          }
          if (this.messageModel.isDefault && this.messageModel.templateStatus === 1) {
            this.$message({
              type: 'info',
              message: '默认模板不可设为停用!'
            })
            return
          }
          switch (type) {
            case 'add':
              this.addTemplate()
              break
            case 'update':
              this.updateTemplate()
              break
          }
        })
      }, ({
        msg
      }) => {
        this.$message.error(msg);
      });
    }
    /**
     * 新建模板
     */
    addTemplate() {
      this.templateService.createTemplate(this.messageModel).subscribe(data => {
        this.$message({
          type: 'success',
          message: '新增模版成功!'
        })
        this.$emit('success')
        this.messageModel.templateCode ='';
        this.messageModel.templateCode = '';// 模版编号
        this.messageModel.isDefault = false; // 是否默认模版
        this.messageModel.templateType = ''; // 模版类别
        this.messageModel.templateName = ''; // 模版名称
        this.messageModel.templateStatus = 0; // 模版状态
        this.messageModel.messageContent = ''; // 模版内容
        this.messageModel.templateStyle = '101';
        this.close()
      }, ({
        msg
      }) => {
        this.$message.error(msg);
      });
    }
    /**
     * 修改模板
     */
    updateTemplate() {
      this.templateService.updateTemplate(this.messageModel).subscribe(data => {
        this.$message({
          type: 'success',
          message: '修改模版成功!'
        })
        this.$emit('success')
        this.messageModel.templateCode ='';
        this.messageModel.templateCode = '';// 模版编号
        this.messageModel.isDefault = false; // 是否默认模版
        this.messageModel.templateType = ''; // 模版类别
        this.messageModel.templateName = ''; // 模版名称
        this.messageModel.templateStatus = 0; // 模版状态
        this.messageModel.messageContent = ''; // 模版内容
        this.messageModel.templateStyle = '101';
        this.close()
      }, ({
        msg
      }) => {
        this.$message.error(msg);
      });
    }
    /**
     * 获取修改数据
     */
    updateData(data) {
      this.isModify = true
      this.defaultFlag = data.isDefault
      this.messageModel = Object.assign({}, data)
    }
  }

</script>
<style scoped>
  .readme {
    color: #ff5722;
    font-size: 0.875rem;
    text-align: left;
    margin: 10px 0 20px;
    text-align: left;
    font-size: 5px;
  }

  .btns {
    text-align: center
  }

</style>
