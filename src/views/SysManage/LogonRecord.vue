<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="type" label="登录类型"></el-table-column>
                <el-table-column prop="from_ip" label="登录ip"></el-table-column>
                <el-table-column prop="time" label="时间"></el-table-column>
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
                    :total="totalPage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
import router from '@/router';
export default {
    data() {
        return {
            tableData: [],
            totalPage: 0,
            pageSize: 10,
            currentPage: 1,
        };
    },
    created() {
        this.initList();
    },
    methods: {
        initList() {
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            };
            this.getTableList(data);
        },
        // 获取表格信息
        getTableList(data) {
            revoke('/hall-admin-new/index.php?m=login&p=userLog', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list;
                    this.totalPage = res.data.total;
                }
                if (res.code === -99) {
                    router.push({
                        path: '/login'
                    });
                }
            });
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
        }
    }
};
</script>
