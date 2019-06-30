<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-input v-model="input1" placeholder="请输入关键字" style="width: 200px;margin: 0 5px 10px 0;" class="filter-item" />
            <el-button class="filter-item" type="primary" icon="el-icon-search">
                Search
            </el-button>
            <el-table
                border
                :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%">
                <el-table-column
                label="Date"
                prop="date">
                </el-table-column>
                <el-table-column
                label="Name"
                prop="name">
                </el-table-column>
                <el-table-column
                align="right">
                <!-- <template slot="header" slot-scope="scope"> -->
                <template slot="header">
                    <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin: 20px 0;">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="4">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'UserList',
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            search: '',
            input1: '',
            currentPage4: 4
        };
    },
    methods: {
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }
    }
};
</script>
<style lang="scss">
// .app-container {
//     padding: 20px;
// }
// .filter-container {
//   padding-bottom: 10px;

//   .filter-item {
//     display: inline-block;
//     vertical-align: middle;
//     margin-bottom: 10px;
//   }
// }
</style>
