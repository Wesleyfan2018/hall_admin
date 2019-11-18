<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @click="showAddView">添加</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="渠道id" prop="id"></el-table-column>
                <el-table-column align="center" label="渠道名称" prop="name"></el-table-column>
                <el-table-column align="center" label="客户端类型" prop="clientStr"></el-table-column>
                <el-table-column align="center" label="状态" prop="statusStr"></el-table-column>
                <el-table-column align="center" label="更新时间" prop="upTimeStr"></el-table-column>
                <el-table-column align="center" label="更新人" prop="upUserStr"></el-table-column>
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
                title="添加"
                :visible.sync="showViewVar"
                width="50%"
                :before-close="hiddenAddView"
            >
                <el-form label-position="right" label-width="120px" :model="addData">
                    <el-form-item label="客户端类型：">
                        <el-radio v-model="addData.client" label="1">Android</el-radio>
                        <el-radio v-model="addData.client" label="2">Ios</el-radio>
                    </el-form-item>
                    <el-form-item label="渠道id：">
                        <el-input class="form-input" v-model="addData.id"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道名称：">
                        <el-input class="form-input" v-model="addData.name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="hiddenAddView">取 消</el-button>
                    <el-button type="success" @click="confirAdd">添 加</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="编辑"
                :visible.sync="showEditViewVar"
                width="50%"
                :before-close="hiddenEditView"
            >
                <el-form label-position="right" label-width="120px" :model="editData">
                    <el-form-item label="客户端类型：">
                        <el-radio v-model="editData.client" label="1">Android</el-radio>
                        <el-radio v-model="editData.client" label="2">Ios</el-radio>
                    </el-form-item>
                    <el-form-item label="渠道id：">
                        <el-input class="form-input" v-model="editData.id"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道名称：">
                        <el-input class="form-input" v-model="editData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-radio v-model="editData.status" label="0">正常</el-radio>
                        <el-radio v-model="editData.status" label="1">删除</el-radio>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="hiddenEditView">取 消</el-button>
                    <el-button type="success" @click="submitEdit">保 存</el-button>
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
            tableData: [],
            totalPage: 0,
            pageSize: 10,
            currentPage: 1,
            showViewVar: false,
            showEditViewVar: false,
            props: {
                label: 'name',
                children: 'child'
            },
            addData: {
                client: '1',
                name: '',
                id: ''
            },
            editData: {
                id: '',
                client: '1',
                name: '',
                status: '0'
            }
        }
    },
    mounted() {
        this.initList()
    },
    methods: {
        initList() {
            this.getTableList()
        },
        hiddenAddView(done) {
            this.showViewVar = false
        },
        showAddView() {
            this.showViewVar = true
        },
        getTableList() {
            let args = {
                page: this.currentPage,
                pageNum: this.pageSize
            }
            revoke('/index.php?m=confchannel&p=getList', args).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                }
            })
        },
        confirAdd() {
            revoke('/index.php?m=confchannel&p=add', this.addData).then(res => {
                if (res.code === 0) {
                    this.showViewVar = false
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
        hiddenEditView() {
            this.showEditViewVar = false
        },
        handleEdit(index, row) {
            this.editData._id = row._id
            this.editData.id = row.id
            this.editData.client = row.client + ''
            this.editData.name = row.name
            this.editData.status = row.status + ''
            this.showEditViewVar = true
        },
        submitEdit() {
            revoke('/index.php?m=confchannel&p=edit', this.editData).then(
                res => {
                    if (res.code === 0) {
                        this.showEditViewVar = false
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
        doSearch() {
            this.getTableList()
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
.delete-row {
    text-decoration: line-through;
    color: #aaaaaa;
}
</style>
