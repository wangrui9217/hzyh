<template>
  <section class="component letter-preview">
    <div id="LetterPage" style="text-align:left">
      <div v-html="previewContent"></div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  Auth,
  Layout,
  Dependencies
} from "~/core/decorator";
import {
  Prop
} from "vue-property-decorator";
@Component({
  components: {}
})
export default class LetterPreview extends Vue {
  private messageContent: any = null;
  @Prop() previewContent;
  refreshTemp(v) {
  }
}

</script>
<style lang="less" scoped>
#LetterPage {
  border: solid 1px gray;
  padding: 50px 20px; // margin: 20px 15%;
  height: 297mm;
  width: 210mm;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
}
</style>
