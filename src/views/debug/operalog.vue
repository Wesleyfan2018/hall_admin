<template>
    <div class="app-containei">
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
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="操作人:">
                <el-select v-model="filterAid" placeholder="请选择">
                    <el-option
                        v-for="item in admin"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="find"></el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="操作日志"></el-form-item>
            <el-table border :data="logs">
                <el-table-column align="center" label="id" prop="id" width="70"></el-table-column>
                <el-table-column align="left" label="url" prop="url" width="400"></el-table-column>
                <el-table-column align="center" label="参数" prop="args"></el-table-column>

                <el-table-column align="center" label="时间" prop="cTimeFmt" width="190"></el-table-column>

                <el-table-column align="center" label="操作人" prop="adminName"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="catback(scope.row)">查看返回</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :pager-count="5"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage"
                ></el-pagination>
            </div>
        </el-form>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'
export default {
    data() {
        return {
            totalPage: 0,
            pageSize: 20,
            currentPage: 1,
            selectDate: [],
            filterAid: '',
            logs: [],
            admin: [] // 管理员列表，筛选用
        }
    },

    activated() {
        this.loadLog({ page: this.currentPage, pageNum: this.pageSize })
    },
    created() {
        this.loadAdmin()
    },
    methods: {
        // 加载历史记录
        loadLog(data) {
            console.log('test')
            data['stime'] = this.selectDate[0]
                ? parseInt(this.selectDate[0] / 1000, 10)
                : ''
            data['etime'] = this.selectDate[1]
                ? parseInt(this.selectDate[1] / 1000, 10)
                : ''
            data['aid'] = this.filterAid

            revoke('/index.php?m=operalog&p=getList', data).then(res => {
                if (res.code === 0) {
                    this.logs = res.data.list
                    this.totalPage = res.data.total
                } else {
                    this.logs = []
                    this.totalPage = 0
                }
            })
        },
        // 查找
        find() {
            this.currentPage = 1
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.loadLog(data)
        },
        catback(row) {
            this.$message({
                type: 'info',
                message: row.res
            })
        },
        loadAdmin() {
            revoke('/index.php?m=operalog&p=admin', {}).then(res => {
                console.log(res)
                if (res.code === 0) {
                    this.admin = res.data.list
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
            this.loadLog(data)
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.loadLog(data)
        }
    }
}
</script>