<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input type="hidden" name="type" value="" v-model="filterType"></el-input>
                </el-form-item>
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>

                <el-form-item label="玩法：">
                    <el-select v-model="filterGame" placeholder="请选择">
                        <el-option v-for="(item, index) in gameMap" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getTableData"></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="success" @click="excelExport()">导出excel</el-button>
                </el-form-item>
            </el-form>

            <!-- table区 -->
            <div class="table-main">
                <el-table stripe border :data="tableData" v-loading="loading">
                    <!-- 通用表格样式，porp对应每一列的属性值, label对应表头名称 -->
                    <el-table-column align="center">
                        <el-table-column align="center" prop="collectdate" label="日期"></el-table-column>
                    </el-table-column>

                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import { revoke, exportToExcel } from '@/api/getApi';
import { dateRange } from '@/components/dateRange';
export default {
    name: 'warmRound',
    components: { dateRange },
    data() {
        return {
            scope: 'scope',
            // 表格loading
            loading: true,
            // 需要改成百分比形式
            headerList: [
                'recharge_num / login_num',
                'register_remain2 / register_num',
                'register_remain7 / register_num',
                'login_remain2 / login_num',
                'login_remain7 / login_num',
                'register_recharge_num / register_num'
            ],
            tableData: [],
            // 导出所需表头
            tHeader: [],
            filterVal: [],
            currentTag: 1,
            // 日期插件
            initDate: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1),
            setRange: 7,
            startDate: '',
            endDate: '',
            // 玩法
            gameMap: { 0: '全部' },
            filterGame: '0',
            filterType: '1'
        };
    },
    created() {
        this.initGameMap();
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        // 获取表格信息
        getTableData() {
            let self = this;
            let data = {
                startDate: self.startDate,
                endDate: self.endDate,
                gameId: self.filterGame,
                type: self.filterType
            };
            revoke('index.php?m=stat&p=warmRound', data).then(res => {
                if (res.code === 0) {
                    let data = res.data;
                    // 表格数据格式format
                    for (let i in data) {

                    }
                    self.tableData = data;
                    self.loading = false;
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res,
                        duration: 3000
                    });
                }
            });
        },
        // 切换tags
        changeTag(Num) {
            this.currentTag = Num;
            this.initEchart(Num);
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
        // 获取游戏
        initGameMap() {
            revoke('index.php?m=config&p=gameMap', { showAll: 1 }).then(res => {
                if (res.code === 0) {
                    this.gameMap = res.data;
                }
            });
        },
        // 渠道/版本选项
        handleChange(value) {
            this.channel_value = value;
        },
        // 数据格式修改
        splitStr(str) {
            let newStr = str.split('|');
            return newStr[1];
        }
    }
};
</script>
