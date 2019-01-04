<template>
  <section class="component contact-info-area">
    <div class="row end-span">
      <el-button @click="updateCurrentDisplayAreaName('base-info-area')">返回</el-button>
    </div>
    <el-card>
      <el-row>
        <el-col :span="16">
          <contact-base-info></contact-base-info>
        </el-col>
        <el-col :span="8">
          <contact-record-info></contact-record-info>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import ContactBaseInfo from "~/components/acc-manage/contact-info/contact-base-info.vue";
import ContactRecordInfo from "~/components/acc-manage/contact-info/contact-record-info.vue";
import { Mutation, namespace } from "vuex-class";

const accManageModule = namespace("acc-manage");
@Layout("workspace")
@Component({
  components: {
    ContactBaseInfo,
    ContactRecordInfo
  }
})
export default class ContactInfoArea extends Vue {
  @accManageModule.Mutation updateCurrentDisplayAreaName;
}
</script>

<style lang="less" scoped>

</style>
