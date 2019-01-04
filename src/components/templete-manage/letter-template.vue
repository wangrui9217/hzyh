<template>
  <section class="component letter-template">
    <el-form :model="letterModel" ref="letter-form" label-width="120px" class="text-left">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设为默认模板">
            <el-checkbox v-model="letterModel.isDefault" @change="setEnable"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态:">
            <el-select v-model.number="letterModel.templateStatus" style="float:left">
              <el-option :value="0" label="启用"></el-option>
              <el-option :value="1" label="停用"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板编号:" prop="templateCode">
            <el-input v-model="letterModel.templateCode" placeholder="A001"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信函模板名称:" prop="templateName">
            <el-input v-model="letterModel.templateName" placeholder="请输入信函模板名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="配置参数">
            <el-select v-model="selectedKey">
              <el-option v-for="{name,value} in KeyResource" :key="value" :value="name" :label="name">
              </el-option>
            </el-select>
            <el-tooltip class="item" content="选择的参数将插入到下方的文本编辑区域中">
              <el-button @click="insertToTextArea">插入</el-button>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="24" id="editor-row">
          <div id="editor-container">
            <quill-editor ref="editor" v-model="Content" :options="editorOption">
            </quill-editor>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:center;margin-top:10px">
      <el-button @click="submit" :loading="submitLoading">保存</el-button>
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
import { templateVarType } from "~/config/enum.config";
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

@Component({
  components: {}
})
export default class LetterTemplete extends Vue {
  @Dependencies(TemplateService) private templateService: TemplateService;
  @Emit("close")
  close() {
    let letterFrom: any = this.$refs['letter-form'];
    letterFrom.resetFields()
    this.letterModel.isDefault = false;
  }
  @Emit("success")
  success() { }
  private letterModel: any = {};
  private defaultFlag: any = false;
  private isModify: any = false;
  private selectedKey: any = '';
  private KeyResource: any = templateVarType;
  private editorOption: any = {};
  private Content: any = '';
  created() {
    this.letterModel = {
      id: '',
      templateCode: '', // 模版编号
      isDefault: false, // 是否默认模版
      templateType: '107', // 催收类型
      templateName: '', // 模版名称
      templateStatus: 0, // 模版状态
      messageContent: '', // 模版内容
      templateStyle: '104' // 信函模板
    }
    this.editorOption = {
      placeholder: '请输入文本',
      // 配置各个模块
      modules: {
        // 配置工具栏的内容
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{
            'list': 'ordered'
          }, {
            'list': 'bullet'
          }, {
            'list': 'check'
          }],
          [{
            'header': [1, 2, 3, 4, 5, 6, false]
          }],
          [{
            'color': []
          }, {
            'background': []
          }],
          [{
            'font': []
          }],
          [{
            'align': []
          }],
          ['clean']
        ]
      }
    }
  }
  private submitLoading: Boolean = false;
  mounted() {

  }
  /**
   * 提交
   */
  submit() {
    if (this.Content === '') {
      this.$message({
        type: 'info',
        message: '模板内容不能为空!'
      })
      return
    }
    this.formatContent(0)
    
    this.templateService.getTemplateByNameOrCode(this.letterModel).subscribe(data => {
      let letterFrom: any = this.$refs['letter-form'];
      letterFrom.validate(valid => {
        if (!valid) {
          return
        }
        if (this.letterModel.isDefault && this.letterModel.templateStatus === 1) {
          this.$message({
            type: 'info',
            message: '默认模板不可设为停用!'
          })
          return
        }
        if (this.isModify) {
          this.submitLoading = true;
          this.updateTemplate()
        } else {
          this.submitLoading = true;
          this.addTemplate()
        }
      })
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      })
  }
  /**
   * 插入选中的参数到富文本光标所在之处
   */
  insertToTextArea() {
    if (this.selectedKey === '') {
      return
    }
    let editor: any = this.$refs['editor'];
    let quill = editor.quill;
    quill.focus()
    let selection = quill.getSelection()
    let insertKey = '[' + this.selectedKey + ']'
    if (selection.length > 0) {
      // 如果是选中模式需要先删除原有数据
      quill.deleteText(selection.index, selection.length)
    }
    quill.insertText(selection.index, insertKey)
    quill.setSelection(selection.index + insertKey.length, 0)
  }
  /*
   * 格式化富文本内容
   * mode: 0 代表将富文本内容中的参数转换为字段
   *       1 代表将富文本中的字段转为可阅读参数名称
   */
  formatContent(mode) {
    let message = ''
    let regex: any = ''
    if (mode === 0) {
      message = this.Content
      this.KeyResource.map((obj) => {
        // 0 替换为Value
        regex = new RegExp('\\[\\' + obj.name + '?\\]', 'g')
        message = message.replace(regex, obj.value)
      })
      // 先替换\t
      regex = new RegExp('\\t{1}', 'g')
      message = message.replace(regex, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
      // 然后替换\s [空格]
      regex = new RegExp('\\s{2}?', 'g')
      message = message.replace(regex, '&nbsp;&nbsp;')
      this.letterModel.messageContent = message
    } else {
      message = this.letterModel.messageContent
      // 1 替换为name
      this.KeyResource.map((obj) => {
        regex = new RegExp('\\' + obj.value + '?', 'g')
        message = message.replace(regex, '[' + obj.name + ']')
      })
      this.Content = message
    }
  }
  setEnable() {
    if (this.letterModel.isDefault) {
      this.letterModel.templateStatus = 0
    }
  }
  /**
   * 新增模板
   */
  addTemplate() {
    this.templateService.createTemplate(this.letterModel).subscribe(data => {
      this.submitLoading = false;
      this.$message({
        type: 'success',
        message: '新增模版成功!'
      })
      this.success()
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
    this.templateService.updateTemplate(this.letterModel).subscribe(data => {
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
   * 修改数据获取
   */
  updateData(data) {
    this.isModify = true
    this.defaultFlag = data.isDefault
    this.letterModel = Object.assign({}, data)
    this.formatContent(1) // 内容格式转换
  }
}

</script>
<style scoped>
#editor-row {
  height: 380px;
}

#editor-container {
  margin-left: 30px;
}

.quill-editor {
  height: 300px;
}
</style>
