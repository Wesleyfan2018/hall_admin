<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="兑换商城tag">
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success"  @click="openAdd">添加配置</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="subkey">
                </el-table-column>
                <el-table-column align="center" label="tag名称" prop="name">
                </el-table-column>
     、
                <el-table-column align="center" label="icon" prop="icon">
                </el-table-column>
                <el-table-column align="center" label="序号" prop="sort">
                </el-table-column>
                <el-table-column align="center" label="是否开放(1开发/2关闭)" prop="isOpen">
                </el-table-column>

                <el-table-column align="center" label="数据状态(1开发/2关闭/3废弃)" prop="isOpen">
                </el-table-column>
                <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="dialog_div">
            <el-dialog title="编辑菜单信息" :visible.sync="editVisble" width="30%" :before-close="handleEditClose" :closeOnClickModal='clickclose'>
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="名称">
                        <el-input class="form-input"  v-model="selectData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="图标">
                        <el-input class="form-input"  v-model="selectData.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="序号">
                        <el-input class="form-input"  v-model="selectData.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="开放状态">
                      <el-radio v-model="selectData.isOpen" label="1">开放</el-radio>
                      <el-radio v-model="selectData.isOpen" label="0">关闭</el-radio>
                    </el-form-item>
                    <el-form-item label="数据状态">
                     <el-select v-model="selectData.status" placeholder="请选择">
                        <el-option
                          v-for="item in dataStatus"
                          :key="item.v"
                          :label="item.v"
                          :value="item.k">
                        </el-option>
                      </el-select>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="新增菜单信息" :visible.sync="addVisble" width="30%" :before-close="handleAddClose">
                 <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="名称">
                        <el-input class="form-input"  v-model="addData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="图标">
                        <el-input class="form-input"  v-model="addData.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="序号">
                        <el-input class="form-input"  v-model="addData.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="开放状态">
                      <el-radio v-model="addData.isOpen" label="1">开放</el-radio>
                      <el-radio v-model="addData.isOpen" label="0">关闭</el-radio>
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
            clickclose: false,
            tableData: [],
            dataStatus: [],
            editVisble: false,
            addVisble: false,
            selectData: {
                name: '',
                icon: '',
                sort: '',
                isOpen: '',
                status: '',
            },
            addData: {
                name: '',
                icon: '',
                sort: '',
                isOpen: '',
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
                icon: this.selectData.icon,
                sort: this.selectData.sort,
                isOpen: this.selectData.isOpen,
                status: this.selectData.status,
            };
            console.log(data);
            revoke('/index.php?m=exchangetag&p=edit', data).then(res => {
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
            revoke('/index.php?m=CommConf&p=getConf', data).then(res => {
                console.log(res);
                if (res.code === 0) {
                    this.dataStatus = res.data.status;
                }
            });
        },
        initList() {
            this.getTableList();
        },
        getTableList() {
            let data = {};
            revoke('/index.php?m=exchangetag&p=getLists', data).then(res => {
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
            this.selectData.id = row._id;
            this.selectData.icon = row.icon;
            this.selectData.sort = row.sort;
            this.selectData.name = row.name;
            this.selectData.isOpen = String(row.isOpen);
            this.selectData.status = parseInt(row._status, 10);
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
            revoke('/index.php?m=exchangeTag&p=add', this.addData).then(res => {
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
