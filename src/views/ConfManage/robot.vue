<template>
    <div class="app-containei robot-wrap">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline demo-form-inline1">
                <el-form-item label="机器人基础配置">
                    &nbsp;
                    <span class="robot-num">机器人匹配个数上限：{{maxAttendCount}}</span>
                    <el-button class="filter-item" @click="showCreateVar = true">生成机器人</el-button>
                    <el-button class="filter-item" @click="showEditMaxVar=true">修改上限</el-button>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" @click="reloadStatus">查看投放情况</el-button>
                    <el-input
                        v-model="filterId"
                        placeholder="请输入机器人showID"
                        class="filter-item nav-input"
                        @keyup.enter.native="searchRobot"
                    />
                    <el-button class="filter-item" @click="searchRobot">查找机器人</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="false" class="demo-form-inline">
                <el-form-item label="机器人准入比配置"></el-form-item>
                <el-form-item label="玩法选择：">
                    <el-select v-model="playId" placeholder="请选择" @change="changePlayId">
                        <el-option v-for="(item,i) in gamesConf" :key="i" :label="item" :value="i"></el-option>
                    </el-select>
                </el-form-item>

                <el-table border :data="matchConfs">
                    <el-table-column align="center" label="场次">
                        <template slot-scope="scope">{{levels[scope.row.level]}}</template>
                    </el-table-column>
                    <el-table-column align="center" label="开关">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="matchConfs[scope.$index].CloseRobot"
                                active-color="#ff4949"
                                inactive-color="#13ce66"
                                disabled="true"
                                active-value="1"
                                inactive-value="0"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="准入比">
                        <template slot-scope="scope">
                            <span>初级:{{matchConfs[scope.$index].RobotRatio.Low}}</span>
                            <span>高级:{{matchConfs[scope.$index].RobotRatio.High}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button class="filter-item" @click="showEditRatio(scope.row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <el-form :inline="true" class="demo-form-inline  demo-form1" style="padding-top:10px;">
                <el-form-item label="机器人匹配情况"></el-form-item>
                <el-form-item  class="text-right">
                    <el-button @click="editVisble=true"  v-if="editVisble==false" class="text-right">编辑</el-button>
                    <el-button @click="editVisble=false" v-if="editVisble" class="text-right">取消</el-button>
                    <el-button @click="saveInitGameConf()" v-if="editVisble" class="text-right">保存</el-button>
                </el-form-item>
                <el-table border :data="tableData">
                    <el-table-column align="center" label="游戏id" prop="gid"  width="80"></el-table-column>
                    <el-table-column align="center" label="游戏名称" prop="name"  width="160"></el-table-column>
                    <el-table-column class-name="edit-column" align="center" label="局数范围" >

                         <template slot-scope="{row}">
                            <template v-if="editVisble">
                                <input class="edit-cell"    v-model="row.gameCountN[0]" type="number"/>
                                <span>~</span>
                                <input class="edit-cell"    v-model="row.gameCountN[1]" type="number"/>
                            </template>
                            <template v-else>
                                <span>{{row.gameCount}}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="edit-column" align="center" label="胜率范围">
                         <template slot-scope="{row}">
                            <template v-if="editVisble">
                                <input class="edit-cell"    v-model="row.winRateN[0]">
                                <span>~</span>
                                <input class="edit-cell"    v-model="row.winRateN[1]">
                                <span>%</span>
                            </template>
                            <template v-else>
                                <span>{{row.winRateStr}}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="edit-column" align="center" label="最大连胜数区间" >
                        <template slot-scope="{row}">
                            <template v-if="editVisble">
                                <input class="edit-cell"    v-model="row.maxStreakN[0]">
                                <span>~</span>
                                <input class="edit-cell"    v-model="row.maxStreakN[1]">
                            </template>
                            <template v-else>
                                <span>{{row.maxStreakStr}}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="最大胜倍数生成方式"  width="160">
                             <template slot-scope="{row}">
                            <el-select v-model="row.maxWinMultiMethodN" v-if="editVisble" placeholder="请选择">
                                <el-option
                                v-for="item in winMultiMethodOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>

                            <span v-else>{{row.maxWinMultiMethodStr}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="edit-column" align="center" label="最大胜倍数区间">
                          <template slot-scope="{row}">
                            <template v-if="editVisble">
                                <template v-if="row.maxWinMultiMethodN==1">
                                    <input class="edit-cell"    v-model="row.maxWinMultiN[0]">
                                    <span>~</span>
                                    <input class="edit-cell"    v-model="row.maxWinMultiN[1]">
                                </template>
                                <template v-if="row.maxWinMultiMethodN==2">
                                  <input class="form-input" v-model="row.maxWinMultiStr">
                                </template>
                            </template>
                            <template v-else>
                                <span>{{row.maxWinMulti}}</span>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </div>
        <div class="dialog_div">
            <!-- 展示机器人投放情况 -->
            <el-dialog title="查看机器人投放情况" :visible.sync="showQueryVar" width="50%">
                <el-form label-position="right" label-width="160px" :model="showData">
                    <el-form-item label="当前总机器人数：">{{showData.totalRobot}}</el-form-item>
                    <el-form-item label="空闲机器人数：">{{showData.freeCount}}</el-form-item>
                    <el-form-item label="忙碌机器人数：">{{showData.busyCount}}</el-form-item>
                    <el-form-item label="信息库剩余量：">{{showData.leftRobotInfo}}</el-form-item>
                </el-form>
            </el-dialog>

            <el-dialog title="机器人生成管理" :visible.sync="showCreateVar" width="50%">
                <el-form label-position="right" label-width="160px" :model="showData">
                    <el-form-item label="生成机器人数:">
                        <el-input class="form-input" placeholder="请输入个数" v-model="createCount"></el-input>
                    </el-form-item>
                    <el-form-item label="信息库剩余量：">{{showData.leftRobotInfo}}</el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showCreateVar = false">取 消</el-button>
                    <el-button type="success" @click="creareConfirm">生成</el-button>
                </span>
            </el-dialog>
            <el-dialog title="机器人管理" :visible.sync="showEditMaxVar" width="50%">
                <el-form label-position="right" label-width="160px" :model="showData">
                    <el-form-item label="匹配个数上限修改:">
                        <el-input class="form-input" placeholder="请输入个数" v-model="maxAttendCount"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showEditMaxVar = false">取 消</el-button>
                    <el-button type="success" @click="editRobot">修改</el-button>
                </span>
            </el-dialog>
            <el-dialog title="准入比修改" :visible.sync="showEditRatioVar" width="50%">
                <el-form label-position="right" label-width="160px" :model="showData">
                    <el-form-item label="场次:">
                        <el-input
                            class="form-input"
                            placeholder
                            v-model="editData.levelName"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="开关:">
                        <el-switch
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            v-model="editData.CloseRobot"
                            active-value="1"
                            inactive-value="0"
                        ></el-switch>
                    </el-form-item>
                    <el-form-item label="低级准入比:">
                        <el-input class="form-input" placeholder="请输入准入比" v-model="editData.Low"></el-input>
                    </el-form-item>
                    <el-form-item label="高级准入比:">
                        <el-input class="form-input" placeholder="请输入准入比" v-model="editData.High"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showEditRatioVar = false">取 消</el-button>
                    <el-button type="success" @click="saveRobotRatio">修改</el-button>
                </span>
            </el-dialog>
            <el-dialog title="机器人信息" :visible.sync="showRobotInfo" width="50%">
                <el-form label-position="right" label-width="160px">
                    <el-form-item label="机器人昵称:">{{robotInfo.nickname}}</el-form-item>
                    <el-form-item label="showid:">{{robotInfo.showUID}}</el-form-item>
                    <el-form-item label="uid:">{{robotInfo.playerID}}</el-form-item>
                    <el-form-item label="机器人性别:">{{sex[robotInfo.gender]}}</el-form-item>
                    <el-form-item label="参与匹配次数:">{{robotInfo.totalBureau}}</el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    name: 'actor',
    data() {
        return {
            tableData: [],
            gamesConf: [],
            maxAttendCount: '',
            matchConfs: [],
            levels: { 1: '初级场', 2: '中级场', 3: '高级场', 4: '土豪场' },
            sex: { '1': '男', '2': '女' },
            winMultiMethodOption: [{ label: '范围区间', value: 1 }, { label: '随机固定倍数', value: 2 }],
            playId: '1',
            filterId: '',
            busyCount: '',
            showQueryVar: false,
            showCreateVar: false,
            showEditMaxVar: false,
            showEditRatioVar: false,
            showRobotInfo: false,
            editVisble: false,
            createCount: '',
            showData: {
                totalRobot: 0,
                freeCount: 0,
                busyCount: 0,
                leftRobotInfo: 0
            },
            robotInfo: {},
            editData: {
                High: 0,
                Low: 0,
                levelName: '',
                level: 0,
                CloseRobot: false
            }
        };
    },
    mounted() {
        this.initList();
    },
    methods: {
        initList() {
            this.getstatus();
            this.getTableList();
            this.getMatchConf();
        },

        getstatus() {
            let queryReq = {
                callm: 'robot',
                callp: 'query'
            };
            revoke('/index.php?m=CallProxy&p=callCommon', queryReq).then(
                res => {
                    if (res.code === 0) {
                        this.showData.totalRobot = res.data.totalRobot;
                        this.showData.freeCount = res.data.freeCount;
                        this.showData.busyCount = res.data.busyCount;
                        this.showData.leftRobotInfo = res.data.leftRobotInfo;
                        if (res.gamesConf) {
                            this.gamesConf = res.gamesConf;
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
        /* 生成机器人 */

        creareRobot() {
            let args = { count: this.createCount };
            let queryReq = {
                callm: 'robot',
                callp: 'createRobots',
                args: JSON.stringify(args)
            };
            revoke('/index.php?m=CallProxy&p=callCommon', queryReq).then(
                res => {
                    if (res.code === 0) {
                        this.$message(
                            '成功生成' + res.data.createdCount + '个机器人!',
                            '生成成功',
                            {}
                        );
                        this.showCreateVar = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
        /* 确认生成机器人 */
        creareConfirm() {
            this.$confirm('确认生成' + this.createCount + '个机器人吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.creareRobot();
                })
                .catch(() => {});
        },

        /* 修改配置 */
        editRobot() {
            let args = { maxAttendCount: this.maxAttendCount };
            let queryReq = {
                callm: 'robot',
                callp: 'editConf',
                args: JSON.stringify(args)
            };
            revoke('/index.php?m=CallProxy&p=callCommon', queryReq).then(
                res => {
                    if (res.code === 0) {
                        this.$message('修改成功', '信息', {});
                        this.getTableList();
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.showEditMaxVar = false;
                }
            );
        },
        reloadStatus() {
            this.getstatus();
            this.showQueryVar = true;
        },

        /* 修改准入比 */
        saveRobotRatio() {
            let args = {
                playId: this.playId,
                level: this.editData.level,
                ratioHigh: this.editData.High,
                ratioLow: this.editData.Low,
                CloseRobot: this.editData.CloseRobot
            };
            let queryReq = {
                callm: 'robot',
                callp: 'saveRobotRatio',
                args: JSON.stringify(args)
            };
            revoke('/index.php?m=CallProxy&p=callCommon', queryReq).then(
                res => {
                    if (res.code === 0) {
                        this.$message('修改成功', '信息', {});
                        this.getMatchConf();
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.showEditRatioVar = false;
                }
            );
        },
        /* 修改准入比 */
        showEditRatio(row) {
            this.showEditRatioVar = true;
            this.editData.High = row.RobotRatio.High;
            this.editData.Low = row.RobotRatio.Low;
            this.editData.levelName = this.levels[row.level];
            this.editData.CloseRobot = row.CloseRobot;
            this.editData.level = row.level;
        },

        getTableList() {
            let args = {
                callm: 'robot',
                callp: 'getConf'
            };
            revoke('/index.php?m=CallProxy&p=callCommon', args).then(res => {
                if (res.code === 0) {
                    // for
                    this.maxAttendCount = res.data.maxAttendCount;
                    this.tableData = res.data.initGameInfos;
                    for (let i in this.tableData) {
                        if (this.tableData[i].maxWinMultiN) {
                            this.tableData[i].maxWinMultiStr = this.tableData[i].maxWinMultiN.join(',');
                        }
                    }
                    if (res.data.gamesConf) {
                        this.gamesConf = res.data.gamesConf;
                    }
                }
            });
        },

        getMatchConf() {
            let args = { playId: this.playId };
            let data = {
                callm: 'robot',
                callp: 'getMatchConf',
                args: JSON.stringify(args)
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.matchConfs = res.data;
                }
            });
        },
        /* 改变选择 */

        changePlayId(val) {
            console.log(val);
            this.playId = val;
            this.getMatchConf();
        },
        /* 搜索机器人 */
        searchRobot() {
            let args = { showUID: this.filterId };
            let data = {
                callm: 'robot',
                callp: 'searchRobot',
                args: JSON.stringify(args)
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.showRobotInfo = true;
                    this.robotInfo = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        saveInitGameConf() {
            let initGameData = {};
            console.log(this.tableData);
            for (let i in this.tableData) {
                let temp = JSON.parse(JSON.stringify(this.tableData[i]));
                delete temp.gameCount;
                delete temp.maxStreakStr;
                delete temp.name;
                delete temp.gid;
                delete temp.winRateStr;
                delete temp.maxWinMultiMethodStr;
                delete temp.maxWinMulti;
                initGameData[this.tableData[i].gid] = temp;
            }
            let args = { 'initGameData': JSON.stringify(initGameData) };
            let data = {
                callm: 'robot',
                callp: 'editInitGameConf',
                args: JSON.stringify(args)
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.getTableList();
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
    width: 100px;
    margin: 0 5px 10px 0;
}
.nav-input {
    width: 170px;
    margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width: 200px !important;
}

.demo-form1{
    .edit-column{
        text-align: center;
        .edit-cell,span,.form-input{
            // float: left;
            width: 60px;
            height: 30px;
            line-height: 20px;
            vertical-align: middle;
        }
        span{
            display:inline-block;
            margin:0 10px;
            width: auto;
        }
        .form-input{
            width: 160px!important;
        }
    }
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
.delete-row {
    text-decoration: line-through;
    color: #aaaaaa;
}
.robot-wrap {
    .robot-num {
        float: left;
        margin-right: 20px;
    }
    .filter-container .filter-item {
        margin-bottom: 0;
    }
    .el-form-item {
        margin-bottom: 10px;
    }
    @media screen and (max-width: 1290px) {
        .demo-form-inline1 {
            &::after {
                clear: both;
                display: block;
                content: '';
            }
        }
    }
}

</style>
