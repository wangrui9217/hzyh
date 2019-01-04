<template>
  <section class="component ag-distribution">
    <el-form class="text-left" style="margin-left:40px" ref="form" :model="params" :rules="paramsRules" label-width="100px">
      <el-form-item label="分配位置" prop="type">
        <el-radio-group v-model="params.type">
          <el-radio :label="0">内催案件池</el-radio>
          <el-radio :label="1">委外案件池</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择结案日期" prop="closeDate">
        <el-date-picker v-model="params.closeDate" type="date" :picker-options="pickerOptions" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button @click="onClose">取消</el-button>
      <el-button @click="submit" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Prop, Emit } from "vue-property-decorator";
import { State } from "vuex-class";
import { CaseReturnService } from "~/services/business-service/case-return.service";
import clone from "clone";

@Component({
  components: {}
})
export default class AgDistribution extends Vue {
  @Dependencies(CaseReturnService) private caseReturnService: CaseReturnService;
  @Prop() selectionList: any

  @Emit('close')
  onClose(){
    this.form.resetFields()
  }

  @Emit('success')
  onSuccess() {
    this.$message.success('分配成功')
    this.form.resetFields()
  }


  private params: any = {}
  private paramsRules: any = {}
  private form: any = {};
  private submitLoading: Boolean = false;

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7
    }
  }

  created() {
    this.paramsRules = {
      type: { type: 'number', required: true, message: '请选择分配位置', tirgger: 'blur' },
      closeDate: { type: 'date', required: true, message: '请选择结案日期', tirgger: 'blur' }
    }
    this.params = {
      closeDate: '',
      type: ''
    }
  }

  mounted() {
    this.form = this.$refs['form']
  }

  /**
   * 确定
   */
  submit() {
    (this.$refs.form as any).validate(v => {
      if (!v) { return }
      this.submitLoading = true;
      let paramData: any = Object.assign(this.params, { ids: this.selectionList.map(v => v.id) })

      this.caseReturnService
        .reDisRecoverCase(paramData)
        .subscribe(
          data => {
            this.submitLoading = false;
            this.onSuccess()
          },
          err => {
            this.submitLoading = false;
            this.$message.error(err.msg)
          }
        )
    })
  }
}
</script>

<style scoped>

</style>
