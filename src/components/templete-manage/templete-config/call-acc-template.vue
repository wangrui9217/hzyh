<template>
  <section class="component call-acc-template">
    <el-form :model="emailModel" ref="call-form" label-width="120px" class="text-left">
      <el-row>
        <el-form-item prop="isDefault" label="设为默认模板">
          <el-checkbox v-model="emailModel.isDefault" :disabled="defaultFlag"></el-checkbox>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板编号:" prop="templateCode" :rules="[{
            required: true,
            message: '请输入模板编号',
            trigger: 'blur'
          },{
            message: '模板编号只能包含数字和字母', 
            trigger: 'blur', 
            pattern: /^([A-Za-z0-9]+)$/ 
          },{
            max: 40,
            message: '模板编号不超过40位',
            trigger: 'blur'
          }]">
              <el-input v-model="emailModel.templateCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="话术模板类别:" prop="templateType" :rules="[{
            type: 'number',
            required: true,
            message: '请选择模板类别',
            trigger: 'change'
          }]">
              <el-select v-model.number="emailModel.templateType" style="float:left">
                <el-option v-for="{value,label} in $dict.getDictData('0023')" :key="value" :label="label" :value="value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="话术模板名称:" prop="templateName" :rules="[{
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
          }]">
              <el-input v-model="emailModel.templateName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="templateStatus">
              <el-select v-model.number="emailModel.templateStatus" style="float:left" :disabled="defaultFlag">
                <el-option :value="0" label="启用"></el-option>
                <el-option :value="1" label="停用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col>
          <el-form-item label="话术内容: " prop="messageContent" :rules="[{
            required: true,
            message: '请输入话术内容',
            trigger: 'blur'
          }]">
            <el-input type="textarea" v-model="emailModel.messageContent" :autosize="{ minRows: 3}" :maxlength="500"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:center">
      <el-button v-if="!isModify" @click="submitClick('add')" :loading="submitLoading">保存</el-button>
      <el-button v-else @click="submitClick('update')" :loading="submitLoading">保存</el-button>
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
  export default class CallAccTemplete extends Vue {
    @Dependencies(TemplateService) private templateService: TemplateService;
    @Emit("close")
    close() {
      // let messageFrom: any = this.$refs['message-form'];
      // messageFrom.resetFields()
      // this.messageModel.isDefault = false;
    }
    @Emit("success")
    success() {}
    private emailModel: any = {};
    private defaultFlag: any = false;
    private isModify: any = false;
    private submitLoading: Boolean = false;
    created() {
      this.emailModel = {
        isDefault: false,
        templateCode: '', // 模版编号
        templateType: '', // 模版类别
        templateName: '', // 模版名称
        templateStatus: 0, // 模版状态
        messageContent: '', // 模版内容
        templateStyle: 105
      }
    }
    mounted() {

    }
    /**
     * 提交新建模板按钮
     */
    submitClick(type) {
      this.templateService.getTemplateByNameOrCode(this.emailModel).subscribe(data => {
        let callFrom: any = this.$refs['call-form'];
        callFrom.validate(valid => {
          if (!valid) {
            return
          }
          if (this.emailModel.isDefault && this.emailModel.templateStatus === 1) {
            this.$message({
              type: 'info',
              message: '默认模板不可设为停用!'
            })
            return
          }
          switch (type) {
            case 'add':
              this.addTemplate()
              this.submitLoading = true;
              break
            case 'update':
              this.updateTemplate()
              this.submitLoading = true;
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
      this.templateService.createTemplate(this.emailModel).subscribe(data => {
        this.submitLoading = false;
        this.$message({
          type: 'success',
          message: '新增模版成功!'
        })
        this.$emit('success')
        this.close()
      }, ({
        msg
      }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      });
    }
    /**
     * 修改模板
     */
    updateTemplate() {
      this.templateService.updateTemplate(this.emailModel).subscribe(data => {
        this.submitLoading = false;
        this.$message({
          type: 'success',
          message: '修改模版成功!'
        })
        this.$emit('success')
        this.close()
      }, ({
        msg
      }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      });
    }
    /**
     * 获取修改数据
     */
    updateData(data) {
      this.isModify = true
      this.defaultFlag = data.isDefault
      this.emailModel = Object.assign({}, data)
    }
  }

</script>
<style>


</style>
