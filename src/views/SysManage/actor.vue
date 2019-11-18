<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="角色管理"></el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @click="openAdd">添加角色</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id"></el-table-column>
                <el-table-column align="center" label="角色名称" prop="name"></el-table-column>
                <el-table-column align="center" label="权限" prop="permlist"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="dialog_div">
            <el-dialog
                title="编辑角色信息"
                :visible.sync="editVisble"
                width="60%"
                :before-close="handleEditClose"
            >
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="姓名">
                        <el-input class="form-input" v-model="selectData.name"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="权限">
                        <el-checkbox-group  v-model="usepermission">
                        <el-checkbox v-for="v in permission"  :label="v.id" :key="v.id">{{v.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>-->
                    <!-- 权限 -->
                    <el-form-item label="权限" class="permission_settings">
                        <el-checkbox-group v-model="usepermission">
                            <div class="group" v-for="item in permission" :key="item.id">
                                <h2>{{item.name}}</h2>
                                <el-checkbox
                                    v-for="v in item.children"
                                    :label="v.id"
                                    :key="v.id"
                                >{{v.name}}</el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="新增角色信息"
                :visible.sync="addVisble"
                width="60%"
                :before-close="handleAddClose"
            >
                <el-form
                    label-position="right"
                    label-width="120px"
                    :model="addData"
                    class="dialog-form"
                >
                    <el-form-item label="角色名称">
                        <el-input class="form-input" v-model="addData.name"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="权限">
                        <el-checkbox-group  v-model="addData.permission">
                        <el-checkbox v-for="v in permission"  :label="v.id" :key="v.id">{{v.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>-->
                    <el-form-item label="权限" class="permission_settings">
                        <el-checkbox-group v-model="addData.permission">
                            <div class="group" v-for="item in permission" :key="item.id">
                                <h2>{{item.name}}</h2>
                                <el-checkbox
                                    v-for="v in item.children"
                                    :label="v.id"
                                    :key="v.id"
                                >{{v.name}}</el-checkbox>
                            </div>
                        </el-checkbox-group>
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
import { revoke } from '@/api/getApi';
export default {
    name: 'actor',
    data() {
        return {
            tableData: [],
            permission: [], // 权限
            usepermission: [], // 已有权限
            editVisble: false,
            addVisble: false,
            selectData: {
                name: '',
                permission: ''
            },
            addData: {
                name: '',
                permission: []
            }
        };
    },
    created() {
        this.selectOption();
    },
    mounted() {
        this.initList();
    },
    methods: {
        confirEdit() {
            let data = {
                id: this.selectData.id,
                name: this.selectData.name,
                permission: this.usepermission.join(',')
            };
            revoke('/index.php?m=actor&p=edit', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.$message({
                        message: '编辑成功！',
                        type: 'success'
                    });
                    this.getTableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        selectOption() {
            let data = { permGroup: 1 };
            revoke('/index.php?m=config&p=user', data).then(res => {
                console.log(res);
                if (res.code === 0) {
                    this.actors = res.data.actor;
                    this.status = res.data.status;
                    this.permission = res.data.permission;
                }
            });
        },
        initList() {
            this.getTableList();
        },
        getTableList() {
            let data = {};
            revoke('/index.php?m=actor&p=getActors', data).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list;
                }
            });
        },
        // 编辑用户信息
        handleEdit(index, row) {
            console.log(row);
            this.editVisble = true;
            this.selectData.id = row.id;
            this.usepermission = row.permission.split(','); // 逗号切割
            this.selectData.name = row.name;
        },

        // 弹出框close
        handleEditClose(done) {
            this.editVisble = false;
        },
        // 弹出框close
        handleAddClose(done) {
            this.addVisble = false;
        },
        openAdd() {
            this.addVisble = true;
        },
        confirAdd() {
            this.addData.permission = this.addData.permission.join(',');
            revoke('/index.php?m=actor&p=add', this.addData).then(res => {
                if (res.code === 0) {
                    this.addVisble = false;
                    this.$message({
                        message: '新增成功！',
                        type: 'success'
                    });
                    this.getTableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        }
    }
};
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

.permission_settings {
    > .el-form-item__content {
        border: 1px solid #ebeef5;
    }
    h2 {
        font-size: 14px;
        color: #666;
        background: #f0f2f5;
        text-indent: 1rem;
    }
    .el-checkbox {
        margin-left: 10px;
    }
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
