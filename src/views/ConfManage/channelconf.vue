<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="渠道配置"></el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @click="openAdd">添加数据</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="渠道ID" prop="channel_code"></el-table-column>
                <el-table-column align="center" label="客户端类型" prop="sysname"></el-table-column>
                <el-table-column align="center" label="状态" prop="statusname"></el-table-column>
                <el-table-column align="center" label="渠道名称" prop="channel_name"></el-table-column>
                <el-table-column align="center" label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button
                            type="danger"
                            v-if="scope.row.status==1"
                            @click="handleStatus(scope.$index, scope.row,2)"
                        >停用</el-button>
                        <el-button
                            type="success"
                            v-if="scope.row.status==2"
                            @click="handleStatus(scope.$index, scope.row,1)"
                        >启用</el-button>
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑名称</el-button>
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
            <el-dialog
                title="修改名称"
                :visible.sync="editVisble"
                width="30%"
                :before-close="handleEditClose"
                :closeOnClickModal="clickclose"
            >
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="渠道名称">
                        <el-input class="form-input" v-model="selectData.channel_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="新增信息"
                :visible.sync="addVisble"
                width="30%"
                :before-close="handleAddClose"
            >
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="渠道ID">
                        <el-input class="form-input" v-model="addData.channel_code"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道名称">
                        <el-input class="form-input" v-model="addData.channel_name"></el-input>
                    </el-form-item>
                    <el-form-item label="客户端类型">
                        <el-radio v-model="addData.sys_id" label="1">安卓</el-radio>
                        <el-radio v-model="addData.sys_id" label="2">ios</el-radio>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirAdd">添 加</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'
export default {
    name: 'actor',
    data() {
        return {
            clickclose: false,
            tableData: [],
            dataStatus: [],
            editVisble: false,
            addVisble: false,
            selectData: {
                channel_name: '',
                status: 0
            },
            addData: {
                channel_name: '',
                channel_code: '',
                sys_id: ''
            },
            systype: {
                1: '安卓',
                2: 'ios'
            },
            statustype: {
                1: '启用',
                2: '停用'
            },
            totalPage: 0,
            pageSize: 10,
            currentPage: 1
        }
    },
    created() {
        this.selectOption()
    },
    mounted() {
        this.initList()
    },
    methods: {
        confirEdit() {
            revoke('/index.php?m=channelconf&p=edit', this.selectData).then(
                res => {
                    if (res.code === 0) {
                        this.editVisble = false
                        this.$message({
                            message: '编辑成功！',
                            type: 'success'
                        })
                        this.getTableList()
                    } else {
                        this.$message.error(res.msg)
                    }
                }
            )
        },
        selectOption() {
            let data = {}
            revoke('/index.php?m=CommConf&p=getConf', data).then(res => {
                console.log(res)
                if (res.code === 0) {
                    this.dataStatus = res.data.status
                }
            })
        },
        initList() {
            this.getTableList()
        },
        getTableList() {
            let args = {
                page: this.currentPage,
                pageNum: this.pageSize
            }
            revoke('/index.php?m=channelconf&p=getList', args).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                    for (let i in this.tableData) {
                        this.tableData[i].sysname = this.systype[
                            this.tableData[i].sys_id
                        ]
                        this.tableData[i].statusname = this.statustype[
                            this.tableData[i].status
                        ]
                    }
                }
            })
        },
        // 编辑用户信息
        handleEdit(index, row) {
            console.log(row)
            this.editVisble = true
            this.selectData.id = row.id
            this.selectData.channel_name = row.channel_name
            this.selectData.status = 0
        },

        handleStatus(index, row, status) {
            this.selectData.id = row.id
            this.selectData.status = status
            this.selectData.channel_name = ''
            revoke('/index.php?m=channelconf&p=edit', this.selectData).then(
                res => {
                    if (res.code === 0) {
                        this.editVisble = false
                        this.$message({
                            message: '编辑成功！',
                            type: 'success'
                        })
                        this.getTableList()
                    } else {
                        this.$message.error(res.msg)
                    }
                }
            )
        },

        // 弹出框close
        handleEditClose(done) {
            this.editVisble = false
        },
        // 弹出框close
        handleAddClose(done) {
            this.addVisble = false
        },
        openAdd() {
            this.addVisble = true
        },
        confirAdd() {
            revoke('/index.php?m=channelconf&p=add', this.addData).then(res => {
                if (res.code === 0) {
                    this.addVisble = false
                    this.$message({
                        message: '新增成功！',
                        type: 'success'
                    })
                    this.getTableList()
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val
            this.getTableList()
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val
            this.getTableList()
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
    width: 100px;
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
</style>
