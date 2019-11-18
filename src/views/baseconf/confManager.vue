<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="查询条件：">
                    <el-input v-model="search" placeholder="模糊搜索名称或标识" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" icon="el-icon-search" @click="doSearch">搜索</el-button>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @click="showAddView">添加</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="配置类型" prop="typeStr"></el-table-column>
                <el-table-column align="center" label="展现形式" prop="showTypeStr"></el-table-column>
                <el-table-column align="center" label="配置ID" prop="id"></el-table-column>
                <el-table-column align="center" label="配置标识" prop="name"></el-table-column>
                <el-table-column align="center" label="配置名称" prop="desc"></el-table-column>
                <el-table-column align="center" label="受影响因子" prop="factorStr"></el-table-column>
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
                    <el-form-item label="配置类型：">
                        <el-radio v-model="addData.type" label="1">全局配置</el-radio>
                        <el-radio v-model="addData.type" label="2">因子配置</el-radio>
                    </el-form-item>
                    <el-form-item label="展现形式：">
                        <el-radio v-model="addData.showType" label="1">单一配置</el-radio>
                        <el-radio v-model="addData.showType" label="2">列表配置</el-radio>
                    </el-form-item>
                    <el-form-item label="配置标识：">
                        <el-input class="form-input" v-model="addData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="配置名称：">
                        <el-input class="form-input" v-model="addData.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="配置因子：">
                        <el-checkbox-group v-model="addData.factor">
                            <el-checkbox label="productId">产品id</el-checkbox>
                            <el-checkbox label="channelId">渠道id</el-checkbox>
                            <el-checkbox label="provinceId">省份id</el-checkbox>
                            <el-checkbox label="cityId">城市id</el-checkbox>
                            <el-checkbox label="areaId">地区id</el-checkbox>
                            <el-checkbox label="bigVer">大版本</el-checkbox>
                            <el-checkbox label="smallVer">小版本</el-checkbox>
                            <el-checkbox label="gameId">游戏id</el-checkbox>
                        </el-checkbox-group>
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
                    <el-form-item label="配置类型：">
                        <el-radio v-model="editData.type" disabled label="1">全局配置</el-radio>
                        <el-radio v-model="editData.type" disabled label="2">因子配置</el-radio>
                    </el-form-item>
                    <el-form-item label="展现形式：">
                        <el-radio v-model="editData.showType" disabled label="1">单一配置</el-radio>
                        <el-radio v-model="editData.showType" disabled label="2">列表配置</el-radio>
                    </el-form-item>
                    <el-form-item label="配置标识：">
                        <el-input class="form-input" v-model="editData.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="配置名称：">
                        <el-input class="form-input" v-model="editData.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="配置因子：">
                        <el-checkbox-group v-model="editData.factor">
                            <el-checkbox label="productId">产品id</el-checkbox>
                            <el-checkbox label="channelId">渠道id</el-checkbox>
                            <el-checkbox label="provinceId">省份id</el-checkbox>
                            <el-checkbox label="cityId">城市id</el-checkbox>
                            <el-checkbox label="areaId">地区id</el-checkbox>
                            <el-checkbox label="bigVer">大版本</el-checkbox>
                            <el-checkbox label="smallVer">小版本</el-checkbox>
                            <el-checkbox label="gameId">游戏id</el-checkbox>
                        </el-checkbox-group>
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
            search: '',
            showViewVar: false,
            showEditViewVar: false,
            props: {
                label: 'name',
                children: 'child'
            },
            addData: {
                type: '2',
                showType: '1',
                name: '',
                desc: '',
                factor: []
            },
            editData: {
                id: 0,
                type: '2',
                showType: '1',
                name: '',
                desc: '',
                factor: []
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
                pageNum: this.pageSize,
                search: this.search
            }
            revoke('/index.php?m=configmanager&p=getList', args).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                }
            })
        },
        confirAdd() {
            revoke('/index.php?m=configmanager&p=add', this.addData).then(
                res => {
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
                }
            )
        },
        hiddenEditView() {
            this.showEditViewVar = false
        },
        handleEdit(index, row) {
            this.editData.id = row.id
            this.editData.type = row.type + ''
            this.editData.showType = row.showType + ''
            this.editData.name = row.name
            this.editData.desc = row.desc
            if (row.factor != '') {
                this.editData.factor = row.factor
            }
            this.showEditViewVar = true
        },
        submitEdit() {
            revoke('/index.php?m=configmanager&p=edit', this.editData).then(
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
</style>
