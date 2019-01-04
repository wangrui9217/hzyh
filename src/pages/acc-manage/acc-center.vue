 <template>
  <section class="page acc-center">
    <div class="acc-center-header">
        <div class="top_content">
          <div class="row middle-span case-count">
            <svg-icon iconName="message" iconSize="32"></svg-icon>
          <div>
            本案有{{commonCaseCount}}条共债案件，
          </div>
          <a @click="openDebtCaseList" style="cursor: pointer">点此查看</a>
        </div>
        <div style="margin-right: 25px;">
          <el-button @click="$router.back()">
            返回列表
          </el-button>
        </div>
      </div>
       <div class="buttom_content">
          <div style="color:rgb(191, 64, 64);font-size:16px;">{{caseInfo.personalInfo.name}}</div>
          <div >{{caseInfo.personalInfo.sex | dictConvert('0033')}}</div>
          <div >{{caseInfo.personalInfo.age}}</div>
          <div>
            <svg-icon class="svg-icon" iconName="home" :iconSize="16"></svg-icon>
            {{caseInfo.personalInfo.idCardAddress?caseInfo.personalInfo.idCardAddress :caseInfo.personalInfo.localHomeAddress}}
          </div>
          <div>
              <svg-icon class="svg-icon" iconName="kehujibenxinxi" :iconSize="16"></svg-icon>
            {{caseInfo.personalInfo.idCard}}
          </div>
          <div>
              <svg-icon class="svg-icon" iconName="diancui" :iconSize="16"></svg-icon>
            {{caseInfo.personalInfo.mobileNo}}
          </div>
          <div>
              <svg-icon class="svg-icon" iconName="shenqinghao" :iconSize="16"></svg-icon>
            {{caseInfo.caseNumber}}
          </div>
          <div>
            {{caseInfo.personalInfo.education | dictConvert}}
          </div>
          <div>
            <el-button @click="dialog.casedetailsdialog = true" type="text">案件详情</el-button>
          </div>
      </div>
    </div>
    <div class="acc-center-body">
      <transition>
        <keep-alive>
          <component :is="currentDisplayAreaName"></component>
        </keep-alive>
      </transition>
      <business-info-area></business-info-area>
    </div>
    <div class="case-list-container row nowrap">
      <div class="row middle-span" @click="showCaseList=!showCaseList">
        <svg-icon iconName="rightmore" :class="[showCaseList ? 'arrow-right':'arrow-left']"></svg-icon>
      </div>
      <div>
        <case-list v-show="showCaseList"></case-list>
      </div>
    </div>
    <el-dialog :visible.sync="dialog.commonCaseList" title="共债案件" width="80%">
      <common-case-list></common-case-list>
    </el-dialog>
    <el-dialog title="案件详情" :visible.sync="dialog.casedetailsdialog" width="100%" fullscreen>
        <case-detail :caseId="caseId" :needRequest="false" :caseNumber="caseInfo.caseNumber"></case-detail>
     </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { State, Mutation, namespace } from "vuex-class";
import { Watch, Prop, Emit } from "vue-property-decorator";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { SmaService } from "~/services/common-service/sma.service";
import SvgIcon from "~/components/common/svg-icon.vue";
import BaseInfoArea from "~/components/acc-manage/base-info-area.vue";
import BusinessInfoArea from "~/components/acc-manage/business-info-area.vue";
import ContactInfoArea from "~/components/acc-manage/contact-info-area.vue";
import CaseList from "~/components/acc-manage/case-list.vue";
import CommonCaseList from "~/components/acc-manage/common-case-list.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";

const accManageModule = namespace("acc-manage");

@Layout("default")
@Component({
  components: {
    SvgIcon,
    BaseInfoArea,
    ContactInfoArea,
    BusinessInfoArea,
    CaseList,
    CommonCaseList,
    CaseDetail
  }
})
export default class AccCenter extends Vue {
  @Dependencies(SmaService) private smaService: SmaService;
  @accManageModule.State caseId;
  @accManageModule.Mutation updateCaseInfo;
  @accManageModule.Mutation updateTaskId;
  @accManageModule.Mutation updateCaller;
  @accManageModule.State currentDisplayAreaName;
  @accManageModule.State commonCaseCount;
  @accManageModule.State caseInfo;

  private showCaseList = false;
  private dialog = {
    commonCaseList: false,
    casedetailsdialog: false //案件详情
  };
  openDebtCaseList() {
    this.dialog.commonCaseList = true;
  }
  mounted() {
    this.smaService.validateTaskIdInEmpId().subscribe(
      data => {
        this.updateTaskId(data.taskId);
        if (data.caller === null) {
          data.caller = "";
        }
        this.updateCaller(data.caller);
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  console.log(this.caseInfo,"caseInfo")

  }
}
</script>

<style lang="less" scoped>
.page.acc-center {
  overflow-x:hidden;
  .acc-center-header {
    margin-left: 36px;
    margin-right: 19px;
    background: rgb(74, 89, 109);
    color: #fff;
    height: 114px;
    .case-count {
      font-size: 12px;
      font-weight: 200;
    }
    .top_content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      padding: 0 10px;
    }
    .buttom_content {
      height: 50px;
      background: rgb(255, 255, 255);
      color: rgb(136, 136, 136);
      padding: 0 10px;
      border: 1px solid rgb(235, 238, 245);
      border-top: 0;
      display: flex;
      align-items: center;
      font-size: 12px;
      div {
        margin-left: 20px;
      }
    }
  }
  .acc-center-body {
    padding: 10px;
    margin-left: 25px;
    margin-right: 5px;
  }
  .case-list-container {
    top: 0;
    bottom: 0;
    position: fixed;
    right: 0;
    height: 100%;
    z-index: 99;
    background-color: #fff;
  }
  .arrow-right {
    transform: rotate(0deg);
    transition: transform ease-in 0.2s;
  }
  .arrow-left {
    transform: rotate(180deg);
    transition: transform ease-in 0.2s;
  }
  .open {
    max-width: auto;
    overflow: hidden;
  }
  .close {
    max-width: 0;
    min-width: 0;
    overflow: hidden;
  }
}
</style>
