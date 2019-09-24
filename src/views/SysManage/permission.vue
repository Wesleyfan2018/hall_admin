<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="权限配置">
                </el-form-item>
                <el-form-item class="text-right">
                     <el-button class="filter-item" type="success"  @click="genConf">生成配置文件</el-button>
                    <el-button class="filter-item" type="success"  @click="openAdd">添加权限</el-button>

                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id">
                </el-table-column>
                <el-table-column align="center" label="名称" prop="name">
                </el-table-column>
                <el-table-column align="center" label="权限标识" prop="perm">
                </el-table-column>
                <el-table-column align="center" label="菜单" prop="menu">
                </el-table-column>
                <el-table-column align="center" label="api(|分割)" prop="apis">
                </el-table-column>

                <el-table-column align="center" label="所属组" prop="GroupName">
                </el-table-column>
                <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="dialog_div">
            <el-dialog title="编辑菜单信息" :visible.sync="editVisble" width="30%" :before-close="handleEditClose">
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="名称">
                        <el-input class="form-input"  v-model="selectData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="权限标识">
                        <el-input class="form-input"  v-model="selectData.perm"></el-input>
                    </el-form-item>
                     <el-form-item label="菜单">
                        <el-input class="form-input"  v-model="selectData.menu"></el-input>
                    </el-form-item>
                    <el-form-item label="api(|分割)">
                        <el-input class="form-input"  v-model="selectData.apis"></el-input>
                    </el-form-item>

                    <el-form-item label="根权限组">
                    <el-select v-model="usepid" placeholder="请选择">
                      <el-option
                        v-for="item in rPerm"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="新增" :visible.sync="addVisble" width="30%" :before-close="handleAddClose">
                 <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="名称">
                        <el-input class="form-input"  v-model="addData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="权限标识">
                        <el-input class="form-input"  v-model="addData.perm"></el-input>
                    </el-form-item>
                     <el-form-item label="菜单标识">
                        <el-input class="form-input"  v-model="addData.menu"></el-input>
                    </el-form-item>
                    <el-form-item label="api(|分割)">
                        <el-input class="form-input"  v-model="addData.apis"></el-input>
                    </el-form-item>

                    <el-form-item label="根权限组">
                    <el-select v-model="addData.pid" placeholder="请选择">
                      <el-option
                        v-for="item in rPerm"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
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
            rPerm: [], // 根权限
            usepid: '0',
            editVisble: false,
            addVisble: false,
            selectData: {
                name: '',
                perm: '',
                menu: '',
                apis: '',
            },
            addData: {
                name: '',
                perm: '',
                menu: '',
                pid: '0',
                apis: '',
            }
        };
    },
    created() {
        this.selectOption();
        this.getTableList();
    },

    methods: {
        confirEdit() {
            let data = {
                id: this.selectData.id,
                name: this.selectData.name,
                perm: this.selectData.perm,
                menu: this.selectData.menu,
                pid: this.usepid,
                apis: this.selectData.apis,
            };
            console.log(data);
            revoke('/index.php?m=permission&p=edit', data).then(res => {
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
            let data = {};
            revoke('/index.php?m=permission&p=rootPerm', data).then(res => {
                if (res.code === 0) {
                    this.rPerm = res.data.list;
                }
            });
        },

        getTableList() {
            let data = {};
            revoke('/index.php?m=permission&p=lists', data).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list;
                    for (let i in this.tableData) {
                        this.tableData[i]['GroupName'] = this.rPerm[this.tableData[i]['pid']] ? this.rPerm[this.tableData[i]['pid']]['name'] : '';
                    }

                }
            });
        },
        // 编辑用户信息
        handleEdit(index, row) {
            console.log(row);
            this.editVisble = true;
            this.selectData.id = row.id;
            this.selectData.perm = row.perm;
            this.selectData.menu = row.menu;
            this.selectData.apis = row.apis;
            this.selectData.name = row.name;
            this.usepid = row.pid;
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
            let data = this.addData;
            revoke('/index.php?m=permission&p=add', data).then(res => {
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
        },
        genConf() {
            let data = {};
            revoke('/index.php?m=permission&p=genConf', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: '生成成功！',
                        type: 'success'
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });

        },
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
    width: 100px;margin: 0 5px 10px 0;
}
.nav-input {
    width: 150px;margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width: 200px!important;
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
