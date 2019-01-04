<template>
  <section class="component base-info-area">
    <!-- <case-info-area></case-info-area> -->
    <el-row>
      <el-col style="width:60%;">
        <phone-info-area @refreshTotal="$refs['address-info-area'].refreshData()"></phone-info-area>
      </el-col>
      <el-col style="width:39%;margin-left:0.5%;">
        <!-- <address-info-area ref="address-info-area"></address-info-area> -->
        <late-message></late-message>
      </el-col>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout } from "~/core/decorator";
// import CaseInfoArea from "~/components/acc-manage/base-info-area/case-info-area.vue";
import LateMessage from "~/components/acc-manage/base-info-area/late-message.vue";
import PhoneInfoArea from "~/components/acc-manage/base-info-area/phone-info-area.vue";
import AddressInfoArea from "~/components/acc-manage/base-info-area/address-info-area.vue";

@Component({
  components: {
    // CaseInfoArea,
    LateMessage,
    PhoneInfoArea,
    AddressInfoArea
  }
})
export default class BaseInfoArea extends Vue {

}
</script>

<style lang="less" scoped>
</style>
