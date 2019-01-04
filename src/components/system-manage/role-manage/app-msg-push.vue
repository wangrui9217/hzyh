<template>
  <section class="component add-role">
    <el-form :model="pushModel" ref="pushform" label-width="90px" class="demo-ruleForm" v-loading="loading.state">
      <el-form-item label="消息标题" prop="title" align="left">
        <el-input v-model="pushModel.title" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-col :span="18">
          <el-input type="textarea" v-model="pushModel.content" :rows="3" :maxlength="500"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px" align="center">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="pushCommit" :loading="submitLoading">确定</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import { AppMsgService } from "~/services/business-service/app-msg.service";
import { Emit, Prop } from "vue-property-decorator";
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class AppMsgPush extends Vue {
  @Dependencies(AppMsgService) private AppMsgService: AppMsgService;
  @Emit('refreshList')
  refreshList() { }
  @Prop() currItem: any;


  private pushModel: any = {
    title: '',
    content: '',
    userId: '',
    userName: '',
    appmsgNoRead: '1'
  }
  props: ['currItem']

  private loading: any = {
    state: false
  };
  private submitLoading: Boolean = false;
  /**
   * 取消
   */
  cancel() {
    this.$emit('close')
    // 重置form表单
    let pushform: any = this.$refs['pushform']
    pushform.resetFields()
  }
  /**
   * 确定
   */
  pushCommit() {
    let pushform: any = this.$refs['pushform']
    pushform.validate((valid) => {
      if (!valid) return false
      this.pushModel.userId = this.currItem.id
      this.pushModel.userName = this.currItem.userName
    })
    this.submitLoading = true;
    // 提交保存
    this.AppMsgService
      .saveAppmsg(this.pushModel)
      .subscribe(data => {
        this.submitLoading = false;
        this.$message.success('推送成功!')
        this.$emit('close')
        this.refreshList()
        let pushform: any = this.$refs['pushform']
        pushform.resetFields()
      }, ({ msg }) => {
        this.submitLoading = false;
        this.$message.error = msg;
      })
  }
}
</script>

<style scoped>

</style>
