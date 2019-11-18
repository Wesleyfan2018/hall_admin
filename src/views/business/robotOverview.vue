<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>
                <el-form-item label="玩法：">
                    <el-select v-model="game" placeholder="请选择玩法" class="nav-select">
                        <el-option v-for="(item,i) in gameList" :key="i" :label="item" :value="i"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @click="find"
                    ></el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData" @cell-dblclick="ToUserinfo">
                <el-table-column align="center" label="日期" prop="collectdate" class-name="a-hover"></el-table-column>
                <el-table-column align="center" label="场次" prop="levelid">
                    <template slot-scope="scope">{{Level[scope.row.levelid]}}</template>
                </el-table-column>
                <el-table-column align="center" label="机器人等级">
                    <template slot-scope="scope">{{robotLevel[scope.row.robot_level]}}</template>
                </el-table-column>
                <el-table-column align="center" label="机器人牌局数" prop="robot_desk_count"></el-table-column>
                <el-table-column align="center" label="机器人盈局数" prop="robot_win_desk_count"></el-table-column>
                <el-table-column align="center" label="机器人胜率" prop="robot_win_rate"></el-table-column>
                <el-table-column align="center" label="机器人嬴豆" prop="robot_win_coin_count"></el-table-column>
                <el-table-column align="center" label="机器人输豆" prop="robot_lose_coin_count"></el-table-column>
                <el-table-column align="center" label="机器人净胜豆" prop="robot_diff_coin_count"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'
import { dateRange } from '@/components/dateRange'
export default {
    components: { dateRange },
    data() {
        return {
            // 日期插件
            initDate: new Date(),
            setRange: 7,
            startDate: '',
            game: '1',
            robotLevel: { 1: '初级', '2': '高级' },
            Level: { 1: '新手场', 2: '普通场', 3: '精英场', 4: '土豪场' }, //场次
            endDate: '',
            tableData: [], // 默认3个月
            gameList: []
        }
    },
    mounted() {
        this.getTableList()
        this.loadGame()
    },
    methods: {
        getTableList() {
            var data = {}
            data['startDate'] = this.startDate
            data['endDate'] = this.endDate
            data['playId'] = this.game
            revoke('/index.php?m=robot&p=overview', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list
                } else {
                    this.$message(res.msg, '信息', {})
                    return
                }
            })
        },
        // 日期选项
        selectDate(value) {
            this.startDate = value[0]
            this.endDate = value[1]
        },
        // 查找
        find() {
            this.currentPage = 1
            this.getTableList()
        },

        loadGame() {
            revoke('/index.php?m=config&p=gameMap', {}).then(res => {
                if (res.code === 0) {
                    this.gameList = res.data
                }
            })
        }
    }
}
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

/*保留换行*/
.el-table .cell {
    white-space: pre-line;
}
.a-hover:hover {
    cursor: pointer;
    text-decoration: solid;
    color: #409eff;
}
</style>
