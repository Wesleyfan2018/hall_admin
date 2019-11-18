<template>
    <div class="app-containei">
        <div class="filter-container">
            <edit-header
                :sendData="diffData"
                :Approvers="Approvers"
                :ButConf="ButConf"
                @allLock="isAllLock"
            ></edit-header>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="游戏类型：">
                    <el-select v-model="filterGameId" placeholder="请选择游戏" class="form-input-min">
                        <el-option
                            v-for="(item, index) in allGameMap"
                            :key="index"
                            :label="item"
                            :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="比赛ID：">
                    <el-input v-model="filterChaseId" class="form-input" placeholder="请输入比赛id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @click="find"
                    ></el-button>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @click="openAdd">创建比赛</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="比赛id" prop="id"></el-table-column>
                <el-table-column align="center" label="游戏类型" prop="gameName"></el-table-column>
                <el-table-column align="center" label="比赛名称" prop="name"></el-table-column>
                <el-table-column align="center" label="报名费用" prop="applyFee"></el-table-column>
                <el-table-column align="center" label="关卡数" prop="levelsCount"></el-table-column>
                <el-table-column align="center" label="开放时间" prop="showTime"></el-table-column>
                <el-table-column align="center" label="状态" width="180px">
                    <template slot-scope="scope">
                        <el-tag
                            v-if="tableData[scope.$index].enableTime === 0 && tableData[scope.$index].enable == 0"
                        >未上线</el-tag>
                        <el-tag
                            v-if="tableData[scope.$index].enableTime > 0 && tableData[scope.$index].enable != 0"
                            type="success"
                        >在线</el-tag>
                        <el-tag
                            v-if="tableData[scope.$index].enableTime > 0 && tableData[scope.$index].enable == 0"
                            type="info"
                        >已下线</el-tag>
                        <span v-if="showTimeDown[scope.$index]">{{ content }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200px;">
                    <template slot-scope="scope">
                        <div id="oprBtn">
                            <el-button
                                type="primary"
                                size="small"
                                @click="handleEdit(scope.$index, scope.row, 'info')"
                            >查看</el-button>
                            <el-button
                                type="warning"
                                size="small"
                                @click="handleEdit(scope.$index, scope.row, 'edit')"
                            >编辑</el-button>
                            <el-button
                                v-if="tableData[scope.$index].enable ==0"
                                type="success"
                                size="small"
                                @click="onlineOpr(scope.$index, scope.row, 1)"
                            >上线</el-button>
                            <el-button
                                v-if="tableData[scope.$index].enable ==1"
                                type="danger"
                                size="small"
                                @click="downlineOpr(scope.$index, scope.row, 0)"
                            >下线</el-button>
                        </div>
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
            <!-- 比赛弹窗 -->
            <el-dialog
                :title="titleName"
                v-if="gameVisble"
                :visible.sync="gameVisble"
                width="50%"
                :before-close="handleAddClose"
                :close-on-click-modal="false"
            >
                <el-form
                    label-position="right"
                    label-width="130px"
                    :model="addData"
                    class="dialog-form"
                >
                    <el-form-item label="比赛名称">
                        <el-input :disabled="allLocked" class="form-input" v-model="addData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏类型">
                        <el-select
                            :disabled="allLocked"
                            v-model="addData.gameID"
                            placeholder="请选择游戏"
                            class="form-input-min"
                        >
                            <el-option
                                v-for="(item, index) in gameMap"
                                :key="index"
                                :label="item"
                                :value="index"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="比赛ID">
                        <el-input disabled class="form-input" v-model="addData.id"></el-input>
                    </el-form-item>
                    <el-form-item label="开放时间">
                        <el-time-picker
                            is-range
                            :disabled="allLocked"
                            v-model="addOpenTime"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            @change="addTimeChange"
                            style="width: 100%;"
                        ></el-time-picker>
                    </el-form-item>
                    <el-form-item label="报名费用">
                        <el-col :span="11">
                            <el-select
                                :disabled="allLocked"
                                v-model="addData.applyMoneyType"
                                placeholder="请选择"
                                class="form-input-min"
                            >
                                <el-option
                                    v-for="(item, index) in currencyMap"
                                    :key="index"
                                    :label="item"
                                    :value="index"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="line" :span="2"></el-col>
                        <el-col :span="11">
                            <el-input
                                :disabled="allLocked"
                                class="form-input"
                                type="number"
                                v-model="addData.applyMoneyCount"
                                min="0"
                            ></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="关卡数量">
                        <el-input
                            :disabled="allLocked"
                            class="form-input"
                            type="number"
                            v-model="levelCount"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="关卡积分">
                        <chase-point
                            :levelCount2="levelCount2"
                            :formType="formType"
                            :formObj="formObj"
                            ref="chasePoint"
                            @submitEve="submitPointEve"
                        ></chase-point>
                    </el-form-item>
                    <el-form-item label="关卡奖励">
                        <chase-reward
                            :allLocked="allLocked"
                            :levelCount2="levelCount2"
                            :formType="formType"
                            :formObj="formObj2"
                            ref="chaseReward"
                            @submitEve="submitRewardEve"
                        ></chase-reward>
                    </el-form-item>
                    <el-form-item label="复活设置">
                        <chase-set
                            :allLocked="allLocked"
                            :levelCount2="levelCount2"
                            :formType="formType"
                            :formObj="formObj3"
                            ref="chaseSet"
                            @submitEve="submitSetEve"
                        ></chase-set>
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
                    </el-form-item>-->

                    <!-- 复活配置 -->
                    <el-form-item label="每日免费复活次数">
                        <el-input
                            :disabled="allLocked"
                            class="form-input"
                            type="number"
                            v-model="addData.totalShareReliveCount"
                            min="0"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="复活分享链接">
                        <el-input
                            :disabled="allLocked"
                            type="textarea"
                            autosize
                            class="form-input"
                            v-model="addData.shareReliveURL"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="gameVisble = false">取 消</el-button>
                    <template v-if="formType==='add'">
                        <el-button type="success" @click="confirAdd">创 建</el-button>
                    </template>
                    <template v-if="formType==='edit'">
                        <el-button type="success" @click="confirAdd">保 存</el-button>
                    </template>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
import { EditHeader } from '../../components/editHeader';
import ChasePoint from '../../components/confManage/ChasePoint'; // 管卡积分
import ChaseReward from '../../components/confManage/ChaseReward'; // 关卡奖励
import ChaseSet from '../../components/confManage/ChaseSet'; // 复活设置
import { getTimeFormat } from '@/utils/common'; // 复活设置
import { debuglog, types } from 'util';
export default {
    components: { EditHeader, ChasePoint, ChaseReward, ChaseSet },
    name: 'chaseRace',
    data() {
        return {
            diffData: { syncnewJson: '', syncoldJson: '' },
            Approvers: [],
            ButConf: { copyBut: 1, syncBut: 0, approver: 0 }, // 不需要审批
            approvalId: 1, // 流程id写死闯关赛tag写死1
            confKey: 'ChaseRace', // 配置中心key写死闯关赛tag
            confTable: 't_race_config', // 配置中心对应表名写死

            totalTime: 5, // 记录具体倒计时时间
            content: '上线倒计时：5s', // 按钮里显示的内容
            showTimeDown: [],
            titleName: '新增比赛',
            levelCount2: 1,
            formType: 'add', // add：新增   info:查看     edit:编辑
            formObj: [], // 关卡积分
            formObj2: [],
            formObj3: [],
            // 奖励类型
            currencyMap: { 1: '金豆', 5: '红包券' },
            // 是否可复活
            reliveMap: [
                { label: '可复活', value: 1 },
                { label: '不可复活', value: 0 }
            ],
            gameMap: { 2: '血战换三张', 2002: '跑得快' },
            allGameMap: { 0: '全部', 2: '血战换三张', 2002: '跑得快' },
            status: [],
            filterGameId: '0',
            filterChaseId: '',
            tableData: [],
            // 保留原始json配置
            initConfList: {},
            totalPage: 0,
            pageSize: 10,
            currentPage: 1,
            editVisble: false,
            gameVisble: false,
            // 关卡数量
            levelCount: 1,
            selectData: {
                name: '',
                mchId: '',
                wxAppId: '',
                openAppId: '',
                appSecret: '',
                appKey: ''
            },
            addData: {
                id: '',
                name: '',
                gameID: '',
                enableTime: '',
                enable: '0',
                openTime: [],
                applyMoneyType: '1',
                applyMoneyCount: 0,
                totalShareReliveCount: '',
                shareReliveURL: '',
                levels: [],
                levelPoint: [],
                levelAward: [],
                levelRelive: [],
                clearCountIncrFactor: [],
                clearAwardIncrFactor: []
            },
            addOpenTime: '',
            curChaseId: '',
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
    created() {
        this.initGameMap();
    },
    mounted() {
        // 给审批列表赋值
        this.loadApproval();
        this.diff();
        this.syncConfDiff();
    },
    methods: {
        // 重置弹窗数据
        resetDialogData() {
            this.formObj = [];
            this.formObj2 = [];
            this.formObj3 = [];
            this.levelCount2 = 1; // 传入弹窗的关卡数量恢复为1
        },
        // 获取游戏
        initGameMap() {
            let that = this;
            let data = {
                callm: 'config',
                callp: 'gameMap',
                args: JSON.stringify({ isAll: 0 })
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0 && res.data) {
                    let retData = res.data;
                    // 去掉好友房
                    delete retData[4001];
                    // that.gameMap = retData;
                    //  that.allGameMap = Object.assign({}, that.allGameMap, res.data);
                }

                // 获取比赛列表
                that.getConfigList({
                    page: that.currentPage,
                    pageNum: that.pageSize
                });
            });
        },
        isAllLock(val) {
            this.allLocked = val;
        },
        // 创建比赛日期选项
        addTimeChange(value) {
            this.addOpenTime = [Date.parse(value[0]), Date.parse(value[1])];
            this.addData.openTime = [
                this.getTimeStamp(value[0]),
                this.getTimeStamp(value[1])
            ];
        },
        // 获取时间的秒数
        getTimeStamp(date) {
            let h = date.getHours(); // 时
            let minute = date.getMinutes(); // 分
            let s = date.getSeconds(); // 秒
            return h * 3600 + minute * 60 + s;
        },
        // 秒数转时间
        secondToTime(s) {
            let t;
            let hour = Math.floor(s / 3600);
            let min = Math.floor(s / 60) % 60;
            let sec = s % 60;
            if (hour < 10) {
                t = '0' + hour + ':';
            } else {
                t = hour + ':';
            }

            if (min < 10) {
                t += '0';
            }
            t += min + ':';
            if (sec < 10) {
                t += '0';
            }
            t += sec.toFixed(0);
            return t;
        },
        // 获取关卡积分的值
        submitPointEve(val) {
            this.formObj = val;
        },
        // 获取关卡奖励的值
        submitRewardEve(val) {
            this.formObj2 = val;
        },
        // 获取复活设置的值
        submitSetEve(val) {
            this.formObj3 = val;
        },
        // 保存创建/修改比赛
        confirAdd() {
            // 获取关卡积分/关卡奖励/复活设置的值
            this.$refs.chasePoint.submitEve();
            this.$refs.chaseReward.submitEve();
            this.$refs.chaseSet.submitEve();
            this.addData.levelPoint = this.formObj;
            this.addData.levelAward = this.formObj2;
            this.addData.levelRelive = this.formObj3;
            console.log(this.formObj3);
            console.log(this.formObj2);
            // 检测默认值
            if (this.addCheckValid() === false) {
                return false;
            }

            let data = {
                id: this.curChaseId,
                value: JSON.stringify(this.addData)
            };

            let that = this;
            revoke('/index.php?m=chaserace&p=save', data).then(res => {
                if (res.code === 0) {
                    this.gameVisble = false;
                    this.$message({
                        message: '成功！',
                        type: 'success'
                    });

                    // 刷新列表
                    that.getConfigList({
                        page: that.currentPage,
                        pageNum: that.pageSize
                    });
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
            if (this.addData.openTime.length <= 0) {
                this.$message.error('请选择开放时间！');
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
                appKey: this.selectData.appKey
            };
            let data = {
                callm: 'wxconf',
                callp: 'edit',
                args: JSON.stringify(args)
            };

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
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
            });
        },
        // 查找
        find() {
            this.currentPage = 1;
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize,
                gameId: this.filterGameId,
                chaseId: this.filterChaseId
            };
            this.getConfigList(data);
        },
        // 获取配置列表
        getConfigList(args) {
            let self = this;
            revoke('/index.php?m=chaserace&p=getList', args).then(res => {
                if (res.code === 0 && res.data) {
                    let retData = res.data.list;
                    self.initConfList = res.data.init;
                    for (let i = 0; i < retData.length; i++) {
                        let retDateItem = retData[i];
                        let curGameId = parseInt(retDateItem['gameID']);
                        retDateItem['gameName'] = self.gameMap[curGameId];
                        let stime = retDateItem['openTime'][0];
                        let etime = retDateItem['openTime'][1];
                        // console.log(self.secondToTime(stime), self.secondToTime(etime));
                        // retDateItem['showTime'] = getTimeFormat(new Date(stime),'hh-mm-ss') + '-' + getTimeFormat(new Date(etime),'hh-mm-ss');
                        retDateItem['showTime'] =
                            self.secondToTime(stime) +
                            '-' +
                            self.secondToTime(etime);
                        retDateItem['applyFee'] =
                            self.currencyMap[retDateItem['applyMoneyType']] +
                            ' - ' +
                            retDateItem['applyMoneyCount'];
                        self.$set(self.showTimeDown, i, false);
                    }
                    self.tableData = retData;
                    this.totalPage = res.data.total;
                    // 隐藏复制按钮
                    this.ButConf['copyBut'] = 0;
                }
            });
        },
        // 编辑、查看
        handleEdit(index, row, type) {
            if (type === 'info') {
                this.allLocked = true;
            } else {
                this.allLocked = false;
            }
            // console.log(row);

            this.curChaseId = row.chaseId;
            this.addData.name = row.name;
            this.addData.gameID = row.gameID.toString();
            this.addData.id = row.id;
            let stime = this.secondToTime(row.openTime[0]);
            let etime = this.secondToTime(row.openTime[1]);
            stime = '2019-10-11 ' + stime;
            etime = '2019-10-11 ' + etime;
            this.addOpenTime = [stime, etime];
            this.addData.openTime = [row.openTime[0], row.openTime[1]];
            this.addData.applyMoneyType = row.applyMoneyType.toString();
            this.addData.applyMoneyCount = row.applyMoneyCount;
            this.levelCount = row.levelsCount;
            this.addData.totalShareReliveCount = row.totalShareReliveCount;
            this.addData.shareReliveURL = row.shareReliveURL;
            this.addData.enable = row.enable == true ? 1 : 0;
            this.addData.enableTime = row.enableTime;

            // 重置组件数据
            this.resetDialogData();
            this.levelCount2 = row.levels.length; // 需要重置回去
            for (let i = 0; i < row.levels.length; i++) {
                let item = row.levels[i];
                this.formObj[i] = {
                    initScore: item.initScore,
                    upgradeScore: item.upgradeScore,
                    eliminateScore: item.eliminateScore
                };
                this.formObj2[i] = {
                    awardType: item.awardType,
                    awardMoneyType: item.awardMoneyType,
                    awardItemID: item.awardItemID,
                    awardCount: item.awardCount
                };
                let enableRelive = item.enableRelive == true ? 1 : 0;
                this.formObj3[i] = {
                    enableRelive: enableRelive,
                    reliveMoneyType: item.reliveMoneyType,
                    reliveMoney: item.reliveMoney
                };
            }
            // console.log(this.formObj);

            // 设置弹窗为编辑类型
            this.formType = type; // add：新增   info:查看     edit:编辑
            this.gameVisble = true;
        },
        // 上线操作
        onlineOpr(index, row, status) {
            // 倒计时
            this.$set(this.showTimeDown, index, true);
            this.countDown(index, row.chaseId, status);
        },
        // 下线操作
        downlineOpr(index, row, status) {
            this.syncLocalConfig(row.chaseId, status);
        },
        // 同步本地配置
        syncLocalConfig(id, status) {
            let message = status == 1 ? '上线成功' : '下线成功';
            let data = {
                id: id,
                status: status
            };

            let self = this;
            revoke('/index.php?m=chaserace&p=status', data).then(res => {
                if (res.code === 0) {
                    this.gameVisble = false;
                    this.$message({
                        message: message,
                        type: 'success'
                    });
                    // 刷新配置
                    self.find();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 倒计时
        countDown(index, id, status) {
            let self = this;
            let clock = window.setInterval(() => {
                self.content = '上线倒计时：' + self.totalTime + 's';
                if (self.totalTime < 0) {
                    window.clearInterval(clock);
                    self.$set(self.showTimeDown, index, false);
                    // 修改配置
                    this.syncLocalConfig(id, status);
                } else {
                    self.totalTime--;
                }
            }, 1000);
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
        // handleEditClose(done) {
        //     this.editVisble = false;
        // },
        // 弹出框close
        handleAddClose(done) {
            this.gameVisble = false;
        },
        openAdd() {
            this.addData.id = new Date().getTime();
            this.formType = 'add';
            this.gameVisble = true;
        },
        // 发布上线
        updateCache() {
            this.popVisble = false;
            this.$confirm('这会使配置立即生效,确认清空缓存？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.reqUpdate();
                })
                .catch(() => {});
        },
        reqUpdate() {
            let data = {
                callm: 'wxconf',
                callp: 'updateCache',
                args: JSON.stringify(this.addData)
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.gameVisble = false;
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
            });
        },

        loadApproval() {
            let data = { id: this.approvalId };
            // 获取审批人
            revoke('/index.php?m=approval&p=getApproval', data).then(res => {
                if (res.code === 0) {
                    this.Approvers = res.data.approver;
                }
            });
        },
        diff() {
            let data = { key: this.confKey, table: this.confTable };
            revoke('/index.php?m=CommConf&p=diffAll', data).then(res => {
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
            let data = { key: this.confKey, table: this.confTable };
            // 获取同步配置对比
            revoke('/index.php?m=CommConf&p=syncConfDiff', data).then(res => {
                if (res.code === 0) {
                    console.log(res);
                    this.diffData['syncnewJson'] = res.data.newJson;
                    this.diffData['syncoldJson'] = res.data.oldJson;
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
            // console.log(data);return;
            revoke('/index.php?m=CommConf&p=intranetSendAll', data).then(
                res => {
                    if (res.code === 0) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        // 重新加载
                        // this.load();
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
        // 正式服务器发布不经过审批
        officialSend() {
            let data = {};
            data['key'] = this.confKey;
            // console.log(data);return;
            revoke('/index.php?m=CommConf&p=officialSendAll', data).then(
                res => {
                    if (res.code === 0) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        }
    },
    watch: {
        // 根据关卡数量，显示关卡积分/关卡奖励/复活设置的表格行数
        levelCount: function(newVal, oldVal) {
            let _newVal = Number(newVal);
            if (_newVal <= 100 && _newVal >= 1) { this.levelCount2 = _newVal }
            else if (_newVal < 1) {
                this.$message.error('关卡数量不能小于1');
                this.levelCount = 1;
                this.levelCount2 = 1;
            }
            else if (_newVal > 100) {
                this.$message.error('关卡数量最大可设置为100');
                this.levelCount = Number(oldVal);
                this.levelCount2 = Number(oldVal);
            }

            // console.log(newVal, this.levelCount2);
        },
        // 修改弹窗标题
        formType: function(newVal) {
            if (newVal === 'add') {
                this.titleName = '新增比赛';
            } else if (newVal === 'edit') {
                this.titleName = '编辑比赛';
            } else {
                this.titleName = '查看比赛';
            }
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
.el-textarea {
    width: 100% !important;
}
#oprBtn {
    margin: 0;
    text-align: left;
}
#oprBtn .el-button {
    margin-left: 1px;
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
.form-global {
    border-left: 1px solid #eee;
    border-top: 1px solid #eee;
    * {
        padding: 0;
        margin: 0;
    }
    .form-no-data {
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
        text-align: center;
        line-height: 60px;
        color: #999;
    }
    &.info {
        input {
            border: none;
            text-align: center;
        }
    }
}
.form-global ul {
    width: 100%;
    min-width: 400px;
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0;
    &.theader {
        background: #eee;
        li {
            height: 40px;
            line-height: 40px;
            color: #999;
        }
    }
}
.form-global ul li {
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
    &:first-child {
        flex: none;
        width: 80px;
    }
    input {
        width: 80%;
        margin: 10px 10%;
        padding: 5px 10px;
        outline: none;
        height: 40px !important;
        box-sizing: border-box;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        &:focus {
            border-color: #409eff;
        }
    }
}
</style>
