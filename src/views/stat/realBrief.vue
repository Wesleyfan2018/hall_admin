<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>

                <el-form-item label="地区：">
                    <el-select v-model="provId" placeholder="请选择">
                        <el-option
                            v-for="item in provMap"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="渠道：">
                    <el-select v-model="filterChannel" placeholder="请选择">
                        <el-option
                            v-for="(cname, cid) in channelMap"
                            :key="cid"
                            :value="cid"
                            :label="cname"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @click="getTableData"
                    ></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="success" @click="excelExport()">导出excel</el-button>
                </el-form-item>
            </el-form>

            <!-- table区 -->
            <div class="table-main">
                <h4 id="ji-ben-yong-fa" style="color:#606266;margin-bottom:18px;">
                    总注册人数：
                    <span class="el-rate__text" style="color: #409EFF">{{ registerCount }}</span>&nbsp;&nbsp;
                    总流水收入：
                    <span class="el-rate__text" style="color: #409EFF">{{ chargeTotal }}</span>
                </h4>
                <el-table stripe border :data="tableData" v-loading="loading">
                    <!-- 通用表格样式，porp对应每一列的属性值, label对应表头名称 -->
                    <el-table-column align="center">
                        <el-table-column align="center" prop="collectdate" label="日期"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="新增">
                        <el-table-column align="center" prop="register_count">
                            <template slot="header" :slot-scope="scope">
                                <span>新增注册</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="register_play_count">
                            <template slot="header" :slot-scope="scope">
                                <span>玩牌用户</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="register_play_rate">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，新增用户当中有过玩牌行为的用户数在新增用户当中的占比"
                                    placement="top"
                                >
                                    <span>玩牌率</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="register_avg_count">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，新增用户当中有过玩牌行为的用户的平均局数，公式=玩牌用户总局数/玩牌人数"
                                    placement="top"
                                >
                                    <span>平均玩牌局数</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column align="center" label="登录">
                        <el-table-column align="center" prop="login_count">
                            <template slot="header" :slot-scope="scope">
                                <span>登录用户</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="login_play_count">
                            <template slot="header" :slot-scope="scope">
                                <span>玩牌用户</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="login_play_rate">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，登录用户当中有过玩牌行为的用户数在登录用户当中的占比"
                                    placement="top"
                                >
                                    <span>玩牌率</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="login_avg_count">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，登录用户当中有过玩牌行为的用户的平均局数，公式=玩牌用户总局数/玩牌人数"
                                    placement="top"
                                >
                                    <span>平均玩牌局数</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column align="center" label="充值">
                        <el-table-column align="center" prop="recharge_count">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，有过付费行为的用户数"
                                    placement="top"
                                >
                                    <span>充值总人数</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="recharge_amount">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，用户付费总额"
                                    placement="top"
                                >
                                    <span>充值总金额</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column align="center" label="提现">
                        <el-table-column align="center" prop="draw_count">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，有过提现行为的用户数"
                                    placement="top"
                                >
                                    <span>活动提现总人数</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" prop="draw_amount">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，用户提现总额"
                                    placement="top"
                                >
                                    <span>活动提现总金额</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                         <el-table-column align="center" prop="cash_draw_count">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，有过提现行为的用户数"
                                    placement="top"
                                >
                                    <span>兑换商城提现总人数</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" prop="cash_draw_amount">
                            <template slot="header" :slot-scope="scope">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="统计当日，用户提现总额"
                                    placement="top"
                                >
                                    <span>兑换商城提现总金额</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>

                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import { revoke, exportToExcel } from '@/api/getApi';
import { AreaSelect } from '@/components/areaselect';
import { dateRange } from '@/components/dateRange';
export default {
    name: 'overview',
    components: { dateRange, AreaSelect },
    data() {
        return {
            scope: 'scope',
            // 表格loading
            loading: true,
            registerCount: '',
            chargeTotal: '',
            // 日期插件
            initDate: new Date(),
            setRange: 7,
            startDate: '',
            endDate: '',
            // 地区
            provMap: [
                { type: -1, name: '全部' },
                { type: 34, name: '安徽省' },
                { type: 51, name: '四川省' },
                { type: 0, name: '未选区' }
            ],
            provId: -1,
            tableHead: [
                { zh: '日期', name: 'collectdate' },
                { zh: '新增-新增注册', name: 'register_count' },
                { zh: '新增-玩牌用户', name: 'register_play_count' },
                { zh: '新增-玩牌率', name: 'register_play_rate' },
                { zh: '新增-平均玩牌局数', name: 'register_avg_count' },
                { zh: '登录-登录用户', name: 'login_count' },
                { zh: '登录-玩牌用户', name: 'login_play_count' },
                { zh: '登录-玩牌率', name: 'login_play_rate' },
                { zh: '登录-平均玩牌局数', name: 'login_avg_count' },
                { zh: '充值-充值总人数', name: 'recharge_count' },
                { zh: '充值-充值总金额', name: 'recharge_amount' },
                { zh: '提现-提现总金额', name: 'draw_count' },
                { zh: '提现-提现总金额', name: 'draw_amount' }
            ],
            // 渠道
            filterChannel: '0',
            channelMap: {},
            tableData: [],
            // 导出所需表头
            tHeader: [],
            filterVal: []
        };
    },
    created() {
        this.initChannel();
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        // 获取表格信息
        getTableData() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let self = this;
            let data = {
                startDate: self.startDate,
                endDate: self.endDate,
                channel: self.filterChannel,
                provId: self.provId
            };
            revoke('index.php?m=stat&p=getRealBrief', data).then(res => {
                if (res.code === 0) {
                    let list = res.data.list;
                    self.registerCount = res.data.registerCount;
                    self.chargeTotal = res.data.chargeTotal;
                    // 表格数据格式format
                    for (let i in list) {
                        let r_play_rate =
                            list[i]['register_play_count'] /
                            list[i]['register_count'];
                        let r_avg_count =
                            list[i]['register_desk_count'] /
                            list[i]['register_play_count'];
                        list[i]['register_play_rate'] = isNaN(r_play_rate)
                            ? 0
                            : (r_play_rate * 100).toFixed(2) + '%';
                        list[i]['register_avg_count'] = isNaN(r_avg_count)
                            ? 0
                            : r_avg_count.toFixed(2);

                        let l_play_rate =
                            list[i]['login_play_count'] / list[i]['login_count'];
                        let l_avg_count =
                            list[i]['login_desk_count'] /
                            list[i]['login_play_count'];
                        list[i]['login_play_rate'] = isNaN(l_play_rate)
                            ? 0
                            : (l_play_rate * 100).toFixed(2) + '%';
                        list[i]['login_avg_count'] = isNaN(l_avg_count)
                            ? 0
                            : l_avg_count.toFixed(2);
                    }
                    self.tableData = list;
                    self.loading = false;
                    loading.close();
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res,
                        duration: 3000
                    });
                }
            });
        },
        // excel数据导出
        excelExport() {
            let self = this;
            for (let i in self.tableHead) {
                self.tHeader.push(self.tableHead[i]['zh']);
                self.filterVal.push(self.tableHead[i]['name']);
            }
            exportToExcel(self.tHeader, self.filterVal, self.tableData);
        },
        // 日期选项
        selectDate(value) {
            this.startDate = value[0];
            this.endDate = value[1];
        },
        // init渠道/版本选项
        initChannel() {
            let data = {};
            revoke('index.php?m=stat&p=getChannel', data).then(res => {
                if (res.code === 0) {
                    this.channelMap = res.data;
                }
            });
        }
    }
};
</script>
