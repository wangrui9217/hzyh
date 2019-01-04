<template>
  <section class="component contact-record-info">
    <span style="color:black">通讯录</span>
    <data-box :data="contactrecordinfoDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="mobileNo" label="联系电话" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="numberAffiliation" label="归属地"  :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="netFlag" label="互联网标识" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="callerCount" label="主叫次数" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="callerTime" label="主叫时长" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="callerCount" label="被叫次数" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column prop="calledTime" label="被叫时长" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {
    Layout,
    Dependencies
  } from "~/core/decorator";
  import {
    PageService
  } from "~/utils/page.service";
  import {
    State,
    Mutation,
    namespace
  } from "vuex-class";
  import {
    PersonalService
  } from "~/services/business-service/personal.service";
  import DataForm from "~/components/common/data-form.vue";
  import DataBox from "~/components/common/data-box.vue";
  import clone from "clone"
  const accManageModule = namespace("acc-manage");

  @Layout("workspace")
  @Component({
    components: {
      DataForm,
      DataBox
    }
  })
  export default class ContactRecordInfo extends Vue {
    @accManageModule.State caseInfo;
    @Dependencies(PageService) private pageService: PageService;
    @Dependencies(PersonalService) private personalService: PersonalService;
    private contactrecordinfoDataSet: any = [];

    mounted() {
      this.refreshData()
    }
    refreshData() {
      // let Model: any = {
      //   personalId: this.caseInfo.personalInfo.id
      // }
      // this.personalService
      //   .getPersonalPhones(Model, this.pageService)
      //   .subscribe(
      //     data => {
      //       this.contactrecordinfoDataSet = data;
      //     },
      //     ({
      //       msg
      //     }) => {
      //       this.$message.error(msg);
      //     }
      //   );
    }
  }

</script>

<style lang="less" scoped>


</style>
