<template>
    <div class="app-containei">
        <div class="filter-container">
            <edit-header :sendData="diffData" :Approvers="Approvers" :ButConf="ButConf" @allLock="isAllLock"></edit-header>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item class="text-right">
                    <el-button
                        class="filter-item"
                        type="success"
                        @click="openAdd"
                    >创建比赛</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="比赛id" prop="id"></el-table-column>
                <el-table-column align="center" label="游戏类型" prop="gameName"></el-table-column>
                <el-table-column align="center" label="比赛名称" prop="name"></el-table-column>
                <el-table-column align="center" label="报名费用" prop="applyFee"></el-table-column>
                <el-table-column align="center" label="关卡数" prop="levelsCount"></el-table-column>
                <el-table-column align="center" label="开放时间" prop="openTime"></el-table-column>
                <el-table-column align="center" label="状态" prop="status"></el-table-column>
                <el-table-column align="center" label="操作" width="200px;">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="success" size="small" @click="changeStatus(scope.$index, scope.row, 1)">上线</el-button>
                        <el-button type="warning" size="small" @click="changeStatus(scope.$index, scope.row, 0)">下线</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 25, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage"
                ></el-pagination>
            </div>
        </div>
        <div class="dialog_div">
            <el-dialog
                title="编辑信息"
                :visible.sync="editVisble"
                width="30%"
                :before-close="handleEditClose"
            >
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="名称">
                        <el-input class="form-input" v-model="selectData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商户号">
                        <el-input class="form-input" v-model="selectData.mchId"></el-input>
                    </el-form-item>

                    <el-form-item label="wxAppId">
                        <el-input class="form-input" v-model="selectData.wxAppId"></el-input>
                    </el-form-item>
                    <el-form-item label="openAppId">
                        <el-input class="form-input" v-model="selectData.openAppId"></el-input>
                    </el-form-item>
                    <el-form-item label="appSecret">
                        <el-input class="form-input" v-model="selectData.appSecret"></el-input>
                    </el-form-item>
                    <el-form-item label="appKey">
                        <el-input class="form-input" v-model="selectData.appKey"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 新增比赛 -->
            <el-dialog
                title="新增比赛"
                :visible.sync="addVisble"
                width="50%"
                :before-close="handleAddClose"
            >
                <el-form
                    label-position="right"
                    label-width="130px"
                    :model="addData"
                    class="dialog-form"
                >
                    <el-form-item label="比赛名称">
                        <el-input class="form-input" v-model="addData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏类型">
                        <el-select :disabled="allLocked" v-model="addData.gameID" placeholder="请选择游戏" class="form-input-min">
                            <el-option
                                v-for="(item, index) in gameMap"
                                :key="index"
                                :label="item"
                                :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="比赛ID">
                        <el-input class="form-input" v-model="addData.id" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="开放时间">
                        <el-time-picker
                            is-range
                            v-model="addOpenTime"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            @change="addTimeChange"
                            style="width: 100%;">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="报名费用">
                        <el-col :span="11">
                            <el-select :disabled="allLocked" v-model="addData.applyMoneyType" placeholder="请选择" class="form-input-min" >
                                <el-option
                                    v-for="(item, index) in currencyMap"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2">  </el-col>
                        <el-col :span="11">
                            <el-input class="form-input" type="number" v-model="addData.applyMoneyCount" min="0"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="关卡数量">
                        <el-input class="form-input" type="number" v-model="levelCount" @blur="initLevelTable" min="1" max="100"></el-input>
                    </el-form-item>
                    <el-form-item label="关卡积分">
                        <chase-point :levelCount2="levelCount2" :formType="formType" :formObj="formObj" ref="chasePoint" @submitEve="submitPointEve"></chase-point>
                    </el-form-item>
                    <el-form-item label="关卡奖励">
                        <chase-reward :levelCount2="levelCount2" :formType="formType" :formObj="formObj2" ref="chaseReward" @submitEve="submitRewardEve"></chase-reward>
                    </el-form-item>
                    <el-form-item label="复活设置">                        
                        <chase-set :levelCount2="levelCount2" :formType="formType" :formObj="formObj3" ref="chaseSet" @submitEve="submitSetEve"></chase-set>
                    </el-form-item>

                    <!-- 机器人配置 第一期不做 -->
                    <!-- <el-form-item label="投入机器人数量">
                        <el-input class="form-input" v-model="addData.robotNum"></el-input>
                    </el-form-item>
                    <el-form-item label="游客机器人比例">
                        <el-input class="form-input" v-model="addData.ykRobotRate"></el-input> %
                    </el-form-item>
                    <el-form-item label="高级机器人比例">
                        <el-input class="form-input" v-model="addData.highRobotRate"></el-input> %
                    </el-form-item> -->

                    <!-- 复活配置 -->
                    <el-form-item label="每日免费复活次数">
                        <el-input class="form-input" type="number" v-model="addData.totalShareReliveCount" min="0"></el-input>
                    </el-form-item>
                    <el-form-item label="复活分享链接">
                        <el-input class="form-input" v-model="addData.shareReliveURL"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirAdd">创 建</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
import { EditHeader } from '../../components/editHeader';
import ChasePoint from '../../components/confManage/ChasePoint';//管卡积分
import ChaseReward from '../../components/confManage/ChaseReward';//关卡奖励
import ChaseSet from '../../components/confManage/ChaseSet';//复活设置
import {getTimeFormat} from '@/utils/common';//复活设置
import { debuglog } from 'util';
export default {
    components: { EditHeader,ChasePoint,ChaseReward,ChaseSet },
    name: 'chaseRace',
    data() {
        return {
            levelCount2:0,
            formType:'info', //add：新增   info:查看     edit:编辑
            // formObj:[], //关卡积分
            formObj:[{initScore:10,upgradeScore:50,eliminateScore:10},{initScore:12,upgradeScore:50,eliminateScore:10}],//关卡积分
            formObj2:[{awardType:10,awardMoneyType:50,awardItemID:10,awardCount:3},{awardType:11,awardMoneyType:50,awardItemID:10,awardCount:3}],  //关卡奖励
            formObj3:[{isRelive:5,reliveMoneyType:10,reliveMoney:6},{isRelive:1,reliveMoneyType:10,reliveMoney:6}],  //复活设置
            diffData: null,
            Approvers: [],
            ButConf: { 'copyBut': 1, 'syncBut': 1 },
            approvalId: 1, // 流程id写死兑换商城tag写死1
            confKey: 'ChaseRace', // 配置中心key写死兑换商城tag
            confTable: 't_race_config', // 配置中心对应表名写死
            gameMap: {},
            status: [],
            tableData: [],
            totalPage: 0,
            pageSize: 10,
            currentPage: 1,
            editVisble: false,
            addVisble: false,
            // 关卡数量
            levelCount: 0,
            selectData: {
                name: '',
                mchId: '',
                wxAppId: '',
                openAppId: '',
                appSecret: '',
                appKey: '',
            },
            addData: {
                name: '',
                gameID: '',
                id: '',
                enableTime: '',
                enable: '0',
                openTime: '',
                applyMoneyType: '1',
                applyMoneyCount: 0,
                totalShareReliveCount: '',
                shareReliveURL: ''
            },
            addOpenTime: '',
            //currencyMap: [{ 'name': '金豆', 'value': 1 }, { 'name': '红包券', 'value': 5}],
            currencyMap: {1: '金豆', 5: '红包券'},
            // 关卡积分表头
            integralHead: ['关卡序号','初始积分','晋级积分','淘汰积分'],
            // 关卡奖励表头
            awardHead: ['关卡序号','类型','数量','类型','数量'],
            // 复活设置表头
            reliveHead: ['关卡序号','是否可复活','复活货币','数量'],
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
    // watch: {
        // 监听关卡数变化,重新渲染表格
        // levelCount: function (newLevelNum, oldLevelNum) {
        //     this.initLevelTable(newLevelNum);
        // }
    // },
    created() {
        this.initGameMap();
    },
    mounted() {
        this.getConfigList({
            page: this.currentPage,
            pageNum: this.pageSize
        });
    },
    methods: {
        // 获取游戏
        initGameMap() {
            let data = {
                callm: 'config',
                callp: 'gameMap',
                args: JSON.stringify({'isAll': 0}),
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    let retData = res.data;
                    //console.log(retData);
                    // 去掉好友房
                    delete(retData[4001]);
                    this.gameMap = retData;
                }
            });
        },
        isAllLock(val) {
            this.allLocked = val;
        },
        // 根据关卡数初始化table
        initLevelTable() {
            //console.log(this.addData.levelNum);
            
        },
        // 日期选项
        addTimeChange(value) {
            debugger;
            console.log(Date.parse(value[0]),Date.parse(value[1])); //时间戳
            this.addData.openTime = [getTimeFormat(value[0],'hh-mm-ss'), getTimeFormat(value[1],'hh-mm-ss')];// 11:55:45
            console.log(this.addOpenTime,value,this.addData.openTime);
        },
        // 获取关卡积分的值
        submitPointEve(val){
            this.formObj = val;
            console.log(this.formObj);
        },
        // 获取关卡奖励的值
        submitRewardEve(val){
            this.formObj2 = val;
            console.log(this.formObj2);
        },
        // 获取复活设置的值
        submitSetEve(val){
            this.formObj3 = val;
            console.log(this.formObj3);
        },
        // 保存创建比赛
        confirAdd() {
            // 获取关卡积分/关卡奖励/复活设置的值
            this.$refs.chasePoint.submitEve();
            this.$refs.chaseReward.submitEve();
            this.$refs.chaseSet.submitEve();

            // 检测默认值
            if (this.addCheckValid() === false) {
                return false;
            }
            console.log(this.addData);
            let data = {
                'value': JSON.stringify(this.addData)
            };
            revoke('/index.php?m=chaserace&p=add', data).then(res => {
                //console.log(res);return;
                if (res.code === 0) {
                    this.addVisble = false;
                    this.$message({
                        message: '创建成功！',
                        type: 'success'
                    });
                    this.getConfigList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 创建比赛验证
        addCheckValid() {
            if (this.addData.name === '') {
                this.$message.error('比赛名称不能为空！');
                return false;
            }
            if (this.addData.gameID === '') {
                this.$message.error('游戏类型必选！');
                return false;
            }
            if (this.addData.applyMoneyCount === '') {
                this.$message.error('报名费用不能为空！');
                return false;
            }
            if (this.addData.totalShareReliveCount === '') {
                this.$message.error('每日免费复活次数不能小于0！');
                return false;
            }
            if (this.addData.totalShareReliveCount < 0) {
                this.$message.error('每日免费复活次数不能小于0！');
                return false;
            }
            if (this.addData.shareReliveURL === '') {
                this.$message.error('复活分享链接不能为空！');
                return false;
            }
            
            return true;
        },
        // 保存修改比赛
        confirEdit() {
            let args = {
                id: this.selectData.id,
                name: this.selectData.name,
                mchId: this.selectData.mchId,
                wxAppId: this.selectData.wxAppId,
                openAppId: this.selectData.openAppId,
                appSecret: this.selectData.appSecret,
                appKey: this.selectData.appKey,
            };
            let data = {
                callm: 'wxconf',
                callp: 'edit',
                args: JSON.stringify(args),
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(
                res => {
                    if (res.code === 0) {
                        this.editVisble = false;
                        this.$message({
                            message: '编辑成功！',
                            type: 'success'
                        });
                        this.getTableList({
                            page: this.currentPage,
                            pageNum: this.pageSize
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
        getConfigList(args) {
            let data = {};
            revoke('/index.php?m=chaserace&p=get', data).then(res => {
                if (res.code === 0 && res.data) {
                    //let jsonArr = JSON.parse(res.data.list);
                    let retData = res.data.list;
                    //console.log(this.gameMap);
                    //console.log(retData);
                    for (let i in retData) {
                        console.log(retData[i]['gameID']);
                        let curGameId = parseInt(retData[i]['gameID']);
                        retData[i]['gameName'] = this.gameMap[curGameId];
                        retData[i]['applyFee'] = this.currencyMap[retData[i]['applyMoneyType']] +' - '+ retData[i]['applyMoneyCount'];
                    }
                    console.log(retData);
                    //console.log(this.gameMap[1]);
                    this.tableData = retData;
                    // 隐藏复制按钮
                    this.ButConf['copyBut'] = 0;
                }
            });
        },
        // 编辑用户信息
        handleEdit(index, row) {
            this.editVisble = true;
            this.selectData.id = row.id;
            this.selectData.name = row.name;
            this.selectData.wxAppId = row.wxAppId;
            this.selectData.openAppId = row.openAppId;
            this.selectData.appSecret = row.appSecret;
            this.selectData.appKey = row.appKey;
        },
        // 上线、下线
        changeStatus(index, row, status) {
            console.log(row.chaseId);
            console.log(status);
            //this.selectData.id = row.id;

        },
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val;
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            };
            this.getTableList(data);
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            };
            this.getTableList(data);
        },
        // 弹出框close
        handleEditClose(done) {
            this.editVisble = false;
        },
        // 弹出框close
        handleAddClose(done) {
            this.addVisble = false;
        },
        openAdd() {
            this.addData.id = new Date().getTime();
            this.addVisble = true;
        },
        // 发布上线
        updateCache() {
            this.popVisble = false;
            this.$confirm('这会使配置立即生效,确认清空缓存？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.reqUpdate();
            }).catch(() => {

            });

        },
        reqUpdate() {
            let data = {
                callm: 'wxconf',
                callp: 'updateCache',
                args: JSON.stringify(this.addData),
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(
                res => {
                    if (res.code === 0) {
                        this.addVisble = false;
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                        this.getTableList({
                            page: this.currentPage,
                            pageNum: this.pageSize
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
    },
    watch: {
        // 根据关卡数量，显示关卡积分/关卡奖励/复活设置的表格行数
        levelCount:function(newVal){
            newVal = Number(newVal);
            this.levelCount2  = newVal;
        }
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
    width: 100px;
    margin: 0 5px 10px 0;
}
.nav-input {
    width: 150px;
    margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width: 200px !important;
}
</style>
<style lang="scss">
.el-dialog__header {
    padding: 20px 20px 10px;
    background-color: #f0f2f5;
}
.el-dialog__footer {
    padding: 10px 20px 20px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #f0f2f5;
}
.form-global{    
    border-left: 1px solid #eee;
    border-top: 1px solid #eee;
    *{
        padding: 0;
        margin: 0;
    }
    .form-no-data{
        border-bottom:1px solid #eee;
        border-right:1px solid #eee;
        text-align: center;
        line-height: 60px;
        color: #999;
    }
    &.info{
        input{
            border: none;
            text-align: center;
        }
    }
}
.form-global ul{
    width: 100%;
    min-width: 400px;
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0;
    &.theader{
        background: #eee;
        li{
            height: 40px;
            line-height: 40px;
            color:#999;
        }
    }
}
.form-global ul li{
    flex: 1;
    display: inline-block;
    width: 25%;
    list-style: none;
    text-align: center;
    box-sizing: border-box;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    height: 60px;
    line-height: 60px;
    &:first-child{
        flex: none;
        width: 80px;
    }
    input{
        width: 80%;
        margin: 10px 10%;
        padding:5px 10px;
        outline: none;
        height: 40px;
        box-sizing: border-box;
        border:1px solid #DCDFE6;
        border-radius: 4px;
        &:focus{
            border-color:#409EFF;
        }
    }
}

</style>
