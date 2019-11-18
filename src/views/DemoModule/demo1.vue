<template>
    <div class="app-containei">
        <div class="filter-container">
            <!-- navbar区 -->
            <div class="table-navbar">
                <el-form :inline="true" class="demo-form-inline">
                    <!-- 地区选择select -->
                    <el-form-item label="地区：">
                        <area-select
                            :isMultiple="area_multiple"
                            :has_area="isHasArea"
                            @areaValue="selectArea"
                            :initArea="initArea"
                        ></area-select>
                    </el-form-item>
                    <!-- 通用select样式 -->
                    <el-form-item label="角色：">
                        <el-select v-model="actor" placeholder="请选择角色" class="nav-select">
                            <el-option v-for="(i, t) in actors" :key="(i, t)" :label="i" :value="t"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 通用input样式 -->
                    <el-form-item label="用户名：">
                        <el-input
                            v-model="searchStr"
                            placeholder="请输入用户姓名"
                            class="filter-item nav-input"
                            @keyup.enter.native="searchName"
                        />
                    </el-form-item>
                    <!-- 通用button样式 -->
                    <el-form-item>
                        <el-button
                            class="filter-item"
                            type="primary"
                            icon="el-icon-search"
                            @click="searchName"
                        ></el-button>
                    </el-form-item>
                    <el-form-item class="text-right">
                        <el-button class="filter-item" type="success" @click="openAdd">添加用户</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- table区 -->
            <div class="table-main">
                <el-table border :data="tableData">
                    <!-- 通用表格样式，porp对应每一列的属性值, label对应表头名称 -->
                    <el-table-column align="center" label="id" prop="id"></el-table-column>
                    <el-table-column align="center" label="账户名" prop="name"></el-table-column>
                    <el-table-column align="center" label="姓名" prop="real_name"></el-table-column>
                    <el-table-column align="center" label="角色" prop="actorStr"></el-table-column>
                    <el-table-column align="center" label="状态" prop="statusStr"></el-table-column>
                    <el-table-column align="center" label="电话号码" prop="phone"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <!-- 如需要每行对应的操作按钮则添加template，slot自定义 -->
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)"
                            >编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 翻页器 -->
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
        </div>
        <!-- 弹层区 -->
        <el-dialog title="编辑用户信息" :visible.sync="editVisble" width="30%">
            <el-form label-position="right" label-width="120px" :model="selectUser">
                <el-form-item label="姓名">
                    <el-input class="form-input" disabled v-model="selectUser.name"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select class="form-input" v-model="selectUser.actor">
                        <el-option v-for="(i, t) in actors" :key="(i, t)" :label="i" :value="t"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="重置密码">
                    <el-input class="form-input" placeholder="如需修改请输入新密码" v-model="rePassword"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input class="form-input" placeholder="请输入电话号码" v-model="selectUser.phone"></el-input>
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
        <el-dialog title="新增用户信息" :visible.sync="addVisble" width="30%">
            <el-form
                label-position="right"
                label-width="120px"
                :model="addUser"
                class="dialog-form"
            >
                <el-form-item label="账号名">
                    <el-input class="form-input" v-model="addUser.name"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input class="form-input" v-model="addUser.real_name"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select class="form-input" v-model="addUser.actor" placeholder="请选择角色">
                        <el-option v-for="(i, t) in actors" :key="(i, t)" :label="i" :value="t"></el-option>
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
</template>
<script>
import { revoke } from '@/api/getApi'
import { AreaSelect } from '@/components/areaselect'
export default {
    name: 'UserList',
    components: { AreaSelect },
    data() {
        return {
            initArea: [0],
            // 地区选择插件单、复选开关
            area_multiple: true,
            // 地区选择插件是否分区
            isHasArea: true,
            status: [],
            tableData: [],
            actors: [],
            actor: 0,
            totalPage: 0,
            pageSize: 5,
            searchStr: '',
            currentPage: 1,
            editVisble: false,
            addVisble: false,
            rePassword: '',
            selectUser: {
                name: '',
                actor: '',
                status: '',
                password: '',
                phone: ''
            },
            addUser: {
                name: '',
                real_name: '',
                actor: '',
                password: '',
                phone: ''
            },
            areaList: []
        }
    },
    created() {
        this.selectOption()
    },
    mounted() {
        this.initList()
    },
    methods: {
        // 去让人编辑用户信息
        confirEdit() {
            let data = {
                id: this.selectUser.id,
                real_name: this.selectUser.real_name,
                phone: this.selectUser.phone,
                actor: this.selectUser.actor,
                status: this.selectUser.status
            }
            revoke('/index.php?m=user&p=edit', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false
                    this.$message({
                        message: '编辑成功！',
                        type: 'success'
                    })
                    let data = {
                        actor: this.actor,
                        name: this.searchStr,
                        page: this.currentPage,
                        pageNum: this.pageSize
                    }
                    this.getTableList(data)
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 初始化加载通用配置
        selectOption() {
            let data = {}
            revoke('/index.php?m=config&p=user', data).then(res => {
                if (res.code === 0) {
                    this.actors = res.data.actor
                    this.status = res.data.status
                }
            })
        },
        // 初始化表格
        initList() {
            let self = this
            let data = {
                actor: this.actor,
                name: '',
                page: self.currentPage,
                pageNum: self.pageSize
            }
            revoke('/index.php?m=user&p=lists', data).then(res => {
                if (res.code === 0) {
                    let tableData = res.data.list
                    for (let i in tableData) {
                        tableData[i].actorStr =
                            self.actors[Number(tableData[i].actor)]
                        tableData[i].statusStr =
                            self.status[Number(tableData[i].status)]
                    }
                    self.tableData = tableData
                    self.totalPage = res.data.total
                }
            })
            let data1 = {}
            revoke('/index.php?m=system&p=init', data1).then(res => {
                if (res.code === 0) {
                    console.log(data1)
                }
            })
        },
        // 获取表格信息
        getTableList(data) {
            revoke('/index.php?m=user&p=lists', data).then(res => {
                if (res.code === 0) {
                    let tableData = res.data.list
                    for (let i in tableData) {
                        tableData[i].actorStr = this.actors[
                            Number(tableData[i].actor)
                        ]
                        tableData[i].statusStr = this.status[
                            Number(tableData[i].status)
                        ]
                    }
                    this.tableData = tableData
                    this.totalPage = res.data.total
                }
            })
        },
        // 编辑用户信息
        handleEdit(index, row) {
            this.editVisble = true
            this.selectUser.id = row.id
            this.selectUser.phone = row.phone
            this.selectUser.password = this.rePassword
            this.selectUser.real_name = row.real_name
            this.selectUser.name = row.real_name + '(' + row.name + ')'
            this.selectUser.actor = parseInt(row.actor, 10)
            this.selectUser.status = parseInt(row.status, 10)
        },
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val
            let data = {
                actor: this.actor,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.getTableList(data)
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val
            let data = {
                actor: this.actor,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.getTableList(data)
        },
        // 搜索
        searchName() {
            let data = {
                actor: this.actor,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.getTableList(data)
        },
        // 新增用户弹出
        openAdd() {
            this.addVisble = true
        },
        // 新增用户确认提交
        confirAdd() {
            revoke('/index.php?m=user&p=add', this.addUser).then(res => {
                if (res.code === 0) {
                    this.addVisble = false
                    this.$message({
                        message: '新增用户成功！',
                        type: 'success'
                    })
                    let data = {
                        actor: this.actor,
                        name: this.searchStr,
                        page: this.currentPage,
                        pageNum: this.pageSize
                    }
                    this.getTableList(data)
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 绑定选择后的地区选项值
        selectArea(array) {
            this.areaList = array
        }
    }
}
</script>

<style lang="scss" scoped>
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

