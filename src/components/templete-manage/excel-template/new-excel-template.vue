<template>
  <section class="component new-excel-template">
    <el-form :inline="true" ref="data-form" label-width="100px" class="text-left" :model="templatemode">
      <el-form-item label="委托方" prop="principalName" :rules="[{
              required: true,
              message: '请选择',
              trigger: 'change'
            }]">
        <el-select :disabled="disabledInput" v-model="templatemode.principalName" placeholder="请选择" clearable>
          <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称:" prop="templateName" :rules="[{
              required: true,
              message: '请输入模板名称',
              trigger: 'blur'
            }]">
        <el-input v-model="templatemode.templateName" placeholder="请输入内容" :readonly="disabledInput"></el-input>
      </el-form-item>
      <el-form-item label="标题起始行:" prop="rowNum" :rules="[{
              required: true,
              message: '请输入标题起始行',
              trigger: 'blur'
            },{
               pattern: /^[0-9]*[1-9][0-9]*$/,
             message: '行号只能为正整数'
          }]">
        <el-input v-model="templatemode.rowNum" placeholder="请输入内容" :readonly="disabledInput"></el-input>
      </el-form-item>
      <el-form-item label="标题起始列:" prop="colNum" :rules="[{
              required: true,
              message: '请输入标题起始列',
              trigger: 'blur'
            },{
              pattern: /^[A-Z0-9]+$/,
              message: '列号只能为大写字母'
          }]">
        <el-input v-model="templatemode.colNum" placeholder="请输入内容" :readonly="disabledInput"></el-input>
      </el-form-item>
      <el-form-item label="数据起始行:" prop="dataRowNum" :rules="[{
              required: true,
              message: '请输入数据起始行',
              trigger: 'blur'
            },{
               pattern: /^[1-9]|[1-9]\d+$/,
              message: '行号只能为大于1的正整数'
          }]">
        <el-input v-model="templatemode.dataRowNum" placeholder="请输入内容" :readonly="disabledInput"></el-input>
      </el-form-item>
      <el-form-item label="数据起始列:" prop="dataColNum" :rules="[{
              required: true,
              message: '请输入数据起始列',
              trigger: 'blur'
            }]">
        <el-input v-model="templatemode.dataColNum" placeholder="请输入内容" :readonly="disabledInput"></el-input>
      </el-form-item>
      <el-form-item label="上传文件" v-if="flag" class="excel-import">
        <file-upload class="file-upload" ref="upload_case_import" :fileList.sync="fileList" :fileNumberLimit="1" @onUploadSuccess="onUploadSuccess"></file-upload>
      </el-form-item>
    </el-form>
    <data-box :data="tableData" height='300'>
      <template slot="columns">
        <el-table-column prop="cellName" label="名称" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="cellTypeName" label="类型" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="colNum" label="列编号" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="relateName" label="映射字段" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="relateNameClick(scope)" v-if="scope.row.relateName==''">查看</el-button>
            <span v-if="scope.row.relateName!==''">{{ transformRelateName(scope.row.relateName)}}</span>
            <span @click="relateNameClick(scope)" v-if="scope.row.relateName!==''">
              <svg-icon iconName="xitongshezhi"></svg-icon>
            </span>
            <span @click="reSetClick(scope)" v-if="scope.row.relateName!==''">
              <svg-icon iconName="guanbi"></svg-icon>
            </span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <div style="text-align:center;margin-top:10px">
      <el-button @click="close">取消</el-button>
      <el-button @click="submit" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import SvgIcon from "~/components/common/svg-icon.vue";
import DataBox from "~/components/common/data-box.vue";
import { Emit } from "vue-property-decorator";
import { State } from "vuex-class";
import { AccImportExcelDataService } from "~/services/dataimp-service/acc-import-excel-data.service";
import FileUpload from "~/components/common/file-upload.vue";
@Component({
  components: {
    FileUpload,
    SvgIcon,
    DataBox
  }
})
export default class NewExcelTemplete extends Vue {
  @Dependencies(AccImportExcelDataService)
  private accImportExcelDataService: AccImportExcelDataService;
  private templatemode: any = {};
  private disabledInput: any = false;
  private flag: any = true;
  private options: Array<any> = [];
  private tableData: Array<any> = [];
  private fileList: any = [];
  private checkOptions: any = [];
  private optionAble: any = [];
  private submitLoading: Boolean = false;
  @State principalList: any;
  @Emit("success")
  success() {}
  @Emit("dialogOpen")
  dialogOpen(d, i, v) {}
  @Emit("close")
  close() {
    let form: any = this.$refs["data-form"];
    form.resetFields();
    if (this.flag) {
      let upload: any = this.$refs["upload_case_import"];
      upload.reset();
    }
    this.tableData = [];
  }
  @Emit("errMsg")
  errMsg(err) {}
  created() {
    this.templatemode = {
      templateName: "", // 模板名称
      rowNum: "1",
      colNum: "A",
      dataRowNum: "2",
      dataColNum: "A",
      principalName: "",
      id: " " // 模板ID
    };
  }
  refreshData(modifyData, data) {
    this.disabledInput = true;
    this.options = data;
    this.flag = false;
    this.tableData = modifyData.templateExcelInfoList;
    this.templatemode.templateName = modifyData.templateName;
    this.templatemode.principalName = modifyData.principalName;
    this.templatemode.clientId = modifyData.principalId;
    this.templatemode.rowNum = modifyData.titleRowNum;
    this.templatemode.colNum = modifyData.templateExcelInfoList
      ? modifyData.templateExcelInfoList[0].colNum
      : "";
    this.templatemode.dataRowNum = parseInt(modifyData.dataRowNum) + 1 + "";
    switch (modifyData.dataColNum) {
      case "1":
        this.templatemode.dataColNum = "A";
        break;
      case "2":
        this.templatemode.dataColNum = "B";
        break;
      case "3":
        this.templatemode.dataColNum = "C";
        break;
    }
    this.templatemode.id = modifyData.id;
  }
  /**
   *上传成功回调
   */
  onUploadSuccess(id, data) {
    this.accImportExcelDataService
      .importExcelTemplate({
        id: data.id,
        colNum: this.templatemode.colNum,
        rowNum: this.templatemode.rowNum
      })
      .subscribe(
        data => {
          data.map(v => {
            v.relateName = "";
          });
          this.tableData = data;
          this.$message.success("Excel导入成功");
          this.success();
          this.accImportExcelDataService.getExcelList().subscribe(
            data => {
              this.options = data;
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
        },
        err => {
          this.$message.error(err.msg);
        }
      );
  }
  /**
   * 查看映射字段
   */
  relateNameClick(scope) {
    let disabledStr = scope.store.table.data
      .filter(v => {
        return v.relateName !== "";
      })
      .map(item => {
        return item.relateName;
      });

    let rowData = scope.row;
    this.dialogOpen(this.options, rowData, disabledStr);
  }
  /**
   * 确定
   */
  submit() {
    this.updateOptionAble();
    let a = false;
    this.checkOptions.forEach(v => {
      // if (v.cellCode === "idCard") {
      //   a = true;
      //   this.$message("请选择身份证号码");
      // }
      // if (v.cellCode === "personalName") {
      //   a = true;
      //   this.$message("请选择客户姓名");
      // }
      // if (v.cellCode === 'overdueAmount') {
      //   a = true
      //   this.$message('请选择逾期总金额（元）')
      // }
    });
    if (a) {
      return;
    }
    let form: any = this.$refs["data-form"];
    form.validate(valid => {
      if (!valid) {
        return;
      }
      if (this.flag) {
        if (!this.fileList) {
          this.$message("请上传导入文件");
          return;
        }
        this.submitLoading = true;
        this.accImportExcelDataService
          .checkTemplateName({
            templateName: this.templatemode.templateName
          })
          .subscribe(
            data => {
              this.submitLoading = false;
              let createObj: any = {
                templateExcelInfoList: this.tableData,
                id: this.templatemode.id,
                templateName: this.templatemode.templateName,
                principalName: this.templatemode.principalName,
                colNum: this.templatemode.colNum,
                rowNum: this.templatemode.rowNum,
                titleRowNum: this.templatemode.rowNum,
                dataRowNum: this.templatemode.dataRowNum,
                dataColNum: this.templatemode.dataColNum
              };
              this.accImportExcelDataService
                .importExcelTemplateData(createObj)
                .subscribe(
                  data => {
                    this.$message({
                      type: "success",
                      message: "新增成功"
                    });
                    this.success();
                    this.close();
                  },
                  err => {
                    if (!err.object) {
                      this.$message({
                        type: "info",
                        message: "新增失败！Excel数据格式错误"
                      });
                      return;
                    }
                    this.errMsg(err.object);
                  }
                );
            },
            ({ msg }) => {
              this.submitLoading = false;
              this.$message({
                type: "error",
                message: msg
              });
            }
          );
      } else {
        let updateObj: any = {
          templateExcelInfoList: this.tableData,
          id: this.templatemode.id,
          templateName: this.templatemode.templateName,
          principalName: this.templatemode.principalName,
          colNum: this.templatemode.colNum,
          rowNum: this.templatemode.rowNum,
          titleRowNum: this.templatemode.rowNum,
          dataRowNum: this.templatemode.dataRowNum,
          dataColNum: this.templatemode.dataColNum
        };
        this.accImportExcelDataService
          .importExcelTemplateData(updateObj)
          .subscribe(
            data => {
              this.submitLoading = false;
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.success();
              this.close();
            },
            err => {
              this.submitLoading = false;
              if (!err.object) {
                this.$message({
                  type: "info",
                  message: "修改失败！Excel数据格式错误"
                });
                return;
              }
              this.errMsg(err.object);
            }
          );
      }
    });
  }
  updateOptionAble() {
    let Adata = this.tableData.map(v => v.relateName);
    let arr = this.options.filter(v => {
      let obj = Adata.find(val => {
        return v.cellCode === val;
      });
      return !obj;
    });
    this.checkOptions = arr;
    this.optionAble = arr;
  }
  transformRelateName(value) {
    if (value) {
      return this.options.find(v => v.cellCode === value)
        ? this.options.find(v => v.cellCode === value).cellName
        : "";
    } else {
      return "";
    }
  }
  reSetClick(scope) {
    scope.row.relateName = "";
  }
}
</script>
<style lang="less">
.component.new-excel-template {
  .file-upload .upload {
    display: flex;
    align-items: center;
  }
  .text-left {
    margin-left: -25px;
  }
  .el-upload-list {
    margin-top: 9px;
  }
}
</style>
