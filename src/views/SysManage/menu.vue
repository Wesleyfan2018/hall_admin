<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="菜单管理"></el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @click="openAdd">添加菜单</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id"></el-table-column>
                <el-table-column align="center" label="名称" prop="name"></el-table-column>
                <el-table-column align="center" label="路径" prop="path"></el-table-column>
                <el-table-column align="center" label="路径标识" prop="path_name"></el-table-column>
                <el-table-column align="center" label="icon" prop="icon"></el-table-column>
                <el-table-column align="center" label="序号" prop="sort"></el-table-column>
                <el-table-column align="center" label="所属游戏" prop="game_names"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="dialog_div">
            <el-dialog
                title="编辑菜单信息"
                :visible.sync="editVisble"
                width="30%"
                :before-close="handleEditClose"
            >
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="名称">
                        <el-input class="form-input" v-model="selectData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="路径">
                        <el-input class="form-input" v-model="selectData.path"></el-input>
                    </el-form-item>
                    <el-form-item label="路径标识">
                        <el-input class="form-input" v-model="selectData.path_name"></el-input>
                    </el-form-item>
                    <el-form-item label="图标">
                        <el-input class="form-input" v-model="selectData.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="序号">
                        <el-input class="form-input" v-model="selectData.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="入口点">
                        <el-select v-model="selectData.entry_point" placeholder="请选择">
                            <el-option
                                v-for="(t,i) in entryPoints"
                                :key="i"
                                :label="t.title"
                                :value="i"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="父菜单">
                        <el-select v-model="usepid" placeholder="请选择">
                            <el-option
                                v-for="item in pMenus"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属游戏">
                        <el-checkbox-group v-model="useproject">
                            <el-checkbox
                                v-for="v in this.projects"
                                :label="v.id"
                                :key="v.id"
                            >{{v.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="新增菜单信息"
                :visible.sync="addVisble"
                width="30%"
                :before-close="handleAddClose"
            >
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="名称">
                        <el-input class="form-input" v-model="addData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="路径">
                        <el-input class="form-input" v-model="addData.path"></el-input>
                    </el-form-item>
                    <el-form-item label="路径标识">
                        <el-input class="form-input" v-model="addData.path_name"></el-input>
                    </el-form-item>
                    <el-form-item label="图标">
                        <el-input class="form-input" v-model="addData.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="序号">
                        <el-input class="form-input" v-model="addData.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="入口点">
                        <el-select v-model="addData.entry_point" placeholder="请选择">
                            <el-option
                                v-for="(t,i) in entryPoints"
                                :key="i"
                                :label="t.title"
                                :value="i"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="父菜单">
                        <el-select v-model="addData.pid" placeholder="请选择">
                            <el-option
                                v-for="item in pMenus"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属游戏">
                        <el-checkbox-group v-model="addData.project">
                            <el-checkbox
                                v-for="v in this.projects"
                                :label="v.id"
                                :key="v.id"
                            >{{v.name}}</el-checkbox>
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
            pMenus: [], // 父菜单
            usepid: 0,
            projects: [],
            useproject: [],
            editVisble: false,
            addVisble: false,
            selectData: {
                name: '',
                path: '',
                path_name: '',
                entry_point: '',
                icon: '',
                project: [],
                sort: ''
            },
            addData: {
                name: '',
                path: '',
                path_name: '',
                icon: '',
                entry_point: '',
                project: [],
                pid: '0',
                sort: ''
            },
            // 入口点判断
            entryPoints: {},
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
                path: this.selectData.path,
                path_name: this.selectData.path_name,
                entry_point: this.selectData.entry_point,
                icon: this.selectData.icon,
                sort: this.selectData.sort,
                pid: this.usepid,
                project: JSON.stringify(this.useproject)
            };
            console.log(data);
            revoke('/index.php?m=menu&p=edit', data).then(res => {
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
            let data = { 'isRoot': 0 };
            revoke('/index.php?m=menu&p=config', data).then(res => {
                console.log(res);
                if (res.code === 0) {
                    this.pMenus = res.data.list;
                    this.pMenus.push({ id: '0', name: '无' });
                    this.projects = res.data.projects;
                    this.entryPoints = res.data.entryPoints;
                }
            });
        },
        initList() {
            this.getTableList();
        },
        getTableList() {
            let data = {};
            revoke('/index.php?m=menu&p=getMenus', data).then(res => {
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
            this.selectData.path = row.path;
            this.selectData.path_name = row.path_name;
            this.selectData.entry_point = row.entry_point;
            this.selectData.icon = row.icon;
            this.selectData.sort = row.sort;
            this.selectData.name = row.name;
            this.usepid = row.pid;
            this.useproject = JSON.parse(row.project);
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
            data.project =
                typeof this.addData.project === 'string'
                    ? this.addData.project
                    : JSON.stringify(this.addData.project);
            revoke('/index.php?m=menu&p=add', data).then(res => {
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
