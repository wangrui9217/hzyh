<template>
  <section class="component modify-parameter">
    <el-form class="demo-ruleForm" :rules="rules" :model="modifyParams" ref="modify-form" label-width="90px">
      <el-form-item label="参数代码" prop="code" align="left">
        <el-input v-model="modifyParams.code" disabled></el-input>
      </el-form-item>
      <el-form-item label="参数名称" prop="name" align="left">
        <el-input v-model="modifyParams.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="field" align="left">
        <el-input v-model="modifyParams.value" v-show="modifyParams.code !== 'SysParam.phone.call'" :disabled="modifyParams.style===2"></el-input>
        <el-select v-model="modifyParams.value" v-show="modifyParams.code === 'SysParam.phone.call'">
          <el-option v-for="{value,label} of $dict.getDictData('0038')" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用" align="left" prop="status">
        <el-radio-group v-model="modifyParams.status" style="margin-top: 5px">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传模板" v-if="modifyParams.style===2">
        <FileUpLoad ref="upload_template" :fileList.sync="modifyParams.fileList" :fileNumberLimit="1" :AllowExtension="fileExt"></FileUpLoad>
      </el-form-item>
      <el-form-item label-width="0px" align="center">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="modifyCommit" :loading="submitLoading">确定</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { SysParamService } from "~/services/business-service/sys-param.service";
import { Emit } from "vue-property-decorator";
import FileUpLoad from "~/components/common/file-upload.vue";

@Component({
  components: {
    FileUpLoad
  }
})
export default class ModifyParameter extends Vue {
  @Dependencies(SysParamService) private sysParamService: SysParamService;
  @Emit("refreshList")
  refreshList() { }

  // 过滤文件类型
  fileExt = ["xls", "xlsx"];

  private modifyParams: any = {
    code: "",
    companyCode: "",
    id: "",
    name: "",
    operateTime: "",
    operator: "",
    remark: "",
    sign: 0,
    status: "",
    type: "",
    value: "",
    field: "",
    style: "",
    fileList: []
  };
  private rules: any = {
    code: [{ required: true, message: "请输入参数代码", trigger: "blur" }],
    name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
    status: [{ required: true, message: "请选择是否启用" }]
  };
  private submitLoading: Boolean = false;
  /**
   * 取消
   */
  cancel() {
    //   关闭修改角色dialog
    this.$emit("close");
    // 重置form表单
    let modifyForm: any = this.$refs["modify-form"];
    modifyForm.resetFields();
  }
  modifyCommit() {
    let modifyform: any = this.$refs["modify-form"];
    modifyform.validate(valid => {
      if (!valid) return false;
      this.submitLoading = true;
      if (this.modifyParams.style === 2) {
        // let file = this.$refs['upload_template'].getFile()
        let paramData: any = {
          id: this.modifyParams.id,
          url: this.modifyParams.fileList[0].response.url
        };
        this.sysParamService.modifyTemplateUrl(paramData).subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("操作成功");
            this.modifyParams.fileList = [];
            this.refreshList();
            this.$emit("close");
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
          }
        );
      } else {
        this.sysParamService.createSysParam(this.modifyParams).subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("操作成功");
            this.refreshList();
            this.$emit("close");
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
          }
        );
      }
    });
  }

  isCall(d) {
    if (d === "SysParam.phone.call") {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 获取修改行数据
   */
  refresh(modifyData) {
    this.modifyParams.code = modifyData.code;
    this.modifyParams.companyCode = modifyData.companyCode;
    this.modifyParams.field = modifyData.field;
    this.modifyParams.id = modifyData.id;
    this.modifyParams.status = modifyData.status;
    this.modifyParams.name = modifyData.name;
    this.modifyParams.type = modifyData.type;
    this.modifyParams.operateTime = modifyData.operateTime;
    this.modifyParams.operator = modifyData.operator;
    this.modifyParams.sign = modifyData.sign;
    this.modifyParams.remark = modifyData.remark;
    this.modifyParams.value =
      modifyData.code === "SysParam.phone.call"
        ? Number(modifyData.value)
        : modifyData.value;
    this.modifyParams.id = modifyData.id;
    this.modifyParams.style = modifyData.style;
    this.modifyParams.isShow = modifyData.isShow;
  }
}
</script>

<style scoped>

</style>
