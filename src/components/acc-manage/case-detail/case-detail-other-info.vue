<template>
  <section class="component case-detail-other-info">
    <iframe v-if="showIframe" frameborder="0" width="100%" height="750px" ref="test" :src="attachUrl" @load="onFrameLoad"></iframe>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch, Prop } from "vue-property-decorator";
import { Base64 } from "js-base64";
import app from "~/config/app.config";
@Component({
  components: {}
})
export default class CaseDetailOtherInfo extends Vue {
  @Prop() orderId;
  @Prop() activeName;
  @Watch("activeName")
  onActiveNameChange(value) {
    if (value === "attach-info") {
      this.showIframe = true
    }
  }

  /**
   * 刷新支付信息列表
   */
  @Watch("orderId")
  onOrderIdChange() {
    this.showIframe = false;
  }

  private attachBaseUrl = app.url.attach + "/erpv3_client/acc/Pangolin/toAccCrmOrderDetailed.html?data=";
  private showIframe = false;

  get attachUrl() {
    let dataStr = JSON.stringify({
      receivableType: "1",
      orderNumber: this.orderId
    });
    return this.attachBaseUrl + Base64.encode(dataStr);
  }

  onFrameLoad() { }

  mounted() {
    // paramJson.put("receivableType", "2");
    // paramJson.put("orderNumber", "06071700091131");
  }
}
</script>

<style lang="less" scoped>

</style>
