<template>
    <div class="app-containei">
        <div class="filter-container">
            <edit-header :sendData="diffData" :Approvers="Approvers" :ButConf="ButConf" @allLock="isAllLock"></edit-header>
            <el-form :inline="false" class="demo-form-inline">
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="开放状态">
                    <el-radio :disabled="allLocked" v-model="selectData.is_open" label="1" key="1">开放</el-radio>
                    <el-radio :disabled="allLocked" v-model="selectData.is_open" label="0" key="0">关闭</el-radio>
                    </el-form-item>
                    <el-form-item label="商城首页:">
                        <el-input :disabled="allLocked" class="form-input"  v-model="selectData.url"></el-input>
                    </el-form-item>
                    <el-form-item label="兑换记录:">
                        <el-input :disabled="allLocked" class="form-input"  v-model="selectData.record"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" class="demo-form-inline" label-width="120px"  v-for="(item,i) of tags" v-model="tags[i]" :key="i">
                <el-form-item label="名称:">
                    <el-input :disabled="allLocked" class="form-input-min"  v-model="tags[i]['name']"></el-input>
                </el-form-item>
                <el-form-item label="图标:">
                    <el-input :disabled="allLocked" class="form-input-max"  v-model="tags[i]['icon']"></el-input>
                </el-form-item>
                <el-image style="width: 48px; height: 48px" :src="tags[i]['icon']"  :alt="tags[i]['icon']"></el-image>
                <el-form-item label="状态">
                    <el-select :disabled="allLocked" v-model="tags[i]['state']" placeholder="请选择" class="form-input-min" >
                    <el-option
                        v-for="item in stateOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-if='i==0' class="icon_style">
                    <i class="el-icon-circle-plus-outline icon_size" style="font-size:20px;" label-position="right" @click="addTag();" ></i>
                </el-form-item>
                <el-form-item label="" class="icon_style">
                    <i class="el-icon-remove-outline icon_size" style="font-size:20px;" label-position="right" @click="reTag(i);" ></i>
                </el-form-item>
                </el-form>
                <el-form :inline="true" class="demo-form-inline" label-width="120px" style="margin-left:70px;">
                    <el-button :disabled="allLocked" type="success" @click="confirEdit">更新</el-button>
                </el-form>
            </el-form>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
import { EditHeader } from '../../components/editHeader';
export default {
    components: { EditHeader },
    name: 'actor',
    data() {
        return {
            diffData: null,
            Approvers: [],
            ButConf: { 'copyBut': 1, 'syncBut': 1 },
            approvalId: 1, // 流程id写死兑换商城tag写死1
            confKey: 'ExchangeTag', // 配置中心key写死兑换商城tag
            confTable: 't_welfare_config', // 配置中心对应表名写死
            tags: [{ 'add': true, 'name': '', 'icon': '', 'state': 2 }],
            id: 0,
            stateOption: [{ 'label': '开启', 'value': 1 }, { 'label': '暂未开放', 'value': 2 }, { 'label': '敬请期待', 'value': 3 }],
            selectData: {
                url: '',
                record: '',
                is_open: '0',
                items: [],
            },
            // 页面是否已经被锁定
            allLocked: false,
            oldproduct: 0,
            oldchannl: 0,
            oldprov: 0,
            oldcity: 0,
            oldarea: 0,
            oldenv: 0
        };
    },
    mounted() {
        this.load();
        // 给审批列表赋值
        this.loadApproval();
        this.diff();
        this.syncConfDiff();
    },
    methods: {
        isAllLock(val) {
            this.allLocked = val;
        },
        addTag() {
            if (this.allLocked) { return false }
            this.tags.push({ 'name': '', 'icon': '', 'state': 2 });
        },
        reTag(i) {
            if (this.allLocked) { return false }
            this.tags.splice(i, 1);
        },
        CheckValid() {
            if (this.selectData.url === '') {
                this.$message.error('url不能为空！');
                return false;
            }
            if (this.selectData.record === '') {
                this.$message.error('record不能为空！');
                return false;
            }
            if (this.selectData.is_open === '') {
                this.$message.error('开放状态必选！');
                return false;
            }

            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i].name === '') {
                    this.$message.error('tag名称不能为空');
                    return false;
                }
                if (this.tags[i].icon === '') {
                    this.$message.error('tag图标不能为空');
                    return false;
                }
            }



            return true;
        },
        confirEdit() {
            // 检测默认值
            if (this.CheckValid() === false) {
                return false;
            }
            this.selectData.items = [];
            this.tags.forEach((item, index, array) => {
                this.selectData.items.push({ 'name': item.name, 'state': item.state, 'icon_url': item.icon, 'icon_x': 0, 'icon_y': 0, 'page_id': index + 1 });
            });
            let data = {
                'id': this.id,
                'value': JSON.stringify(this.selectData)
            };
            console.log(data);
            revoke('/index.php?m=exchangetag&p=save', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.$message({
                        message: '编辑成功！',
                        type: 'success'
                    });
                    this.load();
                    this.diff();
                    this.syncConfDiff();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        load() {
            let data = {};
            revoke('/index.php?m=exchangetag&p=get', data).then(res => {
                if (res.code === 0 && res.data.info.value) {
                    let jsArr = JSON.parse(res.data.info.value);
                    this.selectData = jsArr;
                    if (jsArr.items.length > 0) {
                        this.tags = [];
                        jsArr.items.forEach((item, index, array) => {
                            this.tags.push({ 'name': item.name, 'icon': item.icon_url, 'state': item.state });
                        });
                    }
                    this.selectData.is_open = String(this.selectData.is_open);
                    this.id = res.data.info.id;
                    // 隐藏复制按钮
                    this.ButConf['copyBut'] = 0;
                }
            });
        },
        loadApproval() {
            let data = { 'id': this.approvalId };
            // 获取审批人
            revoke('/index.php?m=approval&p=getApproval', data).then(res => {
                if (res.code === 0) {
                    this.Approvers = res.data.approver;
                }
            });

        },
        diff() {
            let data = { 'key': this.confKey, 'table': this.confTable };
            // 获取审批流程
            revoke('/index.php?m=CommConf&p=diff', data).then(res => {
                if (res.code === 0) {
                    console.log(res.data, res.data.newJson.length);
                    this.diffData = res.data;

                    this.oldproduct = res.data.oldJsonKey.product;
                    this.oldchannl = res.data.oldJsonKey.channl;
                    this.oldprov = res.data.oldJsonKey.prov;
                    this.oldcity = res.data.oldJsonKey.city;
                    this.oldarea = res.data.oldJsonKey.area;

                }
            });
        },
        syncConfDiff() {
            let data = { 'key': this.confKey, 'table': this.confTable };
            // 获取同步配置对比
            revoke('/index.php?m=CommConf&p=syncConfDiff', data).then(res => {
                if (res.code === 0) {
                    console.log(res);
                    this.diffData['syncnewJson'] = res.data.newJson;
                    this.diffData['syncoldJson'] = res.data.oldJson;
                }
            });
        },
        send(args) {
            let approverId = args['approverId'];
            let data = { 'key': this.confKey, 'subkey': '', 'table': this.confTable, 'approver': approverId, 'approval_id': this.approvalId, 'comm_conf_id': this.id };
            data['new_conf'] = this.diffData.newJson;
            data['old_conf'] = this.diffData.oldJson;

            let confKey = { product: this.oldproduct, channl: this.oldchannl, prov: this.oldprov, city: this.oldcity, area: this.oldarea, env: 0 };
            data['new_conf_key'] = JSON.stringify(confKey);
            // 发布申请
            console.log(data);
            revoke('/index.php?m=SendConf&p=applySend', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 复制配置
        copyConf(args) {
            let data = {};
            data['key'] = this.confKey;
            // data['channelId'] = args['channl'];
            // data['new_channelId'] = args['new_channl'];
            //  data['areaId'] = args['area'];
            //  data['newAreaId'] = args['new_area'];
            data['channl'] = 0;
            data['new_channl'] = 0;
            data['area'] = 0;
            data['new_area'] = 0;
            data['table'] = this.confTable;
            data['env'] = args['env'];
            revoke('/index.php?m=CommConf&p=copyConf', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    // 重新加载
                    this.load();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        // 同步配置
        syncConf(args) {
            let data = {};
            data['key'] = this.confKey;
            // data['channelId'] = args['channl'];
            // data['new_channelId'] = args['new_channl'];
            //  data['areaId'] = args['area'];
            //  data['newAreaId'] = args['new_area'];
            data['channl'] = 0;
            data['new_channl'] = 0;
            data['area'] = 0;
            data['new_area'] = 0;
            data['table'] = this.confTable;
            data['env'] = args['env'];
            revoke('/index.php?m=CommConf&p=syncConf', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    // 重新加载
                    this.load();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 内网发布
        internalSend() {
            let data = {};
            data['table'] = this.confTable;
            data['key'] = this.confKey;
            data['product'] = this.oldproduct;
            data['channl'] = this.oldchannl;
            data['prov'] = this.oldprov;
            data['city'] = this.oldcity;
            data['area'] = this.oldarea;
            revoke('/index.php?m=CommConf&p=internalSend', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    // 重新加载
                    this.load();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },



    }
};
</script>

<style lang="scss" scoped>
.text-right {
    float: right;
}
.pagination {
    margin: 20px 0;
}
.nav-select {
    width: 100px;margin: 0 5px 10px 0;
}
.nav-input {
    width: 150px;margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width:350px!important;
}
.form-input-max {
    width:450px!important;
}
.form-input-min {
    width: 105px!important;
}
</style>