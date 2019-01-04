<template>
  <section class="component email-template">
    <el-form :model="emailModel" ref="email-form" label-width="130px" class="text-left">
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
          <el-form-item label="电子邮件模板类别:" prop="templateType" :rules="[{
            type: 'number',
            required: true,
            message: '请选择模板类别',
            trigger: 'change'
          }]">
            <el-select v-model="emailModel.templateType" placeholder="请选择" style="float:left" :disabled="defaultFlag">
              <el-option v-for="{value,label} in $dict.getDictData('0023')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电子邮件模板名称:" prop="templateName" :rules="[{
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
            <el-select v-model="emailModel.templateStatus" style="float:left" :disabled="defaultFlag">
              <el-option :value="0" label="启用"></el-option>
              <el-option :value="1" label="停用"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="24">
        <el-form-item label="模板参数说明" class="readme">
          客户姓名：${cust_name} 性别：${sex} 身份证号：${ID} 还款日期：${date} 逾期天数：${day} 还款金额：${money} 收件人：${receiver} 收件地址：${address} 邮编：${postcode}
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="电子邮件内容: " prop="messageContent" :rules="[{
            required: true,
            message: '请输入模板内容',
            trigger: 'blur'
          }]">
          <el-input type="textarea" v-model="emailModel.messageContent" :autosize="{ minRows: 3}" :maxlength="1000"></el-input>
        </el-form-item>
      </el-col>
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
import { Dependencies } from "~/core/decorator";
import { Emit } from "vue-property-decorator";
import { TemplateService } from "~/services/business-service/template.service";
@Component({
  components: {}
})
export default class EmailTemplete extends Vue {
  @Dependencies(TemplateService) private templateService: TemplateService;
  @Emit("success")
  success() {}
  @Emit("close")
  close() {
    let emailFrom: any = this.$refs["email-form"];
    emailFrom.resetFields();
    this.emailModel.isDefault = false;
  }
  private emailModel: any = {};
  private defaultFlag: any = false;
  private isModify: any = false;
  private submitLoading: Boolean = false;
  created() {
    this.emailModel = {
      templateCode: "", // 模版编号
      isDefault: false, // 是否默认模版
      templateType: "", // 模版类别
      templateName: "", // 模版名称
      templateStatus: 0, // 模版状态
      messageContent: "", // 模版内容
      templateStyle: "103"
    };
  }
  mounted() {}
  /**
   * 提交新建模板按钮
   */
  submitClick(type) {
    this.templateService.getTemplateByNameOrCode(this.emailModel).subscribe(
      data => {
        let emailFrom: any = this.$refs["email-form"];
        emailFrom.validate(valid => {
          if (!valid) {
            return;
          }
          if (
            this.emailModel.isDefault &&
            this.emailModel.templateStatus === 1
          ) {
            this.$message({
              type: "info",
              message: "默认模板不可设为停用!"
            });
            return;
          }
          switch (type) {
            case "add":
              this.addTemplate();
              this.submitLoading = true;
              break;
            case "update":
              this.updateTemplate();
              this.submitLoading = true;
              break;
          }
        });
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 新建模板
   */
  addTemplate() {
    this.templateService.createTemplate(this.emailModel).subscribe(
      data => {
        this.submitLoading = false;
        this.$message({
          type: "success",
          message: "新增模版成功!"
        });
        this.$emit("success");
        this.close();
      },
      ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      }
    );
  }
  /**
   * 修改模板
   */
  updateTemplate() {
    this.templateService.updateTemplate(this.emailModel).subscribe(
      data => {
        this.submitLoading = false;
        this.$message({
          type: "success",
          message: "修改模版成功!"
        });
        this.$emit("success");
        this.close();
      },
      ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      }
    );
  }
  /**
   * 获取修改数据
   */
  updateData(data) {
    this.isModify = true;
    this.defaultFlag = data.isDefault;
    this.emailModel = Object.assign({}, data);
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
  text-align: center;
}
</style>
