<template>
  <section class="component phone-info-area">
    <el-card>
      <div slot="header" class="row between-span middle-span" style="height:28px">
        <div>相关联系人</div>
        <div class="row end-span">
          <el-button @click="applyAssistClick" v-if="isApplay">申请协催</el-button>
          <el-button @click="RepairRecordClick">修复附件查看</el-button>
          <el-button @click="dialog.repairInformation = true">修复信息</el-button>
          <el-button @click="totalClick" v-if="!isCallCollectionType">一键群发短信</el-button>
          <!-- <el-button class="button" @click="checkRepairClick">绑定主叫号码</el-button> -->
          <el-button @click="dialog.circulation = true;">申请流转</el-button>
        </div>
      </div>
      <data-box :data="phoneData" @onPageChange="refreshData" ref="data-box" :height="230">
        <template slot="columns">
          <el-table-column prop="relation" label="关系" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <span>{{scope.row.relation | dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
           <el-table-column prop="detail" label="联系地址"  :min-width="$helper.getColumnWidth(5)" v-if="isCallCollectionType">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.detail&&scope.row.detail.length > 4" effect="dark" :content="scope.row.detail" placement="top-start">
                <el-button type="text" size="small" @click="showMap(scope)">{{scope.row.detail|ellipsis(8)}}</el-button>
              </el-tooltip>
              <el-button type="text" size="small" v-else @click="showMap(scope)">{{scope.row.detail}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" :min-width="$helper.getColumnWidth(4)" v-else>
            <template slot-scope="scope">
              <el-button type="text" @click="telClick(scope)">{{scope.row.phone}}</el-button>
            </template>
          </el-table-column>
            <el-table-column prop="status" label="地址状态"  :min-width="$helper.getColumnWidth(4)" v-if="isCallCollectionType">
            <template slot-scope="scope">
              <div id="selectBox">
                <el-select v-model="scope.row.status" placeholder="请选择" @change="addressStatusChange(scope)">
                  <el-option label="有效地址" :value="148"></el-option>
                  <el-option label="地址不存在" :value="149"></el-option>
                  <el-option label="无关地址" :value="150"></el-option>
                  <el-option label="已变卖" :value="151"></el-option>
                  <el-option label="出租" :value="152"></el-option>
                  <el-option label="空置" :value="153"></el-option>
                  <el-option label="未知" :value="154"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="phoneStatus" label="电话状态" :min-width="$helper.getColumnWidth(4)" v-else>
            <template slot-scope="scope">
              <div id="selectBox">
                <el-select v-model="scope.row.phoneStatus" placeholder="请选择" @change="StatusChange(scope)" class="small" :disabled="scope.row.phone===''">
                  <el-option label="正常" :value="64"></el-option>
                  <el-option label="空号" :value="65"></el-option>
                  <el-option label="停机" :value="66"></el-option>
                  <el-option label="关机" :value="67"></el-option>
                  <el-option label="未知" :value="68"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="地址类型" :min-width="$helper.getColumnWidth(4)" v-if="isCallCollectionType">
            <template slot-scope="scope">
              <span>{{scope.row.type | dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column label="电子邮件" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip v-if="!isCallCollectionType">
            <template slot-scope="scope">
              <span v-if="scope.row.mail===null">--</span>
              <span v-else>{{scope.row.mail}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="数据来源" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.source | dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <el-button type="text" @click="telClick(scope)" :disabled="scope.row.phone===null||scope.row.phone==='' || scope.row.phoneStatus===65" v-if="!isCallCollectionType">
                <svg-icon iconName="dianhua"></svg-icon>
              </el-button>
              <el-button type="text" @click="messageClick(scope)" :disabled="isDisabled(scope.row.phone,scope.row.phoneStatus)">
                <svg-icon iconName="duanxin"></svg-icon>
              </el-button>
              <el-button type="text" @click="emailClick(scope)" :disabled="scope.row.mail===null || isCallCollectionType">
                <svg-icon iconName="dianziyoujian"></svg-icon>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </data-box>
    </el-card>
    <!--申请协催-->
    <el-dialog title="申请协催" :visible.sync="dialog.disabled" @close="$refs['applay-assist'].reset()">
      <applay-assist @close="dialog.disabled=false" ref="applay-assist"></applay-assist>
    </el-dialog>
    <!--发送短信-->
    <el-dialog title="发送短信" :visible.sync="dialog.sendMessage" :close-on-click-modal="false" :close-on-press-escape="false" @open="getRow">
      <SendMessage ref="send" @errMessage="errMessageShow" @close="dialog.sendMessage=false"></SendMessage>
    </el-dialog>
    <!--发送短信-->
    <el-dialog title="短信群发" :visible.sync="dialog.totalMessage" :close-on-click-modal="false" :close-on-press-escape="false" @open="getRowGroup" @close="dialogClose">
      <SendGroupMessage ref="sendGroup" @errMessage="errMessageShow" @close="dialog.totalMessage=false" @refresh="refreshRecord"></SendGroupMessage>
    </el-dialog>
    <!--发送邮件-->
    <el-dialog title="发送邮件" :visible.sync="dialog.sendEmail" :close-on-click-modal="false" :close-on-press-escape="false" @open="getRowEmail">
      <SendEmail ref="sendEmail" @close="dialog.sendEmail=false"></SendEmail>
    </el-dialog>
    <!--修复信息-->
    <el-dialog title="修复信息" :visible.sync="dialog.repairInformation" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" style="width:1200px;margin:0 auto">
      <RepairInformation ref='mm' @close="dialog.repairInformation = false" @refresh="refresh"></RepairInformation>
    </el-dialog>
    <!--绑定主叫号码-->
    <el-dialog title="绑定主叫号码" :visible.sync="dialog.bindPhone" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" style="width:1200px;margin:0 auto">
      <BindPhone ref='bind-phone' @closetwo="dialog.bindPhone = false"></BindPhone>
    </el-dialog>
    <!--短信发送失败-->
    <el-dialog title="短信发送失败" :visible.sync="dialog.errMessageDialog" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <data-box :data="errorMessage" hiddenForm class="text-center" :maxHeight="260">
        <template slot="columns">
          <el-table-column prop="personalName" label="姓名" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="personalPhone" label="错误手机号码" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
        </template>
      </data-box>
    </el-dialog>
    <!--记事本-->
    <el-dialog :visible.sync="dialog.show" title="记事本" width="30%">
      <el-input type="textarea" :rows=10 placeholder="请输入内容" v-model="custTemplateContent"></el-input>
    </el-dialog>
     <!--申请流转-->
    <el-dialog title="申请流转" width="40%" :visible.sync="dialog.circulation" @close="$refs['applay-circulation'].reset()">
      <applay-circulation @close="dialog.circulation=false;refreshData();" ref="applay-circulation"></applay-circulation>
    </el-dialog>
    <!--百度地图弹出框-->
    <el-dialog  :visible.sync="dialog.addBaiduMap" title="位置信息" size="small"  :close-on-click-modal="false" :close-on-press-escape="false">
        <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo" style="height:450px">
        <el-amap-marker v-for="(marker, i) in markers" :key="'a'+i" :content="marker.content" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
        <el-amap-info-window v-for="(window,i) in windows" :key="'b'+i" :position="window.position" :content="window.content" :visible="window.visible" :events="window.events"></el-amap-info-window>
      </el-amap>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import { State, Mutation, namespace } from "vuex-class";
import { Layout, Dependencies } from "~/core/decorator";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { CaseRepairService } from "~/services/business-service/case-repair.service";
import { AccVisitPoolService } from "~/services/business-service/acc-visit-pool.service";
import { CoordinateService } from "~/utils/coordinate.service";
import { PersonalService } from "~/services/business-service/personal.service";

import { SmaService } from "~/services/common-service/sma.service";
import { CommonService } from "~/utils/common.service";
import { Watch } from "vue-property-decorator";
import SvgIcon from "~/components/common/svg-icon.vue";
import ApplayAssist from "~/components/acc-manage/case-info-area/applay-assist.vue";
import ApplayCirculation from "~/components/acc-manage/case-info-area/applay-circulation.vue";
import SendMessage from "~/components/acc-manage/send-message.vue";
import SendEmail from "~/components/acc-manage/send-email.vue";
import SendGroupMessage from "~/components/acc-manage/send-group-message.vue";
import RepairInformation from "~/components/acc-manage/repair-information.vue";
import BindPhone from "~/components/system-manage/message-push/bind-phone.vue";
import { caseType, followType, sourceType } from "~/config/enum.config";

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataBox,
    SvgIcon,
    SendMessage,
    SendGroupMessage,
    RepairInformation,
    BindPhone,
    SendEmail,
    ApplayAssist,
    ApplayCirculation
  }
})
export default class PhoneInfoArea extends Vue {
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(CaseRepairService) private caseRepairService: CaseRepairService;
  @Dependencies(AccVisitPoolService)
  private accVisitPoolService: AccVisitPoolService;
  @Dependencies(PersonalService) private personalService: PersonalService;

  @Dependencies(SmaService) private smaService: SmaService;
  @State userData;
  @accManageModule.State caseInfo;
  @accManageModule.State callerInfo;
  @accManageModule.State caseId;
  @accManageModule.State caseType;
  @accManageModule.State taskId;
  @accManageModule.State caller;
  @accManageModule.State caseRepairId;
  @accManageModule.State callInfo;
  @accManageModule.Mutation updateFollRecord;
  @accManageModule.Mutation updateCallInfo;
  @accManageModule.Mutation updateCurrentBusinessTabName;
  @accManageModule.State searchModel;

  private phoneData: any = null;
  private errorMessage: any = [];
  private rowData: any = {};
  private form: any = {};
  private callType: any = "";
  private telData: any = {};
  private custTemplateContent: any = "";
  private center: any = [0, 0];
  private windows: any = [];
  private markers: any = [];
  private zoom: any = 14;
  private detail: any = "";
  private dialog: any = {
    disabled: false,
    sendMessage: false,
    repairInformation: false,
    totalMessage: false,
    errMessageDialog: false,
    bindPhone: false,
    show: false,
    sendEmail: false,
    circulation: false,
    addBaiduMap: false
  };
  private type: any = "";
  /**
   * 申请协催是否显示
   */
  private isApplay: boolean = false;
  private isApplayPage: Array<any> = [
    "call-case",
    "wait-collection",
    "in-the-collection",
    "return-c-case",
    "repayment-review"
  ];
  mounted() {
    this.refreshData();
    this.isApplayPage.forEach((value, index, array) => {
      if (this.$store.state.workspace.currentTab === `/call-acc/${value}`) {
        this.isApplay = true;
        return;
      }
    });
  }
  refresh() {
    this.refreshData();
    // this.$emit("refreshTotal");
  }

  @Watch("caseInfo")
  @Watch("caseId")
  onCaseIdChange() {
    this.refreshData();
  }
  refreshData() {
    let getPhoneData: any = {
      personalId: this.caseInfo.personalInfo
        ? this.caseInfo.personalInfo.id
        : "",
      type: 1
    };
    if (this.isCallCollectionType) {
      //外访、协催
      this.accVisitPoolService.getVisitPersonalAddress(getPhoneData).subscribe(
        data => {
          this.phoneData = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
    } else {
      //电催及其他
      this.accTelPoolService.getTelPersonalContact(getPhoneData).subscribe(
        data => {
          this.phoneData = data.content;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
    }
  }
  /**
   * 申请协催
   */
  applyAssistClick() {
    this.dialog.disabled = true;
  }
  checkCall(code) {
    this.smaService.checkCall({ companyCode: code }).subscribe(
      data => {
        if (data.value === "163") {
          // erpv3
          this.callType = data.value;
          this.telData = {
            taskId: this.taskId,
            customer: this.userData.id,
            callee: this.form.phone,
            caller: this.caller,
            companyCode: this.userData.companyCode
          };
        } else if (data.value === "165") {
          // this.smaService.signIn(this.userData).subscribe(() => {
            // this.telData = {
            //   taskId: this.taskId,
            //   customer: this.userData.id,
            //   callee: this.form.phone,
            //   caller: this.caller,
            //   companyCode: this.userData.companyCode
            // };
            this.smaService.callByPhoneNum({phoneNum: this.form.phone}).subscribe(
              data => {
                let taskId = data
                this.$message.success("拨号成功");
                this.updateCurrentBusinessTabName("follow-record");
                this.updateCallInfo({
                  follRelation: this.rowData.relation,
                  follName: this.rowData.name,
                  follPhone: this.rowData.phone,
                  taskId: taskId
                });
                },
              ({ msg }) => {
                this.$message.error(msg);
              }
            );
          // });
        }
        this.smaService.callByPhoneNum({phoneNum: this.form.phone}).subscribe(
          data => {
            this.$message.success("拨号成功");
            this.updateCurrentBusinessTabName("follow-record");
            if(data) {
               this.updateCallInfo({
                follRelation: this.rowData.relation,
                follName: this.rowData.name,
                follPhone: this.rowData.phone,
                taskId: data
              });
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 邮件
   */
  emailClick(scope) {
    this.dialog.sendEmail = true;
    this.rowData = scope.row;
  }
  getRowEmail() {
    this.$nextTick(() => {
      document.documentElement.style.overflow = "hidden";
      let messageSend: any = this.$refs["sendEmail"];
      messageSend.refreshData(this.rowData);
    });
  }
  /**
   * 电话
   */
  telClick(scope) {
    if (this.taskId === "") {
      this.$message("请绑定坐席号！");
    } else {
      this.rowData = scope.row;
      this.form.phone = scope.row.phone;
      this.checkCall(this.caseInfo.companyCode);
      this.updateFollRecord(scope.row);
    }
  }
  /**
   * 修复附件查看
   */
  RepairRecordClick() {
    this.caseRepairService
      .viewCaseRepair({
        id: this.caseInfo.id
      })
      .subscribe(
        data => {
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              CommonService.downloadFile(data[i].fileUrl, "修复附件");
            }
          } else {
            this.$message.info("该案件暂无修复信息");
          }
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 短信
   */
  messageClick(scope) {
    // if (this.typeId !== 99 && this.handleId !== '24') {
    //   this.templateClass = ''
    //   this.templateVal = ''
    //   this.templateContent = ''
    //   this.$store.commit('updateMessageInfo', [scope.row])
    //   this.sendMessage = true
    // } else {
    //   return false
    // }
    this.dialog.sendMessage = true;
    this.rowData = scope.row;
  }
  /**
   * 电话状态更改
   */
  StatusChange(scope) {
    let phoneStatusChange: any = {
      personalContactId: scope.row.id,
      phoneStatus: scope.row.phoneStatus
    };
    this.accTelPoolService.modifyPhoneStatus(phoneStatusChange).subscribe(
      data => {},
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 绑定主叫号码
   */
  checkRepairClick() {
    this.dialog.bindPhone = true;
  }
  /**
   * 获取列表当前行数据（点击短信）
   */
  getRow() {
    this.$nextTick(() => {
      document.documentElement.style.overflow = "hidden";
      let messageSend: any = this.$refs["send"];
      messageSend.refreshData(this.rowData);
    });
  }
  getRowGroup() {
    this.$nextTick(() => {
      document.documentElement.style.overflow = "hidden";
      let messageSend: any = this.$refs["sendGroup"];
      messageSend.refreshData();
    });
  }
  errMessageShow(data) {
    this.dialog.errMessageDialog = true;
    this.errorMessage = data;
  }
  /**
   * 刷新发信信息记录
   */
  refreshRecord() {
    this.$emit("mesRecordRefresh");
  }
  dialogClose() {
    document.documentElement.style.overflow = "auto";
  }
  /**
   * 一键群发短信
   */
  totalClick() {
    this.dialog.totalMessage = true;
  }
  /**
   * 获取是否外访、协催类型
   */
  get isCallCollectionType() {
    return (
      this.searchModel.collectionType === caseType.visit ||
      this.searchModel.collectionType === caseType.assist
    );
  }
  /**
   * 打开百度地图
   */
  showMap(scope) {
    this.personalService.getMapInfo(scope.row.detail).subscribe(
      data => {
        if (!data) {
          this.$message.error("没有找到位置信息");
          return;
        }
        this.dialog.addBaiduMap = true;
        let adds: any = CoordinateService.convert({
          origin: "bd",
          data: { lat: data.latitude, lng: data.longitude },
          target: "gcj"
        });
        let self: any = this;
        this.windows.push({
          position: [adds.lon, adds.lat],
          content: data.detail,
          visible: true,
          events: {
            close() {}
          }
        });
        this.markers.push({
          position: [adds.lon, adds.lat],
          events: {
            click() {
              self.windows.forEach(window => {
                window.visible = false;
              });
              self.$nextTick(() => {
                self.windows[0].visible = true;
              });
            }
          }
        });
        this.center = [parseFloat(adds.lon), parseFloat(adds.lat)];
      },
      ({ msg }) => this.$message.error(msg)
    );
  }
  /**
   * 更新地址状态
   */
  addressStatusChange(scope) {
    this.accVisitPoolService
      .modifyAddressStatus({
        personalAddressId: scope.row.id,
        addressStatus: scope.row.status
      })
      .subscribe(
        data => {},
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  isDisabled(phone,phoneStatus){
    if(phone===null||phone==='' || this.isCallCollectionType || phoneStatus===65){
      return true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
