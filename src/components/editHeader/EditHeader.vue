<template>
    <div class="edit-header">
        <el-form :inline="false" class="demo-form-inline">
            <el-row class="page_headers">
                <el-col :span="6"><h3>{{pageTitle}}</h3></el-col>
                <el-col :span="12" :offset="6">
                    <div class="text-right btn_group">
                        <el-button type="success" @click="subimtAct(1)">正式发布</el-button>
                        <el-button type="success" @click="internalSend()">内网发布</el-button>
                        <el-button type="info" @click="subimtAct(2)"  v-if="ButConf.hasOwnProperty('copyBut') && ButConf['copyBut'] ==1">复制配置</el-button>
                        <el-button type="warning" @click="subimtAct(3)" v-if="ButConf.hasOwnProperty('syncBut') && ButConf['syncBut'] ==1">同步配置</el-button>
                        <el-button type="danger" @click="_lockAll">锁定</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-divider></el-divider>
        </el-form>
        <el-dialog :title="dialog_title" :visible.sync="popVisble" :width="dialog_width" :append-to-body="false" :close-on-click-modal="false">
            <section v-show="actionType == 1" class="publish">
                <el-form :inline="true" class="demo-form-inline" label-position="right" label-width="80px">
                    <el-form-item label="审批人：">
                        <el-select v-model="approverId" filterable placeholder="请选择">
                            <el-option
                            v-for="item in Approvers"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="success" @click="sendMsg()">确定</el-button>
                    </el-form-item>
                </el-form>
                <div class="diff_title">老代码</div>
                <div class="diff_title">新代码</div>
                <vue-code-diff :old-string="oldStr" :new-string="newStr" outputFormat="side-by-side" :context="100" />
            </section>
            <section v-show="actionType == 2" class="publish">
                <el-form :inline="false" class="demo-form-inline" label-position="right" label-width="80px">
                    <el-form-item label="原渠道："  v-show="channelVisble">
                        <el-select v-model="channelId" filterable placeholder="请选择">
                            <el-option
                            v-for="item in channels"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="TO渠道：" v-show="channelVisble">
                        <el-select v-model="newChannelId" filterable placeholder="请选择">
                            <el-option
                            v-for="item in channels"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="原地区：" v-show="areaVisble">
                        <area-select :isMultiple="area_multiple" :has_area="isHasArea" @areaValue="selectArea"></area-select>
                    </el-form-item>
                     <el-form-item label="TO地区：" v-show="areaVisble">
                        <area-select :isMultiple="area_multiple" :has_area="isHasArea" @areaValue="selectAreaNew"></area-select>
                    </el-form-item>
                    <el-form-item label="原环境：">
                        <el-select v-model="envId" filterable placeholder="请选择">
                            <el-option
                            v-for="item in envConf"
                            :key="item.env"
                            :label="item.label"
                            :value="item.env"
                            :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="success" @click="copyConf()">确认复制</el-button>
                    </el-form-item>
                </el-form>
            </section>
            <section v-show="actionType == 3" class="publish">
                <el-form :inline="true" class="demo-form-inline" label-position="right" label-width="80px">
                    <el-form-item label="渠道：" v-show="channelVisble">
                        <el-select v-model="channelId" filterable placeholder="请选择">
                            <el-option
                            v-for="item in channels"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="地区：" v-show="areaVisble">
                            <area-select :isMultiple="area_multiple" :has_area="isHasArea" @areaValue="selectAreaNew"></area-select>
                          </el-form-item>
                    <el-form-item >
                        <el-button type="success" @click="syncConf()">确认同步</el-button>
                    </el-form-item>
                     </el-form>
                    <div class="diff_title">老代码</div>
                    <div class="diff_title">新代码(当前配置中心配置)</div>
                    <vue-code-diff :old-string="syncoldStr" :new-string="syncnewStr" outputFormat="side-by-side" :context="100" />

            </section>
        </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import vueCodeDiff from 'vue-code-diff';
import { revoke } from '@/api/getApi';
import { getStorageData } from '@/utils/auth';
import { AreaSelect } from '@/components/areaselect';
export default {
    components: { vueCodeDiff, AreaSelect },
    props: {

        Approvers: {
            type: Array,
            default: function () {
                return [];
            }
        },
        sendData: {
            type: Object,
            default: function () {
                return {};
            }
        },
        ButConf: {
            type: Object,
            default: function () {
                return {};
            }
        },
    },
    name: 'Editheader',
    data() {
        return {
            // 地区选择插件单、复选开关
            area_multiple: false,
            // 地区选择插件是否分区
            isHasArea: true,
            actionType: Number,
            lockAll: false,
            popVisble: false,
            copyBut: true, // 复制按钮显示
            gameId: getStorageData('g'),
            cEnvId: getStorageData('e'),
            envId: '', // 环境id
            oldStr: '',
            newStr: '',
            syncoldStr: '',
            syncnewStr: '',
            envConf: [],
            approverId: '',
            newApproverId: '',
            dialog_width: '70%',
            dialog_title: '',
            pageTitle: '',
            channels: [],
            areaId: '', // 原地区ID
            newAreaId: '', // 新地区ID
            channelId: '', // 原渠道
            newChannelId: '', // 新渠道
            channelVisble: false, // 控制渠道显示
            areaVisble: false, // 控制区域显示
        };
    },
    computed: {
        ...mapState({
            tagsList: state => state.tagsview.tagsList,
            tagIndex: state => state.tagsview.tagIndex,
        }),

    },
    mounted() {
        this.channelConf();
        this.LoadEnvConf();
    },
    methods: {
        sendMsg() {
            this.popVisble = false;
            this.$parent.send({ 'approverId': this.approverId });
        },
        // 弹框关闭
        closePop() {
            this.popVisble = false;
        },
        // 弹框类型选择
        subimtAct(Num) {
            this.actionType = Num;
            switch (Num) {
                case 1:
                    this.dialog_title = '发布';
                    this.dialog_width = '70%';
                    this.oldStr = !this.sendData.oldJson ? '' : this.sendData.oldJson;
                    this.newStr = !this.sendData.newJson ? '' : this.sendData.newJson;
                    break;
                case 2:
                    this.dialog_title = '复制配置';
                    this.dialog_width = '20%';
                    break;
                case 3:
                    this.dialog_title = '同步配置';
                    this.dialog_width = '70%';
                    this.syncoldStr = !this.sendData.syncoldJson ? '' : this.sendData.syncoldJson;
                    this.syncnewStr = !this.sendData.syncnewJson ? '' : this.sendData.syncnewJson;
                    break;
            }
            this.popVisble = true;
        },
        // 锁定
        _lockAll() {
            this.lockAll = !this.lockAll;
            this.$emit('allLock', this.lockAll);
        },
        // 绑定选择后的地区选项值
        selectArea(array) {
            console.log(array);
            this.areaId = array[0];
        },
        selectAreaNew(array) {
            console.log(array);
            this.newAreaId = array[0];
        },
        // 读取渠道配置
        channelConf() {
            let data = { };
            revoke('/index.php?m=Config&p=channel', data).then(res => {
                if (res.code === 0) {
                    this.channels = res.data;
                }
            });
        },
        // 读取环境
        LoadEnvConf() {
            let envInfo = this.$store.getters.GetEnvConf(this.gameId);
            for (let i in envInfo.list) {
                if (String(envInfo.list[i].env) === String(this.cEnvId)) {
                    this.envConf.push({ 'disabled': true, 'label': envInfo.list[i].label, 'env': envInfo.list[i].env });
                } else {
                    this.envConf.push(envInfo.list[i]);
                }

            }
        },
        // 确认复制
        copyConf() {
            this.popVisble = false;
            this.$confirm('确认复制？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$parent.copyConf({ 'channl': this.channelId, 'new_channl': this.newChannelId, 'area': this.areaId, 'new_area': this.newAreaId, 'env': this.envId });
            }).catch(() => {

            });
        },
        // 确认同步
        syncConf() {
            this.popVisble = false;
            this.$confirm('确认从外网同步配置？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$parent.syncConf({ 'channelId': this.channelId, 'areaId': this.areaId });
            }).catch(() => {

            });
        },
        internalSend() {
            this.popVisble = false;
            this.$confirm('确认发布配置到内网？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$parent.internalSend();
            }).catch(() => {

            });
        },
    }
};
</script>
<style lang="scss">
.d2h-file-side-diff {
    display: inline-block;
    overflow-x: auto;
    overflow-y: hidden;
    width: 50%;
    margin-right: -4px;
    margin-bottom: -8px;
}
</style>

<style lang="scss" scoped>
.demo-form-inline {
    .el-select {
        width: 150px;
    }
    .page_headers {
        height:36px;line-height:36px;
        h3 {
            margin-left: 10px;
        }
        .btn_group {
            margin-right: 10px;
        }
        .icon_style {
            margin-left:6px;
        }
    }
}
.publish {
    .diff_title {
        width:50%;float:left;text-align:center;height:20px;line-height:20px;color: rgb(191, 203, 217);
    }
}

</style>

