<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>
                <el-form-item label></el-form-item>
                <el-form-item label="playerId:">
                    <el-input v-model="filterUid" class="form-input"></el-input>
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
                <el-table-column align="center" label="流水ID" prop="tradeid"></el-table-column>
                <el-table-column align="center" label="操作前" prop="beforebalance"></el-table-column>
                <el-table-column align="center" label="操作后" prop="afterbalance"></el-table-column>
                <el-table-column align="center" label="变化数量" prop="amount"></el-table-column>
                <el-table-column align="center" label="游戏" prop="gameName"></el-table-column>
                <el-table-column align="center" label="场次" prop="levelName"></el-table-column>
                <el-table-column align="center" label="创建时间" prop="tradetime"></el-table-column>
                <el-table-column align="center" label="状态" prop="statusName"></el-table-column>
            </el-table>
            <!-- <div class="block" style="margin: 20px 0;">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :pager-count="5"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage">
                </el-pagination>
            </div>-->
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'
import { dateRange } from '@/components/dateRange'
export default {
    name: 'actor',
    components: { dateRange },
    data() {
        return {
            // 日期插件
            initDate: new Date(),
            setRange: 7,
            startDate: '',
            endDate: '',
            tableData: [],
            gameLevelMap: [],
            filterTypes: [
                { type: 1, name: '显示id' },
                { type: 2, name: 'playid' },
                { type: 3, name: '手机号' },
                { type: 4, name: 'guid' }
            ],
            statusMap: { 0: '失败', 1: '成功' },
            // 玩家
            filterUid: '',
            filterType: 1,
            // 分页
            totalPage: 0,
            pageSize: 25,
            currentPage: 1
        }
    },
    created() {
        this.getGameLevelMap()
    },
    mounted() {
        // this.getTableList({
        //     page: this.currentPage,
        //     pageNum: this.pageSize
        // });
    },
    methods: {
        getGameLevelMap() {
            let data = {
                callm: 'config',
                callp: 'getGameLevelMap',
                args: JSON.stringify({ isAll: 1 })
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.gameLevelMap = res.data
                }
            })
        },
        getTableList(args) {
            if (this.filterUid == '') {
                this.$message('请输入玩家信息', '信息', {})
                return
            }
            args['startDate'] = this.startDate
            args['endDate'] = this.endDate
            args['playerId'] = this.filterUid

            revoke('/index.php?m=redticketRecord&p=getList', args).then(res => {
                if (res.code === 0) {
                    // this.totalPage = parseInt(res.data.total, 10);
                    let retData = res.data.list
                    // 表格数据格式format
                    for (let i in retData) {
                        let gameID = retData[i]['gameid']
                        let levelID = retData[i]['levelid']
                        retData[i]['statusName'] = this.statusMap[
                            retData[i]['status']
                        ]
                        retData[i]['gameName'] =
                            gameID == 0 ? '' : this.gameLevelMap[gameID]['name']
                        retData[i]['levelName'] =
                            gameID == 0
                                ? ''
                                : this.gameLevelMap[gameID]['level'][levelID]
                    }

                    this.tableData = retData
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
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.getTableList(data)
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.getTableList(data)
        },
        // 查找
        find() {
            this.currentPage = 1
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.getTableList(data)
        },
        // 跳到用户详情页面
        ToUserinfo(row, column, cell, event) {
            if (column.property === 'showUid') {
                this.$router.push({
                    name: 'userinfo',
                    params: {
                        filterUid: row.showUid,
                        filterType: 1
                    }
                })
            }
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
