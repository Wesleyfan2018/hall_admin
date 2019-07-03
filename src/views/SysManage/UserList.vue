<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="角色：">
                    <el-select v-model="actor" placeholder="请选择角色" style="width: 100px;margin: 0 5px 10px 0;">
                        <el-option
                            v-for="(i, t) in actors"
                            :key="(i, t)"
                            :label="i"
                            :value="t">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名：">
                    <el-input v-model="searchStr" placeholder="请输入用户姓名" style="width: 150px;margin: 0 5px 10px 0;" class="filter-item" @keyup.enter.native="searchName" />
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @keyup.enter="searchName" @click="searchName"></el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button class="filter-item" type="success" @keyup.enter="searchName" @click="searchName">添加用户</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id">
                </el-table-column>
                <el-table-column align="center" label="账户名" prop="name">
                </el-table-column>
                <el-table-column align="center" label="姓名" prop="real_name">
                </el-table-column>
                <el-table-column align="center" label="角色" prop="actorStr">
                </el-table-column>
                <el-table-column align="center" label="状态" prop="statusStr">
                </el-table-column>
                <el-table-column align="center" label="电话号码" prop="phone">
                </el-table-column>
                <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin: 20px 0;">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 25, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="编辑用户信息" :visible.sync="editVisble" width="30%" :before-close="handleClose">
            <el-form label-position="left" label-width="80px" :model="selectUser">
                <el-form-item label="姓名">
                    <el-input disabled v-model="selectUser.name"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="selectUser.actor">
                        <el-option
                            v-for="(i, t) in actors"
                            :key="(i, t)"
                            :label="i"
                            :value="t">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="重置密码">
                    <el-input placeholder="如需修改请输入新密码" v-model="rePassword"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input placeholder="请输入电话号码" v-model="selectUser.phone"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="selectUser.status">
                    <el-radio v-for="(i, t) in status" :key="(i, t)" :label="t">{{i}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisble = false">取 消</el-button>
                <el-button type="primary" @click="fuck">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@/utils/ajax';
import router from '@/router';
import { Enmd5 } from '@/utils/auth';
export default {
    name: 'UserList',
    data() {
        return {
            status: [],
            tableData: [],
            actors: [],
            actor: 0,
            totalPage: 0,
            pageSize: 5,
            searchStr: '',
            currentPage: 1,
            editVisble: false,
            rePassword: '',
            selectUser: {
                name: '',
                actor: '',
                status: '',
                password: '',
                phone: ''
            }
        };
    },
    created() {
        this.initList();
        this.selectOption();
    },
    methods: {
        fuck() {
            
            let data = {
                id: this.selectUser.id,
                real_name: this.selectUser.real_name,
                phone: this.selectUser.phone,
                actor: this.selectUser.actor,
                status: this.selectUser.status
            };
            data._sig = Enmd5(data);
            ajax.post('/hall-admin-new/index.php?m=user&p=edit&g=10000', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.$message({
                        message: '编辑成功！',
                        type: 'success'
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        selectOption() {
            let data = {};
            data._sig = Enmd5(data);
            ajax.post('/hall-admin-new/index.php?m=config&p=user&g=10000', data).then(res => {
                if (res.code === 0) {
                    this.actors = res.data.actor;
                    this.status = res.data.status;
                }
                if (res.code === -99) {
                    router.push({
                        path: '/login'
                    });
                }
            });
        },
        initList() {
            let self = this;
            let data = {
                actor: this.actor,
                name: '',
                page: self.currentPage,
                pageNum: self.pageSize,
            };
            data._sig = Enmd5(data);
            ajax.post('/hall-admin-new/index.php?m=user&p=lists&g=10000', data).then(res => {
                if (res.code === 0) {
                    self.tableData = res.data.list;
                    for (let i in self.tableData) {
                        self.tableData[i].actorStr = self.actors[parseInt(self.tableData[i].actor)];
                        self.tableData[i].statusStr = self.status[parseInt(self.tableData[i].status)];
                    }
                    self.totalPage = res.data.total;
                }
                if (res.code === -99) {
                    router.push({
                        path: '/login'
                    });
                }
            });
        },
        getTableList(data) {
            ajax.post('/hall-admin-new/index.php?m=user&p=lists&g=10000', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list;
                    for (let i in self.tableData) {
                        self.tableData[i].actorStr = self.actors[parseInt(self.tableData[i].actor)];
                        self.tableData[i].statusStr = self.status[parseInt(self.tableData[i].status)];
                    }
                    this.totalPage = res.data.total;
                }
                if (res.code === -99) {
                    router.push({
                        path: '/login'
                    });
                }
            });
        },
        // 编辑用户信息
        handleEdit(index, row) {
            this.editVisble = true;
            this.selectUser.id = row.id;
            this.selectUser.phone = row.phone;
            this.selectUser.password = this.rePassword;
            this.selectUser.real_name = row.real_name;
            this.selectUser.name = row.real_name + '(' + row.name + ')';
            this.selectUser.actor = parseInt(row.actor, 10);
            this.selectUser.status = parseInt(row.status, 10);
        },
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val;
            let data = {
                actor: 0,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize,
            };
            data._sig = Enmd5(data);
            this.getTableList(data);
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                actor: 0,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize,
            };
            data._sig = Enmd5(data);
            this.getTableList(data);
        },
        // 搜索
        searchName() {
            let data = {
                actor: this.actor,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize,
            };
            data._sig = Enmd5(data);
            this.getTableList(data);
        },
        // 弹出框close
        handleClose(done) {
            this.editVisble = false;
        }
    },
    watch: {
        statusRadio(val) {
            console.log(val);
        }
    }
};
</script>
