<template>
    <div class="app-containei">
         <div class="filter-container">
             <!-- navbar区 -->
            <div class="table-navbar">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="应用：">
                        <el-select v-model="appid_int" placeholder="请选择应用" class="nav-select">
                            <el-option
                                v-for="t in appList"
                                :key="t.name"
                                :label="t.name"
                                :value="t.appid_int">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分享场景：">
                        <el-select v-model="scene" placeholder="请选择场景" class="nav-select" @change="sceneChange">
                            <el-option
                                v-for="t in sceneList"
                                :key="t.scene_name"
                                :label="t.scene_name"
                                :value="t.scene_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="玩法：" v-if="selectGameType">
                        <el-select v-model="game" placeholder="请选择玩法" class="nav-select">
                            <el-option
                                v-for="t in gameList"
                                :key="t.game_name"
                                :label="t.game_name"
                                :value="t.game_id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="分享确认：" v-if="selectConfirm">
                        <el-checkbox v-model="shareConfirmEnable" @change="changeShareConfirm">启用</el-checkbox>
                    </el-form-item>
                    <el-form-item class="text-right">
                        <el-button class="filter-item" type="success" @click="openAdd">新增配置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- table区 -->
            <div class="table-main">
                <el-table border :data="tableData">
                    <!-- 通用表格样式，porp对应每一列的属性值, label对应表头名称 -->
                    <el-table-column align="center" label="分享id" prop="config_id" width="70">
                    </el-table-column>
                    <el-table-column align="center" label="分享文案" prop="share_text">
                    </el-table-column>
                     <el-table-column align="center" label="场景" prop="scene_name" width="170">
                    </el-table-column>
                     <el-table-column align="center" label="玩法" prop="game_name" width="120">
                    </el-table-column>
                    <el-table-column align="center" label="分享图片" prop="share_image_url" width="250">
                        <template slot-scope="scope">
                        <el-image :src="scope.row.share_image_url" style="height: 100px"></el-image>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作" width="220">
                    <!-- 如需要每行对应的操作按钮则添加template，slot自定义 -->
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <!-- 翻页器 -->
                <div class="block pagination">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5, 10, 25, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalPage">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 弹层区 -->
        <el-dialog title="添加图文分享" :visible.sync="addVisble" width="40%">
            <el-form label-position="right" label-width="120px" :model="addConf" ref="addConf" :rules="rules" class="dialog-form">
                <el-form-item label="分享文案" prop="share_text">
                    <el-input class="form-input" v-model="addConf.share_text"></el-input>
                </el-form-item>
                <el-form-item label="图片链接" prop="image_url" >
                    <el-input class="form-input" v-model="image_url"></el-input>
                </el-form-item>
                <el-form-item label="本地上传" prop="image" v-if="addConf.image_type == 'local'">
                    <AliOSS @getUploadData='getOssFileInfo' :objectName="objectName"></AliOSS>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisble = false">取 消</el-button>
                <el-button type="success" @click="confirAdd()">添 加</el-button>
            </span>
        </el-dialog>

        <!-- 弹层区 -->
        <el-dialog title="编辑图文分享" :visible.sync="editVisble" width="40%">
            <el-form label-position="right" label-width="120px" :model="selectConf" ref="selectConf" :rules="rules" class="dialog-form">
                <el-form-item label="分享文案" prop="text">
                    <el-input class="form-input" v-model="selectConf.share_text"></el-input>
                </el-form-item>
                <el-form-item label="图片链接" prop="image_url">
                    <el-input class="form-input-max" v-model="selectConf.image_url" ></el-input>
                </el-form-item>
                <el-form-item label="本地更换" prop="image">
                    <AliOSS @getUploadData='getOssFileInfo' :objectName="objectName"></AliOSS>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisble = false">取 消</el-button>
                <el-button type="success" @click="confirEdit('selectConf')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
import { AliOSS } from '@/components/ali';
import { datesFormat } from '@/utils/common';

export default {
    name: 'share',
    data() {
        return {
            scene: 0,
            sceneList: [
                { 'scene_id': 0, 'scene_name': ' 不限' },
                { 'scene_id': 1, 'scene_name': ' 分享包赔' },
                { 'scene_id': 2, 'scene_name': ' 分享双倍' },
                { 'scene_id': 3, 'scene_name': ' 七天签到' },
                { 'scene_id': 4, 'scene_name': ' 推广员活动' },
                { 'scene_id': 5, 'scene_name': ' 排行榜' },
                { 'scene_id': 6, 'scene_name': ' 系统自带转发' },
                { 'scene_id': 7, 'scene_name': ' 救济金分享' },
                { 'scene_id': 8, 'scene_name': ' 好友房邀请好友' },
                { 'scene_id': 9, 'scene_name': ' 赢3局的翻牌' },
                { 'scene_id': 10, 'scene_name': '中奖记录' },
            ],
            game: 0,
            gameList: {
                '0': { 'game_id': 0, 'game_name': '不限' },
                '1': { 'game_id': 1, 'game_name': '血流到底' },
                '2': { 'game_id': 2, 'game_name': '血战到底' },
                '7': { 'game_id': 7, 'game_name': '断勾卡' },
                '8': { 'game_id': 8, 'game_name': '内江麻将' },
                '1010': { 'game_id': 1010, 'game_name': '红中麻将' },
                '2002': { 'game_id': 2002, 'game_name': '跑得快' },
            },
            appList: [],
            appid_int: 1, // 默认1红中麻将
            id: 0,
            selectConf: {
                share_text: '',
                share_image_url: '',
                id: 0,
            },
            tableData: [],
            totalPage: 0,
            pageSize: 25,
            currentPage: 1,
            addConf: {
                share_text: '',
                share_image_url: '',
            },
            addVisble: false,
            editVisble: false,
            shareConf: [],
            shareConfirmEnable: false,
            rules: {
                share_text: [
                    { required: true, message: '请输入分享文案', trigger: 'blur' },
                    { max: 120, message: '长度在 120 个字符以内', trigger: 'blur' }
                ],
                /*
                image_url: [
                    { required: true, message: '请输入图片链接', trigger: 'blur' },
                ], */
            },

            objectName: '/hall/production/common/share/' + datesFormat(new Date(), 'yyyyMMddhhmm'),
            objectUrl: '',
            image_url: '',
            selectGameType: false, // 是否玩法可选
            selectConfirm: false,

        };
    },
    watch: {
        scene: function(val) {
            this.getTableList();
        },
        game: function(val) {
            this.getTableList();
        },
        appid_int: function(val) {
            this.getTableList();
        },
    },
    mounted() {
        this.initShareConfrimEnable();
        this.initPage();
        this.wxConf();
    },
    components: { AliOSS },
    methods: {
        // 新增配置弹出
        openAdd() {
            this.addVisble = true;
            this.addConf.image_type = 'local';
        },
        // 编辑分享配置
        handleEdit(index, row) {
            this.editVisble = true;
            this.objectUrl = '';// 清空上传的文件
            this.selectConf.id = row.config_id;
            this.selectConf.share_text = row.share_text;
            this.selectConf.image_url = row.share_image_url;
        },
        changeShareConfirm() {
            this.shareConf.shareConfirm = this.shareConfirmEnable;
            let data = {
                'key': 'sign',
                'table': 't_welfare_config',
                'value': JSON.stringify(this.shareConf)
            };
            // 获取审批流程
            revoke('/index.php?m=CommConf&p=updateConfByApi', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                }
            });
        },
        // 确认提交编辑
        confirEdit() {
            let args = {};
            args.id = this.selectConf.id;
            args.share_image_url = this.objectUrl ? this.objectUrl : this.selectConf.image_url;
            args.share_text = this.selectConf.share_text;
            let data = {
                callm: 'share',
                callp: 'edit',
                args: JSON.stringify(args),
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    this.getTableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 删除
        handleDel(index, row) {
            this.$confirm('确认删除id为' + row.config_id + '的分享配置', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    callm: 'share',
                    callp: 'del',
                    args: JSON.stringify({ 'id': row.config_id }),
                };
                revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                    if (res.code === 0) {
                        this.editVisble = false;
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.getTableList();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 获取oss文件上传信息
        getOssFileInfo(data) {
            this.objectUrl = data[0].url;
        },
        // 初始化页面
        initPage() {
            this.getTableList();
        },
        // 获取配置列表
        getTableList() {
            let args = {
                page: this.currentPage,
                pageNum: this.pageSize,
                scene: this.scene,
                game: this.game,
                appid_int: this.appid_int,
            };
            let data = {
                callm: 'share',
                callp: 'getList',
                args: JSON.stringify(args),
            };

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list;
                    // 处理显示
                    console.log(this.sceneList['0']['scene_name']);

                    for (let i in this.tableData) {
                        this.tableData[i].scene_name = this.sceneList[this.tableData[i].share_scene] ? this.sceneList[this.tableData[i].share_scene]['scene_name'] : '';
                        this.tableData[i].game_name = this.gameList[this.tableData[i].play_type] ? this.gameList[this.tableData[i].play_type]['game_name'] : '';
                    }

                    this.totalPage = res.data.total;
                }
            });

        },
        initShareConfrimEnable() {
            let data = { 'key': 'sign', 'table': 't_welfare_config' };
            // 获取审批流程
            revoke('/index.php?m=CommConf&p=getConfByApi', data).then(res => {
                if (res.code === 0) {
                    console.log(res.data);
                    this.shareConf = res.data[0];
                    this.shareConfirmEnable = this.shareConf.shareConfirm;
                }
            });
        },
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTableList();
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableList();
        },
        // 新增配置确认提交
        confirAdd() {
            this.addConf.scene = this.scene;
            this.addConf.game = this.game;
            this.addConf.appid_int = this.appid_int;
            this.addConf.share_image_url = this.image_url ? this.image_url : this.objectUrl;
            let data = {
                callm: 'share',
                callp: 'add',
                args: JSON.stringify(this.addConf),
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.addVisble = false;
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    this.getTableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        wxConf() {
            let data = {
                callm: 'share',
                callp: 'getWxConf',
                args: JSON.stringify({}),
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.appList = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        sceneChange(val) {
            if (val === 1 || val === 2 || val === 7) {
                this.selectGameType = true;
            } else {
                this.selectGameType = false;
                this.game = 0;
            }
            if (val > 0) {
                this.selectConfirm = true;
            } else {
                this.selectConfirm = false;
            }
        }

    }
};
</script>
<style lang="scss" scoped>
.nav-select {
    width: 120px;margin: 0 5px 10px 0;
}
.nav-input {
    width: 150px;margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width: 200px!important;
}
.form-input-max {
    width: 500px!important;
}
</style>