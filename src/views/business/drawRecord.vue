<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <el-date-picker
                        v-model="selectDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="提现状态：">
                    <el-select v-model="filterStatusType" placeholder="请选择">
                        <el-option
                            v-for="item in statusTypes"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="playerID：">
                    <el-input v-model="playerId" class="form-input"></el-input>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="phone" class="form-input"></el-input>
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
                <el-table-column align="center" label="记录ID" prop="recordID"></el-table-column>
                <el-table-column align="center" label="玩家ID" prop="playerID" class-name="a-hover"></el-table-column>
                <el-table-column align="center" label="昵称" prop="nickname"></el-table-column>
                <el-table-column align="center" label="账户ID" prop="accountID"></el-table-column>
                <el-table-column align="center" label="手机号码" prop="phone"></el-table-column>
                <el-table-column align="center" label="提现金额" prop="drawAmount"></el-table-column>
                <el-table-column align="center" label="申请时间" prop="applyTime"></el-table-column>
                <el-table-column align="center" label="审核时间" prop="auditTime"></el-table-column>
                <el-table-column align="center" label="提现状态" prop="statusName"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-if="tableData[scope.$index].status==3 "
                            type="primary"
                            size="medium"
                            @click="viewReason(scope.row)"
                        >查看原因</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin: 20px 0;">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :pager-count="5"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'
export default {
    name: 'actor',
    data() {
        return {
            tableData: [], // 默认3个月
            playerId: '',
            phone: '',
            filterStatusType: -1,
            totalPage: 0,
            statusTypes: [
                { type: -1, name: '全部' },
                { type: 1, name: '审核中' },
                { type: 2, name: '已到账' },
                { type: 3, name: '已拒绝' }
            ],
            pageSize: 25,
            currentPage: 1,
            selectDate: [
                new Date().setTime(
                    new Date().getTime() - 3600 * 1000 * 24 * 90
                ),
                new Date()
            ],
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            )
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            }
        }
    },
    mounted() {
        this.getTableList({
            page: this.currentPage,
            pageNum: this.pageSize
        })
    },
    methods: {
        getTableList(args) {
            args['stime'] = parseInt(this.selectDate[0] / 1000, 10)
            args['etime'] = parseInt(this.selectDate[1] / 1000, 10)
            args['status'] = this.filterStatusType
            args['playerId'] = this.playerId
            args['phone'] = this.phone

            let data = {
                callm: 'commonlog',
                callp: 'getPwdrList',
                args: JSON.stringify(args)
            }

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list
                    this.totalPage = parseInt(res.data.total, 10)
                }
            })
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
        // 查看失败原因
        viewReason(row) {
            this.$alert(row.rejectReason, '失败原因', {})
        },
        // 跳到用户详情页面
        ToUserinfo(row, column, cell, event) {
            if (column.property === 'uid') {
                console.log(row.uid)
                this.$router.push({
                    name: 'userinfo',
                    params: {
                        filterUid: row.uid,
                        filterType: 2 // playid
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
