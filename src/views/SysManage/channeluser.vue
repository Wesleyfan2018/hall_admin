<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="渠道：">
                    <el-select v-model="channel_code" placeholder="请选择渠道" class="nav-select">
                        <el-option
                            v-for="(i, t) in schannels"
                            :key="(i.id, t)"
                            :label="i.name"
                            :value="i.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名：">
                    <el-input
                        v-model="searchStr"
                        placeholder="请输入用户姓名"
                        class="filter-item nav-input"
                        @keyup.enter.native="searchName"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @keyup.enter="searchName"
                        @click="searchName"
                    ></el-button>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button
                        class="filter-item"
                        type="success"
                        @keyup.enter="searchName"
                        @click="openAdd"
                    >添加账号</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id"></el-table-column>
                <el-table-column align="center" label="账户名" prop="username"></el-table-column>
                <el-table-column align="center" label="姓名" prop="name"></el-table-column>
                <el-table-column align="center" label="渠道" prop="channelStr"></el-table-column>
                <el-table-column align="center" label="状态" prop="statusStr"></el-table-column>
                <el-table-column align="center" label="手机" prop="phone"></el-table-column>
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
                title="编辑用户信息"
                :visible.sync="editVisble"
                width="30%"
                :before-close="handleEditClose"
            >
                <el-form label-position="right" label-width="120px" :model="selectUser">
                    <el-form-item label="姓名">
                        <el-input class="form-input" v-model="selectUser.name"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道">
                        <el-select class="form-input" v-model="selectUser.channel_code">
                            <el-option
                                v-for="(i, t) in channels"
                                :key="(i.id, t)"
                                :label="i.name"
                                :value="i.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="重置密码">
                        <el-input class="form-input" placeholder="如需修改请输入新密码" v-model="rePassword"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <el-input
                            class="form-input"
                            placeholder="请输入电话号码"
                            v-model="selectUser.phone"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-radio-group v-model="selectUser.status">
                            <el-radio v-for="(i, t) in status" :key="(i, t)" :label="t">{{i}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="新增用户信息"
                :visible.sync="addVisble"
                width="30%"
                :before-close="handleAddClose"
            >
                <el-form
                    label-position="right"
                    label-width="120px"
                    :model="addUser"
                    class="dialog-form"
                >
                    <el-form-item label="账号名">
                        <el-input class="form-input" v-model="addUser.username"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input class="form-input" v-model="addUser.name"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道">
                        <el-select
                            class="form-input"
                            v-model="addUser.channel_code"
                            placeholder="请选择渠道"
                        >
                            <el-option
                                v-for="(i, t) in channels"
                                :key="(i.id, t)"
                                :label="i.name"
                                :value="i.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设置密码">
                        <el-input
                            class="form-input"
                            type="password"
                            placeholder="请设置密码"
                            v-model="addUser.password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <el-input class="form-input" placeholder="请输入电话号码" v-model="addUser.phone"></el-input>
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
            status: { '0': '正常', '1': '封禁' },
            tableData: [],
            channels: [],
            schannels: [], // 单独要全部的选项
            channel_code: '0',
            totalPage: 0,
            pageSize: 10,
            searchStr: '',
            currentPage: 1,
            editVisble: false,
            addVisble: false,
            rePassword: '',
            selectUser: {
                name: '',
                channel_code: '',
                status: '',
                password: '',
                phone: ''
            },
            addUser: {
                name: '',
                username: '',
                channel_code: '',
                password: '',
                phone: ''
            }
        }
    },
    activated() {
        this.selectOption()
    },
    mounted() {
        this.getTableList()
    },
    methods: {
        confirEdit() {
            let data = {
                id: this.selectUser.id,
                name: this.selectUser.name,
                phone: this.selectUser.phone,
                channel_code: this.selectUser.channel_code,
                password: this.rePassword,
                status: this.selectUser.status
            }
            revoke('/index.php?m=ChannelUser&p=edit', data).then(res => {
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
            })
        },
        selectOption() {
            let data = { key: 1 }
            revoke('/index.php?m=config&p=channel', data).then(res => {
                // console.log(res)
                if (res.code === 0) {
                    this.channels = res.data
                    // 为啥这样写，因为vue变量是指针拷贝
                    this.schannels = JSON.parse(JSON.stringify(this.channels))
                    this.schannels[0] = { id: '0', name: '全部' }
                }
            })
        },

        getTableList() {
            let data = {
                channel_code: this.channel_code,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize
            }
            revoke('/index.php?m=ChannelUser&p=lists', data).then(res => {
                if (res.code === 0) {
                    let tableData = res.data.list

                    for (let i in tableData) {
                        tableData[i].channelStr = this.channels[
                            tableData[i].channel_code
                        ]
                            ? this.channels[tableData[i].channel_code].name
                            : ''
                        tableData[i].statusStr = this.status[
                            tableData[i].status
                        ]
                    }
                    this.tableData = tableData
                    this.totalPage = res.data.total
                }
            })
        },
        // 编辑用户信息
        handleEdit(index, row) {
            console.log(row)
            this.editVisble = true
            this.selectUser.id = row.id
            this.selectUser.channel_code = row.channel_code
            this.selectUser.phone = row.phone
            this.selectUser.password = this.rePassword
            this.selectUser.name = row.name
            this.selectUser.status = row.status
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
        },
        // 搜索
        searchName() {
            this.getTableList()
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
            revoke('/index.php?m=ChannelUser&p=add', this.addUser).then(res => {
                if (res.code === 0) {
                    this.addVisble = false
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    })
                    this.getTableList()
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
