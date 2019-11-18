<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @click="updateCache">更新缓存</el-button>
                    <el-button class="filter-item" type="success" @click="openAdd">添加配置</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id" width="50"></el-table-column>
                <el-table-column align="center" label="名称" prop="name"></el-table-column>
                <el-table-column align="center" label="商户号(*)" prop="mchId" width="110"></el-table-column>
                <el-table-column align="center" label="wxAppid" prop="wxAppId"></el-table-column>
                <el-table-column align="center" label="客户端Appid(*)" prop="openAppId"></el-table-column>
                <el-table-column align="center" label="appSecret" prop="appSecret" width="300"></el-table-column>
                <el-table-column align="center" label="appKey(*)" prop="appKey" width="300"></el-table-column>
                <el-table-column align="center" label="渠道(*)" prop="channelId" width="70"></el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                title="编辑信息"
                :visible.sync="editVisble"
                width="30%"
                :before-close="handleEditClose"
            >
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="名称">
                        <el-input class="form-input" v-model="selectData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商户号">
                        <el-input class="form-input" v-model="selectData.mchId"></el-input>
                    </el-form-item>

                    <el-form-item label="wxAppId">
                        <el-input class="form-input" v-model="selectData.wxAppId"></el-input>
                    </el-form-item>
                    <el-form-item label="openAppId">
                        <el-input class="form-input" v-model="selectData.openAppId"></el-input>
                    </el-form-item>
                    <el-form-item label="appSecret">
                        <el-input class="form-input" v-model="selectData.appSecret"></el-input>
                    </el-form-item>
                    <el-form-item label="appKey">
                        <el-input class="form-input" v-model="selectData.appKey"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道ID">
                        <el-input class="form-input" v-model="selectData.channelId"></el-input>
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
                <el-form
                    label-position="right"
                    label-width="120px"
                    :model="addData"
                    class="dialog-form"
                >
                    <el-form-item label="名称">
                        <el-input class="form-input" v-model="addData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商户号">
                        <el-input class="form-input" v-model="addData.mchId"></el-input>
                    </el-form-item>

                    <el-form-item label="wxAppId">
                        <el-input class="form-input" v-model="addData.wxAppId"></el-input>
                    </el-form-item>
                    <el-form-item label="openAppId">
                        <el-input class="form-input" v-model="addData.openAppId"></el-input>
                    </el-form-item>
                    <el-form-item label="appSecret">
                        <el-input class="form-input" v-model="addData.appSecret"></el-input>
                    </el-form-item>
                    <el-form-item label="appKey">
                        <el-input class="form-input" v-model="addData.appKey"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道ID">
                        <el-input class="form-input" v-model="addData.channelId"></el-input>
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
    name: 'UserList',
    data() {
        return {
            status: [],
            tableData: [],
            totalPage: 0,
            pageSize: 10,
            currentPage: 1,
            editVisble: false,
            addVisble: false,
            selectData: {
                name: '',
                mchId: '',
                wxAppId: '',
                openAppId: '',
                appSecret: '',
                appKey: '',
                channelId: ''
            },
            addData: {
                name: '',
                mchId: '',
                wxAppId: '',
                openAppId: '',
                appSecret: '',
                appKey: '',
                channelId: ''
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
        confirEdit() {
            let args = {
                id: this.selectData.id,
                name: this.selectData.name,
                mchId: this.selectData.mchId,
                wxAppId: this.selectData.wxAppId,
                openAppId: this.selectData.openAppId,
                appSecret: this.selectData.appSecret,
                appKey: this.selectData.appKey,
                channelId: this.selectData.channelId
            }
            let data = {
                callm: 'wxconf',
                callp: 'edit',
                args: JSON.stringify(args)
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false
                    this.$message({
                        message: '编辑成功！',
                        type: 'success'
                    })
                    this.getTableList({
                        page: this.currentPage,
                        pageNum: this.pageSize
                    })
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        getTableList(args) {
            let data = {
                callm: 'wxconf',
                callp: 'getList',
                args: JSON.stringify(args)
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                }
            })
        },
        // 编辑用户信息
        handleEdit(index, row) {
            console.log(row)
            this.editVisble = true
            this.selectData.id = row.id
            this.selectData.name = row.name
            this.selectData.channelId = row.channelId
            this.selectData.mchId = row.mchId
            this.selectData.wxAppId = row.wxAppId
            this.selectData.openAppId = row.openAppId
            this.selectData.appSecret = row.appSecret
            this.selectData.appKey = row.appKey
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
            let data = {
                callm: 'wxconf',
                callp: 'add',
                args: JSON.stringify(this.addData)
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.addVisble = false
                    this.$message({
                        message: '新增用户成功！',
                        type: 'success'
                    })
                    this.getTableList({
                        page: this.currentPage,
                        pageNum: this.pageSize
                    })
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 发布上线
        updateCache() {
            this.popVisble = false
            this.$confirm('这会使配置立即生效,确认清空缓存？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.reqUpdate()
                })
                .catch(() => {})
        },
        reqUpdate() {
            let data = {
                callm: 'wxconf',
                callp: 'updateCache',
                args: JSON.stringify(this.addData)
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.addVisble = false
                    this.$message({
                        message: '更新成功',
                        type: 'success'
                    })
                    this.getTableList({
                        page: this.currentPage,
                        pageNum: this.pageSize
                    })
                } else {
                    this.$message.error(res.msg)
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
</style>
