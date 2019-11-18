<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="ID：">
                    <el-input
                        v-model="filterId"
                        placeholder="请输入ID"
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
                    >新增</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id"></el-table-column>
                <el-table-column align="center" label="ChannelID" prop="channelID"></el-table-column>
                <el-table-column align="center" label="Url_type" prop="url_type"></el-table-column>
                <el-table-column align="center" label="Content" prop="content"></el-table-column>
                <el-table-column align="center" label="Version" prop="version"></el-table-column>
                <el-table-column align="center" label="创建时间" prop="created_at"></el-table-column>
                <el-table-column align="center" label="修改时间" prop="updated_at"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="small"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <br />
                        <el-button
                            type="primary"
                            size="small"
                            style="margin-top:2px;"
                            @click="handleDel(scope.$index, scope.row)"
                        >删除</el-button>
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
                    <el-form-item label="ChannelID">
                        <el-input class="form-input" v-model="selectData.channelID"></el-input>
                    </el-form-item>

                    <el-form-item label="环境">
                        <el-select
                            class="form-input"
                            v-model="selectData.url_type"
                            placeholder="请选择环境"
                        >
                            <el-option
                                v-for="(i, t) in envs"
                                :key="(i.id, t)"
                                :label="i.name"
                                :value="i.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Content">
                        <el-input
                            class="form-input"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 10}"
                            v-model="selectData.content"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="Version">
                        <el-input
                            class="form-input"
                            placeholder="请输入Version"
                            v-model="selectData.version"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="新增"
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
                    <el-form-item label="ChannelID">
                        <el-input class="form-input" v-model="addData.channelID"></el-input>
                    </el-form-item>

                    <el-form-item label="环境">
                        <el-select
                            class="form-input"
                            v-model="addData.url_type"
                            placeholder="请选择环境"
                        >
                            <el-option
                                v-for="(i, t) in envs"
                                :key="(i.id, t)"
                                :label="i.name"
                                :value="i.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Content">
                        <el-input class="form-input" type="textarea" v-model="addData.content"></el-input>
                    </el-form-item>

                    <el-form-item label="Version">
                        <el-input
                            class="form-input"
                            placeholder="请输入Version"
                            v-model="addData.version"
                        ></el-input>
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
            tableData: [],
            channel_code: '0',
            totalPage: 0,
            pageSize: 10,
            filterId: '',
            currentPage: 1,
            envs: [
                { id: '1', name: 'dev' },
                { id: '2', name: 'test' },
                { id: '3', name: 'arraignment' },
                { id: '4', name: 'release' },
                { id: '5', name: 'production' }
            ],
            editVisble: false,
            addVisble: false,
            selectData: {
                channelID: '',
                content: '',
                version: '',
                url_type: ''
            },
            addData: {
                channelID: '',
                content: '',
                version: '',
                url_type: ''
            }
        }
    },

    mounted() {
        this.getTableList()
    },
    methods: {
        confirEdit() {
            let args = {
                id: this.selectData.id,
                channelID: this.selectData.channelID,
                content: this.selectData.content,
                version: this.selectData.version,
                url_type: this.selectData.url_type
            }

            let data = {
                callm: 'AppletVersion',
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
                    this.getTableList()
                } else {
                    this.$message.error(res.msg)
                }
            })
        },

        getTableList() {
            let args = {}
            args['id'] = this.filterId
            args['page'] = this.currentPage
            args['pageNum'] = this.pageSize

            let data = {
                callm: 'AppletVersion',
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
            this.selectData.channelID = row.channelID
            this.selectData.content = row.content
            this.selectData.version = row.version
            this.selectData.url_type = row.url_type
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
            let args = {
                channelID: this.addData.channelID,
                content: this.addData.content,
                version: this.addData.version,
                url_type: this.addData.url_type
            }

            let data = {
                callm: 'AppletVersion',
                callp: 'add',
                args: JSON.stringify(args)
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
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
        },
        handleDel(index, row) {
            this.popVisble = false
            this.$confirm('确认删除该条数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.delData(row.id)
                })
                .catch(() => {})
        },
        delData(id) {
            let args = {
                id: id
            }

            let data = {
                callm: 'AppletVersion',
                callp: 'del',
                args: JSON.stringify(args)
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: '删除成功！',
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
